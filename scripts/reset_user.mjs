import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8').split('\n').reduce((acc, line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) acc[match[1]] = match[2];
  return acc;
}, {});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const userEmail = 'nozapp.commercial@gmail.com';

async function reset() {
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const targetUser = users.find(u => u.email === userEmail);

  if (!targetUser) {
    console.error('User not found');
    return;
  }

  const userId = targetUser.id;
  console.log('Resetting user:', userId);

  // 1. Delete pillars
  await supabase.from('user_pillars').delete().eq('user_id', userId);
  console.log('Pillars deleted.');

  // 2. Delete onboarding results
  await supabase.from('user_onboarding_results').delete().eq('user_id', userId);
  console.log('Results deleted.');

  // 3. Reset onboarding_complete flag
  await supabase.from('users').update({ onboarding_complete: false }).eq('id', userId);
  console.log('Onboarding status reset to false.');

  console.log('RESET COMPLETE. You can now restart onboarding.');
}
reset();

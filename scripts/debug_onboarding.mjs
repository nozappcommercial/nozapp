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

async function debug() {
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
  const testUser = users.find(u => u.email === 'nozapp.commercial@gmail.com');
  
  if (!testUser) {
    console.log("User not found via admin API, trying login...");
    const { data: signin, error: signinError } = await supabase.auth.signInWithPassword({
        email: 'nozapp.commercial@gmail.com',
        password: 'Ab0@98ef'
    });
    if (signinError) return console.error(signinError);
    var targetUser = signin.user;
  } else {
    var targetUser = testUser;
  }

  console.log('--- USER INFO ---');
  console.log('ID:', targetUser.id);
  
  const { data: pillars } = await supabase.from('user_pillars').select('*').eq('user_id', targetUser.id);
  console.log('\n--- USER PILLARS ---');
  console.log(JSON.stringify(pillars, null, 2));

  const { data: results } = await supabase.from('user_onboarding_results').select('*').eq('user_id', targetUser.id).single();
  console.log('\n--- ONBOARDING RESULTS JSON ---');
  console.log(JSON.stringify(results?.result || {}, null, 2));
}
debug();

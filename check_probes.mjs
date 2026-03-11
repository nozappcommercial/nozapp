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

async function check() {
  const { count, error } = await supabase
    .from('films')
    .select('*', { count: 'exact', head: true })
    .eq('is_onboarding_probe', true);
    
  if (error) console.error(error);
  else {
    console.log('Total onboarding probes:', count);
    const { data: groups } = await supabase.from('films').select('onboarding_group').eq('is_onboarding_probe', true);
    const groupCounts = groups.reduce((acc, f) => {
      acc[f.onboarding_group] = (acc[f.onboarding_group] || 0) + 1;
      return acc;
    }, {});
    console.log('Group counts:', groupCounts);
  }
}
check();

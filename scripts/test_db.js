require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  console.log('Logging in user...');
  const { data: auth, error: loginErr } = await supabase.auth.signInWithPassword({
    email: 'nozapp.commercial@gmail.com',
    password: 'Ab0@98ef'
  });
  
  if (loginErr) {
    console.log('Login error:', loginErr.message);
    return;
  }
  const user = auth.session.user;
  console.log('User ID:', user.id);
  
  console.log('Checking public profile...');
  const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single();
  console.log('Profile:', profile);

  console.log('Checking films...');
  const { data: films } = await supabase.from('films').select('id, title').limit(5);
  console.log('Found films:', films.length);

  // Attempt the exact API route manual logic
  const pillars = [{ film_id: 1, rank: 1 }]; // ID 1 might not exist if they are UUIDs! Wait, in dataset_schema film.id is INTEGER. Let's list ids.
  console.log('Sample film IDs:', films.map(f => f.id));
}
check();

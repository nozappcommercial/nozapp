require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testApi() {
  console.log('Logging in...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'nozapp.commercial@gmail.com',
    password: 'Ab0@98ef'
  });

  if (authError) {
    console.error('Auth error:', authError.message);
    return;
  }
  
  console.log('User ID:', authData.session.user.id);
  const token = authData.session.access_token;

  const payload = {
    pillars: [
      { filmId: 1, rank: 1, title: 'Test Film 1' },
      { filmId: 2, rank: 2, title: 'Test Film 2' }
    ],
    reactions: [
      { filmId: 3, reaction: 'loved' }
    ],
    timestamp: new Date().toISOString()
  };

  console.log('Calling API...');
  const res = await fetch('http://localhost:3002/api/onboarding/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // The API route uses createServerClient which relies on cookies.
      // We'll pass the token in the Cookie header.
      'Cookie': `sb-${new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname.split('.')[0]}-auth-token=${encodeURIComponent(JSON.stringify([authData.session.access_token, authData.session.refresh_token, null, null, null]))}`
    },
    body: JSON.stringify(payload)
  });

  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Response:', text);
}

testApi();

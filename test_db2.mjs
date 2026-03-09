import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8').split('\n').reduce((acc, line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) acc[match[1]] = match[2];
  return acc;
}, {});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDb() {
  const { data: { user }, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'nozapp.commercial@gmail.com',
    password: 'Ab0@98ef'
  });
  if (authErr) return console.error('Auth Err:', authErr.message);

  // Get real film IDs
  const { data: films } = await supabase.from('films').select('id').eq('is_onboarding_probe', true).limit(5);

  const pillarsRows = [
    { user_id: user.id, film_id: films[0].id, rank: 1 }
  ];

  console.log('Inserting Pillar...');
  const { error: pillarError } = await supabase.from('user_pillars').insert(pillarsRows);
  if (pillarError) {
     console.error("Error inserting pillars:", pillarError);
  } else {
     console.log("Pillars inserted successfully!");
  }

  // Check JSON Upsert
  const resultJson = { test: true };
  console.log('Inserting Onboarding JSON Result...');
  const { error: resultError } = await supabase.from("user_onboarding_results").upsert({
      user_id: user.id,
      result: resultJson,
  }, { onConflict: "user_id" });

  if (resultError) {
      console.error("Error saving onboarding result:", resultError);
  } else {
      console.log("JSON Upsert inserted successfully!");
  }


  // Check Update
  console.log('Updating user profile...');
  const { error: updateError } = await supabase.from("users").update({ onboarding_complete: true }).eq("id", user.id);
  if (updateError) {
      console.error("Error updating user:", updateError);
  } else {
      console.log("User updated successfully!");
  }

}
checkDb();

/**
 * Alfaaz — Classical Shayari Seed Runner (Node.js)
 * Usage: node supabase/seed/run-seed.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.join(__dirname, '..', '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseKey = keyMatch ? keyMatch[1].trim() : '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSeed() {
  console.log('Seeding Classical Shayari to Supabase:', supabaseUrl);
  const jsonPath = path.join(__dirname, 'classical_shayari.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  console.log(`Found ${data.length} classical poet groups.`);
  console.log('NOTE: For 100% full RLS bypass without service key, run supabase/seed/seed_classical_shayari.sql directly in the Supabase SQL Editor!');
}

runSeed();

const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'supabase', 'seed', 'classical_shayari.json');
const outputPath = path.join(__dirname, '..', 'supabase', 'seed', 'seed_classical_shayari.sql');

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

let sql = `-- ==============================================================================
-- ALFAAZ — CLASSICAL SHAYARI DATABASE SEED SCRIPT
-- Public Domain Masters: Ghalib, Mir, Iqbal, Daagh, Zauq, Zafar (60+ years post death)
-- Run this directly in Supabase SQL Editor!
-- ==============================================================================

-- 1. Relax foreign key on users table so classical curated accounts can exist
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- 2. Add search_vector index if not exists
CREATE INDEX IF NOT EXISTS posts_search_idx ON posts USING GIN(search_vector);

`;

for (const group of data) {
  const p = group.poet;
  const badgesArray = p.badges.map(b => `'${b}'`).join(', ');
  
  sql += `
-- Poet: ${p.takhallus}
INSERT INTO users (id, username, takhallus, bio, avatar_url, role, badges, counters)
VALUES (
  '${p.id}',
  '${p.username}',
  '${p.takhallus.replace(/'/g, "''")}',
  '${p.bio.replace(/'/g, "''")}',
  '${p.avatar_url}',
  'user',
  ARRAY[${badgesArray}],
  '{"posts": ${group.posts.length}, "followers": ${Math.floor(Math.random() * 800) + 400}, "following": 0}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  takhallus = EXCLUDED.takhallus,
  bio = EXCLUDED.bio,
  badges = EXCLUDED.badges;
`;

  for (const post of group.posts) {
    const linesJson = JSON.stringify(post.lines).replace(/'/g, "''");
    const tagsArray = post.tags.map(t => `'${t}'`).join(', ');
    const wah = Math.floor(Math.random() * 450) + 120;
    const irshad = Math.floor(Math.random() * 200) + 40;
    const mukarrar = Math.floor(Math.random() * 100) + 20;
    const dilSe = Math.floor(Math.random() * 600) + 250;
    const comments = Math.floor(Math.random() * 45) + 8;

    sql += `
INSERT INTO posts (author_id, type, language, script, title, lines, tags, mood, visibility, counters)
VALUES (
  '${p.id}',
  '${post.type}',
  '${post.language}',
  '${post.script}',
  '${post.title.replace(/'/g, "''")}',
  '${linesJson}'::jsonb,
  ARRAY[${tagsArray}],
  '${post.mood}',
  'public',
  '{"wah_wah": ${wah}, "irshad": ${irshad}, "mukarrar": ${mukarrar}, "dil_se": ${dilSe}, "comments": ${comments}, "shares": ${Math.floor(wah / 3)}, "saves": ${Math.floor(dilSe / 4)}}'::jsonb
);
`;
  }
}

sql += `
-- 3. Update search_vector for all newly inserted posts
UPDATE posts SET search_vector = 
  setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('simple', coalesce((select string_agg(l->>'text', ' ') from jsonb_array_elements(lines) as l), '')), 'B') ||
  setweight(to_tsvector('simple', coalesce(array_to_string(tags, ' '), '')), 'C')
WHERE search_vector IS NULL;
`;

fs.writeFileSync(outputPath, sql, 'utf8');
console.log('Successfully generated: ' + outputPath);

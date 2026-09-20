-- ==============================================================================
-- ALFAAZ — CLASSICAL SHAYARI DATABASE SEED SCRIPT
-- Public Domain Masters: Ghalib, Mir, Iqbal, Daagh, Zauq, Zafar (60+ years post death)
-- Run this directly in Supabase SQL Editor!
-- ==============================================================================

-- 1. Relax foreign key on users table so classical curated accounts can exist
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- 2. Add search_vector index if not exists
CREATE INDEX IF NOT EXISTS posts_search_idx ON posts USING GIN(search_vector);


-- Poet: मिर्ज़ा ग़ालिब (Ghalib)
INSERT INTO users (id, username, takhallus, bio, avatar_url, role, badges, counters)
VALUES (
  '11111111-0000-0000-0000-000000000001',
  'mirza_ghalib',
  'मिर्ज़ा ग़ालिब (Ghalib)',
  'Mirza Asadullah Khan Ghalib (1797–1869). The Mughal era maestro and emperor of Urdu & Persian ghazal.',
  '/classical/ghalib.jpg',
  'user',
  ARRAY['classical', 'shair_e_azam'],
  '{"posts": 7, "followers": 983, "following": 0}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  takhallus = EXCLUDED.takhallus,
  bio = EXCLUDED.bio,
  badges = EXCLUDED.badges;

INSERT INTO posts (author_id, type, language, script, title, lines, tags, mood, visibility, counters)
VALUES (
  '11111111-0000-0000-0000-000000000001',
  'sher',
  'urdu',
  'devanagari',
  'हज़ारों ख़्वाहिशें ऐसी',
  '[{"number":1,"text":"हज़ारों ख़्वाहिशें ऐसी कि हर ख़्वाहिश पे दम निकले"},{"number":2,"text":"बहुत निकले मिरे अरमान लेकिन फिर भी कम निकले"},{"number":3,"text":"ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے"},{"number":4,"text":"بہت نکلے مرے ارمان لیکن پھر بھی کم نکلے"}]'::jsonb,
  ARRAY['#ghalib', '#ishq', '#zindagi', '#classical', '#khwahish'],
  'zindagi',
  'public',
  '{"wah_wah": 470, "irshad": 94, "mukarrar": 45, "dil_se": 775, "comments": 26, "shares": 156, "saves": 193}'::jsonb
);

INSERT INTO posts (author_id, type, language, script, title, lines, tags, mood, visibility, counters)
VALUES (
  '11111111-0000-0000-0000-000000000001',
  'sher',
  'urdu',
  'devanagari',
  'इश्क़ पर ज़ोर नहीं',
  '[{"number":1,"text":"इश्क़ पर ज़ोर नहीं है ये वो आतश ''ग़ालिब''"},{"number":2,"text":"कि लगाए न लगे और बुझाए न बने"},{"number":3,"text":"عشق پر زور نہیں ہے یہ وہ آتش غالبؔ"},{"number":4,"text":"کہ لگائے نہ لگے اور بجھائے نہ بنے"}]'::jsonb,
  ARRAY['#ghalib', '#ishq', '#aag', '#classical'],
  'ishq',
  'public',
  '{"wah_wah": 167, "irshad": 173, "mukarrar": 59, "dil_se": 562, "comments": 37, "shares": 55, "saves": 140}'::jsonb
);

INSERT INTO posts (author_id, type, language, script, title, lines, tags, mood, visibility, counters)
VALUES (
  '11111111-0000-0000-0000-000000000001',
  'sher',
  'urdu',
  'devanagari',
  'दिल-ए-नादाँ तुझे हुआ क्या है',
  '[{"number":1,"text":"दिल-ए-नादाँ तुझे हुआ क्या है"},{"number":2,"text":"आख़िर इस दर्द की दवा क्या है"},{"number":3,"text":"دلِ ناداں تجھے ہوا کیا ہے"},{"number":4,"text":"آخر اس درد کی دوا کیا ہے"}]'::jsonb,
  ARRAY['#ghalib', '#dard', '#tanhai', '#classical'],
  'tanhai',
  'public',
  '{"wah_wah": 498, "irshad": 61, "mukarrar": 78, "dil_se": 846, "comments": 21, "shares": 166, "saves": 211}'::jsonb
);

INSERT INTO posts (author_id, type, language, script, title, lines, tags, mood, visibility, counters)
VALUES (
  '11111111-0000-0000-0000-000000000001',
  'sher',
  'urdu',
  'devanagari',
  'रंज से ख़ूगर हुआ इंसान',
  '[{"number":1,"text":"रंज से ख़ूगर हुआ इंसाँ तो मिट जाता है रंज"},{"number":2,"text":"मुश्किलें मुझ पर पड़ीं इतनी कि आसाँ हो गईं"},{"number":3,"text":"رنج سے خوگر ہوا انساں تو مٹ جاتا ہے رنج"},{"number":4,"text":"مشکلیں مجھ پر پڑیں اتنی کہ آساں ہو گئیں"}]'::jsonb,
  ARRAY['#ghalib', '#sabr', '#zindagi', '#classical'],
  'zindagi',
  'public',
  '{"wah_wah": 182, "irshad": 43, "mukarrar": 90, "dil_se": 304, "comments": 42, "shares": 60, "saves": 76}'::jsonb
);

INSERT INTO posts (author_id, type, language, script, title, lines, tags, mood, visibility, counters)
VALUES (
  '11111111-0000-0000-0000-000000000001',
  'sher',
  'urdu',
  'devanagari',
  'हम को मालूम है जन्नत की हक़ीक़त',
  '[{"number":1,"text":"हम को मालूम है जन्नत की हक़ीक़त लेकिन"},{"number":2,"text":"दिल के ख़ुश रखने को ''ग़ालिब'' ये ख़याल अच्छा है"},{"number":3,"text":"ہم کو معلوم ہے جنّت کی حقیقت لیکن"},{"number":4,"text":"دل کے خوش رکھنے کو غالبؔ یہ خیال اچھا ہے"}]'::jsonb,
  ARRAY['#ghalib', '#jannat', '#sufi', '#classical'],
  'sufi',
  'public',
  '{"wah_wah": 337, "irshad": 186, "mukarrar": 89, "dil_se": 333, "comments": 8, "shares": 112, "saves": 83}'::jsonb
);

INSERT INTO posts (author_id, type, language, script, title, lines, tags, mood, visibility, counters)
VALUES (
  '11111111-0000-0000-0000-000000000001',
  'sher',
  'urdu',
  'devanagari',
  'काबा किस मुँह से जाओगे ''ग़ालिब''',
  '[{"number":1,"text":"काबा किस मुँह से जाओगे ''ग़ालिब''"},{"number":2,"text":"शर्म तुम को मगर नहीं आती"},{"number":3,"text":"کعبہ کس منہ سے جاؤ گے غالبؔ"},{"number":4,"text":"شرم تم کو مگر نہیں آتی"}]'::jsonb,
  ARRAY['#ghalib', '#tanz', '#classical'],
  'mazaah',
  'public',
  '{"wah_wah": 140, "irshad": 208, "mukarrar": 81, "dil_se": 488, "comments": 25, "shares": 46, "saves": 122}'::jsonb
);

INSERT INTO posts (author_id, type, language, script, title, lines, tags, mood, visibility, counters)
VALUES (
  '11111111-0000-0000-0000-000000000001',
  'sher',
  'urdu',
  'devanagari',
  'इश्क़ ने ''ग़ालिब'' निकम्मा कर दिया',
  '[{"number":1,"text":"इश्क़ ने ''ग़ालिब'' निकम्मा कर दिया"},{"number":2,"text":"वर्ना हम भी आदमी थे काम के"},{"number":3,"text":"عشق نے غالبؔ نکما کر دیا"},{"number":4,"text":"ورنہ ہم بھی آدمی تھے کام کے"}]'::jsonb,
  ARRAY['#ghalib', '#ishq', '#classical'],
  'ishq',
  'public',
  '{"wah_wah": 499, "irshad": 149, "mukarrar": 95, "dil_se": 677, "comments": 28, "shares": 166, "saves": 169}'::jsonb
);

-- Poet: मीर तक़ी 'मीर' (Mir)
INSERT INTO users (id, username, takhallus, bio, avatar_url, role, badges, counters)
VALUES (
  '11111111-0000-0000-0000-000000000002',
  'mir_taqi_mir',
  'मीर तक़ी ''मीर'' (Mir)',
  'Mir Taqi Mir (1723–1810). Known as Khuda-e-Sukhan (God of Poetry), the pioneer of classic Delhi Ghazal.',
  '/classical/mir.jpg',
  'user',
  ARRAY['classical', 'khuda_e_sukhan'],
  '{"posts": 5, "followers": 885, "following": 0}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  takhallus = EXCLUDED.takhallus,
  bio = EXCLUDED.bio,
  badges = EXCLUDED.badges;

INSERT INTO posts (author_id, type, language, script, title, lines, tags, mood, visibility, counters)
VALUES (
  '11111111-0000-0000-0000-000000000002',
  'sher',
  'urdu',
  'devanagari',
  'पत्ता पत्ता बूटा बूटा',
  '[{"number":1,"text":"पत्ता पत्ता बूटा बूटा हाल हमारा जाने है"},{"number":2,"text":"जाने न जाने गुल ही न जाने बाग़ तो सारा जाने है"},{"number":3,"text":"پتہ پتہ بوٹا بوٹا حال ہمارا جانے ہے"},{"number":4,"text":"جانے نہ جانے گل ہی نہ جانے باغ تو سارا جانے ہے"}]'::jsonb,
  ARRAY['#mir', '#ishq', '#dilli', '#classical'],
  'ishq',
  'public',
  '{"wah_wah": 418, "irshad": 212, "mukarrar": 99, "dil_se": 459, "comments": 39, "shares": 139, "saves": 114}'::jsonb
);

INSERT INTO posts (author_id, type, language, script, title, lines, tags, mood, visibility, counters)
VALUES (
  '11111111-0000-0000-0000-000000000002',
  'sher',
  'urdu',
  'devanagari',
  'इब्तिदा-ए-इश्क़ है रोता है क्या',
  '[{"number":1,"text":"इब्तिदा-ए-इश्क़ है रोता है क्या"},{"number":2,"text":"आगे आगे देखिए होता है क्या"},{"number":3,"text":"ابتداؔئے عشق ہے روتا ہے کیا"},{"number":4,"text":"آگے آگے دیکھیے ہوتا ہے کیا"}]'::jsonb,
  ARRAY['#mir', '#ishq', '#ibtida', '#classical'],
  'judai',
  'public',
  '{"wah_wah": 128, "irshad": 237, "mukarrar": 30, "dil_se": 343, "comments": 47, "shares": 42, "saves": 85}'::jsonb
);

INSERT INTO posts (author_id, type, language, script, title, lines, tags, mood, visibility, counters)
VALUES (
  '11111111-0000-0000-0000-000000000002',
  'sher',
  'urdu',
  'devanagari',
  'दिखाई दिए यूँ कि बे-ख़ुद किया',
  '[{"number":1,"text":"दिखाई दिए यूँ कि बे-ख़ुद किया"},{"number":2,"text":"हमें आप से भी जुदा कर चले"},{"number":3,"text":"دکھائی دیے یوں کہ بے خود کیا"},{"number":4,"text":"ہمیں آپ سے بھی جدا کر چلے"}]'::jsonb,
  ARRAY['#mir', '#deedar', '#classical'],
  'ishq',
  'public',
  '{"wah_wah": 184, "irshad": 150, "mukarrar": 84, "dil_se": 817, "comments": 23, "shares": 61, "saves": 204}'::jsonb
);

INSERT INTO posts (author_id, type, language, script, title, lines, tags, mood, visibility, counters)
VALUES (
  '11111111-0000-0000-0000-000000000002',
  'sher',
  'urdu',
  'devanagari',
  'नाज़ुकी उस के लब की क्या कहिए',
  '[{"number":1,"text":"नाज़ुकी उस के लब की क्या कहिए"},{"number":2,"text":"पंखुड़ी इक गुलाब की सी है"},{"number":3,"text":"نازکی اس کے لب کی کیا کہیے"},{"number":4,"text":"پنکھڑی اک گلاب کی سی ہے"}]'::jsonb,
  ARRAY['#mir', '#husn', '#gulab', '#classical'],
  'ishq',
  'public',
  '{"wah_wah": 430, "irshad": 188, "mukarrar": 100, "dil_se": 821, "comments": 17, "shares": 143, "saves": 205}'::jsonb
);

INSERT INTO posts (author_id, type, language, script, title, lines, tags, mood, visibility, counters)
VALUES (
  '11111111-0000-0000-0000-000000000002',
  'sher',
  'urdu',
  'devanagari',
  'मीर'' अमदन भी कोई मरता है',
  '[{"number":1,"text":"''मीर'' अमदन भी कोई मरता है"},{"number":2,"text":"जान बूझे भी कोई जाता है"},{"number":3,"text":"میرؔ عمداً بھی کوئی مرتا ہے"},{"number":4,"text":"جان بوجھے بھی کوئی جاتا ہے"}]'::jsonb,
  ARRAY['#mir', '#dard', '#classical'],
  'tanhai',
  'public',
  '{"wah_wah": 458, "irshad": 98, "mukarrar": 89, "dil_se": 561, "comments": 13, "shares": 152, "saves": 140}'::jsonb
);

-- Poet: अल्लामा 'इक़बाल' (Iqbal)
INSERT INTO users (id, username, takhallus, bio, avatar_url, role, badges, counters)
VALUES (
  '11111111-0000-0000-0000-000000000003',
  'allama_iqbal',
  'अल्लामा ''इक़बाल'' (Iqbal)',
  'Sir Muhammad Iqbal (1877–1938). The visionary philosopher-poet, author of Bang-e-Dara and Shikwa.',
  '/classical/iqbal.jpg',
  'user',
  ARRAY['classical', 'mufakkir_e_mashriq'],
  '{"posts": 4, "followers": 851, "following": 0}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  takhallus = EXCLUDED.takhallus,
  bio = EXCLUDED.bio,
  badges = EXCLUDED.badges;

INSERT INTO posts (author_id, type, language, script, title, lines, tags, mood, visibility, counters)
VALUES (
  '11111111-0000-0000-0000-000000000003',
  'sher',
  'urdu',
  'devanagari',
  'सितारों से आगे जहाँ और भी हैं',
  '[{"number":1,"text":"सितारों से आगे जहाँ और भी हैं"},{"number":2,"text":"अभी इश्क़ के इम्तिहाँ और भी हैं"},{"number":3,"text":"ستاروں سے آگے جہاں اور بھی ہیں"},{"number":4,"text":"ابھی عشق کے امتحاں اور بھی ہیں"}]'::jsonb,
  ARRAY['#iqbal', '#khudi', '#sufi', '#classical'],
  'sufi',
  'public',
  '{"wah_wah": 554, "irshad": 150, "mukarrar": 105, "dil_se": 711, "comments": 49, "shares": 184, "saves": 177}'::jsonb
);

INSERT INTO posts (author_id, type, language, script, title, lines, tags, mood, visibility, counters)
VALUES (
  '11111111-0000-0000-0000-000000000003',
  'sher',
  'urdu',
  'devanagari',
  'ख़ुदी को कर बुलंद इतना',
  '[{"number":1,"text":"ख़ुदी को कर बुलंद इतना कि हर तक़दीर से पहले"},{"number":2,"text":"ख़ुदा बंदे से ख़ुद पूछे बता तेरी रज़ा क्या है"},{"number":3,"text":"خودی کو کر بلند اتنا کہ ہر تقدیر سے پہلے"},{"number":4,"text":"خدا بندے سے خود پوچھے بتا تیری رضا کیا ہے"}]'::jsonb,
  ARRAY['#iqbal', '#khudi', '#himmat', '#classical'],
  'sufi',
  'public',
  '{"wah_wah": 293, "irshad": 234, "mukarrar": 100, "dil_se": 662, "comments": 30, "shares": 97, "saves": 165}'::jsonb
);

INSERT INTO posts (author_id, type, language, script, title, lines, tags, mood, visibility, counters)
VALUES (
  '11111111-0000-0000-0000-000000000003',
  'sher',
  'urdu',
  'devanagari',
  'तू शाहीं है परवाज़ है काम तेरा',
  '[{"number":1,"text":"तू शाहीं है परवाज़ है काम तेरा"},{"number":2,"text":"तिरे सामने आसमाँ और भी हैं"},{"number":3,"text":"تو شاہیں ہے پرواز ہے کام تیرا"},{"number":4,"text":"ترے سامنے آسماں اور بھی ہیں"}]'::jsonb,
  ARRAY['#iqbal', '#shaheen', '#classical'],
  'zindagi',
  'public',
  '{"wah_wah": 338, "irshad": 107, "mukarrar": 93, "dil_se": 751, "comments": 47, "shares": 112, "saves": 187}'::jsonb
);

INSERT INTO posts (author_id, type, language, script, title, lines, tags, mood, visibility, counters)
VALUES (
  '11111111-0000-0000-0000-000000000003',
  'sher',
  'urdu',
  'devanagari',
  'हज़ारों साल नर्गिस अपनी बे-नूरी पे रोती है',
  '[{"number":1,"text":"हज़ारों साल नर्गिस अपनी बे-नूरी पे रोती है"},{"number":2,"text":"बड़ी मुश्किल से होता है चमन में दीदा-वर पैदा"},{"number":3,"text":"ہزاروں سال نرگس اپنی بے نوری پہ روتی ہے"},{"number":4,"text":"بڑی مشکل سے ہوتا ہے چمن میں دیدہ ور پیدا"}]'::jsonb,
  ARRAY['#iqbal', '#chaman', '#classical'],
  'zindagi',
  'public',
  '{"wah_wah": 204, "irshad": 126, "mukarrar": 109, "dil_se": 753, "comments": 26, "shares": 68, "saves": 188}'::jsonb
);

-- Poet: दाग़ देहलवी (Daagh)
INSERT INTO users (id, username, takhallus, bio, avatar_url, role, badges, counters)
VALUES (
  '11111111-0000-0000-0000-000000000004',
  'daagh_dehlvi',
  'दाग़ देहलवी (Daagh)',
  'Nawab Mirza Khan Daagh Dehlvi (1831–1905). The master of romantic idiom and playful Delhi language.',
  '/classical/daagh.jpg',
  'user',
  ARRAY['classical', 'bulbul_e_hind'],
  '{"posts": 3, "followers": 919, "following": 0}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  takhallus = EXCLUDED.takhallus,
  bio = EXCLUDED.bio,
  badges = EXCLUDED.badges;

INSERT INTO posts (author_id, type, language, script, title, lines, tags, mood, visibility, counters)
VALUES (
  '11111111-0000-0000-0000-000000000004',
  'sher',
  'urdu',
  'devanagari',
  'उर्दू है जिस का नाम',
  '[{"number":1,"text":"उर्दू है जिस का नाम हमीं जानते हैं ''दाग़''"},{"number":2,"text":"सारे जहाँ में धूम हमारी ज़बाँ की है"},{"number":3,"text":"اردو ہے جس کا نام ہمیں جانتے ہیں داغؔ"},{"number":4,"text":"سارے جہاں میں دھوم ہماری زباں کی ہے"}]'::jsonb,
  ARRAY['#daagh', '#urdu', '#zaban', '#classical'],
  'ishq',
  'public',
  '{"wah_wah": 195, "irshad": 180, "mukarrar": 104, "dil_se": 838, "comments": 37, "shares": 65, "saves": 209}'::jsonb
);

INSERT INTO posts (author_id, type, language, script, title, lines, tags, mood, visibility, counters)
VALUES (
  '11111111-0000-0000-0000-000000000004',
  'sher',
  'urdu',
  'devanagari',
  'ख़ूब पर्दा है कि चिलमन से लगे बैठे हैं',
  '[{"number":1,"text":"ख़ूब पर्दा है कि चिलमन से लगे बैठे हैं"},{"number":2,"text":"साफ़ छुपते भी नहीं सामने आते भी नहीं"},{"number":3,"text":"خوب پردہ ہے کہ چلمن سے لگے بیٹھے ہیں"},{"number":4,"text":"صاف چھپتے بھی نہیں سامنے آتے بھی نہیں"}]'::jsonb,
  ARRAY['#daagh', '#parda', '#chilman', '#classical'],
  'ishq',
  'public',
  '{"wah_wah": 185, "irshad": 153, "mukarrar": 106, "dil_se": 644, "comments": 46, "shares": 61, "saves": 161}'::jsonb
);

INSERT INTO posts (author_id, type, language, script, title, lines, tags, mood, visibility, counters)
VALUES (
  '11111111-0000-0000-0000-000000000004',
  'sher',
  'urdu',
  'devanagari',
  'आप का ऐतबार कौन करे',
  '[{"number":1,"text":"ग़ैर मुमकिन है कि वो वादा-वफ़ा हो जाएँ"},{"number":2,"text":"आप का ऐतबार कौन करे"},{"number":3,"text":"غیر ممکن ہے کہ وہ وعدہ وفا ہو جائیں"},{"number":4,"text":"آپ کا اعتبار کون کرے"}]'::jsonb,
  ARRAY['#daagh', '#wada', '#classical'],
  'judai',
  'public',
  '{"wah_wah": 254, "irshad": 184, "mukarrar": 72, "dil_se": 491, "comments": 24, "shares": 84, "saves": 122}'::jsonb
);

-- Poet: शेख़ 'ज़ौक़' (Zauq)
INSERT INTO users (id, username, takhallus, bio, avatar_url, role, badges, counters)
VALUES (
  '11111111-0000-0000-0000-000000000005',
  'sheikh_zauq',
  'शेख़ ''ज़ौक़'' (Zauq)',
  'Mohammad Ibrahim Zauq (1789–1854). Poet laureate of the Mughal court and master of linguistic craft.',
  '/classical/zauq.jpg',
  'user',
  ARRAY['classical', 'khaqani_e_hind'],
  '{"posts": 2, "followers": 1177, "following": 0}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  takhallus = EXCLUDED.takhallus,
  bio = EXCLUDED.bio,
  badges = EXCLUDED.badges;

INSERT INTO posts (author_id, type, language, script, title, lines, tags, mood, visibility, counters)
VALUES (
  '11111111-0000-0000-0000-000000000005',
  'sher',
  'urdu',
  'devanagari',
  'लाई हयात आए क़ज़ा ले चली चले',
  '[{"number":1,"text":"लाई हयात आए क़ज़ा ले चली चले"},{"number":2,"text":"अपनी ख़ुशी न आए न अपनी ख़ुशी चले"},{"number":3,"text":"لائی حیات آئے قضا لے چلی چلے"},{"number":4,"text":"اپنی خوشی نہ آئے نہ اپنی خوشی چلے"}]'::jsonb,
  ARRAY['#zauq', '#zindagi', '#qaza', '#classical'],
  'zindagi',
  'public',
  '{"wah_wah": 422, "irshad": 142, "mukarrar": 77, "dil_se": 291, "comments": 51, "shares": 140, "saves": 72}'::jsonb
);

INSERT INTO posts (author_id, type, language, script, title, lines, tags, mood, visibility, counters)
VALUES (
  '11111111-0000-0000-0000-000000000005',
  'sher',
  'urdu',
  'devanagari',
  'अब तो घबरा के ये कहते हैं',
  '[{"number":1,"text":"अब तो घबरा के ये कहते हैं कि मर जाएँगे"},{"number":2,"text":"मर के भी चैन न पाया तो किधर जाएँगे"},{"number":3,"text":"اب تو گھبرا کے یہ کہتے ہیں کہ مر جائیں گے"},{"number":4,"text":"مر کے بھی چین نہ پایا تو کدھر جائیں گے"}]'::jsonb,
  ARRAY['#zauq', '#maut', '#zindagi', '#classical'],
  'tanhai',
  'public',
  '{"wah_wah": 549, "irshad": 238, "mukarrar": 116, "dil_se": 555, "comments": 9, "shares": 183, "saves": 138}'::jsonb
);

-- Poet: बहादुर शाह 'ज़फ़र' (Zafar)
INSERT INTO users (id, username, takhallus, bio, avatar_url, role, badges, counters)
VALUES (
  '11111111-0000-0000-0000-000000000006',
  'bahadur_shah_zafar',
  'बहादुर शाह ''ज़फ़र'' (Zafar)',
  'Bahadur Shah Zafar (1775–1862). The last Mughal Emperor and poignant romantic poet in exile in Rangoon.',
  '/classical/zafar.jpg',
  'user',
  ARRAY['classical', 'aakhiri_badshah'],
  '{"posts": 3, "followers": 936, "following": 0}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  takhallus = EXCLUDED.takhallus,
  bio = EXCLUDED.bio,
  badges = EXCLUDED.badges;

INSERT INTO posts (author_id, type, language, script, title, lines, tags, mood, visibility, counters)
VALUES (
  '11111111-0000-0000-0000-000000000006',
  'sher',
  'urdu',
  'devanagari',
  'लगता नहीं है दिल मिरा उजड़े दयार में',
  '[{"number":1,"text":"लगता नहीं है दिल मिरा उजड़े दयार में"},{"number":2,"text":"किस की बनी है आलम-ए-ना-पाएदार में"},{"number":3,"text":"لگتا نہیں ہے دل مرا اجڑے دیار میں"},{"number":4,"text":"کس کی بنی ہے عالم ناپائیدار میں"}]'::jsonb,
  ARRAY['#zafar', '#dilli', '#judai', '#classical'],
  'judai',
  'public',
  '{"wah_wah": 559, "irshad": 121, "mukarrar": 82, "dil_se": 358, "comments": 16, "shares": 186, "saves": 89}'::jsonb
);

INSERT INTO posts (author_id, type, language, script, title, lines, tags, mood, visibility, counters)
VALUES (
  '11111111-0000-0000-0000-000000000006',
  'sher',
  'urdu',
  'devanagari',
  'कितना है बद-नसीब ''ज़फ़र''',
  '[{"number":1,"text":"कितना है बद-नसीब ''ज़फ़र'' दफ़्न के लिए"},{"number":2,"text":"दो गज़ ज़मीं भी न मिली कू-ए-यार में"},{"number":3,"text":"کتنا ہے بد نصیب ظفرؔ دفن کے لیے"},{"number":4,"text":"دو گز زمیں بھی نہ ملی کوئے یار میں"}]'::jsonb,
  ARRAY['#zafar', '#qabr', '#dard', '#classical'],
  'tanhai',
  'public',
  '{"wah_wah": 120, "irshad": 89, "mukarrar": 82, "dil_se": 654, "comments": 18, "shares": 40, "saves": 163}'::jsonb
);

INSERT INTO posts (author_id, type, language, script, title, lines, tags, mood, visibility, counters)
VALUES (
  '11111111-0000-0000-0000-000000000006',
  'sher',
  'urdu',
  'devanagari',
  'बात करनी मुझे मुश्किल कभी ऐसी तो न थी',
  '[{"number":1,"text":"बात करनी मुझे मुश्किल कभी ऐसी तो न थी"},{"number":2,"text":"जैसी अब है तिरी महफ़िल कभी ऐसी तो न थी"},{"number":3,"text":"بات کرنی مجھے مشکل کبھی ایسی تو نہ تھی"},{"number":4,"text":"جیسی اب ہے تری محفل کبھی ایسی تو نہ تھی"}]'::jsonb,
  ARRAY['#zafar', '#mehfil', '#classical'],
  'ishq',
  'public',
  '{"wah_wah": 127, "irshad": 81, "mukarrar": 92, "dil_se": 779, "comments": 31, "shares": 42, "saves": 194}'::jsonb
);

-- 3. Update search_vector for all newly inserted posts
UPDATE posts SET search_vector = 
  setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('simple', coalesce((select string_agg(l->>'text', ' ') from jsonb_array_elements(lines) as l), '')), 'B') ||
  setweight(to_tsvector('simple', coalesce(array_to_string(tags, ' '), '')), 'C')
WHERE search_vector IS NULL;

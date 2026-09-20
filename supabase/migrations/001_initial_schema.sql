-- ==============================================================================
-- ALFAAZ — MASTER DATABASE SCHEMA & POLICIES
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Types & Enums
create type user_role as enum ('user', 'moderator', 'admin');
create type post_type as enum ('sher', 'ghazal', 'nazm', 'rubai', 'quote');
create type post_script as enum ('devanagari', 'nastaliq', 'roman', 'english');
create type post_visibility as enum ('public', 'followers', 'private');
create type reaction_type as enum ('wah_wah', 'irshad', 'mukarrar', 'dil_se');
create type chat_type as enum ('dm', 'mehfil');
create type report_target_type as enum ('post', 'comment', 'user', 'message');
create type report_status as enum ('pending', 'resolved', 'dismissed');

-- 1. USERS TABLE (Linked to Supabase auth.users)
create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  takhallus text,
  bio text default 'Words are all I have.',
  avatar_url text,
  cover_url text,
  languages text[] default '{"hindi", "urdu"}',
  role user_role default 'user',
  badges text[] default '{"shayar"}',
  counters jsonb default '{"posts":0, "followers":0, "following":0}',
  created_at timestamptz default now()
);

-- 2. POSTS TABLE (Shayari, Ghazal, Nazm)
create table if not exists posts (
  id uuid primary key default uuid_generate_v4(),
  author_id uuid references users(id) on delete cascade not null,
  type post_type not null default 'sher',
  language text not null default 'hindi',
  script post_script not null default 'devanagari',
  title text,
  lines jsonb not null, -- Array of {text: string, number: number}
  tags text[] default '{}',
  mood text default 'ishq',
  image_id text,
  audio_id text,
  visibility post_visibility default 'public',
  counters jsonb default '{"wah_wah":0, "irshad":0, "mukarrar":0, "dil_se":0, "comments":0, "shares":0, "saves":0}',
  search_vector tsvector,
  created_at timestamptz default now()
);

-- 3. REACTIONS TABLE (Wah Wah, Irshad, Mukarrar, Dil Se)
create table if not exists reactions (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references posts(id) on delete cascade not null,
  user_id uuid references users(id) on delete cascade not null,
  type reaction_type not null,
  created_at timestamptz default now(),
  unique(post_id, user_id, type)
);

-- 4. COMMENTS TABLE
create table if not exists comments (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references posts(id) on delete cascade not null,
  author_id uuid references users(id) on delete cascade not null,
  body text not null,
  created_at timestamptz default now()
);

-- 5. FOLLOWS TABLE
create table if not exists follows (
  follower_id uuid references users(id) on delete cascade not null,
  followee_id uuid references users(id) on delete cascade not null,
  created_at timestamptz default now(),
  primary key(follower_id, followee_id)
);

-- 6. SAVED / BOOKMARKS TABLE
create table if not exists saved_posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade not null,
  post_id uuid references posts(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, post_id)
);

-- 7. CHATS & MESSAGES
create table if not exists chats (
  id uuid primary key default uuid_generate_v4(),
  type chat_type not null default 'dm',
  members uuid[] not null,
  last_message text,
  unread jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  chat_id uuid references chats(id) on delete cascade not null,
  sender_id uuid references users(id) on delete cascade not null,
  body text not null,
  created_at timestamptz default now()
);

-- 8. NOTIFICATIONS
create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade not null,
  type text not null,
  payload jsonb not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- 9. DIWANS (Digital Poetry Book)
create table if not exists diwans (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references users(id) on delete cascade not null,
  title text not null,
  cover_url text,
  post_ids uuid[] default '{}',
  created_at timestamptz default now()
);

-- 10. CHALLENGES & BAIT-BAZI
create table if not exists challenges (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  prompt text not null,
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null default (now() + interval '7 days'),
  created_at timestamptz default now()
);

create table if not exists challenge_entries (
  id uuid primary key default uuid_generate_v4(),
  challenge_id uuid references challenges(id) on delete cascade not null,
  user_id uuid references users(id) on delete cascade not null,
  post_id uuid references posts(id) on delete cascade not null,
  created_at timestamptz default now()
);

-- 11. REPORTS & MODERATION
create table if not exists reports (
  id uuid primary key default uuid_generate_v4(),
  target_type report_target_type not null,
  target_id uuid not null,
  reporter_id uuid references users(id) on delete cascade not null,
  reason text not null,
  status report_status default 'pending',
  created_at timestamptz default now()
);

-- ==============================================================================
-- INDEXES FOR SPEED
-- ==============================================================================
create index if not exists idx_posts_author on posts(author_id);
create index if not exists idx_posts_created on posts(created_at desc);
create index if not exists idx_follows_follower on follows(follower_id);
create index if not exists idx_follows_followee on follows(followee_id);
create index if not exists idx_messages_chat_created on messages(chat_id, created_at);
create index if not exists idx_notifications_user_read on notifications(user_id, read);
create index if not exists idx_posts_search on posts using gin(search_vector);

-- ==============================================================================
-- FULL TEXT SEARCH TRIGGER
-- ==============================================================================
create or replace function posts_search_trigger() returns trigger as $$
begin
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce((select string_agg(l->>'text', ' ') from jsonb_array_elements(new.lines) as l), '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(new.tags, ' '), '')), 'C');
  return new;
end
$$ language plpgsql;

drop trigger if exists trg_posts_search_update on posts;
create trigger trg_posts_search_update
before insert or update of title, lines, tags on posts
for each row execute function posts_search_trigger();

-- ==============================================================================
-- AUTO USER PROFILE CREATION ON SIGNUP
-- ==============================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, username, takhallus, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', 'shayar_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data->>'takhallus', new.raw_user_meta_data->>'full_name', 'Shayar'),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
alter table users enable row level security;
alter table posts enable row level security;
alter table reactions enable row level security;
alter table comments enable row level security;
alter table follows enable row level security;
alter table saved_posts enable row level security;
alter table chats enable row level security;
alter table messages enable row level security;
alter table notifications enable row level security;
alter table diwans enable row level security;
alter table challenges enable row level security;
alter table challenge_entries enable row level security;
alter table reports enable row level security;

-- USERS
create policy "Public users are viewable by everyone" on users for select using (true);
create policy "Users can insert own profile" on users for insert with check (auth.uid() = id);
create policy "Users can update own profile" on users for update using (auth.uid() = id);

-- POSTS
create policy "Public posts are viewable by everyone" on posts for select using (visibility = 'public');
create policy "Authors can view own private posts" on posts for select using (auth.uid() = author_id);
create policy "Authors can insert own posts" on posts for insert with check (auth.uid() = author_id);
create policy "Authors can update own posts" on posts for update using (auth.uid() = author_id);
create policy "Authors can delete own posts" on posts for delete using (auth.uid() = author_id);

-- REACTIONS
create policy "Reactions viewable by everyone" on reactions for select using (true);
create policy "Users can add own reactions" on reactions for insert with check (auth.uid() = user_id);
create policy "Users can delete own reactions" on reactions for delete using (auth.uid() = user_id);

-- COMMENTS
create policy "Comments viewable by everyone" on comments for select using (true);
create policy "Users can add own comments" on comments for insert with check (auth.uid() = author_id);
create policy "Authors can delete own comments" on comments for delete using (auth.uid() = author_id);

-- FOLLOWS
create policy "Follows viewable by everyone" on follows for select using (true);
create policy "Users can insert own follows" on follows for insert with check (auth.uid() = follower_id);
create policy "Users can delete own follows" on follows for delete using (auth.uid() = follower_id);

-- SAVED POSTS
create policy "Users can view own saved posts" on saved_posts for select using (auth.uid() = user_id);
create policy "Users can save posts" on saved_posts for insert with check (auth.uid() = user_id);
create policy "Users can unsave posts" on saved_posts for delete using (auth.uid() = user_id);

-- CHATS & MESSAGES
create policy "Users can view own chats" on chats for select using (auth.uid() = any(members));
create policy "Users can insert chats" on chats for insert with check (auth.uid() = any(members));
create policy "Users can view messages in own chats" on messages for select using (
  exists (select 1 from chats where chats.id = messages.chat_id and auth.uid() = any(chats.members))
);
create policy "Users can send messages to own chats" on messages for insert with check (
  auth.uid() = sender_id and
  exists (select 1 from chats where chats.id = messages.chat_id and auth.uid() = any(chats.members))
);

-- NOTIFICATIONS
create policy "Users can view own notifications" on notifications for select using (auth.uid() = user_id);
create policy "Users can update own notifications" on notifications for update using (auth.uid() = user_id);

-- DIWANS & CHALLENGES
create policy "Diwans viewable by everyone" on diwans for select using (true);
create policy "Users can CRUD own diwans" on diwans for all using (auth.uid() = owner_id);
create policy "Challenges viewable by everyone" on challenges for select using (true);
create policy "Challenge entries viewable by everyone" on challenge_entries for select using (true);
create policy "Users can add challenge entries" on challenge_entries for insert with check (auth.uid() = user_id);
create policy "Users can insert reports" on reports for insert with check (auth.uid() = reporter_id);

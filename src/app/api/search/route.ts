import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() || '';

  if (!q) {
    return NextResponse.json({ poets: [], posts: [] });
  }

  try {
    const supabase = await createClient();

    // 1. Search Poets (Username or Takhallus)
    const { data: poets } = await supabase
      .from('users')
      .select('id, username, takhallus, bio, avatar_url, role, badges')
      .or(`username.ilike.%${q}%,takhallus.ilike.%${q}%`)
      .limit(8);

    // 2. Search Posts (by full-text search_vector or title/tags/lines)
    let { data: posts } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        lines,
        tags,
        mood,
        type,
        counters,
        author:users (
          username,
          takhallus
        )
      `)
      .or(`title.ilike.%${q}%,mood.ilike.%${q}%`)
      .limit(16);

    // If few results, also match tags
    if (!posts || posts.length < 5) {
      const { data: tagPosts } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          lines,
          tags,
          mood,
          type,
          counters,
          author:users (
            username,
            takhallus
          )
        `)
        .contains('tags', [q.startsWith('#') ? q.toLowerCase() : `#${q.toLowerCase()}`])
        .limit(10);

      if (tagPosts && tagPosts.length > 0) {
        const existingIds = new Set((posts || []).map(p => p.id));
        const combined = [...(posts || [])];
        for (const tp of tagPosts) {
          if (!existingIds.has(tp.id)) {
            combined.push(tp);
          }
        }
        posts = combined;
      }
    }

    return NextResponse.json({
      poets: poets || [],
      posts: posts || [],
    });
  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json({ poets: [], posts: [], error: error.message }, { status: 500 });
  }
}

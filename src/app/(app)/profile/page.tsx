import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function ProfileRedirectPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch username from users table or metadata
  const { data: profile } = await supabase
    .from('users')
    .select('username')
    .eq('id', user.id)
    .maybeSingle();

  const username = profile?.username || user.user_metadata?.username || `shayar_${user.id.slice(0, 6)}`;

  redirect(`/u/${username.toLowerCase()}`);
}

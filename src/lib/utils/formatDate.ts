export function formatDate(date: string | Date, lang: 'en' | 'hi' | 'ur' = 'en'): string {
  const now = new Date()
  const d = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (diffInSeconds < 60) {
    if (lang === 'hi' || lang === 'ur') return 'Abhi'
    return 'Just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    if (lang === 'hi') return `${diffInMinutes} min pehle`
    if (lang === 'ur') return `${diffInMinutes} min pehle`
    return `${diffInMinutes} min ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    if (lang === 'hi' || lang === 'ur') return `${diffInHours} ghante pehle`
    return `${diffInHours}h ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) {
    if (lang === 'hi' || lang === 'ur') return 'Kal'
    return 'Yesterday'
  }
  if (diffInDays < 7) {
    if (lang === 'hi' || lang === 'ur') return `${diffInDays} din pehle`
    return `${diffInDays}d ago`
  }

  return d.toLocaleDateString(lang === 'en' ? 'en-US' : 'en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

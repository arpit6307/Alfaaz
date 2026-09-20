const PROFANITY_LIST = [
  // English
  'fuck', 'shit', 'bitch', 'asshole', 'cunt', 'dick', 'bastard', 'motherfucker',
  'cock', 'pussy', 'whore', 'slut', 'fag', 'faggot', 'nigger', 'nigga',
  'crap', 'piss', 'douche', 'dyke', 'prick', 'twat', 'wanker',
  // Hindi/Urdu (romanized examples for demonstration)
  'bhenchod', 'madarchod', 'chutiya', 'gaandu', 'bhosadike', 'maadar',
  'bhosdi', 'harami', 'kutta', 'kaminey', 'randi', 'raand', 'chinal',
  'lund', 'bhosda', 'chod', 'chodu', 'choot', 'tatay', 'jhaant'
]

const pattern = new RegExp(`\\b(${PROFANITY_LIST.join('|')})\\b`, 'gi')

export function containsProfanity(text: string): boolean {
  return pattern.test(text)
}

export function censorText(text: string): string {
  return text.replace(pattern, (match) => {
    if (match.length <= 2) return '*'.repeat(match.length)
    return match[0] + '*'.repeat(match.length - 2) + match[match.length - 1]
  })
}

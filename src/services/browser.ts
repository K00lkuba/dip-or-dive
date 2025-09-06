// @@BROWSER_SERVICE_START
const NEW_CHAT = 'https://chat.openai.com/?new_chat=true'

export async function copyText(t: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(t)
      return true
    }
  } catch {}
  return false
}

export function openNewChat(): boolean {
  try {
    const w = window.open(NEW_CHAT, '_blank', 'noopener')
    if (!w) {
      window.open('https://chat.openai.com/', '_blank', 'noopener')
    }
    return true
  } catch {
    return false
  }
}
// @@BROWSER_SERVICE_END
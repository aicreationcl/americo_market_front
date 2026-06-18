const SESSION_KEY = 'americo_session_id'

const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const getSessionId = (): string => {
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = generateUUID()
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}

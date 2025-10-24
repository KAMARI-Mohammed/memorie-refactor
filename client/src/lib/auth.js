const KEY = 'memorie:token'

export function getToken() {
  return localStorage.getItem(KEY)
}
export function setToken(v) {
  if (!v) localStorage.removeItem(KEY)
  else localStorage.setItem(KEY, v)
}

const BASE = 'http://localhost:8081'

function getToken() {
  return localStorage.getItem('tg-token') || ''
}

function headers() {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function request(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: headers(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const msg = data.message || `Request failed: ${res.status}`
    throw new Error(msg)
  }

  return data
}

export const api = {
  get:    (path)       => request('GET',    path),
  post:   (path, body) => request('POST',   path, body),
  delete: (path)       => request('DELETE', path),
}

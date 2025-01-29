const API_URL = "http://localhost:8000/api"

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
    },
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "An error occurred")
  }

  return res.json()
}


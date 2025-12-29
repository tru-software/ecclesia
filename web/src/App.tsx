import React, { useEffect, useState } from 'react'

type HelloResponse = { message?: string } | null

export default function App() {
  const [data, setData] = useState<HelloResponse>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch('/api/v1/hello')
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText)
        return res.json()
      })
      .then((json) => setData(json))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="app">
      <header>
        <h1>Ecclesia — przykładowy frontend</h1>
      </header>

      <main>
        <section>
          <h2>GET /api/v1/hello</h2>
          {loading && <p>Ładowanie...</p>}
          {error && <p className="error">Błąd: {error}</p>}
          {data && (
            <pre className="json">{JSON.stringify(data, null, 2)}</pre>
          )}
          {!loading && !data && !error && (
            <p>Brak danych — upewnij się, że backend działa.</p>
          )}
        </section>
      </main>

      <footer>
        <small>Development proxy: /api → http://localhost:8000</small>
      </footer>
    </div>
  )
}

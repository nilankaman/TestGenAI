import { useState, useEffect, useRef } from 'react'

export function useJobPoller(jobId) {
  const [status, setStatus] = useState(null)
  const [result, setResult] = useState(null)
  const [error,  setError]  = useState(null)

  const intervalRef = useRef(null)
  const timeoutRef  = useRef(null)

  useEffect(() => {
    if (!jobId) return

    setStatus('PENDING')
    setResult(null)
    setError(null)

    async function poll() {
      try {
        const token = localStorage.getItem('tg-token')
        const res   = await fetch(`/api/v1/generate/status/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (!res.ok) {
          stop()
          setError('Could not fetch job status')
          return
        }

        const data = await res.json()
        setStatus(data.status)

        if (data.status === 'COMPLETED') {
          setResult(data)
          stop()
        } else if (data.status === 'FAILED') {
          setError(data.error || 'Generation failed')
          stop()
        }
      } catch {
        stop()
        setError('Cannot connect to server')
      }
    }

    function stop() {
      clearInterval(intervalRef.current)
      clearTimeout(timeoutRef.current)
    }

    intervalRef.current = setInterval(poll, 2000)
    timeoutRef.current  = setTimeout(() => {
      stop()
      setError('Timed out after 90 seconds — the server may be busy')
    }, 90000)

    poll()

    return stop
  }, [jobId])

  return { status, result, error }
}
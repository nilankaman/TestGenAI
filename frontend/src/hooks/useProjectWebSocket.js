import { useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

export function useProjectWebSocket(projectId) {
  const [comments,  setComments]  = useState([])
  const [connected, setConnected] = useState(false)
  const client = useRef(null)

  useEffect(() => {
    if (!projectId) return

    const token = localStorage.getItem('tg-token')

    const stomp = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      connectHeaders:   { Authorization: `Bearer ${token}` },
      reconnectDelay:   5000,

      onConnect: () => {
        setConnected(true)
        stomp.subscribe(`/topic/project.${projectId}.comments`, frame => {
          setComments(prev => [...prev, JSON.parse(frame.body)])
        })
      },

      onDisconnect: () => setConnected(false),
    })

    stomp.activate()
    client.current = stomp

    return () => stomp.deactivate()
  }, [projectId])

  function sendComment(testCaseId, text) {
    if (!client.current?.connected) return
    client.current.publish({
      destination: `/app/project/${projectId}/comment`,
      body:        JSON.stringify({ testCaseId, text }),
    })
  }

  return { comments, connected, sendComment }
}
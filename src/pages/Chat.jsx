import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useChat } from '../hooks/useChat'
import { useAuthContext } from '../context/AuthContext'
import { format, isToday, isYesterday, startOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const Chat = () => {
  const { messages, loading, loadingMore, fetchMessages, sendMessage, subscribeToChat, hasMore, error } = useChat()
  const { user } = useAuthContext()
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [initialLoaded, setInitialLoaded] = useState(false)
  
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)

  // 1. Initial Load & Subscription
  useEffect(() => {
    fetchMessages()
    const unsubscribe = subscribeToChat()
    return () => unsubscribe()
  }, []) // Empty deps for single sub

  // 2. Handle Scroll for Pagination (Infinite Scroll Up)
  const handleScroll = () => {
    const container = chatContainerRef.current
    if (!container || loadingMore || !hasMore) return

    if (container.scrollTop === 0 && messages.length > 0) {
      const oldHeight = container.scrollHeight
      const oldestMsg = messages[0]
      
      fetchMessages(oldestMsg.enviado_em).then(() => {
        // Preservar posição do scroll
        requestAnimationFrame(() => {
          if (container) {
            container.scrollTop = container.scrollHeight - oldHeight
          }
        })
      })
    }
  }

  // 3. Auto-scroll to bottom on NEW messages
  useEffect(() => {
    if (!loadingMore) {
      if (!initialLoaded && !loading && messages.length > 0) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
        setInitialLoaded(true)
      } else if (initialLoaded) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [messages, loading, loadingMore, initialLoaded])

  // 4. Grouping logic for date separators and sender blocks
  const groupedMessages = useMemo(() => {
    const groups = []
    let lastDate = null

    messages.forEach((msg) => {
      const msgDate = startOfDay(new Date(msg.enviado_em))
      const dateKey = msgDate.toISOString()

      if (!lastDate || lastDate !== dateKey) {
        groups.push({ type: 'date', value: msgDate, id: `date-${dateKey}` })
        lastDate = dateKey
      }
      groups.push({ type: 'message', value: msg, id: msg.id })
    })

    return groups
  }, [messages])

  const formatDateLabel = (date) => {
    if (isToday(date)) return 'Hoje'
    if (isYesterday(date)) return 'Ontem'
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !user || sending) return

    setSending(true)
    const content = newMessage.trim()
    setNewMessage('')
    
    // CURRENT USER META for Optimistic Update
    const currentUserData = {
      nome: user.user_metadata?.nome || user.email.split('@')[0],
      email: user.email
    }

    const { error: sendError } = await sendMessage(content, user.id, currentUserData)
    if (sendError) {
      alert('Erro ao enviar. Tente novamente.')
      setNewMessage(content)
    }
    setSending(false)
  }

  return (
    <section className="feed-container">
      <header className="blog-header">
        <h1>Voz da Comunidade</h1>
        <p style={{ color: 'var(--text-light)', marginTop: '-10px', marginBottom: '30px' }}>
          Interação coletiva em tempo real.
        </p>
      </header>

      <div className="article-card chat-container-full" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '650px', overflow: 'hidden' }}>
        <div style={{ padding: '15px 25px', background: 'var(--dark-green)', color: 'white', fontWeight: 800 }}>
          Comunidade Global
        </div>

        <div 
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="chat-messages glass-pattern" 
          style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '25px', 
            display: 'flex', 
            flexDirection: 'column',
            background: 'rgba(255,255,255,0.4)',
            scrollBehavior: 'auto'
          }}
        >
          {loading && <p style={{ textAlign: 'center' }}>Sincronizando portal...</p>}
          {loadingMore && <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-light)', padding: '10px' }}>Carregandp histórico...</p>}
          {error && <p style={{ color: 'red', textAlign: 'center' }}>Erro: {error}</p>}
          
          {(() => {
            let lastSenderId = null
            return groupedMessages.map((item) => {
              if (item.type === 'date') {
                lastSenderId = null 
                return (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                    <span style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-light)', padding: '5px 15px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800 }}>
                      {formatDateLabel(item.value)}
                    </span>
                  </div>
                )
              }

              const msg = item.value
              const isOwn = user && msg.remetente_id === user.id
              const showMeta = msg.remetente_id !== lastSenderId
              lastSenderId = msg.remetente_id

              return (
                <div 
                  key={item.id} 
                  className={`msg-wrapper ${isOwn ? 'own' : 'other'}`}
                  style={{ 
                    alignSelf: isOwn ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    marginBottom: showMeta ? '15px' : '5px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {showMeta && (
                    <div style={{ 
                      fontSize: '0.75rem', 
                      marginBottom: '5px', 
                      color: 'var(--text-light)',
                      textAlign: isOwn ? 'right' : 'left',
                      padding: '0 10px'
                    }}>
                      <strong style={{ color: 'var(--dark-green)' }}>{msg.usuarios?.nome || 'Anônimo'}</strong> • {msg.usuarios?.email || 'N/A'}
                    </div>
                  )}

                  <div 
                    className="article-card"
                    style={{
                      padding: '12px 18px',
                      borderRadius: '16px',
                      background: isOwn ? 'var(--dark-green)' : 'var(--white)',
                      color: isOwn ? 'white' : 'var(--text-main)',
                      boxShadow: 'var(--shadow-sm)',
                      margin: 0,
                      position: 'relative',
                      opacity: msg.isOptimistic ? 0.7 : 1
                    }}
                  >
                    <p style={{ margin: 0, lineHeight: '1.5', fontSize: '1rem' }}>{msg.mensagem}</p>
                    <div style={{ textAlign: 'right', marginTop: '5px', fontSize: '0.65rem', opacity: 0.7 }}>
                      {format(new Date(msg.enviado_em), 'HH:mm')}
                    </div>
                  </div>
                </div>
              )
            })
          })()}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-footer" style={{ padding: '15px 20px', background: 'var(--white)', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          {user ? (
            <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                placeholder="Diga algo positivo..." 
                style={{ flex: 1, padding: '12px 20px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', outline: 'none' }}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={sending}
              />
              <button 
                type="submit" 
                style={{ 
                  background: 'var(--dark-green)', 
                  color: 'white', 
                  border: 'none', 
                  padding: '0 25px', 
                  borderRadius: '12px', 
                  fontWeight: 800, 
                  cursor: sending ? 'wait' : 'pointer' 
                }}
              >
                Enviar 🌿
              </button>
            </form>
          ) : (
            <p style={{ textAlign: 'center', margin: 0 }}>Faça login para participar.</p>
          )}
        </div>
      </div>
    </section>
  )
}

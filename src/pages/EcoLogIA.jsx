import React, { useState, useEffect, useRef } from 'react'
import { useAuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export const EcoLogIA = () => {
  const { user } = useAuthContext()
  const [userInput, setUserInput] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [conversationHistory, setConversationHistory] = useState([])

  const chatHistoryRef = useRef(null)
  const messagesEndRef = useRef(null)

  const geminiKey = import.meta.env.VITE_GEMINI_KEY

  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const fetchGeminiResponse = async (userText) => {
    const updatedHistory = [...conversationHistory, { role: "user", parts: [{ text: userText }] }]
    setConversationHistory(updatedHistory)

    const payload = {
      contents: updatedHistory,
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    }

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Erro na API")
      const data = await response.json()
      const botResponse = data.candidates[0].content.parts[0].text

      setConversationHistory(prev => [...prev, { role: "model", parts: [{ text: botResponse }] }])
      return botResponse
    } catch (error) {
      return "Desculpe, a conexão com a rede da natureza falhou. Tente novamente."
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!userInput.trim() || isLoading) return

    const text = userInput
    setUserInput('')
    setMessages(prev => [...prev, { text, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    setIsLoading(true)

    const answer = await fetchGeminiResponse(text)
    setMessages(prev => [...prev, {
      text: answer,
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }])
    setIsLoading(false)
  }

  return (
    <section className="feed-container">
      <header className="blog-header">
        <h1>EcologIA</h1>
        <p style={{ color: 'var(--text-light)', marginTop: '-10px', marginBottom: '30px' }}>
          Nossa inteligência artificial especialista em sustentabilidade. Tire suas dúvidas!
        </p>
      </header>

      {/* Container Full - Seguindo a estrutura do seu Chat.js */}
      <div className="article-card chat-container-full" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '650px', overflow: 'hidden' }}>

        <div style={{ padding: '15px 25px', background: 'var(--dark-green)', color: 'white', fontWeight: 800 }}>
          Assistente Virtual Sustentável
        </div>

        <div
          ref={chatHistoryRef}
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
          {/* Mensagem Inicial do Bot */}
          <div className="msg-wrapper other" style={{ alignSelf: 'flex-start', maxWidth: '80%', marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '0.75rem', marginBottom: '5px', color: 'var(--text-light)', padding: '0 10px' }}>
              <strong style={{ color: 'var(--dark-green)' }}>EcologIA</strong> • Oficial
            </div>
            <div className="article-card" style={{ padding: '12px 18px', borderRadius: '16px', background: 'var(--white)', color: 'var(--text-main)', boxShadow: 'var(--shadow-sm)', margin: 0 }}>
              <p style={{ margin: 0, lineHeight: '1.5' }}>
                {user
                  ? `Olá, ${user.user_metadata?.nome?.split(' ')[0] || 'amigo'}! Como posso ajudar você hoje? 🌿`
                  : "Olá! Faça login para conversarmos sobre o futuro do nosso planeta!"}
              </p>
            </div>
          </div>

          {/* Mapeamento das Mensagens com Estilo do Chat da Comunidade */}
          {messages.map((m, i) => {
            const isOwn = m.sender === 'user';
            return (
              <div
                key={i}
                className={`msg-wrapper ${isOwn ? 'own' : 'other'}`}
                style={{
                  alignSelf: isOwn ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  marginBottom: '15px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {!isOwn && (
                  <div style={{ fontSize: '0.75rem', marginBottom: '5px', color: 'var(--text-light)', padding: '0 10px' }}>
                    <strong style={{ color: 'var(--dark-green)' }}>EcologIA</strong>
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
                    margin: 0
                  }}
                >
                  <p
                    style={{ margin: 0, lineHeight: '1.5', fontSize: '1rem' }}
                    dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, '<br>') }}
                  ></p>
                  <div style={{ textAlign: 'right', marginTop: '5px', fontSize: '0.65rem', opacity: 0.7 }}>
                    {m.time}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div style={{ alignSelf: 'flex-start', color: 'var(--text-light)', fontSize: '0.8rem', padding: '10px' }}>
              EcologIA está pensando... 🌿
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Footer Identico ao que você enviou */}
        <div className="chat-footer" style={{ padding: '15px 20px', background: 'var(--white)', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          {user ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Pergunte algo sobre o meio ambiente..."
                style={{ flex: 1, padding: '12px 20px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', outline: 'none' }}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={isLoading}
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
                  cursor: isLoading ? 'wait' : 'pointer'
                }}
                disabled={isLoading}
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
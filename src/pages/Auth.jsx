import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useAuthContext } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export const Auth = () => {
  const [view, setView] = useState('login') // 'login', 'register', 'forgot-password', 'check-email'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [localError, setLocalError] = useState('')
  const [feedback, setFeedback] = useState('')
  
  const { signIn, signUp, resetPassword, loading, error } = useAuth()
  const { user } = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/')
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')
    setFeedback('')

    if (view === 'login') {
      const { error: authError } = await signIn(email, password)
      if (authError) {
        if (authError.message === 'Email not confirmed') {
          setLocalError('Ops! Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada.')
        } else {
          setLocalError('E-mail ou senha incorretos.')
        }
      }
    } else if (view === 'register') {
      if (!nome.trim()) return setLocalError('Nome é obrigatório')
      const { error: authError } = await signUp(email, password, { nome })
      if (authError) setLocalError(authError.message)
      else setView('check-email')
    } else if (view === 'forgot-password') {
      if (!email.trim()) return setLocalError('E-mail é obrigatório')
      const { error: authError } = await resetPassword(email)
      if (authError) setLocalError(authError.message)
      else setFeedback('Link de recuperação enviado com sucesso!')
    }
  }

  const renderView = () => {
    switch (view) {
      case 'check-email':
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📧</div>
            <h2 style={{ color: 'var(--dark-green)', fontWeight: 900, marginBottom: '20px', fontSize: '1.8rem' }}>Verifique seu e-mail</h2>
            <p style={{ color: 'var(--text-main)', lineHeight: '1.6', marginBottom: '30px', fontWeight: 500 }}>
              Enviamos um link de confirmação para <strong>{email}</strong>.<br />
              Ative sua conta antes de tentar fazer o login.
            </p>
            <button
              onClick={() => setView('login')}
              style={{ width: '100%', padding: '16px', background: 'var(--dark-green)', color: 'var(--white)', border: 'none', borderRadius: 'var(--border-radius-md)', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}
            >
              Ir para o Login
            </button>
          </div>
        )
      case 'forgot-password':
        return (
          <div>
            <h2 style={{ color: 'var(--dark-green)', fontWeight: 900, marginBottom: '15px', textAlign: 'center', fontSize: '2rem' }}>Recuperar Senha</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '25px', fontSize: '0.9rem' }}>Insira seu e-mail para receber um link de redefinição.</p>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>E-mail</label>
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  style={{ width: '100%', padding: '14px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 'var(--border-radius-md)', fontFamily: 'inherit', fontSize: '1rem', outline: 'none' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {feedback && <p style={{ color: 'var(--accent-green)', fontWeight: 700, textAlign: 'center', marginBottom: '15px' }}>{feedback}</p>}
              {localError && <p style={{ color: '#e74c3c', fontWeight: 600, textAlign: 'center', marginBottom: '15px' }}>{localError}</p>}
              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '16px', background: 'var(--dark-green)', color: 'var(--white)', border: 'none', borderRadius: 'var(--border-radius-md)', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', opacity: loading ? '0.7' : '1' }}
              >
                {loading ? 'Enviando...' : 'Enviar Link'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '25px', fontSize: '0.9rem', color: 'var(--text-light)' }}>
              Lembrou a senha? <a href="#" onClick={(e) => { e.preventDefault(); setView('login'); }} style={{ color: 'var(--dark-green)', fontWeight: 800 }}>Fazer Login</a>
            </p>
          </div>
        )
      case 'register':
        return (
          <div>
            <h2 style={{ color: 'var(--dark-green)', fontWeight: 900, marginBottom: '25px', textAlign: 'center', fontSize: '2rem' }}>Criar Conta</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Maria Silva"
                  style={{ width: '100%', padding: '14px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 'var(--border-radius-md)', fontFamily: 'inherit', fontSize: '1rem', outline: 'none' }}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>E-mail</label>
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  style={{ width: '100%', padding: '14px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 'var(--border-radius-md)', fontFamily: 'inherit', fontSize: '1rem', outline: 'none' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Senha</label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  style={{ width: '100%', padding: '14px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 'var(--border-radius-md)', fontFamily: 'inherit', fontSize: '1rem', outline: 'none' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {localError && <p style={{ color: '#e74c3c', fontWeight: 600, textAlign: 'center', marginBottom: '15px' }}>{localError}</p>}
              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '16px', background: 'var(--accent-green)', color: 'var(--white)', border: 'none', borderRadius: 'var(--border-radius-md)', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', opacity: loading ? '0.7' : '1' }}
              >
                {loading ? 'Criando conta...' : 'Finalizar Cadastro'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '25px', fontSize: '0.9rem', color: 'var(--text-light)' }}>
              Já possui conta? <a href="#" onClick={(e) => { e.preventDefault(); setView('login'); }} style={{ color: 'var(--dark-green)', fontWeight: 800 }}>Fazer Login</a>
            </p>
          </div>
        )
      default: // login
        return (
          <div>
            <h2 style={{ color: 'var(--dark-green)', fontWeight: 900, marginBottom: '25px', textAlign: 'center', fontSize: '2rem' }}>Acessar Conta</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>E-mail</label>
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  style={{ width: '100%', padding: '14px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 'var(--border-radius-md)', fontFamily: 'inherit', fontSize: '1rem', outline: 'none' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Senha</label>
                  <a href="#" onClick={(e) => { e.preventDefault(); setView('forgot-password'); }} style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>Esqueceu?</a>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '14px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 'var(--border-radius-md)', fontFamily: 'inherit', fontSize: '1rem', outline: 'none' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {localError && <p style={{ color: '#e74c3c', fontWeight: 600, textAlign: 'center', marginBottom: '15px' }}>{localError}</p>}
              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '16px', background: 'var(--dark-green)', color: 'var(--white)', border: 'none', borderRadius: 'var(--border-radius-md)', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', opacity: loading ? '0.7' : '1' }}
              >
                {loading ? 'Autenticando...' : 'Entrar'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '25px', fontSize: '0.9rem', color: 'var(--text-light)' }}>
              Ainda não tem conta? <a href="#" onClick={(e) => { e.preventDefault(); setView('register'); }} style={{ color: 'var(--accent-green)', fontWeight: 800 }}>Cadastre-se</a>
            </p>
          </div>
        )
    }
  }

  return (
    <main className="content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', paddingTop: '50px' }}>
      <section className="article-card" style={{ width: '100%', maxWidth: '450px', padding: '40px', margin: '0' }}>
        {renderView()}
      </section>
    </main>
  )
}

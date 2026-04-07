import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const { updatePassword, loading, error } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (newPassword.length < 6) return setLocalError('A senha deve ter pelo menos 6 caracteres')
    if (newPassword !== confirmPassword) return setLocalError('As senhas não coincidem')

    const { error: authError } = await updatePassword(newPassword)
    if (authError) {
      setLocalError(authError.message)
    } else {
      setSuccess(true)
      setTimeout(() => navigate('/auth'), 3000)
    }
  }

  return (
    <main className="content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', paddingTop: '50px' }}>
      <section className="article-card" style={{ width: '100%', maxWidth: '450px', padding: '40px', margin: '0' }}>
        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
            <h2 style={{ color: 'var(--dark-green)', fontWeight: 900, marginBottom: '20px', fontSize: '1.8rem' }}>Senha Redefinida!</h2>
            <p style={{ color: 'var(--text-main)', lineHeight: '1.6', marginBottom: '30px', fontWeight: 500 }}>
              Sua senha foi atualizada com sucesso. <br />
              Redirecionando para o login...
            </p>
          </div>
        ) : (
          <div>
            <h2 style={{ color: 'var(--dark-green)', fontWeight: 900, marginBottom: '15px', textAlign: 'center', fontSize: '2rem' }}>Nova Senha</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '25px', fontSize: '0.9rem' }}>Digite sua nova senha de acesso.</p>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Senha</label>
                <input
                  type="password"
                  required
                  placeholder="Nova senha"
                  style={{ width: '100%', padding: '14px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 'var(--border-radius-md)', fontFamily: 'inherit', fontSize: '1rem', outline: 'none' }}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Confirmar Senha</label>
                <input
                  type="password"
                  required
                  placeholder="Repita a nova senha"
                  style={{ width: '100%', padding: '14px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 'var(--border-radius-md)', fontFamily: 'inherit', fontSize: '1rem', outline: 'none' }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              
              {localError && <p style={{ color: '#e74c3c', fontWeight: 600, textAlign: 'center', marginBottom: '15px' }}>{localError}</p>}
              {error && <p style={{ color: '#e74c3c', fontWeight: 600, textAlign: 'center', marginBottom: '15px' }}>{error}</p>}
              
              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '16px', background: 'var(--dark-green)', color: 'var(--white)', border: 'none', borderRadius: 'var(--border-radius-md)', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', opacity: loading ? '0.7' : '1' }}
              >
                {loading ? 'Atualizando...' : 'Definir Nova Senha'}
              </button>
            </form>
          </div>
        )}
      </section>
    </main>
  )
}

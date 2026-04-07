import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import { useAuth } from '../../hooks/useAuth'

export const Layout = ({ children }) => {
  const { user } = useAuthContext()
  const { signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (!error) {
      setIsMenuOpen(false)
      navigate('/auth')
    }
  }

  const navLinks = [
    { name: 'Página Inicial', path: '/' },
    { name: 'Projetos Ecológicos', path: '/projects' },
    { name: 'Pesquisa e Dados', path: '/data' },
    { name: 'EcologIA', path: '/ai' },
    { name: 'Comunidade', path: '/community' },
  ]

  const SidebarContent = () => (
    <>
      <div className="sidebar-top">
        <div className="logo">
          <img src="/logo.png" alt="logo" />
          <div>VOZ DA<br />TERRA</div>
        </div>
        
        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span><span></span><span></span>
        </button>

        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link 
                  to={link.path} 
                  className={location.pathname === link.path ? 'active' : ''}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            
            {user && (
              <>
                <li>
                  <Link to="/content/new?type=article" className="btn-create" onClick={() => setIsMenuOpen(false)}>
                    + Artigo
                  </Link>
                </li>
                <li>
                  <Link to="/content/new?type=project" className="btn-create" onClick={() => setIsMenuOpen(false)}>
                    + Projeto
                  </Link>
                </li>
              </>
            )}
            
            <li>
              <a href="/aplicativo.apk" className="btn-app">Baixar APP</a>
            </li>
          </ul>

          <div className="sidebar-auth-mobile">
            {user ? (
              <div className="user-profile-menu">
                <div className="user-info">
                  <span className="user-name">Olá, {user.user_metadata?.nome?.split(' ')[0] || user.email.split('@')[0]}</span>
                  <span className="user-role">{user.user_metadata?.role || 'user'}</span>
                </div>
                <button type="button" onClick={handleSignOut} className="logout-link" style={{ background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                  Sair da Conta
                </button>
              </div>
            ) : (
              <div className="auth-menu">
                <Link to="/auth" className="login-link">Acessar Conta</Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className="sidebar-bottom desktop-only">
        {user ? (
          <div className="user-profile-menu">
            <div className="user-info">
              <span className="user-name">Olá, {user.user_metadata?.nome?.split(' ')[0] || user.email.split('@')[0]}</span>
              <span className="user-role">{user.user_metadata?.role || 'user'}</span>
            </div>
            <button type="button" onClick={handleSignOut} className="logout-link" style={{ background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
              Sair da Conta
            </button>
          </div>
        ) : (
          <div className="auth-menu">
            <Link to="/auth" className="login-link">Acessar Conta</Link>
          </div>
        )}
      </div>
    </>
  )

  return (
    <>
      <aside className="sidebar">
        <SidebarContent />
      </aside>
      
      <main className="content">
        {children}
      </main>
    </>
  )
}

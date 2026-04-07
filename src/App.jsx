import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuthContext } from './context/AuthContext'
import { Layout } from './components/layout/Layout'

// Pages
import { Home } from './pages/Home'
import { Auth } from './pages/Auth'
import { Projects } from './pages/Projects'
import { DataMonitoring } from './pages/DataMonitoring'
import { EcoLogIA } from './pages/EcoLogIA'
import { ContentForm } from './pages/ContentForm'
import { ContentDetail } from './pages/ContentDetail'
import { ResetPassword } from './pages/ResetPassword'
import { Chat } from './pages/Chat' // Optional Real-time chat

const AppRoutes = () => {
  const { user, loading } = useAuthContext()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-secondary font-bold">Iniciando Voz da Terra...</p>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/data" element={<DataMonitoring />} />
          <Route path="/ai" element={<EcoLogIA />} />
          <Route path="/community" element={<Chat />} />
          <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
          
          {/* Content Pages */}
          <Route path="/article/:id" element={<ContentDetail />} />
          <Route path="/project/:id" element={<ContentDetail />} />
          <Route path="/content/new" element={<ContentForm />} />
          <Route path="/content/edit/:id" element={<ContentForm />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App

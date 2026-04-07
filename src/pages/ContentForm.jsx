import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useArticles } from '../hooks/useArticles'
import { useProjects } from '../hooks/useProjects'
import { useAuthContext } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export const ContentForm = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuthContext()
  
  const contentType = searchParams.get('type') // 'article' or 'project'
  const isEdit = !!id

  const { createArticle, updateArticle, articles } = useArticles()
  const { createProject, updateProject, projects } = useProjects()

  const [formData, setFormData] = useState({
    titulo: '',
    imagem_url: '',
    tag: '',
    conteudo: ''
  })
  const [loading, setLoading] = useState(isEdit)
  const [feedback, setFeedback] = useState({ message: '', color: '' })

  useEffect(() => {
    if (!user) {
      alert('Acesso negado. Você precisa estar logado.')
      navigate('/auth')
      return
    }

    if (isEdit) {
      const fetchItem = async () => {
        try {
          const table = contentType === 'article' ? 'artigos' : 'projetos'
          const { data, error } = await supabase.from(table).select('*').eq('id', id).single()
          if (data) {
            setFormData({
              titulo: data.titulo,
              imagem_url: data.imagem_url,
              tag: data.tag,
              conteudo: data.conteudo
            })
          }
        } catch (err) {
          console.error(err)
        } finally {
          setLoading(false)
        }
      }
      fetchItem()
    }
  }, [id, isEdit, user, contentType, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFeedback({ message: 'Publicando...', color: 'var(--text-light)' })

    const payload = {
      ...formData,
      autor_id: user.id
    }

    try {
      let result
      if (contentType === 'article') {
        result = isEdit ? await updateArticle(id, payload) : await createArticle(payload)
      } else {
        // Implement updateProject in useProjects later if not exists
        result = isEdit 
          ? await supabase.from('projetos').update(payload).eq('id', id).select()
          : await createProject(payload)
      }

      if (result.error) throw result.error

      setFeedback({ message: 'Sucesso! Redirecionando...', color: 'var(--accent-green)' })
      setTimeout(() => {
        navigate(contentType === 'article' ? '/' : '/projects')
      }, 1500)
    } catch (err) {
      setFeedback({ message: `Erro: ${err.message}`, color: '#e74c3c' })
    }
  }

  const title = isEdit ? `Editar ${contentType === 'article' ? 'Artigo' : 'Projeto'}` : `Novo ${contentType === 'article' ? 'Artigo' : 'Projeto'}`

  return (
    <section className="reading-container">
      <header className="main-header" style={{ marginBottom: '20px' }}>
        <Link to={contentType === 'article' ? '/' : '/projects'} className="back-link">← Voltar para o início</Link>
      </header>

      <article className="article-card" style={{ padding: '40px' }}>
        <h1 style={{ color: 'var(--dark-green)', marginBottom: '25px', fontWeight: 900, fontSize: '2rem' }}>
          {title}
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Título</label>
            <input
              type="text"
              required
              placeholder="Digite o título..."
              style={{ width: '100%', padding: '14px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 'var(--border-radius-md)', fontFamily: 'inherit', fontSize: '1rem', outline: 'none' }}
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>URL da Imagem</label>
            <input
              type="url"
              required
              placeholder="https://exemplo.com/imagem.jpg"
              style={{ width: '100%', padding: '14px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 'var(--border-radius-md)', fontFamily: 'inherit', fontSize: '1rem', outline: 'none' }}
              value={formData.imagem_url}
              onChange={(e) => setFormData({ ...formData, imagem_url: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Categoria (Tag)</label>
            <select
              required
              style={{ width: '100%', padding: '14px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 'var(--border-radius-md)', fontFamily: 'inherit', fontSize: '1rem', outline: 'none', background: 'white' }}
              value={formData.tag}
              onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
            >
              <option value="" disabled>Escolha uma categoria</option>
              {contentType === 'article' ? (
                <>
                  <option value="Ecossistema">Ecossistema</option>
                  <option value="Mudança Climática">Mudança Climática</option>
                  <option value="Biodiversidade">Biodiversidade</option>
                  <option value="Opinião">Opinião</option>
                </>
              ) : (
                <>
                  <option value="Arquitetura">Arquitetura</option>
                  <option value="Energia">Energia</option>
                  <option value="Reciclagem">Reciclagem</option>
                  <option value="Outros">Outros</option>
                </>
              )}
            </select>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Conteúdo</label>
            <textarea
              required
              placeholder="Escreva aqui..."
              style={{ width: '100%', padding: '14px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 'var(--border-radius-md)', fontFamily: 'inherit', fontSize: '1rem', outline: 'none', minHeight: '300px', resize: 'vertical' }}
              value={formData.conteudo}
              onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
            ></textarea>
          </div>

          {feedback.message && (
            <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '15px', textAlign: 'center', color: feedback.color }}>
              {feedback.message}
            </p>
          )}

          <button
            type="submit"
            style={{ width: '100%', padding: '16px', background: 'var(--dark-green)', color: 'var(--white)', border: 'none', borderRadius: 'var(--border-radius-md)', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}
          >
            {isEdit ? 'Salvar Alterações' : 'Publicar'}
          </button>
        </form>
      </article>
    </section>
  )
}

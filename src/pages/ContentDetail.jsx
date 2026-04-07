import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const ContentDetail = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const contentType = searchParams.get('type') || 'article'
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      const table = contentType === 'article' ? 'artigos' : 'projetos'
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*, usuarios(nome, email)')
          .eq('id', id)
          .single()
        
        if (error) throw error
        setItem(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [id, contentType])

  if (loading) return (
    <section className="reading-container">
      <p>Carregando conteúdo do banco de dados...</p>
    </section>
  )

  if (!item) return (
    <section className="reading-container">
      <h2>Conteúdo não localizado.</h2>
      <Link to="/" className="read-more">Voltar para Início</Link>
    </section>
  )

  return (
    <section className="reading-container">
      <header className="main-header" style={{ marginBottom: '20px' }}>
        <Link to={contentType === 'article' ? '/' : '/projects'} className="back-link">
          {contentType === 'article' ? '← Voltar para o início' : '← Voltar para Projetos'}
        </Link>
      </header>

      <article className="article-card full-article">
        <img 
          src={item.imagem_url || 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80'} 
          className="article-image-full" 
          alt="Capa" 
        />
        <div className="article-body">
          <span className="category-tag">{item.tag || 'Geral'}</span>
          <h1 style={{ margin: '30px 0 20px', fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--dark-green)', fontWeight: 900 }}>
            {item.titulo}
          </h1>
          <div className="article-meta" style={{ display: 'flex', gap: '10px', color: 'var(--text-light)', marginBottom: '30px' }}>
            <span>Por <strong>{item.usuarios?.nome || 'Equipe Voz da Terra'}</strong></span>
            •
            <span>{format(new Date(item.data_publicacao || item.data_criacao), "dd 'de' MMM, yyyy", { locale: ptBR })}</span>
          </div>
          <div className="article-content" style={{ fontSize: '1.15rem', lineHeight: '1.8', textAlign: 'justify' }}>
            {item.conteudo.split('\n').map((p, i) => (
              <p key={i} style={{ marginBottom: '25px' }}>{p}</p>
            ))}
          </div>
        </div>
      </article>
    </section>
  )
}

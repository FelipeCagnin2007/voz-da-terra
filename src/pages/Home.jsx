import React, { useEffect, useState } from 'react'
import { useArticles } from '../hooks/useArticles'
import { useAuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export const Home = () => {
  const { articles, loading, fetchArticles, deleteArticle } = useArticles()
  const { user } = useAuthContext()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase().trim()
    setSearchTerm(term)
    fetchArticles(term)
  }

  const handleDelete = async (id, e) => {
    e.preventDefault()
    if (window.confirm("Deseja realmente excluir este artigo?")) {
      const { error } = await deleteArticle(id)
      if (!error) fetchArticles(searchTerm)
    }
  }

  // Logic to separate featured and secondary
  const featuredArticle = articles.length > 0 ? articles[0] : null
  const secondaryArticles = articles.length > 1 ? articles.slice(1) : []

  return (
    <section className="feed-container">
      <header className="blog-header">
        <h1>Principais Artigos</h1>
        <p style={{ color: 'var(--text-light)', marginTop: '-10px', marginBottom: '30px' }}>
          Acompanhe os principais artigos sobre o meio ambiente.
        </p>
        
        <div className="search-box" style={{ marginBottom: '30px' }}>
          <input 
            type="text" 
            className="generic-search-input"
            placeholder="Pesquisar artigos por título, conteúdo ou tag..." 
            style={{ 
              width: '100%', 
              maxWidth: '500px', 
              padding: '12px 20px', 
              border: '1px solid #ccc', 
              borderRadius: '8px', 
              fontSize: '1rem' 
            }}
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </header>

      {loading && <p>Sincronizando artigos...</p>}

      {!loading && articles.length === 0 && <p>Nenhum artigo encontrado.</p>}

      {!loading && articles.length > 0 && (
        <div className="articles-list">
          {/* 1. FEATURED ARTICLE (O primeiro da lista) */}
          {featuredArticle && (
             <article className="article-card featured" style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '10px', zIndex: 10 }}>
                  {(user && (user.email === featuredArticle.usuarios?.email || user.user_metadata?.role === 'admin')) && (
                    <>
                      <Link 
                        to={`/content/edit/${featuredArticle.id}?type=article`} 
                        style={{ background: '#f39c12', color: 'white', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold' }}
                      >
                        Editar
                      </Link>
                      <button 
                        onClick={(e) => handleDelete(featuredArticle.id, e)}
                        style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold' }}
                      >
                        Excluir
                      </button>
                    </>
                  )}
                </div>

                <img 
                  src={featuredArticle.imagem_url || 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80'} 
                  className="article-image" 
                  alt="Capa do Artigo" 
                />
                
                <div className="article-body">
                  <span className="category-tag">{featuredArticle.tag || 'Ecossistema'}</span>
                  <h2 className="title" style={{ margin: '10px 0', fontSize: '2rem' }}>{featuredArticle.titulo}</h2>
                  <p className="excerpt" style={{ color: 'var(--text-light)', marginBottom: '20px' }}>
                    {featuredArticle.conteudo.substring(0, 200)}...
                  </p>
                  <Link to={`/article/${featuredArticle.id}?type=article`} className="read-more">Ler artigo completo →</Link>
                </div>
              </article>
          )}

          {/* 2. SECONDARY ARTICLES (O restante no grid) */}
          {secondaryArticles.length > 0 && (
            <div className="secondary-articles">
              {secondaryArticles.map((article) => {
                const isOwner = user && user.email === article.usuarios?.email
                const isAdmin = user && user.user_metadata?.role === 'admin'

                return (
                  <article key={article.id} className="article-card" style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '5px', zIndex: 10 }}>
                      {(isOwner || isAdmin) && (
                        <>
                          <Link 
                            to={`/content/edit/${article.id}?type=article`} 
                            style={{ background: '#f39c12', color: 'white', padding: '5px 10px', borderRadius: '6px', fontSize: '0.7rem' }}
                          >
                            Edit
                          </Link>
                          <button 
                            onClick={(e) => handleDelete(article.id, e)}
                            style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '0.7rem' }}
                          >
                            Del
                          </button>
                        </>
                      )}
                    </div>

                    <img 
                      src={article.imagem_url || 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80'} 
                      className="article-image" 
                      alt="Capa" 
                    />
                    
                    <div className="article-body">
                      <span className="category-tag">{article.tag || 'Ecossistema'}</span>
                      <h3 className="title" style={{ margin: '10px 0', fontSize: '1.4rem' }}>{article.titulo}</h3>
                      <p className="excerpt" style={{ color: 'var(--text-light)', marginBottom: '15px', fontSize: '0.9rem' }}>
                        {article.conteudo.substring(0, 100)}...
                      </p>
                      <Link to={`/article/${article.id}?type=article`} className="read-more">Ler mais →</Link>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

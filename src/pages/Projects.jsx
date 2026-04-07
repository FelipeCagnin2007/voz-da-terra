import React, { useEffect, useState } from 'react'
import { useProjects } from '../hooks/useProjects'
import { useAuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export const Projects = () => {
  const { projects, loading, fetchProjects, deleteProject } = useProjects()
  const { user } = useAuthContext()

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleDelete = async (id, e) => {
    e.preventDefault()
    if (window.confirm("Deseja realmente excluir este projeto?")) {
      const { error } = await deleteProject(id)
      if (!error) fetchProjects()
    }
  }

  // Identical logic to articles
  const featuredProject = projects.length > 0 ? projects[0] : null
  const secondaryProjects = projects.length > 1 ? projects.slice(1) : []

  return (
    <section className="feed-container">
      <header className="blog-header">
        <h1>Projetos Ecológicos</h1>
        <p style={{ color: 'var(--text-light)', marginTop: '-10px', marginBottom: '30px' }}>
          Explore e contribua com causas que fazem a diferença.
        </p>
      </header>

      {loading && <p>Cuidando dos projetos...</p>}

      {!loading && projects.length === 0 && <p>Nenhum projeto encontrado.</p>}

      {!loading && projects.length > 0 && (
        <div className="articles-list">
          {/* 1. FEATURED PROJECT (Identical to featured article) */}
          {featuredProject && (
             <article className="article-card featured" style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '10px', zIndex: 10 }}>
                  {(user && (user.id === featuredProject.autor_id || user.user_metadata?.role === 'admin')) && (
                    <>
                      <Link 
                        to={`/content/edit/${featuredProject.id}?type=project`} 
                        style={{ background: '#f39c12', color: 'white', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold' }}
                      >
                        Editar
                      </Link>
                      <button 
                        onClick={(e) => handleDelete(featuredProject.id, e)}
                        style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold' }}
                      >
                        Excluir
                      </button>
                    </>
                  )}
                </div>

                <img 
                  src={featuredProject.imagem_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'} 
                  className="article-image" 
                  alt="Capa do Projeto" 
                />
                
                <div className="article-body">
                  <span className="category-tag">{featuredProject.tag || 'Sustentabilidade'}</span>
                  <h2 className="title" style={{ margin: '10px 0', fontSize: '2rem' }}>{featuredProject.titulo}</h2>
                  <p className="excerpt" style={{ color: 'var(--text-light)', marginBottom: '20px' }}>
                    {featuredProject.conteudo.substring(0, 200)}...
                  </p>
                  <Link to={`/article/${featuredProject.id}?type=project`} className="read-more">Ler mais sobre este projeto →</Link>
                </div>
              </article>
          )}

          {/* 2. SECONDARY PROJECTS (Identical to secondary articles) */}
          {secondaryProjects.length > 0 && (
            <div className="secondary-articles">
              {secondaryProjects.map((project) => {
                const isOwner = user && user.id === project.autor_id
                const isAdmin = user && user.user_metadata?.role === 'admin'

                return (
                  <article key={project.id} className="article-card" style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '5px', zIndex: 10 }}>
                      {(isOwner || isAdmin) && (
                        <>
                          <Link 
                            to={`/content/edit/${project.id}?type=project`} 
                            style={{ background: '#f39c12', color: 'white', padding: '5px 10px', borderRadius: '6px', fontSize: '0.7rem' }}
                          >
                            Edit
                          </Link>
                          <button 
                            onClick={(e) => handleDelete(project.id, e)}
                            style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '0.7rem' }}
                          >
                            Del
                          </button>
                        </>
                      )}
                    </div>

                    <img 
                      src={project.imagem_url || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'} 
                      className="article-image" 
                      alt="Capa" 
                    />
                    
                    <div className="article-body">
                      <span className="category-tag">{project.tag || 'Sustentabilidade'}</span>
                      <h3 className="title" style={{ margin: '10px 0', fontSize: '1.4rem' }}>{project.titulo}</h3>
                      <p className="excerpt" style={{ color: 'var(--text-light)', marginBottom: '15px', fontSize: '0.9rem' }}>
                        {project.conteudo.substring(0, 100)}...
                      </p>
                      <Link to={`/article/${project.id}?type=project`} className="read-more">Ler mais →</Link>
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

import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export const useArticles = () => {
  const [loading, setLoading] = useState(false)
  const [articles, setArticles] = useState([])
  const [error, setError] = useState(null)

  const fetchArticles = useCallback(async (searchQuery = '') => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('artigos')
        .select(`
          *,
          usuarios (nome, email)
        `)
        .order('data_publicacao', { ascending: false })

      if (searchQuery) {
        query = query.or(`titulo.ilike.%${searchQuery}%,conteudo.ilike.%${searchQuery}%,tag.ilike.%${searchQuery}%`)
      }

      const { data, error } = await query
      if (error) throw error
      setArticles(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const createArticle = useCallback(async (articleData) => {
    setLoading(true)
    const { data, error } = await supabase.from('artigos').insert([articleData]).select()
    setLoading(false)
    return { data, error }
  }, [])

  const updateArticle = useCallback(async (id, articleData) => {
    setLoading(true)
    const { data, error } = await supabase.from('artigos').update(articleData).eq('id', id).select()
    setLoading(false)
    return { data, error }
  }, [])

  const deleteArticle = useCallback(async (id) => {
    setLoading(true)
    const { error } = await supabase.from('artigos').delete().eq('id', id)
    setLoading(false)
    return { error }
  }, [])

  return { articles, loading, error, fetchArticles, createArticle, updateArticle, deleteArticle }
}

import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export const useProjects = () => {
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState([])
  const [error, setError] = useState(null)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('projetos')
        .select(`
          *,
          usuarios (nome, email)
        `)
        .order('data_criacao', { ascending: false })

      if (error) throw error
      setProjects(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const createProject = useCallback(async (projectData) => {
    setLoading(true)
    const { data, error } = await supabase.from('projetos').insert([projectData]).select()
    setLoading(false)
    return { data, error }
  }, [])

  const updateProject = useCallback(async (id, projectData) => {
    setLoading(true)
    const { data, error } = await supabase.from('projetos').update(projectData).eq('id', id).select()
    setLoading(false)
    return { data, error }
  }, [])

  const deleteProject = useCallback(async (id) => {
    setLoading(true)
    const { error } = await supabase.from('projetos').delete().eq('id', id)
    setLoading(false)
    return { error }
  }, [])

  return { projects, loading, error, fetchProjects, createProject, updateProject, deleteProject }
}

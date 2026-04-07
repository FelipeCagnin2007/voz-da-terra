import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const PAGE_SIZE = 15

export const useChat = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)

  const fetchMessages = useCallback(async (beforeTimestamp = null) => {
    const isInitial = !beforeTimestamp
    if (isInitial) setLoading(true)
    else setLoadingMore(true)

    setError(null)
    try {
      let query = supabase
        .from('chat_mensagens')
        .select(`
          id,
          mensagem,
          enviado_em,
          remetente_id,
          usuarios (
            nome,
            email
          )
        `)
        .order('enviado_em', { ascending: false })
        .limit(PAGE_SIZE)

      if (beforeTimestamp) {
        query = query.lt('enviado_em', beforeTimestamp)
      }

      const { data, error: fetchError } = await query
      if (fetchError) throw fetchError
      
      if (data.length < PAGE_SIZE) setHasMore(false)

      const reversedData = [...data].reverse()

      setMessages((prev) => {
        if (isInitial) return reversedData
        // Avoid duplicates and prepend older messages
        const filteredNew = reversedData.filter(newMsg => !prev.some(oldMsg => oldMsg.id === newMsg.id))
        return [...filteredNew, ...prev]
      })
    } catch (err) {
      console.error('Chat fetch error:', err)
      setError(err.message)
    } finally {
      if (isInitial) setLoading(false)
      else setLoadingMore(false)
    }
  }, [])

  const sendMessage = useCallback(async (content, userId, userData) => {
    // 1. Optimistic Update (Instant feedback)
    const tempId = crypto.randomUUID()
    const optimisticMessage = {
      id: tempId,
      mensagem: content,
      enviado_em: new Date().toISOString(),
      remetente_id: userId,
      usuarios: userData || { nome: 'Você', email: '' },
      isOptimistic: true
    }

    setMessages((prev) => [...prev, optimisticMessage])

    try {
      const { data, error: sendError } = await supabase
        .from('chat_mensagens')
        .insert([{ mensagem: content, remetente_id: userId }])
        .select(`
          *,
          usuarios (nome, email)
        `)
        .single()
      
      if (sendError) throw sendError

      // Replace optimistic message with real message
      setMessages((prev) => prev.map((m) => (m.id === tempId ? data : m)))
      return { data, error: null }
    } catch (err) {
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempId))
      return { data: null, error: err }
    }
  }, [])

  const subscribeToChat = useCallback(() => {
    const channel = supabase
      .channel('chat_global_realtime_optimized')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'chat_mensagens' 
      }, async (payload) => {
        // Fetch sender metadata for the new message
        const { data: userData } = await supabase
          .from('usuarios')
          .select('nome, email')
          .eq('id', payload.new.remetente_id)
          .single()

        const newMessage = { ...payload.new, usuarios: userData }
        
        setMessages((prev) => {
          if (prev.some(m => m.id === newMessage.id)) return prev
          return [...prev, newMessage]
        })
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  return { messages, loading, loadingMore, error, hasMore, fetchMessages, sendMessage, subscribeToChat }
}

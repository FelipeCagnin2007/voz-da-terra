import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export const useAuth = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const signUp = useCallback(async (email, password, metadata) => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth`
      }
    })
    setLoading(false)
    if (error) setError(error.message)
    return { data, error }
  }, [])

  const signIn = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
    return { data, error }
  }, [])

  const signOut = useCallback(async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    setLoading(false)
    if (error) setError(error.message)
    return { error }
  }, [])

  const resetPassword = useCallback(async (email) => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    if (error) setError(error.message)
    return { data, error }
  }, [])

  const updatePassword = useCallback(async (newPassword) => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })
    setLoading(false)
    if (error) setError(error.message)
    return { data, error }
  }, [])

  return { signUp, signIn, signOut, resetPassword, updatePassword, loading, error }
}

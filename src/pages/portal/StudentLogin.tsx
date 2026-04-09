import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../../stores/useStore'
import { useTranslation } from '../../locales'

const fadeIn = {
  hidden: { opacity: 0, filter: 'blur(8px)' },
  show: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

const slideUp = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export default function StudentLogin() {
  const { darkMode: dm, showToast } = useStore()
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [showResetForm, setShowResetForm] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      showToast('Please fill in all fields')
      return
    }
    setIsLoading(true)
    try {
      // Simulate login - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 800))
      showToast('Login successful!')
      // Handle successful login
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetEmail) {
      showToast('Please enter your email')
      return
    }
    setIsLoading(true)
    try {
      // Simulate reset - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 800))
      showToast('Reset link sent to your email')
      setShowResetForm(false)
      setResetEmail('')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Password reset failed')
    } finally {
      setIsLoading(false)
    }
  }
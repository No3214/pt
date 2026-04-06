import { useEffect, useState } from 'react'
import { useStore } from '../stores/useStore'

export default function Toast() {
  const msg = useStore(s => s.toastMsg)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (msg) {
      setVisible(true)
      const t = setTimeout(() => setVisible(false), 2800)
      return () => clearTimeout(t)
    }
    return undefined
  }, [msg])

  return (
    <div className={`toast ${visible ? 'show' : ''}`}>
      {msg}
    </div>
  )
}

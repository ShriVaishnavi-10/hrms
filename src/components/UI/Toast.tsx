'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  toast: {
    success: (msg: string) => void
    error: (msg: string) => void
    info: (msg: string) => void
  }
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const toast = {
    success: (msg: string) => addToast(msg, 'success'),
    error: (msg: string) => addToast(msg, 'error'),
    info: (msg: string) => addToast(msg, 'info'),
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => setToasts((prev) => prev.filter((jt) => jt.id !== t.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context.toast
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  }

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-100',
    error: 'bg-rose-50 border-rose-100',
    info: 'bg-blue-50 border-blue-100',
  }

  return (
    <div className={`pointer-events-auto flex items-center gap-4 min-w-[320px] max-w-md p-4 rounded-2xl border ${bgColors[toast.type]} shadow-xl shadow-black/5 animate-in slide-in-from-right-10 fade-in duration-300`}>
      <div className="flex-shrink-0">
        {icons[toast.type]}
      </div>
      <p className="flex-grow text-xs font-black text-foreground uppercase tracking-tight leading-tight">
        {toast.message}
      </p>
      <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-lg transition-colors text-muted hover:text-foreground">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

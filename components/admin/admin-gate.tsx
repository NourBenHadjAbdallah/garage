'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Lock, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/**
 * Frontend-only passcode gate. This is NOT real security — it simply keeps the
 * admin area hidden from casual visitors. Swap for real auth before production.
 */
const ADMIN_PASSCODE = 'apex2026'
const SESSION_KEY = 'apex-admin-unlocked'

export function AdminGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false)
  const [ready, setReady] = useState(false)
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(SESSION_KEY) === 'true')
    setReady(true)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (value === ADMIN_PASSCODE) {
      sessionStorage.setItem(SESSION_KEY, 'true')
      setUnlocked(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  function lock() {
    sessionStorage.removeItem(SESSION_KEY)
    setUnlocked(false)
    setValue('')
  }

  if (!ready) return null

  if (!unlocked) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-border p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="mt-5 font-heading text-2xl font-bold uppercase tracking-tight">
            Restricted
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter the admin passcode to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 text-left">
            <Label htmlFor="passcode" className="sr-only">
              Passcode
            </Label>
            <Input
              id="passcode"
              type="password"
              autoFocus
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                setError(false)
              }}
              placeholder="••••••••"
              className="text-center tracking-widest"
            />
            {error && (
              <p className="mt-2 text-center text-xs text-destructive">
                Incorrect passcode. Try again.
              </p>
            )}
            <Button
              type="submit"
              className="mt-4 w-full font-heading uppercase tracking-widest"
            >
              Unlock
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-2.5">
        <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          Admin session active
        </span>
        <button
          type="button"
          onClick={lock}
          className="text-xs font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
        >
          Lock
        </button>
      </div>
      {children}
    </div>
  )
}

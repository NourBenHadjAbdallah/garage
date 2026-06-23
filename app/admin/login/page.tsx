'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/admin'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Connexion impossible.')
        return
      }

      router.push(from)
      router.refresh()
    } catch {
      setError('Une erreur est survenue. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border">
        <Lock className="h-5 w-5" />
      </div>
      <h1 className="mt-4 font-heading text-2xl font-bold uppercase tracking-tight">
        Espace admin
      </h1>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        Connectez-vous pour accéder au tableau de bord.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 w-full space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="username">Nom d&apos;utilisateur</Label>
          <Input
            id="username"
            type="text"
            autoFocus
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button
          type="submit"
          disabled={loading}
          className="w-full font-heading uppercase tracking-widest"
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>
    </main>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
      <SiteFooter />
    </div>
  )
}
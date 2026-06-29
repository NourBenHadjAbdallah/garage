// app/contact/page.tsx
'use client'

import { useState } from 'react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent]       = useState(false)

  function handleField(key: keyof typeof form, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    // Simulate send — replace with your email API (Resend, EmailJS, etc.)
    await new Promise(r => setTimeout(r, 1200))
    setSending(false)
    setSent(true)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="border-b border-border bg-muted/20 px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Get in Touch</p>
        <h1 className="mt-2 font-heading text-5xl font-bold uppercase tracking-tight sm:text-6xl">Contact Us</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          Have a question about an order, a product, or just want to say hello? We'd love to hear from you.
        </p>
      </section>

      <section className="mx-auto w-full max-w-5xl flex-1 px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">

          {/* Form */}
          <div>
            <h2 className="font-heading text-2xl font-bold uppercase tracking-tight">Send a Message</h2>
            <p className="mt-2 text-sm text-muted-foreground">We usually reply within 24 hours.</p>

            {sent ? (
              <div className="mt-8 flex flex-col items-center rounded-2xl border border-border bg-muted/20 py-16 text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                <h3 className="mt-4 font-heading text-xl font-bold uppercase tracking-tight">Message Sent!</h3>
                <p className="mt-2 text-sm text-muted-foreground">Thanks {form.name.split(' ')[0]}, we'll get back to you soon.</p>
                <button
                  onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                  className="mt-6 rounded-full border border-border px-6 py-2 font-heading text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:bg-foreground hover:text-background">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" className="mt-1.5" value={form.name}
                      onChange={e => handleField('name', e.target.value)} placeholder="Ahmed Ben Ali" required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" className="mt-1.5" value={form.email}
                      onChange={e => handleField('email', e.target.value)} placeholder="ahmed@email.com" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input id="subject" className="mt-1.5" value={form.subject}
                    onChange={e => handleField('subject', e.target.value)} placeholder="Question about my order" required />
                </div>
                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" className="mt-1.5" rows={5} value={form.message}
                    onChange={e => handleField('message', e.target.value)}
                    placeholder="Tell us what's on your mind..." required />
                </div>
                <button type="submit" disabled={sending}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-3 font-heading text-sm font-bold uppercase tracking-widest text-background transition-opacity hover:opacity-90 disabled:opacity-60">
                  {sending ? 'Sending...' : <><Send className="h-4 w-4" /> Send Message</>}
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <h2 className="font-heading text-2xl font-bold uppercase tracking-tight">Contact Info</h2>

            {[
              {
                icon: Mail,
                title: 'Email',
                lines: ['support@apexposters.tn', 'We reply within 24h'],
              },
              {
                icon: Phone,
                title: 'Phone / WhatsApp',
                lines: ['+216 XX XXX XXX', 'Mon – Sat, 9am – 6pm'],
              },
              {
                icon: MapPin,
                title: 'Location',
                lines: ['Tunis, Tunisia', 'Shipping nationwide'],
              },
            ].map(item => (
              <div key={item.title} className="flex gap-4 rounded-2xl border border-border p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <item.icon className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <p className="font-heading text-sm font-bold uppercase tracking-wide">{item.title}</p>
                  {item.lines.map((line, i) => (
                    <p key={i} className={`mt-0.5 text-sm ${i === 0 ? 'text-foreground' : 'text-muted-foreground'}`}>{line}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* FAQ teaser */}
            <div className="rounded-2xl border border-border bg-muted/20 p-5">
              <p className="font-heading text-sm font-bold uppercase tracking-wide">Common Questions</p>
              <ul className="mt-3 space-y-2">
                {[
                  'How long does delivery take?',
                  'Can I return a poster?',
                  'What payment methods do you accept?',
                ].map(q => (
                  <li key={q} className="text-xs text-muted-foreground">→ {q}</li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">Delivery takes 2–4 business days. We accept D17, Flouci, bank transfer, and cash on delivery.</p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
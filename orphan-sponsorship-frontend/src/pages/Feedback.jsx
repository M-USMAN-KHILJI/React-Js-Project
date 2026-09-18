import { useEffect, useState } from 'react'
import { MessageSquareText, CheckCircle2, Quote, Mail, UserRound } from 'lucide-react'
import { submitFeedback, getPublicFeedback } from '../services/api'
import Button from '../components/ui/Button'
import Input, { Textarea } from '../components/ui/Input'
import Alert from '../components/ui/Alert'
import Spinner from '../components/ui/Spinner'

function initialsFromName(name, email) {
  const source = (name || '').trim() || (email || '').trim()
  if (!source) return 'U'
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return source.slice(0, 2).toUpperCase()
}

export default function Feedback() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [comments, setComments] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [approved, setApproved] = useState([])
  const [loadingApproved, setLoadingApproved] = useState(true)

  useEffect(() => {
    loadApproved()
  }, [])

  async function loadApproved() {
    setLoadingApproved(true)
    try {
      const res = await getPublicFeedback()
      setApproved(Array.isArray(res.data) ? res.data : [])
    } catch {
      setApproved([])
    } finally {
      setLoadingApproved(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }

    if (!comments.trim()) {
      setError('Please share a few words about your experience.')
      return
    }

    setLoading(true)
    try {
      await submitFeedback({ name, email: email.trim(), comments })
      setSubmitted(true)
      setName('')
      setEmail('')
      setComments('')
    } catch (err) {
      const data = err.response?.data
      const emailError = Array.isArray(data?.email) ? data.email[0] : null
      setError(emailError || 'Could not submit feedback. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <section className="bg-nude-800 text-nude-50">
        <div className="page-container py-14 text-center">
          <MessageSquareText className="mx-auto mb-3 text-gold-400" size={32} />
          <h1 className="text-3xl font-bold tracking-tight">Share Your Feedback</h1>
          <p className="mx-auto mt-2 max-w-lg text-sm text-nude-200">
            Your experience matters to us. Let us know what&apos;s working well and what we can
            improve.
          </p>
        </div>
      </section>

      <div className="page-container space-y-14 py-14">
        {/* Submit feedback */}
        <section>
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
              Submit Feedback
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-nude-900">
              Tell us what you think
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-nude-500">
              Submissions are reviewed by our NGO admin. Accepted feedback is published below for
              everyone to see.
            </p>
          </div>

          {submitted ? (
            <div className="ui-card mx-auto max-w-lg p-10 text-center">
              <CheckCircle2 className="mx-auto mb-4 text-gold-500" size={40} />
              <h3 className="text-xl font-semibold text-nude-900">Thank You for Your Feedback</h3>
              <p className="mt-2 text-sm text-nude-500">
                Your thoughts help us make this platform better for orphan children, donors, and
                schools alike. Our team will review your message shortly.
              </p>
              <Button variant="ghost" className="mt-6" onClick={() => setSubmitted(false)}>
                Submit another response
              </Button>
            </div>
          ) : (
            <div className="ui-card mx-auto grid max-w-5xl overflow-hidden md:grid-cols-2">
              <div
                className="min-h-[220px] bg-cover bg-center"
                style={{ backgroundImage: "url('/feedback.jpg')" }}
              />
              <div className="p-6 md:p-8">
                {error && (
                  <Alert tone="error" className="mb-4">
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <Input
                    label="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ayesha Khan"
                  />
                  <Input
                    label="Your Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                  <Textarea
                    label="Your Feedback"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={5}
                    placeholder="Tell us about your experience..."
                  />
                  <Button type="submit" variant="primary" loading={loading}>
                    {loading ? 'Submitting...' : 'Submit Feedback'}
                  </Button>
                </form>
              </div>
            </div>
          )}
        </section>

        {/* Accepted community feedback */}
        <section>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
                Community Voices
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-nude-900">
                Accepted Feedback
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-nude-500">
                Messages reviewed and approved by our NGO admin appear here.
              </p>
            </div>
            {!loadingApproved && (
              <span className="rounded-full bg-nude-100 px-3 py-1 text-xs font-semibold text-nude-600">
                {approved.length} published
              </span>
            )}
          </div>

          {loadingApproved ? (
            <div className="flex justify-center py-12">
              <Spinner label="Loading feedback..." />
            </div>
          ) : approved.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-nude-200 bg-white/70 px-6 py-12 text-center">
              <Quote className="mx-auto mb-3 text-gold-500/70" size={28} />
              <p className="text-sm font-medium text-nude-700">No published feedback yet</p>
              <p className="mt-1 text-sm text-nude-500">
                Be the first to share your experience. Accepted feedback will show here.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {approved.map((item) => (
                <article
                  key={item.id}
                  className="group relative overflow-hidden rounded-2xl border border-nude-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-gold-500/30 hover:shadow-soft"
                >
                  <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gold-500/10 blur-2xl transition group-hover:bg-gold-500/20" />
                  <Quote className="mb-4 text-gold-500/80" size={22} />
                  <p className="relative text-sm leading-relaxed text-nude-700">
                    {item.comments}
                  </p>

                  <div className="relative mt-6 flex items-center gap-3 border-t border-nude-100 pt-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-nude-800 text-xs font-bold tracking-wide text-gold-400 ring-2 ring-gold-500/30">
                      {initialsFromName(item.name, item.email)}
                    </span>
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-nude-900">
                        <UserRound size={14} className="shrink-0 text-gold-600" />
                        {item.name?.trim() || 'Community Member'}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-nude-500">
                        <Mail size={12} className="shrink-0" />
                        {item.email || 'Email not shared'}
                      </p>
                    </div>
                  </div>

                  <p className="relative mt-3 text-[11px] font-medium uppercase tracking-wide text-nude-400">
                    {new Date(item.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

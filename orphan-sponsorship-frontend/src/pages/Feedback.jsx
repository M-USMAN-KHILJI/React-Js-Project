import { useState } from 'react'
import { MessageSquareText, CheckCircle2 } from 'lucide-react'
import { submitFeedback } from '../services/api'
import Button from '../components/ui/Button'
import Input, { Textarea } from '../components/ui/Input'
import Alert from '../components/ui/Alert'

export default function Feedback() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [comments, setComments] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

  if (submitted) {
    return (
      <div className="page-container py-14">
        <div className="ui-card mx-auto max-w-lg p-10 text-center">
          <CheckCircle2 className="mx-auto mb-4 text-gold-500" size={40} />
          <h1 className="text-xl font-semibold text-nude-900">Thank You for Your Feedback</h1>
          <p className="mt-2 text-sm text-nude-500">
            Your thoughts help us make this platform better for orphan children, donors, and
            schools alike.
          </p>
          <Button variant="ghost" className="mt-6" onClick={() => setSubmitted(false)}>
            Submit another response
          </Button>
        </div>
      </div>
    )
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

      <div className="page-container py-14">
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
      </div>
    </div>
  )
}

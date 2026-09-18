import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Lock, Phone } from 'lucide-react'
import { sendOTP } from '../services/api'
import AuthLayout from '../components/ui/AuthLayout'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Alert from '../components/ui/Alert'
import { digitsOnly, isValidPhone11 } from '../utils/inputMasks'

const roleOptions = [
  { key: 'donor', short: 'DR', label: 'Donor' },
  { key: 'school', short: 'SC', label: 'School' },
  { key: 'orphan', short: 'OR', label: 'Orphan' },
  { key: 'admin', short: 'AD', label: 'NGO Admin' },
]

function isPasswordStrong(password) {
  const lengthOk = password.length >= 8
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSymbol = /[^a-zA-Z0-9]/.test(password)
  return lengthOk && hasLetter && hasNumber && hasSymbol
}

export default function Register() {
  const [role, setRole] = useState('donor')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [agree, setAgree] = useState(false)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  async function handleSendOTP(e) {
    e.preventDefault()
    setError('')

    if (!fullName || !email || !password || !phone) {
      setError('Please fill in all the required fields.')
      return
    }

    if (!isPasswordStrong(password)) {
      setError(
        'Password must be at least 8 characters and include a letter, a number, and a symbol.'
      )
      return
    }

    if (!isValidPhone11(phone)) {
      setError('Phone number should be 11 digits long. Example: 03112233445')
      return
    }

    if (!agree) {
      setError('You must agree to the Privacy Policy and Terms of Service.')
      return
    }

    const registration = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone: phone.trim(),
      role,
    }

    setLoading(true)
    try {
      await sendOTP(registration)
      sessionStorage.setItem('oests_pending_registration', JSON.stringify(registration))
      navigate('/verify-email', { state: registration })
    } catch (err) {
      const responseData = err.response?.data
      const firstError = responseData ? Object.values(responseData)[0] : null
      setError(
        Array.isArray(firstError)
          ? firstError[0]
          : 'Could not send the verification code. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const rolePicker = (
    <div className="flex flex-col items-center gap-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-nude-500">
        Select role
      </p>
      <div className="flex flex-col items-start gap-2.5">
        {roleOptions.map(({ key, short, label }) => {
          const selected = role === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => setRole(key)}
              aria-label={label}
              aria-pressed={selected}
              title={label}
              className={`group relative flex h-12 items-center overflow-hidden rounded-full border transition-all duration-300 ease-out ${
                selected
                  ? 'border-gold-500 bg-gold-500 text-white shadow-md shadow-gold-500/25'
                  : 'border-nude-200 bg-white text-nude-700 hover:border-gold-500/60 hover:bg-gold-500/5'
              }`}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center text-xs font-bold tracking-wide">
                {short}
              </span>
              <span
                className={`max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 ease-out group-hover:max-w-[7.5rem] group-hover:pr-4 group-hover:opacity-100 ${
                  selected ? 'text-white' : 'text-nude-800'
                }`}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Choose a role on the right, then verify your email to get started."
      beside={rolePicker}
      backTo="/login"
      backLabel="Back to login"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-gold-600 hover:text-gold-500">
            Login here
          </Link>
        </>
      }
    >
      {error && (
        <Alert tone="error" className="mb-4">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSendOTP} className="flex flex-col gap-4">
        <Input
          label="Full Name"
          icon={User}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="e.g. Ayesha Khan"
        />
        <Input
          label="Email Address"
          icon={Mail}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <Input
          label="Password"
          icon={Lock}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimum 8 characters"
          hint="Must include a letter, a number, and a symbol."
        />
        <Input
          label="Phone Number"
          icon={Phone}
          type="tel"
          inputMode="numeric"
          value={phone}
          onChange={(e) => setPhone(digitsOnly(e.target.value, 11))}
          placeholder="03112233445"
          maxLength={11}
          hint="Enter 11 digits only. Example: 03112233445"
        />

        <label className="flex items-start gap-2 text-sm text-nude-600">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-1 accent-gold-500"
          />
          <span>
            I agree to the{' '}
            <Link to="/privacy-policy" className="font-medium text-gold-600 underline">
              Privacy Policy and Terms of Service
            </Link>
          </span>
        </label>

        <Button type="submit" variant="accent" loading={loading} className="mt-1 w-full">
          {loading ? 'Sending code...' : 'Send Verification Code'}
        </Button>
      </form>
    </AuthLayout>
  )
}

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { UploadCloud, FileText, Users } from 'lucide-react'
import { getMyStudents, submitSchoolReport, getMySubmittedReports } from '../services/api'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'
import Input, { Select, Textarea } from '../components/ui/Input'
import Alert from '../components/ui/Alert'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import SuccessNotification from '../components/SuccessNotification'
import { digitsOnly } from '../utils/inputMasks'

export default function SchoolPortal() {
  const { user } = useAuth()

  const [students, setStudents] = useState([])
  const [loadingStudents, setLoadingStudents] = useState(true)

  const [submittedReports, setSubmittedReports] = useState([])
  const [loadingReports, setLoadingReports] = useState(true)

  const [studentId, setStudentId] = useState('')
  const [reportMonth, setReportMonth] = useState('')
  const [totalDays, setTotalDays] = useState('')
  const [daysPresent, setDaysPresent] = useState('')
  const [averageMarks, setAverageMarks] = useState('')
  const [comments, setComments] = useState('')
  const [reportCard, setReportCard] = useState(null)

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showSuccessNotice, setShowSuccessNotice] = useState(false)

  useEffect(() => {
    loadStudents()
    loadSubmittedReports()
  }, [])

  async function loadStudents() {
    try {
      const response = await getMyStudents()
      setStudents(response.data)
      if (response.data.length > 0) {
        setStudentId(response.data[0].id)
      }
    } catch (err) {
      console.error('Could not load students', err)
    } finally {
      setLoadingStudents(false)
    }
  }

  async function loadSubmittedReports() {
    try {
      const response = await getMySubmittedReports()
      setSubmittedReports(response.data)
    } catch (err) {
      console.error('Could not load submitted reports', err)
    } finally {
      setLoadingReports(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!studentId || !reportMonth || !totalDays || !daysPresent) {
      setError('Please fill in the student, month, and attendance fields.')
      return
    }

    if (Number(daysPresent) > Number(totalDays)) {
      setError('Days present cannot be more than total school days.')
      return
    }

    const formData = new FormData()
    formData.append('orphan', studentId)
    formData.append('report_month', reportMonth)
    formData.append('total_school_days', totalDays)
    formData.append('days_present', daysPresent)
    formData.append('average_marks', averageMarks || 0)
    formData.append('teacher_comments', comments)
    if (reportCard) formData.append('report_card', reportCard)

    setSubmitting(true)
    try {
      await submitSchoolReport(formData)
      setMessage('Monthly report submitted successfully.')
      setShowSuccessNotice(true)
      setReportMonth('')
      setTotalDays('')
      setDaysPresent('')
      setAverageMarks('')
      setComments('')
      setReportCard(null)
      loadSubmittedReports()
    } catch (err) {
      const responseData = err.response?.data
      const firstError = responseData ? Object.values(responseData)[0] : null
      setError(
        Array.isArray(firstError)
          ? firstError[0]
          : 'Could not submit the report. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <SuccessNotification
        open={showSuccessNotice}
        type="report"
        onClose={() => setShowSuccessNotice(false)}
      />

      <PageHeader
        title="School Portal"
        subtitle={user?.fullName || user?.full_name || 'School Admin'}
      />

      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <div className="ui-card-elevated p-5">
          <h2 className="mb-4 text-lg font-semibold text-nude-900">Your Enrolled Students</h2>

          {loadingStudents && <Spinner label="Loading students..." className="py-8" />}

          {!loadingStudents && students.length === 0 && (
            <EmptyState
              icon={Users}
              title="No students found"
              message="Students appear here after the NGO admin assigns them to your school."
            />
          )}

          {!loadingStudents && students.length > 0 && (
            <ul className="flex flex-col gap-2">
              {students.map((s) => (
                <li
                  key={s.id}
                  className="flex justify-between border-b border-nude-100 py-2.5 text-sm last:border-0"
                >
                  <span className="font-medium text-nude-800">{s.name}</span>
                  <span className="text-nude-500">Class {s.className}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="ui-card-elevated p-5">
          <h2 className="mb-4 text-lg font-semibold text-nude-900">Submit Monthly Report</h2>

          {error && (
            <Alert tone="error" className="mb-3">
              {error}
            </Alert>
          )}
          {message && (
            <Alert tone="success" className="mb-3">
              {message}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Select
              label="Select Student"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — Class {s.className}
                </option>
              ))}
            </Select>

            <Input
              label="Report Month"
              type="text"
              value={reportMonth}
              onChange={(e) => setReportMonth(e.target.value)}
              placeholder="e.g. April 2026"
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Total School Days"
                type="text"
                inputMode="numeric"
                value={totalDays}
                onChange={(e) => setTotalDays(digitsOnly(e.target.value, 2))}
                placeholder="e.g. 22"
              />
              <Input
                label="Days Present"
                type="text"
                inputMode="numeric"
                value={daysPresent}
                onChange={(e) => setDaysPresent(digitsOnly(e.target.value, 2))}
                placeholder="e.g. 20"
              />
            </div>

            <Input
              label="Average Marks (%)"
              type="text"
              inputMode="numeric"
              value={averageMarks}
              onChange={(e) => setAverageMarks(digitsOnly(e.target.value, 3))}
              placeholder="e.g. 85"
            />

            <Textarea
              label="Teacher Comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              placeholder="Overall remarks about the student's performance"
            />

            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-nude-300 px-3 py-4 text-sm text-nude-500 hover:border-gold-500 hover:bg-gold-500/5">
              <UploadCloud size={18} />
              {reportCard ? reportCard.name : 'Upload report card (PDF, max 5MB)'}
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => setReportCard(e.target.files[0] || null)}
              />
            </label>

            <Button type="submit" variant="primary" loading={submitting}>
              {submitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </form>
        </div>
      </div>

      <div className="ui-card-elevated overflow-hidden">
        <div className="flex items-center gap-2 border-b border-nude-100 px-5 py-4">
          <FileText size={18} className="text-gold-600" />
          <h2 className="text-lg font-semibold text-nude-900">Your Submitted Reports</h2>
        </div>

        {loadingReports && <Spinner label="Loading your reports..." className="py-10" />}

        {!loadingReports && submittedReports.length === 0 && (
          <div className="p-6">
            <EmptyState title="No reports submitted" message="Your monthly submissions will appear here." />
          </div>
        )}

        {!loadingReports && submittedReports.length > 0 && (
          <div className="overflow-x-auto">
            <table className="ui-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Month</th>
                  <th>Attendance</th>
                  <th>Marks</th>
                  <th>Submitted On</th>
                </tr>
              </thead>
              <tbody>
                {submittedReports.map((r) => (
                  <tr key={r.id}>
                    <td>{r.student_name}</td>
                    <td>{r.report_month}</td>
                    <td>{r.attendance}%</td>
                    <td>{r.average_marks}%</td>
                    <td>{new Date(r.submitted_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

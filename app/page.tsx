'use client'
import { useState, useEffect, useRef } from 'react'

const SUBJECTS = [
  { key: 'alQuran', label: 'อัล-กุรอาน' },
  { key: 'math', label: 'คณิตศาสตร์' },
]

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [grade, setGrade] = useState<{ name: string; class: string; alQuran: string; math: string } | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedSubject) {
      setError('กรุณาเลือกรายวิชาก่อน')
      return
    }
    setLoading(true)
    setError('')

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error)
    } else {
      setGrade(data)
    }
  }

  function handleLogout() {
    setGrade(null)
    setUsername('')
    setPassword('')
    setSelectedSubject('')
    setError('')
  }

  const subjectLabel = SUBJECTS.find(s => s.key === selectedSubject)?.label || ''
  const subjectValue = grade ? grade[selectedSubject as keyof typeof grade] : ''

  return (
    <main style={{ background: 'linear-gradient(145deg, #1C4D8D 0%, #4988C4 50%, #BDE8F5 100%)', position: 'relative', overflow: 'hidden' }} className="min-h-screen flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm overflow-hidden">

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #0F2854, #1C4D8D)' }} className="px-8 py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
            <span style={{ fontFamily: 'var(--font-nabla)', fontSize: 36, color: 'white', lineHeight: 1 }}>PS</span>
          </div>
          <h1 className="text-white text-xl font-bold">ผลการทดสอบ</h1>
          <p className="text-white text-sm mt-1">Prateepsassana Islamic School</p>
          <p className="text-white text-xs mt-0.5">25691/1 ครั้งที่ 1</p>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          {!grade ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1C4D8D' }}>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="รหัสนักเรียน"
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none border-2 transition-colors"
                  style={{ borderColor: '#BDE8F5', backgroundColor: '#F0F8FF' }}
                  onFocus={e => e.target.style.borderColor = '#1C4D8D'}
                  onBlur={e => e.target.style.borderColor = '#BDE8F5'}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1C4D8D' }}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="รหัสผ่าน"
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none border-2 transition-colors pr-10"
                    style={{ borderColor: '#BDE8F5', backgroundColor: '#F0F8FF' }}
                    onFocus={e => e.target.style.borderColor = '#1C4D8D'}
                    onBlur={e => e.target.style.borderColor = '#BDE8F5'}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* เลือกรายวิชา */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#1C4D8D' }}>รายวิชา</label>
                <select
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none border-2 transition-colors appearance-none"
                  style={{
                    borderColor: selectedSubject ? '#1C4D8D' : '#BDE8F5',
                    backgroundColor: '#F0F8FF',
                    color: selectedSubject ? '#1C4D8D' : '#9ca3af',
                  }}
                >
                  <option value="" disabled>เลือกรายวิชา...</option>
                  {SUBJECTS.map(subject => (
                    <option key={subject.key} value={subject.key}>{subject.label}</option>
                  ))}
                </select>
              </div>

              {error && <p className="text-red-500 text-sm text-center bg-red-50 rounded-lg py-2">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-semibold py-2.5 rounded-xl transition-opacity disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #1C4D8D, #4988C4)' }}
              >
                {loading ? 'กำลังโหลด...' : 'เข้าสู่ระบบ'}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="text-center rounded-xl py-4" style={{ backgroundColor: '#BDE8F5' }}>
                <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-lg" style={{ background: 'linear-gradient(135deg, #1C4D8D, #4988C4)' }}>
                  {grade.name.charAt(0)}
                </div>
                <p className="font-bold text-gray-800">{grade.name}</p>
                <p className="text-sm" style={{ color: '#4988C4' }}>ห้อง: {grade.class}</p>
              </div>

              <div className="flex justify-between items-center rounded-xl px-4 py-4" style={{ backgroundColor: '#EBF5FB' }}>
                <div>
                  <span className="text-sm font-medium text-gray-600">{subjectLabel}</span>
                  {selectedSubject === 'alQuran' && (
                    <p className="text-xs mt-0.5" style={{ color: '#4988C4' }}>คะแนนเต็ม 5</p>
                  )}
                  {selectedSubject === 'math' && (
                    <p className="text-xs mt-0.5" style={{ color: '#4988C4' }}>คะแนนเต็ม 30</p>
                  )}
                </div>
                <span className="font-bold text-2xl" style={{ color: '#1C4D8D' }}>{subjectValue}</span>
              </div>

              <button
                onClick={handleLogout}
                className="w-full font-medium py-2.5 rounded-xl border-2 transition-colors text-sm"
                style={{ borderColor: '#BDE8F5', color: '#4988C4' }}
              >
                ออกจากระบบ
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [grade, setGrade] = useState<{ id: string; name: string; alQuran: string; math: string } | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setGrade(null)

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

  return (
    <main style={{ backgroundColor: '#FFDBFD' }} className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm overflow-hidden">

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #6367FF, #8494FF)' }} className="px-8 py-8 text-center">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c0 2 6 3 6 3s6-1 6-3v-5"/>
            </svg>
          </div>
          <h1 className="text-white text-xl font-bold">ระบบตรวจสอบเกรด</h1>
          <p className="text-white/70 text-sm mt-1">กรอกข้อมูลเพื่อเข้าสู่ระบบ</p>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          {!grade ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#6367FF' }}>
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="รหัสนักเรียน"
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none border-2 transition-colors"
                  style={{ borderColor: '#C9BEFF', backgroundColor: '#faf9ff' }}
                  onFocus={e => e.target.style.borderColor = '#6367FF'}
                  onBlur={e => e.target.style.borderColor = '#C9BEFF'}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#6367FF' }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="รหัสผ่าน"
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none border-2 transition-colors pr-10"
                    style={{ borderColor: '#C9BEFF', backgroundColor: '#faf9ff' }}
                    onFocus={e => e.target.style.borderColor = '#6367FF'}
                    onBlur={e => e.target.style.borderColor = '#C9BEFF'}
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

              {error && (
                <p className="text-red-500 text-sm text-center bg-red-50 rounded-lg py-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-semibold py-2.5 rounded-xl transition-opacity disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #6367FF, #8494FF)' }}
              >
                {loading ? 'กำลังโหลด...' : 'เข้าสู่ระบบ'}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Student info */}
              <div className="text-center rounded-xl py-4" style={{ backgroundColor: '#FFDBFD' }}>
                <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-lg" style={{ background: 'linear-gradient(135deg, #6367FF, #8494FF)' }}>
                  {grade.name.charAt(0)}
                </div>
                <p className="font-bold text-gray-800">{grade.name}</p>
                <p className="text-sm" style={{ color: '#8494FF' }}>รหัส: {grade.id}</p>
              </div>

              {/* Grades */}
              <div className="space-y-3">
                <div className="flex justify-between items-center rounded-xl px-4 py-3" style={{ backgroundColor: '#f5f4ff' }}>
                  <span className="text-sm font-medium text-gray-600">อัล-กุรอาน</span>
                  <span className="font-bold text-lg" style={{ color: '#6367FF' }}>{grade.alQuran}</span>
                </div>
                <div className="flex justify-between items-center rounded-xl px-4 py-3" style={{ backgroundColor: '#f5f4ff' }}>
                  <span className="text-sm font-medium text-gray-600">คณิตศาสตร์</span>
                  <span className="font-bold text-lg" style={{ color: '#6367FF' }}>{grade.math}</span>
                </div>
              </div>

              <button
                onClick={() => { setGrade(null); setUsername(''); setPassword('') }}
                className="w-full font-medium py-2.5 rounded-xl border-2 transition-colors text-sm"
                style={{ borderColor: '#C9BEFF', color: '#8494FF' }}
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

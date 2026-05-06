'use client'
import { useState, useEffect, useRef } from 'react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [grade, setGrade] = useState<{ name: string; class: string; username: string; alQuran: string; math: string; avgAlQuran: string; avgMath: string; schoolAvgAlQuran: string; schoolAvgMath: string } | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
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
    setLoading(true)
    setError('')

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error)
    } else {
      setCountdown(4)
      let count = 4
      const timer = setInterval(() => {
        count -= 1
        if (count === 0) {
          clearInterval(timer)
          setCountdown(null)
          setGrade(data)
        } else {
          setCountdown(count)
        }
      }, 800)
    }
  }

  function getMathLevel(score: string) {
    if (!score || score === 'N/A') return { label: 'ยังไม่ได้ทดสอบ', color: '#9ca3af' }
    const n = parseFloat(score)
    if (n >= 55) return { label: 'ยอดเยี่ยม', color: '#16a34a' }
    if (n >= 45) return { label: 'ดีมาก', color: '#2563eb' }
    if (n >= 30) return { label: 'ดี', color: '#7c3aed' }
    if (n >= 20) return { label: 'พัฒนาได้', color: '#d97706' }
    if (n >= 0)  return { label: 'ต้องเร่งพัฒนา', color: '#dc2626' }
    return { label: 'ยังไม่ได้ทดสอบ', color: '#9ca3af' }
  }

  function getAlQuranLevel(score: string) {
    if (!score || score === 'N/A') return { label: 'ยังไม่ได้ทดสอบ', color: '#9ca3af' }
    const n = parseFloat(score)
    if (n === 5)  return { label: 'ยอดเยี่ยม', color: '#16a34a' }
    if (n === 4)  return { label: 'ดีมาก', color: '#2563eb' }
    if (n === 3)  return { label: 'ดี', color: '#7c3aed' }
    if (n === 2)  return { label: 'พัฒนาได้', color: '#d97706' }
    if (n <= 1)   return { label: 'ต้องเร่งพัฒนา', color: '#dc2626' }
    return { label: 'ยังไม่ได้ทดสอบ', color: '#9ca3af' }
  }

  return (
    <main style={{ background: 'linear-gradient(145deg, #0F2854 0%, #1C4D8D 60%, #4988C4 100%)', position: 'relative', overflow: 'hidden' }} className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm overflow-hidden" style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #0F2854, #1C4D8D)' }} className="px-8 py-8 text-center">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-3 overflow-hidden">
            <img src="/logo.jpeg" alt="logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-white text-xl font-bold">ผลการทดสอบ</h1>
          <p className="text-white text-sm mt-1">Prateepsassana Islamic School</p>
          <p className="text-white text-xs mt-0.5">25691/1 ครั้งที่ 1</p>
        </div>

        {/* Body */}
        <div className="px-8 py-6" style={{ background: 'radial-gradient(ellipse at 0% 0%, #1C4D8D 0%, transparent 65%), #ffffff' }}>
          {countdown !== null ? (
            <div className="flex flex-col items-center justify-center" style={{ height: 200 }}>
              <span className="font-bold text-center" style={{ fontSize: 28, color: '#1C4D8D', lineHeight: 1.4, display: 'inline-block' }}>
                {countdown === 4 ? 'Subhanallah' : countdown === 3 ? 'Alhamdulillah' : countdown === 2 ? 'Lailahaillallah' : 'Allahu Akbar'}
              </span>
            </div>
          ) : !grade ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#000000' }}>Sign In</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="กรอกรหัสนักเรียน"
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none border-2 transition-colors"
                  style={{ borderColor: '#BDE8F5', backgroundColor: '#F0F8FF' }}
                  onFocus={e => e.target.style.borderColor = '#1C4D8D'}
                  onBlur={e => e.target.style.borderColor = '#BDE8F5'}
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm text-center bg-red-50 rounded-lg py-2">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-semibold py-2.5 rounded-xl transition-opacity disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #0F2854, #1C4D8D)' }}
              >
                {loading ? 'กำลังโหลด...' : 'ตรวจสอบผลคะแนน'}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Student info */}
              <div className="flex items-center gap-4 rounded-xl px-4 py-4" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #A8D4F5 100%)' }}>
                <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-lg" style={{ background: 'linear-gradient(135deg, #0F2854, #1C4D8D)' }}>
                  {grade.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{grade.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#000000' }}>รหัสนักเรียน: {grade.username}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#000000' }}>ห้อง: {grade.class}</p>
                </div>
              </div>

              {/* Grades */}
              <div className="space-y-3">
                <div className="flex justify-between items-center rounded-xl px-4 py-4" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #A8D4F5 100%)' }}>
                  <div>
                    <p className="text-base font-bold text-gray-900">อัล-กุรอาน</p>
                    <p className="text-xs mt-0.5" style={{ color: '#000000' }}>คะแนนเต็ม 5</p>
                    <p className="text-xs mt-0.5" style={{ color: '#000000' }}>คะแนนเฉลี่ยทั้งห้อง: {grade.avgAlQuran}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#000000' }}>คะแนนเฉลี่ยทั้งโรงเรียน: {grade.schoolAvgAlQuran}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium" style={{ color: '#4988C4' }}>คะแนนที่ได้</p>
                    <p className="text-2xl font-bold" style={{ color: '#000000' }}>{grade.alQuran}</p>
                    <p className="text-xs font-semibold mt-1" style={{ color: getAlQuranLevel(grade.alQuran).color }}>
                      {getAlQuranLevel(grade.alQuran).label}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center rounded-xl px-4 py-4" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #A8D4F5 100%)' }}>
                  <div>
                    <p className="text-base font-bold text-gray-900">คณิตศาสตร์</p>
                    <p className="text-xs mt-0.5" style={{ color: '#000000' }}>คะแนนเต็ม 60</p>
                    <p className="text-xs mt-0.5" style={{ color: '#000000' }}>คะแนนเฉลี่ยทั้งห้อง: {grade.avgMath}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#000000' }}>คะแนนเฉลี่ยทั้งโรงเรียน: {grade.schoolAvgMath}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium" style={{ color: '#4988C4' }}>คะแนนที่ได้</p>
                    <p className="text-2xl font-bold" style={{ color: '#000000' }}>{grade.math}</p>
                    <p className="text-xs font-semibold mt-1" style={{ color: getMathLevel(grade.math).color }}>
                      {getMathLevel(grade.math).label}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => { setGrade(null); setUsername(''); setError('') }}
                className="w-full font-medium py-2.5 rounded-xl border-2 transition-colors text-sm"
                style={{ borderColor: '#BDE8F5', color: '#000000' }}
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

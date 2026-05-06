'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [grade, setGrade] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">ตรวจสอบเกรด</h1>

        {!grade ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'กำลังโหลด...' : 'เข้าสู่ระบบ'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-500 text-sm">ชื่อ-นามสกุล</p>
              <p className="font-semibold text-gray-800 text-lg">{grade.name}</p>
              <p className="text-gray-400 text-sm">รหัส: {grade.id}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Al-Quran</span>
                <span className="font-bold text-blue-600 text-lg">{grade.alQuran}</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Math</span>
                <span className="font-bold text-blue-600 text-lg">{grade.math}</span>
              </div>
            </div>
            <button
              onClick={() => { setGrade(null); setUsername(''); setPassword('') }}
              className="w-full border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ออกจากระบบ
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

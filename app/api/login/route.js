import { google } from 'googleapis'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { username, password } = await request.json()

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    })

    const sheets = google.sheets({ version: 'v4', auth })

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'grade-2569-1!A2:F',
    })

    const rows = response.data.values
    if (!rows) return NextResponse.json({ error: 'ไม่พบข้อมูล' }, { status: 404 })

    const student = rows.find(row => row[2] === username && row[3] === password)

    if (!student) {
      return NextResponse.json({ error: 'Username หรือ Password ไม่ถูกต้อง' }, { status: 401 })
    }

    return NextResponse.json({
      name: student[0],
      class: student[1],
      alQuran: student[4],
      math: student[5],
    })
  } catch (err) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด กรุณาลองใหม่' }, { status: 500 })
  }
}

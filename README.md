# Rookie auth

A simple helper for managing encrypted sessions in Node.js applications.

## Installation

```sh
npm install rookie-auth
```

## Usage example

```javascript
import express from 'express'
import {
  encryptSession,
  decryptSession,
  setSessionCookie,
  clearSessionCookie,
  getSessionCookie,
} from 'rookie-auth'
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.json())
app.use(cookieParser())

app.post('/login', async (req, res) => {
  const { userId } = req.body
  const token = await encryptSession({ userId })
  setSessionCookie(res, token)
  res.json({ success: true })
})

app.get('/profile', async (req, res) => {
  const token = getSessionCookie(req)
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const session = await decryptSession(token)
  res.json({ userId: session.userId })
})

app.post('/logout', (req, res) => {
  clearSessionCookie(res)
  res.json({ success: true })
})

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
```

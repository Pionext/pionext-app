import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { compare } from 'bcrypt'

interface LoginRequest {
  email: string
  password: string
}

export async function POST(request: Request) {
  try {
    const body: LoginRequest = await request.json()
    const { email, password } = body

    console.log('Login attempt for email:', email)

    // Read users from users.json
    const usersFilePath = path.join(process.cwd(), 'data', 'users.json')
    const userData = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'))
    
    // Find user
    const user = userData.users.find((u: any) => u.email === email)
    if (!user) {
      console.log('User not found:', email)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    console.log('Found user:', { ...user, passwordHash: '[HIDDEN]' })

    // Verify password
    const isValidPassword = await compare(password, user.passwordHash)
    console.log('Password validation result:', isValidPassword)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Return user data (excluding sensitive information)
    const { passwordHash, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
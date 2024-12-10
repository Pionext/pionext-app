import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { hash } from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

interface RegisterRequest {
  email: string
  password: string
  name: string
}

export async function POST(request: Request) {
  try {
    const body: RegisterRequest = await request.json()
    const { email, password, name } = body

    // Read existing users
    const authFilePath = path.join(process.cwd(), 'data', 'auth.json')
    const authData = JSON.parse(fs.readFileSync(authFilePath, 'utf-8'))

    // Check if user already exists
    if (authData.users.some((u: any) => u.email === email)) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await hash(password, 10)

    // Create new user
    const newUser = {
      id: uuidv4(),
      email,
      passwordHash,
      name,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    }

    // Add to users array
    authData.users.push(newUser)

    // Save updated users
    fs.writeFileSync(authFilePath, JSON.stringify(authData, null, 2))

    // Return user data (excluding password)
    const { passwordHash: _, ...userWithoutPassword } = newUser
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
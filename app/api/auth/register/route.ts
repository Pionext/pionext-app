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
    const usersFilePath = path.join(process.cwd(), 'data', 'users.json')
    const userData = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'))

    // Check if user already exists
    if (userData.users.some((u: any) => u.email === email)) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await hash(password, 10)

    // Generate username from email
    const username = email.split('@')[0].toLowerCase()

    // Create new user
    const newUser = {
      id: uuidv4(),
      email,
      passwordHash,
      username,
      name,
      bio: null,
      role: "user",
      joinedAt: new Date().toISOString()
    }

    // Add to users array
    userData.users.push(newUser)

    // Save updated users
    fs.writeFileSync(usersFilePath, JSON.stringify(userData, null, 2))

    // Return user data (excluding sensitive information)
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
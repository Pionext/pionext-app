import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // In a real application, you would check session tokens, cookies, etc.
    // For now, we'll just return the last logged-in user from users.json
    const usersFilePath = path.join(process.cwd(), 'data', 'users.json')
    const userData = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'))
    
    // Find the user with the most recent login
    const lastLoggedInUser = userData.users.reduce((latest: any, current: any) => {
      if (!latest || new Date(current.lastLogin) > new Date(latest.lastLogin)) {
        return current
      }
      return latest
    }, null)

    if (!lastLoggedInUser) {
      return NextResponse.json(null)
    }

    // Return user data without sensitive information
    const { passwordHash, ...userWithoutPassword } = lastLoggedInUser
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json(null)
  }
} 
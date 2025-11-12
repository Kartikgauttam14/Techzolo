// Simple in-memory user store for development
// In production, replace with proper database queries

interface User {
  id: number
  email: string
  full_name: string
  company?: string
  phone?: string
  password?: string
  created_at: Date
}

class UserStore {
  private users: Map<string, User> = new Map()
  private nextId = 1

  create(userData: Omit<User, 'id' | 'created_at'>): User {
    const user: User = {
      id: this.nextId++,
      ...userData,
      created_at: new Date()
    }
    this.users.set(user.email, user)
    return user
  }

  getByEmail(email: string): User | undefined {
    return this.users.get(email)
  }

  getById(id: number): User | undefined {
    return Array.from(this.users.values()).find(user => user.id === id)
  }

  update(email: string, updates: Partial<Omit<User, 'id' | 'email' | 'created_at'>>): User | undefined {
    const user = this.users.get(email)
    if (!user) return undefined
    
    const updatedUser = { ...user, ...updates }
    this.users.set(email, updatedUser)
    return updatedUser
  }

  delete(email: string): boolean {
    return this.users.delete(email)
  }

  getAll(): User[] {
    return Array.from(this.users.values())
  }
}

export const userStore = new UserStore()

// Export singleton instance
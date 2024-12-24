import { create } from 'zustand'

interface UserProfile {
  id: string
  email: string
  firstName?: string
  lastName?: string
  avatar?: string
  theme: 'light' | 'dark'
  createdAt: Date
  updatedAt: Date
}

interface UserState {
  user: UserProfile | null
  isLoading: boolean
  error: string | null
  fetchUser: (userId: string | string[]) => Promise<void>
  clearError: () => void
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  fetchUser: async (userId: string | string[]) => {
    try {
      set({ isLoading: true, error: null })
      
      // Make an API call instead of using Prisma directly
      const response = await fetch(`/api/users?userID=${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch user')
      }
      
      const userProfile = await response.json()
      set({ user: userProfile, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  clearError: () => set({ error: null })
}))

export default useUserStore
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
interface Job {
  id: string
  title: string
  company: {
    name: string
    logo?: string
    location?: string
  }
  location?: string
  locationType: string
  employmentType: string
  experienceLevel: string
  minSalary?: number
  maxSalary?: number
  currency: string
  description: string
  requirements?: string
  skills: { skill: { name: string } }[]
  aiMatchScore?: number
  createdAt: string
}

interface Match {
  id: string
  userId1: string
  userId2: string
  jobId?: string
  aiScore?: number
  aiInsights?: string
  lastMessageAt?: string
  createdAt: string
  user1?: {
    id: string
    name?: string
    image?: string
    profile?: { headline?: string }
  }
  user2?: {
    id: string
    name?: string
    image?: string
    profile?: { headline?: string }
  }
  job?: {
    id: string
    title: string
    company: { name: string; logo?: string }
  }
  messages?: Message[]
}

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  createdAt: string
  isRead: boolean
}

interface Notification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
  actionUrl?: string
}

// Swipe Store
interface SwipeState {
  jobs: Job[]
  currentIndex: number
  likedJobs: string[]
  passedJobs: string[]
  superLikedJobs: string[]
  isLoading: boolean
  hasMore: boolean

  setJobs: (jobs: Job[]) => void
  addJobs: (jobs: Job[]) => void
  swipeRight: (jobId: string) => void
  swipeLeft: (jobId: string) => void
  swipeUp: (jobId: string) => void
  undoSwipe: () => void
  nextCard: () => void
  reset: () => void
  setLoading: (loading: boolean) => void
  setHasMore: (hasMore: boolean) => void
}

export const useSwipeStore = create<SwipeState>()(
  persist(
    (set, get) => ({
      jobs: [],
      currentIndex: 0,
      likedJobs: [],
      passedJobs: [],
      superLikedJobs: [],
      isLoading: false,
      hasMore: true,

      setJobs: (jobs) => set({ jobs, currentIndex: 0 }),

      addJobs: (newJobs) => set((state) => ({
        jobs: [...state.jobs, ...newJobs],
      })),

      swipeRight: (jobId) => set((state) => ({
        likedJobs: [...state.likedJobs, jobId],
      })),

      swipeLeft: (jobId) => set((state) => ({
        passedJobs: [...state.passedJobs, jobId],
      })),

      swipeUp: (jobId) => set((state) => ({
        superLikedJobs: [...state.superLikedJobs, jobId],
        likedJobs: [...state.likedJobs, jobId],
      })),

      undoSwipe: () => {
        const state = get()
        if (state.currentIndex === 0) return

        const previousJob = state.jobs[state.currentIndex - 1]
        if (!previousJob) return

        set({
          currentIndex: state.currentIndex - 1,
          likedJobs: state.likedJobs.filter((id) => id !== previousJob.id),
          passedJobs: state.passedJobs.filter((id) => id !== previousJob.id),
          superLikedJobs: state.superLikedJobs.filter((id) => id !== previousJob.id),
        })
      },

      nextCard: () => set((state) => ({
        currentIndex: state.currentIndex + 1,
      })),

      reset: () => set({
        jobs: [],
        currentIndex: 0,
        likedJobs: [],
        passedJobs: [],
        superLikedJobs: [],
      }),

      setLoading: (isLoading) => set({ isLoading }),
      setHasMore: (hasMore) => set({ hasMore }),
    }),
    {
      name: 'swipe-storage',
      partialize: (state) => ({
        likedJobs: state.likedJobs,
        passedJobs: state.passedJobs,
        superLikedJobs: state.superLikedJobs,
      }),
    }
  )
)

// Matches Store
interface MatchesState {
  matches: Match[]
  selectedMatch: Match | null
  unreadCount: number
  isLoading: boolean

  setMatches: (matches: Match[]) => void
  addMatch: (match: Match) => void
  selectMatch: (match: Match | null) => void
  updateMatch: (matchId: string, updates: Partial<Match>) => void
  addMessage: (matchId: string, message: Message) => void
  markAsRead: (matchId: string) => void
  setLoading: (loading: boolean) => void
  calculateUnreadCount: () => void
}

export const useMatchesStore = create<MatchesState>()((set, get) => ({
  matches: [],
  selectedMatch: null,
  unreadCount: 0,
  isLoading: false,

  setMatches: (matches) => {
    set({ matches })
    get().calculateUnreadCount()
  },

  addMatch: (match) => set((state) => ({
    matches: [match, ...state.matches],
  })),

  selectMatch: (match) => set({ selectedMatch: match }),

  updateMatch: (matchId, updates) => set((state) => ({
    matches: state.matches.map((m) =>
      m.id === matchId ? { ...m, ...updates } : m
    ),
    selectedMatch:
      state.selectedMatch?.id === matchId
        ? { ...state.selectedMatch, ...updates }
        : state.selectedMatch,
  })),

  addMessage: (matchId, message) => set((state) => ({
    matches: state.matches.map((m) =>
      m.id === matchId
        ? {
            ...m,
            messages: [...(m.messages || []), message],
            lastMessageAt: message.createdAt,
          }
        : m
    ),
  })),

  markAsRead: (matchId) => {
    set((state) => ({
      matches: state.matches.map((m) =>
        m.id === matchId
          ? {
              ...m,
              messages: m.messages?.map((msg) => ({ ...msg, isRead: true })),
            }
          : m
      ),
    }))
    get().calculateUnreadCount()
  },

  setLoading: (isLoading) => set({ isLoading }),

  calculateUnreadCount: () => {
    const { matches } = get()
    const count = matches.reduce((acc, match) => {
      const unread = match.messages?.filter((m) => !m.isRead).length || 0
      return acc + unread
    }, 0)
    set({ unreadCount: count })
  },
}))

// Notifications Store
interface NotificationsState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean

  setNotifications: (notifications: Notification[]) => void
  addNotification: (notification: Notification) => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  removeNotification: (notificationId: string) => void
  setLoading: (loading: boolean) => void
}

export const useNotificationsStore = create<NotificationsState>()((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  setNotifications: (notifications) => {
    const unreadCount = notifications.filter((n) => !n.isRead).length
    set({ notifications, unreadCount })
  },

  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
  })),

  markAsRead: (notificationId) => set((state) => {
    const notification = state.notifications.find((n) => n.id === notificationId)
    const wasUnread = notification && !notification.isRead
    return {
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, isRead: true } : n
      ),
      unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount,
    }
  }),

  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    unreadCount: 0,
  })),

  removeNotification: (notificationId) => set((state) => {
    const notification = state.notifications.find((n) => n.id === notificationId)
    const wasUnread = notification && !notification.isRead
    return {
      notifications: state.notifications.filter((n) => n.id !== notificationId),
      unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount,
    }
  }),

  setLoading: (isLoading) => set({ isLoading }),
}))

// UI Store
interface UIState {
  sidebarOpen: boolean
  mobileMenuOpen: boolean
  theme: 'light' | 'dark' | 'system'
  swipeHints: boolean
  soundEffects: boolean

  setSidebarOpen: (open: boolean) => void
  setMobileMenuOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleSwipeHints: () => void
  toggleSoundEffects: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      mobileMenuOpen: false,
      theme: 'system',
      swipeHints: true,
      soundEffects: true,

      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
      setTheme: (theme) => set({ theme }),
      toggleSwipeHints: () => set((state) => ({ swipeHints: !state.swipeHints })),
      toggleSoundEffects: () => set((state) => ({ soundEffects: !state.soundEffects })),
    }),
    {
      name: 'ui-storage',
    }
  )
)

// Filter Store for job search
interface FilterState {
  searchQuery: string
  location: string
  locationType: string[]
  employmentType: string[]
  experienceLevel: string[]
  salaryRange: [number, number]
  skills: string[]
  industries: string[]
  companySize: string[]
  sortBy: 'relevance' | 'date' | 'salary' | 'match'

  setSearchQuery: (query: string) => void
  setLocation: (location: string) => void
  toggleLocationType: (type: string) => void
  toggleEmploymentType: (type: string) => void
  toggleExperienceLevel: (level: string) => void
  setSalaryRange: (range: [number, number]) => void
  toggleSkill: (skill: string) => void
  toggleIndustry: (industry: string) => void
  toggleCompanySize: (size: string) => void
  setSortBy: (sortBy: FilterState['sortBy']) => void
  resetFilters: () => void
}

const defaultFilters = {
  searchQuery: '',
  location: '',
  locationType: [],
  employmentType: [],
  experienceLevel: [],
  salaryRange: [0, 500000] as [number, number],
  skills: [],
  industries: [],
  companySize: [],
  sortBy: 'relevance' as const,
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      ...defaultFilters,

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setLocation: (location) => set({ location }),

      toggleLocationType: (type) => set((state) => ({
        locationType: state.locationType.includes(type)
          ? state.locationType.filter((t) => t !== type)
          : [...state.locationType, type],
      })),

      toggleEmploymentType: (type) => set((state) => ({
        employmentType: state.employmentType.includes(type)
          ? state.employmentType.filter((t) => t !== type)
          : [...state.employmentType, type],
      })),

      toggleExperienceLevel: (level) => set((state) => ({
        experienceLevel: state.experienceLevel.includes(level)
          ? state.experienceLevel.filter((l) => l !== level)
          : [...state.experienceLevel, level],
      })),

      setSalaryRange: (salaryRange) => set({ salaryRange }),

      toggleSkill: (skill) => set((state) => ({
        skills: state.skills.includes(skill)
          ? state.skills.filter((s) => s !== skill)
          : [...state.skills, skill],
      })),

      toggleIndustry: (industry) => set((state) => ({
        industries: state.industries.includes(industry)
          ? state.industries.filter((i) => i !== industry)
          : [...state.industries, industry],
      })),

      toggleCompanySize: (size) => set((state) => ({
        companySize: state.companySize.includes(size)
          ? state.companySize.filter((s) => s !== size)
          : [...state.companySize, size],
      })),

      setSortBy: (sortBy) => set({ sortBy }),

      resetFilters: () => set(defaultFilters),
    }),
    {
      name: 'filter-storage',
    }
  )
)

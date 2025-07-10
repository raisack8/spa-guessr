import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface GameRound {
  spaId: number
  imageId: number
  userGuess?: { lat: number; lng: number }
  distance?: number
  score?: number
  timeSpent?: number
}

export interface GameSession {
  sessionId: string
  rounds: GameRound[]
  currentRound: number
  totalScore: number
  status: 'playing' | 'completed' | 'abandoned'
  startedAt: Date
  completedAt?: Date
}

export interface CurrentImage {
  spa: {
    id: number
    name: string
    prefecture: string
    city: string
    latitude: string
    longitude: string
    description?: string
    features: string[]
    difficulty: string
  }
  images: {
    id: number
    fileName: string
    originalUrl: string
    optimizedUrl?: string
    thumbnailUrl?: string
    alt: string
    width?: number
    height?: number
  }[]
}

export interface GameGuess {
  lat: number
  lng: number
  timestamp: Date
}

export interface GameResult {
  distance: number
  score: number
  correctLocation: {
    lat: number
    lng: number
    name: string
    prefecture: string
    city: string
  }
  isGameComplete: boolean
  totalScore: number
  currentRound: number
  totalRounds: number
  isTimeUp?: boolean // Flag for time up scenarios
}

interface GameState {
  // Current game session
  session: GameSession | null
  currentImage: CurrentImage | null
  
  // UI state
  isLoading: boolean
  error: string | null
  isMapReady: boolean
  hasSubmittedGuess: boolean
  
  // Game mechanics
  currentGuess: GameGuess | null
  lastResult: GameResult | null
  roundStartTime: Date | null
  
  // Settings
  gameSettings: {
    timeLimit?: number // seconds
    showHints: boolean
    difficulty: 'easy' | 'medium' | 'hard'
  }
}

interface GameActions {
  // Session management
  setSession: (session: GameSession) => void
  clearSession: () => void
  
  // Image management
  setCurrentImage: (image: CurrentImage) => void
  
  // UI state
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setMapReady: (ready: boolean) => void
  
  // Game actions
  setGuess: (guess: GameGuess) => void
  clearGuess: () => void
  setResult: (result: GameResult) => void
  clearResult: () => void
  startRound: () => void
  submitGuess: () => void
  
  // Settings
  updateSettings: (settings: Partial<GameState['gameSettings']>) => void
  
  // Utility
  reset: () => void
}

const initialState: GameState = {
  session: null,
  currentImage: null,
  isLoading: false,
  error: null,
  isMapReady: false,
  hasSubmittedGuess: false,
  currentGuess: null,
  lastResult: null,
  roundStartTime: null,
  gameSettings: {
    showHints: false,
    difficulty: 'medium'
  }
}

export const useGameStore = create<GameState & GameActions>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      setSession: (session) => set({ session }, false, 'setSession'),
      
      clearSession: () => set({ 
        session: null,
        currentImage: null,
        lastResult: null,
        hasSubmittedGuess: false
      }, false, 'clearSession'),
      
      setCurrentImage: (currentImage) => set({ currentImage }, false, 'setCurrentImage'),
      
      setLoading: (isLoading) => set({ isLoading }, false, 'setLoading'),
      
      setError: (error) => set({ error }, false, 'setError'),
      
      setMapReady: (isMapReady) => set({ isMapReady }, false, 'setMapReady'),
      
      setGuess: (currentGuess) => set({ 
        currentGuess, 
        hasSubmittedGuess: false 
      }, false, 'setGuess'),
      
      clearGuess: () => set({ 
        currentGuess: null, 
        hasSubmittedGuess: false 
      }, false, 'clearGuess'),
      
      setResult: (lastResult) => set({ 
        lastResult, 
        hasSubmittedGuess: true 
      }, false, 'setResult'),
      
      clearResult: () => set({ 
        lastResult: null, 
        hasSubmittedGuess: false 
      }, false, 'clearResult'),
      
      startRound: () => set({ 
        roundStartTime: new Date(),
        currentGuess: null,
        lastResult: null,
        hasSubmittedGuess: false,
        error: null
      }, false, 'startRound'),
      
      submitGuess: () => {
        const { currentGuess } = get()
        if (currentGuess) {
          set({ hasSubmittedGuess: true }, false, 'submitGuess')
        }
      },
      
      updateSettings: (newSettings) => set((state) => ({
        gameSettings: { ...state.gameSettings, ...newSettings }
      }), false, 'updateSettings'),
      
      reset: () => set(initialState, false, 'reset')
    }),
    {
      name: 'spa-guessr-game'
    }
  )
)

// Selectors for computed values
export const useGameSelectors = () => {
  const store = useGameStore()
  
  return {
    // Game progress
    gameProgress: store.session ? (store.session.currentRound / store.session.rounds.length) * 100 : 0,
    
    // Current round info
    currentRoundNumber: store.session ? store.session.currentRound + 1 : 0,
    totalRounds: store.session ? store.session.rounds.length : 0,
    
    // Time spent in current round
    timeSpent: store.roundStartTime ? 
      Math.floor((Date.now() - store.roundStartTime.getTime()) / 1000) : 0,
    
    // Game completion status
    isGameComplete: store.session ? store.session.status === 'completed' : false,
    
    // Can submit guess
    canSubmitGuess: !!(store.currentGuess && !store.hasSubmittedGuess && store.isMapReady),
    
    // Score info
    averageScore: store.session && store.session.currentRound > 0 ? 
      Math.round(store.session.totalScore / store.session.currentRound) : 0
  }
} 
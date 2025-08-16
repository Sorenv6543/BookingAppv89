// Type definitions for Claro Calendar System

export type TimeSlot = 'morning' | 'afternoon' | 'evening'
export type JobStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
export type CleanerStatus = 'available' | 'busy' | 'offline'
export type Priority = 'low' | 'normal' | 'high' | 'urgent'
export type ViewMode = 'cleaners' | 'properties'

export interface Cleaner {
  id: string
  name: string
  email?: string
  phone?: string
  avatar_url?: string
  status: CleanerStatus
  availability: WeekAvailability
  skills: string[]
  rating: number
  location?: Location
  created_at?: string
  updated_at?: string
}

export interface WeekAvailability {
  monday: DayAvailability
  tuesday: DayAvailability
  wednesday: DayAvailability
  thursday: DayAvailability
  friday: DayAvailability
  saturday: DayAvailability
  sunday: DayAvailability
}

export interface DayAvailability {
  morning: boolean
  afternoon: boolean
  evening?: boolean
}

export interface Job {
  id: string
  property_id: string
  property?: Property
  cleaner_id?: string
  cleaner?: Cleaner
  scheduled_date: string
  time_slot: TimeSlot
  status: JobStatus
  priority: Priority
  is_same_day_turn: boolean
  duration_minutes: number
  checklist?: ChecklistItem[]
  photos?: string[]
  notes?: string
  created_at?: string
  updated_at?: string
}

export interface Property {
  id: string
  name: string
  address: string
  location?: Location
  bedrooms?: number
  bathrooms?: number
  square_feet?: number
  cleaning_fee?: number
  owner_id: string
  owner?: User
  integration_ids?: IntegrationIds
  default_checklist?: ChecklistItem[]
  created_at?: string
  updated_at?: string
}

export interface Location {
  lat: number
  lng: number
  address?: string
}

export interface ChecklistItem {
  id: string
  task: string
  completed: boolean
  required: boolean
  category?: string
  estimated_time?: number
}

export interface IntegrationIds {
  airbnb?: string
  vrbo?: string
  booking?: string
  [key: string]: string | undefined
}

export interface User {
  id: string
  email: string
  name: string
  role: 'owner' | 'admin' | 'cleaner'
  phone?: string
  company_name?: string
  created_at?: string
  updated_at?: string
}

export interface AISuggestion {
  cleaner_id: string
  cleaner?: Cleaner
  score: number
  reasoning: string
  factors: SuggestionFactors
  recommended_date?: string
  recommended_slot?: TimeSlot
}

export interface SuggestionFactors {
  distance_score: number
  availability_score: number
  workload_score: number
  skill_match_score: number
  performance_score: number
  same_day_turn_score?: number
}

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource?: {
    job?: Job
    cleaner?: Cleaner
    property?: Property
  }
  className?: string
  draggable?: boolean
}

export interface Notification {
  id?: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
  action?: {
    label: string
    handler: () => void
  }
}

export interface DragDropContext {
  draggedJob: Job | null
  sourceSlot?: {
    cleanerId: string
    date: string
    slot: TimeSlot
  }
  targetSlot?: {
    cleanerId: string
    date: string
    slot: TimeSlot
  }
}

export interface CalendarFilter {
  cleanerIds?: string[]
  propertyIds?: string[]
  statuses?: JobStatus[]
  dateRange?: {
    start: string
    end: string
  }
  showOnlyTurns?: boolean
  showUnassigned?: boolean
}

export interface CalendarStats {
  totalJobs: number
  completedJobs: number
  inProgressJobs: number
  pendingJobs: number
  sameDayTurns: number
  averageCompletionTime: number
  cleanerUtilization: Record<string, number>
}

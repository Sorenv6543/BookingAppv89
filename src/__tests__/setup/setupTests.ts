import { beforeAll, afterAll, vi } from 'vitest'

// Global Supabase mock for all tests
vi.mock('@/plugins/supabase', () => {
  const supabase = {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      update: vi.fn().mockResolvedValue({ data: null, error: null }),
      delete: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
    auth: {
      onAuthStateChange: vi.fn(), // Mock auth listener
    },
  };
  return {
    supabase,
    default: supabase, // Provide default export
  };
});

// Mock CSS imports
vi.mock('vuetify/styles', () => ({}))
vi.mock('@mdi/font/css/materialdesignicons.css', () => ({}))
vi.mock('vuetify/lib/components/VCode/VCode.css', () => ({}))

// Global setup
beforeAll(() => {
  // Mock window properties that aren't available in happy-dom
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))

  // Mock matchMedia
  global.matchMedia = vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
})

afterAll(() => {
  // Cleanup if needed
}) 
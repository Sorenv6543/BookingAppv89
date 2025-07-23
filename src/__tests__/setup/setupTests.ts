import { beforeAll, afterAll, vi } from 'vitest'

// Global Supabase mock for all tests
vi.mock('@/plugins/supabase', () => {
  const createQueryBuilder = () => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockResolvedValue({ data: null, error: null }),
    neq: vi.fn().mockResolvedValue({ data: null, error: null }),
    gt: vi.fn().mockResolvedValue({ data: null, error: null }),
    gte: vi.fn().mockResolvedValue({ data: null, error: null }),
    lt: vi.fn().mockResolvedValue({ data: null, error: null }),
    lte: vi.fn().mockResolvedValue({ data: null, error: null }),
    like: vi.fn().mockResolvedValue({ data: null, error: null }),
    in: vi.fn().mockResolvedValue({ data: null, error: null }),
    is: vi.fn().mockResolvedValue({ data: null, error: null }),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
  });

  const supabase = {
    from: vi.fn(() => createQueryBuilder()),
    auth: {
      onAuthStateChange: vi.fn(), // Mock auth listener
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      signUp: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signInWithPassword: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
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
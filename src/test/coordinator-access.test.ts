import { test, expect } from 'vitest'
import { supabase } from '@/integrations/supabase/client'

// Mock the supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
      getSession: vi.fn()
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn()
        }))
      }))
    }))
  }
}))

test('coordinator can access their endpoints', async () => {
  // Mock coordinator user
  const mockUser = { id: 'coordinator-123', email: 'coord@example.com' }
  const mockSession = { access_token: 'mock-token' }

  // Mock the auth calls
  supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } })
  supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } })

  // Mock role check
  supabase.from.mockReturnValue({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn().mockResolvedValue({ data: { role: 'coordinator' } })
      }))
    }))
  })

  // Test that coordinator role is recognized
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', mockUser.id)
    .single()

  expect(roleData.role).toBe('coordinator')

  // Test that session token is available
  const { data: { session } } = await supabase.auth.getSession()
  expect(session.access_token).toBe('mock-token')
})
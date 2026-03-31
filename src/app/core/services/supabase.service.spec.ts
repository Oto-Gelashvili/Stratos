import { TestBed } from '@angular/core/testing';
import { SupabaseService } from './supabase.service';
import { firstValueFrom } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

const { mockSupabaseClient } = vi.hoisted(() => {
  return {
    mockSupabaseClient: {
      auth: {
        getUser: vi.fn(() => Promise.resolve({ data: { user: null } })),
        onAuthStateChange: vi.fn(() => ({
          data: { subscription: { unsubscribe: vi.fn() } },
        })),
        signInWithIdToken: vi.fn(() => Promise.resolve({ data: {}, error: null })),
        signOut: vi.fn(() => Promise.resolve({ error: null })),
      },
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(() =>
              Promise.resolve({
                data: { full_name: 'John Doe', avatar_url: 'url' },
                error: null,
              }),
            ),
          })),
        })),
      })),
    },
  };
});

// Mock the module using the hoisted variable
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => mockSupabaseClient,
}));

describe('SupabaseService', () => {
  let service: SupabaseService;

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [SupabaseService],
    });
    service = TestBed.inject(SupabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a guest VM when no user is logged in', async () => {
    const vm = await firstValueFrom(service.vm$);

    expect(vm.user).toBeNull();
    expect(vm.username).toBeUndefined();
    expect(vm.loading).toBe(false);
  });

  it('should call supabase signOut when signOut is invoked', () => {
    service.signOut().subscribe();
    expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled();
  });

  it('should handle Google One Tap token login', () => {
    const token = 'test-token';
    service.handleGoogleOneTap(token).subscribe();

    expect(mockSupabaseClient.auth.signInWithIdToken).toHaveBeenCalledWith({
      provider: 'google',
      token: token,
    });
  });
});

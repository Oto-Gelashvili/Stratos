import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';
import { Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;
  let supabaseMock: any;
  let routerMock: any;

  beforeEach(() => {
    supabaseMock = {
      user: of(null),
      handleGoogleOneTap: vi.fn(() => of(undefined)),
    };

    routerMock = {
      navigate: vi.fn(),
    };

    (globalThis as any).google = {
      accounts: {
        id: {
          initialize: vi.fn(),
          renderButton: vi.fn(),
          prompt: vi.fn(),
        },
      },
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: SupabaseService, useValue: supabaseMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('should initialize Google One Tap', () => {
    const destroy$ = new Subject<void>();
    service.initGoogleOneTap(destroy$);

    expect((globalThis as any).google.accounts.id.initialize).toHaveBeenCalled();
    expect((globalThis as any).google.accounts.id.prompt).toHaveBeenCalled();
    destroy$.next();
  });

  it('should navigate to lobby on successful One Tap login', () => {
    const destroy$ = new Subject<void>();
    let capturedCallback: any;

    vi.mocked((globalThis as any).google.accounts.id.initialize).mockImplementation(
      (config: any) => {
        capturedCallback = config.callback;
      },
    );

    service.initGoogleOneTap(destroy$);

    capturedCallback({ credential: 'fake-jwt' });

    expect(supabaseMock.handleGoogleOneTap).toHaveBeenCalledWith('fake-jwt');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/lobby']);

    destroy$.next();
  });
});

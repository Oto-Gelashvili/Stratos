import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Profile } from './profile';
import { SupabaseService } from '../../core/services/supabase.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('Profile', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;

  const mockSupabaseService = {
    signOut: vi.fn(),
  };

  const mockRouter = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    mockSupabaseService.signOut.mockReturnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        { provide: SupabaseService, useValue: mockSupabaseService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call supabase.signOut when signOut() is executed', () => {
    component.signOut();

    expect(mockSupabaseService.signOut).toHaveBeenCalledTimes(1);
  });

  it('should navigate to /lobby after successful signOut', () => {
    component.signOut();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/lobby']);
  });

  it('should call signOut when button is clicked', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    button.click();

    expect(mockSupabaseService.signOut).toHaveBeenCalledTimes(1);
  });
});

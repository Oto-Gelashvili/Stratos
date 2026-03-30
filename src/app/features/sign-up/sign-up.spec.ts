import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignUp } from './sign-up';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('SignUp', () => {
  let component: SignUp;
  let fixture: ComponentFixture<SignUp>;

  // Create a BehaviorSubject to simulate user login states
  const userSubject = new BehaviorSubject<any>(null);

  // Mocks
  const mockAuthService = {
    user$: userSubject.asObservable(),
    initGoogleOneTap: vi.fn(), // Using 'vi.fn()' for Vitest (use 'jasmine.createSpy()' if using Jasmine)
  };

  const mockRouter = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUp],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUp);
    component = fixture.componentInstance;

    // Reset mocks before each test
    vi.clearAllMocks();
    userSubject.next(null);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize Google One Tap on init', () => {
    fixture.detectChanges(); // triggers ngOnInit
    expect(mockAuthService.initGoogleOneTap).toHaveBeenCalledWith(expect.any(Subject));
  });

  it('should redirect to /lobby if user is already logged in', () => {
    // Set user state to logged in before ngOnInit
    userSubject.next({ uid: '123', email: 'test@arena.com' });

    fixture.detectChanges(); // triggers ngOnInit

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/lobby']);
  });

  it('should redirect to /lobby when user logs in after initialization', () => {
    fixture.detectChanges(); // ngOnInit runs, user is null
    expect(mockRouter.navigate).not.toHaveBeenCalled();

    // Simulate login event
    userSubject.next({ uid: '123' });

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/lobby']);
  });

  it('should clean up subscriptions on destroy', () => {
    fixture.detectChanges();

    // Access the private destroy$ for testing (casting to any)
    const destroySpy = vi.spyOn((component as any).destroy$, 'next');
    const completeSpy = vi.spyOn((component as any).destroy$, 'complete');

    fixture.destroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should render the logo and header text', () => {
    fixture.detectChanges();
    const h1 = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(h1.textContent).toBe('Enter The Arena');

    const logo = fixture.debugElement.query(By.css('app-logo'));
    expect(logo).toBeTruthy();
  });
});

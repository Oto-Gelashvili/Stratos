import { inject, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SupabaseService } from './supabase.service';

declare const google: any;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase = inject(SupabaseService);
  private router = inject(Router);
  private ngZone = inject(NgZone);

  readonly user$ = this.supabase.user;

  initGoogleOneTap(destroy$: Subject<void>) {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => {
        this.ngZone.run(() => {
          this.supabase
            .handleGoogleOneTap(response.credential)
            .pipe(takeUntil(destroy$))
            .subscribe({
              next: () => this.router.navigate(['/lobby']),
              error: (err) => console.error('One Tap error:', err),
            });
        });
      },
    });

    google.accounts.id.renderButton(document.getElementById('google-btn'), {
      theme: 'outline',
      size: 'large',
      width: 280,
      text: 'continue_with',
      shape: 'pill',
    });

    google.accounts.id.prompt();
  }

  // signInWithGoogle(destroy$: Subject<void>) {
  //   this.supabase
  //     .signInWithGoogle()
  //     .pipe(takeUntil(destroy$))
  //     .subscribe({
  //       error: (err) => console.error('OAuth error:', err),
  //     });
  // }
}

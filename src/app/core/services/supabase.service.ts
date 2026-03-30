import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  from,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient = createClient(environment.supabaseUrl, environment.supabaseKey);

  private user$ = new BehaviorSubject<any | undefined>(undefined);
  readonly user = this.user$.asObservable();

  constructor() {
    from(this.supabase.auth.getUser()).subscribe(({ data }) => {
      this.user$.next(data.user ?? null);
    });

    this.supabase.auth.onAuthStateChange((event, session) => {
      this.user$.next(session?.user ?? null);
    });
  }

  // signInWithGoogle(): Observable<void> {
  //   return from(
  //     this.supabase.auth.signInWithOAuth({
  //       provider: 'google',
  //       options: {
  //         redirectTo: `${window.location.origin}/lobby`,
  //       },
  //     }),
  //   ).pipe(map(() => void 0));
  // }

  handleGoogleOneTap(token: string): Observable<void> {
    return from(
      this.supabase.auth.signInWithIdToken({
        provider: 'google',
        token,
      }),
    ).pipe(map(() => void 0));
  }

  signOut(): Observable<void> {
    return from(this.supabase.auth.signOut()).pipe(map(() => void 0));
  }

  profile$ = this.user.pipe(
    switchMap((user) => {
      if (!user) return of(null);

      return from(
        this.supabase.from('profiles').select('avatar_url').eq('id', user.id).single(),
      ).pipe(
        map((res) => res.data),
        catchError(() => of(null)),
      );
    }),
  );

  vm$ = combineLatest([this.user, this.profile$]).pipe(
    map(([user, profile]) => ({
      user,
      avatarUrl: profile?.avatar_url ?? null,
    })),
  );
}

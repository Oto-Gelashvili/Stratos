import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { SupabaseService } from '../services/supabase.service';

export const authGuard: CanMatchFn = () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  return supabase.user.pipe(
    filter((user) => user !== undefined),
    map((user) => {
      if (user) return true;

      router.navigate(['/auth']);
      return false;
    }),
  );
};

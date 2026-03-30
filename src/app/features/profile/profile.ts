import { Component, inject } from '@angular/core';
import { SupabaseService } from '../../core/services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private readonly supabase = inject(SupabaseService);
  private readonly router = inject(Router);
  signOut() {
    this.supabase.signOut().subscribe({
      next: () => {
        this.router.navigate(['/lobby']);
        console.log('show success noty');
      },
      error: (err) => {
        console.error('Sign out failed', err);
      },
    });
  }
}

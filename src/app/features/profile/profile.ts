import { Component, inject } from '@angular/core';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private readonly supabase = inject(SupabaseService);
  signOut() {
    this.supabase.signOut().subscribe({
      next: () => {
        console.log('show success noty');
      },
      error: (err) => {
        console.error('Sign out failed', err);
      },
    });
  }
}

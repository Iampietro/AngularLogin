import { Injectable } from '@angular/core';
import { AuthService } from '@auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {

  constructor(private authService: AuthService) {}

  isAdmin(): boolean {
    return this.authService.hasRole('admin');
  }
}

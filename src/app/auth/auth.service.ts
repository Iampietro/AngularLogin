import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '@models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<User | null>(null);

  private users: User[] = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'user', password: 'user123', role: 'user' }
  ];

  constructor(private router: Router) {}
  login(username: string, password: string): boolean {
    const user = this.users.find((user: User) => user.username === username && user.password === password);
    if (user) {
      this.currentUser.set(user);
      this.router.navigate(['/home']);
      return true;
    }
    return false;
  }

  logout() {
    this.currentUser.set(null);
  }

  hasRole(role: 'admin' | 'user'): boolean {
    return this.currentUser()?.role === role;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser();
  }
}

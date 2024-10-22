import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '@models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<User | null>(null);
  private tokenKey = 'authToken';

  private users: User[] = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'user', password: 'user123', role: 'user' }
  ];

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    const user = this.users.find((user: User) => user.username === username && user.password === password);

    if (user) {
      const token = this.generateJwtToken(user);
      localStorage.setItem(this.tokenKey, token);
      this.currentUser.set(user);
      this.router.navigate(['/home']);
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  hasRole(role: 'admin' | 'user'): boolean {
    const token = localStorage.getItem(this.tokenKey) || '';
    const decodedToken = this.decodeToken(token);
    return decodedToken && decodedToken.role === role;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return !!token && this.verifyToken(token);
  }

  private generateJwtToken(user: User): string {
    const payload = {
      username: user.username,
      role: user.role,
      exp: Date.now() + 3600 * 1000,
    };

    return btoa(JSON.stringify(payload));
  }

  private verifyToken(token: string): boolean {
    const decodedToken = this.decodeToken(token);
    if (decodedToken && decodedToken.exp > Date.now()) {
      return true;
    }
    this.logout();
    return false;
  }

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token));
    } catch (error) {
      return null;
    }
  }
}

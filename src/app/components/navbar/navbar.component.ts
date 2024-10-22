import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { AuthService } from '@auth/auth.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
  }

  isAdmin(): boolean {
    return this.authService.hasRole('admin');
  }

  redirectToCreatePost() {
    this.router.navigate(['/posts/new'])
  }

  redirectToHome() {
    this.router.navigate(['/home'])
  }
}

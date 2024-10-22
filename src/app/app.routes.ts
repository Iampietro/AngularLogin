import { Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { CreatePostComponent } from './components/admin-components/create-post/create-post.component';
import { UnauthorizedComponent } from './components/shared/unauthorized/unauthorized.component';
 
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
	{ 
    path: 'unauthorized', 
    component: UnauthorizedComponent,
    canActivate: [AuthGuard]
  },
	{
    path: 'posts/new',
    component: CreatePostComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'admin' }
  },
  {
    path: 'posts/edit/:id',
    component: CreatePostComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'admin' }
  },
  {
    path: 'home', 
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
	{ path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

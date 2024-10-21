import { Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { CreatePostComponent } from './components/admin-components/create-post/create-post.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
	// { path: 'unauthorized', component: UnauthorizedComponent },
	{
    path: 'create-post',
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

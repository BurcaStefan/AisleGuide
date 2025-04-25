import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { UserHomePageComponent } from './pages/user-home-page/user-home-page.component';

export const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'home', component: UserHomePageComponent },
];

import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { UserHomePageComponent } from './pages/user-home-page/user-home-page.component';
import { AdminHomePageComponent } from './pages/admin-home-page/admin-home-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { ProductDetailsPageComponent } from './pages/product-details-page/product-details-page.component';
import { ProductCreatePageComponent } from './pages/product-create-page/product-create-page.component';
import { ProductsPageComponent } from './pages/products-page/products-page.component';

export const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'home', component: UserHomePageComponent },
  { path: 'admin-home', component: AdminHomePageComponent },
  { path: 'details/:id', component: ProductDetailsPageComponent },
  { path: 'create-product', component: ProductCreatePageComponent },
  { path: 'products', component: ProductsPageComponent },
];

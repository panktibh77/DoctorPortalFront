import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { AuthGuard } from './shared/auth.guard';

const routes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/signUp', component: SignUpComponent },
  {
    path: 'pages',
    canActivate: [AuthGuard],
    loadChildren: () =>
    import('./pages/pages.module').then((module) => module.PagesModule),
  },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

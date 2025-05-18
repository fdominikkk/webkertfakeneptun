import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AddlessonsComponent } from './pages/addlessons/addlessons.component';
import { LessonsComponent } from './pages/lessons/lessons.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegisterComponent } from './pages/registration/registration.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './pages/guards/auth.gard';
import { StudentGuard } from './pages/guards/student.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'addlessons', component: AddlessonsComponent, canActivate: [AuthGuard] },
  { path: 'lessons', component: LessonsComponent, canActivate: [AuthGuard, StudentGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent }
];
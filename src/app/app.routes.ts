import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AddlessonsComponent } from './pages/addlessons/addlessons.component';
import { LessonsComponent } from './pages/lessons/lessons.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'addlessons', component: AddlessonsComponent },
  { path: 'lessons', component: LessonsComponent },
  { path: 'profile', component: ProfileComponent },
];
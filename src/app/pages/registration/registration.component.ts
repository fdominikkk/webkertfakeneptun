import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  userType: string = '';
  faculty: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async onRegister() {
    this.errorMessage = '';
    this.successMessage = '';
    
    if (!this.name || !this.email || !this.password || !this.userType || !this.faculty) {
      this.errorMessage = 'Kérlek, tölts ki minden mezőt!';
      console.warn('RegisterComponent: Hiányzó mezők:', { name: this.name, email: this.email, userType: this.userType, faculty: this.faculty });
      return;
    }

    try {
      await this.authService.register({
        name: this.name,
        email: this.email,
        password: this.password,
        userType: this.userType,
        faculty: this.faculty
      });
      this.successMessage = 'Sikeres regisztráció!';
      console.log('RegisterComponent: Sikeres regisztráció:', this.email);
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 1500); // 1.5 másodperc késleltetés
    } catch (error: any) {
      this.errorMessage = 'Hiba a regisztráció során: ' + error.message;
      console.error('RegisterComponent: Regisztrációs hiba:', error);
    }
  }
}
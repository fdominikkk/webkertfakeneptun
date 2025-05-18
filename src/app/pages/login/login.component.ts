import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async onLogin() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Kérlek, töltsd ki az email és jelszó mezőket!';
      console.warn('LoginComponent: Hiányzó mezők:', { email: this.email, password: this.password });
      return;
    }

    try {
      await this.authService.login(this.email, this.password);
      this.successMessage = 'Sikeres bejelentkezés!';
      console.log('LoginComponent: Sikeres bejelentkezés:', this.email);
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 1500); // 1.5 másodperc késleltetés
    } catch (error: any) {
      this.errorMessage = 'Hibás email vagy jelszó. Kérlek, próbáld újra.';
      console.error('LoginComponent: Bejelentkezési hiba:', error);
    }
  }
}
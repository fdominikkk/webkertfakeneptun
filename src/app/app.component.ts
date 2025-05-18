import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MenuComponent } from './pages/menu/menu.component';
import { NewsHighlightDirective } from './pages/news-highlight.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MenuComponent,
    NewsHighlightDirective
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'webkert-projekt';
  page = 'login'; // Alapértelmezett: login
  isSidenavOpen = false;

  constructor(private router: Router) {
    console.log('AppComponent: Konstruktor meghívva');
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        console.log('AppComponent: Navigáció történt, URL:', url);
        if (url.includes('addlessons')) {
          this.page = 'addlessons';
        } else if (url.includes('lessons')) {
          this.page = 'lessons';
        } else if (url.includes('profile')) {
          this.page = 'profile';
        } else if (url.includes('register')) {
          this.page = 'register';
        } else if (url.includes('login') || url === '/') {
          this.page = 'login';
        } else {
          this.page = 'home';
        }
        console.log('AppComponent: Aktuális oldal:', this.page);
      }
    });
  }

  toggleSidenav() {
    console.log('AppComponent: Sidenav toggle:', this.isSidenavOpen);
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  changePage(selectedPage: string) {
    console.log('AppComponent: changePage meghívva:', selectedPage);
    this.page = selectedPage;
    switch (selectedPage) {
      case 'home':
        this.router.navigate(['/home']);
        break;
      case 'addlessons':
        this.router.navigate(['/addlessons']);
        break;
      case 'lessons':
        this.router.navigate(['/lessons']);
        break;
      case 'profile':
        this.router.navigate(['/profile']);
        break;
      case 'register':
        this.router.navigate(['/register']);
        break;
      case 'login':
        this.router.navigate(['/login']);
        break;
    }
    this.isSidenavOpen = false;
    console.log('AppComponent: Navigáció:', selectedPage);
  }
}
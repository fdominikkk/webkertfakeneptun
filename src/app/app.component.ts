// app.component.ts
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
  page = 'home';
  isSidenavOpen = false; 

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        if (url.includes('addlessons')) {
          this.page = 'addlessons';
        } else if (url.includes('lessons')) {
          this.page = 'lessons';
        } else if (url.includes('profile')) {
          this.page = 'profile';
        } else {
          this.page = 'home';
        }
      }
    });
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }


  changePage(selectedPage: string) {
    this.page = selectedPage;
    switch (selectedPage) {
      case 'home':
        this.router.navigate(['/']);
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
    }

    this.isSidenavOpen = false;
  }
}
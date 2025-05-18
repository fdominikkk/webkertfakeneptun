import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { map, catchError, take } from 'rxjs/operators';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() currentPage: string = 'login';
  @Output() selectedPage: EventEmitter<string> = new EventEmitter();
  isAuthenticated$: Observable<boolean>;
  userType: string = '';

  constructor(
    private authService: AuthService,
    private firestore: Firestore,
    private auth: Auth,
    private router: Router
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated();
  }

  ngOnInit() {
    this.isAuthenticated$.subscribe((isAuth) => {
      console.log('MenuComponent: Bejelentkezési állapot:', isAuth);
      if (isAuth) {
        const user = this.auth.currentUser;
        if (user) {
          const userDocRef = doc(this.firestore, 'users', user.uid);
          getDoc(userDocRef).then(docSnap => {
            if (docSnap.exists()) {
              const userData = docSnap.data();
              this.userType = userData['userType'] || '';
              console.log('MenuComponent: Felhasználó típusa:', this.userType);
            } else {
              console.warn('MenuComponent: Felhasználói dokumentum nem létezik');
              this.userType = '';
            }
          }).catch(error => {
            console.error('MenuComponent: Hiba a userType lekérdezése során:', error);
            this.userType = '';
          });
        }
      } else {
        this.userType = '';
      }
    });
  }

  menuSwitch(pageValue: string) {
    console.log('MenuComponent: menuSwitch meghívva:', pageValue);
    if (pageValue === 'logout') {
      this.authService.logout().then(() => {
        this.router.navigate(['/login']);
        this.selectedPage.emit('login');
        this.userType = '';
      }).catch((error) => {
        console.error('MenuComponent: Kijelentkezési hiba:', error);
      });
    } else {
      this.selectedPage.emit(pageValue);
    }
  }
}
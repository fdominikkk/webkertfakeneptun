import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable, from, of } from 'rxjs';
import { switchMap, map, catchError, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private firestore: Firestore,
    private auth: Auth,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      take(1),
      switchMap(isAuth => {
        console.log('StudentGuard: Bejelentkezési állapot:', isAuth);
        if (!isAuth) {
          console.warn('StudentGuard: Nincs bejelentkezett felhasználó, átirányítás a /login oldalra');
          this.router.navigate(['/login']);
          return of(false);
        }

        const user = this.auth.currentUser;
        if (!user) {
          console.warn('StudentGuard: Nincs bejelentkezett felhasználó, átirányítás a /login oldalra');
          this.router.navigate(['/login']);
          return of(false);
        }

        return from(getDoc(doc(this.firestore, 'users', user.uid))).pipe(
          map(docSnap => {
            if (docSnap.exists()) {
              const userData = docSnap.data() as { userType?: string };
              const userType = userData['userType'] || '';
              console.log('StudentGuard: Felhasználó típusa:', userType);
              if (userType === 'student') {
                return true;
              } else {
                console.warn('StudentGuard: A felhasználó nem diák, átirányítás a /home oldalra');
                this.router.navigate(['/home']);
                return false;
              }
            } else {
              console.warn('StudentGuard: Felhasználói dokumentum nem létezik, átirányítás a /home oldalra');
              this.router.navigate(['/home']);
              return false;
            }
          }),
          catchError(error => {
            console.error('StudentGuard: Hiba a userType lekérdezése során:', error);
            this.router.navigate(['/home']);
            return of(false);
          })
        );
      })
    );
  }
}
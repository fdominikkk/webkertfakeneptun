import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    console.log('AuthService: Inicializálás');
    onAuthStateChanged(this.auth, (user: User | null) => {
      console.log('AuthService: onAuthStateChanged, felhasználó:', user ? user.uid : 'Nincs bejelentkezve');
      this.userSubject.next(user);
    });
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    userType: string;
    faculty: string;
  }) {
    try {
      console.log('AuthService: Regisztráció kezdete:', userData);
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        userData.email,
        userData.password
      );
      const user = userCredential.user;
      console.log('AuthService: Felhasználó létrehozva, UID:', user.uid);

      await setDoc(doc(this.firestore, 'users', user.uid), {
        name: userData.name,
        email: userData.email,
        userType: userData.userType,
        faculty: userData.faculty,
        createdAt: new Date(),
        enrolledCourses: []
      });

      console.log('AuthService: Felhasználói adatok mentve a Firestore-ban');
      return user;
    } catch (error) {
      console.error('AuthService: Hiba a regisztráció során:', error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      console.log('AuthService: Bejelentkezés kezdete:', email);
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log('AuthService: Sikeres bejelentkezés, UID:', user.uid);
      return user;
    } catch (error) {
      console.error('AuthService: Hiba a bejelentkezés során:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      console.log('AuthService: Sikeres kijelentkezés');
    } catch (error) {
      console.error('AuthService: Hiba a kijelentkezés során:', error);
      throw error;
    }
  }

  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(
      map(user => {
        console.log('AuthService: isAuthenticated ellenőrzés, felhasználó:', user ? user.uid : 'Nincs felhasználó');
        return !!user;
      })
    );
  }

  getUserType(): Observable<string | null> {
    return this.user$.pipe(
      switchMap(user => {
        if (!user) {
          console.log('AuthService: Nincs bejelentkezett felhasználó, userType: null');
          return of(null);
        }
        console.log('AuthService: Felhasználó UID:', user.uid);
        const userDocRef = doc(this.firestore, 'users', user.uid);
        return from(getDoc(userDocRef)).pipe(
          map(docSnap => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              console.log('AuthService: Felhasználói dokumentum:', data);
              const userType = data['userType'] || null;
              console.log('AuthService: userType lekérve:', userType);
              return userType;
            }
            console.log('AuthService: Felhasználói dokumentum nem létezik, userType: null');
            return null;
          }),
          catchError(error => {
            console.error('AuthService: Hiba a Firestore lekérdezés során:', error);
            return of(null);
          })
        );
      })
    );
  }
}
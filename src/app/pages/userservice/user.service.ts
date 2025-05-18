import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: Firestore) {}

  // Read: Felhasználó adatainak lekérdezése UID alapján
  getUserById(userId: string): Observable<any> {
    const userRef = doc(this.firestore, 'users', userId);
    return from(getDoc(userRef)).pipe(
      map(docSnap => docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null)
    );
  }
}
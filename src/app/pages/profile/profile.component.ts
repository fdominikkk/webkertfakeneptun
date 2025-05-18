import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditing = false;
  originalData: any = null;
  isLoading = true;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private firestore: Firestore,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: [{ value: '', disabled: true }, Validators.required],
      userType: ['', Validators.required],
      faculty: ['', Validators.required]
    });
  }

  async ngOnInit() {
    this.isLoading = true;
    console.log('ProfileComponent: ngOnInit meghívva');
    try {
      const user = this.auth.currentUser;
      if (!user) {
        this.errorMessage = 'Nincs bejelentkezett felhasználó!';
        console.error('ProfileComponent: Nincs bejelentkezett felhasználó');
        this.isLoading = false;
        return;
      }
      console.log('ProfileComponent: Bejelentkezett felhasználó UID:', user.uid);
      const userDocRef = doc(this.firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('ProfileComponent: Lekért Firestore adatok:', userData);
        const profileData = {
          name: userData['name'] || '',
          email: userData['email'] || user.email || '',
          userType: userData['userType'] || '',
          faculty: userData['faculty'] || ''
        };
        this.profileForm.patchValue(profileData);
        this.originalData = { ...profileData };
        if (!userData['name'] || !userData['userType'] || !userData['faculty']) {
          this.errorMessage = 'Hiányzó profiladatok, kérlek, töltsd ki a profilodat!';
          console.warn('ProfileComponent: Hiányzó Firestore adatok:', profileData);
        }
      } else {
        console.warn('ProfileComponent: A Firestore dokumentum nem létezik a felhasználóhoz:', user.uid);
        this.errorMessage = 'Felhasználói adatok nem találhatók, kérlek, töltsd ki a profilodat!';
        this.profileForm.patchValue({
          email: user.email || ''
        });
        this.originalData = {
          email: user.email || '',
          name: '',
          userType: '',
          faculty: ''
        };
      }
    } catch (error) {
      const err = error as Error;
      this.errorMessage = 'Hiba az adatok lekérdezése során: ' + err.message;
      console.error('ProfileComponent: Hiba az adatok lekérdezése során:', err.message);
    } finally {
      this.isLoading = false;
      console.log('ProfileComponent: Betöltés befejezve, isLoading:', this.isLoading);
    }
  }

  enableEdit() {
    this.isEditing = true;
    this.profileForm.get('name')?.enable();
    this.profileForm.get('userType')?.enable();
    this.profileForm.get('faculty')?.enable();
    this.errorMessage = '';
    this.successMessage = '';
    console.log('ProfileComponent: Szerkesztési mód aktiválva');
  }

  async saveProfile() {
    if (this.profileForm.invalid) {
      this.errorMessage = 'Kérlek, tölts ki minden kötelező mezőt!';
      this.successMessage = '';
      console.warn('ProfileComponent: Érvénytelen űrlap:', this.profileForm.value);
      return;
    }
    try {
      const user = this.auth.currentUser;
      if (!user) {
        this.errorMessage = 'Nincs bejelentkezett felhasználó!';
        this.successMessage = '';
        console.error('ProfileComponent: Nincs bejelentkezett felhasználó');
        return;
      }
      const userDocRef = doc(this.firestore, 'users', user.uid);
      const updatedData = {
        name: this.profileForm.get('name')?.value,
        email: this.profileForm.get('email')?.value,
        userType: this.profileForm.get('userType')?.value,
        faculty: this.profileForm.get('faculty')?.value
      };
      await updateDoc(userDocRef, updatedData);
      console.log('ProfileComponent: Profil adatok mentve:', updatedData);
      this.originalData = { ...updatedData };
      this.isEditing = false;
      this.profileForm.get('name')?.disable();
      this.profileForm.get('userType')?.disable();
      this.profileForm.get('faculty')?.disable();
      this.successMessage = 'Profil sikeresen frissítve!';
      this.errorMessage = '';
    } catch (error) {
      const err = error as Error;
      this.errorMessage = 'Hiba a profil mentése során: ' + err.message;
      this.successMessage = '';
      console.error('ProfileComponent: Hiba a profil mentése során:', err.message);
    }
  }

  cancelEdit() {
    if (this.originalData) {
      this.profileForm.patchValue(this.originalData);
    }
    this.isEditing = false;
    this.profileForm.get('name')?.disable();
    this.profileForm.get('userType')?.disable();
    this.profileForm.get('faculty')?.disable();
    this.errorMessage = '';
    this.successMessage = '';
    console.log('ProfileComponent: Szerkesztés megszakítva');
  }
}
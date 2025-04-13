import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditing = false;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      name: ['Köröskényi "McIsti" István'],
      email: ['milyennyiregyhaza@gmail.com'],
      studentId: ['123456789'],
      department: ['Informatikai Tanszék']
    });
  }

  ngOnInit(): void {}

  enableEdit() {
    this.isEditing = true;
  }

  saveProfile() {
    if (this.profileForm.valid) {
      console.log('Mentett profil adatok:', this.profileForm.value);
      this.isEditing = false;
    }
  }

  cancelEdit() {
    this.profileForm.reset({
      name: 'Köröskényi "McIsti" István',
      email: 'milyennyiregyhaza@gmail.com',
      studentId: ['123456789'],
      department: ['Informatikai Tanszék']
    });
    this.isEditing = false;
  }
}
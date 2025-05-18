import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, getDoc, updateDoc, arrayRemove } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.css',
})
export class LessonsComponent implements OnInit {
  subjects: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {}

  async ngOnInit() {
    console.log('LessonsComponent: ngOnInit meghívva');
    this.isLoading = true;
    await this.loadEnrolledCourses();
    this.isLoading = false;
  }

  isDeleteButtonDisabled(): boolean {
    return this.subjects.every(subject => !subject.selected);
  }

  async loadEnrolledCourses() {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        console.error('LessonsComponent: Nincs bejelentkezett felhasználó');
        this.errorMessage = 'Nincs bejelentkezett felhasználó!';
        return;
      }

      console.log('LessonsComponent: Felhasználó UID:', user.uid);
      const userDocRef = doc(this.firestore, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        console.error('LessonsComponent: Felhasználói dokumentum nem létezik');
        this.errorMessage = 'Felhasználói adatok nem találhatók!';
        return;
      }

      const userData = userDocSnap.data();
      const enrolledCourses = userData['enrolledCourses'] || [];
      console.log('LessonsComponent: Felvett kurzusok ID-i:', enrolledCourses);

      this.subjects = [];
      for (const courseId of enrolledCourses) {
        const courseRef = doc(this.firestore, 'courses', courseId);
        const courseDocSnap = await getDoc(courseRef);

        if (courseDocSnap.exists()) {
          const courseData = courseDocSnap.data();
          let teacherName = 'Ismeretlen tanár';
          if (courseData['teacherId']) {
            const teacherRef = doc(this.firestore, 'users', courseData['teacherId']);
            const teacherDocSnap = await getDoc(teacherRef);
            if (teacherDocSnap.exists()) {
              teacherName = teacherDocSnap.data()['name'] || 'Ismeretlen tanár';
            }
          }

          this.subjects.push({
            id: courseId,
            name: courseData['name'],
            day: courseData['day'] || 'N/A',
            time: courseData['time'] || 'N/A',
            teacher: teacherName,
            selected: false
          });
        }
      }
      console.log('LessonsComponent: Felvett kurzusok betöltve:', this.subjects);
    } catch (error) {
      const err = error as Error;
      console.error('LessonsComponent: Hiba a kurzusok betöltése során:', err.message);
      this.errorMessage = 'Hiba a kurzusok betöltése során: ' + err.message;
    }
  }

  async deleteSelectedSubjects() {
    this.errorMessage = '';
    this.successMessage = '';
    
    try {
      const user = this.auth.currentUser;
      if (!user) {
        console.error('LessonsComponent: Nincs bejelentkezett felhasználó');
        this.errorMessage = 'Nincs bejelentkezett felhasználó!';
        return;
      }

      const selectedCourses = this.subjects.filter(subject => subject.selected);
      if (selectedCourses.length === 0) {
        this.errorMessage = 'Nincs kijelölt kurzus a leadáshoz!';
        return;
      }

      const userRef = doc(this.firestore, 'users', user.uid);
      for (const course of selectedCourses) {
        const courseRef = doc(this.firestore, 'courses', course.id);
        await updateDoc(courseRef, {
          students: arrayRemove(user.uid)
        });

        await updateDoc(userRef, {
          enrolledCourses: arrayRemove(course.id)
        });
      }

      this.subjects = this.subjects.filter(subject => !subject.selected);
      this.successMessage = 'Kijelölt kurzusok sikeresen leadva!';
      console.log('LessonsComponent: Kurzusok leadva');
    } catch (error) {
      const err = error as Error;
      console.error('LessonsComponent: Hiba a kurzusok leadása során:', err.message);
      this.errorMessage = 'Hiba a kurzusok leadása során: ' + err.message;
    }
  }
}
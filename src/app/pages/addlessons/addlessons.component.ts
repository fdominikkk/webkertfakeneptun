import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, query, where, orderBy, limit, startAfter, endBefore, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove, deleteDoc, addDoc, DocumentSnapshot } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';
import { RestrictSelectionDirective } from '../../pages/restrict-selection.directive';

@Component({
  selector: 'app-add-lessons',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCheckboxModule,
    MatDividerModule,
    MatChipsModule,
    RestrictSelectionDirective,
  ],
  templateUrl: './addlessons.component.html',
  styleUrl: './addlessons.component.css'
})
export class AddlessonsComponent implements OnInit {
  courseForm: FormGroup;
  filterForm: FormGroup;
  searchText: string = '';
  courses: any[] = [];
  userType: string | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = true;
  isEditing: boolean = false;
  editingCourseId: string | null = null;
  pageSize: number = 10;
  lastDoc: DocumentSnapshot | null = null;
  firstDoc: DocumentSnapshot | null = null;
  currentPage: number = 1;
  hasNext: boolean = true;
  hasPrevious: boolean = false;

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private auth: Auth,
    private authService: AuthService
  ) {
    this.courseForm = this.fb.group({
      name: ['', Validators.required],
      credits: [0, [Validators.required, Validators.min(1)]],
      faculty: ['', Validators.required],
      semester: ['', Validators.required],
      description: [''],
      maxStudents: [30, [Validators.min(1)]],
      day: ['', Validators.required],
      time: ['', Validators.required]
    });
    this.filterForm = this.fb.group({
      faculty: [''],
      semester: [''],
      day: [''],
      minCredits: [0, [Validators.min(0)]]
    });
  }

  getCurrentUserUid(): string | null {
    return this.auth.currentUser?.uid || null;
  }

  isCourseEnrolled(course: any): boolean {
    const uid = this.getCurrentUserUid();
    return uid ? (course.students || []).includes(uid) : false;
  }

  async ngOnInit() {
    console.log('AddLessonsComponent: ngOnInit meghívva');
    this.isLoading = true;
    try {
      const user = this.auth.currentUser;
      if (!user) {
        console.log('AddLessonsComponent: Nincs bejelentkezett felhasználó');
        this.errorMessage = 'Nincs bejelentkezett felhasználó!';
        this.isLoading = false;
        return;
      }
      console.log('AddLessonsComponent: Felhasználó UID:', user.uid);
      const userDocRef = doc(this.firestore, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('AddLessonsComponent: Felhasználói dokumentum:', data);
        this.userType = data['userType'] || null;
        console.log('AddLessonsComponent: Felhasználó típusa:', this.userType);
      } else {
        console.log('AddLessonsComponent: Felhasználói dokumentum nem létezik');
        this.userType = null;
      }
      this.isLoading = false;
      if (this.userType === 'student' || this.userType === 'teacher') {
        console.log('AddLessonsComponent: Kurzusok betöltése...');
        await this.loadFilteredCourses();
      } else {
        console.warn('AddLessonsComponent: Érvénytelen vagy hiányzó userType:', this.userType);
        this.errorMessage = 'Nem sikerült azonosítani a felhasználó típusát.';
      }
    } catch (error) {
      const err = error as Error;
      console.error('AddLessonsComponent: Hiba a userType lekérdezése során:', err.message);
      this.errorMessage = 'Hiba a felhasználó típusának lekérdezése során: ' + err.message;
      this.isLoading = false;
    }
  }

  async loadFilteredCourses(direction: 'next' | 'prev' | null = null) {
    try {
      console.log('AddLessonsComponent: Kurzusok lekérdezése a Firestore-ból...');
      this.isLoading = true;
      const coursesRef = collection(this.firestore, 'courses');
      let q = query(coursesRef);

      const filters = this.filterForm.value;
      if (filters.faculty) {
        q = query(q, where('faculty', '==', filters.faculty));
      }
      if (filters.semester) {
        q = query(q, where('semester', '==', filters.semester));
      }
      if (filters.day) {
        q = query(q, where('day', '==', filters.day));
      }
      if (filters.minCredits > 0) {
        q = query(q, where('credits', '>=', filters.minCredits));
      }

      q = query(q, orderBy('name', 'asc'));

      if (direction === 'next' && this.lastDoc) {
        q = query(q, startAfter(this.lastDoc));
      } else if (direction === 'prev' && this.firstDoc) {
        q = query(q, endBefore(this.firstDoc));
      }

      q = query(q, limit(this.pageSize));

      const courseSnapshot = await getDocs(q);
      this.courses = courseSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('AddLessonsComponent: Kurzusok betöltve:', this.courses);

      if (courseSnapshot.docs.length > 0) {
        this.firstDoc = courseSnapshot.docs[0];
        this.lastDoc = courseSnapshot.docs[courseSnapshot.docs.length - 1];
        this.hasNext = courseSnapshot.docs.length === this.pageSize;
        this.hasPrevious = this.currentPage > 1;
      } else {
        this.firstDoc = null;
        this.lastDoc = null;
        this.hasNext = false;
        this.hasPrevious = false;
      }

      if (direction === 'next' && this.courses.length > 0) {
        this.currentPage++;
      } else if (direction === 'prev' && this.courses.length > 0) {
        this.currentPage--;
      }
    } catch (error) {
      const err = error as Error;
      console.error('AddLessonsComponent: Hiba a kurzusok betöltése során:', err.message);
      if (err.message.includes('The query requires an index')) {
        this.errorMessage = 'Hiba a kurzusok betöltése során: ' + err.message;
      }
    } finally {
      this.isLoading = false;
    }
  }

  onApplyFilters() {
    this.currentPage = 1;
    this.firstDoc = null;
    this.lastDoc = null;
    this.loadFilteredCourses();
  }

  onResetFilters() {
    this.filterForm.reset({
      faculty: '',
      semester: '',
      day: '',
      minCredits: 0
    });
    this.currentPage = 1;
    this.firstDoc = null;
    this.lastDoc = null;
    this.loadFilteredCourses();
  }

  onNextPage() {
    if (this.hasNext) {
      this.loadFilteredCourses('next');
    }
  }

  onPreviousPage() {
    if (this.hasPrevious) {
      this.loadFilteredCourses('prev');
    }
  }

  async onSubmitCourse() {
    if (this.courseForm.invalid) {
      this.errorMessage = 'Kérlek, tölts ki minden kötelező mezőt!';
      console.warn('AddLessonsComponent: Érvénytelen űrlap:', this.courseForm.value);
      return;
    }
    try {
      const user = this.auth.currentUser;
      if (!user) {
        this.errorMessage = 'Nincs bejelentkezett felhasználó!';
        console.error('AddLessonsComponent: Nincs bejelentkezett felhasználó');
        return;
      }
      const courseData = {
        name: this.courseForm.get('name')?.value,
        teacherId: user.uid,
        credits: this.courseForm.get('credits')?.value,
        faculty: this.courseForm.get('faculty')?.value,
        semester: this.courseForm.get('semester')?.value,
        description: this.courseForm.get('description')?.value,
        maxStudents: this.courseForm.get('maxStudents')?.value,
        day: this.courseForm.get('day')?.value,
        time: this.courseForm.get('time')?.value,
        students: this.isEditing ? (this.courses.find(c => c.id === this.editingCourseId)?.students || []) : [],
        createdAt: this.isEditing ? (this.courses.find(c => c.id === this.editingCourseId)?.createdAt || new Date()) : new Date()
      };
      console.log('AddLessonsComponent: Kurzus mentése:', courseData);
      if (this.isEditing && this.editingCourseId) {
        const courseRef = doc(this.firestore, 'courses', this.editingCourseId);
        await updateDoc(courseRef, courseData);
        console.log('AddLessonsComponent: Kurzus sikeresen frissítve:', this.editingCourseId);
        this.successMessage = 'Kurzus sikeresen frissítve!';
      } else {
        const coursesRef = collection(this.firestore, 'courses');
        await addDoc(coursesRef, courseData);
        console.log('AddLessonsComponent: Kurzus sikeresen mentve');
        this.successMessage = 'Kurzus sikeresen hozzáadva!';
      }
      this.courseForm.reset();
      this.isEditing = false;
      this.editingCourseId = null;
      await this.loadFilteredCourses();
    } catch (error) {
      const err = error as Error;
      console.error('AddLessonsComponent: Hiba a kurzus mentése során:', err.message);
      this.errorMessage = 'Hiba a kurzus mentése során: ' + err.message;
    }
  }

  onEditCourse(course: any) {
    this.isEditing = true;
    this.editingCourseId = course.id;
    this.courseForm.patchValue({
      name: course.name,
      credits: course.credits,
      faculty: course.faculty,
      semester: course.semester,
      description: course.description,
      maxStudents: course.maxStudents,
      day: course.day,
      time: course.time
    });
    console.log('AddLessonsComponent: Szerkesztési mód aktiválva, kurzus:', course.id);
  }

  onCancelEdit() {
    this.isEditing = false;
    this.editingCourseId = null;
    this.courseForm.reset();
    this.errorMessage = '';
    console.log('AddLessonsComponent: Szerkesztés megszakítva');
  }

  async onCourseDelete(courseId: string) {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        console.error('AddLessonsComponent: Nincs bejelentkezett felhasználó');
        this.errorMessage = 'Nincs bejelentkezett felhasználó!';
        return;
      }
      console.log('AddLessonsComponent: Kísérlet kurzus törlésére, courseId:', courseId);
      const courseRef = doc(this.firestore, 'courses', courseId);
      const courseDoc = await getDoc(courseRef);
      if (!courseDoc.exists()) {
        console.error('AddLessonsComponent: A kurzus nem létezik:', courseId);
        this.errorMessage = 'A kurzus nem létezik!';
        return;
      }
      const courseData = courseDoc.data();
      console.log('AddLessonsComponent: Kurzus adatok:', courseData);
      const userDocRef = doc(this.firestore, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists() || userDocSnap.data()['userType'] !== 'teacher') {
        console.error('AddLessonsComponent: Csak tanárok törölhetnek kurzust');
        this.errorMessage = 'Csak tanárok törölhetnek kurzust!';
        return;
      }
      const studentIds = courseData['students'] || [];
      console.log('AddLessonsComponent: Diákok, akiknél frissíteni kell:', studentIds);
      for (const studentId of studentIds) {
        const studentRef = doc(this.firestore, 'users', studentId);
        await updateDoc(studentRef, {
          enrolledCourses: arrayRemove(courseId)
        });
        console.log('AddLessonsComponent: Frissítve a diák enrolledCourses:', studentId);
      }
      await deleteDoc(courseRef);
      console.log('AddLessonsComponent: Kurzus sikeresen törölve:', courseId);
      this.successMessage = 'Kurzus sikeresen törölve!';
      await this.loadFilteredCourses();
    } catch (error) {
      const err = error as Error;
      console.error('AddLessonsComponent: Hiba a kurzus törlése során:', err.message, err.stack);
      this.errorMessage = 'Hiba a kurzus törlése során: ' + err.message;
    }
  }

  getFilteredCourses() {
    if (!this.searchText) {
      return this.courses;
    }
    return this.courses.filter(course =>
      course.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  async onCourseSelect(courseId: string) {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        console.error('AddLessonsComponent: Nincs bejelentkezett felhasználó');
        this.errorMessage = 'Nincs bejelentkezett felhasználó!';
        return;
      }
      console.log('AddLessonsComponent: Kísérlet kurzus felvételére, courseId:', courseId, 'user UID:', user.uid);
      const courseRef = doc(this.firestore, 'courses', courseId);
      const courseDoc = await getDoc(courseRef);
      if (!courseDoc.exists()) {
        console.error('AddLessonsComponent: A kurzus nem létezik:', courseId);
        this.errorMessage = 'A kurzus nem létezik!';
        return;
      }
      const courseData = courseDoc.data();
      console.log('AddLessonsComponent: Kurzus adatok:', courseData);
      if (courseData['students'] && courseData['students'].includes(user.uid)) {
        console.warn('AddLessonsComponent: A felhasználó már felvette a kurzust:', courseId);
        this.errorMessage = 'Már felvette ezt a kurzust!';
        return;
      }
      if (courseData['maxStudents'] && courseData['students'] && courseData['students'].length >= courseData['maxStudents']) {
        console.error('AddLessonsComponent: A kurzus betelt:', courseId);
        this.errorMessage = 'A kurzus betelt!';
        return;
      }
      console.log('AddLessonsComponent: Frissítési kérés küldése, új students tömb:', [...(courseData['students'] || []), user.uid]);
      await updateDoc(courseRef, {
        students: arrayUnion(user.uid)
      });
      console.log('AddLessonsComponent: Courses/students sikeresen frissítve');
      const userRef = doc(this.firestore, 'users', user.uid);
      await updateDoc(userRef, {
        enrolledCourses: arrayUnion(courseId)
      });
      console.log('AddLessonsComponent: Users/enrolledCourses sikeresen frissítve');
      console.log('AddLessonsComponent: Kurzus sikeresen felvéve:', courseId);
      this.successMessage = 'Kurzus sikeresen felvéve!';
      await this.loadFilteredCourses();
    } catch (error) {
      const err = error as Error;
      console.error('AddLessonsComponent: Hiba a kurzus felvétele során:', err.message, err.stack);
      this.errorMessage = 'Hiba a kurzus felvétele során: ' + err.message;
    }
  }
}
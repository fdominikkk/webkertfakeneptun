import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc, arrayUnion, arrayRemove, getDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(private firestore: Firestore) {}

  getCourses(): Observable<any[]> {
    const coursesRef = collection(this.firestore, 'courses');
    return from(getDocs(coursesRef)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    );
  }

  addCourse(courseData: any): Observable<void> {
    const coursesRef = collection(this.firestore, 'courses');
    return from(addDoc(coursesRef, courseData)).pipe(map(() => void 0));
  }

  enrollStudent(courseId: string, studentId: string): Observable<void> {
    const courseRef = doc(this.firestore, 'courses', courseId);
    return from(updateDoc(courseRef, {
      students: arrayUnion(studentId)
    })).pipe(map(() => void 0));
  }

  unenrollStudent(courseId: string, studentId: string): Observable<void> {
    const courseRef = doc(this.firestore, 'courses', courseId);
    return from(updateDoc(courseRef, {
      students: arrayRemove(studentId)
    })).pipe(map(() => void 0));
  }

  updateUserEnrolledCourses(userId: string, courseId: string): Observable<void> {
    const userRef = doc(this.firestore, 'users', userId);
    return from(updateDoc(userRef, {
      enrolledCourses: arrayUnion(courseId)
    })).pipe(map(() => void 0));
  }

  removeUserEnrolledCourse(userId: string, courseId: string): Observable<void> {
    const userRef = doc(this.firestore, 'users', userId);
    return from(updateDoc(userRef, {
      enrolledCourses: arrayRemove(courseId)
    })).pipe(map(() => void 0));
  }

  deleteCourse(courseId: string): Observable<void> {
    const courseRef = doc(this.firestore, 'courses', courseId);
    return from(deleteDoc(courseRef)).pipe(map(() => void 0));
  }

  getCourseById(courseId: string): Observable<any> {
    const courseRef = doc(this.firestore, 'courses', courseId);
    return from(getDoc(courseRef)).pipe(
      map(doc => doc.exists() ? { id: doc.id, ...doc.data() } : null)
    );
  }
}
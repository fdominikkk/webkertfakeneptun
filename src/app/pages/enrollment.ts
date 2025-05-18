export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: Date;
  grade?: number; // Opcionális tulajdonság, "?" jelzi
}
// lessons.component.ts
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    MatRadioModule, 
    FormsModule,
  ],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.css',
})
export class LessonsComponent {
  subjects = [
    {
      id: 1,
      name: 'Prog 1',
      day: 'Hétfő',
      time: '10:00-12:00',
      teacher: 'Selim Etkar',
      selected: false,
    },
    {
      id: 2,
      name: 'Prog 2',
      day: 'Kedd',
      time: '14:00-16:00',
      teacher: 'Turbo Titán',
      selected: false,
    },
    {
      id: 3,
      name: 'Prog 3',
      day: 'Szerda',
      time: '9:00-11:00',
      teacher: 'Mc Isti',
      selected: false,
    },
  ];

  selectedSubjectId: number | null = null; 

  deleteSelectedSubjects() {
    this.subjects = this.subjects.filter((subject) => !subject.selected);
  }

  viewSubjectDetails() {
    if (this.selectedSubjectId !== null) {
      const subject = this.subjects.find((s) => s.id === this.selectedSubjectId);
      if (subject) {
        console.log('Kiválasztott tárgy részletei:', subject);
      }
    }
  }
}
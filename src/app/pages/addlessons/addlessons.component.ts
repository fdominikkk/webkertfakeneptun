import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestrictSelectionDirective } from '../../pages/restrict-selection.directive';

@Component({
  selector: 'app-addlessons',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    RestrictSelectionDirective,
  ],
  templateUrl: './addlessons.component.html',
  styleUrl: './addlessons.component.css'
})
export class AddlessonsComponent {
  subjects = [
    {
      name: 'Programozás Alapjai',
      teacher: 'Ali Abdul Aziz',
      credits: 434530
    },
    {
      name: 'Adatbázis Rendszerek',
      teacher: 'Lakatos Brendon',
      credits: 556785678
    }
  ];

  searchText: string = '';
  selectedDates: { [key: string]: Date | null } = {};
  showDatepicker: { [key: string]: boolean } = {};

  toggleDatepicker(subject: string) {
    if (!this.isSubjectSelected(subject)) {
      this.showDatepicker[subject] = !this.showDatepicker[subject];
    }
  }

  onDateSelected(subject: string, event: any) {
    this.selectedDates[subject] = event.value;
    this.showDatepicker[subject] = false;
  }

  getFilteredSubjects() {
    if (!this.searchText) {
      return this.subjects;
    }
    return this.subjects.filter(subject =>
      subject.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  isSubjectSelected(subject: string): boolean {
    return !!this.selectedDates[subject];
  }
}
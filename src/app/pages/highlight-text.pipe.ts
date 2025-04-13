import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightText',
  standalone: true
})
export class HighlightTextPipe implements PipeTransform {
  transform(value: string, newsType: string): string {
    if (!value) return value;

    switch (newsType) {
      case 'sürgős':
        return value.toUpperCase(); 
      case 'általános':
        return `<i>${value}</i>`; 
      default:
        return value; 
    }
  }
}
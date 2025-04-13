import { Directive, ElementRef, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[appNewsHighlight]'
})
export class NewsHighlightDirective {
  @Input() set appNewsHighlight(type: string) {
    let backgroundColor: string;
    switch (type) {
      case 'sürgős':
        backgroundColor = '#ffcccc';
        break;
      case 'általános':
        backgroundColor = '#e6f3ff';
        break;
      default:
        backgroundColor = 'transparent';
    }
    this.renderer.setStyle(this.el.nativeElement, 'background-color', backgroundColor);
    this.renderer.setStyle(this.el.nativeElement, 'padding', '5px');
    this.renderer.setStyle(this.el.nativeElement, 'border-radius', '4px');
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}
}
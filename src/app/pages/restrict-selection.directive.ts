import { Directive, ElementRef, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[appRestrictSelection]'
})
export class RestrictSelectionDirective {
  @Input() set appRestrictSelection(isRestricted: boolean) {
    if (isRestricted) {
      this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
      this.renderer.setStyle(this.el.nativeElement, 'background-color', '#bdbdbd');
      this.renderer.setStyle(this.el.nativeElement, 'color', '#757575'); 
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '0.7'); 
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'not-allowed');
    } else {

      this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
      this.renderer.removeStyle(this.el.nativeElement, 'background-color'); 
      this.renderer.removeStyle(this.el.nativeElement, 'color'); 
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer');
    }
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}
}
import {Directive, ElementRef, Renderer} from '@angular/core';

@Directive({
  selector: '[autoGrow]', //attribute
  host: { //subscribe to an action
    '(focus)': 'onFocus()', //call onFocus function
    '(blur)': 'onBlur()' // call onBlur function
  }
})

export class AutoGrowDirective {

  //with private keyword befare a value, we create a private class value
  constructor(private el: ElementRef, private renderer: Renderer) {
  }

  onFocus(){
    this.renderer.setElementStyle(this.el.nativeElement, 'width', '200')
  }

  onBlur(){
    this.renderer.setElementStyle(this.el.nativeElement, 'width', '120')
  }
}

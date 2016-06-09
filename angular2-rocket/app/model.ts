import { Injectable } from '@angular/core';


@Injectable()
export class Model {
  constructor() { this.counter = 0 }

  private counter : number = 0 ;

  present(incBy: number) {
      console.log('presented') ;
    if (incBy<=10) {
        this.counter += incBy;
    }
  }
}

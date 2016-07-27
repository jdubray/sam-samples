import {Component, ViewEncapsulation} from '@angular/core';
import {State} from "../../../state/app.state";

import {BaAppPicturePipe} from '../../../theme/pipes';

@Component({
  selector: 'popular-app',
  encapsulation: ViewEncapsulation.None,
  pipes: [BaAppPicturePipe],
  styles: [require('./popularApp.scss')],
  template: require('./popularApp.html')
})
export class PopularApp {

  ngOnInit() {
  }
}

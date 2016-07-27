import {Component, ViewEncapsulation} from '@angular/core';
import {State} from "../../../state/app.state";

import {UsersMapService} from '../../../services/usersMap.service';
import {BaAmChart} from '../../../theme/components';

@Component({
  selector: 'users-map',
  encapsulation: ViewEncapsulation.None,
  providers: [UsersMapService],
  directives: [BaAmChart],
  styles: [require('./usersMap.scss')],
  template: require('./usersMap.html')
})
export class UsersMap {

  mapData:Object;

  constructor(private _usersMapService:UsersMapService, private _state:State) {
    this.mapData = this._usersMapService.getData();

     this._state.subscribe('dashboard.mapData', (mapData) => {
        this.mapData = mapData;
        //this.ref.detectChanges() ;
      }); 
  }
}

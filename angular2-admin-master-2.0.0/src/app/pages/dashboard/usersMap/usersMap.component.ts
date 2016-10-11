import {Component, ViewEncapsulation} from '@angular/core';

import {UsersMapService} from '../../../services/usersMap.service';

import {State} from "../../../state/state";
 
@Component({
  selector: 'users-map',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./usersMap.scss')],
  template: require('./usersMap.html')
})
export class UsersMap {

  mapData:Object;

  constructor(private _usersMapService:UsersMapService, private _state:State) {
    this.mapData = this._usersMapService.getData();

     this._state.subscribe('dashboard.mapData', (mapData) => {
       if (mapData) {
          this.mapData = mapData;
        }
        //this.ref.detectChanges() ;
      }); 
  }
}
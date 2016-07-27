import {Component, ViewEncapsulation,ChangeDetectorRef} from '@angular/core';
import {State} from "../../../state/app.state";
import {BaProfilePicturePipe, BaAppPicturePipe} from '../../../theme/pipes';

import {FeedService}      from '../../../services/feed.service';


@Component({
  selector: 'feed',
  encapsulation: ViewEncapsulation.None,
  providers: [FeedService],
  pipes: [BaProfilePicturePipe, BaAppPicturePipe],
  styles: [require('./feed.scss')],
  template: require('./feed.html')
})
export class Feed {

  public _feed:Array<Object>;

  constructor(private ref: ChangeDetectorRef, private _state:State, private _feedService: FeedService) {
      // private _feedService:FeedService

      this._state.subscribe('dashboard.feed', (feed) => {
        this._feed = feed;
        //this.ref.detectChanges() ;
      });
  }

  expandMessage (message){
    message.expanded = !message.expanded;
  }

}

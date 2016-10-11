import {Component, ViewEncapsulation, ChangeDetectorRef} from '@angular/core';
import {State} from "../../../state/state";


//import {FeedService}      from '../../../services/feed.service';

@Component({
  selector: 'feed',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./feed.scss')],
  template: require('./feed.html')
})
export class Feed {

  public feed:Array<Object>;

  constructor(private ref: ChangeDetectorRef, private _state:State) { //, private _feedService:FeedService
      
      console.log(this._state);
      this._state.subscribe('dashboard.feed', (feed) => {
        
        if (feed) { 
          this.feed = feed;
        }
      });

  }

  ngOnInit() {
    //this._loadFeed();
  }

  expandMessage (message){
    message.expanded = !message.expanded;
  }

  private _loadFeed() {
    //this.feed = this._feedService.getData();
  }
}

import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { SamFactory }     from './services/sam.service';
import {State} from "./state/state"; 

import {ChartService}          from './services/chart.service';

declare var actionsMount: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    public sam : any ;

    constructor(
        private translate: TranslateService,
        private _state:State,
    
        // SAM
        private myChartService : ChartService,
    ) {
        translate.addLangs(['en', 'fr', 'ur']);
        translate.setDefaultLang('en');
        const browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|fr|ur/) ? browserLang : 'en');

        this.sam = SamFactory.instance(
            this,
            'actionsMount',
            actionsMount
            ,[
                {type:"actions", serviceName:'Chart', service:myChartService, init: false},
            ]
    );   
    }
}

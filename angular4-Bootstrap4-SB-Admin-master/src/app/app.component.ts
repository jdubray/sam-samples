import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { SamService } from './services/sam.service';
import { ChartService } from './services/chart.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(
        translate: TranslateService,
        sam: SamService,
        myChartService: ChartService,
    ) {
        translate.addLangs(['en', 'fr', 'ur']);
        translate.setDefaultLang('en');
        const browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|fr|ur/) ? browserLang : 'en');

        sam.init([
            { type: 'actions', serviceName: 'Chart', service: myChartService, init: false },
        ]);
    }
}

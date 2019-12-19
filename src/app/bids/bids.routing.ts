import { Routes } from '@angular/router';

import { BidsComponent } from './bids.component';

export const BidsRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: BidsComponent
    }]
}
];

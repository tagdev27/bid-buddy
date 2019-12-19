import { Routes } from '@angular/router';

import { MerchantsComponent } from './merchants.component';

export const MerchantsRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: MerchantsComponent
    }]
}
];

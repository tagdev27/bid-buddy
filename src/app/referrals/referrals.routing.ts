import { Routes } from '@angular/router';

import { ReferralsComponent } from './referrals.component';

export const ReferralsRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: ReferralsComponent
    }]
}
];

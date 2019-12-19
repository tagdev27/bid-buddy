import { Routes } from '@angular/router';

import { CustomersComponent } from './customers.component';

export const CustomersRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: 'customers',
        component: CustomersComponent
    }]
}
];

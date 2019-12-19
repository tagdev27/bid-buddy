import { Routes } from '@angular/router';

import { GeneralComponent } from './general/general.component';
import { PlansComponent } from './plans/plans.component';
import { BidRateComponent } from './bidrate/bidrate.component';
import { CategoryComponent } from "./category/category.component";
import { MessageTemplatesComponent } from './message-templates/message-templates.component';


export const StoreRoutes: Routes = [
    {
      path: '',
      children: [ {
        path: 'general',
        component: GeneralComponent
    }]}, {
    path: '',
    children: [ {
      path: 'plans',
      component: PlansComponent
    }]
    },{
        path: '',
        children: [ {
            path: 'bidrate',
            component: BidRateComponent
        }]
    },
    {
      path: '',
      children: [ {
        path: 'category',
        component: CategoryComponent
        }]
    },
    {
      path: '',
      children: [ {
        path: 'message-templates',
        component: MessageTemplatesComponent
        }]
    }
];
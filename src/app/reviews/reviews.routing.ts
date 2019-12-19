import { Routes } from '@angular/router';

import { ReviewsComponent } from './reviews.component';


export const ReviewsRoutes: Routes = [
    {
      path: '',
      children: [ {
        path: '',
        component: ReviewsComponent
        }]
    }
];
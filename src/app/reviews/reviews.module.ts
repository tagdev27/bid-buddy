import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module';

import { ReviewsRoutes } from './reviews.routing';
import { ReviewsComponent } from './reviews.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ReviewsRoutes),
    FormsModule,
    MaterialModule
  ],
  declarations: [
    ReviewsComponent,
  ]
})

export class ReviewsModule {}

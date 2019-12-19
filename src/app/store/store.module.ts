import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module';
import { TagInputModule } from 'ngx-chips';
import { EditorModule } from '@tinymce/tinymce-angular';

import { StoreRoutes } from './store.routing';
import { GeneralComponent } from './general/general.component';
import { PlansComponent } from './plans/plans.component';
import { BidRateComponent } from './bidrate/bidrate.component';
import { CategoryComponent } from "./category/category.component";
import { MessageTemplatesComponent } from './message-templates/message-templates.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(StoreRoutes),
    FormsModule,
    MaterialModule,
    TagInputModule,
    EditorModule
  ],
  declarations: [
    GeneralComponent,
    PlansComponent,
    BidRateComponent,
    CategoryComponent,
    MessageTemplatesComponent
  ]
})

export class StoreModule {}

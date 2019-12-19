import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module';

import { SalesComponent } from './sales.component';
import { SalesRoutes } from './sales.routing';

@NgModule({
    imports: [
        RouterModule.forChild(SalesRoutes),
        CommonModule,
        FormsModule,
        MaterialModule
    ],
    declarations: [SalesComponent]
})

export class SalesModule {}

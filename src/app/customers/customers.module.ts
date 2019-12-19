import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { CustomersComponent } from './customers.component';
import { CustomersRoutes } from './customers.routing';

@NgModule({
    imports: [
        RouterModule.forChild(CustomersRoutes),
        CommonModule,
        FormsModule,
        MaterialModule,
        NgbModule.forRoot(),
    ],
    declarations: [CustomersComponent]
})

export class CustomersModule {}

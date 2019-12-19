import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module';

import { PaymentComponent } from './payment.component';
import { PaymentRoutes } from './payment.routing';

@NgModule({
    imports: [
        RouterModule.forChild(PaymentRoutes),
        CommonModule,
        FormsModule,
        MaterialModule
    ],
    declarations: [PaymentComponent]
})

export class PaymentModule {}

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module';

import { ReferralsComponent } from './referrals.component';
import { ReferralsRoutes } from './referrals.routing';

@NgModule({
    imports: [
        RouterModule.forChild(ReferralsRoutes),
        CommonModule,
        FormsModule,
        MaterialModule
    ],
    declarations: [ReferralsComponent]
})

export class ReferralsModule {}

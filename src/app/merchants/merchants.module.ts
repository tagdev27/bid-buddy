import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
// import { GooglePlaceModule } from "ngx-google-places-autocomplete";
// import { HttpModule } from '@angular/http';

import { MerchantsComponent } from './merchants.component';
import { MerchantsRoutes } from './merchants.routing';

@NgModule({
    imports: [
        RouterModule.forChild(MerchantsRoutes),
        CommonModule,
        FormsModule,
        MaterialModule,
        NgbModule.forRoot(),
        // GooglePlaceModule,
        // HttpModule
    ],
    declarations: [MerchantsComponent]
})

export class MerchantsModule {}

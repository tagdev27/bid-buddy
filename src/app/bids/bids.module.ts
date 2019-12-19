import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdModule } from '../md/md.module';
import { MaterialModule } from '../app.module';
import { TagInputModule } from 'ngx-chips';
// import { DataTableComponent } from "../tables/datatable.net/datatable.component";

import { BidsComponent } from './bids.component';
import { BidsRoutes } from './bids.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(BidsRoutes),
        FormsModule,
        MdModule,
        MaterialModule,
        TagInputModule
    ],

    declarations: [BidsComponent]
})

export class BidsModule {}

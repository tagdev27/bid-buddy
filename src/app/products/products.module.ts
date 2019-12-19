import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../app.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { ProductsComponent } from './products.component';
import { ProductsRoutes } from './products.routing';

import { TagInputModule } from 'ngx-chips';
import { ClipboardModule } from 'ngx-clipboard';

import { HttpClientModule } from "@angular/common/http";

@NgModule({
    imports: [
        RouterModule.forChild(ProductsRoutes),
        CommonModule,
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
        TagInputModule,
        ClipboardModule,
        HttpClientModule
    ],
    declarations: [ProductsComponent]
})

export class ProductsModule {}
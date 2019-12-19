import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import * as firebase from "firebase";
import swal from 'sweetalert2';
import { MainCategory } from "../models/main.category";
import { Router } from '@angular/router';
import { OverlayService } from '../overlay/overlay.module';
import { ProgressSpinnerComponent } from '../progress-spinner/progress-spinner.module';
import { AppConfig } from "../services/global.service";
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import { Product } from 'src/app/models/product';
import { Reviews } from 'src/app/models/review';

//declare var $: any;

declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}

@Component({
    selector: 'app-reviews-cmp',
    templateUrl: './reviews.component.html',
    styleUrls: ['./reviews.component.css']
})

export class ReviewsComponent implements OnInit, OnDestroy {

    public dataTable: DataTable;
    config = new AppConfig()
    data: string[][] = []

    ngOnDestroy() {

    }

    constructor(private previewProgressSpinner: OverlayService) {
    }

    getReviews() {
        firebase.firestore().collection('reviews').onSnapshot(query => {
            this.data = []
            var index = 1
            query.forEach(async data => {
                const rev = <Reviews>data.data()
                const getPro = await this.getProductById(rev.product_id)
                const pro = <Product>getPro.data()
                this.data.push([`${index}`, rev.id, pro.name, rev.name, rev.title, rev.text, `${rev.rating}`, rev.created_date, 'btn-link'])
                index = index + 1
            })
            this.dataTable = {
                headerRow: ['ID', 'Product Name', 'User Name', 'Title', 'Text', 'Rating', 'Created Date', 'Actions'],
                footerRow: ['ID', 'Product Name', 'User Name', 'Title', 'Text', 'Rating', 'Created Date', 'Actions'],
                dataRows: this.data
            };
        });
    }

    getProductById(id:any){
        return firebase.firestore().collection('db').doc('tacadmin').collection('products').doc(id).get()
    }

    ngOnInit() {
        this.getReviews()
    }

    deleteRev(rev: any) {
        const id = `${rev[1]}`
        swal({
            title: 'Delete Alert',
            text: 'Are you sure about deleting this review?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            confirmButtonClass: "btn btn-success",
            cancelButtonClass: "btn btn-danger",
            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
                firebase.firestore().collection('reviews').doc(id).delete().then(del => {
                    const current_email = localStorage.getItem('email')
                    const current_name = localStorage.getItem('name')
                    this.config.logActivity(`${current_name}|${current_email} deleted this review: ${rev[2]}`)
                    this.config.displayMessage("Successfully deleted", true);
                }).catch(err => {
                    this.config.displayMessage(`${err}`, false);
                })
            } else {
                swal({
                    title: 'Cancelled',
                    text: 'Deletion not successful',
                    type: 'error',
                    confirmButtonClass: "btn btn-info",
                    buttonsStyling: false
                }).catch(swal.noop)
            }
        })
    }

    ngAfterViewInit() {
        //$.noConflict();
        (<any>$('#datatables')).DataTable({
            "pagingType": "full_numbers",
            "lengthMenu": [
                [10, 25, 50, -1],
                [10, 25, 50, "All"]
            ],
            responsive: true,
            language: {
                search: "_INPUT_",
                searchPlaceholder: "Search records",
            }

        });

        const table = (<any>$('#datatables')).DataTable();

        // Edit record
        // table.on('click', '.edit', function (e) {
        //     let $tr = $(this).closest('tr');
        //     if ($($tr).hasClass('child')) {
        //         $tr = $tr.prev('.parent');
        //     }

        //     var data = table.row($tr).data();
        //     alert('You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.');
        //     e.preventDefault();
        // });

        // // Delete a record
        // table.on('click', '.remove', function (e) {
        //     const $tr = $(this).closest('tr');
        //     table.row($tr).remove().draw();
        //     e.preventDefault();
        // });

        // //Like record
        // table.on('click', '.like', function (e) {
        //     alert('You clicked on Like button');
        //     e.preventDefault();
        // });

        $('.card .material-datatables label').addClass('form-group');
    }
}
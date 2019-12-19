import { Component, OnInit } from '@angular/core';
import { TableData } from '../md/md-table/md-table.component';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import * as firebase from "firebase";
import { Users } from '../models/users';
import { Sales } from '../models/sales';

declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}

@Component({
    selector: 'app-sales-cmp',
    templateUrl: 'sales.component.html',
    styleUrls: ['./sales.component.css']
})

export class SalesComponent implements OnInit {

    public dataTable: DataTable;
    data: string[][] = []

    ngOnInit() {
        this.getLogs()
    }

    constructor(){
        // this.dataTable = {
        //     headerRow: ['ID', 'Log', 'Created Date'],
        //     footerRow: ['ID', 'Log', 'Created Date'],
        //     dataRows: this.data
        // };
    }

    getLogs() {
        firebase.firestore().collection('sales').onSnapshot(query => {
            this.data = []
            var index = 1
            query.forEach(async data => {
                const sale = <Sales>data.data()
                const user = await this.getCustomerByID(sale.customer_id)
                this.data.push([`${index}`, user.fullName, user.email, sale.transaction_id, `₦${sale.amount_paid}`, `₦${sale.nrc_amount}`, sale.status, sale.created_date])
                index = index + 1
            })
            this.dataTable = {
                headerRow: ['ID', 'Customer Name', 'Customer Email', 'Transaction ID', 'Amount Paid', 'NLC Commission', 'Status', 'Created Date'],
                footerRow: ['ID', 'Customer Name', 'Customer Email', 'Transaction ID', 'Amount Paid', 'NLC Commission', 'Status', 'Created Date'],
                dataRows: this.data
            };
        });
    }

    async getCustomerByID(id:string){
        const getC = await firebase.firestore().collection('customers').doc(id).get()
        return <Users>getC.data()
    }

    ngAfterViewInit() {
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

        $('.card .material-datatables label').addClass('form-group');
    }
}

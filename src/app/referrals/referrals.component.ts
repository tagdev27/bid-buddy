import { Component, OnInit } from '@angular/core';
import { TableData } from '../md/md-table/md-table.component';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import * as firebase from "firebase";
import { Users } from '../models/users';

declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}

@Component({
    selector: 'app-referrals-cmp',
    templateUrl: 'referrals.component.html',
    styleUrls: ['./referrals.component.css']
})

export class ReferralsComponent implements OnInit {

    public dataTable: DataTable;
    data: string[][] = []

    ngOnInit() {
        this.getReferrals()
    }

    constructor(){
        // this.dataTable = {
        //     headerRow: ['ID', 'Log', 'Created Date'],
        //     footerRow: ['ID', 'Log', 'Created Date'],
        //     dataRows: this.data
        // };
    }

    getReferrals() {
        firebase.firestore().collection('referrals').onSnapshot(query => {
            this.data = []
            var index = 1
            query.forEach(async data => {
                const ref = data.data()
                const user = await this.getCustomerByID(ref['ref_referral_id'])
                this.data.push([`${index}`, ref['ref_code'], user.fullName, ref['created_date']])
                index = index + 1
            })
            this.dataTable = {
                headerRow: ['ID', 'Referral Code', 'Referred By', 'Created Date'],
                footerRow: ['ID', 'Referral Code', 'Referred By', 'Created Date'],
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

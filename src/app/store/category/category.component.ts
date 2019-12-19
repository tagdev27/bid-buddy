import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import * as firebase from "firebase";
import swal from 'sweetalert2';
import { MainCategory } from "../../models/main.category";
import { Router } from '@angular/router';
import { OverlayService } from '../../overlay/overlay.module';
import { ProgressSpinnerComponent } from '../../progress-spinner/progress-spinner.module';
import { AppConfig } from "../../services/global.service";
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';

//declare var $: any;

declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}

@Component({
    selector: 'app-category-cmp',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.css']
})

export class CategoryComponent implements OnInit, OnDestroy {

    public dataTable: DataTable;
    config = new AppConfig()
    data: string[][] = []
    categories: MainCategory[] = []

    addNewCat = false
    addNewCat2 = false
    editCat = false
    currentCatRow: any

    selectedCategory: MainCategory
    isDeletedView = false

    ngOnDestroy() {

    }

    constructor(private previewProgressSpinner: OverlayService) {
        //this.previewProgressSpinner.open({ hasBackdrop: true }, ProgressSpinnerComponent);
        // this.dataTable = {
        //     headerRow: ['Image', 'Name', 'Description', 'Created Date', 'Modified Date', 'Actions'],
        //     footerRow: ['Image', 'Name', 'Description', 'Created Date', 'Modified Date', 'Actions'],
        //     dataRows: this.data
        // };
    }

    getCategories() {
        this.isDeletedView = false
        firebase.firestore().collection('db').doc('bidbuddy').collection('main-categories').onSnapshot(query => {
            this.data = []
            this.categories = []
            var index = 1
            query.forEach(data => {
                const category = <MainCategory>data.data()
                this.categories.push(category)
                if (!category.deleted) {
                    this.data.push([`${index}` ,category.id, category.name, category.description, category.created_date, category.created_by, `${category.deleted}`, category.modified_date, 'btn-link'])
                }
                index = index + 1
            })
            this.dataTable = {
                headerRow: ['ID', 'Name', 'Created Date', 'Modified Date', 'Actions'],
                footerRow: ['ID', 'Name', 'Created Date', 'Modified Date', 'Actions'],
                dataRows: this.data
            };
        });
    }

    getDeletedCategories() {
        this.isDeletedView = true
        firebase.firestore().collection('db').doc('bidbuddy').collection('main-categories').onSnapshot(query => {
            this.data = []
            this.categories = []
            var index = 0
            query.forEach(data => {
                const category = <MainCategory>data.data()
                this.categories.push(category)
                if (category.deleted) {
                    this.data.push([`${index}`, category.id, category.name, category.description, category.created_date, category.created_by, `${category.deleted}`, category.modified_date, 'btn-link'])
                }
                index = index + 1
            })
            this.dataTable = {
                headerRow: ['ID', 'Name', 'Created Date', 'Modified Date', 'Actions'],
                footerRow: ['ID', 'Name', 'Created Date', 'Modified Date', 'Actions'],
                dataRows: this.data
            };
        });
    }

    ngOnInit() {
        this.getCategories()
    }

    addCat() {
        this.addNewCat = true
        this.addNewCat2 = true
    }

    cancelAddCat() {
        this.addNewCat = false
        this.addNewCat2 = false
        this.editCat = false
    }

    categorySubmitClicked() {
        const name = (<HTMLInputElement>document.getElementById("cat_name")).value;
        const desc = (<HTMLInputElement>document.getElementById("cat_desc")).value;
        // const meta = (<HTMLInputElement>document.getElementById("cat_meta")).value;
        // const image = (<HTMLInputElement>document.getElementById("cat_image")).files

        if (name == ''){// || meta == '' || image.length == 0) {
            this.config.displayMessage("Please enter all fields.", false)
            return
        }

        this.previewProgressSpinner.open({ hasBackdrop: true }, ProgressSpinnerComponent)
        const key = firebase.database().ref().push().key
        // const upload_task = firebase.storage().ref("main-category").child(`${key}.jpg`)

            const current_email = localStorage.getItem('email')
            const current_name = localStorage.getItem('name')
            const category: MainCategory = {
                id: key,
                name: name,
                description: desc,
                created_date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
                created_by: `${current_name}|${current_email}`,
                deleted: false,
                modified_date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
            }
            firebase.firestore().collection('db').doc('bidbuddy').collection('main-categories').doc(key).set(category).then(d => {
                this.config.logActivity(`${current_name}|${current_email} created this category: ${name}`)
                this.previewProgressSpinner.close()
                this.config.displayMessage(`Category created successfully.`, true);
                this.addNewCat = false
                this.addNewCat2 = false
                this.editCat = false
            }).catch(err => {
                this.previewProgressSpinner.close()
                this.config.displayMessage(`${err}`, false);
            })
    }

    restoreCatClick(cat:any){
        const id = `${cat[1]}`
        swal({
            title: 'Restore Alert',
            text: 'Are you sure about restoring this category?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, restore it!',
            cancelButtonText: 'No, keep it',
            confirmButtonClass: "btn btn-success",
            cancelButtonClass: "btn btn-danger",
            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
                firebase.firestore().collection('db').doc('bidbuddy').collection('main-categories').doc(id).update({ 'deleted': false }).then(del => {
                    const current_email = localStorage.getItem('email')
                    const current_name = localStorage.getItem('name')
                    this.config.logActivity(`${current_name}|${current_email} restored this category: ${cat[1]}`)
                    this.config.displayMessage("Successfully restored", true);
                }).catch(err => {
                    this.config.displayMessage(`${err}`, false);
                })
            } else {
                swal({
                    title: 'Cancelled',
                    text: 'Restoration not successful',
                    type: 'error',
                    confirmButtonClass: "btn btn-info",
                    buttonsStyling: false
                }).catch(swal.noop)
            }
        })
    }

    deleteCat(cat: any) {
        const id = `${cat[1]}`
        swal({
            title: 'Delete Alert',
            text: 'Are you sure about deleting this category?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            confirmButtonClass: "btn btn-success",
            cancelButtonClass: "btn btn-danger",
            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
                firebase.firestore().collection('db').doc('bidbuddy').collection('main-categories').doc(id).update({ 'deleted': true }).then(del => {
                    const current_email = localStorage.getItem('email')
                    const current_name = localStorage.getItem('name')
                    this.config.logActivity(`${current_name}|${current_email} deleted this category: ${cat[1]}`)
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

    editCatClick(cat: any) {
        this.editCat = true
        this.addNewCat = true
        this.addNewCat2 = false
        this.currentCatRow = cat
    }

    categoryUpdateClicked() {
        const name = (<HTMLInputElement>document.getElementById("ucat_name")).value;
        const desc = (<HTMLInputElement>document.getElementById("ucat_desc")).value;
        // const meta = (<HTMLInputElement>document.getElementById("ucat_meta")).value;
        // const image = (<HTMLInputElement>document.getElementById("ucat_image")).files

        if (name == ''){// || meta == '') {
            this.config.displayMessage("Please enter all fields.", false)
            return
        }

        if (name == `${this.currentCatRow[2]}` && desc == `${this.currentCatRow[3]}`){// && meta == `${this.currentCatRow[7]}` && image.length == 0) {
            this.addNewCat = false
            this.addNewCat2 = false
            this.editCat = false
            return
        }

        this.previewProgressSpinner.open({ hasBackdrop: true }, ProgressSpinnerComponent)

        const current_email = localStorage.getItem('email')
        const current_name = localStorage.getItem('name')
        const key = firebase.database().ref().push().key
        // const upload_task = firebase.storage().ref("main-category").child(`${key}.jpg`)
        firebase.firestore().collection('db').doc('bidbuddy').collection('main-categories').doc(key).update({
            'name': name,
            'description': desc,
            'modified_date': `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
        }).then(d => {
            this.config.logActivity(`${current_name}|${current_email} updated this category: ${name}`)
            this.previewProgressSpinner.close()
            this.config.displayMessage(`Category updated successfully.`, true);
            this.addNewCat = false
            this.addNewCat2 = false
            this.editCat = false
        }).catch(err => {
            this.previewProgressSpinner.close()
            this.config.displayMessage(`${err}`, false);
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
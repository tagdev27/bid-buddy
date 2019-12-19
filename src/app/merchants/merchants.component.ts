import { Component, OnInit, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as firebase from "firebase";
import swal from 'sweetalert2';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import { OverlayService } from '../overlay/overlay.module';
import { ProgressSpinnerComponent } from '../progress-spinner/progress-spinner.module';

import { AppConfig } from "src/app/services/global.service";
import { Merchants } from '../models/merchant';
import { Subscriptions } from '../models/plans';
// import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
// import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { AdminUsers } from '../models/admin.users';
import { } from 'googlemaps';
// import { HttpClient } from '@angular/common/http';
import { MailChirmp } from '../services/newsletter';
import { HttpClient } from '@angular/common/http';

declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}

@Component({
    selector: 'app-merchants-cmp',
    templateUrl: './merchants.component.html',
    styleUrls: ['./merchants.component.css']
})

export class MerchantsComponent implements OnInit, OnDestroy {

    // @ViewChild("placesRef", { static: false }) placesRef: GooglePlaceDirective;

    constructor(private previewProgressSpinner: OverlayService, private mHttp:HttpClient) { }

    public dataTable: DataTable;
    config = new AppConfig()
    data: string[][] = []
    merchants: Merchants[] = []
    plans: Subscriptions[] = []

    addNewPro = false
    editPro = false
    currentProRow: Merchants

    selectedProduct: Merchants
    isDeletedView = false

    ///////////////////////
    business_name = ''
    business_location = null
    phone = ''
    email = ''
    planType = ''
    cac_number = ''
    industry = ''
    approved = 'false'
    status = ''
    payment_option = ''
    total_users = 0

    access_levels = ''

    options = {
        types: [],
        componentRestrictions: { country: 'NG' }
    }

    true_false_data = [
        { value: 'false', viewValue: 'False' },
        { value: 'true', viewValue: 'True' },
    ]

    status_data = [
        { value: 'active', viewValue: 'Active' },
        { value: 'in-active', viewValue: 'Inactive' },
    ]

    industry_data = [
        { value: 'product', viewValue: 'Product' },
        { value: 'services', viewValue: 'Services' },
    ]

    payment_option_data = [
        { value: 'monthly', viewValue: 'Monthly' },
        { value: 'yearly', viewValue: 'Yearly' },
    ]
    ///////////////////////

    clearField() {
        this.business_name = ''
        this.business_location = null
        this.phone = ''
        this.email = ''
        this.planType = ''
        this.cac_number = ''
        this.industry = ''
        this.approved = 'false'
        this.status = ''
        this.payment_option = ''
        this.total_users = 0
    }

    ngOnDestroy() {

    }

    initAutoComplete() {
        //console.log('i dey here')
        const locationInput = (<HTMLInputElement>document.getElementById("bisLoc"));
        //var input = document.getElementById('bisLoc')
        var autocomplete = new google.maps.places.Autocomplete(locationInput);
        // Set the data fields to return when the user selects a place.
        autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);

        autocomplete.addListener('place_changed', function () {
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                window.alert("No details available for input: '" + place.name + "'");
                return;
            }
            console.log(place.geometry.location.toJSON())
            //marker.setPosition(place.geometry.location);

            var address = '';
            if (place.address_components) {
                address = [
                    (place.address_components[0] && place.address_components[0].short_name || ''),
                    (place.address_components[1] && place.address_components[1].short_name || ''),
                    (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
                console.log(address)
            }
        });
    }

    ngOnInit() {
        this.getMerchantAccessLevels()
        this.getMerchants()
        this.getPlans()
        this.initAutoComplete()
    }

    addPro() {
        this.addNewPro = true
        //this.addNewCat2 = true
    }

    cancelAddPro() {
        this.addNewPro = false
        //this.addNewCat2 = false
        this.editPro = false
        this.clearField()
    }

    getPlans() {
        firebase.firestore().collection('db').doc('bidbuddy').collection('plans').get().then(query => {
            this.plans = []
            query.forEach(data => {
                const p = <Subscriptions>data.data()
                this.plans.push(p)
            })
        });
    }

    async getPlansByID(id: string) {
        const getPlan = await firebase.firestore().collection('db').doc('bidbuddy').collection('plans').doc(id).get()
        return <Subscriptions>getPlan.data()
    }

    getMerchantAccessLevels() {
        firebase.firestore().collection('db').doc('bidbuddy').collection('roles').where("name", "==", "Merchant").get().then(role => {
            role.forEach(r => {
                const rol = r.data()
                this.access_levels = rol['access_levels']
            })
        })
    }

    getMerchants() {
        this.isDeletedView = false
        firebase.firestore().collection('db').doc('bidbuddy').collection('merchants').onSnapshot(query => {
            this.data = []
            this.merchants = []
            var index = 0
            query.forEach(async data => {
                const mer = <Merchants>data.data()
                this.merchants.push(mer)
                const sub = await this.getPlansByID(mer.subscription_id)
                this.data.push([`${index}`, mer.business_name, mer.business_location, mer.phone, mer.email, sub.title, `${mer.approved}`, mer.status, mer.created_date, mer.modified_date, 'btn-link'])
                index = index + 1
            })
            this.dataTable = {
                headerRow: ['Business Name', 'Location', 'Phone', 'Email', 'Subscription Type', 'Approval', 'Status', 'Created Date', 'Modified Date', 'Actions'],
                footerRow: ['Business Name', 'Location', 'Phone', 'Email', 'Subscription Type', 'Approval', 'Status', 'Created Date', 'Modified Date', 'Actions'],
                dataRows: this.data
            };
        });
    }

    // public handleAddressChange(address: Address) {
    //     console.log(address)
    // }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async checkIfBusinessNameExists() {
        const a = await firebase.firestore().collection('db').doc('bidbuddy').collection('merchants').where('business_name', '==', this.business_name).get()
        return a.size
    }

    async productSubmitClicked() {
        const getCurrentPlan = this.plans.filter((value, index, array) => {
            return value.title == this.planType
        })
        if (
            this.business_name == '' ||
            this.phone == '' ||
            this.email == '' ||
            this.planType == '' ||
            this.cac_number == '' ||
            this.industry == '' ||
            this.total_users == 0 ||
            this.status == '' || this.payment_option == ''
        ) {//|| this.basket_items.length == 0
            this.config.displayMessage("All fields marked with * are required", false)
            return
        }
        this.previewProgressSpinner.open({ hasBackdrop: true }, ProgressSpinnerComponent);
        if (!this.editPro) {//new add
            const size = await this.checkIfBusinessNameExists()
            if (size > 0) {
                this.previewProgressSpinner.close()
                this.config.displayMessage("Sorry, business name already exists. Try another name", false)
                return
            }
            const key = firebase.database().ref().push().key
            const current_email = localStorage.getItem('email')
            const current_name = localStorage.getItem('name')
            const merchant: Merchants = {
                id: key,
                business_name: this.business_name,
                business_location: this.business_location,
                phone: this.phone,
                email: this.email,
                subscription_id: getCurrentPlan[0].id,
                payment_option: this.payment_option,
                total_users: this.total_users,
                cac_number: this.cac_number,
                industry: this.industry,
                approved: this.approved == 'false' ? false : true,
                status: this.status,
                created_date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
                created_by: `${current_name}|${current_email}`,
                modified_date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
            }
            firebase.firestore().collection('db').doc('bidbuddy').collection('merchants').doc(key).set(merchant).then(d => {
                const add_merchat_to_admin_user: AdminUsers = {
                    id: key,
                    access_levels: this.access_levels,
                    blocked: false,
                    email: this.email.toLowerCase(),
                    image: 'https://firebasestorage.googleapis.com/v0/b/bidbuddy-9b4de.appspot.com/o/default-avatar.png?alt=media&token=68922254-b829-4080-b23f-d18879aa0b25',
                    name: this.business_name,
                    position: 'Merchant - Owner',
                    role: 'Merchant',
                    business_owner: key
                }
                firebase.firestore().collection('db').doc('bidbuddy').collection('users').doc(this.email.toLowerCase()).set(add_merchat_to_admin_user).then(async d => {
                    this.config.logActivity(`${current_name}|${current_email} created this merchant: ${this.business_name}`)
                    await this.subscribeToNewsletterAndSendEmailNotification()
                    this.previewProgressSpinner.close()
                    this.config.displayMessage(`Merchant created successfully.`, true);
                    this.addNewPro = false
                    this.editPro = false
                    this.clearField()
                })
            }).catch(err => {
                this.previewProgressSpinner.close()
                this.config.displayMessage(`${err}`, false);
            })
        } else {//update
            if (this.currentProRow.business_name != this.business_name) {
                const size = await this.checkIfBusinessNameExists()
                if (size > 0) {
                    this.previewProgressSpinner.close()
                    this.config.displayMessage("Sorry, business name already exists. Try another name", false)
                    return
                }
            }
            this.updateValues()
        }

    }

    async subscribeToNewsletterAndSendEmailNotification() {
        var _fn = '', _ln = ''
        if (this.business_name.split(' ').length > 0) {
          _fn = this.business_name.split(' ')[0]
          _ln = this.business_name.split(' ')[1]
        } else {
          _fn = this.business_name
        }
        const htmlBody = new MailChirmp().emailHtmlBody() 
        await this.mHttp.post(`https://mail.bidbuddy.app/emailsending/mailchimp.php?sender_email=${this.email}&sender_name=${this.business_name}`, {
          lat: '', lng: '', fn: _fn, ln: _ln, body: htmlBody
        }).toPromise()
      }

    updateValues() {
        const getCurrentPlan = this.plans.filter((value, index, array) => {
            return value.title == this.planType
        })
        const merchant: Merchants = {
            business_name: this.business_name,
            business_location: this.business_location,
            phone: this.phone,
            email: this.email,
            subscription_id: getCurrentPlan[0].id,
            payment_option: this.payment_option,
            total_users: this.total_users,
            cac_number: this.cac_number,
            industry: this.industry,
            approved: this.approved == 'false' ? false : true,
            status: this.status,
            modified_date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
        }
        const current_email = localStorage.getItem('email')
        const current_name = localStorage.getItem('name')
        firebase.firestore().collection('db').doc('bidbuddy').collection('merchants').doc(this.currentProRow.id).update(merchant).then(d => {
            this.config.logActivity(`${current_name}|${current_email} updated this merchants: ${this.business_name}`)
            this.previewProgressSpinner.close()
            this.config.displayMessage(`Merchant updated successfully.`, true);
            this.addNewPro = false
            this.editPro = false
            this.clearField()
        }).catch(err => {
            this.previewProgressSpinner.close()
            this.config.displayMessage(`${err}`, false);
        })
    }

    deletePro(_id: any) {
        const id = `${this.merchants[_id].id}`
        const name = `${this.merchants[_id].business_name}`
        swal({
            title: 'Delete Alert',
            text: 'Are you sure about deleting this merchant?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            confirmButtonClass: "btn btn-success",
            cancelButtonClass: "btn btn-danger",
            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
                firebase.firestore().collection('db').doc('bidbuddy').collection('merchants').doc(id).delete().then(del => {
                    //delete from admin too
                    this.deleteAllUsersUnderThisBusinessName()
                    const current_email = localStorage.getItem('email')
                    const current_name = localStorage.getItem('name')
                    this.config.logActivity(`${current_name}|${current_email} deleted this merchant: ${name}`)
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

    deleteAllUsersUnderThisBusinessName() {
        firebase.firestore().collection('db').doc('bidbuddy').collection('users').where("business_owner", "==", this.business_name).get().then(query => {
            query.forEach(async u => {
                const user = <AdminUsers>u.data()
                await firebase.firestore().collection('db').doc('bidbuddy').collection('users').doc(user.email).delete()
            })
        })
    }

    editProClick(_id: any) {
        this.editPro = true
        this.addNewPro = true
        this.currentProRow = this.merchants[_id]
        const getCurrentPlan = this.plans.filter((value, index, array) => {
            return value.id == this.currentProRow.subscription_id
        })
        this.business_name = this.currentProRow.business_name
        this.business_location = this.currentProRow.business_location
        this.phone = this.currentProRow.phone
        this.email = this.currentProRow.email
        this.planType = getCurrentPlan[0].title
        this.payment_option = this.currentProRow.payment_option
        this.total_users = this.currentProRow.total_users
        this.cac_number = this.currentProRow.cac_number
        this.industry = this.currentProRow.industry
        this.approved = `${this.currentProRow.approved}`
        this.status = this.currentProRow.status
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
        //$('').modal()
        $('.card .material-datatables label').addClass('form-group');
    }
}
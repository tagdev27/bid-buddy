import { Component, OnInit, OnDestroy } from "@angular/core";
import { Currency } from "../../models/currency";
import { AppConfig } from "../../services/global.service";
import * as firebase from "firebase"
import swal from "sweetalert2";
import { OverlayService } from '../../overlay/overlay.module';
import { ProgressSpinnerComponent } from '../../progress-spinner/progress-spinner.module';
import { Subscriptions } from "src/app/models/plans";

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

@Component({
    selector: 'app-plans-cmp',
    templateUrl: './plans.component.html',
    styleUrls: ['./plans.component.css']
})

export class PlansComponent implements OnInit, OnDestroy {

    public tableData1: TableData;
    plans: Subscriptions[] = []
    config = new AppConfig()
    data: string[][] = [];
    closeResult = ''

    isAddEdit = false
    isAddCurrency = true
    pName = ''
    pDesc = ''
    pIcon = ''
    pMin = 0
    pMonthly = 0
    pYearly = 0
    pFeatures = []
    paystack_plan_id = ''

    currentCurrent: Subscriptions

    constructor(private previewProgressSpinner: OverlayService){
        this.tableData1 = {
            headerRow: ['#', 'Title', 'Minimum Users', 'Monthly Price', 'Yearly Price', 'Created Date', 'Modified Date', 'Actions'],
            dataRows: this.data
        };
    }

    getCurrencies() {
        firebase.firestore().collection('db').doc('bidbuddy').collection('plans').onSnapshot(query => {
            this.data = []
            this.plans = []
            var index = 0
            query.forEach(data => {
                const p = <Subscriptions>data.data()
                this.plans.push(p)
                this.data.push([`${index + 1}`, p.id, p.title, `${p.minimum_users}`, `₦${p.monthly_price}`, `₦${p.yearly_price}`, p.created_date, p.modified_date, 'btn-link'])
                index = index + 1
            })
            this.tableData1 = {
                headerRow: ['#', 'Title', 'Minimum Users', 'Monthly Price', 'Yearly Price', 'Created Date', 'Modified Date', 'Actions'],
                dataRows: this.data
            };
        });
    }

    ngOnDestroy() {

    }

    ngOnInit() {
        this.getCurrencies()
    }

    addCurrency() {
        this.isAddEdit = true
    }

    cancelCurrency() {
        this.isAddEdit = false
        this.clearFields()
    }

    clearFields() {
        this.pName = ''
        this.pDesc = ''
        this.pIcon = ''
        this.pMin = 0
        this.pMonthly = 0
        this.pYearly = 0
        this.pFeatures = []
        this.paystack_plan_id = ''
    }

    editCurr(id: any) {
        const index = Number(id) - 1
        this.currentCurrent = this.plans[index]
        this.pName = this.currentCurrent.title
        this.pDesc = this.currentCurrent.description
        this.pIcon = this.currentCurrent.icon
        this.pMin = this.currentCurrent.minimum_users
        this.pMonthly = this.currentCurrent.monthly_price
        this.pYearly = this.currentCurrent.yearly_price
        this.pFeatures = this.currentCurrent.features
        this.paystack_plan_id = this.currentCurrent.paystack_plan_id

        this.isAddCurrency = false
        this.isAddEdit = true
    }

    deleteCurr(curr: any) {
        const id = `${curr[1]}`
        swal({
            title: 'Delete Alert',
            text: 'Are you sure about deleting this subscription?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            confirmButtonClass: "btn btn-success",
            cancelButtonClass: "btn btn-danger",
            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
                firebase.firestore().collection('db').doc('bidbuddy').collection('plans').doc(id).delete().then(del => {
                    const current_email = localStorage.getItem('email')
                    const current_name = localStorage.getItem('name')
                    this.config.logActivity(`${current_name}|${current_email} deleted this subscription: ${curr[2]}`)
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

    submitCurrency() {
        if (this.pName == '' || this.pMin == 0 || this.pDesc == '' || this.pIcon == '' || this.pMonthly == null || this.pYearly == null || this.pFeatures.length == 0) {
            this.config.displayMessage("Please enter all fields.", false)
            return
        }
        this.previewProgressSpinner.open({ hasBackdrop: true }, ProgressSpinnerComponent);
        const current_email = localStorage.getItem('email')
        const current_name = localStorage.getItem('name')
        if (this.isAddCurrency) {
            const id = firebase.database().ref().push().key
            const newCurr: Subscriptions = {
                id: id,
                paystack_plan_id:this.paystack_plan_id,
                created_by: `${current_name}|${current_email}`,
                created_date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
                modified_date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
                title:this.pName,
                description:this.pDesc,
                icon:this.pIcon,
                minimum_users:this.pMin,
                monthly_price:this.pMonthly,
                yearly_price:this.pYearly,
                features:this.pFeatures
            }
            firebase.firestore().collection('db').doc('bidbuddy').collection('plans').doc(id).set(newCurr).then(del => {
                this.config.logActivity(`${current_name}|${current_email} created this subscription: ${this.pName}`)
                this.previewProgressSpinner.close()
                this.clearFields()
                this.config.displayMessage("Successfully created", true);
                this.isAddEdit = false
                this.isAddCurrency = true
            }).catch(err => {
                this.previewProgressSpinner.close()
                this.config.displayMessage(`${err}`, false);
            })
        } else {
            firebase.firestore().collection('db').doc('bidbuddy').collection('plans').doc(this.currentCurrent.id).update({
                'modified_date': `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
                title:this.pName,
                description:this.pDesc,
                icon:this.pIcon,
                minimum_users:this.pMin,
                monthly_price:this.pMonthly,
                yearly_price:this.pYearly,
                features:this.pFeatures,
                paystack_plan_id: this.paystack_plan_id
            }).then(del => {
                this.config.logActivity(`${current_name}|${current_email} updated this subscription: ${this.pName}`)
                this.previewProgressSpinner.close()
                this.clearFields()
                this.config.displayMessage("Successfully updated", true);
                this.isAddEdit = false
                this.isAddCurrency = true
            }).catch(err => {
                this.previewProgressSpinner.close()
                this.config.displayMessage(`${err}`, false);
            })
        }
    }


}
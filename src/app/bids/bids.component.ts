import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as firebase from "firebase";
import swal from 'sweetalert2';
import * as $ from 'jquery';
import * as Chartist from 'chartist';
import 'datatables.net';
import 'datatables.net-bs4';
import { OverlayService } from '../overlay/overlay.module';
import { ProgressSpinnerComponent } from '../progress-spinner/progress-spinner.module';

import { AppConfig } from "src/app/services/global.service";
import { Merchants } from '../models/merchant';
import { AdminUsers } from '../models/admin.users';
import { Users } from '../models/users';
import { Product } from '../models/product';
import { Bids } from '../models/bids';
import { BidRate } from '../models/bidvalue';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * model interface for table header, footer, and data
 */
declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}

/**
 * model interface for drop down items
 */
declare interface dropDownItems {
    value: string
    display: string
    id: string
}

@Component({
    selector: 'app-bids',
    templateUrl: 'bids.component.html'
})
export class BidsComponent implements OnInit, AfterViewInit {

    public tableData: DataTable;

    constructor(private previewProgressSpinner: OverlayService, private _Activatedroute:ActivatedRoute, private router:Router) { }

    public dataTable: DataTable;
    config = new AppConfig()
    data: string[][] = []
    users: Users[] = []
    products: Product[] = []
    merchants: Merchants[] = []
    bids: Bids[] = []
    bidRates: BidRate[] = []

    /**
     *Insert drop down items inside merchants, products, customers, and bid rates array
     */
    dropDown_merchants: dropDownItems[] = []
    dropDown_customers: dropDownItems[] = []
    dropDown_products: dropDownItems[] = []
    dropDown_bidrates: dropDownItems[] = []

    addNewPro = true
    authorized = false
    editPro = false
    currentProRow: Bids
    bids_type = 'All'

    selectedProduct: Bids
    isDeletedView = false

    ///////////////////////
    model_merchants: dropDownItems[] = []
    model_customers: dropDownItems[] = []
    model_products: dropDownItems[] = []
    model_bidrates: dropDownItems[] = []
    bid_value = 0 //do calc
    bid_rev = 0 //do calc
    bid_swipe_action = ''
    status = ''

    /**
     * @returns an integer for calculating the bid value provided
     * 
     * the swipe action, number of swipes, and value of swipe per swipe
     */
    getBidValue(): Number {
        if (this.model_bidrates.length <= 0) {
            return;
        }
        const b_id = this.model_bidrates[0].id
        const curr_bid_rate = this.bidRates.filter((bid, index, arr) => {
            return bid.bid_rate_id == b_id
        })
        const swipe_no = curr_bid_rate[0].bid_rate_swipe_number
        const swipe_value = curr_bid_rate[0].bid_rate_swipe_value
        const swipe_action = (this.bid_swipe_action == 'like') ? 1 : 0
        const calc = swipe_action * swipe_value * swipe_no
        this.bid_value = calc
        return calc
    }

    swipe_action_data = [
        { value: 'like', viewValue: 'Like' },
        { value: 'dislike', viewValue: 'DisLike' },
    ]

    status_data = [
        { value: 'pending', viewValue: 'Pending' },
        { value: 'progress', viewValue: 'Progress' },
        { value: 'completed', viewValue: 'Completed' },
    ]

    isMerchantAccount = false
    business_owner = ''
    filter_type = 'all'
    display_main_row = false
    ///////////////////////

    clearField() {
        this.bid_value = 0
        this.bid_rev = 0
        this.bid_swipe_action = ''
        this.status = ''
        this.model_merchants = []
        this.model_customers = []
        this.model_products = []
        this.model_bidrates = []
    }

    ngOnDestroy() {

    }

    total_bids = 0
    pending_bids = 0
    progress_bids = 0
    completed_bids = 0

    /**
     * get the current user and determine if user is a merchant or admin staff.
     */
    getCurrentUser() {
        const email = localStorage.getItem('email')
        firebase.firestore().collection('db').doc('bidbuddy').collection('users').doc(email).get().then(u => {
            const user = <AdminUsers>u.data()
            if (user.role == 'Merchant') {
                this.isMerchantAccount = true
                this.business_owner = user.business_owner
            }
        })
    }

    ngOnInit() {
        this._Activatedroute.params.subscribe(p => {
            this.filter_type = p['filter']
        })
        this.getCurrentUser()
        this.getUsers()
        this.getMerchants()
        this.getProducts()
        this.getBidRates()
        if(this.filter_type == 'all' || this.filter_type == null){
            this.getBids()
        }else {
            this.getBidsByType(this.filter_type)
        }
    }

    /**
     * displays pie chart of all bids categorized by its status
     */
    pieChartSection() {
        /*  **************** Public Preferences - Pie Chart ******************** */

        const dataPreferences = {
            labels: [`${this.pending_bids}%`, `${this.progress_bids}%`, `${this.completed_bids}%`],
            series: [this.pending_bids, this.progress_bids, this.completed_bids]
        };

        const optionsPreferences = {
            height: '230px'
        };

        new Chartist.Pie('#chartPreferences', dataPreferences, optionsPreferences);
    }

    addPro() {
        this.addNewPro = true
        this.authorized = true
        //this.addNewCat2 = true
    }

    cancelAddPro() {
        this.addNewPro = false
        this.authorized = false
        //this.addNewCat2 = false
        this.editPro = false
        this.clearField()
    }

    /**
     * get all registered merchants
     */
    getMerchants() {
        firebase.firestore().collection('db').doc('bidbuddy').collection('merchants').get().then(query => {
            //this.data = []
            this.merchants = []
            query.forEach(async data => {
                const mer = <Merchants>data.data()
                this.merchants.push(mer)
                this.dropDown_merchants.push({ display: mer.business_name, value: mer.business_name, id: mer.id })
            })
        });
    }

    /**
     * get all products
     */
    getProducts() {
        firebase.firestore().collection('db').doc('bidbuddy').collection('products').get().then(query => {//where("deleted", "==", false).
            this.products = []
            query.forEach(async data => {
                const pro = <Product>data.data()
                this.products.push(pro)
                const mer = await this.getMerchantByProductID(pro.merchant_id)
                // console.log(mer.business_name)
                this.dropDown_products.push({ display: `${pro.name} - ${mer.business_name}`, value: `${pro.name}`, id: pro.id })
            })
        });
    }

    /**
     * get the owner (merchant) of the product by providing the product id.
     * @param {string} id the product id
     * @returns the merchant object that uploaded the product
     */
    async getMerchantByProductID(id: string) {
        const getC = await firebase.firestore().collection('db').doc('bidbuddy').collection('merchants').doc(id).get()
        return <Merchants>getC.data()
    }

    /**
     * get list of all customers
     */
    getUsers() {
        firebase.firestore().collection('customers').onSnapshot(query => {
            this.users = []
            query.forEach(data => {
                const user = <Users>data.data()
                this.users.push(user)
                this.dropDown_customers.push({ display: user.email, value: user.email, id: user.email })
            })
        });
    }

    /**
     * get list of all bid rates
     */
    getBidRates() {
        firebase.firestore().collection('db').doc('bidbuddy').collection('bidrate').get().then(query => {
            this.bidRates = []
            query.forEach(data => {
                const br = <BidRate>data.data()
                this.bidRates.push(br)
                this.dropDown_bidrates.push({ display: br.bid_rate_name, value: br.bid_rate_name, id: br.bid_rate_id })
            })
        });
    }

    /**
     * get all bids and displays accordingly to the merchant or admin
     */
    getBids() {
        if (this.isMerchantAccount) {
            firebase.firestore().collection('bids').where('merchant_id', '==', this.business_owner).onSnapshot(query => {
                this.data = []
                this.bids = []
                var index = 0
                query.forEach(async data => {
                    const bid = <Bids>data.data()
                    this.bids.push(bid)
                    //filter customer
                    const customer = this.users.filter((user, index, array) => {
                        return user.email == bid.customer_id
                    })
                    //filter product
                    const product = this.products.filter((pro, index, array) => {
                        return pro.id == bid.product_id
                    })
                    //filter merchant
                    const merchant = this.merchants.filter((mer, index, array) => {
                        return mer.id == bid.merchant_id
                    })
                    //filter bidrates
                    const bidrate = this.bidRates.filter((bidr, index, array) => {
                        return bidr.bid_rate_id == bid.bid_rate_id
                    })
                    var amount = '₦0'
                    if (customer[0].bid_tokens != null) {
                        amount = `₦${customer[0].bid_tokens['amount']}`
                    }
                    this.data.push([`${index}`, customer[0].fullName, customer[0].email, amount, product[0].name, product[0].deliver_type, `₦${product[0].price}`, merchant[0].business_name, `${bidrate[0].bid_rate_swipe_number}`, `₦${bidrate[0].bid_rate_swipe_value}`, `₦${bid.bid_value}`, `₦${bid.bid_revenue}`, bid.bid_swipe_action, bid.bid_status, bid.created_date, bid.modified_date])
                    index = index + 1
                })
                this.dataTable = {
                    headerRow: ['Customer Name', 'Customer Email', 'Customer Current Balance', 'Product Name', 'Product Type', 'Product Price', 'Merchant Name', 'No of Swipes', 'Swipe Value', 'Bid Value', 'Bid Revenue', 'Swipe Action', 'Status', 'Created Date', 'Modified Date', 'Action'],
                    footerRow: ['Customer Name', 'Customer Email', 'Customer Current Balance', 'Product Name', 'Product Type', 'Product Price', 'Merchant Name', 'No of Swipes', 'Swipe Value', 'Bid Value', 'Bid Revenue', 'Swipe Action', 'Status', 'Created Date', 'Modified Date', 'Action'],
                    dataRows: this.data
                };
                this.total_bids = this.bids.length
                const pending = this.bids.filter((b, index, array) => {
                    return b.bid_status == 'pending'
                })
                const progress = this.bids.filter((b, index, array) => {
                    return b.bid_status == 'progress'
                })
                const comp = this.bids.filter((b, index, array) => {
                    return b.bid_status == 'completed'
                })
                this.pending_bids = pending.length
                this.progress_bids = progress.length
                this.completed_bids = comp.length
                this.pieChartSection()
            })
            return
        }
        firebase.firestore().collection('bids').onSnapshot(query => {
            this.data = []
            this.bids = []
            var index = 0
            query.forEach(async data => {
                const bid = <Bids>data.data()
                this.bids.push(bid)
                //filter customer
                const customer = this.users.filter((user, index, array) => {
                    return user.email == bid.customer_id
                })
                //filter product
                const product = this.products.filter((pro, index, array) => {
                    return pro.id == bid.product_id
                })
                //filter merchant
                const merchant = this.merchants.filter((mer, index, array) => {
                    return mer.id == bid.merchant_id
                })
                //filter bidrates
                const bidrate = this.bidRates.filter((bidr, index, array) => {
                    return bidr.bid_rate_id == bid.bid_rate_id
                })
                var amount = '₦0'
                if (customer[0].bid_tokens != null) {
                    amount = `₦${customer[0].bid_tokens['amount']}`
                }
                this.data.push([`${index}`, customer[0].fullName, customer[0].email, amount, product[0].name, product[0].deliver_type, `₦${product[0].price}`, merchant[0].business_name, `${bidrate[0].bid_rate_swipe_number}`, `₦${bidrate[0].bid_rate_swipe_value}`, `₦${bid.bid_value}`, `₦${bid.bid_revenue}`, bid.bid_swipe_action, bid.bid_status, bid.created_date, bid.modified_date])
                index = index + 1
            })
            this.dataTable = {
                headerRow: ['Customer Name', 'Customer Email', 'Customer Current Balance', 'Product Name', 'Product Type', 'Product Price', 'Merchant Name', 'No of Swipes', 'Swipe Value', 'Bid Value', 'Bid Revenue', 'Swipe Action', 'Status', 'Created Date', 'Modified Date', 'Action'],
                footerRow: ['Customer Name', 'Customer Email', 'Customer Current Balance', 'Product Name', 'Product Type', 'Product Price', 'Merchant Name', 'No of Swipes', 'Swipe Value', 'Bid Value', 'Bid Revenue', 'Swipe Action', 'Status', 'Created Date', 'Modified Date', 'Action'],
                dataRows: this.data
            };
            this.total_bids = this.bids.length
            const pending = this.bids.filter((b, index, array) => {
                return b.bid_status == 'pending'
            })
            const progress = this.bids.filter((b, index, array) => {
                return b.bid_status == 'progress'
            })
            const comp = this.bids.filter((b, index, array) => {
                return b.bid_status == 'completed'
            })
            this.pending_bids = Number(((pending.length/this.total_bids)*100).toFixed(0))
            this.progress_bids = Number(((progress.length/this.total_bids)*100).toFixed(0))
            this.completed_bids = Number(((comp.length/this.total_bids)*100).toFixed(0))
            this.pieChartSection()
        })
    }

    /**
     * get all bids based on its status where the pie chart legend is clicked
     * @param {string} status the status of the bid must be provided
     */
    onPieChartLegendsClicked(status: string){
        this.addNewPro = false
        this.bids_type = status.toLocaleUpperCase()
        this.getBidsByType(status)
    }

    /**
     * get all bids based on its status
     */
    getBidsByType(status: string) {
        this.bids_type = status.toLocaleUpperCase()
        if (this.isMerchantAccount) {
            firebase.firestore().collection('bids').where('merchant_id', '==', this.business_owner).where('bid_status', '==', status).onSnapshot(query => {
                this.data = []
                this.bids = []
                var index = 0
                query.forEach(async data => {
                    const bid = <Bids>data.data()
                    this.bids.push(bid)
                    //filter customer
                    const customer = this.users.filter((user, index, array) => {
                        return user.email == bid.customer_id
                    })
                    //filter product
                    const product = this.products.filter((pro, index, array) => {
                        return pro.id == bid.product_id
                    })
                    //filter merchant
                    const merchant = this.merchants.filter((mer, index, array) => {
                        return mer.id == bid.merchant_id
                    })
                    //filter bidrates
                    const bidrate = this.bidRates.filter((bidr, index, array) => {
                        return bidr.bid_rate_id == bid.bid_rate_id
                    })
                    var amount = '₦0'
                    if (customer[0].bid_tokens != null) {
                        amount = `₦${customer[0].bid_tokens['amount']}`
                    }
                    this.data.push([`${index}`, customer[0].fullName, customer[0].email, amount, product[0].name, product[0].deliver_type, `₦${product[0].price}`, merchant[0].business_name, `${bidrate[0].bid_rate_swipe_number}`, `₦${bidrate[0].bid_rate_swipe_value}`, `₦${bid.bid_value}`, `₦${bid.bid_revenue}`, bid.bid_swipe_action, bid.bid_status, bid.created_date, bid.modified_date])
                    index = index + 1
                })
                this.dataTable = {
                    headerRow: ['Customer Name', 'Customer Email', 'Customer Current Balance', 'Product Name', 'Product Type', 'Product Price', 'Merchant Name', 'No of Swipes', 'Swipe Value', 'Bid Value', 'Bid Revenue', 'Swipe Action', 'Status', 'Created Date', 'Modified Date', 'Action'],
                    footerRow: ['Customer Name', 'Customer Email', 'Customer Current Balance', 'Product Name', 'Product Type', 'Product Price', 'Merchant Name', 'No of Swipes', 'Swipe Value', 'Bid Value', 'Bid Revenue', 'Swipe Action', 'Status', 'Created Date', 'Modified Date', 'Action'],
                    dataRows: this.data
                };
            })
            return
        }
        firebase.firestore().collection('bids').where('bid_status', '==', status).onSnapshot(query => {
            this.data = []
            this.bids = []
            var index = 0
            query.forEach(async data => {
                const bid = <Bids>data.data()
                this.bids.push(bid)
                //filter customer
                const customer = this.users.filter((user, index, array) => {
                    return user.email == bid.customer_id
                })
                //filter product
                const product = this.products.filter((pro, index, array) => {
                    return pro.id == bid.product_id
                })
                //filter merchant
                const merchant = this.merchants.filter((mer, index, array) => {
                    return mer.id == bid.merchant_id
                })
                //filter bidrates
                const bidrate = this.bidRates.filter((bidr, index, array) => {
                    return bidr.bid_rate_id == bid.bid_rate_id
                })
                var amount = '₦0'
                if (customer[0].bid_tokens != null) {
                    amount = `₦${customer[0].bid_tokens['amount']}`
                }
                this.data.push([`${index}`, customer[0].fullName, customer[0].email, amount, product[0].name, product[0].deliver_type, `₦${product[0].price}`, merchant[0].business_name, `${bidrate[0].bid_rate_swipe_number}`, `₦${bidrate[0].bid_rate_swipe_value}`, `₦${bid.bid_value}`, `₦${bid.bid_revenue}`, bid.bid_swipe_action, bid.bid_status, bid.created_date, bid.modified_date])
                index = index + 1
            })
            this.dataTable = {
                headerRow: ['Customer Name', 'Customer Email', 'Customer Current Balance', 'Product Name', 'Product Type', 'Product Price', 'Merchant Name', 'No of Swipes', 'Swipe Value', 'Bid Value', 'Bid Revenue', 'Swipe Action', 'Status', 'Created Date', 'Modified Date', 'Action'],
                footerRow: ['Customer Name', 'Customer Email', 'Customer Current Balance', 'Product Name', 'Product Type', 'Product Price', 'Merchant Name', 'No of Swipes', 'Swipe Value', 'Bid Value', 'Bid Revenue', 'Swipe Action', 'Status', 'Created Date', 'Modified Date', 'Action'],
                dataRows: this.data
            };
        })
    }

    /**
     * submit a new bid
     */
    bidSubmitClicked() {
        //filter customer
        const customer = this.users.filter((user, index, array) => {
            return user.email == this.model_customers[0].id
        })
        //filter product
        const product = this.products.filter((pro, index, array) => {
            return pro.id == this.model_products[0].id
        })
        //filter merchant
        const merchant = this.merchants.filter((mer, index, array) => {
            return mer.id == this.model_merchants[0].id
        })
        //filter bidrates
        const bidrate = this.bidRates.filter((bidr, index, array) => {
            return bidr.bid_rate_id == this.model_bidrates[0].id
        })
        if (
            this.bid_value == 0 ||
            this.bid_rev == 0 ||
            this.bid_swipe_action == '' ||
            this.status == '' ||
            this.model_merchants.length == 0 ||
            this.model_customers.length == 0 ||
            this.model_products.length == 0 ||
            this.model_bidrates.length == 0
        ) {//|| this.basket_items.length == 0
            this.config.displayMessage("All fields are required", false)
            return
        }
        this.previewProgressSpinner.open({ hasBackdrop: true }, ProgressSpinnerComponent);
        if (!this.editPro) {//new add
            const key = firebase.database().ref().push().key
            const current_email = localStorage.getItem('email')
            const current_name = localStorage.getItem('name')
            const bid: Bids = {
                id: key,
                customer_id: customer[0].email,
                merchant_id: merchant[0].id,
                product_id: product[0].id,
                bid_rate_id: bidrate[0].bid_rate_id,
                bid_value: this.bid_value,
                bid_revenue: this.bid_rev,
                bid_swipe_action: this.bid_swipe_action,
                bid_status: this.status,
                created_date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
                created_by: `${current_name}|${current_email}`,
                modified_date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
            }
            firebase.firestore().collection('bids').doc(key).set(bid).then(d => {
                var amount = 0
                if (customer[0].bid_tokens != null) {
                    amount = Number(`${customer[0].bid_tokens['amount']}`)
                }
                const cust_token = amount - this.bid_value
                const bid_token_for_customer = {
                    'amount': cust_token,
                }
                firebase.firestore().collection('customers').doc(customer[0].email).update({ 'bid_tokens': bid_token_for_customer }).then(d => {
                    this.config.logActivity(`${current_name}|${current_email} created this bid: ${product[0].name}/${merchant[0].business_name}/${bidrate[0].bid_rate_name}/${customer[0].fullName}`)
                    this.previewProgressSpinner.close()
                    this.config.displayMessage(`Bid created successfully.`, true);
                    this.addNewPro = false
                    this.editPro = false
                    this.clearField()
                })
            }).catch(err => {
                this.previewProgressSpinner.close()
                this.config.displayMessage(`${err}`, false);
            })
        } else {//update
            this.updateValues(customer[0].email, merchant[0].id, product[0].id, bidrate[0].bid_rate_id)
        }

    }

    /**
     * updating bid fields
     */
    updateValues(cus_id: string, mer_id: string, pro_id: string, br_id: string) {
        const updatedBid: Bids = {
            customer_id: cus_id,
            merchant_id: mer_id,
            product_id: pro_id,
            bid_rate_id: br_id,
            bid_value: this.bid_value,
            bid_revenue: this.bid_rev,
            bid_swipe_action: this.bid_swipe_action,
            bid_status: this.status,
            modified_date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
        }
        const current_email = localStorage.getItem('email')
        const current_name = localStorage.getItem('name')
        firebase.firestore().collection('bids').doc(this.currentProRow.id).update(updatedBid).then(d => {
            this.config.logActivity(`${current_name}|${current_email} updated this bid: ${this.currentProRow.id}`)
            this.previewProgressSpinner.close()
            this.config.displayMessage(`Bid updated successfully.`, true);
            this.addNewPro = false
            this.editPro = false
            this.clearField()
        }).catch(err => {
            this.previewProgressSpinner.close()
            this.config.displayMessage(`${err}`, false);
        })
    }

    /**
     * deletes a particular bid by providing the bid id
     * @param {any} _id bid id
     */
    deletePro(_id: any) {
        const index = Number(_id)
        const id = `${this.bids[index].id}`
        const name = `${this.bids[index].id}`
        swal({
            title: 'Delete Alert',
            text: 'Are you sure about deleting this bid?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            confirmButtonClass: "btn btn-success",
            cancelButtonClass: "btn btn-danger",
            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
                firebase.firestore().collection('bids').doc(id).delete().then(del => {
                    const current_email = localStorage.getItem('email')
                    const current_name = localStorage.getItem('name')
                    this.config.logActivity(`${current_name}|${current_email} deleted this bid: ${name}`)
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

    /**
     * display more details of a bid when the edit button is clicked
     * @param {any} _id id of the bid
     */
    editProClick(_id: any) {
        const index = Number(_id)
        this.editPro = true
        this.addNewPro = true
        this.currentProRow = this.bids[index]

        //filter customer
        const customer = this.dropDown_customers.filter((user, index, array) => {
            return user.id == this.currentProRow.customer_id
        })
        //filter product
        const product = this.dropDown_products.filter((pro, index, array) => {
            return pro.id == this.currentProRow.product_id
        })
        //filter merchant
        const merchant = this.dropDown_merchants.filter((mer, index, array) => {
            return mer.id == this.currentProRow.merchant_id
        })
        //filter bidrates
        const bidrate = this.dropDown_bidrates.filter((bidr, index, array) => {
            return bidr.id == this.currentProRow.bid_rate_id
        })

        this.bid_value = this.currentProRow.bid_value
        this.bid_rev = this.currentProRow.bid_revenue
        this.bid_swipe_action = this.currentProRow.bid_swipe_action
        this.status = this.currentProRow.bid_status
        this.model_merchants = merchant
        this.model_customers = customer
        this.model_products = product
        this.model_bidrates = bidrate
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

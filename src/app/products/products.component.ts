import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import * as firebase from "firebase";
import swal from 'sweetalert2';
import { AdminUsers } from "../models/admin.users";
import { AdminUsersService } from "../services/admin-users.service";
import { timer } from 'rxjs';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import { DateAdapter } from '@angular/material';
import { OverlayService } from '../overlay/overlay.module';
import { ProgressSpinnerComponent } from '../progress-spinner/progress-spinner.module';

import { Product, MerchantItem } from "src/app/models/product";
import { AppConfig } from "src/app/services/global.service";
import { MainCategory } from 'src/app/models/main.category';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ClipboardService } from 'ngx-clipboard'
import { Merchants } from '../models/merchant';

declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}

@Component({
    selector: 'app-products-cmp',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit, OnDestroy {

    constructor(private previewProgressSpinner: OverlayService, private http: HttpClient, private clip: ClipboardService) { }

    public dataTable: DataTable;
    config = new AppConfig()
    data: string[][] = []
    products: Product[] = []
    main_categories: MainCategory[] = []
    merchants: MerchantItem[] = []

    addNewPro = false
    editPro = false
    currentProRow: Product

    selectedProduct: Product
    isDeletedView = false

    imageURLs: string[] = []
    ///////////////////////
    product_image = './assets/img/image_placeholder.jpg'
    product_name = ''
    product_price = 0
    product_desc = ''
    product_type = ''
    product_cat = ''
    product_merchant: MerchantItem[] = []
    product_status = false
    product_start_date = ''
    product_end_date = ''
    product_coupon_code = ''
    product_coupon_value_type = ''
    product_coupon_value = 0
    product_dynamic_link = ''

    business_owner = ''
    current_user_role = ''
    isMerchantAccount = false

    true_false_data = [
        { value: 'false', viewValue: 'False' },
        { value: 'true', viewValue: 'True' },
    ]

    coupon_value_data = [
        { value: 'percent', viewValue: 'Percent' },
        { value: 'amount', viewValue: 'Amount' },
    ]

    product_type_data = [
        { value: 'free', viewValue: 'Free' },
        { value: 'split', viewValue: 'Split' },
        { value: 'sell', viewValue: 'Sell' },
    ]
    ///////////////////////

    clearField() {
        this.imageURLs = []
        this.product_image = './assets/img/image_placeholder.jpg'
        this.product_name = ''
        this.product_price = 0
        this.product_desc = ''
        this.product_type = ''
        this.product_cat = ''
        this.product_merchant = []
        this.product_status = false
        this.product_start_date = ''
        this.product_end_date = ''
        this.product_coupon_code = ''
        this.product_coupon_value_type = ''
        this.product_coupon_value = 0
        this.product_dynamic_link = ''
    }

    ngOnDestroy() {

    }

    getCurrentUser() {
        const email = localStorage.getItem('email')
        firebase.firestore().collection('db').doc('bidbuddy').collection('users').doc(email).get().then(u => {
            const user = <AdminUsers>u.data()
            if (user.role == 'Merchant') {
                this.isMerchantAccount = true
            }
            this.business_owner = user.business_owner
            this.current_user_role = user.role
        })
    }

    ngOnInit() {
        this.getCurrentUser()
        this.getMainCategories()
        this.getMerchants()
        this.getProducts()
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

    getProducts() {
        this.isDeletedView = false
        if (this.isMerchantAccount) {
            firebase.firestore().collection('db').doc('bidbuddy').collection('products').where("deleted", "==", false).where('merchant_id', '==', this.business_owner).onSnapshot(query => {
                this.data = []
                this.products = []
                var index = 0
                query.forEach(data => {
                    const pro = <Product>data.data()
                    this.products.push(pro)
                    const getCurrentMerchant = this.merchants.filter((value, index, array) => {
                        return value.id == pro.merchant_id
                    })
                    const getCurrentCategory = this.main_categories.filter((value, index, array) => {
                        return value.id == pro.category_id
                    })
                    this.data.push([`${index}`, pro.pictures[0], pro.name, `₦${pro.price}`, `${getCurrentMerchant[0].value}`, `${getCurrentCategory[0].name}`, pro.deliver_type, `${pro.status}`, pro.created_date, pro.modified_date, 'btn-link', pro.dynamic_link])
                    index = index + 1
                })
                this.dataTable = {
                    headerRow: ['Image', 'Name', 'Price', 'Merchant Name', 'Category', 'Type', 'Status', 'Created Date', 'Modified Date', 'Actions'],
                    footerRow: ['Image', 'Name', 'Price', 'Merchant Name', 'Category', 'Type', 'Status', 'Created Date', 'Modified Date', 'Actions'],
                    dataRows: this.data
                };
            });
            return
        }
        firebase.firestore().collection('db').doc('bidbuddy').collection('products').where("deleted", "==", false).onSnapshot(query => {
            this.data = []
            this.products = []
            var index = 0
            query.forEach(data => {
                const pro = <Product>data.data()
                this.products.push(pro)
                const getCurrentMerchant = this.merchants.filter((value, index, array) => {
                    return value.id == pro.merchant_id
                })
                const getCurrentCategory = this.main_categories.filter((value, index, array) => {
                    return value.id == pro.category_id
                })
                this.data.push([`${index}`, pro.pictures[0], pro.name, `₦${pro.price}`, `${getCurrentMerchant[0].value}`, `${getCurrentCategory[0].name}`, pro.deliver_type, `${pro.status}`, pro.created_date, pro.modified_date, 'btn-link', pro.dynamic_link])
                index = index + 1
            })
            this.dataTable = {
                headerRow: ['Image', 'Name', 'Price', 'Merchant Name', 'Category', 'Type', 'Status', 'Created Date', 'Modified Date', 'Actions'],
                footerRow: ['Image', 'Name', 'Price', 'Merchant Name', 'Category', 'Type', 'Status', 'Created Date', 'Modified Date', 'Actions'],
                dataRows: this.data
            };
        });
    }

    getDeletedProducts() {
        this.isDeletedView = true
        if (this.isMerchantAccount) {
            firebase.firestore().collection('db').doc('bidbuddy').collection('products').where("deleted", "==", true).where('merchant_id', '==', this.business_owner).onSnapshot(query => {
                this.data = []
                this.products = []
                var index = 0
                query.forEach(data => {
                    const pro = <Product>data.data()
                    this.products.push(pro)
                    const getCurrentMerchant = this.merchants.filter((value, index, array) => {
                        return value.id == pro.merchant_id
                    })
                    const getCurrentCategory = this.main_categories.filter((value, index, array) => {
                        return value.id == pro.category_id
                    })
                    this.data.push([`${index}`, pro.pictures[0], pro.name, `₦${pro.price}`, `${getCurrentMerchant[0].value}`, `${getCurrentCategory[0].name}`, `${pro.status}`, pro.created_date, pro.modified_date, 'btn-link', pro.dynamic_link])
                    index = index + 1
                })
                this.dataTable = {
                    headerRow: ['Image', 'Name', 'Price', 'Merchant Name', 'Category', 'Type', 'Status', 'Created Date', 'Modified Date', 'Actions'],
                    footerRow: ['Image', 'Name', 'Price', 'Merchant Name', 'Category', 'Type', 'Status', 'Created Date', 'Modified Date', 'Actions'],
                    dataRows: this.data
                };
            });
            return
        }
        firebase.firestore().collection('db').doc('bidbuddy').collection('products').where("deleted", "==", true).onSnapshot(query => {
            this.data = []
            this.products = []
            var index = 0
            query.forEach(data => {
                const pro = <Product>data.data()
                this.products.push(pro)
                const getCurrentMerchant = this.merchants.filter((value, index, array) => {
                    return value.id == pro.merchant_id
                })
                const getCurrentCategory = this.main_categories.filter((value, index, array) => {
                    return value.id == pro.category_id
                })
                this.data.push([`${index}`, pro.pictures[0], pro.name, `₦${pro.price}`, `${getCurrentMerchant[0].value}`, `${getCurrentCategory[0].name}`, `${pro.status}`, pro.created_date, pro.modified_date, 'btn-link', pro.dynamic_link])
                index = index + 1
            })
            this.dataTable = {
                headerRow: ['Image', 'Name', 'Price', 'Merchant Name', 'Category', 'Type', 'Status', 'Created Date', 'Modified Date', 'Actions'],
                footerRow: ['Image', 'Name', 'Price', 'Merchant Name', 'Category', 'Type', 'Status', 'Created Date', 'Modified Date', 'Actions'],
                dataRows: this.data
            };
        });
    }

    getMainCategories() {
        firebase.firestore().collection('db').doc('bidbuddy').collection('main-categories').get().then(query => {
            this.main_categories = []
            query.forEach(data => {
                const category = <MainCategory>data.data()
                this.main_categories.push(category)
            })
        });
    }

    getMerchants() {
        firebase.firestore().collection('db').doc('bidbuddy').collection('merchants').get().then(query => {
            this.merchants = []
            query.forEach(async data => {
                const mer = <Merchants>data.data()
                const item: MerchantItem = {
                    display: mer.business_name,
                    value: mer.business_name,
                    id: mer.id
                }
                this.merchants.push(item)
            })
        });
    }

    async getMainCategoryNameFromId(id: string) {
        const mainData: firebase.firestore.DocumentSnapshot = await firebase.firestore().collection('db').doc('bidbuddy').collection('main-categories').doc(id).get()
        return <MainCategory>mainData.data()
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async uploadImageToStorage(imageFile: File) {
        const key = firebase.database().ref().push().key
        const upload_task = firebase.storage().ref("product").child(`${key}.jpg`)
        await upload_task.put(imageFile)
        const url = await upload_task.getDownloadURL()
        this.imageURLs.push(`${url}`)
    }

    async productSubmitClicked() {
        const image = (<HTMLInputElement>document.getElementById("pro_images")).files
        if (
            this.product_name == '' ||
            this.product_price == 0 ||
            this.product_desc == '' ||
            this.product_type == '' ||
            this.product_cat == '' ||
            //this.product_merchant == [] ||
            this.product_start_date == '' ||
            this.product_end_date == '' ||
            this.product_coupon_code == '' ||
            this.product_coupon_value_type == '' ||
            this.product_coupon_value == 0
        ) {//|| this.basket_items.length == 0
            this.config.displayMessage("All fields marked with * are required", false)
            return
        }
        const start = new Date(this.product_start_date['seconds'] * 1000)
        const end = new Date(this.product_end_date['seconds'] * 1000)
        const diff = end.getTime() - start.getTime()
        const dateDiff = new Date(diff)
        const hourDiff = dateDiff.getHours()
        if(diff < 0){//|| hourDiff < 1
            this.config.displayMessage("Please let the difference of your start and end date be greater than 1hour", false)
            return
        }

        this.previewProgressSpinner.open({ hasBackdrop: true }, ProgressSpinnerComponent);
        if (!this.editPro) {//new add
            if (this.product_image == '' || image.length == 0) {
                this.config.displayMessage("Please upload an image for this product", false)
                return
            }
            const key = firebase.database().ref().push().key
            const current_email = localStorage.getItem('email')
            const current_name = localStorage.getItem('name')

            for (var i = 0; i < image.length; i++) {
                await this.uploadImageToStorage(image.item(i));
            }

            var mer_id = ''
            if (this.isMerchantAccount) {
                const getCurrentMerchant = this.merchants.filter((value, index, array) => {
                    return value.display == this.product_merchant[0].value
                })
                mer_id = getCurrentMerchant[0].id
            }
            const getCurrentCategory = this.main_categories.filter((value, index, array) => {
                return value.name == this.product_cat
            })
            const dynamic_link = await this.createDynamicLink(`https://bidbuddy.app/products/${key}`, this.imageURLs[0])
            const product: Product = {
                id: key,
                name: this.product_name,
                price: this.product_price,
                pictures: this.imageURLs,
                description: this.product_desc,
                deliver_type: this.product_type,
                category_id: getCurrentCategory[0].id,
                merchant_id: (this.isMerchantAccount) ? this.business_owner : mer_id,
                status: `${this.product_status}` == 'false' ? false : true,
                start_time: this.product_start_date,
                end_time: this.product_end_date,
                coupon_code: this.product_coupon_code,
                coupon_value_type: this.product_coupon_value_type,
                coupon_value: this.product_coupon_value,
                created_date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
                created_by: `${current_name}|${current_email}`,
                deleted: false,
                modified_date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
                dynamic_link: dynamic_link['shortLink'],
                rating: 0.0,
            }
            firebase.firestore().collection('db').doc('bidbuddy').collection('products').doc(key).set(product).then(d => {
                this.config.logActivity(`${current_name}|${current_email} created this product: ${this.product_name}`)
                this.previewProgressSpinner.close()
                this.config.displayMessage(`Product created successfully.`, true);
                this.addNewPro = false
                this.editPro = false
                this.clearField()
            }).catch(err => {
                this.previewProgressSpinner.close()
                this.config.displayMessage(`${err}`, false);
            })
        } else {//update
            //var image_url = this.basket_image
            // if (image.length > 0) {
            //     const key = firebase.database().ref().push().key
            //     const upload_task = firebase.storage().ref("product").child(`${key}.jpg`)
            //     upload_task.put(image.item(0)).then(task => {
            //         upload_task.getDownloadURL().then(url => {
            //             image_url = url
            //             this.updateValues(image_url)
            //         }).catch(err => {
            //             this.previewProgressSpinner.close()
            //             this.config.displayMessage(`${err}`, false);
            //         })
            //     }).catch(err => {
            //         this.previewProgressSpinner.close()
            //         this.config.displayMessage(`${err}`, false);
            //     })
            // } else {
            //     this.updateValues(image_url)
            // }
            this.updateValues(null)
        }

    }

    updateValues(image_urls: string[]) {
        var mer_id = ''
        if (this.isMerchantAccount) {
            const getCurrentMerchant = this.merchants.filter((value, index, array) => {
                return value.display == this.product_merchant[0].value
            })
            mer_id = getCurrentMerchant[0].id
        }
        const getCurrentCategory = this.main_categories.filter((value, index, array) => {
            return value.name == this.product_cat
        })
        const product: Product = {
            name: this.product_name,
            price: this.product_price,
            pictures: this.imageURLs,
            description: this.product_desc,
            deliver_type: this.product_type,
            category_id: getCurrentCategory[0].id,
            merchant_id: (this.isMerchantAccount) ? this.business_owner : mer_id,
            status: `${this.product_status}` == 'false' ? false : true,
            start_time: this.product_start_date,
            end_time: this.product_end_date,
            coupon_code: this.product_coupon_code,
            coupon_value_type: this.product_coupon_value_type,
            coupon_value: this.product_coupon_value,
            modified_date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
        }
        const current_email = localStorage.getItem('email')
        const current_name = localStorage.getItem('name')
        firebase.firestore().collection('db').doc('bidbuddy').collection('products').doc(this.currentProRow.id).update(product).then(d => {
            this.config.logActivity(`${current_name}|${current_email} updated this product: ${this.product_name}`)
            this.previewProgressSpinner.close()
            this.config.displayMessage(`Product updated successfully.`, true);
            this.addNewPro = false
            this.editPro = false
            this.clearField()
        }).catch(err => {
            this.previewProgressSpinner.close()
            this.config.displayMessage(`${err}`, false);
        })
    }

    restoreProClick(_id: any) {
        const id = `${this.products[_id].id}`
        const name = `${this.products[_id].name}`
        swal({
            title: 'Restore Alert',
            text: 'Are you sure about restoring this product?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, restore it!',
            cancelButtonText: 'No, keep it',
            confirmButtonClass: "btn btn-success",
            cancelButtonClass: "btn btn-danger",
            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
                firebase.firestore().collection('db').doc('bidbuddy').collection('products').doc(id).update({ 'deleted': false }).then(del => {
                    const current_email = localStorage.getItem('email')
                    const current_name = localStorage.getItem('name')
                    this.config.logActivity(`${current_name}|${current_email} restored this product: ${name}`)
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

    deletePro(_id: any) {
        const id = `${this.products[_id].id}`
        const name = `${this.products[_id].name}`
        swal({
            title: 'Delete Alert',
            text: 'Are you sure about deleting this product?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it',
            confirmButtonClass: "btn btn-success",
            cancelButtonClass: "btn btn-danger",
            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
                firebase.firestore().collection('db').doc('bidbuddy').collection('products').doc(id).update({ 'deleted': true }).then(del => {
                    const current_email = localStorage.getItem('email')
                    const current_name = localStorage.getItem('name')
                    this.config.logActivity(`${current_name}|${current_email} deleted this product: ${name}`)
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

    copyLink(_id: any) {
        const link = `${this.products[_id].dynamic_link}`
        this.clip.copyFromContent(link)
        this.config.displayMessage(`${link} copied to clipboard`, true)
        //this.toast.success('Link copied to clipboard')
        // ngxClipboard [cbContent]="row[8]" (cbOnSuccess)="isCopied = true"
    }

    editProClick(_id: any) {
        this.editPro = true
        this.addNewPro = true
        this.currentProRow = this.products[_id]

        const getCurrentMerchant = this.merchants.filter((value, index, array) => {
            return value.id == this.currentProRow.merchant_id
        })
        const getCurrentCategory = this.main_categories.filter((value, index, array) => {
            return value.id == this.currentProRow.category_id
        })
        //////fill in fields///////////////////
        // console.log(this.currentProRow.start_time['seconds'] * 1000)
        // const dt1 = new Date(this.currentProRow.start_time['seconds'] * 1000)
        // console.log(`${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()} : ${dt.getHours()}/${dt.getMinutes()}`)
        // console.log(this.currentProRow.start_time)
        this.imageURLs = this.currentProRow.pictures
        this.product_image = this.currentProRow.pictures[0]
        this.product_name = this.currentProRow.name
        this.product_price = this.currentProRow.price
        this.product_desc = this.currentProRow.description
        this.product_type = this.currentProRow.deliver_type
        this.product_cat = getCurrentCategory[0].name
        this.product_merchant = getCurrentMerchant
        this.product_status = this.currentProRow.status
        this.product_start_date = this.currentProRow.start_time
        this.product_end_date = this.currentProRow.end_time
        this.product_coupon_code = this.currentProRow.coupon_code
        this.product_coupon_value_type = this.currentProRow.coupon_value_type
        this.product_coupon_value = this.currentProRow.coupon_value
        this.product_dynamic_link = this.currentProRow.dynamic_link
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

    createDynamicLink(product_link: string, image_url: string) {
        const options = {
            "dynamicLinkInfo": {
                "domainUriPrefix": "bidbuddyapp.page.link",
                "link": product_link,
                "navigationInfo": {
                    "enableForcedRedirect": true,
                },
                "socialMetaTagInfo": {
                    "socialTitle": this.product_name,
                    "socialDescription": this.product_desc,
                    "socialImageLink": image_url
                }
            },
            "suffix": {
                "option": "SHORT"
            }
        }
        return this.http.post("https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyA-oWOPOWQ4IFw1UKg5nMcyzwn1SGPdLyg", options, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }).toPromise()
    }
}
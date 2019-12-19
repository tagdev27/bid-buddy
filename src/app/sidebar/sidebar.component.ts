import { Component, OnInit } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';
import { AdminUsersService } from "../services/admin-users.service";
import { AdminUsers } from "../models/admin.users";
import * as firebase from "firebase";
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import swal from 'sweetalert2';
import { StoreSettings } from '../models/store';
import { AppConfig } from '../services/global.service';

declare const $: any;

//Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    collapse?: string;
    children?: ChildrenItems[];
    access?: boolean;
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
}

//Menu Items
export const ROUTES: RouteInfo[] = [
    
    {
        path: '/dashboard',
        title: 'Dashboard',
        type: 'link',
        icontype: 'dashboard',
        access: false
    },

    //Bids
    {
        path: '/bids/all',
        title: 'Bids',
        type: 'link', //sub
        icontype: 'av_timer',
        access: false,
    },

    //Products
    {
        path: '/products',
        title: 'Products',
        type: 'link', //sub
        icontype: 'shopping_basket',
        access: false,
    },

    //Sales
    {
        path: '/sales',
        title: 'Sales',
        type: 'link',
        icontype: 'attach_money',
        collapse: 'sales',
        access: false,
    },
    
    //Customers
    {
        path: '/customers',
        title: 'Customers',
        type: 'link',
        icontype: 'accessibility',
        access: false,
    },

    //Merchants
    {
        path: '/merchants',
        title: 'Merchants',
        type: 'link',
        icontype: 'business_center',
        access: false,
    },


    //Payouts
    {
        path: '/payouts',
        title: 'Payouts',
        type: 'link',
        icontype: 'credit_card',
        access: false,
    },

    {
        path: '/reviews',
        title: 'Reviews',
        type: 'link',
        icontype: 'star',
        access: false,
    },

    {
        path: '/referrals',
        title: 'Referrals',
        type: 'link',
        icontype: 'group',
        access: false,
    },

    {
        path: '/company',
        title: 'Company Settings',
        type: 'sub',
        icontype: 'apps',
        collapse: 'company',
        children: [
            {path: 'bidrate', title: 'Bid Rate', ab:'BR'},
            {path: 'general', title: 'General Settings', ab:'GS'},
            {path: 'category', title: 'Product Category', ab:'PC'},
            {path: 'plans', title: 'Subscriptions', ab:'S'},
            {path: 'message-templates', title: 'Message Templates', ab:'MT'},
        ]
    },
    {
        path: '/logs',
        title: 'Logs',
        type: 'link',
        icontype: 'view_list',
        access: false,
    },
    
    /*{
        path: '/forms',
        title: 'Forms',
        type: 'sub',
        icontype: 'content_paste',
        collapse: 'forms',
        children: [
            {path: 'regular', title: 'Regular Forms', ab:'RF'},
            {path: 'extended', title: 'Extended Forms', ab:'EF'},
            {path: 'validation', title: 'Validation Forms', ab:'VF'},
            {path: 'wizard', title: 'Wizard', ab:'W'}
        ]
    },{
        path: '/tables',
        title: 'Tables',
        type: 'sub',
        icontype: 'grid_on',
        collapse: 'tables',
        children: [
            {path: 'regular', title: 'Regular Tables', ab:'RT'},
            {path: 'extended', title: 'Extended Tables', ab:'ET'},
            {path: 'datatables.net', title: 'Datatables.net', ab:'DT'}
        ]
    },{
        path: '/maps',
        title: 'Maps',
        type: 'sub',
        icontype: 'place',
        collapse: 'maps',
        children: [
            {path: 'google', title: 'Google Maps', ab:'GM'},
            {path: 'fullscreen', title: 'Full Screen Map', ab:'FSM'},
            {path: 'vector', title: 'Vector Map', ab:'VM'}
        ]
    },{
        path: '/widgets',
        title: 'Widgets',
        type: 'link',
        icontype: 'widgets'

    },{
        path: '/charts',
        title: 'Charts',
        type: 'link',
        icontype: 'timeline'

    },{
        path: '/calendar',
        title: 'Calendar',
        type: 'link',
        icontype: 'date_range'
    },{
        path: '/pages',
        title: 'Pages',
        type: 'sub',
        icontype: 'image',
        collapse: 'pages',
        children: [
            {path: 'pricing', title: 'Pricing', ab:'P'},
            {path: 'timeline', title: 'Timeline Page', ab:'TP'},
            {path: 'login', title: 'Login Page', ab:'LP'},
            {path: 'register', title: 'Register Page', ab:'RP'},
            {path: 'lock', title: 'Lock Screen Page', ab:'LSP'},
            {path: 'user', title: 'User Page', ab:'UP'}
        ]
    }*/
];
@Component({
    selector: 'app-sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {

    user: AdminUsers
    name: string = 'Ugochi@bidbuddy';
    image: string = './assets/img/faces/avatar.jpg';
    role: string = 'user';
    position = ''
    access_level = '';
    service = new AdminUsersService();

    stock_alerts:string[] = []
    settings: StoreSettings
    config = new AppConfig()
    notification_size = 0

    constructor(private router: Router) {
        this.getProfile();
    }

    getProfile() {
        const email = localStorage.getItem('email');
        this.service.getUserData(email).then(async p => {
            if (p == null) {
                this.service.getUserData(email).then(async q => {
                    this.name = q.name;
                    this.image = q.image;
                    this.role = q.role;
                    this.position = q.position
                    if (q.role == 'Administrator') {
                        this.access_level = q.access_levels;
                    } else {
                        const getRole = await this.getAccessLevelsUsingRoles(q.role)
                        const vars = getRole.docs[0].data()
                        this.access_level = vars['access_levels']
                    }
                    this.displayNav();
                })
            } else {
                this.name = p.name;
                this.image = p.image;
                this.role = p.role;
                this.position = p.position
                if (p.role == 'Administrator') {
                    this.access_level = p.access_levels;
                } else {
                    const getRole = await this.getAccessLevelsUsingRoles(p.role)
                    const vars = getRole.docs[0].data()
                    this.access_level = vars['access_levels']
                }
                this.displayNav();
            }
        })
    }

    async getAccessLevelsUsingRoles(role: string) {
        return await firebase.firestore().collection('db').doc('bidbuddy').collection('roles').where('name', '==', role).get()
    }

    logout() {
        swal({
            title: 'Logout Alert',
            text: 'Are you sure about logging out?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, log me out!',
            cancelButtonText: 'No, keep me',
            confirmButtonClass: "btn btn-success",
            cancelButtonClass: "btn btn-danger",
            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
                firebase.auth().signOut();
                localStorage.clear();
                this.router.navigate(['/pages/login'])
            } else {
                swal({
                    title: 'Cancelled',
                    text: 'Logout not successful',
                    type: 'error',
                    confirmButtonClass: "btn btn-info",
                    buttonsStyling: false
                }).catch(swal.noop)
            }
        })
    }

    displayNav() {
        this.menuItems = []
        ROUTES.forEach(menuItem => {
            if (menuItem.title == 'Dashboard') {
                menuItem.access = true
                this.menuItems.push(menuItem);
            } else {
                if (this.role == 'Administrator') {
                    menuItem.access = true;
                    this.menuItems.push(menuItem);
                } else {
                    //console.log(`Access to ${menuItem.title} is ${this.service.isAllowedAccess(this.access_level, menuItem.title)}`)
                    menuItem.access = this.service.isAllowedAccess(this.access_level, menuItem.title);
                    this.menuItems.push(menuItem);
                }
            }
        })
    }

    public menuItems: any[];
    ps: any;
    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
            this.ps = new PerfectScrollbar(elemSidebar);
        }
    }
    updatePS(): void  {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            this.ps.update();
        }
    }
    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }
    gotoLink(menu_path, child_path) {
        if (this.role == 'Administrator') {
            this.router.navigate([`${menu_path}/${child_path}`])
        } else {
            location.href = `${menu_path}/${child_path}`
        }
    }
}

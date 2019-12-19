import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { RouteGuard, LoginRouteGuard } from './route.guard';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }, {
    path: '',
    component: AdminLayoutComponent,
    children: [

      //DashBoard
      {
        path: '',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      },

      //Bids
      {
        path: 'bids/:filter',
        loadChildren: './bids/bids.module#BidsModule',
        canActivate: [RouteGuard],
      },
      {
        path: 'settings',
        canActivate: [RouteGuard],
        loadChildren: './settings/setttings.module#SettingsModule'
      },
      {
        path: 'merchants',
        canActivate: [RouteGuard],
        loadChildren: './merchants/merchants.module#MerchantsModule'
      },
      {
        path: 'products',
        canActivate: [RouteGuard],
        loadChildren: './products/products.module#ProductsModule'
      },
      {
        path: 'reviews',
        canActivate: [RouteGuard],
        loadChildren: './reviews/reviews.module#ReviewsModule'
      },
      {
        path: 'logs',
        canActivate: [RouteGuard],
        loadChildren: './logs/logs.module#LogsModule'
      },
      {
        path: 'payment',
        canActivate: [RouteGuard],
        loadChildren: './payment/payment.module#PaymentModule'
      },
      {
        path: 'referrals',
        canActivate: [RouteGuard],
        loadChildren: './referrals/referrals.module#ReferralsModule'
      },
      {
        path: 'sales',
        canActivate: [RouteGuard],
        loadChildren: './sales/sales.module#SalesModule'
      },
      {
        path: 'company',
        canActivate: [RouteGuard],
        loadChildren: './store/store.module#StoreModule'
      },
      {
        path: '',
        loadChildren: './userpage/user.module#UserModule'
      },
      {
        path: '',
        loadChildren: './customers/customers.module#CustomersModule'
      }
    ]
  }, {
    path: '',
    canActivate: [LoginRouteGuard],
    component: AuthLayoutComponent,
    children: [{
      path: 'pages',
      loadChildren: './pages/pages.module#PagesModule'
    }]
  }
];

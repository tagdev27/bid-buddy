'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">Bid-Buddy Documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="changelog.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CHANGELOG
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-10c1711fb835687f60df8d72e3b987ee"' : 'data-target="#xs-components-links-module-AppModule-10c1711fb835687f60df8d72e3b987ee"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-10c1711fb835687f60df8d72e3b987ee"' :
                                            'id="xs-components-links-module-AppModule-10c1711fb835687f60df8d72e3b987ee"' }>
                                            <li class="link">
                                                <a href="components/AdminLayoutComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdminLayoutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AuthLayoutComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AuthLayoutComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppOverlayModule.html" data-type="entity-link">AppOverlayModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppOverlayModule-e1cabc58ff47578528aa40cc61d2377c"' : 'data-target="#xs-injectables-links-module-AppOverlayModule-e1cabc58ff47578528aa40cc61d2377c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppOverlayModule-e1cabc58ff47578528aa40cc61d2377c"' :
                                        'id="xs-injectables-links-module-AppOverlayModule-e1cabc58ff47578528aa40cc61d2377c"' }>
                                        <li class="link">
                                            <a href="injectables/OverlayService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>OverlayService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/BidsModule.html" data-type="entity-link">BidsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-BidsModule-31c6ee563ae76530afba11e166ed3237"' : 'data-target="#xs-components-links-module-BidsModule-31c6ee563ae76530afba11e166ed3237"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-BidsModule-31c6ee563ae76530afba11e166ed3237"' :
                                            'id="xs-components-links-module-BidsModule-31c6ee563ae76530afba11e166ed3237"' }>
                                            <li class="link">
                                                <a href="components/BidsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BidsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/CustomersModule.html" data-type="entity-link">CustomersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-CustomersModule-f366ca9de1431f8292fc74e4eb835591"' : 'data-target="#xs-components-links-module-CustomersModule-f366ca9de1431f8292fc74e4eb835591"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CustomersModule-f366ca9de1431f8292fc74e4eb835591"' :
                                            'id="xs-components-links-module-CustomersModule-f366ca9de1431f8292fc74e4eb835591"' }>
                                            <li class="link">
                                                <a href="components/CustomersComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CustomersComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/DashboardModule.html" data-type="entity-link">DashboardModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-DashboardModule-1ca9945a7919f9ac36414b6979da1bb3"' : 'data-target="#xs-components-links-module-DashboardModule-1ca9945a7919f9ac36414b6979da1bb3"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-DashboardModule-1ca9945a7919f9ac36414b6979da1bb3"' :
                                            'id="xs-components-links-module-DashboardModule-1ca9945a7919f9ac36414b6979da1bb3"' }>
                                            <li class="link">
                                                <a href="components/DashboardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashboardComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/FixedpluginModule.html" data-type="entity-link">FixedpluginModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-FixedpluginModule-25ec740ce18b0d48d79fc86c1d82efd6"' : 'data-target="#xs-components-links-module-FixedpluginModule-25ec740ce18b0d48d79fc86c1d82efd6"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-FixedpluginModule-25ec740ce18b0d48d79fc86c1d82efd6"' :
                                            'id="xs-components-links-module-FixedpluginModule-25ec740ce18b0d48d79fc86c1d82efd6"' }>
                                            <li class="link">
                                                <a href="components/FixedpluginComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FixedpluginComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/FooterModule.html" data-type="entity-link">FooterModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-FooterModule-ea0be9123ed2cbf19e519baa2b4d3326"' : 'data-target="#xs-components-links-module-FooterModule-ea0be9123ed2cbf19e519baa2b4d3326"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-FooterModule-ea0be9123ed2cbf19e519baa2b4d3326"' :
                                            'id="xs-components-links-module-FooterModule-ea0be9123ed2cbf19e519baa2b4d3326"' }>
                                            <li class="link">
                                                <a href="components/FooterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FooterComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/Forms.html" data-type="entity-link">Forms</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-Forms-00543cf3460b3a214d8d0ad91c6a69b5"' : 'data-target="#xs-components-links-module-Forms-00543cf3460b3a214d8d0ad91c6a69b5"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-Forms-00543cf3460b3a214d8d0ad91c6a69b5"' :
                                            'id="xs-components-links-module-Forms-00543cf3460b3a214d8d0ad91c6a69b5"' }>
                                            <li class="link">
                                                <a href="components/ExtendedFormsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExtendedFormsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FieldErrorDisplayComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FieldErrorDisplayComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegularFormsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RegularFormsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ValidationFormsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ValidationFormsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WizardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">WizardComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LogsModule.html" data-type="entity-link">LogsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-LogsModule-737c37d917c773e91ab73c986ff72c7b"' : 'data-target="#xs-components-links-module-LogsModule-737c37d917c773e91ab73c986ff72c7b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LogsModule-737c37d917c773e91ab73c986ff72c7b"' :
                                            'id="xs-components-links-module-LogsModule-737c37d917c773e91ab73c986ff72c7b"' }>
                                            <li class="link">
                                                <a href="components/LogsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LogsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MaterialModule.html" data-type="entity-link">MaterialModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MerchantsModule.html" data-type="entity-link">MerchantsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-MerchantsModule-095ac6c0d3c21233725ce27d2097e8fb"' : 'data-target="#xs-components-links-module-MerchantsModule-095ac6c0d3c21233725ce27d2097e8fb"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MerchantsModule-095ac6c0d3c21233725ce27d2097e8fb"' :
                                            'id="xs-components-links-module-MerchantsModule-095ac6c0d3c21233725ce27d2097e8fb"' }>
                                            <li class="link">
                                                <a href="components/MerchantsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MerchantsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/NavbarModule.html" data-type="entity-link">NavbarModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-NavbarModule-a3e76fdba597f1f3ff04b3a36bc455dc"' : 'data-target="#xs-components-links-module-NavbarModule-a3e76fdba597f1f3ff04b3a36bc455dc"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-NavbarModule-a3e76fdba597f1f3ff04b3a36bc455dc"' :
                                            'id="xs-components-links-module-NavbarModule-a3e76fdba597f1f3ff04b3a36bc455dc"' }>
                                            <li class="link">
                                                <a href="components/NavbarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NavbarComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/PagesModule.html" data-type="entity-link">PagesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-PagesModule-b61943944f4d7d7692dde8301d75e9d7"' : 'data-target="#xs-components-links-module-PagesModule-b61943944f4d7d7692dde8301d75e9d7"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-PagesModule-b61943944f4d7d7692dde8301d75e9d7"' :
                                            'id="xs-components-links-module-PagesModule-b61943944f4d7d7692dde8301d75e9d7"' }>
                                            <li class="link">
                                                <a href="components/LockComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LockComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PricingComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PricingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RegisterComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/PaymentModule.html" data-type="entity-link">PaymentModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-PaymentModule-0806fae73785911e4a9e2d2b3b7cb131"' : 'data-target="#xs-components-links-module-PaymentModule-0806fae73785911e4a9e2d2b3b7cb131"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-PaymentModule-0806fae73785911e4a9e2d2b3b7cb131"' :
                                            'id="xs-components-links-module-PaymentModule-0806fae73785911e4a9e2d2b3b7cb131"' }>
                                            <li class="link">
                                                <a href="components/PaymentComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PaymentComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProductsModule.html" data-type="entity-link">ProductsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ProductsModule-b2810bee315d534eb81eb0ff11193b37"' : 'data-target="#xs-components-links-module-ProductsModule-b2810bee315d534eb81eb0ff11193b37"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ProductsModule-b2810bee315d534eb81eb0ff11193b37"' :
                                            'id="xs-components-links-module-ProductsModule-b2810bee315d534eb81eb0ff11193b37"' }>
                                            <li class="link">
                                                <a href="components/ProductsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProductsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProgressSpinnerModule.html" data-type="entity-link">ProgressSpinnerModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ProgressSpinnerModule-5d9c73f17a98162ac4f70037229ed5e7"' : 'data-target="#xs-components-links-module-ProgressSpinnerModule-5d9c73f17a98162ac4f70037229ed5e7"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ProgressSpinnerModule-5d9c73f17a98162ac4f70037229ed5e7"' :
                                            'id="xs-components-links-module-ProgressSpinnerModule-5d9c73f17a98162ac4f70037229ed5e7"' }>
                                            <li class="link">
                                                <a href="components/ProgressSpinnerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProgressSpinnerComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ReferralsModule.html" data-type="entity-link">ReferralsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ReferralsModule-43936085019220441498fb78080692f5"' : 'data-target="#xs-components-links-module-ReferralsModule-43936085019220441498fb78080692f5"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ReferralsModule-43936085019220441498fb78080692f5"' :
                                            'id="xs-components-links-module-ReferralsModule-43936085019220441498fb78080692f5"' }>
                                            <li class="link">
                                                <a href="components/ReferralsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ReferralsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ReviewsModule.html" data-type="entity-link">ReviewsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ReviewsModule-0876cd803770910224d4a5a31cc73482"' : 'data-target="#xs-components-links-module-ReviewsModule-0876cd803770910224d4a5a31cc73482"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ReviewsModule-0876cd803770910224d4a5a31cc73482"' :
                                            'id="xs-components-links-module-ReviewsModule-0876cd803770910224d4a5a31cc73482"' }>
                                            <li class="link">
                                                <a href="components/ReviewsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ReviewsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SalesModule.html" data-type="entity-link">SalesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SalesModule-760a150bec39ff43ee08f7f63ab6c636"' : 'data-target="#xs-components-links-module-SalesModule-760a150bec39ff43ee08f7f63ab6c636"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SalesModule-760a150bec39ff43ee08f7f63ab6c636"' :
                                            'id="xs-components-links-module-SalesModule-760a150bec39ff43ee08f7f63ab6c636"' }>
                                            <li class="link">
                                                <a href="components/SalesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SalesComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SettingsModule.html" data-type="entity-link">SettingsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SettingsModule-2f2812f0f8219bfe207d545eb8dccb95"' : 'data-target="#xs-components-links-module-SettingsModule-2f2812f0f8219bfe207d545eb8dccb95"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SettingsModule-2f2812f0f8219bfe207d545eb8dccb95"' :
                                            'id="xs-components-links-module-SettingsModule-2f2812f0f8219bfe207d545eb8dccb95"' }>
                                            <li class="link">
                                                <a href="components/SettingsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SettingsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SidebarModule.html" data-type="entity-link">SidebarModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SidebarModule-976585e3ac5721a21e75e8ce43bdf2d3"' : 'data-target="#xs-components-links-module-SidebarModule-976585e3ac5721a21e75e8ce43bdf2d3"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SidebarModule-976585e3ac5721a21e75e8ce43bdf2d3"' :
                                            'id="xs-components-links-module-SidebarModule-976585e3ac5721a21e75e8ce43bdf2d3"' }>
                                            <li class="link">
                                                <a href="components/SidebarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SidebarComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StoreModule.html" data-type="entity-link">StoreModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StoreModule-b2a03830a0ab17f1ee71045f865521cc"' : 'data-target="#xs-components-links-module-StoreModule-b2a03830a0ab17f1ee71045f865521cc"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StoreModule-b2a03830a0ab17f1ee71045f865521cc"' :
                                            'id="xs-components-links-module-StoreModule-b2a03830a0ab17f1ee71045f865521cc"' }>
                                            <li class="link">
                                                <a href="components/BidRateComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BidRateComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CategoryComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CategoryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GeneralComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GeneralComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MessageTemplatesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MessageTemplatesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PlansComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PlansComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link">UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-UserModule-c303f8f2c297e99761ab73fce5e98de2"' : 'data-target="#xs-components-links-module-UserModule-c303f8f2c297e99761ab73fce5e98de2"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-UserModule-c303f8f2c297e99761ab73fce5e98de2"' :
                                            'id="xs-components-links-module-UserModule-c303f8f2c297e99761ab73fce5e98de2"' }>
                                            <li class="link">
                                                <a href="components/UserComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AdminUsersService.html" data-type="entity-link">AdminUsersService</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppConfig.html" data-type="entity-link">AppConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/EmailBody.html" data-type="entity-link">EmailBody</a>
                            </li>
                            <li class="link">
                                <a href="classes/MailChirmp.html" data-type="entity-link">MailChirmp</a>
                            </li>
                            <li class="link">
                                <a href="classes/MyErrorStateMatcher.html" data-type="entity-link">MyErrorStateMatcher</a>
                            </li>
                            <li class="link">
                                <a href="classes/MyErrorStateMatcher-1.html" data-type="entity-link">MyErrorStateMatcher</a>
                            </li>
                            <li class="link">
                                <a href="classes/PasswordValidation.html" data-type="entity-link">PasswordValidation</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/LoginRouteGuard.html" data-type="entity-link">LoginRouteGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/RouteGuard.html" data-type="entity-link">RouteGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AdminUsers.html" data-type="entity-link">AdminUsers</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AppOverlayConfig.html" data-type="entity-link">AppOverlayConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Banners.html" data-type="entity-link">Banners</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BidRate.html" data-type="entity-link">BidRate</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Bids.html" data-type="entity-link">Bids</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CartItem.html" data-type="entity-link">CartItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CartItem-1.html" data-type="entity-link">CartItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChildrenItems.html" data-type="entity-link">ChildrenItems</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Currency.html" data-type="entity-link">Currency</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataTable.html" data-type="entity-link">DataTable</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataTable-1.html" data-type="entity-link">DataTable</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataTable-2.html" data-type="entity-link">DataTable</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataTable-3.html" data-type="entity-link">DataTable</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataTable-4.html" data-type="entity-link">DataTable</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataTable-5.html" data-type="entity-link">DataTable</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataTable-6.html" data-type="entity-link">DataTable</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataTable-7.html" data-type="entity-link">DataTable</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataTable-8.html" data-type="entity-link">DataTable</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataTable-9.html" data-type="entity-link">DataTable</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/dropDownItems.html" data-type="entity-link">dropDownItems</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Features.html" data-type="entity-link">Features</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FileReaderEvent.html" data-type="entity-link">FileReaderEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FileReaderEventTarget.html" data-type="entity-link">FileReaderEventTarget</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Items.html" data-type="entity-link">Items</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MainCategory.html" data-type="entity-link">MainCategory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MerchantItem.html" data-type="entity-link">MerchantItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Merchants.html" data-type="entity-link">Merchants</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Messages.html" data-type="entity-link">Messages</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Product.html" data-type="entity-link">Product</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Reviews.html" data-type="entity-link">Reviews</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RoleUsers.html" data-type="entity-link">RoleUsers</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RouteInfo.html" data-type="entity-link">RouteInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Sales.html" data-type="entity-link">Sales</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StoreSettings.html" data-type="entity-link">StoreSettings</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Styles.html" data-type="entity-link">Styles</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SubCategory.html" data-type="entity-link">SubCategory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Subscriptions.html" data-type="entity-link">Subscriptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TableData.html" data-type="entity-link">TableData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TableData-1.html" data-type="entity-link">TableData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TableData-2.html" data-type="entity-link">TableData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TableData-3.html" data-type="entity-link">TableData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TacOrder.html" data-type="entity-link">TacOrder</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Tracking.html" data-type="entity-link">Tracking</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Users.html" data-type="entity-link">Users</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="divider"></li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});
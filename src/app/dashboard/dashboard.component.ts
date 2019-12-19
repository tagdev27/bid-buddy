import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { TableData } from '../md/md-table/md-table.component';
import { LegendItem, ChartType } from '../md/md-chart/md-chart.component';
import * as firebase from 'firebase'

import * as Chartist from 'chartist';
import { AdminUsers } from '../models/admin.users';
import { Bids } from '../models/bids';
import { Merchants } from '../models/merchant';

declare const $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  ngOnDestroy(): void {
  }
  // constructor(private navbarTitleService: NavbarTitleService, private notificationService: NotificationService) { }
  public tableData: TableData;

  business_owner = ''
  isMerchantAccount = false

  startAnimationForLineChart(chart: any) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;
    chart.on('draw', function (data: any) {

      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq = 0;
  }
  startAnimationForBarChart(chart: any) {
    let seq2: any, delays2: any, durations2: any;
    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on('draw', function (data: any) {
      if (data.type === 'bar') {
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq2 = 0;
  }
  // constructor(private navbarTitleService: NavbarTitleService) { }
  public ngOnInit() {
    this.tableData = {
      headerRow: ['ID', 'Merchant', 'Bids', 'Location', 'City'],
      dataRows: [
        ['GB', 'Lagos', '690', '7.87%'],
        ['RO', 'Abuja', '600', '5.94%'],
        ['BR', 'Anambra', '550', '4.34%']
      ]
    };
    /* ----------==========     Daily Sales Chart initialization    ==========---------- */

    const dataDailySalesChart = {
      labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      series: [
        [12, 17, 7, 17, 23, 18, 38]
      ]
    };

    const optionsDailySalesChart = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
    };

    const dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

    this.startAnimationForLineChart(dailySalesChart);
    /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

    const dataCompletedTasksChart = {
      labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
      series: [
        [230, 750, 450, 300, 280, 240, 200, 190]
      ]
    };

    const optionsCompletedTasksChart = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better
      // look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 }
    };

    const completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart,
      optionsCompletedTasksChart);

    this.startAnimationForLineChart(completedTasksChart);

    /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

    const dataWebsiteViewsChart = {
      labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      series: [
        [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

      ]
    };
    const optionsWebsiteViewsChart = {
      axisX: {
        showGrid: false
      },
      low: 0,
      high: 1000,
      chartPadding: { top: 0, right: 5, bottom: 0, left: 0 }
    };
    const responsiveOptions: any = [
      ['screen and (max-width: 640px)', {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function (value) {
            return value[0];
          }
        }
      }]
    ];
    const websiteViewsChart = new Chartist.Bar('#websiteViewsChart', dataWebsiteViewsChart, optionsWebsiteViewsChart, responsiveOptions);

    this.startAnimationForBarChart(websiteViewsChart);

    $('#worldMap').vectorMap({
      map: 'world_en',
      backgroundColor: 'transparent',
      borderColor: '#818181',
      borderOpacity: 0.25,
      borderWidth: 1,
      color: '#b3b3b3',
      enableZoom: true,
      hoverColor: '#eee',
      hoverOpacity: null,
      normalizeFunction: 'linear',
      scaleColors: ['#b6d6ff', '#005ace'],
      selectedColor: '#c9dfaf',
      selectedRegions: null,
      showTooltip: true,
      onRegionClick: function (element, code, region) {
        var message = 'You clicked "'
          + region
          + '" which has the code: '
          + code.toUpperCase();

        alert(message);
      }
    });
  }
  ngAfterViewInit() {
    const breakCards = true;
    if (breakCards === true) {
      // We break the cards headers if there is too much stress on them :-)
      $('[data-header-animation="true"]').each(function () {
        const $fix_button = $(this);
        const $card = $(this).parent('.card');
        $card.find('.fix-broken-card').click(function () {
          const $header = $(this).parent().parent().siblings('.card-header, .card-image');
          $header.removeClass('hinge').addClass('fadeInDown');

          $card.attr('data-count', 0);

          setTimeout(function () {
            $header.removeClass('fadeInDown animate');
          }, 480);
        });

        $card.mouseenter(function () {
          const $this = $(this);
          const hover_count = parseInt($this.attr('data-count'), 10) + 1 || 0;
          $this.attr('data-count', hover_count);
          if (hover_count >= 20) {
            $(this).children('.card-header, .card-image').addClass('hinge animated');
          }
        });
      });
    }
    this.getCurrentUser()
    this.getBids()
    this.getMerchants()
    this.getOthers()
  }

  bids: Bids[] = []
  total_bids = 0
  pending_bids = 0
  progress_bids = 0
  completed_bids = 0
  total_likes = 0
  total_dislikes = 0

  merchants:Merchants[] = []
  total_merchants = 0
  active_merchants = 0
  inactive_merchants = 0

  total_customers = 0
  total_products = 0
  total_sub = 0
  total_bidrates = 0

  getCurrentUser() {
    const email = localStorage.getItem('email')
    firebase.firestore().collection('db').doc('bidbuddy').collection('users').doc(email).get().then(u => {
      const user = <AdminUsers>u.data()
      if (user.role == 'Merchant') {
        this.isMerchantAccount = true
      }
      this.business_owner = user.business_owner
    })
  }

  getBids() {
    if (this.isMerchantAccount) {
      firebase.firestore().collection('bids').where('merchant_id', '==', this.business_owner).onSnapshot(query => {
        this.bids = []
        this.total_bids = 0
        this.pending_bids = 0
        this.progress_bids = 0
        this.completed_bids = 0
        this.total_likes = 0
        this.total_dislikes = 0
        query.forEach(async data => {
          const bid = <Bids>data.data()
          this.bids.push(bid)
        })
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
        const action_like = this.bids.filter((b, index, array) => {
          return b.bid_swipe_action == 'like'
        })
        const action_dislike = this.bids.filter((b, index, array) => {
          return b.bid_swipe_action == 'dislike'
        })
        this.pending_bids = pending.length
        this.progress_bids = progress.length
        this.completed_bids = comp.length
        this.total_likes = action_like.length
        this.total_dislikes = action_dislike.length
      })
      return
    }
    firebase.firestore().collection('bids').onSnapshot(query => {
      this.bids = []
      this.total_bids = 0
      this.pending_bids = 0
      this.progress_bids = 0
      this.completed_bids = 0
      this.total_likes = 0
      this.total_dislikes = 0
      query.forEach(async data => {
        const bid = <Bids>data.data()
        this.bids.push(bid)
      })
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
      const action_like = this.bids.filter((b, index, array) => {
        return b.bid_swipe_action == 'like'
      })
      const action_dislike = this.bids.filter((b, index, array) => {
        return b.bid_swipe_action == 'dislike'
      })
      this.pending_bids = pending.length
      this.progress_bids = progress.length
      this.completed_bids = comp.length
      this.total_likes = action_like.length
      this.total_dislikes = action_dislike.length
    })
  }

  getMerchants(){
    firebase.firestore().collection('db').doc('bidbuddy').collection('merchants').onSnapshot(query => {
      this.merchants = []
      this.total_merchants = 0
      this.active_merchants = 0
      this.inactive_merchants = 0
      query.forEach(async data => {
        const mer = <Merchants>data.data()
        this.merchants.push(mer)
      })
      this.total_merchants = this.merchants.length
      const activeM = this.merchants.filter((b, index, array) => {
        return b.status == 'active'
      })
      const inAM = this.merchants.filter((b, index, array) => {
        return b.status == 'in-active'
      })
      this.active_merchants = activeM.length
      this.inactive_merchants = inAM.length
    })
  }

  getOthers() {
    //for customers
    firebase.firestore().collection('customers').onSnapshot(query => {
      this.total_customers = query.size
    })
    //for products
    firebase.firestore().collection('db').doc('bidbuddy').collection('products').onSnapshot(query => {
      this.total_products = query.size
    })
    //for subscriptions
    firebase.firestore().collection('db').doc('bidbuddy').collection('plans').onSnapshot(query => {
      this.total_sub = query.size
    })
    //for bidrates
    firebase.firestore().collection('db').doc('bidbuddy').collection('bidrate').onSnapshot(query => {
      this.total_bidrates = query.size
    })
  }
}

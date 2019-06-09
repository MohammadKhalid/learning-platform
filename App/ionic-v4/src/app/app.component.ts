import { Component, HostListener } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Platform, MenuController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import io from 'socket.io-client';


import { AuthenticationService } from './services/user/authentication.service';

import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators';
import { SOCKET_URL } from 'src/environments/environment';
import { RestApiService } from './services/http/rest-api.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  userData: any;
  appPages = [];
  socket: any;
  navStart: string;
  navRouterStartEvent: any;
  loginUrl: string = '/login';
  defaultUrl: string = '/dashboard';
  public sockets = io(SOCKET_URL);


  private linksAssessment = {
    header: {
      title: 'Assessment'
    },
    menu: [
      { title: 'Practice Time', url: '/practice-time', icon: 'fitness', icon_mode: 'ios' },
      { title: 'Show Time', url: '/show-time', icon: 'glasses', icon_mode: 'ios' },
      { title: 'Certification', url: '/certification', icon: 'ribbon', icon_mode: 'ios' }
    ]
  };

  private linksInteraction = {
    header: {
      title: 'Interaction'
    },
    menu: [
      { title: 'Live Group Training', url: '/live-group-training', icon: 'easel', icon_mode: 'ios' },
      { title: 'Ask The Expert', url: '/ask-expert', icon: 'chatboxes', icon_mode: 'ios' },
      { title: 'Request Personal Coaching', url: '/request-personal-coaching', icon: 'contacts', icon_mode: 'ios' }
    ]
  };

  private linksAccount = {
    header: {
      title: 'My Account'
    },
    menu: [
      { title: 'Reports', url: '/report', icon: 'stats', icon_mode: 'ios' },
      { title: 'Profile', url: '/profile', icon: 'contact', icon_mode: 'ios' }
    ]
  };

  private links = {
    student: [
      {
        header: false,
        menu: [
          { title: 'Dashboard', url: '/dashboard', icon: 'apps', icon_mode: 'md' },
          { title: 'Topics', url: '/topic', icon: 'book', icon_mode: 'ios' },
          { title: 'Coaches', url: '/coach', icon: 'contacts', icon_mode: 'ios' }
        ]
      },
      this.linksAssessment,
      this.linksInteraction,
      this.linksAccount
    ],
    admin: [
      {
        header: false,
        menu: [
          { title: 'Dashboard', url: '/dashboard', icon: 'apps', icon_mode: 'md' },
          { title: 'Categories', url: '/category', icon: 'list', icon_mode: 'ios' },
          { title: 'Topics', url: '/topic', icon: 'book', icon_mode: 'ios' }
        ]
      },
      {
        header: {
          title: 'Users'
        },
        menu: [
          { title: 'Students', url: '/student', icon: 'school', icon_mode: 'ios' },
          { title: 'Coaches', url: '/coach', icon: 'contacts', icon_mode: 'ios' },
          { title: 'Companies', url: '/company', icon: 'business', icon_mode: 'md' }
        ]
      },
      {
        header: {
          title: 'Interaction'
        },
        menu: [
          { title: 'Live Group Training', url: '/live-group-training', icon: 'easel', icon_mode: 'ios' },
          { title: 'Request Personal Coaching', url: '/request-personal-coaching', icon: 'contacts', icon_mode: 'ios' }
        ]
      },
      this.linksAssessment,
      this.linksAccount
    ],
    company: [
      {
        header: false,
        menu: [
          { title: 'Dashboard', url: '/dashboard', icon: 'apps', icon_mode: 'md' }
        ]
      },
      {
        header: {
          title: 'Staff'
        },
        menu: [
          { title: 'Students', url: '/student', icon: 'school', icon_mode: 'ios' },
          { title: 'Coaches', url: '/coach', icon: 'contacts', icon_mode: 'ios' }
        ]
      },
      this.linksAssessment,
      this.linksInteraction,
      this.linksAccount
    ],
    coach: [
      {
        header: false,
        menu: [
          { title: 'Dashboard', url: '/dashboard', icon: 'apps', icon_mode: 'md' },
          { title: 'Topics', url: '/topic', icon: 'book', icon_mode: 'ios' }
        ]
      },
      this.linksAssessment,
      this.linksInteraction,
      this.linksAccount
    ]
  };

  private userCommonRoutes = ['', 'dashboard', 'topic', 'practice-time', 'show-time', 'certification', 'live-group-training', 'ask-expert', 'request-personal-coaching', 'profile'];
  private userRoutes = {
    student: [
      'coach',
      'practice-time/add'
    ],
    coach: [],
    company: []
  };

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authenticationService: AuthenticationService,
    private router: Router,
    private menuCtrl: MenuController,
    private navCtrl: NavController
  ) {
    // set navigation start url
    this.navRouterStartEvent = this.router.events.pipe(filter(e => e instanceof NavigationStart)).subscribe((event: any) => {
      this.navStart = event.url;
    });

    this.authenticationService.authenticationState.subscribe((state) => {
      // menu state
      setTimeout(() => {
        this.menuCtrl.enable(state);
      });

      if(this.authenticationService.authDidCheck) {
        if (state) {
          // set user data
          this.userData = this.authenticationService.sessionData;

          // set user menu
          this.appPages = this.links[this.userData.user.type];

          // set route
          // this.userRoutes[this.userData.user.type] = this.userRoutes[this.userData.user.type].concat(this.userCommonRoutes);
          // let userRouterConfig = [];
          
          // this.router.config.forEach((val: any) => { 
          //   if(this.userRoutes[this.userData.user.type].includes(val.path)) userRouterConfig.push(val);
          // });
          // this.router.resetConfig(userRouterConfig);

          // redirect if in login page
          if(this.navStart === this.loginUrl || this.navStart === '/') this.navCtrl.navigateRoot(this.defaultUrl);
        } else {
          // redirect to
          this.navCtrl.navigateRoot(this.loginUrl);
        }
      }
    }).remove(this.navRouterStartEvent); // unsubscribe route event

    this.initializeApp();
  }
  @HostListener('window:unload', ['$event'])
  unloadHandler(event: any): void {
        this.sockets.emit('set-offline', { user_id: this.authenticationService.getSessionData().user.id })
  }
  ngAfterViewInit() {
    this.sockets.on('connect', () => {
      setTimeout(() => {
        if (this.authenticationService.getSessionData()) {
          this.sockets.emit('set-online', { user_id: this.authenticationService.getSessionData().user.id });
        }
      }, 500);
    });
    this.sockets.on('disconnect', function () {
    });
    // window.addEventListener('beforeunload', (e) => {
    //  alert();
    // });
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  
  logout() {
    this.sockets.emit('set-offline', { user_id: this.authenticationService.getSessionData().user.id })
    this.authenticationService.logout();
  }

  isActive(url: string) {
    if(this.router.url === url || this.router.url === '/dashboard' && url === '/') return 'secondary';

    return 'dark';
  }

  isActiveLabel(url: string) {
    if(this.router.url === url || this.router.url === '/dashboard' && url === '/') return 'medium';

    return '';
  }
}
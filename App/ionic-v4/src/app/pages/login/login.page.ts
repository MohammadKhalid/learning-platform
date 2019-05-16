import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

import { AuthenticationService } from '../../services/user/authentication.service';
import { RestApiService } from '../../services/http/rest-api.service';

import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

import CryptoJS from 'crypto-js';
import { SOCKET_URL } from 'src/environments/environment';
import io from 'socket.io-client';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    // The account fields for the login form.
    // sure to add it to the type
    loginForm: FormGroup;

    // Our translated text strings
    loginErrorString: string;

    // Login result
    showLoginMessage;

    // Login status
    loading: boolean = true;
    public sockets = io(SOCKET_URL);

    // Slide options
    slideOpts = {
        loop: true,
        effect: 'flip',
        autoplay: {
            delay: 6000
        },
        speed: 400
    };

    constructor(
        private restApi: RestApiService,
        private authService: AuthenticationService,
        private menuCtrl: MenuController,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: new FormControl(''),
            password: new FormControl('')
        });
    }

    ionViewDidEnter() {
        this.menuCtrl.enable(false).finally(() => {
            this.loading = false;
        });
    }

    login() {
        // Show status
        this.loading = true;

        // Hide login message
        this.showLoginMessage = false;

        // Encrypt password
        //let password = CryptoJS.enc.Hex.stringify(CryptoJS.SHA1(this.account.password));
        let password = this.loginForm.value.password;

        this.restApi.post('login', { username: this.loginForm.value.username, password: password }).then((resp: any) => {
            if (resp.success && resp.success === true) {
               this.sockets.emit('set-online', { user_id: resp.user.id });
                // clear form
                // this.account = { username: '', password: '' };

                // log the user
                this.authService.login(resp).then(() => {
                    // hide loading
                    // this.loginResponse(resp.msg);
                });

            } else {
                this.loginResponse(resp.error.error);
            }
        }).catch((err) => {
        });
    }

    loginResponse(resp: string) {
        this.loading = false;
    }
}
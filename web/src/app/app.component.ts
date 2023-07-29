// Copyright 2023 The Casdoor Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import Sdk from 'casdoor-js-sdk';
import {Component, OnInit, ChangeDetectorRef, AfterViewChecked} from "@angular/core";

const config = {
  serverUrl: 'https://door.casdoor.com',
  clientId: "014ae4bd048734ca2dea",
  organizationName: "casbin",
  appName: "app-casnode",
  redirectPath: "/callback",
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  username: string = '';
  isLoggedIn: boolean = false;
  sdk = new Sdk(config);
  tokenReceived: boolean = false;
  bool: boolean = false;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    if (window.location.href.indexOf('code') !== -1) {
      if (!sessionStorage.getItem('token')) {

        this.sdk.signin('http://localhost:8080').then((res: any) => {
          sessionStorage.setItem('token', res.token);
          this.setTokenReceived(true);

          this.getInfo().then((res) => this.setInfo(res));
        });
      }
    }

    if (sessionStorage.getItem('token')) {
      this.getInfo().then((res) => this.setInfo(res));
    }
  }

  async getInfo() {
    const token = sessionStorage.getItem('token');
    if (!token) {
      return;
    } else {
      const response = await fetch(`http://localhost:8080/api/getUserInfo?token=${token}`);
      return response.json();
    }
  }

  setInfo(res: any) {
    const userinfo = res;
    this.setUsername(userinfo.name);
    this.setIsLoggedIn(true);
  }

  gotoSignInPage() {
    window.location.href = this.sdk.getSigninUrl();
  }

  signOut() {
    sessionStorage.removeItem('token');
    this.setTokenReceived(false);
    window.location.href = 'http://localhost:9000';
  }

  setUsername(username: string) {
    this.username = username;
  }

  setIsLoggedIn(isLoggedIn: boolean) {
    this.isLoggedIn = isLoggedIn;
  }

  setTokenReceived(tokenReceived: boolean) {
    this.tokenReceived = tokenReceived;
  }
}

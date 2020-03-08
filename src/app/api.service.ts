import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Util } from './util';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private _registerUrl = "http://localhost:3000/register";
  private _loginUrl = "http://localhost:3000/login";
  private _verifyTokenUrl = "http://localhost:3000/verifyToken";

  constructor(
    private http: HttpClient,
    private router: Router,
    private util : Util
  ) { }

  loginUser(user) {
    return this.http.post<any>(this._loginUrl, user)
  }

  registerUser(user) {
    return this.http.post<any>(this._registerUrl, user)
  }

  logoutUser() {
    localStorage.clear();
    this.util.removeUser();
    this.router.navigate(['/login'])
  }

  getToken() { 
    return localStorage.getItem(this.util.getSecuredToken());
  }

  loggedIn() : boolean{    
    return !!this.getToken();
  }

  // Use this function to find whether the current user is a verified token user...
  isVerifiedLogin(){
    this.verifyToken().subscribe(
      res => console.log("verified"),
      err => {
        if( err instanceof HttpErrorResponse ) {
          if (err.status === 401) { // unauthorized user
            this.logoutUser();     
          }
        }
      }
    )
  }

  verifyToken(){
    return this.http.get<any>(this._verifyTokenUrl);
  }
}

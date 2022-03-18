import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
import { User } from "./user.model";
import { environment } from "src/environments/environment";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService{
  user = new BehaviorSubject<User>(null);
  private tokenexpTimer: any;
  constructor(private http: HttpClient, private router: Router){}
  
  signup(email: string, password: string){
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`, 
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handelError),
        tap(resData => {
          this.handelAuth(
            resData.email, 
            resData.localId, 
            resData.idToken, 
            +resData.expiresIn
          );
        })
      )
  }

  login(email: string, password: string){
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`, 
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handelError),
        tap(resData => {
          this.handelAuth(
            resData.email, 
            resData.localId, 
            resData.idToken, 
            +resData.expiresIn
          );
        })
      )
  }

  autoLogin(){
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if(!userData){
      return;
    }
    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
    if(loadedUser.token){
      this.user.next(loadedUser);
      const expDuraiton = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
      this.autoLogout(expDuraiton)
    }
  }

  logout(){
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if(this.tokenexpTimer){
      clearTimeout(this.tokenexpTimer);
    }
    this.tokenexpTimer = null;
  }

  autoLogout(expDuraiton: number){
    this.tokenexpTimer = setTimeout(()=>{
      this.logout();
    }, expDuraiton)
  }

  private handelAuth(
    email: string, 
    userId:string, 
    token: string, 
    exp: number){
      const exDate = new Date(new Date().getTime() + exp * 1000);
      const user = new User(email, userId, token, exDate);
      this.user.next(user);
      this.autoLogout(exp * 1000);
      localStorage.setItem('userData', JSON.stringify(user));
  }

  private handelError(errorRes: HttpErrorResponse){
    let errorMessage = 'An unknown error occurred';
    if(errorRes.error && errorRes.error.error){
      switch(errorRes.error.error.message){
        case 'EMAIL_EXISTS':
          errorMessage = 'This email exists already'
          break;
        case 'EMAIL_NOT_FOUND':
          errorMessage = 'The Email you have entered was not found'
          break;
        case 'INVALID_PASSWORD':
          errorMessage = 'You have entered and invalid password'
          break;
        case 'USER_DISABLED':
          errorMessage = 'Your account hasbeen disabled by admin'
          break;
        default:
          errorMessage = errorRes.error.error.message
      }
    }
    // throw new Error(errorMessage);
    return throwError(()=> new Error(errorMessage))
    // return throwError(errorMessage) //-> this is not supported after v8
    // throw (errorMessage)
  }
}
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Actions, ofType, createEffect } from "@ngrx/effects";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { switchMap, map, catchError, tap } from "rxjs/operators";

import * as AuthActions from './auth.actions';
import { environment } from "../../../environments/environment";
import { User } from "../user.model";
import { AuthService } from "../auth.service";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handelAuth = (expiresIn: number, email: string, userId: string, token:string) => {
  const exDate = new Date(new Date().getTime() + +expiresIn * 1000);
  const user = new User(email, userId, token, exDate);
  localStorage.setItem('userData', JSON.stringify(user))
  return new AuthActions.AuthSuccess({
    email: email, 
    userId: userId, 
    token: token, 
    expirationDate: exDate,
    redirect: true})
};

const handelError = (errorRes: any) => {
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
  return of(new AuthActions.AuthFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  authSignup = createEffect(() => 
    this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((signupAction: AuthActions.SignupStart)=>{
        return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`, 
        {
          email: signupAction.payload.email,
          password: signupAction.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        tap(res => {
          this.authService.setLogoutTimer(+res.expiresIn * 1000)
        }),
        map(res => {
          return handelAuth(+res.expiresIn, res.email, res.localId, res.idToken);
        }),
        catchError(errorRes => {
          return handelError(errorRes)
        })
      )
      })
    )
  );

  authLogin$ = createEffect(() => 
    this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart)=>{
      return this.http.post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`, 
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        tap(res => {
          this.authService.setLogoutTimer(+res.expiresIn * 1000)
        }),
        map(res => {
          return handelAuth(
            +res.expiresIn, 
            res.email, 
            res.localId, 
            res.idToken);
        }),
        catchError(errorRes => {
          return handelError(errorRes)
        })
      )
    })
  ));

  autoLogin$ = createEffect(()=>
    this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(()=>{
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if(!userData){
          return {type: 'DUMMY'};
        }
        const expDateToken = new Date(userData._tokenExpirationDate) 
        const loadedUser = new User(
          userData.email, 
          userData.id, 
          userData._token, 
          expDateToken
        );
        if(loadedUser.token){
          const expDate = new Date(
            userData._tokenExpirationDate).getTime() - 
            new Date().getTime()
          this.authService.setLogoutTimer(expDate)
          return new AuthActions.AuthSuccess(
            {
              email: loadedUser.email, 
              userId: loadedUser.id, 
              token: loadedUser.token, 
              expirationDate: expDateToken,
              redirect: false
            }
          )
          // )
          // const expDuraiton = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
          // this.autoLogout(expDuraiton)
        }
        return {type: 'DUMMY'};
      })     
    )
  )


  authRedirect$ = createEffect(() => 
    this.actions$.pipe(
      ofType(AuthActions.AUTH_SUCCESS),
      tap((authSuccessActions:AuthActions.AuthSuccess) => {
        if(authSuccessActions.payload.redirect){
          this.router.navigate(['/'])
        }
      })
    ),
    {dispatch: false}
  )

  authLogout$ = createEffect(() => 
      this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(()=> {
          this.authService.clearLogoutTimer();
          localStorage.removeItem('userData');
          this.router.navigate(['/auth'])
        })
      ),
      {dispatch: false}
  )

  constructor(
    private actions$: Actions, 
    private http: HttpClient, 
    private router: Router,
    private authService: AuthService){}
}


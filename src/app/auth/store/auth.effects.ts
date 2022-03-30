import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
//import { Actions, ofType, createEffect, Effect } from "@ngrx/effects";
import { Actions, ofType, Effect } from "@ngrx/effects";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { switchMap, map, catchError, tap } from "rxjs/operators";

import * as AuthActions from './auth.actions';
import { environment } from "../../../environments/environment";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  // authLogin$ = createEffect(() => this.actions$.pipe(
  //   ofType(AuthActions.LOGIN_START),
  //   switchMap((authData: AuthActions.LoginStart)=>{
  //     return this.http.post<AuthResponseData>(
  //       `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`, 
  //       {
  //         email: authData.payload.email,
  //         password: authData.payload.password,
  //         returnSecureToken: true
  //       }
  //     ).pipe(
  //       map(res => {
  //         const exDate = new Date(new Date().getTime() + +res.expiresIn * 1000);
  //         return new AuthActions.Login({email: res.email, userId: res.localId, token: res.idToken, expirationDate: exDate})
  //       }),
  //       catchError(error => {
  //         //..
  //         return of();
  //       })
  //     )
  //   })
  // ))



  @Effect()
  authLogin$ =
    this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        return this.http
        .post<AuthResponseData>(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`, 
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
          }
        ).pipe(
          map(res => {
            const exDate = new Date(new Date().getTime() + +res.expiresIn * 1000);
            return of(new AuthActions.Login({email: res.email, userId: res.localId, token: res.idToken, expirationDate: exDate}))
          })
          ,catchError(error => {
          //..
          return of();
        })) 
      })

    );
  @Effect({dispatch: false})
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.LOGIN), 
    tap(() => {
      this.router.navigate(['/'])
    })
  );

  constructor(private actions$: Actions, private http: HttpClient, private router: Router){}
}


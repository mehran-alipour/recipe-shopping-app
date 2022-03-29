import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Actions, ofType, createEffect, Effect } from "@ngrx/effects";
import { of } from "rxjs";
import { switchMap, map, catchError } from "rxjs/operators";

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

  @Effect()
  authLogin$ = //createEffect(() => {
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

  //})

  constructor(private actions$: Actions, private http: HttpClient){}
}

// function createEffect(arg0: () => void) {
//   throw new Error("Function not implemented.");
// }


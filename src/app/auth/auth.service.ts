import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";

import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';


@Injectable({providedIn: 'root'})
export class AuthService{
  // user = new BehaviorSubject<User>(null);
  private tokenexpTimer: any;
  constructor(
    private store: Store<fromApp.AppState>
  ){}


  setLogoutTimer(expDuraiton: number){
    this.tokenexpTimer = setTimeout(()=>{
      this.store.dispatch(new AuthActions.Logout());
    }, expDuraiton)
  }

  clearLogoutTimer(){
    if(this.tokenexpTimer){
      clearTimeout(this.tokenexpTimer)
      this.tokenexpTimer = null;
    }
  }

}
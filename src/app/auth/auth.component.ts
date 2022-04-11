import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/plaholder.directive';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy, OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;

  private closeSub: Subscription;
  private storeSub: Subscription;
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.isLoading
      this.error = authState.authError;
      if(this.error) {
        this.showErrorAlert(this.error);
      }
    })
  }

  onHandleError(){
    this.store.dispatch(new AuthActions.ClearError())
  }

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }
  onSubmit(form: NgForm){
    if (!form.valid){
      return
    }
    const email = form.value.email;
    const password = form.value.password;


    if (this.isLoginMode){
      //authObs = this.authService.login(email, password);
      this.store.dispatch(new AuthActions.LoginStart({email:email, password:password}))
    } else{
      this.store.dispatch(new AuthActions.SignupStart({email:email, password:password}))
    }

    form.reset();

  }

  private showErrorAlert(message: string){
    // this wont work cause angular does more than just creating an object
    // when creating an component the component needs to be wired up with 
    // DOM
    const alertCmpFactory = 
      this.componentFactoryResolver.resolveComponentFactory(
        AlertComponent
      );

    const hostViewCntRef = this.alertHost.viewCntRef
    hostViewCntRef.clear();
    const cmpRef = hostViewCntRef.createComponent(alertCmpFactory);

    cmpRef.instance.message = message;
    this.closeSub = cmpRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewCntRef.clear();
    });

  }

  ngOnDestroy(): void {
    if(this.closeSub){
      this.closeSub.unsubscribe()
    }
    if(this.storeSub){
      this.storeSub.unsubscribe()
    }
  }

}

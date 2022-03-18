import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { AuthService, AuthResponseData } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/plaholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;

  private closeSub: Subscription;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  onHandleError(){
    this.error = null;
  }

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
    this.error = null;
  }
  onSubmit(form: NgForm){
    if (!form.valid){
      return
    }
    const email = form.value.email;
    const password = form.value.password;
    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;

    if (this.isLoginMode){
      authObs = this.authService.login(email, password);
    } else{
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe({
      next: res => {
        this.isLoading = false;
        this.error = null;
        this.router.navigate(['/recipes']);
      },
      error: error => {
        this.error = error
        this.showErrorAlert(error);
        this.isLoading = false;
      }
    })

    form.reset();

  }

  private showErrorAlert(message: string){
    // this wont work cause angular does more than just creating an object
    // when creating an component the component needs to be wired up with 
    // DOM
    // const alertCmp = new AlertComponent();
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
  }

}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';
import * as fromApp from '../store/app.reducer';
import * as AuthAction from '../auth/store/auth.actions';

@Component({
   selector: 'app-header',
   templateUrl: './header.component.html',
   styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy{
   collapsed = true;
   isAuthenticated = false;
   private mySub: Subscription;
   
   constructor(
      private dataStorageService: DataStorageService, 
      private authService: AuthService,
      private store: Store<fromApp.AppState>
   ){};
   
   ngOnInit(): void {
      this.mySub = this.store.select('auth')
      .pipe(map(authState => {
         return authState.user
      }))
      .subscribe(
         user => {
            this.isAuthenticated = !!user;
         }
      );
   }

   onSaveData(){
      this.dataStorageService.storeRecipes();
   }

   onFetchData(){
      this.dataStorageService.fetchRecipes().subscribe();
   }

   onLogout(){
      this.authService.logout()
   }

   ngOnDestroy(): void {
       this.mySub.unsubscribe()
   }

}
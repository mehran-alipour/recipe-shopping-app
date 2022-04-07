import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipesActions from '../recipe/store/recipe.actions';

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
      // this.dataStorageService.storeRecipes();
      this.store.dispatch(new RecipesActions.StoreRecipes());
   }

   onFetchData(){
      this.store.dispatch(new RecipesActions.FetchRecipes());
      //this.dataStorageService.fetchRecipes().subscribe();
   }

   onLogout(){
      this.store.dispatch(new AuthActions.Logout());
   }

   ngOnDestroy(): void {
       this.mySub.unsubscribe()
   }

}
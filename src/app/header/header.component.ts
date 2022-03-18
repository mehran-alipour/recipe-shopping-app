import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';


@Component({
   selector: 'app-header',
   templateUrl: './header.component.html',
   styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy{
   collapsed = true;
   isAuthenticated = false;
   private mySub: Subscription;
   
   constructor(private dataStorageService: DataStorageService, private authService: AuthService) { };
   
   ngOnInit(): void {
      //console.log("ngOnInit -- Header")
      this.mySub = this.authService.user.subscribe(
         user => {
            this.isAuthenticated = !!user;
            // if (this.isAuthenticated){
            //    console.log("Data is being loaded");
            //    this.dataStorageService.fetchRecipes().subscribe();
            // }
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
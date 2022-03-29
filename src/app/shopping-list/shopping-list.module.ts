import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { FormsModule } from "@angular/forms";
import { ShoppingListEditComponent } from "./shopping-list-edit/shopping-list-edit.component";
import { ShoppingListComponent } from "./shopping-list.component";
import { ShoppingListRoutingModule } from "./shopping-list-routing.module";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations:[
    ShoppingListComponent,
    ShoppingListEditComponent
  ],
  imports:[
    SharedModule,
    FormsModule,
    ShoppingListRoutingModule
  ]
})
export class ShoppingListModule {}
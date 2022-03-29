import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";

import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeComponent } from './recipe.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { ShortenPipe } from "../shared/shorten.pipe";
import { RecipeRoutingModule } from "./recipe-routing.module";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations:[
    RecipeListComponent,
    RecipeItemComponent,
    RecipeDetailComponent,
    RecipeComponent,
    RecipeStartComponent,
    RecipeEditComponent,
    ShortenPipe
  ],
  imports:[
    SharedModule,
    ReactiveFormsModule,
    RecipeRoutingModule
  ]
})
export class RecipeModule {}
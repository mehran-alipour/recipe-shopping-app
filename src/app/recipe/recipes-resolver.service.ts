import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { Observable } from "rxjs";
import { take } from 'rxjs/operators';

// import { DataStorageService } from "../shared/data-storage.service";
// import { RecipeService } from "./recipe.service";
import { Recipe } from "./recipe.model";
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipe/store/recipe.actions';

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]>{
  constructor(
    // private dataStorageService: DataStorageService, 
    // private recipeService: RecipeService,
    private store: Store<fromApp.AppState>,
    private actions$: Actions){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
    // const recipes = this.recipeService.getRecipes();
    // if(recipes.length === 0){
    //   return this.dataStorageService.fetchRecipes();
    // }else{
    //   return recipes;
    // }
    this.store.dispatch(new RecipesActions.FetchRecipes());
    return this.actions$.pipe(ofType(RecipesActions.SET_RECIPES), take(1))
  }

}
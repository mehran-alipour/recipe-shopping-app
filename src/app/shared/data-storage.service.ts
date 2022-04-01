import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, tap } from "rxjs/operators";
import { Store } from '@ngrx/store';

import { Recipe } from "../recipe/recipe.model";
import { RecipeService } from "../recipe/recipe.service";
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipe/store/recipe.actions';

@Injectable({providedIn: 'root'})
export class DataStorageService{
  firstLoad = true;
  
  constructor(
    private http: HttpClient, 
    private recipeService: RecipeService,
    private store: Store<fromApp.AppState> 
  ){}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put(
      'https://ng-course-recipe-book-abcd2-default-rtdb.firebaseio.com/recipes.json', 
      recipes
    ).subscribe(res => {
      console.log("STORE -----");
      console.log(res);
    });
  }

  fetchRecipes(){
    return this.http
      .get<Recipe[]>('https://ng-course-recipe-book-abcd2-default-rtdb.firebaseio.com/recipes.json?')
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {
              ... recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),
        tap(recipes => {
          //this.recipeService.setRecipes(rec);
          this.store.dispatch(new RecipesActions.SetRecipes(recipes));
        })
      );
      // .subscribe(res=>{
      //   this.recipeService.setRecipes(res);
      // })
  }

}
import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { map, tap } from "rxjs";
import { Recipe } from "../recipe/recipe.model";

import { RecipeService } from "../recipe/recipe.service";

@Injectable({providedIn: 'root'})
export class DataStorageService implements OnInit{
  constructor(
    private http: HttpClient, 
    private recipeService: RecipeService, 
  ){}

  firstLoad = true;

  ngOnInit(): void {
  }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put('https://ng-course-recipe-book-abcd2-default-rtdb.firebaseio.com/recipes.json', recipes).subscribe(res=>
    console.log(res))
  }

  fetchRecipes(){
    return this.http
      .get<Recipe[]>('https://ng-course-recipe-book-abcd2-default-rtdb.firebaseio.com/recipes.json?')
      .pipe(
        map(recipes => {
          // the following map is the array method and not rsjx
          return recipes.map(recipe => {
            return {
              ... recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),
        tap(rec => {
          this.recipeService.setRecipes(rec);
        })
      )
      // .subscribe(res=>{
      //   this.recipeService.setRecipes(res);
      // })
  }

}
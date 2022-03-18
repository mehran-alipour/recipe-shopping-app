import { Injectable, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredients } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService{
  recipesChanged = new Subject<Recipe []>();

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'A Test Recipe',
  //     'This is a simply a test',
  //     'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=556,505',
  //     [
  //       new Ingredients("Apples", 5),
  //       new Ingredients("Oranges", 5)
  //     ]),
  //   new Recipe(
  //     'A Test Recipe 2',
  //     'This is a simply a test 2',
  //     'https://www.thespruceeats.com/thmb/TiTVtgX9DN6h0boos6dPBq1LGtY=/4048x2696/filters:fill(auto,1)/turkey-cutlets-marsala-3061837-hero-01-5d1a161d2e7a4ab48491d9daaca0456c.jpg',
  //     [
  //       new Ingredients("Somethings", 2),
  //       new Ingredients("Otherthings", 1)
  //     ])
  // ];

  private recipes: Recipe[] = [];


  constructor(private shoppingListSrv: ShoppingListService){}

  setRecipes(recipes: Recipe[]){
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice())
  }

  getRecipes(){
    // slice sends a copy of an array
    return this.recipes.slice();
  }

  getRecipe(id: number){
    id %= this.recipes.length;
    return this.recipes[id]
  }

  addIngredients(ingredients: Ingredients[]){
    for(let i in ingredients ){
      this.shoppingListSrv.onAddItemToList(ingredients[i])
    }
  }

  addRecipe(recipe: Recipe){
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(itemId: number, newRecipe: Recipe){
    this.recipes[itemId] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }
  deleteIngredient(item: number){
    this.recipes.splice(item, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

}
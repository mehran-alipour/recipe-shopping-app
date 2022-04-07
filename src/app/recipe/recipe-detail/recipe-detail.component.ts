import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from  '../store/recipe.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  itemsAddedToShoppingList = false;
  itemAddedNum: 0;
  itemId: number;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private store: Store<fromApp.AppState>){}

  ngOnInit(): void {
    this.route.params.pipe(
      map(param => {
        return +param['id']
      }),
      switchMap(id => {
        this.itemId = id;
        return this.store.select('recipes')
      }),
      map(recipesState => {
        return recipesState.recipes.find((rec, index)=>{
          return index === this.itemId
        })
      })
    ).subscribe(recipe => {
      this.recipe = recipe
    })
  }

  toShoppingList(){
    if(!this.itemsAddedToShoppingList){
      this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients))
      this.itemsAddedToShoppingList = true;
      this.itemAddedNum++;
    }
    else{
      var dialog = confirm(`Items have been added to the list before would you like to add them again?`);
      if(dialog){
        this.itemsAddedToShoppingList = false;
        this.itemAddedNum++;
        this.toShoppingList();
      }
    }
  }
  onEditRecipe(){
    this.router.navigate(['edit'], {relativeTo: this.route});
  }
  onDeleteRecipe(){
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.itemId));
    this.router.navigate(['../'], {relativeTo: this.route});
  }
}

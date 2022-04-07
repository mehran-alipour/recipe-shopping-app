import { Action } from '@ngrx/store';
import { Recipe } from '../recipe.model';

export const
  SET_RECIPES = '[Recipes] Set Recipes',
  FETCH_RECIPES = '[Recipes] Fetch Recipes',
  ADD_RECIPE= '[Recipes] Add Recipe',
  UPDATE_RECIPE= '[Recipes] Update Recipe',
  DELETE_RECIPE= '[Recipes] Delete Recipe',
  STORE_RECIPES= '[Recipes] Store Recipe';

export class SetRecipes implements Action {
  readonly type = SET_RECIPES;
  constructor(
    public payload: Recipe[]
  ){}
}

export class FetchRecipes implements Action {
  readonly type = FETCH_RECIPES;
}

export class AddRecipe implements Action {
  readonly type = ADD_RECIPE;
  constructor(public payload: Recipe){}
}

export class UpdateRecipe implements Action {
  readonly type = UPDATE_RECIPE;
  constructor(public payload:{itemId: number, newRecipe: Recipe}){}
}

export class DeleteRecipe implements Action {
  readonly type = DELETE_RECIPE;
  constructor(public payload: number){}
}

export class StoreRecipes implements Action{
  readonly type = STORE_RECIPES;
}

export type RecipesActions = SetRecipes | FetchRecipes | AddRecipe | UpdateRecipe | DeleteRecipe | StoreRecipes;
import { Action } from "@ngrx/store";

import { Ingredients } from "src/app/shared/ingredient.model";

export const 
  ADD_INGREDIENT = '[Shopping List] Add Ingredient',
  ADD_INGREDIENTS = '[Shopping List] Add Ingredients',
  UPDATE_INGREDIENT = '[Shopping List] Update Ingredient',
  DELETE_INGREDIENT = '[Shopping List] Delete Ingredient',
  START_EDIT = '[Shopping List] Start Edit',
  STOP_EDIT = '[Shopping List] Stop Edit';


export class AddIngredient implements Action {
  readonly type = ADD_INGREDIENT;
  constructor(public payload: Ingredients){}
}

export class AddIngredients implements Action{
  readonly type = ADD_INGREDIENTS;
  constructor(public payload: Ingredients[]){}
}

export class UpdateIngredient implements Action{
  readonly type = UPDATE_INGREDIENT;
  constructor(public payload: Ingredients){}
}

export class DeleteIngredient implements Action{
  readonly type = DELETE_INGREDIENT;
}

export class StatrtEdit implements Action{
  readonly type = START_EDIT;
  constructor(public playload: number){}
}

export class StopEdit implements Action{
  readonly type = STOP_EDIT;
}

export type ShoppingListActions = 
  | AddIngredient 
  | AddIngredients
  | UpdateIngredient
  | DeleteIngredient
  | StatrtEdit
  | StopEdit;
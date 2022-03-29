//import { Action } from "@ngrx/store";

import { Ingredients } from "../../shared/ingredient.model";
import * as ShoppingListAction from "./shopping-list.actions";

export interface State {
  ingredients: Ingredients[],
  editedIngredient: Ingredients,
  editedIngredientIndex: number
}

const initialState: State = {
  ingredients: [
    new Ingredients('Apples', 5),
    new Ingredients('Tomatos', 10)
  ],
  editedIngredient: null,
  editedIngredientIndex: -1
};

export function shoppingListReducer(state: State = initialState, action: ShoppingListAction.ShoppingListActions){
  switch (action.type) {
    case ShoppingListAction.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [
          ...state.ingredients,
          action.payload
        ]
      };
  
    case ShoppingListAction.ADD_INGREDIENTS:
      return{
        ...state,
        ingredients: [
          ...state.ingredients,
          ...action.payload
        ]
      }

    case ShoppingListAction.UPDATE_INGREDIENT:
      const ingredient = state.ingredients[state.editedIngredientIndex];
      const UpdateIngredient = {
        ...ingredient,
        ...action.payload
      };
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[state.editedIngredientIndex] = UpdateIngredient;

      return{
        ...state,
        ingredients: updatedIngredients,
        editedIngredient: null,
        editedIngredientIndex: -1
      }

    case ShoppingListAction.DELETE_INGREDIENT:
      return{
        ...state,
        ingredients: state.ingredients.filter((ig, igIndex)=>{
          return igIndex !== state.editedIngredientIndex
        }),
        editedIngredient: null,
        editedIngredientIndex: -1
      }

    case ShoppingListAction.START_EDIT:
      return{
        ...state,
        editedIngredientIndex: action.playload,
        editedIngredient: {...state.ingredients[action.playload]}
      };
    
    case ShoppingListAction.STOP_EDIT:
      return{
        ...state,
        editedIngredientIndex: -1,
        editedIngredient: null
      };

    default:
      return state
  }
}
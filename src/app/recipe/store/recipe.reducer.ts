import { Recipe } from "../recipe.model"
import * as RecipesActions from './recipe.actions';

export interface State{
  recipes: Recipe[];
}

const initialState: State = {
  recipes: []
};

export function recipeReducer(state = initialState, action:RecipesActions.RecipesActions){
  switch (action.type){
    case RecipesActions.SET_RECIPES:
      return{
        ...state,
        recipes: [...action.payload]
      }

    case RecipesActions.ADD_RECIPE:
      return{
        ...state,
        recipes: [...state.recipes, action.payload]
      }
    case RecipesActions.UPDATE_RECIPE:
      const updatedRecipe = {
        ...state.recipes[action.payload.itemId],
        ...action.payload.newRecipe
      };
      const updatedRecipes = [...state.recipes];
      updatedRecipes[action.payload.itemId] = updatedRecipe;
      return{
        ...state,
        recipes: updatedRecipes
      }
    case RecipesActions.DELETE_RECIPE:
      return{
        ...state,
        recipes: state.recipes.filter((rec,i)=>{
          return i !== action.payload;
        })
      }
    default:
      return state;
  }
  
}
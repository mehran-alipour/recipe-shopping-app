import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipe.actions';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  recipeForm : FormGroup;

  private storeSup: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id']
          this.editMode = params['id'] != null;
          this.initForm();
    })
  }

  onResetForm(){
    this.recipeForm.reset();
    this.id = -1;
    this.editMode = false;
    this.router.navigate(['../'], {relativeTo: this.route} );
  }
      
  onSubmit(){
    if(this.editMode){
      this.store.dispatch(new RecipesActions.UpdateRecipe({itemId: this.id, newRecipe: this.recipeForm.value}))
    } else{
      this.store.dispatch(new RecipesActions.AddRecipe(this.recipeForm.value));
    }
    this.onResetForm();
  }

  onCancelForm(){
    this.onResetForm();
  }

  onAddIngredient(){
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null,[
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    )
  }
      
  private initForm(){
    let recipeName = '';
    let recipeImgPath = '';
    let recipeDes = '';
    let recipeIngredients = new FormArray([]);
    
    if(this.editMode){
      //const recipe = this.recipesrv.getRecipe(this.id)
      this.storeSup = this.store.select('recipes').pipe(
        map(recState => {
          return recState.recipes.find((rec, index) =>{
            return index === this.id
          })
      }))
        .subscribe( recipe => {
          recipeName = recipe.name;
          recipeImgPath = recipe.imagePath;
          recipeDes = recipe.description;
          
          if(recipe['ingredients']){
            for(let ingredient of recipe.ingredients){
              recipeIngredients.push(
                new FormGroup({
                  'name': new FormControl(ingredient.name, Validators.required),
                  'amount': new FormControl(ingredient.amount,[
                    Validators.required,
                    Validators.pattern(/^[1-9]+[0-9]*$/)
                  ])
                })
              );
            }
          }

        })
    }
      
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'description': new FormControl(recipeDes, Validators.required),
      'imagePath': new FormControl(recipeImgPath, Validators.required),
      'ingredients' : recipeIngredients
    });
  }
    
  get Controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onDeleteIngredient(index: number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
    // To delete all item in an FormArry
    //(<FormArray>this.recipeForm.get('ingredients')).clear();
  }

  ngOnDestroy(): void {
    if (this.storeSup){
      this.storeSup.unsubscribe();
    }
  }

}

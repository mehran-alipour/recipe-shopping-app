import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm : FormGroup;

  constructor(private route: ActivatedRoute, private recipesrv: RecipeService, private router: Router) { }

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id']
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
      this.recipesrv.updateRecipe(this.id, this.recipeForm.value);
    } else{
      this.recipesrv.addRecipe(this.recipeForm.value);
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
      const recipe = this.recipesrv.getRecipe(this.id)
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

}

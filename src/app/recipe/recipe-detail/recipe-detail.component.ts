import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
//import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

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

  //constructor(private shoppingListSrv: ShoppingListService) { }
  constructor(private recipeSrv: RecipeService, private route: ActivatedRoute, private router: Router){}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.itemId = +params['id'];
        this.recipe = this.recipeSrv.getRecipe(this.itemId)
      }
    )
  }

  toShoppingList(){
    // for(let i in this.recipe.ingredints ){
    //   this.shoppingListSrv.onAddItemToList(this.recipe.ingredints[i])
    // }
    if(!this.itemsAddedToShoppingList){
      this.recipeSrv.addIngredients(this.recipe.ingredients);
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
    // this.router.navigate(['../', this.itemId, 'edit'], {relativeTo: this.route})
  }

}

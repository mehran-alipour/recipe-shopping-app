import { Subject } from 'rxjs';
import { Ingredients } from "../shared/ingredient.model";

export class ShoppingListService {
  listWasUpdated = new Subject<Ingredients[]>();
  
  private ingredients: Ingredients[] = [
    new Ingredients('Apples', 5),
    new Ingredients('Tomatos', 10)
  ];
  
  onGetIngrediets (){
    // send a copy not a refrence 
    return this.ingredients.slice();
  }


  onAddItemToList(item: Ingredients){
    var found = this.ingredients.findIndex(function(element){
      return element.name.toLowerCase() === item.name.toLowerCase(); 
    })
    if(found != -1){
      this.ingredients[found].amount += item.amount
    }
    else{
      this.ingredients.push(item)
    }
    this.listWasUpdated.next(this.ingredients.slice());
  }

}
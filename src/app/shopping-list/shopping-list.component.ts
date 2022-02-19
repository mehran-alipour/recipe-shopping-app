import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ingredients } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredients[];
  private igChangeSub: Subscription;

  constructor(private shoppingListSrv: ShoppingListService) { }

  ngOnInit() {
      this.ingredients = this.shoppingListSrv.onGetIngrediets();
      this.igChangeSub = this.shoppingListSrv.listWasUpdated.subscribe(
        (ingredients: Ingredients[]) => {
          this.ingredients = ingredients;
        }
      )
  }
  ngOnDestroy(): void {
      this.igChangeSub.unsubscribe()
  }

}

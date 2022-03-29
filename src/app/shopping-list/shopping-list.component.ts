import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';

import { Ingredients } from '../shared/ingredient.model';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as formApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredients[] }>;

  constructor(
    private store: Store<formApp.AppState>
    ) { }

  ngOnInit() {
      this.ingredients = this.store.select('shoppingList');
  }
  
  onEditItem(itemId: number){
    this.store.dispatch(new ShoppingListActions.StatrtEdit(itemId))
  }
  
  ngOnDestroy(): void {
  }

}

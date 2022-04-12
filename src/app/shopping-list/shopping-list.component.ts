import { animate, group, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Ingredients } from '../shared/ingredient.model';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as formApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
  animations:[
    trigger('list1', [
      state('in',style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(-100px)'
        }),
        animate(300)
      ]),
      transition('* => void',[
        animate(300,style({
          opacity: 0,
          transform: 'translateX(100px)'
        }))
      ])
    ]),
  ]
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
  animationStarted(event){
    console.log(event)
  }
  
  animationended(event){
    console.log(event)
  }

}

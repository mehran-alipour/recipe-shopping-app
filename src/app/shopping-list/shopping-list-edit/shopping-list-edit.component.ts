import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Ingredients } from 'src/app/shared/ingredient.model';
import * as ShoppingListAction from '../store/shopping-list.actions';
import * as formApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent implements OnInit, OnDestroy{
  @ViewChild('f',{static:false}) slForm: NgForm;
  subscription : Subscription;
  editMode = false;
  editedItem: Ingredients;

  constructor(
    private store:  Store<formApp.AppState>
  ){}

  ngOnInit(): void {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if(stateData.editedIngredientIndex > -1){
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        })
      } else {
        this.editMode = false
      }
    });
  }

  onAddItem(form: NgForm){
    let name = form.value.name;
    let amount = +form.value.amount;
    if(amount > 0 && Number.isInteger(amount) && !this.editMode){
      name = name.trim();
      const itemToAdd = new Ingredients(name, amount);
      this.store.dispatch(new ShoppingListAction.AddIngredient(itemToAdd));
    } else if(this.editMode){
      const itemToAdd = new Ingredients(name, amount);
      this.store.dispatch(new ShoppingListAction.UpdateIngredient(itemToAdd));
    } else{
      console.log("Thats not gona happen")
    }
    this.onClearForm()
  }

  onDeleteItem(){
    if(this.editMode === true){
      this.store.dispatch(new ShoppingListAction.DeleteIngredient());
      this.onClearForm()
    }
  }

  onClearForm(){
    this.slForm.reset();
    this.store.dispatch(new ShoppingListAction.StopEdit());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
    this.store.dispatch(new ShoppingListAction.StopEdit());
  }
  
}


import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredients } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent implements OnInit, OnDestroy{
  @ViewChild('f',{static:false}) slForm: NgForm;
  subscription : Subscription;
  editMode = false;
  itemIdToEdit : number;
  editedItem: Ingredients;

  constructor(private shoppingListSrv: ShoppingListService){}

  ngOnInit(): void {
      this.subscription = this.shoppingListSrv.startEditing.subscribe(
        (itemId: number) => {
          this.editMode = true;
          this.itemIdToEdit = itemId;
          this.editedItem = this.shoppingListSrv.getIngredients(itemId);
          this.slForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount
          })
        }
      );
  }

  onAddItem(form: NgForm){
    let name = form.value.name;
    let amount = +form.value.amount;
    if(amount > 0 && Number.isInteger(amount) && !this.editMode){
      name = name.trim();
      const itemToAdd = new Ingredients(name, amount);
      //this.shoppingListSrv.addItemToList.emit(itemToAdd);
      this.shoppingListSrv.onAddItemToList(itemToAdd);
    } else if(this.editMode){
      this.shoppingListSrv.onUpdateItem(this.itemIdToEdit, {name: this.slForm.value['name'], amount: +this.slForm.value['amount']});
    } else{
      console.log("Thats not gona happen")
    }
    this.onClearForm()
  }

  onDeleteItem(){
    if(this.editMode === true && this.itemIdToEdit !== -1){
      this.shoppingListSrv.onDelete(this.itemIdToEdit);
      this.onClearForm()
    }
  }

  onClearForm(){
    this.editMode = false;
    this.itemIdToEdit = -1;
    this.editedItem = null;
    this.slForm.reset();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
  
}
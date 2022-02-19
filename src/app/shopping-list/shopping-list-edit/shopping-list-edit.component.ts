import { Component, ElementRef, ViewChild } from '@angular/core';
import { Ingredients } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css']
})

export class ShoppingListEditComponent{
  constructor(private shoppingListSrv: ShoppingListService){}
  
  @ViewChild('nameInput') nameInputRef: ElementRef;
  @ViewChild('amountInput') amountInputRef: ElementRef;


  onAddItem(){
    var name = this.nameInputRef.nativeElement.value;
    name = name.trim();
    
    const amount = Number(this.amountInputRef.nativeElement.value);
    const itemToAdd = new Ingredients(name, amount);
    
    //this.shoppingListSrv.addItemToList.emit(itemToAdd);
    this.shoppingListSrv.onAddItemToList(itemToAdd);
  }
  
}
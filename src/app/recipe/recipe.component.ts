import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // if (this.dS.firstLoad) {
    //   console.log("Recipes is being loaded");
    //   this.dS.fetchRecipes().subscribe();
    //   this.dS.firstLoad = false;
    // }
  }

}

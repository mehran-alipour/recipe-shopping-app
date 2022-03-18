import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { AlertComponent } from "./alert/alert.component";
import { DropdownDirective } from "./dropdown.directive";
import { LoadignSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { PlaceholderDirective } from "./placeholder/plaholder.directive";

@NgModule({
  declarations: [
    AlertComponent,
    LoadignSpinnerComponent,
    PlaceholderDirective,
    DropdownDirective
  ],
  imports:[
    CommonModule
  ],
  exports:[
    AlertComponent,
    LoadignSpinnerComponent,
    PlaceholderDirective,
    DropdownDirective,
    CommonModule
  ],
  entryComponents: [
    AlertComponent
  ]
})
export class SharedModule {}
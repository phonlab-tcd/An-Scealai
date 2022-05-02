import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridSpinnerComponent } from './grid-spinner/grid-spinner.component';

@NgModule({
  declarations: [
    GridSpinnerComponent,
  ],
  exports: [
    GridSpinnerComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class SpinnerModule { }

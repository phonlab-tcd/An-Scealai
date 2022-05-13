import { NgModule } from '@angular/core';
import { RegisterComponent } from 'register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
  ],
  declarations: [
    RegisterComponent,
  ],
})
export class RegisterModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditStoryComponent } from "./edit-story/component";

const routes: Routes = [{path: "edit-story/:id", pathMatch: "full", component: EditStoryComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditStoryPageRoutingModule { }

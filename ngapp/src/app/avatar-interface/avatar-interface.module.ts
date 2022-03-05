import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from './components/page/page.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { TextBoxComponent } from './components/text-box/text-box.component';
import { AvatarClassroomComponent } from './components/avatar-classroom/avatar-classroom.component';
import { EnterMessageComponent } from './components/enter-message/enter-message.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [
    PageComponent,
    AvatarComponent,
    TextBoxComponent,
    AvatarClassroomComponent,
    EnterMessageComponent
  ],
  imports: [
    FormsModule,
    NgbModule,
    CommonModule
  ],
  exports: [
    AvatarClassroomComponent
  ]
})
export class AvatarInterfaceModule { }

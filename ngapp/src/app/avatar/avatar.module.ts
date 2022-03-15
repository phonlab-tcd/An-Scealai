import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageComponent } from './components/page/page.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { TextBoxComponent } from './components/text-box/text-box.component';
import { AvatarClassroomComponent } from './components/avatar-classroom/avatar-classroom.component';
import { EnterMessageComponent } from './components/enter-message/enter-message.component';

@NgModule({
  declarations: [
    PageComponent,
    AvatarComponent,
    TextBoxComponent,
    AvatarClassroomComponent,
    EnterMessageComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PageComponent,
    AvatarComponent,
    TextBoxComponent,
    AvatarClassroomComponent,
    EnterMessageComponent
  ]
})
export class AvatarModule { }

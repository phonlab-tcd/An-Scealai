import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TranslationService } from 'app/core/services/translation.service';
import { AuthenticationService } from 'app/core/services/authentication.service';

import { firstValueFrom } from "rxjs";
import { User } from "app/core/models/user";
import { UserService } from "app/core/services/user.service";
//import { createClient } from "@supabase/supabase-js"
//import { Story } from "app/core/models/story";
import { DigitalReaderStory } from "app/core/models/drStory";

import { HttpClient } from "@angular/common/http";
//import { GrammarEngine } from 'lib/grammar-engine/grammar-engine';
//import { anGramadoir } from "lib/grammar-engine/checkers/an-gramadoir";
//import { CHECKBOXES, ERROR_TYPES, ErrorTag, GrammarChecker } from "lib/grammar-engine/types";
import { DigitalReaderStoryService } from "app/core/services/dr-story.service"

import { MatDialog, MatDialogRef } from "@angular/material/dialog";

import { objectUtil } from 'zod';

@Component({
  selector: 'app-digital-reader-library',
  templateUrl: './digital-reader-library.component.html',
  styleUrls: ['./digital-reader-library.component.scss']
})
export class DigitalReaderLibraryComponent implements OnInit {

  @Output() isFirstDrStory = new EventEmitter<boolean>();

  constructor(
    public ts : TranslationService,
    public auth: AuthenticationService,
    public userService: UserService,
    public drStoryService: DigitalReaderStoryService,
    public http: HttpClient,
    private dialog: MatDialog) {}

  async ngOnInit() {
    

  }

}

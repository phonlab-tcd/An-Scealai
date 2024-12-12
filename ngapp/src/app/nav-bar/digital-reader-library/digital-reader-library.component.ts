import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TranslationService } from 'app/core/services/translation.service';
import { AuthenticationService, UserDetails } from 'app/core/services/authentication.service';

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
import { DigitalReaderStoryService } from "app/core/services/dr-story.service";

import { MatDialog, MatDialogRef } from "@angular/material/dialog";

import { objectUtil } from 'zod';

import config from '../anScealaiStoryCollectionsConf'

@Component({
  selector: 'app-digital-reader-library',
  templateUrl: './digital-reader-library.component.html',
  styleUrls: ['./digital-reader-library.component.scss']
})
export class DigitalReaderLibraryComponent implements OnInit {

  public anScealaiVerifiedDRStories:DigitalReaderStory[] = []
  public publicDRStories:DigitalReaderStory[] = []
  public currUsersDRStories:DigitalReaderStory[] = []
  
  public collections:Array<Object> = []

  public userDetails:any;

  constructor(
    public ts : TranslationService,
    public auth: AuthenticationService,
    public userService: UserService,
    public drStoryService: DigitalReaderStoryService,
    public http: HttpClient) {}

  async ngOnInit() {
    this.userDetails = this.auth.getUserDetails()
    console.log(this.userDetails)

    for (let collectionName of config.adminStoryCollectionOpts) {
      const collectionContent = await firstValueFrom(this.drStoryService.getAnScealaiVerifiedCollection(collectionName))
      console.log(collectionContent)
      this.collections.push({
        name: collectionName,
        content: collectionContent
      })
    }
    const collectionName = 'other_stories'
    const collectionContent = await firstValueFrom(this.drStoryService.getAnScealaiVerifiedCollection(collectionName))
    this.collections.push({
      name: collectionName,
      content: collectionContent
    })
    console.log(this.collections[0])

    /*this.anScealaiVerifiedDRStories = await firstValueFrom(this.drStoryService.getAllAnScealaiVerifiedDRStories())
    console.log(this.anScealaiVerifiedDRStories)*/

    this.publicDRStories = await firstValueFrom(this.drStoryService.getAllPublicDRStories())
    console.log(this.publicDRStories)

    this.currUsersDRStories = await firstValueFrom(this.drStoryService.getDRStoriesForLoggedInUser())
    console.log(this.currUsersDRStories)
    
  }

}

import { Component, OnInit, ViewChild } from "@angular/core";
import { AuthenticationService } from "app/core/services/authentication.service";
import { HttpClient } from "@angular/common/http";
import config from "../../../abairconfig";
import { TranslationService } from "app/core/services/translation.service";
import { MatTableDataSource } from "@angular/material/table";
import { PromptData, PromptDataTableComponent, } from "./prompt-data-table/prompt-data-table.component";
import { POSData, PosDataTableComponent, } from "./pos-data-table/pos-data-table.component";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-add-content",
  templateUrl: "./add-content.component.html",
  styleUrls: ["./add-content.component.scss"],
})
export class AddContentComponent implements OnInit {
  selectedContent: string = "";
  selectedPOS: string = "";
  promptText: string = "";
  posInput: string = "";
  selectedPromptGenerator: string = "";
  selectedDialect: string = "";
  selectedLevel: string = "";
  selectedCharacter: string = "";
  selectedSetting: string = "";
  selectedTheme: string = "";
  errorMessages: string[] = [];

  posDataSource: MatTableDataSource<POSData>;
  promptDataSource: MatTableDataSource<PromptData>;

  @ViewChild("promptDataTable") promptDataTable: PromptDataTableComponent;
  @ViewChild("posDataTable") posDataTable: PosDataTableComponent;

  constructor(
    private auth: AuthenticationService,
    private http: HttpClient,
    public ts: TranslationService
  ) {}

  ngOnInit(): void {
    this.getData("partOfSpeech");
    this.getData("prompt");
  }

  /**
   * Get prompt data from the DB based on content type
   * @param type partOfSpeech or prompt
   */
  getData(type: string) {
    const headers = { Authorization: "Bearer " + this.auth.getToken() };
    this.http .get<any>(config.baseurl + "prompt/getData/" + type, { headers }) .subscribe({
      next: (data) => {
        type == "partOfSpeech"
          ? (this.posDataSource = new MatTableDataSource(data))
          : (this.promptDataSource = new MatTableDataSource(data));
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**
   * Add any filled-in POS information to the DB
   */
  async addPOSContent() {
    this.errorMessages = [];
    if (!this.selectedPOS || !this.posInput) {
      this.errorMessages.push("Please fill in all information");
      return;
    }
    const headers = { Authorization: "Bearer " + this.auth.getToken() };
    const body = {
      type: this.selectedContent,
      partOfSpeechData: {
        partOfSpeech: this.selectedPOS,
      },
    };

    let entries = this.posInput.split(/\r?\n/);
    console.log(entries);
    for (let entry of entries) {
      if (entry.length > 0) {
        let [word, translation] = entry.split(":");
        body.partOfSpeechData["word"] = word.trim();
        body.partOfSpeechData["translation"] = translation.trim();
        try {
          await firstValueFrom( this.http.post<any>(config.baseurl + "prompt/addContent/", body, { headers, }));
        } catch (error) {
          console.log(error.error);
          this.errorMessages.push( `Entry already exists: ${JSON.stringify(error.error.data)} ` );
        }
      }
    }

    this.selectedPOS = "";
    this.posInput = "";
    this.getData("partOfSpeech");
  }

  /**
   * Add any filled-in prompt content to the DB if it doens't already exist
   */
  async addPromptContent() {
    this.errorMessages = [];
    if (!this.selectedPromptGenerator) {
      this.errorMessages.push("Please select a generator");
      console.log(this.errorMessages);
      return;
    }
    if ( this.selectedPromptGenerator == "proverb" && (!this.selectedDialect || !this.promptText) ) {
      this.errorMessages.push("Missing information");
      return;
    }
    if ( this.selectedPromptGenerator == "exam" && (!this.selectedLevel || !this.promptText) ) {
      this.errorMessages.push("Missing information");
      return;
    }
    if ( this.selectedPromptGenerator == "combination" && (!this.selectedLevel || !this.selectedCharacter || !this.selectedSetting || !this.selectedTheme) ) {
      this.errorMessages.push("Missing information");
      return;
    }

    const headers = { Authorization: "Bearer " + this.auth.getToken() };
    const body = {
      type: this.selectedContent,
      prompt: {
        topic: this.selectedPromptGenerator,
      },
    };

    if (this.selectedDialect) body.prompt["dialect"] = this.selectedDialect;
    if (this.selectedLevel) body.prompt["level"] = this.selectedLevel;

    if (this.promptText) {
      let prompts = this.promptText.split(/\r?\n/);
      for (let prompt of prompts) {
        if (prompt.length > 0) {
          body.prompt["text"] = prompt;
          try {
            await firstValueFrom( this.http.post<any>(config.baseurl + "prompt/addContent/", body, { headers, }) );
          } catch (error) {
            console.log(error.error);
            this.errorMessages.push( `Entry already exists: ${JSON.stringify(error.error.data)} ` );
          }
        }
      }
    } else {
      body.prompt["combinationData"] = {};
      if (this.selectedCharacter) body.prompt["combinationData"]["character"] = this.selectedCharacter;
      if (this.selectedSetting) body.prompt["combinationData"]["setting"] = this.selectedSetting;
      if (this.selectedTheme) body.prompt["combinationData"]["theme"] = this.selectedTheme;
      try {
        await firstValueFrom( this.http.post<any>(config.baseurl + "prompt/addContent/", body, { headers, }) );
      } catch (error) {
        console.log(error.error);
        this.errorMessages.push( `Entry already exists: ${JSON.stringify(error.error.data)} ` );
      }
    }

    if (this.errorMessages.length == 0) {
      this.selectedPromptGenerator = "";
      this.promptText = "";
      this.selectedDialect = "";
      this.selectedLevel = "";
      this.selectedCharacter = "";
      this.selectedSetting = "";
      this.selectedTheme = "";
      this.getData("prompt");
    }
  }

  /**
   * Toggle the selected data table on and off
   * @param type type of data to display: pos or prompt
   */
  toggleTable(type: string) {
    if (type == "pos") {
      this.posDataTable.hideTable = !this.posDataTable.hideTable;
    } else {
      this.promptDataTable.hideTable = !this.promptDataTable.hideTable;
    }
  }
}
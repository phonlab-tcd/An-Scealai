import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "app/authentication.service";
import { HttpClient } from "@angular/common/http";
import config from "../../../abairconfig";
import { TranslationService } from "../../translation.service";

@Component({
  selector: "app-add-content",
  templateUrl: "./add-content.component.html",
  styleUrls: ["./add-content.component.scss"],
})
export class AddContentComponent implements OnInit {
  selectedContent: string = "";
  selectedPOS: string = "";
  promptText: string = "";
  posWord: string = "";
  posTranslation: string = "";
  selectedPromptGenerator: string = "";
  selectedDialect: string = "";
  selectedLevel: string = "";
  selectedCharacter: string = "";
  selectedSetting: string = "";
  selectedTheme: string = "";
  errorMessage: string = "";
  posTableColumns: string[] = ["pos", "word", "translation", "date"];
  promptTableColumns: string[] = ["topic", "level", "dialect", "text", "date"];
  posDataSource;
  promptDataSource;
  showPosData: boolean = false;
  showPromptData: boolean = false;

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
        type == "partOfSpeech" ? (this.posDataSource = data) : (this.promptDataSource = data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**
   * Add any filled-in POS information to the DB
   */
  addPOSContent() {
    if (!this.selectedPOS || !this.posWord || !this.posTranslation) {
      this.errorMessage = "Please fill in all information";
      return;
    }
    const headers = { Authorization: "Bearer " + this.auth.getToken() };
    const body = {
      type: this.selectedContent,
      partOfSpeechData: {
        partOfSpeech: this.selectedPOS,
        word: this.posWord,
        translation: this.posTranslation,
      },
    };
    this.http.post<any>(config.baseurl + "prompt/addContent/", body, { headers }).subscribe({
      next: () => {
        this.selectedPOS = "";
        this.posWord = "";
        this.posTranslation = "";
        this.errorMessage = "";
        this.getData("partOfSpeech");
      },
      error: (err) => {
        this.errorMessage = "Entry already exists";
      },
    });
  }

  /**
   * Add any filled-in prompt content to the DB if it doens't already exist
   */
  addPromptContent() {
    if (!this.selectedPromptGenerator) {
      this.errorMessage = "Please select a generator";
      return;
    }
    if ( this.selectedPromptGenerator == "proverb" && (!this.selectedDialect || !this.promptText) ) {
      this.errorMessage = "Missing information";
      return;
    }
    if ( this.selectedPromptGenerator == "exam" && (!this.selectedLevel || !this.promptText) ) {
      this.errorMessage = "Missing information";
      return;
    }
    if ( this.selectedPromptGenerator == "combination" && (!this.selectedLevel || !this.selectedCharacter || !this.selectedSetting || !this.selectedTheme) ) {
      this.errorMessage = "Missing information";
      return;
    }

    const headers = { Authorization: "Bearer " + this.auth.getToken() };
    const body = {
      type: this.selectedContent,
      prompt: {
        topic: this.selectedPromptGenerator,
        combinationData: {},
      },
    };

    if (this.promptText) body.prompt["text"] = this.promptText;
    if (this.selectedDialect) body.prompt["dialect"] = this.selectedDialect;
    if (this.selectedLevel) body.prompt["level"] = this.selectedLevel;
    if (this.selectedCharacter) body.prompt.combinationData["character"] = this.selectedCharacter;
    if (this.selectedSetting) body.prompt.combinationData["setting"] = this.selectedSetting;
    if (this.selectedTheme) body.prompt.combinationData["theme"] = this.selectedTheme;

    this.http.post<any>(config.baseurl + "prompt/addContent/", body, { headers }).subscribe({
      next: () => {
        this.selectedPromptGenerator = "";
        this.promptText = "";
        this.selectedDialect = "";
        this.selectedLevel = "";
        this.errorMessage = "";
        this.selectedCharacter = "";
        this.selectedSetting = "";
        this.selectedTheme = "";
        this.getData("prompt");
      },
      error: (err) => {
        this.errorMessage = "Entry already exists";
      },
    });
  }
}

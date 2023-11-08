import { Component } from "@angular/core";

@Component({
  selector: "app-add-prompt-data",
  templateUrl: "./add-prompt-data.component.html",
  styleUrls: ["./add-prompt-data.component.scss"],
})
export class AddPromptDataComponent {
  selectedPromptGenerator: string = "general";

  constructor() {}
}

import { Component } from "@angular/core";

@Component({
  selector: "app-add-content",
  templateUrl: "./add-content.component.html",
  styleUrls: ["./add-content.component.scss"],
})
export class AddContentComponent {
  selectedPromptGenerator: string = "general";

  constructor() {}
}

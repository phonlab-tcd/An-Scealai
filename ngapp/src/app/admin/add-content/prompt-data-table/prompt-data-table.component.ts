import { HttpClient } from "@angular/common/http";
import { Component, ViewChild, Input } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { TranslationService } from "app/core/services/translation.service";
import config from "../../../../abairconfig";
import { BasicDialogComponent } from "app/dialogs/basic-dialog/basic-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { PromptService } from "app/core/services/prompt.service";
import {} from "app/core/models/prompt";
import { AuthenticationService } from "app/core/services/authentication.service";

// all possible values for prompt data
export interface PromptDataRow {
  _id?: string | null;
  isSelected: boolean;
  isEdit: boolean;
  prompt?: string;
  word?: string;
  translation?: string;
  level?: string;
  dialect?: string;
  storyTitle?: string;
  type?: string;
  partOfSpeech?: string;
  lastUpdated?: Date;
}

// all possible table columns for prompt data, includes data type and specifications (order is important)
const PromptDataColumns = [
  {
    key: "isSelected",
    type: "isSelected",
    label: "",
  },
  {
    key: "prompt",
    type: "text",
    label: "Prompt Text",
    required: true,
  },
  {
    key: "word",
    type: "text",
    label: "Word",
    required: false,
  },
  {
    key: "translation",
    type: "text",
    label: "Translation",
    required: true,
  },
  {
    key: "level",
    type: "text",
    label: "Level",
    required: false,
  },
  {
    key: "dialect",
    type: "text",
    label: "Dialect",
    required: false,
  },
  {
    key: "storyTitle",
    type: "text",
    label: "Story Title",
    required: false,
  },
  {
    key: "type",
    type: "text",
    label: "Type",
    required: false,
  },
  {
    key: "partOfSpeech",
    type: "text",
    label: "Part of Speech",
    required: false,
  },
  {
    key: "lastUpdated",
    type: "date",
    label: "Last Updated",
    required: true,
  },
  {
    key: "isEdit",
    type: "isEdit",
    label: "",
  },
];

@Component({
  selector: "app-prompt-data-table",
  templateUrl: "./prompt-data-table.component.html",
  styleUrls: ["./prompt-data-table.component.scss"],
})
export class PromptDataTableComponent {
  @Input("selectedPromptGenerator") selectedPromptGenerator: string;
  displayedColumns = ["isSelected"];
  columnsSchema: any = PromptDataColumns;
  dataSource = new MatTableDataSource<PromptDataRow>();
  valid: any = {};
  useMultipleRowInput: boolean = false;
  multipleRowData: string = "";
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private auth: AuthenticationService,
    private http: HttpClient,
    private promptService: PromptService,
    public ts: TranslationService,
    private dialog: MatDialog
  ) {}

  /**
   * Get prompt data based on selected generator in parent component
   * Reset the table columns
   */
  ngOnChanges() {
    if (this.selectedPromptGenerator) {
      this.displayedColumns = ["isSelected"]; // we want this to be the first column
      this.getPromptData();
    }
  }

  /**
   * Get prompt data from the DB and set the table columns/data
   */
  getPromptData() {
    this.promptService.getPromptDataRows(this.selectedPromptGenerator).subscribe({
      next: (data: any) => {
        this.dataSource.data = data;
        Object.keys(this.dataSource.data[0]).forEach((key) => {
          if (key != "_id" && !this.displayedColumns.includes(key)) {
            this.displayedColumns.push(key); // set table columns to those that match the data
          }
        });
        this.displayedColumns.push("isEdit"); // we want this to be the last column
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => { alert(err.error); },
    });
  }

  /**
   * Save the contents of either a new row or edited row to the DB
   * @param row row in the table
   */
  saveRow(row: PromptDataRow) {
    if (!row._id) {
      // new row
      this.promptService.addPromptDataRow(row, this.selectedPromptGenerator).subscribe({
        next: (newPrompt: PromptDataRow) => {
          row._id = newPrompt._id;
          row.lastUpdated = newPrompt.lastUpdated;
          row.isEdit = false;
          this.multipleRowData = "";
        },
        error: (err) => { alert(err.error); },
      });
    } else {
      // edited row
      this.promptService.updatePromptDataRow(row, this.selectedPromptGenerator).subscribe({
        next: () => { row.isEdit = false; },
        error: (err) => { alert(err.error); },
      });
    }
  }

  /**
   * Create a new blank row in the table with initial values
   */
  addRow() {
    const newRow: PromptDataRow = {
      isEdit: true,
      isSelected: false,
    };
    this.dataSource.data = [newRow, ...this.dataSource.data];
  }

  /**
   * Remove new row added to table
   * @param newRow New row added to table
   */
  cancelAddRow(newRow: PromptDataRow) {
    if (Object.keys(newRow).length == 2)
    this.dataSource.data = this.dataSource.data.filter(item => item !== newRow);
    else newRow.isEdit = false;
  }

  /**
   * This function add multiple rows to the DB at once
   * Split textarea string into array of prompts with new line delimiter
   * Split each prompt into sections with semicolon delimiter
   * Use column names to label key/value pairs for each prompt section
   * Save each prompt seprately to the DB
   */
  addMultipleRows() {
    const textAreaInput = this.multipleRowData.split(/\r?\n/);
    for (const prompt of textAreaInput) {
      const promptParts = prompt.split(";");
      if (promptParts.length != this.displayedColumns.length - 3) {
        alert(`Incorrect format: ${promptParts}`);
        continue;
      }
      const newRow: PromptDataRow = {
        isEdit: true,
        isSelected: false,
      };
      for (let i = 0; i < promptParts.length; i++) {
        // add new key/value pair for each column data type, excluding 'isSelected' etc.
        const columnName = this.displayedColumns[i + 1];
        newRow[columnName] = promptParts[i].trim();
      }
      this.dataSource.data = [newRow, ...this.dataSource.data];
      this.saveRow(newRow);
    }
  }

  /**
   * Delete the prompt from the DB and remove row from table
   * @param id id of row to delete
   */
  deleteRow(id: string) {
    this.promptService.deletePromptDataRow(id, this.selectedPromptGenerator).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter( (p: PromptDataRow) => p._id !== id );
      },
      error: (err) => { alert(err.error); },
    });
  }

  /**
   * Delete the selected prompts from the DB and remove rows from table
   */
  deleteSelectedRows() {
    const prompts = this.dataSource.data.filter( (p: PromptDataRow) => p.isSelected );
    this.dialog.open(BasicDialogComponent, {
      data: {
        title: "Delete rows",
        message: "Are you sure you want to delete these rows",
        confirmText: this.ts.l.yes,
        cancelText: this.ts.l.no,
      },
      width: "50vw",
    })
    .afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.promptService.deletePromptDataRows(prompts, this.selectedPromptGenerator).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter( (p: PromptDataRow) => !p.isSelected );
          },
          error: (err) => {alert(err.error)}
        })
      }
    });
  }

  /**
   * Make sure table input is of the right data type
   */
  inputHandler(e: any, id: number, key: string) {
    if (!this.valid[id]) {
      this.valid[id] = {};
    }
    this.valid[id][key] = e.target.validity.valid;
  }

  /**
   * Disable the save button if error in data input
   */
  disableSubmit(id: number) {
    if (this.valid[id]) {
      return Object.values(this.valid[id]).some((item) => item === false);
    }
    return false;
  }

  /**
   * Set all rows of the table to be selected
   * @param event click the select checkbox
   */
  selectAll(event: MatCheckboxChange) {
    this.dataSource.data = this.dataSource.data.map((item) => (
      { ...item, isSelected: event.checked }
    ));
  }

  /**
   * Check if all the table rows have been selected
   * @returns true if all elements selected, otherwise false
   */
  isAllSelected(): boolean {
    return this.dataSource.data.every((item) => item.isSelected);
  }

  /**
   * Check if at least one row in the table has been selected
   * @returns true if at least one row is selected
   */
  isAnySelected(): boolean {
    return this.dataSource.data.some((item) => item.isSelected);
  }


  // ngOnInit(): void {}

  // ngOnChanges() {
  //   if (this.data) {
  //     this.data.paginator = this.paginator;
  //     this.data.sort = this.sort;
  //   }
  // }

  // /**
  //  * Filter the rows in the table by the search text
  //  * @param event user search text
  //  */
  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.data.filter = filterValue.trim().toLowerCase();

  //   if (this.data.paginator) {
  //     this.data.paginator.firstPage();
  //   }
  // }
}

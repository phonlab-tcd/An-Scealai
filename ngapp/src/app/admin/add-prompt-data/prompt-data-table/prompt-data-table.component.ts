import { Component, ViewChild, Input } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { TranslationService } from "app/core/services/translation.service";
import { BasicDialogComponent } from "app/dialogs/basic-dialog/basic-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { PromptService } from "app/core/services/prompt.service";
import { PromptData, PromptDataColumns } from "app/core/models/prompt";

@Component({
  selector: "app-prompt-data-table",
  templateUrl: "./prompt-data-table.component.html",
  styleUrls: ["./prompt-data-table.component.scss"],
})
export class PromptDataTableComponent {
  @Input("selectedPromptGenerator") selectedPromptGenerator: string;
  displayedColumns = ["isSelected"];
  columnsSchema: any = PromptDataColumns;
  dataSource = new MatTableDataSource<PromptData>();
  valid: any = {};
  useMultipleRowInput: boolean = false;
  multipleRowData: string = "";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private promptService: PromptService,
    public ts: TranslationService,
    private dialog: MatDialog
  ) {}

  /**
   * Get prompt data based on selected generator in parent component
   */
  ngOnChanges() {
    if (this.selectedPromptGenerator) {
      this.getPromptData();
    }
  }

  /**
   * Get prompt data from the DB and set the table columns/data
   */
  getPromptData() {
    this.promptService.getPromptDatas(this.selectedPromptGenerator).subscribe({
      next: (data: PromptData[]) => {
        if (data.length > 0) {
          this.dataSource.data = data;
          this.displayedColumns = ["isSelected"]; // we want this to be the first column
          Object.keys(this.dataSource.data[0]).forEach((key) => {
            if (key != "_id" && !this.displayedColumns.includes(key)) {
              this.displayedColumns.push(key); // set table columns to key values in the data
            }
          });
          this.displayedColumns.push("isEdit"); // we want this to be the last column
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        else {
          this.displayedColumns = PromptDataColumns.map((col) => col.key);
          this.dataSource = new MatTableDataSource<PromptData>();
        }
      },
      error: (err) => { alert(err.error); },
    });
  }

  /**
   * Save the contents of either a new row or edited row to the DB
   * @param row row in the table
   */
  saveRow(row: PromptData) {
    if (!row._id) {
      // new row
      this.promptService.addPromptData(row, this.selectedPromptGenerator).subscribe({
        next: (newPrompt: PromptData) => {
          row._id = newPrompt._id;
          row.updatedAt = newPrompt.updatedAt;
          row.isEdit = false;
          this.multipleRowData = "";
        },
        error: (err) => { alert(err.error); },
      });
    } else {
      // edited row
      this.promptService.updatePromptData(row, this.selectedPromptGenerator).subscribe({
        next: () => { row.isEdit = false; },
        error: (err) => { alert(err.error); },
      });
    }
  }

  /**
   * Create a new blank row in the table with initial values
   */
  addRow() {
    const newRow: PromptData = {
      isEdit: true,
      isSelected: false,
    };
    this.dataSource.data = [newRow, ...this.dataSource.data];
  }

  /**
   * Remove new row added to table if no data filled out
   * @param newRow New row added to table
   */
  cancelAddRow(newRow: PromptData) {
    if (Object.keys(newRow).length == 2)
      this.dataSource.data = this.dataSource.data.filter(item => item !== newRow);
    else 
      newRow.isEdit = false;
  }

  /**
   * This function add multiple rows to the DB at once
   * Split textarea string into array of prompts with new line delimiter
   * Split each prompt into sections with semicolon delimiter (i.e. for each column)
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
      const newRow: PromptData = {
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
    this.promptService.deletePromptData(id, this.selectedPromptGenerator).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter( (p: PromptData) => p._id !== id );
      },
      error: (err) => { alert(err.error); },
    });
  }

  /**
   * Delete the selected prompts from the DB and remove rows from table
   */
  deleteSelectedRows() {
    const prompts = this.dataSource.data.filter( (p: PromptData) => p.isSelected );
    if (prompts.length === 0) { alert('Select the rows you want to delete'); return; }
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
        this.promptService.deletePromptDatas(prompts, this.selectedPromptGenerator).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter( (p: PromptData) => !p.isSelected );
          },
          error: (err) => {alert(err.error)}
        })
      }
    });
  }

  /**
   * Make sure table input is of the right data type
   * @param e typing event when adding new column data
   * @param id id of new row
   * @param key name of column data is being added to
   */
  inputHandler(e: any, id: number, key: string) {
    if (!this.valid[id]) {
      this.valid[id] = {};
    }
    this.valid[id][key] = e.target.validity.valid;
  }

  /**
   * Disable the save button if error in data input
   * @param id id of row being edited
   * @returns false if the data is of correct format
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

  /**
   * Filter the table data from the search input
   * @param event search bar input
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

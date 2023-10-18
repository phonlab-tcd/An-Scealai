import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

export interface PromptData {
  type: string;
  level: string;
  dialect: string;
  text: string;
  lastUpdated: Date;
}

@Component({
  selector: "app-prompt-data-table",
  templateUrl: "./prompt-data-table.component.html",
  styleUrls: ["./prompt-data-table.component.scss"],
})
export class PromptDataTableComponent implements OnInit {
  promptTableColumns: string[] = ["topic", "level", "dialect", "text", "date"];

  @Input("data") data: MatTableDataSource<PromptData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  hideTable: boolean = true;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.data) {
      this.data.paginator = this.paginator;
      this.data.sort = this.sort;
    }
  }

  /**
   * Filter the rows in the table by the search text
   * @param event user search text
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.data.filter = filterValue.trim().toLowerCase();

    if (this.data.paginator) {
      this.data.paginator.firstPage();
    }
  }
}

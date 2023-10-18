import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource, MatTable } from "@angular/material/table";

export interface POSData {
  partOfSpeech: string;
  word: string;
  translation: string;
  lastUpdated: Date;
}

@Component({
  selector: "app-pos-data-table",
  templateUrl: "./pos-data-table.component.html",
  styleUrls: ["./pos-data-table.component.scss"],
})
export class PosDataTableComponent implements OnInit {
  posTableColumns: string[] = ["pos", "word", "translation", "date"];

  @Input("data") data: MatTableDataSource<POSData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  hideTable: boolean = true;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.data) {
      this.data.paginator = this.paginator;
      this.data.sort = this.sort;
      console.log(this.data);
    }
  }

  /**
   * Filter the rows in the table by the search text
   * @param event user search text
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.data.filter = filterValue.trim().toLowerCase();
    console.log(this.data);

    if (this.data.paginator) {
      this.data.paginator.firstPage();
    }
  }
}

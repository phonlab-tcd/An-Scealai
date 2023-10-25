import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { AuthenticationService } from "app/core/services/authentication.service";
import { TranslationService } from "app/core/services/translation.service";
import config from "../../../../abairconfig";
import { BasicDialogComponent } from "app/dialogs/basic-dialog/basic-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { MatCheckboxChange } from '@angular/material/checkbox';
import { PromptService } from "app/core/services/prompt.service";


export interface PromptDataRow {
  _id: string | null;
  isSelected: boolean;
  isEdit: boolean;
  type: string;
  prompt: {
    topic: string;
    level: string;
    dialect: string;
    text: string;
  },
  lastUpdated: Date;
}

const PromptDataColumns = [
  {
    key: 'isSelected',
    type: 'isSelected',
    label: '',
  },
  {
    key: 'topic',
    type: 'text',
    label: 'Topic',
    required: true,
  },
  {
    key: 'text',
    type: 'text',
    label: 'Prompt Text',
    required: true,
  },
  {
    key: 'level',
    type: 'text',
    label: 'Level',
    required: false
  },
  {
    key: 'dialect',
    type: 'text',
    label: 'Dialect',
    required: false,
  },
  {
    key: 'lastUpdated',
    type: 'date',
    label: 'Last Updated',
    required: true,
  },
  {
    key: 'isEdit',
    type: 'isEdit',
    label: '',
  },
];

@Component({
  selector: "app-prompt-data-table",
  templateUrl: "./prompt-data-table.component.html",
  styleUrls: ["./prompt-data-table.component.scss"],
})
export class PromptDataTableComponent {

  displayedColumns: string[] = PromptDataColumns.map((col) => col.key)
  columnsSchema: any = PromptDataColumns
  dataSource = new MatTableDataSource<PromptDataRow>()
  valid: any = {}
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private auth: AuthenticationService,
    private http: HttpClient,
    private promptService: PromptService,
    public ts: TranslationService,
    private dialog: MatDialog,) {}

  ngOnInit() {
    // TODO: udpate the following request with the get described in the example service class
      this.promptService.getPromptDataRows("prompt").subscribe({
        next: (data: any) => {
          console.log(data)
          const flattenedData = data.map((item: PromptDataRow) => {
              return {
                _id: item._id,
                type: item.type,
                //topic: item.prompt.topic,
                //level: item.prompt.level,
                //dialect: item.prompt.dialect,
                //text: item.prompt.text,
                lastUpdated: item.lastUpdated,
              };
            });
          this.dataSource.data = flattenedData;
          console.log(this.dataSource.data)
        },
      error: (err) => {
        console.error(err);
      }})
  
    // this.http .get<any>(config.baseurl + "prompt/getData/prompt", { headers }).subscribe({
    //   next: (data) => {
    //     const flattenedData = data.map((item: PromptDataRow) => {
    //       return {
    //         _id: item._id,
    //         type: item.type,
    //         topic: item.prompt.topic,
    //         level: item.prompt.level,
    //         dialect: item.prompt.dialect,
    //         text: item.prompt.text,
    //         lastUpdated: item.lastUpdated,
    //       };
    //     });
    //     this.dataSource.data = flattenedData;
    //     this.dataSource.paginator = this.paginator;
    //     console.log(this.dataSource.data)
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   },
    // });
  }

  editRow(row: PromptDataRow) {
    console.log(row);
    row._id = "111";
    row.isEdit = false;
    // TODO: Update the following code with the data design update
    //this.promptService.updatePrompt(row).subscribe({next: () => {row.isEdit = false}, error: () => {}})
    
    // if (row._id === null) {
    //   this.userService.addUser(row).subscribe((newUser: User) => {
    //     row._id = newUser._id
    //     row.isEdit = false
    //   })
    // } else {
    //   this.userService.updateUser(row).subscribe(() => (row.isEdit = false))
    // }
  }

  disableSubmit(id: number) {
    console.log(id);
    if (this.valid[id]) {
      return Object.values(this.valid[id]).some((item) => item === false)
    }
    return false
  }

  addRow() {
    const newRow: PromptDataRow = {
      _id: null,
      type: "",
      prompt: {
        topic: "",
        level: "",
        dialect: "",
        text: "",
      },
      lastUpdated: new Date(),
      isEdit: true,
      isSelected: false,
    }
    // insert line here to update data in the DB and then add the newly added content to table
    this.dataSource.data = [newRow, ...this.dataSource.data]
  }

  removeRow(id: string) {
    console.log(id)
    this.dataSource.data = this.dataSource.data.filter((p: PromptDataRow) => p._id !== id)
    // TODO: Add this function to the service and backend
    // this.promptService.deletePrompt(id).subscribe({next: () => {
    //   this.dataSource.data = this.dataSource.data.filter((p: PromptDataRow) => p._id !== id)
    // },
    // error: (err: Error) => {
    //   alert(err);
    // }})
  }

  removeSelectedRows() {
    const prompts = this.dataSource.data.filter((p: PromptDataRow) => p.isSelected)
    this.dialog
      .open(BasicDialogComponent, {
        data: {
          title: "Delete rows",
          message: "Are you sure you want to delete these rows",
          confirmText: this.ts.l.yes,
          cancelText: this.ts.l.no,
        },
        width: "50vw",
      })
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          console.log("Dete: ", prompts)
          this.promptService.deletePromptDataRows(prompts).subscribe(() => {
            this.dataSource.data = this.dataSource.data.filter(
              (p: PromptDataRow) => !p.isSelected,
            )
          })
        }
      })
    }

  inputHandler(e: any, id: number, key: string) {
    console.log("in input handler")
    if (!this.valid[id]) {
      this.valid[id] = {}
    }
    this.valid[id][key] = e.target.validity.valid
  }

  selectAll(event: MatCheckboxChange) {
    this.dataSource.data = this.dataSource.data.map((item) => ({
      ...item,
      isSelected: event.checked,
    }))
  }

  isAllSelected(): boolean {
    return this.dataSource.data.every((item) => item.isSelected)
  }

  isAnySelected(): boolean {
    return this.dataSource.data.some((item) => item.isSelected)
  }


  // promptTableColumns: string[] = ["topic", "level", "dialect", "text", "date"];
  // @Input("data") data: MatTableDataSource<PromptData>;
  // @ViewChild(MatSort) sort: MatSort;

  hideTable: boolean = false;


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

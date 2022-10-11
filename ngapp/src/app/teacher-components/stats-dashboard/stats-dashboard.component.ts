import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgramDistributionComponent } from 'app/story-stats/ngram-distribution/ngram-distribution/ngram-distribution.component';

@Component({
  selector: 'app-stats-dashboard',
  templateUrl: './stats-dashboard.component.html',
  styleUrls: ['./stats-dashboard.component.scss']
})
export class StatsDashboardComponent implements OnInit {

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {}

  dialogRef: MatDialogRef<unknown>;

  sampleTexts = [
    'Hello there. The cat sat on the mat.',
    'The dog sat on the frog.',
    'The frog sat on the dog'
  ];

  openModal(templateRef: TemplateRef<unknown>) {
    this.dialogRef = this.dialog.open(templateRef, {
         width: '60%',
    });

    this.dialogRef.afterClosed().subscribe(_ => {
        this.dialogRef = undefined;
    });
  }

}

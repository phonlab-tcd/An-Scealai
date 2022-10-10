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

  // @ViewChild(NgramDistributionComponent)
  // ngramDistributionComponent: NgramDistributionComponent;

  openModal(templateRef: TemplateRef<unknown>) {
    this.dialogRef = this.dialog.open(templateRef, {
         width: '60%',
    });

    this.dialogRef.afterClosed().subscribe(result => {
        this.dialogRef = undefined;
    });
  }

  toggleFullscreen(event: MouseEvent): void {

    // // Make the card fullscreen via CSS
    // const targetElem = event.target as HTMLElement;
    // const cardElem = targetElem.closest('.stats-card') as HTMLElement; // They may have clicked on a descendent of the mat card
    // const canvasElem = cardElem.querySelector('canvas');
    // const fullscreenIcon = targetElem.closest('i') as HTMLElement;
    // if (cardElem.classList.contains('stats-card-fullscreen')) {
    //   cardElem.classList.remove('stats-card-fullscreen');
    //   canvasElem.style.cssText = `width: 400px; height: 200px;`;
    //   fullscreenIcon.classList.remove('fa-compress');
    //   fullscreenIcon.classList.add('fa-expand');
    // } else {
    //   cardElem.classList.add('stats-card-fullscreen');
    //   canvasElem.width = cardElem.offsetWidth;
    //   canvasElem.height = 400;
    //   canvasElem.style.cssText = `width: ${cardElem.offsetWidth}px;`;
    //   fullscreenIcon.classList.remove('fa-expand');
    //   fullscreenIcon.classList.add('fa-compress');
    // }
  }

}

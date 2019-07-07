import { Component, OnInit } from '@angular/core';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})
export class TeachersComponent implements OnInit {

  teacherCode : String;
  copiedTextClass : String = "hidden";

  constructor() { }

  ngOnInit() {
  }

  generateCode() {
    this.teacherCode = uuid();
  }

  copyToClipboard() {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (this.teacherCode.toString()));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
    this.copiedTextClass = "visible";
    setTimeout(() => this.copiedTextClass = "hidden", 1000);
    
  }

}

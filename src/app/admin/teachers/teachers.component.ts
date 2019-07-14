import { Component, OnInit } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { HttpClient } from '@angular/common/http';
import { identifierModuleUrl } from '@angular/compiler';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})

export class TeachersComponent implements OnInit {

  teacherCode : String;
  activeTeacherCodes : TeacherCodeDetails[];
  idOfCodeToDelete : String;

  copiedTextClass : String = "hidden";
  modalClass : String = "hidden";

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getActiveTeacherCodes();
  }

  generateCode() {
    this.teacherCode = uuid();
    const teacherCodeObj = {
      code : this.teacherCode,
    };
    console.log(teacherCodeObj);
    this.http.post('http://localhost:4000/teacherCode/create', teacherCodeObj)
      .subscribe(res => {
        console.log("Teacher code created!", res)
        this.getActiveTeacherCodes();
      });
  }

  getActiveTeacherCodes() {
    this.http.get('http://localhost:4000/teacherCode/activeCodes').subscribe((res: TeacherCodeDetails[]) => {
      this.activeTeacherCodes = res;
      console.log("teacher codes", this.activeTeacherCodes);
    });
  }

  deleteTeacherCode() {
    if(this.idOfCodeToDelete != null) {
      console.log(this.idOfCodeToDelete);
      this.http.get('http://localhost:4000/teacherCode/delete/' + this.idOfCodeToDelete).subscribe((res) => {
      this.getActiveTeacherCodes();
      this.hideModal();
    });
    } else {
      console.log("Error, code id not found.");
    }
    
  }

  copyToClipboard() {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (this.teacherCode.toString()));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
    this.copiedTextClass = "visible";
    setTimeout(() => this.copiedTextClass = "hiddenFade", 1000);
  }

  showModal(_id : String) {
    this.modalClass = "visibleFade";
    this.idOfCodeToDelete = _id;
  }

  hideModal() {
    this.modalClass = "hiddenFade";
  }

}

class TeacherCodeDetails {
    _id: String;
    code: String;
}
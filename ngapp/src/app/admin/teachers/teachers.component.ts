import { Component, OnInit } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
// import identifierModuleUrl from '@angular/compiler';
import { TranslationService } from 'app/core/services/translation.service';
import config from 'abairconfig';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BasicDialogComponent } from '../../dialogs/basic-dialog/basic-dialog.component';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss']
})

export class TeachersComponent implements OnInit {

  teacherCode : String;
  activeTeacherCodes : TeacherCodeDetails[];
  codeToDelete : String;
  teachers : Object[];
  copiedTextClass : String = "hidden";
  baseUrl: string = config.baseurl;
  dialogRef: MatDialogRef<unknown>;

  constructor(private http: HttpClient, private router: Router, public ts: TranslationService, private dialog: MatDialog) { }

  ngOnInit() {
    this.getActiveTeacherCodes();
    this.getTeachers();
  }

  generateCode() {
    this.teacherCode = uuid();
    const teacherCodeObj = {
      code : this.teacherCode,
    };
    this.http.post(this.baseUrl + 'teacherCode/create', teacherCodeObj)
      .subscribe(res => {
        this.getActiveTeacherCodes();
      });
  }

  getActiveTeacherCodes() {
    this.http.get(this.baseUrl + 'teacherCode/activeCodes').subscribe((res: TeacherCodeDetails[]) => {
      this.activeTeacherCodes = res;
    });
  }

  getTeachers() {
    this.http.get(this.baseUrl + 'user/teachers').subscribe((res: Object[]) => {
      this.teachers = res;
    }); 
  }

  deleteTeacherCode() {
    if(this.codeToDelete != null) {
      this.http.get(this.baseUrl + 'teacherCode/delete/' + this.codeToDelete).subscribe((res) => {
        this.getActiveTeacherCodes();
      });
    } else {
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
  
  openDeleteCodeDialog(code: String) {
    this.codeToDelete = code;
    this.dialogRef = this.dialog.open(BasicDialogComponent, {
      data: {
        title: this.ts.l.sure_you_want_to_delete_code,
        confirmText: this.ts.l.delete,
        cancelText: this.ts.l.cancel
      },
      width: '50%',
    });
    
    this.dialogRef.afterClosed().subscribe( (res) => {
        this.dialogRef = undefined;
        if(res) {
          this.deleteTeacherCode()
        }
    });
  }

  goToUser(userId) {
    this.router.navigateByUrl('admin/user/' + userId.toString());
  }

}

class TeacherCodeDetails {
    _id: String;
    code: String;
}

import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'app/translation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-dictgloss',
  templateUrl: './teacher-dictgloss.component.html',
  styleUrls: ['./teacher-dictgloss.component.scss']
})
export class TeacherDictglossComponent implements OnInit {

  constructor(
    public ts: TranslationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  sendDictgloss(){
    
  }

  goToDashboard(){
    this.router.navigateByUrl('teacher/dashboard');
  }

}

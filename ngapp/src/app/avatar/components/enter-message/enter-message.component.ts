import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-enter-message',
  templateUrl: './enter-message.component.html',
  styleUrls: ['./enter-message.component.css']
})
export class EnterMessageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  removeModal = () => {
    let modal = document.getElementById('enterModal')
    modal.style.display = "none";
  }

}

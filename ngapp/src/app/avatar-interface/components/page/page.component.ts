import { Component, OnInit } from '@angular/core';
import { sentences } from '../../data/sentences'

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})

export class PageComponent implements OnInit {

  sentences = sentences;
  constructor() { }

  ngOnInit(): void {
    if (sentences.length === 0) {
      sentences.push({
        id: 0,
        text: "",
        errors: null,
        focussed: false,
        readyToSpeak: false
      })

    }
    setTimeout(function(){
      let firstTextBox = document.getElementById('sentence_0')
      let storyBoxContainer: HTMLElement = document.getElementById('storyBoxContainer')
      storyBoxContainer.addEventListener('click', () => {
        if (sentences.length === 1) {
          firstTextBox.focus()
        } 
      })
      firstTextBox.focus()

    }, 100)
  }
}

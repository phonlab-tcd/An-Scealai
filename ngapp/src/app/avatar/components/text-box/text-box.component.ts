import { Component, OnInit, Input } from '@angular/core';
import { sentences, Sentence, /*focussedSentence*/ } from '../../data/sentences'
import { TtsService } from '../../services/tts.service'
import { GramadoirService } from '../../services/gramadoir.service'
import { prepareAudioWithGramadoirCheck, prepareAudioForHelp } from './utils/prepareAudio.js'
import { avatarStates, updateAvatarState } from '../../animation/config'
import { avatarControl } from '../../animation/control'
import { flashAvatar } from '../../animation/flash'

@Component({
  selector: 'app-text-box',
  templateUrl: './text-box.component.html',
  styleUrls: ['./text-box.component.css']
})
export class TextBoxComponent implements OnInit {

  @Input() sentence!: Sentence;
  audioID: string
  helpAudioID: string
  constructor(
    private ttsService:TtsService,
    private gramadoirService:GramadoirService,
  ) { 
  }

  ngOnInit(): void {
    this.audioID = "sentAudio" + this.sentence.id
    this.helpAudioID = "helpAudio" + this.sentence.id
  }

  sentenceEndings = ['.', '?', '!']
  onKeyPress = evt => {

    // Enter causes the text to be synthesised and move the cursor to the next line
    if (evt.key === "Enter") {
      evt.preventDefault()
      this.enterSentence()

    // If the user types a . ! or ? at the end of the sentence, we treat it like and Enter
    } else if (this.sentenceEndings.includes(evt.key)) {

      // If there is already a . ! or ? at the end of the sentence, we don't want one more
      if (this.sentenceEndings.includes(this.sentence.text[this.sentence.text.length-1])) {
        evt.preventDefault()
      }
      setTimeout( () => {this.enterSentence() }, 100) // allow to register so changeSentence works
    } else {
      // on any other key, it will change the sentence and need to be synthesised again when Entered
      if (this.sentence.readyToSpeak) {
          this.sentence.readyToSpeak = false;
          this.sentence.readyToSpeakHelp = false;
      }
    }

  }

  clickSentence = () => {
    if ( !(avatarStates.speaking && avatarStates.activeSentenceID === this.sentence.id )) {
      //reset all sentences so none highlighted
      sentences.map(s => s.readyToSpeak = false)
      updateAvatarState('activeSentenceID', this.sentence.id)
      this.sentence.focussed = true;

      // only speak a sentence on the following conditions when clicked
      if (this.sentence.audioData !== undefined && !this.sentence.editted && !avatarStates.speaking) {
        this.sentence.readyToSpeak = true
        if (this.sentence.audioDataHelp !== undefined) {
            this.sentence.readyToSpeakHelp = true;
        }
        avatarControl('start speaking')
      }
    }
  }

  blurSentence = () => {
    this.sentence.focussed = false;
  }

  changeSentence = () => {
    this.sentence.editted = true;
    this.sentence.readyToSpeak = false;
    this.sentence.readyToSpeakHelp = false;
  }

  arrowSentence = up => {
    console.log('this.sentence.id:', this.sentence.id)
    this.sentence.focussed = false;
    this.sentence.readyToSpeak = false;
    this.sentence.readyToSpeakHelp = false;
    let nextSentenceID;
    let nextSentence;
    if (up) {
      if (!this.firstSentence()) {
        nextSentenceID = this.sentence.id - 1
      }
    } else {
      if (!this.lastSentence()) {
        nextSentenceID = this.sentence.id + 1
      }
    }
    if (nextSentenceID !== undefined) {
      nextSentence = sentences.find(s => s.id === nextSentenceID)
      document.getElementById('sentence_' + nextSentenceID).focus()
      if (nextSentence.audioData !== undefined && !nextSentence.editted && !avatarStates.speaking) {
        updateAvatarState('activeSentenceID', nextSentenceID) 
        nextSentence.readyToSpeak = true
        avatarControl("start speaking")
        if (nextSentence.audioDataHelp !== undefined) {
          nextSentence.readyToSpeakHelp = true
        }
      }
    }
  }

  lastSentence = () => {
    if (this.sentence.id === sentences.length - 1) {
      return true
    } else {
      return false
    }
  }

  firstSentence = () => {
    if (this.sentence.id === 0) {
      return true
    } else {
      return false
    }
  }

  speakNow = () => {
    if (!this.sentence.awaitingTts && !this.sentence.awaitingGramadoir) {
      this.sentence.readyToSpeak = true;
      prepareAudioWithGramadoirCheck(this.sentence.id)
      avatarControl("look at camera")
    }
  }

  punct = /[()'\[\]‘’]/g
  stops = /[\.\?!]/g
  cleanTextForTTS = t => {
    let sentenceWithoutPunctuation = t.replace(this.stops, ", ")
    let sentenceWithoutStops = sentenceWithoutPunctuation.replace(this.punct, "")
    return sentenceWithoutStops
  }

  enterSentence = () => {
    // avoiding using ngModel
    this.sentence.text = document.getElementById('sentence_' + this.sentence.id).value
    if ( this.sentence.text !== "" && !avatarStates.lookingAtBoard && !avatarStates.speaking) {
      this.sentence.editted = false
      avatarControl("look at board")
      this.sentence.avatarFlashed = false;
      this.sentence.awaitingTts = true;
      this.sentence.awaitingGramadoir = true;
      sentences.map( s => s.readyToSpeak = false)
      updateAvatarState('activeSentenceID', this.sentence.id)

      this.gramadoirService.getGramadoir(this.sentence.text).subscribe((g) => {
        this.sentence['errors'] = g
        //console.log('errors:', g)
        this.sentence.awaitingTts = false;
        this.speakNow()
        if (g.length === 0) {
	   this.sentence.readyToSpeakHelp = false
            this.sentence['audioDataHelp'] = undefined
	} else {
          let helpMessage = ""
          g.forEach((e, i) => {
            helpMessage += e['errortext'] + ", " + e['msg']
            if ( i < g.length - 1 ) {
              helpMessage += ", agus, "
            }
          })
          //console.log('helpMessage:', helpMessage)
          let cleanedHelpMessage = this.cleanTextForTTS(helpMessage)
          //console.log('cleanedHelpMessage:', cleanedHelpMessage)
          this.ttsService.getTTS(cleanedHelpMessage).subscribe((htts) => {
            this.sentence['audioDataHelp'] = htts
            this.sentence.readyToSpeakHelp = true;
            prepareAudioForHelp(this.sentence.id)
			      //console.log('avatarFlashed:', this.sentence.avatarFlashed)
            if (!this.sentence.avatarFlashed && this.sentence.readyToSpeakHelp && !avatarStates.lookingAtBoard && !avatarStates.speaking) {
              flashAvatar()
              this.sentence.avatarFlashed = true;
            }
          })
        }
      })
      let cleanedSentence = this.cleanTextForTTS(this.sentence.text)
      this.ttsService.getTTS(cleanedSentence).subscribe((tts) => {
        this.sentence['audioData'] = tts
        this.sentence.awaitingGramadoir = false;
        this.speakNow()
      })

      this.sentence.focussed = false;
      let nextSentenceID = this.sentence.id + 1 ;
      let nextSentence = document.getElementById('sentence_' + nextSentenceID)
      if ( nextSentence === null ) {
        sentences.push({
          id: nextSentenceID,
          text: "",
          errors: null,
          focussed: false,
          readyToSpeak: false
        })
        setTimeout(function() {
          nextSentence = document.getElementById('sentence_' + nextSentenceID)
          nextSentence.focus()
        }, 100) // give dom time to create new element
      } else {
        nextSentence.focus()
      }
    }
  }
}

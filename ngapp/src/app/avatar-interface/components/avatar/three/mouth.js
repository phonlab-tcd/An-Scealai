const TWEEN = require('@tweenjs/tween.js')
import { lenMorphs, avatarBody, updateAvatarState, avatarStates, speakingSpeedMultDict } from './config'
import phonemeToVisemeMap from './phonemeToViseme.js'
import { sentences } from '../../../data/sentences'
import { flashAvatar } from './flash'

let visemeCount = 0
let activeSentence
let a
let h
const startSpeaking = (sent) => {
	activeSentence = sentences.find(s => s.id === avatarStates.activeSentenceID)
	//console.log('activeSentence:', activeSentence)
	//if (activeSentence !== undefined) {
		//a = document.getElementById('sentAudio' + activeSentence.id)
	visemeCount = 0;

	updateAvatarState('speakingSpeed', 1)
	if (sent) {
		updateAvatarState('speaking', true)	
		a = document.getElementById('sentAudio' + activeSentence.id)
		a.playbackRate = 1
		a.play()
		mouthPhrase()
	} else { // if help message
	    if (activeSentence.readyToSpeakHelp) {
		updateAvatarState('speaking', true)	
		let h = document.getElementById('helpAudio' + activeSentence.id)
		h.playbackRate = 1
		h.play()
		mouthHelp();
	    } else {
		//console.log('no help message to speak')
	    }
	}
}

const mouthPhrase = () => {
	let dur = 0
	if (visemeCount === 0) {
		dur = parseFloat(activeSentence.orderedTiming[visemeCount].end)*speakingSpeedMultDict[avatarStates.speakingSpeed] / avatarStates.speakingSpeed
	} else {
		dur = (parseFloat(activeSentence.orderedTiming[visemeCount].end)-parseFloat(activeSentence.orderedTiming[visemeCount-1].end))*speakingSpeedMultDict[avatarStates.speakingSpeed] / avatarStates.speakingSpeed
	}

	if ( activeSentence.orderedTiming[visemeCount].error && avatarStates.speakingSpeed !== 0.25 ) {
		a.pause();
		a.playbackRate = 0.25
		updateAvatarState('speakingSpeed', 0.25)
		mouthViseme("viseme_" + phonemeToVisemeMap[activeSentence.orderedTiming[visemeCount].phone], dur, true)
		a.play()
	} else if ( !activeSentence.orderedTiming[visemeCount].error  && avatarStates.speakingSpeed !== 1 ){
		a.pause();
		a.playbackRate = 1
		updateAvatarState('speakingSpeed', 1)
		mouthViseme("viseme_" + phonemeToVisemeMap[activeSentence.orderedTiming[visemeCount].phone], dur, true)
		a.play()
	} else {
		mouthViseme("viseme_" + phonemeToVisemeMap[activeSentence.orderedTiming[visemeCount].phone], dur, true)
	}
}

const mouthHelp = () => {
	let dur = 0
	if (visemeCount === 0) {
		dur = parseFloat(activeSentence.helpTiming[visemeCount].end)*speakingSpeedMultDict[avatarStates.speakingSpeed] / avatarStates.speakingSpeed
	} else {
		dur = (parseFloat(activeSentence.helpTiming[visemeCount].end)-parseFloat(activeSentence.helpTiming[visemeCount-1].end))*speakingSpeedMultDict[avatarStates.speakingSpeed] / avatarStates.speakingSpeed
	}

	mouthViseme("viseme_" + phonemeToVisemeMap[activeSentence.helpTiming[visemeCount].phone], dur, false)
}

const mouthViseme = (vis, duration, sent) => {
	let faceMorphsTo = new Array(lenMorphs).fill(0);
	faceMorphsTo[avatarBody.head.morphTargetDictionary[vis]] = 0.4;
	let mouthingIn = new TWEEN.Tween(avatarBody.head.morphTargetInfluences).to(faceMorphsTo, duration)
		.easing(TWEEN.Easing.Cubic.In)
		.start()

	mouthingIn.onComplete( function() {
		if (sent) {
			if (visemeCount < activeSentence.orderedTiming.length-1) {
				visemeCount += 1;
				mouthPhrase()
			} else {
				lastPhone()
			}
		} else {
			if (visemeCount < activeSentence.helpTiming.length-1) {
				visemeCount += 1;
				mouthHelp()
			} else {
				lastPhone()
			}
		}
		//} else {
		
	})

	const lastPhone = () => {
		faceMorphsTo = new Array(lenMorphs).fill(0);
		let lastMouthingIn = new TWEEN.Tween(avatarBody.head.morphTargetInfluences).to(faceMorphsTo, 500)
			.easing(TWEEN.Easing.Cubic.InOut)
			.start()
		lastMouthingIn.onComplete( function() {
			updateAvatarState('speaking', false)
			activeSentence.readyToSpeak = false;
			if (sent) {
				if (activeSentence.readyToSpeakHelp && !activeSentence.avatarFlashed) {
					flashAvatar(activeSentence)
					activeSentence.avatarFlashed = true; 
				}
			}
		})
	}
		
}

//window.startMouthing = startMouthing
export { startSpeaking }

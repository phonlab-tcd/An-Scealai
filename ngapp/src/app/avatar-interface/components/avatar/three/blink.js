const TWEEN = require('@tweenjs/tween.js')
import { lenMorphs, avatarBody, updateAvatarState, avatarStates } from './config.js'

let blinkFrom
let blinkTo
let partKey
const startRandomBlink = () => {
	blinkFrom = new Array(lenMorphs).fill(0);
	blinkTo = new Array(lenMorphs).fill(0);
	partKey = avatarBody.head.morphTargetDictionary.eyesClosed;
	blinkTo[partKey] = 1
	updateAvatarState('blinking', true)
	randomBlink()
}

const randomBlink = () => {
	blink()
	let randomDelay = 2000 + Math.random() * 5000
	setTimeout(function(){
		randomBlink()
	}, randomDelay)
}

const blink = () => {
		if ( !avatarStates.speaking ) {
			let blinking = new TWEEN.Tween(avatarBody.head.morphTargetInfluences).to(blinkTo, 100)
				.easing(TWEEN.Easing.Quadratic.Out)
				.start()
			blinking.onComplete( () => {
				let blinkingOut = new TWEEN.Tween(avatarBody.head.morphTargetInfluences).to(blinkFrom, 150)
					.easing(TWEEN.Easing.Quadratic.Out)
					.start()
				blinkingOut.onComplete( () => {
					updateAvatarState('blinking', false)
				} )
			} )
		}
}

export { startRandomBlink, blink }

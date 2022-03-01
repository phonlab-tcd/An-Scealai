const TWEEN = require('@tweenjs/tween.js')
import { lenMorphs, head } from './main'
import { updateAvatarState, avatarStates } from './config.js'

const startRandomBlink = () => {
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
			let blinkTo = new Array(lenMorphs).fill(0);
			let partKey = head.morphTargetDictionary.eyesClosed;
			blinkTo[partKey] = 1
			let blinking = new TWEEN.Tween(head.morphTargetInfluences).to(blinkTo, 100)
				.easing(TWEEN.Easing.Quadratic.Out)
				.yoyo(true)
				.repeat(1)
				.start()
		}
}

export { startRandomBlink, blink }

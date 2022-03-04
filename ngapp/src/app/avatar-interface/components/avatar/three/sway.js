const TWEEN = require('@tweenjs/tween.js')
import { avatarBody, avatarStates } from './config.js'

const randomSway = (direction=1) => {
	let randomDuration = 2000 + Math.random()*5000;
	let randomRotation = Math.random()*0.02 * direction;
	if (avatarStates.speaking) {
		randomDuration /= 2;
		randomRotation *= 2;
	}
	let sway = new TWEEN.Tween(avatarBody.spine.rotation).to({z: randomRotation}, randomDuration)
		.easing(TWEEN.Easing.Cubic.InOut)
		.start()
	setTimeout(function(){
		randomSway(direction*=-1)
	}, randomDuration)
}

const randomNeckTurn = (direction=1) => {
	let randomDuration = 2000 + Math.random()*5000;
	let randomRotation = Math.random()*0.05 * direction;
	if (avatarStates.speaking) {
		randomDuration /= 3;
		randomRotation *= 2.5;
	}
	let turn = new TWEEN.Tween(avatarBody.neck.rotation).to({y: randomRotation}, randomDuration)
		.easing(TWEEN.Easing.Cubic.InOut)
		.start()
	turn.onUpdate(function (object) {
		avatarBody.leftEye.lookAt(avatarStates.focalPoint)
		avatarBody.rightEye.lookAt(avatarStates.focalPoint)
	})
	setTimeout(function(){
		randomNeckTurn(direction*=-1)
	}, randomDuration)
}

export { randomNeckTurn, randomSway }

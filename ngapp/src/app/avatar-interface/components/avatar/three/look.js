const TWEEN = require('@tweenjs/tween.js')
import { avatarStates, updateAvatarState, avatarBody } from './config'
import * as THREE from 'three'
import { blink } from './blink'
import { startSpeaking } from './mouth'

const avatarLookAt = (what, duration) => {
	try {
		let dir = new THREE.Vector3();
		let headBoneRot
		let spine2Rot
		let spine1Rot
		if (what === 'board') {
			avatarStates.lookingAtBoard = true;
			avatarStates.focalPoint = new THREE.Vector3(-2,2,2) 
			headBoneRot = new TWEEN.Tween(avatarBody.headBone.rotation).to({x: 0, y: -0.2, z: 0.0}, 0.7*duration)
			spine2Rot = new TWEEN.Tween(avatarBody.spine2.rotation).to({x: 0, y: -0.1, z: 0.0}, 0.85*duration)
			spine1Rot = new TWEEN.Tween(avatarBody.spine1.rotation).to({x: 0, y: -0.05, z: 0.0}, duration)
		} else {
			avatarStates.focalPoint = camera.getWorldPosition(dir)
			headBoneRot = new TWEEN.Tween(avatarBody.headBone.rotation).to({x: 0, y: 0.3, z: 0.0}, 0.5*duration)
			spine2Rot = new TWEEN.Tween(avatarBody.spine2.rotation).to({x: 0, y: 0, z: 0.0}, 0.85*duration)
			spine1Rot = new TWEEN.Tween(avatarBody.spine1.rotation).to({x: 0, y: 0, z: 0.0}, duration)
		}
		headBoneRot.easing(TWEEN.Easing.Quintic.Out)
		spine2Rot.easing(TWEEN.Easing.Quintic.Out)
		spine1Rot.easing(TWEEN.Easing.Quintic.Out)
		headBoneRot.start();
		spine2Rot.start();
		spine1Rot.start();
		if (!avatarStates.blinking) {
			blink()
		}
		headBoneRot.onUpdate(function (object) {
			avatarBody.leftEye.lookAt(avatarStates.focalPoint)
			avatarBody.rightEye.lookAt(avatarStates.focalPoint)
		})

		headBoneRot.onComplete( () => {
			if ( what === 'camera' ) {
				startSpeaking(true);
				avatarStates.lookingAtBoard = false;
			}
		})
	} catch (error) {
		console.log('error in lookingAt:', error)
	}
}

export { avatarLookAt }

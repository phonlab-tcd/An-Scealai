const TWEEN = require('@tweenjs/tween.js')
import { avatarStates, updateAvatarState } from './config'
import * as THREE from 'three'
import { blink } from './blink'
import { headBone, spine1, spine2, leftEye, rightEye } from './main'
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
			headBoneRot = new TWEEN.Tween(headBone.rotation).to({x: 0, y: -0.2, z: 0.0}, 0.7*duration)
			spine2Rot = new TWEEN.Tween(spine2.rotation).to({x: 0, y: -0.1, z: 0.0}, 0.85*duration)
			spine1Rot = new TWEEN.Tween(spine1.rotation).to({x: 0, y: -0.05, z: 0.0}, duration)
		} else {
			avatarStates.focalPoint = camera.getWorldPosition(dir)
			headBoneRot = new TWEEN.Tween(headBone.rotation).to({x: 0, y: 0.3, z: 0.0}, 0.5*duration)
			spine2Rot = new TWEEN.Tween(spine2.rotation).to({x: 0, y: 0, z: 0.0}, 0.85*duration)
			spine1Rot = new TWEEN.Tween(spine1.rotation).to({x: 0, y: 0, z: 0.0}, duration)
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
			leftEye.lookAt(avatarStates.focalPoint)
			rightEye.lookAt(avatarStates.focalPoint)
		})

		headBoneRot.onComplete( () => {
			if ( what === 'camera' ) {
				startSpeaking(true);
				avatarStates.lookingAtBoard = false;
			}
		})
			//let direction = new THREE.Vector3();
			//let focalPoint;
			////console.log('toWhom:', toWhom)
			//if (what === 'board') {
				//focalPoint = camera.getWorldPosition(direction)
			//} else {
				//focalPoint = c.p[toWhom].movableBodyParts.head.getWorldPosition(direction)
				//// look more at nose area
				//focalPoint.x *= 0.75
				//focalPoint.z *= 0.75
			//}
			//if (body) {
				//focalPoint.y *= 0.667
				//if (who === username) {
					//focalPoint.z += 4
				//}
			//}
			//updateAvatarState(who, 'focalPoint', focalPoint)
	} catch (error) {
		console.log('error in lookingAt:', error)
	}
}
window.avatarLookAt = avatarLookAt

export { avatarLookAt }

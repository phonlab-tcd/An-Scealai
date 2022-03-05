import { avatarBody } from './config'
const TWEEN = require('@tweenjs/tween.js')

const flashAvatar = () => {
	let bTween = new TWEEN.Tween(avatarBody.Wolf3D_Outfit_Top.material.emissive).to({b: 0.1, r: 0.1, g: 0.1}, 500)
		.easing(TWEEN.Easing.Quintic.Out)
		.yoyo(true)
		.repeat(4)
		.start()
	bTween.onComplete( () => {
		let endTween = new TWEEN.Tween(avatarBody.Wolf3D_Outfit_Top.material.emissive).to({b: 0, r: 0, g: 0}, 500)
			.easing(TWEEN.Easing.Quintic.Out)
			.start()
	} )
}

export {flashAvatar}

const avatarStates = {
	lookingAtBoard: false,
	speaking: false,
	blinking: false,
	speakingSpeed: 1,
	mouseHover: false,
	activeSentenceID: null,
	focalPoint: null,
	lenMorphs: 0
}

const avatarBody = {

}

const updateAvatarState = (state, value) => {
	avatarStates[state] = value
}

//var bodyPartsList = []

const speakingSpeedMultDict = {
	1.25: 825,
	1: 850,
	0.75: 875,
	0.5: 920,
	0.25: 925,
	0.2: 926,
	0.15: 927,
	0.1: 928
}

module.exports = { avatarBody, updateAvatarState, avatarStates, speakingSpeedMultDict }

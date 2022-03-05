import { startSpeaking } from "./mouth"
import { avatarLookAt } from "./look"

const avatarControl = controlType => {

	switch (controlType) { 

		case "start speaking":
			startSpeaking(true)
			break;
	
		case "look at board":
      avatarLookAt('board', 1500)
			break;

		case "look at camera":
      avatarLookAt('camera', 1500 )
			break;
	}

}

export { avatarControl }

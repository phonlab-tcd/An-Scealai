import { updateAvatarState, avatarStates } from '../../avatar/three/config'
import { sentences } from '../../../data/sentences'

const prepareAudioWithGramadoirCheck = sentId => {
  sentences[sentId].orderedTiming = createOrderedTimings(sentId)
  let a = document.getElementById('sentAudio' + sentId)
  a.setAttribute("src", "data:audio/wav;base64," + sentences[sentId].audioData.audioContent)
  a.load()
  updateAvatarState('sentAudio', a)
	updateAvatarState('activeSentence', sentId)	
}

const createOrderedTimings = (sentID) => {
    let orderedTimings = []
    let wordOnset = 0
    let errorNo = 0
    let currentlyTrue = false
    sentences[sentID].audioData.timing.forEach( word => {
        let errorPhone = false
        if ( word.word !== "SILENCE_TOKEN" ) {
          if (errorNo < sentences[sentID].errors.length) {
            if ( sentences[sentID].errors[errorNo].fromx <= wordOnset && wordOnset <= sentences[sentID].errors[errorNo].tox ) {
                errorPhone = true
                currentlyTrue = true
            } else {
                errorPhone = false
                if ( currentlyTrue ) {
                    currentlyTrue = false
                    errorNo += 1
                }
            }
          } else {
            errorPhone = false;
            currentlyTrue = false
          }
          word.phones.forEach(p => {
              p.error = errorPhone
              orderedTimings.push(p)
          })
          wordOnset += word.word.length + 1
        }
    })
    return orderedTimings
}

const prepareAudioForHelp = sentId => {
  sentences[sentId].helpTiming = createHelpTimings(sentId)
  let aHelp = document.getElementById('helpAudio' + sentId)
  aHelp.setAttribute("src", "data:audio/wav;base64," + sentences[sentId].audioDataHelp.audioContent)
  aHelp.load()
}

const createHelpTimings = (sentID) => {
    let helpTimings = []
    sentences[sentID].audioDataHelp.timing.forEach( word => {
        if ( word.word !== "SILENCE_TOKEN" ) {
          word.phones.forEach(p => {
              helpTimings.push(p)
          })
        }
    })
    return helpTimings
}
export { prepareAudioWithGramadoirCheck, prepareAudioForHelp }

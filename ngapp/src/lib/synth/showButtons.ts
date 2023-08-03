import seekParentWord from "../seekParentWord";
import seekParentSentence from "../seekParentSentence";
import findLocationsInText from "../findLocationsInText";
import newTimeout from "../newTimeout";


// /**
//  * Get word and sentence text to synthesise
//  * Create and show synthesis play buttons
//  * @param this Dashboard component
//  * @param range range of selected text
//  */
// export default function showButtons(this: DashboardComponent, range){
//   console.log(range);
//   if(!range) return;

//   const quill = this.quillEditor;
//   const wordTooltip = this.synthButtons.wordTooltip;
//   const parentWord = seekParentWord(this.story.text, range.index);
//   wordTooltip.root.onmouseover = onMouseInOrOut.bind(quill, true,  parentWord);
//   wordTooltip.root.onmouseout  = onMouseInOrOut.bind(quill, false, parentWord);
//   wordTooltip.root.onclick = onclick.bind(this, parentWord.text, parentWord.startIndex);

//   const sentenceTooltip = this.synthButtons.sentTooltip;
//   const parentSentence = seekParentSentence(this.story.text, range.index);
//   sentenceTooltip.root.onmouseover = onMouseInOrOut.bind(quill, true,  parentSentence);
//   sentenceTooltip.root.onmouseout  = onMouseInOrOut.bind(quill, false, parentSentence);
//   sentenceTooltip.root.onclick = onclick.bind(this, parentSentence.text, parentSentence.startIndex);

//   if(parentWord.text) this.synthButtons.showWordButtonAtIndex(parentWord.endIndex);
//   else wordTooltip.hide();

//   if(parentSentence.text) this.synthButtons.showSentenceButtonAtIndex(parentSentence.startIndex);
//   else sentenceTooltip.hide();
// }
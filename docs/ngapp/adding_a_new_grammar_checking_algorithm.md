### Adding a new grammar checking algorithm to frontend
There are three core components you'll need to work on to add a new grammar checker:
1) `grammar.service.ts` - here you can call the grammar checking API and parse the response
2) `quill-highlight.service.ts` - this module handles adding text highlighting to the quill editor. You'll need to convert the identified grammar errors to `QuillHighlightTag` objects. These objects primarily consist of `start` and `end` points for the text highlight, and a `message` that is displayed in a popup giving further information on the grammar error. Next you'll need to edit three core functions:
   1) `updateGrammarErrors()` - here you should call your `grammar.service` function to get a list of errors that have been found. These errors must then be converted into `QuillHighlightTag`s and stored as an instance variable, so that they can easily be displayed or hidden.
   2) `applyGramadoirTagFormatting()` - here the `QuillHighlightTags` can be added to the quill editor.
   3) `clearGramadoirTagFormatting()` - copy the existing code here to remove highlights from the quill editor.
3) `dashboard.component.ts` - here you can add UI items to control the display of the grammar tags, e.g. a checkbox, as is done with existing algorithms.




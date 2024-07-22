//import { parse } from 'node-html-parser';
const parse = require('node-html-parser').parse;

class TreeTraverser {
    constructor(unescapableTagNames, unescapableTagClasses, segmentedText, selfClosingTags, type) {
        this.unescapableTagNames = unescapableTagNames
        this.unescapableTagClasses = unescapableTagClasses
        this.segmentedText = segmentedText
        this.selfClosingTags = selfClosingTags
        this.type = type
        this.parserId = 0
        this.textParser = null
        //if (this.segmentedText != []) {
        if (Array.isArray(this.segmentedText) && this.segmentedText.length!=0) {
            const tmp = this.segmentedText[this.parserId]

            //console.log(this.segmentedText)
            //console.log(this.segmentedText != [])
            //console.log(typeof(this.segmentedText))
            
            this.textParser = {
                text: tmp['text'],
                id: this.parserId,
                isFirstChar: true
            }

            if (this.type==='word') this.textParser['pos'] = tmp['pos']
        }
    }

    elementIsEscapable(elem) {

        if (this.unescapableTagNames.includes(elem.tagName))
            return false;
        
        for (let _class of elem.classList.value) {
            if (this.unescapableTagClasses.includes(_class))
                return false;
        }

        return true;
    }

    buildOpenElemTag(elem) {
        let tagString = `<${elem.tagName}`;
        
        /*if (elem.hasAttributes()) {
            for (let attr of elem.attributes) {
                tagString += ` ${attr.name}="${attr.value}"`
            }
        }*/ // equivalent using standard DOM Parser
        for (let attr in elem.attributes) {
            tagString += ` ${attr}="${elem.attributes[attr]}"`
        }
        if (this.selfClosingTags.includes(elem.tagName)) tagString += '/';
        tagString += '>';
        return tagString;
    }
}

function encapsulateSegment(node, traverser) {

    let newBodyContent = ""

    let nodeString = node.textContent;

    //console.log(node)
    //console.log(node.parentNode)
    //console.log(node.parentNode.tagName)

    let ancestorElement = node.parentNode;

    let elemClosingTag = '';
    let elemOpenTag = '';
    //console.log(node.tagName)
    //console.log(ancestorElement.tagName)
    while (traverser.elementIsEscapable(ancestorElement)) {

        elemClosingTag += `</${ancestorElement.tagName}>`;
        elemOpenTag += traverser.buildOpenElemTag(ancestorElement);

        ancestorElement = ancestorElement.parentNode

    }

    while (nodeString!=='' || (traverser.textParser !== null && traverser.textParser.text==='' && !traverser.textParser.isFirstChar)) {

        //console.log(traverser.textParser.text)
        
        if (traverser.textParser !== null) {
            
            if (traverser.textParser.text==="") {
                
                if (!traverser.textParser.isFirstChar) newBodyContent += elemClosingTag + '</SPAN>' + elemOpenTag

                if (traverser.parserId<traverser.segmentedText.length-1) {

                    traverser.parserId += 1;
                    const tmp = traverser.segmentedText[traverser.parserId]

                    const textParser = {
                        text: tmp['text'],
                        id: traverser.parserId,
                        isFirstChar: true
                    }
                    if (traverser.type==='word') textParser['pos'] = tmp['pos']

                    traverser.textParser = textParser

                } else {
                    traverser.textParser = null;
                }
            
            } else {

                if (traverser.textParser.text[0]===nodeString[0]) {

                    if (traverser.textParser.isFirstChar) {

                        const segmentId = `${traverser.type}${traverser.textParser.id}`

                        let openingSegmentTag = `<SPAN id="${segmentId}" class="${traverser.type}"`
                        if (traverser.type==="word") {
                            openingSegmentTag += ` lemma="${traverser.textParser['pos']['lemma']}"`
                            openingSegmentTag += ` tags="${traverser.textParser['pos']['tags']}"`
                        }
                        openingSegmentTag += '>'

                        newBodyContent += elemClosingTag + openingSegmentTag + elemOpenTag

                        traverser.textParser.isFirstChar = false

                    }

                    traverser.textParser.text = traverser.textParser.text.slice(1,traverser.textParser.text.length)//[1:]

                }

                // only move along the string when a break is not being placed
                newBodyContent += nodeString[0]
                nodeString = nodeString.slice(1,nodeString.length)
        
            }
        } else {
            newBodyContent += nodeString[0]
            nodeString = nodeString.slice(1,nodeString.length)
        }
    }
    
    return newBodyContent

}


function traverse(node, traverser) {

    if (node.nodeType === 3) {

        return encapsulateSegment(node, traverser)

    } else {

        let innerHTML = traverser.buildOpenElemTag(node)

        for (let childNode of node.childNodes) {

            innerHTML += traverse(childNode, traverser);

        }

        innerHTML += `</${node.tagName}>`

        return innerHTML
    }
}

/*export default function segmentBody(htmlString, sentences, words) {

    const root = parse(htmlString)

    let unescapableTagNames = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'TITLE', 'TH', 'TD', 'BODY']
    let unescapableTagClasses = []
    let selfClosingTags = ['IMG']

    const sentenceTraverser = new TreeTraverser(unescapableTagNames, unescapableTagClasses, sentences, selfClosingTags, 'sentence')
    const bodySentencesSegmented = parse(traverse(root, sentenceTraverser))

    unescapableTagClasses = ['sentence']

    const wordTraverser = new TreeTraverser(unescapableTagNames, unescapableTagClasses, words, selfClosingTags, 'word')
    const bodyWordsSegmented = parse(traverse(bodySentencesSegmented.querySelector('body'), wordTraverser))

    return bodyWordsSegmented

}*/

module.exports = function (htmlString, sentences, words) {

    const root = parse(htmlString)
    const body = root.querySelector('body')

    let unescapableTagNames = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'TITLE', 'TH', 'TD', 'BODY']
    let unescapableTagClasses = []
    let selfClosingTags = ['IMG']

    const sentenceTraverser = new TreeTraverser(unescapableTagNames, unescapableTagClasses, sentences, selfClosingTags, 'sentence')
    const bodySentencesSegmented = parse(traverse(body, sentenceTraverser))

    //console.log(bodySentencesSegmented.toString())

    unescapableTagClasses = ['sentence']

    const wordTraverser = new TreeTraverser(unescapableTagNames, unescapableTagClasses, words, selfClosingTags, 'word')
    const bodyWordsSegmented = parse(traverse(bodySentencesSegmented.querySelector('body'), wordTraverser))

    //console.log(bodyWordsSegmented.toString())

    return bodyWordsSegmented.toString()

};

/*const root = parse(`<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang xml:lang>
<head>
  <meta charset="utf-8" />
  <meta name="generator" content="pandoc" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
  <title>Untitled</title>
  <style>
html {
color: #1a1a1a;
background-color: #fdfdfd;
}
body {
margin: 0 auto;
max-width: 36em;
padding-left: 50px;
padding-right: 50px;
padding-top: 50px;
padding-bottom: 50px;
hyphens: auto;
overflow-wrap: break-word;
text-rendering: optimizeLegibility;
font-kerning: normal;
}
@media (max-width: 600px) {
body {
font-size: 0.9em;
padding: 12px;
}
h1 {
font-size: 1.8em;
}
}
@media print {
html {
background-color: white;
}
body {
background-color: transparent;
color: black;
font-size: 12pt;
}
p, h2, h3 {
orphans: 3;
widows: 3;
}
h2, h3, h4 {
page-break-after: avoid;
}
}
p {
margin: 1em 0;
}
a {
color: #1a1a1a;
}
a:visited {
color: #1a1a1a;
}
img {
max-width: 100%;
}
svg {
height: auto;
max-width: 100%;
}
h1, h2, h3, h4, h5, h6 {
margin-top: 1.4em;
}
h5, h6 {
font-size: 1em;
font-style: italic;
}
h6 {
font-weight: normal;
}
ol, ul {
padding-left: 1.7em;
margin-top: 1em;
}
li > ol, li > ul {
margin-top: 0;
}
blockquote {
margin: 1em 0 1em 1.7em;
padding-left: 1em;
border-left: 2px solid #e6e6e6;
color: #606060;
}
code {
font-family: Menlo, Monaco, Consolas, 'Lucida Console', monospace;
font-size: 85%;
margin: 0;
hyphens: manual;
}
pre {
margin: 1em 0;
overflow: auto;
}
pre code {
padding: 0;
overflow: visible;
overflow-wrap: normal;
}
.sourceCode {
background-color: transparent;
overflow: visible;
}
hr {
background-color: #1a1a1a;
border: none;
height: 1px;
margin: 1em 0;
}
table {
margin: 1em 0;
border-collapse: collapse;
width: 100%;
overflow-x: auto;
display: block;
font-variant-numeric: lining-nums tabular-nums;
}
table caption {
margin-bottom: 0.75em;
}
tbody {
margin-top: 0.5em;
border-top: 1px solid #1a1a1a;
border-bottom: 1px solid #1a1a1a;
}
th {
border-top: 1px solid #1a1a1a;
padding: 0.25em 0.5em 0.25em 0.5em;
}
td {
padding: 0.125em 0.5em 0.25em 0.5em;
}
header {
margin-bottom: 4em;
text-align: center;
}
#TOC li {
list-style: none;
}
#TOC ul {
padding-left: 1.3em;
}
#TOC > ul {
padding-left: 0;
}
#TOC a:not(:hover) {
text-decoration: none;
}
code{white-space: pre-wrap;}
span.smallcaps{font-variant: small-caps;}
div.columns{display: flex; gap: min(4vw, 1.5em);}
div.column{flex: auto; overflow-x: auto;}
div.hanging-indent{margin-left: 1.5em; text-indent: -1.5em;}

ul.task-list[class]{list-style: none;}
ul.task-list li input[type="checkbox"] {
font-size: inherit;
width: 0.8em;
margin: 0 0.8em 0.2em -1.6em;
vertical-align: middle;
}
.display.math{display: block; text-align: center; margin: 0.5rem auto;}
</style>
</head>
<body>
<h1 id="brian-bréagach"><strong>Brian Bréagach</strong></h1>
<p>Bhí fear ina chónaí fadó i gCill Bhrighde. <em>Brian Bréagach</em> an t-ainm a bhí air. Bhí teach beag aige féin agus ag a bhean ag bárr an chnuic. Ní raibh de shlí beatha aige ach ag díol poitín. Bhí capall breá glas aige agus bhíodh sí aige ag díol an phoitín.</p>
<p>Chuaigh sé lá amach, agus chonaic na gárdaí é, agus lean siad é go dtí an teach. Nuair a bhí sé in aice an tighe, d&#39;isligh sé den chapall agus chaith sé cúpla punt i n-aoileach an chapaill, agus dúirt sé leis na gárdaí go raibh an capall lán d&#39;airgead. Thug na gárdaí deich bpunt dó uirthi ag ceapadh go mbeadh siad saibhir go brách, ach pingin nó leith-phingin ní bhfuair siad.</p>
<p>Nuair a tháinig siad chuige le príosúnach a dhéanamh dhe, bhí giorria aige, agus dúirt sé go mba é an teachtaire a b&#39;fhearr a bhí aige riamh, go mbíodh sé ag iompar airgid go dtí an siopa dhó. Thóig na gárdaí an giorria agus cheangail siad cupla punt faoi na mhuineál, agus chuir chuig an siopa é ach níor facthas arís é.</p>
<p>Bhí siad le Brian a chrochadh ansin, ach bhí plean eile aige. Nuair a chuala sé an scéal, mharaigh sé coileach, agus cheangail sé máilín faoi mhuineál na mná agus líon sé le fuil na coiligh é. Bhí a bhean le hais na tine nuair a bhuail na gárdaí isteach. Dúirt sé go maródh sé a bhean, agus go ndéanfadh sé beo arís í. Fuair sé scian agus gheárr sé an máilín, agus thit an bhean marbh. Thosaigh sé ag feadail ansin agus d&#39;éirigh an bhean suas. Chuaigh na gárdaí abhaile, agus rinne siad an cleas céanna le na gcuid mná ach níor fhéad siad iad a dhéanamh beó arís.</p>
<p>Cheap na Gardaí Brian a bhá faoin gcleas seo. Bhuail siad isteach ag Brian agus bhuail siad síos i mála é agus thugadar suas go Gaillimh é lena bhá sa bhfarraige. Nuair a bhí siad leath-bealaigh suas, chonaic siad giorria bacach. Lean siad é agus an mála a raibh Brian istigh ann, chaith siad uatha é.</p>
<p>Bhí fear ag dul chuig an margadh agus chonaic sé Brian sa mála. D&#39;fhiafhraigh sé dó cé raibh sé ag dul. Dúirt Brian go raibh sé ag dul go na Flaithis. Chuaigh an fear eile isteach sa mála agus dúirt sé le Brian na beithigh a dhíol. Thóg na gárdaí an mála arís agus níor stop siadgo ndeacha siad go dúg na Gaillimhe. Chaith siad an mála amach sa bhfarraige, agus d&#39;imigh siad abhaile. Bhí siad scaitheamh amach ón mbaile mór nuair a casadh dóibh Brian agus na beithigh aige. Cheistigh siad é, agus dúirt sé go bhfuair sé na beithigh amuigh sa bhfarraige agus go raibh go leor fágtha fós ann. Níor chreid siad an uair seo é agus leig siad abhaile é.</p>
<p>Scríofa ag: Máirtín Ó Conroigh</p>
<p>Foinse eolas: Máirtín Ó Conroigh (aois 68), An Cheathrú Caol</p>
</body>
</html>
`);

const body = root.querySelector('body')

// only for testing - would usually be done via another API call
const sents = []
const words = []
for (let chunk of body.childNodes) {
    for (let sentence of chunk.textContent.split('.')) {
        sents.push({text: sentence})
        for (let word of sentence.split(' ')) {
            words.push({text: word, pos: {lemma: 'something', tags: 'other' }})
        }
    }
}
//

const newBody = segmentBody(body, sents, words)

console.log(newBody.toString())*/
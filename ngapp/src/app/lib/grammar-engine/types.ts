import { HighlightTag } from "../quill-highlight/quill-highlight";

export type GrammarChecker = {
  check: (input: string, authToken?: string) => Promise<ErrorTag[]>;
  name: string;
};

export type GrammarCache = {[input: string]: ErrorTag[]}

export type ErrorTag = {
  errorText: string;  // for counting
  messageGA: string;
  messageEN: string;
  context: string;   // for analysis
  nameEN: string;
  nameGA: string;
  color: string;
  fromX: number;
  toX: number;
  type: string;
}

export function ErrorTag2HighlightTag(et: ErrorTag): HighlightTag {
  console.log(et);
  return {
    messageGA: et.messageGA,
    messageEN: et.messageEN,
    nameEN: et.nameEN,
    nameGA: et.nameGA,
    color: et.color,
    fromX: et.fromX,
    toX: et.toX
  }
}

type ErrorType = keyof typeof ERROR_INFO;

export const ERROR_INFO = {
    "LEATHAN-CAOL": {
      nameEN: 'Broad/Slender',
      nameGA: 'Leathan/Caol',
      color: '#FFFF64', 
      messageEN: 'These vowels should be in agreement according to the Leathan/Caol rule.', 
      messageGA: 'Ba cheart go mbeadh na gutaí seo ar aon dul de réir riail Leathan/Caol.'
    },
    "RELATIVE-CLAUSE": {
      nameEN: 'Relative Clause',
      nameGA: 'Clásáil Coibhneasta',
      color: '#CBC3E3', 
      messageEN: 'Relative Clause Error', 
      messageGA: 'Botún leis an gClásál Coibhneasta'
    },
    "GEN-TONIC": {
      nameEN: 'Genitive',
      nameGA: 'Tuiseal Ginideach',
      color: '#00FA9A', 
      messageEN: 'Consider using the genitive', 
      messageGA: 'Úsáid an tuiseal ginideach'
    },
    "GAELSPELL": {
      nameEN: 'Spelling',
      nameGA: 'Litriú',
      color: 'orange', 
      messageEN: 'Spelling mistake.', 
      messageGA: 'Botún litrithe.'
    },
    "MICHEART": {
      nameEN: 'Minor Error',
      nameGA: 'Botún Beag',
      color: '#ffdfba', 
      messageEN: 'Do you mean #suggestion#?', 
      messageGA: 'An é #suggestion# a bhí ar intinn agat?'
    },
    "MOLADH": {
      nameEN: 'Error',
      nameGA: 'Botún',
      color: '#FFA3A3', 
      messageEN: 'Word not recognised. #suggestion#?', 
      messageGA: 'Níl an fhoirm seo den fhocal sa bhfoclóir. #suggestion#?'
    },
    "CAIGHDEAN": {
      nameEN: 'Non-standard Form',
      nameGA: 'Foirm Neamhchaighdeánach',
      color: '#ffffba', 
      messageEN: 'Is this a non-standard form of #suggestion#? e.g. a dialect-specific spelling', 
      messageGA: 'An foirm neamhchaighdeánach de #suggestion# é seo? m.sh. litriú canúnach'
    },
    "SEIMHIU": {
      nameEN: 'Séimhiú/Lenition Needed',
      nameGA: 'Séimhiú ag Teastáil',
      color: '#ADD8E6', 
      messageEN: 'Is seimhiú / lenition missing?', 
      messageGA: 'An bhfuil séimhiú ar lár?'
    },
    "GRAM": {
      nameEN: 'Gaeilge?',
      nameGA: 'Gaeilge?',
      color: '#BA90C6', 
      messageEN: 'Are you sure of the spelling? # is unlike an Irish letter sequence.', 
      messageGA: 'An focal iasachta é seo? Níl dul na Gaeilge ar shraith na litreacha seo #?\''
    },
    "BACHOIR": {
      nameEN: 'Link Words',
      nameGA: 'Focail Bheaga',
      color: '#CCD5AE', 
      messageEN: 'Consider the use of #suggestion# here instead', 
      messageGA: 'Cuimhnigh ar #suggestion# a úsáid anseo'
    },
    "ANAITHNID": {
      nameEN: 'Unrecognised Word',
      nameGA: 'Focal nár Aithníodh',
      color: '#fbc3bc', 
      messageEN: 'Word not recognised by the system', 
      messageGA: 'Ní aithníonn an córas an focal seo'
    },
    "NISEIMHIU": {
      nameEN: 'Remove Séimhiú/Lenition',
      nameGA: 'Séimhiú le Baint',
      color: '#FFAACF', 
      messageEN: 'Séimhiú/lenition does not appear to be needed here', 
      messageGA: 'Níl an chuma air go bhfuil gá le séimhiú anseo'
    },
    "COMHCHAIGH": {
      nameEN: 'Non Standard Compound?',
      nameGA: 'Comhfhocal as an nGnáth',
      color: '#A7727D', 
      messageEN: 'Not in database but could it be a non-standard compound (#)?', 
      messageGA: "Níl an focal seo sa bhfoclóir ach an comhfhocal neamhchaighdeánach é (#)?"
    },
    "COMHFHOCAL": {
      nameEN: 'Compound?',
      nameGA: 'Comhfhocal?',
      color: '#EB8242', 
      messageEN: 'Not in database but could it be a compound (#)?', 
      messageGA: "Níl an focal seo sa bhfoclóir ach an comhfhocal é (#)?"
    },
    "NOGENITIVE": {
      nameEN: 'Unnecessary Genitive',
      nameGA: 'Ginideach gan Ghá',
      color: '#93C572', 
      messageEN: 'Appears to be an unnecessary use of the genitive case', 
      messageGA: 'Níl sé soiléir go bhfuil an tuiseal ginideach ag teastáil anseo'
    },
    "URU": {
      nameEN: 'Urú/Eclipsis Missing',
      nameGA: 'Urú ar Lár?',
      color: '#CDFCF6', 
      messageEN: 'It looks as though Urú / Eclipsis is needed here', 
      messageGA: 'Tá an chuma air go bhfuil urú ag teastáil anseo'
    },
    "NEAMHCHOIT": {
      nameEN: 'Rare but Valid',
      nameGA: 'Neamhghnách ach Bailí',
      color: '#E8DFCA', 
      messageEN: 'The is a valid word but extremely rare in actual usage. are you sure this is the word you want here?', 
      messageGA: 'Tá an focal seo bailí ach ní úsáidtear go minic é - an é atá uait anseo?'
    },
    "DROCHMHOIRF": {
      nameEN: 'Mismatch to Root',
      nameGA: 'Difriúil ón Fhréamh',
      color: '#6D8B74', 
      messageEN: 'Are you sure about this spelling? It differs from the root #suggestion# we have in database', 
      messageGA: 'An bhfuil tú cinnte faoin leagan seo den fhocal? Difriúil ón bhfréamh #suggestion# san fhoclóir'
    },
    "MIMHOIRF": {
      nameEN: 'Common Misspelling',
      nameGA: 'Mílitriú Coitianta',
      color: '#C3B1E1', 
      messageEN: 'Did you mean #suggestion#? This appears to be a common misspelling.', 
      messageGA: 'An é #suggestion# a bhí i gceist agat? Tá an chuma air gur mílitriú coitianta é seo.'
    },
    "CUPLA": {
      nameEN: 'Unusual Word Sequence',
      nameGA: 'Sraith Neamhchoitianta Focal',
      color: '#C1A3A3', 
      messageEN: 'Unusual combination of words, double check that this is what you meant.', 
      messageGA: 'Bheadh sraith focal mar seo neamhchoitianta, an bhfuil tú cinnte go bhfuil sí ceart go leor?'
    },
    "WEAKSEIMHIU": {
      nameEN: 'Lenition After Preposition',
      nameGA: 'Séimhiú le Réamhfhocal',
      color: '#D9D7F1', 
      messageEN: 'Often the preposition #suggestion# causes séimhiú/lenition - should there be lenition here?', 
      messageGA: 'Is minicí ná a mhalairt a leanann séimhiú #suggestion# - ar cheart séimhiú a bheith anseo?'
    },
    "IONADAI": {
      nameEN: 'Word Mixup',
      nameGA: 'Meascán Focal',
      color: '#9D5353', 
      messageEN: 'Valid word but #suggestion# is more common', 
      messageGA: 'Is ann don fhocal seo, ach tá #suggestion# níos coitianta'
    },
    "NIURU": {
      nameEN: 'Unnecessary Urú/Eclipsis',
      nameGA: 'Urú gan Ghá',
      color: '#D3E4CD', 
      messageEN: 'Unnecessary urú/eclipsis (or problem with preceding word) - check this phrase', 
      messageGA: 'Urú gan ghá (nó focal mícheart roimhe) - seiceáil an nath seo'
    },
    "CLAOCHLU": {
      nameEN: 'Séimhiú/Urú Needed',
      nameGA: 'Gá le Séimhiú/Urú',
      color: '#FFDEFA', 
      messageEN: 'Initial mutation missing - add séimhiú/lenition or urú/eclipsis', 
      messageGA: 'Séimhiú nó urú ag teastáil anseo'
    },
    "PREFIXT": {
      nameEN: '<b>t</b> Missing',
      nameGA: '<b>t</b> ar Lár',
      color: '#79B4B7', 
      messageEN: 'Prefix "t" missing - this could be a masculine noun, a feminine noun starting with "s" or the genitive case ', 
      messageGA: 'Réamhlitir "t" in easnamh - féach ainmfhocail fhirinscneacha / ainmfhocail bhaininscneacha ag tosú le "s" nó focail sa tuiseal ginideach'
    },
    "GENITIVE": {
      nameEN: 'Genitive Missing',
      nameGA: 'Ginideach ar Lár',
      color: '#9ACD32', 
      messageEN: 'It appears the genitive case is required here', 
      messageGA: 'Féachann sé go bhfuil gá leis an tuiseal ginideach anseo'
    },
    "PREFIXH": {
      nameEN: '<b>h</b> Missing',
      nameGA: '<b>h</b> ar Lár',
      color: '#B97A95', 
      messageEN: 'Prefix "h" missing - two vowels together here, one ending a word and the next beginning a new word', 
      messageGA: 'Réamhlitir "h" in easnamh - dhá ghuta ag teacht le chéile anseo, ceann ag deireadh focail agus ceann ag tús an chéad fhocail eile'
    },
    "UATHA": {
      nameEN: 'Singular Form Needed',
      nameGA: 'Uimhir Uatha ag Teastáil',
      color: '#EDF6E5', 
      messageEN: 'Consider using the singular form here. Hint: always use the singular form after "cúpla" and "gach"', 
      messageGA: 'An bhfuil gá leis an uimhir uatha anseo? Nod: leanann uimhir uatha "cúpla" agus "gach"'
    },
    "MOIRF": {
      nameEN: 'Word not in Database',
      nameGA: 'Níl an focal sa chóras',
      color: '#ff6961', 
      messageEN: 'Not in database - is this formed from the root #suggestion#?', 
      messageGA: 'Focal nach bhfuil sa chóras, an bhfuil sé bunaithe ar #suggestion#?'
    },
    "INPHRASE": {
      nameEN: 'Set Phrase in Database not Matched',
      nameGA: 'Mí-mheaitseáil le nath cainte sa chóras',
      color: '#F1CA89', 
      messageEN: 'This looks like it should form part of a set phrase  - did you mean #suggestion#?', 
      messageGA: 'An cuid de nath cainte é seo? An é #suggestion# a bhí i gceist?'
    },
    "BREISCHEIM": {
      nameEN: 'Comparative Adjective',
      nameGA: 'Breischéim',
      color: '#A58FAA', 
      messageEN: 'Comparative adjective detected: check the adjective form after "níos / ní ba"', 
      messageGA: 'Breischéim? Seiceáil an aidiacht tar éis "níos / ní ba"'
    },
    "NIAITCH": {
      nameEN: 'Unnecessary "h"',
      nameGA: 'Réamhmhír "h" gan Ghá',
      color: '#DE8971', 
      messageEN: 'Does the prefix "h" follow in this context?', 
      messageGA: 'An bhfuil an comhthéacs ceart ann don réamhlitir "h" anseo?'
    },
    "NEEDART": {
      nameEN: 'Definite Article Required',
      nameGA: 'Alt ag Teastáil',
      color: '#BBBBBB', 
      messageEN: 'Use definite article "an" / "na"?', 
      messageGA: 'Úsáid an t-alt "an" / "na"?'
    },
    "CAIGHMOIRF": {
      nameEN: 'Spelling or non-standard form',
      nameGA: 'Litriú nó foirm neamhchaighdeánach',
      color: '#EFF0B6', 
      messageEN: 'Spelling error? or derived from a non-standard form of #suggestion#?', 
      messageGA: 'Earráid sa litriú? nó bunaithe ar leagan neamhchaighdeánach de #suggestion#?'
    },
    "NITEE": {
      nameEN: 'Prefix "t"',
      nameGA: 'Réamhlitir "t"',
      color: '#AEE1E1', 
      messageEN: 'Unnecessary prefix "t" ?', 
      messageGA: 'Réamhlitir "t" gan ghá?'
    },
    "NICLAOCHLU": {
      nameEN: 'Unnecessary Initial Mutation',
      nameGA: 'Urú/Séimhiú gan ghá',
      color: '#ECB390', 
      messageEN: 'Unnecessary initial mutation?', 
      messageGA: 'Urú nó séimhiú gan ghá?'
    },
    "DUBAILTE": {
      nameEN: 'Duplication',
      nameGA: 'Dúbláil',
      color: '#EFF8FF', 
      messageEN: 'Repeated word', 
      messageGA: 'An focal céanna faoi dhó'
    },
    "NOSUBJ": {
      nameEN: 'Resembles Subjunctive',
      nameGA: 'Cosúil leis an modh foshuiteach',
      color: '#8DB596', 
      messageEN: 'Looks like a subjunctive. Was this intentional?', 
      messageGA: 'É seo cosúil leis an modh foshuiteach, ach an é sin atá ar intinn agat?'
    },
    "ABSOLUTE": {
      nameEN: 'Dependent Form',
      nameGA: 'Foirm Spleách',
      color: '#968C83', 
      messageEN: 'Is the dependent form of the verb correct here? (or is previous word misspelled?)', 
      messageGA: 'An bhfuil gá leis an bhfoirm spleách anseo? (nó an bhfuil an focal roimhe litrithe mícheart?)'
    },
    "PREFIXD": {
      nameEN: 'Prefix <b>d\'</b> Missing',
      nameGA: 'Gá le Réamhmhír <b>d\'</b>',
      color: '#CCF6C8', 
      messageEN: 'Is the prefix <b>d\'</b> missing here? (past tense/conditional verbs beginning with a vowel or an "f")', // TODO cross reference to explanation of d' 
      messageGA: 'An bhfuil gá leis an réamhlitir <b>d\'</b> anseo? (aimsir chaite / modh coinníollach le focail a thosaíonn le guta nó "f")'
    },
    "ONEART": {
      nameEN: 'Two definite articles',
      nameGA: 'Dhá halt le hais a chéile',
      color: '#F6F6F6', 
      messageEN: 'No need for two definite articles', 
      messageGA: 'Ní gá dhá alt a bheith le hais a chéile (má tá an litriú ceart)'
    },
    "SYNTHETIC": {
      nameEN: 'Combined Form',
      nameGA: 'An Fhoirm Tháite',
      color: '#E5EDB7', 
      messageEN: 'The synthetic (combined) form, ending in #suggestion#, is often used here', 
      messageGA: 'Is é an fhoirm tháite, leis an iarmhír #suggestion#, a úsáidtear anseo go minic'
    },
    "NODATIVE": {
      nameEN: 'Dative',
      nameGA: 'Tuiseal Tabharthach',
      color: '#745C97', 
      messageEN: 'Did you mean to use the dative form here?', 
      messageGA: 'Arbh é an tuiseal tabharthach a bhí ar intinn agat?'
    },
    "RELATIVE": {
      nameEN: 'Independent Form',
      nameGA: 'Foirm Neamhspleách',
      color: '#d6ccc2', 
      messageEN: 'Is the independent form of the verb correct here?', 
      messageGA: 'An bhfuil an fhoirm neamhspleách ceart anseo?'
    },
    "NIDEE": {
      nameEN: 'Unnecessary Prefix "d"',
      nameGA: 'Réamhmhír "d" gan Ghá',
      color: '#f8ad9d', 
      messageEN: 'Unnecessary prefix "d"?', 
      messageGA: 'Réamhmhír  "d" gan ghá?'
    },
    "BADART": {
      nameEN: 'Unnecessary Definite Article',
      nameGA: 'An t-alt gan Ghá',
      color: '#84dcc6', 
      messageEN: 'Unnecessary use of the definite article? (double check spelling of noun)', 
      messageGA: 'An bhfuil gá leis an alt anseo?  (féach siar ar litriú an ainmfhocail)'
    },
    "NIGA": {
      nameEN: 'Unnecessary Word',
      nameGA: 'Focal gan Ghá',
      color: '#7bf1a8', 
      messageEN: 'Is the word # needed?', 
      messageGA: 'An bhfuil gá leis an bhfocal #?'
    },
    "PRESENT": {
      nameEN: '"Má" and the present tense',
      nameGA: '"Má" agus an aimsir láithreach',
      color: '#a9def9', 
      messageEN: 'Consider using the present tense after "má" here', 
      messageGA: 'Úsáid an aimsir láithreach sa chás seo tar éis "má"'
    },
    "NIDARASEIMHIU": {
      nameEN: 'A second Lenition',
      nameGA: 'An Dara Séimhiú',
      color: '#ffdc5e', 
      messageEN: 'Is the second lenition necessary?', 
      messageGA: 'An bhfuil gá leis an dara séimhiú?'
    },
    "NIBEE": {
      nameEN: 'Prefix <b>b\'</b>',
      nameGA: 'Réamhlitir <b>b\'</b>',
      color: '#a594f9', 
      messageEN: 'Is prefix <b>b\'</b> required here?', 
      messageGA: 'An bhfuil gá leis an réamhlitir <b>b\'</b>?'
    },
    "GENDER": {
      nameEN: 'Gender Disagreement',
      nameGA: 'Inscne mhícheart',
      color: '#ceb5b7', 
      messageEN: 'Gender disagreement?', 
      messageGA: 'Inscne mhícheart? '
    },
    "IOLRA": {
      nameEN: 'Plural Form Required',
      nameGA: 'Gá le huimhir iolra',
      color: '#9f9fed', 
      messageEN: 'Is the plural form required here?', 
      messageGA: 'Uimhir iolra ag teastáil anseo?'
    },
    "NUMBER": {
      nameEN: 'Number Disagreement',
      nameGA: 'Uimhir mhícheart',
      color: '#fcac5d', 
      messageEN: 'Number disagreement?', 
      messageGA: 'Uimhir agsu ainmfhocal ag teacht le chéile?'
    }
  } as const;
                

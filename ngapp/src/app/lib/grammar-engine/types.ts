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
      nameGA: 'Spelling',
      color: 'orange', 
      messageEN: 'Spelling Error', 
      messageGA: 'Spelling Error.'
    },
    "MICHEART": {
      nameEN: 'MINOR ERROR',
      nameGA: 'BOTÚN BEAG',
      color: '#FFA3A3', 
      messageEN: 'Do you mean #?', 
      messageGA: 'An é # a bhí ar intinn agat?'
    },
    "MOLADH": {
      nameEN: 'ERROR',
      nameGA: 'BOTÚN',
      color: '#FFA3A3', 
      messageEN: 'Word not recognised: #?', 
      messageGA: 'Níl an fhoirm seo den fhocal sa bhfoclóir: #?'
    },
    "CAIGHDEAN": {
      nameEN: 'NON-STANDARD FORM',
      nameGA: 'FOIRM NEAMHCHAIGHDEÁNACH',
      color: '#FFA3A3', 
      messageEN: 'Is this a non-standard form of #? e.g. a dialect-specific spelling', 
      messageGA: 'An foirm neamhchaighdeánach de  # é seo? m.sh. litriú canúnach'
    },
    "SEIMHIU": {
      nameEN: 'SÉIMHIÚ/LENITION NEEDED',
      nameGA: 'SÉIMHIÚ AG TEASTÁIL',
      color: '#ADD8E6', 
      messageEN: 'Is seimhiú / lenition missing?', 
      messageGA: 'An bhfuil séimhiú ar lár?'
    },
    "GRAM": {
      nameEN: 'GAEILGE?',
      nameGA: 'GAEILGE?',
      color: '#FFA3A3', 
      messageEN: 'Are you sure of the spelling? # is unlike an Irish letter sequence.', 
      messageGA: 'An focal iasachta é seo? Níl dul na Gaeilge ar shraith na litreacha seo #?\''
    },
    "BACHOIR": {
      nameEN: 'LINK WORDS',
      nameGA: 'FOCAIL BHEAGA',
      color: '#FFA3A3', 
      messageEN: 'Consider the use of # here instead', 
      messageGA: 'Cuimhnigh ar # a úsáid anseo'
    },
    "ANAITHNID": {
      nameEN: 'UNRECOGNISED WORD',
      nameGA: 'FOCAL NÁR AITHNÍODH',
      color: '#FFA3A3', 
      messageEN: 'Word not recognised by the system', 
      messageGA: 'Ní aithníonn an córas an focal seo'
    },
    "NISEIMHIU": {
      nameEN: 'REMOVE SÉIMHIÚ/LENITION',
      nameGA: 'SÉIMHIÚ LE BAINT',
      color: '#FFA3A3', 
      messageEN: 'Séimhiú/lenition does not appear to be needed here', 
      messageGA: 'Níl an chuma air go bhfuil gá le séimhiú anseo'
    },
    "COMHCHAIGH": {
      nameEN: 'NON STANDARD COMPOUND?',
      nameGA: 'COMHFHOCAL AS AN NGNÁTH?',
      color: '#FFA3A3', 
      messageEN: 'Not in database but could it be a non-standard compound (#)?', 
      messageGA: "Níl an focal seo sa bhfoclóir ach an comhfhocal neamhchaighdeánach é (#)?"
    },
    "COMHFHOCAL": {
      nameEN: 'COMPOUND?',
      nameGA: 'COMHFHOCAL?',
      color: '#FFA3A3', 
      messageEN: 'Not in database but could it be a compound (#)?', 
      messageGA: "Níl an focal seo sa bhfoclóir ach an comhfhocal é (#)?"
    },
    "NOGENITIVE": {
      nameEN: 'UNNECESSARY GENITIVE',
      nameGA: 'GINIDEACH GAN GHÁ',
      color: '#FFA3A3', 
      messageEN: 'Appears to be an unnecessary use of the genitive case', 
      messageGA: 'Níl sé soiléir go bhfuil an tuiseal ginideach ag teastáil anseo'
    },
    "URU": {
      nameEN: 'URÚ/ECLIPSIS MISSING',
      nameGA: 'URÚ AR LÁR?',
      color: '#FFA3A3', 
      messageEN: 'It looks as though Urú / Eclipsis is needed here', 
      messageGA: 'Tá an chuma air go bhfuil urú ag teastáil anseo'
    },
    "NEAMHCHOIT": {
      nameEN: 'RARE BUT VALID',
      nameGA: 'NEAMHGHNÁCH ACH BAILÍ',
      color: '#FFA3A3', 
      messageEN: 'The is a valid word but extremely rare in actual usage. are you sure this is the word you want here?', 
      messageGA: 'Tá an focal seo bailí ach ní úsáidtear go minic é - an é atá uait anseo?'
    },
    "DROCHMHOIRF": {
      nameEN: 'MISMATCH TO ROOT',
      nameGA: 'DIFRIÚIL ÓN FHRÉAMH',
      color: '#FFA3A3', 
      messageEN: 'Are you sure about this spelling? It differs from the root # we have in database', 
      messageGA: 'An bhfuil tú cinnte faoin leagan seo den fhocal? Difriúil ón bhfréamh # san fhoclóir'
    },
    "MIMHOIRF": {
      nameEN: 'COMMON MISSPELLING',
      nameGA: 'MÍLITRIÚ COITIANTA',
      color: '#FFA3A3', 
      messageEN: 'Did you mean #? This appears to be a common misspelling.', 
      messageGA: 'An é # a bhí i gceist agat? Tá an chuma air gur mílitriú coitianta é seo.?'
    },
    "CUPLA": {
      nameEN: 'UNUSUAL WORD SEQUENCE',
      nameGA: 'SRAITH NEAMHCHOITIANTA FOCAL',
      color: '#FFA3A3', 
      messageEN: 'Unusual combination of words, double check that this is what you meant.', 
      messageGA: 'Bheadh sraith focal mar seo neamhchoitianta, an bhfuil tú cinnte go bhfuil sí ceart go leor?'
    },
    "WEAKSEIMHIU": {
      nameEN: 'LENITION AFTER PREPOSITION',
      nameGA: 'SÉIMHIÚ LE RÉAMHFHOCAL',
      color: '#FFA3A3', 
      messageEN: 'Often the preposition # causes séimhiú/lenition - should there be lenition here?', 
      messageGA: 'Is minicí ná a mhalairt a leanann séimhiú # - ar cheart séimhiú a bheith anseo?'
    },
    "IONADAI": {
      nameEN: 'WORD MI#FFA3A3UP',
      nameGA: 'MEASCÁN FOCAL',
      color: '#FFA3A3', 
      messageEN: 'Valid word but # is more common', 
      messageGA: 'Is ann don fhocal seo, ach tá # níos coitianta'
    },
    "NIURU": {
      nameEN: 'UNNECESSARY URÚ/ECLIPSIS',
      nameGA: 'URÚ GAN GHÁ',
      color: '#FFA3A3', 
      messageEN: 'Unnecessary urú/eclipsis (or problem with preceding word) - check this phrase', 
      messageGA: 'Urú gan ghá (nó focal mícheart roimhe) - seiceáil an nath seo'
    },
    "CLAOCHLU": {
      nameEN: 'SÉIMHIÚ/URÚ NEEDED',
      nameGA: 'GÁ LE SÉIMHIÚ/URÚ',
      color: '#FFA3A3', 
      messageEN: 'Initial mutation missing - add séimhiú/lenition or urú/eclipsis', 
      messageGA: 'Séimhiú nó urú ag teastáil anseo'
    },
    "PREFIXT": {
      nameEN: '\'T\' MISSING',
      nameGA: '\'T\' AR LÁR',
      color: '#FFA3A3', 
      messageEN: 'Prefix \/t\/ missing - this could be a masculine noun, a feminine noun starting with \'s\' or the genitive case ', 
      messageGA: 'Réamhlitir \/t\/ in easnamh - féach ainmfhocail fhirinscneacha / ainmfhocail bhaininscneacha ag tosú le \'s\' nó focail sa tuiseal ginideach'
    },
    "GENITIVE": {
      nameEN: 'GENITIVE MISSING',
      nameGA: 'GINIDEACH AR LÁR',
      color: '#FFA3A3', 
      messageEN: 'It appears the genitive case is required here', 
      messageGA: 'Féachann sé go bhfuil gá leis an tuiseal ginideach anseo'
    },
    "PREFIXH": {
      nameEN: '\'H\' MISSING',
      nameGA: '\'H\' AR LÁR',
      color: '#FFA3A3', 
      messageEN: 'Prefix \/h\/ missing - two vowels together here, one ending a word and the next beginning a new word', 
      messageGA: 'Réamhlitir \/h\/ in easnamh - dhá ghuta ag teacht le chéile anseo, ceann ag deireadh focail agus ceann ag tús an chéad fhocail eile'
    },
    "UATHA": {
      nameEN: 'SINGULAR FORM NEEDED',
      nameGA: 'UIMHIR UATHA AG TEASTÁIL',
      color: '#FFA3A3', 
      messageEN: 'Consider using the singular form here. Hint: always use the singular form after \'cúpla\' and \'gach\'', 
      messageGA: 'An bhfuil gá leis an uimhir uatha anseo? Nod: leanann uimhir uatha \'cúpla\' agus \'gach\''
    },
    "MOIRF": {
      nameEN: 'WORD NOT IN DATABASE',
      nameGA: 'NÍL AN FOCAL SA CHÓRAS',
      color: '#FFA3A3', 
      messageEN: 'Not in database - is this formed from the root # ?', 
      messageGA: 'Focal nach bhfuil sa chóras, an bhfuil sé bunaithe ar # ?'
    },
    "INPHRASE": {
      nameEN: 'SET PHRASE IN DATABASE NOT MATCHED',
      nameGA: 'MÍ-MHEAITSEÁIL LE NATH CAINTE SA CHÓRAS',
      color: '#FFA3A3', 
      messageEN: 'This looks like it should form part of a set phrase  - did you mean # ?', 
      messageGA: 'An cuid de nath cainte é seo? An é # a bhí i gceist?'
    },
    "BREISCHEIM": {
      nameEN: 'COMPARATIVE ADJECTIVE',
      nameGA: 'BREISCHÉIM',
      color: '#FFA3A3', 
      messageEN: 'Comparative adjective detected: check the adjective form after \'níos / ní ba\'', 
      messageGA: 'Breischéim? Seiceáil an aidiacht tar éis \'níos / ní ba\''
    },
    "NIAITCH": {
      nameEN: 'PREFIX \'H\'',
      nameGA: 'Prefix \/d\'\/ missing',
      color: '#FFA3A3', 
      messageEN: 'Does the prefix \/h\/ follow in this context?', 
      messageGA: 'An bhfuil an comhthéacs ceart ann don réamhlitir \/h\/ anseo?'
    },
    "NEEDART": {
      nameEN: 'WORD NOT IN DATABASE',
      nameGA: 'NÍL AN FOCAL SA CHÓRAS',
      color: '#FFA3A3', 
      messageEN: 'Not in database - is this formed from the root # ?', 
      messageGA: 'Focal nach bhfuil sa chóras, an bhfuil sé bunaithe ar # ?'
    },
    "CAIGHMOIRF": {
      nameEN: 'SPELLING OR NON-STANDARD FORM',
      nameGA: 'LITRIÚ NÓ FOIRM NEAMHCHAIGHDEÁNACH',
      color: '#FFA3A3', 
      messageEN: 'Spelling error? or derived from a non-standard form of # ?', 
      messageGA: 'Earráid sa litriú? nó bunaithe ar leagan neamhchaighdeánach de # ?'
    },
    "NITEE": {
      nameEN: 'PREFIX \'T\'',
      nameGA: 'RÉAMHLITIR \'T\'',
      color: '#FFA3A3', 
      messageEN: 'Unnecessary prefix \/t\/ ?', 
      messageGA: 'Réamhlitir \/t\/ gan ghá?'
    },
    "NICLAOCHLU": {
      nameEN: 'UNNECESSARY INITIAL MUTATION',
      nameGA: 'URÚ/SÉIMHIÚ GAN GHÁ',
      color: '#FFA3A3', 
      messageEN: 'Unnecessary initial mutation?', 
      messageGA: 'Urú nó séimhiú gan ghá?'
    },
    "DUBAILTE": {
      nameEN: 'DUPLICATION',
      nameGA: 'DÚBLÁIL',
      color: '#FFA3A3', 
      messageEN: 'Repeated word', 
      messageGA: 'An focal céanna faoi dhó'
    },
    "NOSUBJ": {
      nameEN: 'RESEMBLES SUBJUNCTIVE',
      nameGA: 'COSÚIL LEIS AN MODH FOSHUITEACH',
      color: '#FFA3A3', 
      messageEN: 'Looks like a subjunctive. Did you mean this?', 
      messageGA: 'É seo cosúil leis an modh foshuiteach, ach an é sin atá ar intinn agat?'
    },
    "ABSOLUTE": {
      nameEN: 'DEPENDENT FORM',
      nameGA: 'FOIRM SPLEÁCH',
      color: '#FFA3A3', 
      messageEN: 'Is the dependent form of the verb correct here? (or is previous word misspelled?)', 
      messageGA: 'An bhfuil gá leis an bhfoirm spleách anseo? (nó an bhfuil an focal roimhe litrithe mícheart?)'
    },
    "PREFIXD": {
      nameEN: 'PREFIX \'D\' MISSING',
      nameGA: 'GÁ LE RÉAMHMHÍR \'D\'',
      color: '#FFA3A3', 
      messageEN: 'Is the prefix \/d\'\/ missing here? (see past tense/conditional verbs beginning with a vowel/\'f\')', 
      messageGA: 'An bhfuil gá leis an réamhlitir \/d\'\/ anseo? (féach aimsir chaite / modh coinníollach le focail a thosaíonn le guta/\'f\')'
    },
    "ONEART": {
      nameEN: 'TWO DEFINITE ARTICLES',
      nameGA: 'DHÁ HALT LE HAIS A CHÉILE',
      color: '#FFA3A3', 
      messageEN: 'No need for two definite articles', 
      messageGA: 'Ní gá dhá alt a bheith le hais a chéile (má tá an litriú ceart)'
    },
    "SYNTHETIC": {
      nameEN: 'COMBINED FORM',
      nameGA: 'AN FHOIRM THÁITE',
      color: '#FFA3A3', 
      messageEN: 'The synthetic (combined) form, ending in #, is often used here', 
      messageGA: 'Is é an fhoirm tháite, leis an iarmhír #, a úsáidtear anseo go minic'
    },
    "NODATIVE": {
      nameEN: 'DATIVE',
      nameGA: 'TUISEAL TABHARTHACH',
      color: '#FFA3A3', 
      messageEN: 'Did you mean to use the dative form here?', 
      messageGA: 'Arbh é an tuiseal tabharthach a bhí ar intinn agat?'
    },
    "RELATIVE": {
      nameEN: 'INDEPENDENT FORM',
      nameGA: 'FOIRM NEAMHSPLEÁCH',
      color: '#FFA3A3', 
      messageEN: 'Is the independent form of the verb correct here?', 
      messageGA: 'An bhfuil an fhoirm neamhspleách ceart anseo?'
    },
    "NIDEE": {
      nameEN: 'UNNECESSARY PREFIX \'D\'',
      nameGA: 'RÉAMHMHÍR \'D\' GAN GHÁ',
      color: '#FFA3A3', 
      messageEN: 'Unnecessary prefix \/d\'\/ ?', 
      messageGA: 'Réamhmhír  \/d\'\/ gan ghá?'
    },
    "BADART": {
      nameEN: 'UNNECESSARY DEFINITE ARTICLE',
      nameGA: 'AN T-ALT GAN GHÁ',
      color: '#FFA3A3', 
      messageEN: 'Unnecessary use of the definite article? (double check spelling of noun)', 
      messageGA: 'An bhfuil gá leis an alt anseo?  (féach siar ar litriú an ainmfhocail)'
    },
    "NIGA": {
      nameEN: 'UNNECESSARY WORD',
      nameGA: 'FOCAL GAN GHÁ',
      color: '#FFA3A3', 
      messageEN: 'Is the word # needed?', 
      messageGA: 'An bhfuil gá leis ab bhfocal #?'
    },
    "PRESENT": {
      nameEN: 'MÁ AND THE PRESENT TENSE',
      nameGA: 'MÁ AGUS AN AIMSIR LÁITHREACH',
      color: '#FFA3A3', 
      messageEN: 'Consider using the present tense after \'má\' here', 
      messageGA: 'Úsáid an aimsir láithreach sa chás seo tar éis \'má\''
    },
    "NIDARASEIMHIU": {
      nameEN: 'A SECOND LENITION',
      nameGA: 'AN DARA SÉIMHIÚ',
      color: '#FFA3A3', 
      messageEN: 'Is the second lenition necessary?', 
      messageGA: 'An bhfuil gá leis an dara séimhiú?'
    },
    "NIBEE": {
      nameEN: 'PREFIX \'B\'',
      nameGA: 'RÉAMHLITIR \'B\'',
      color: '#FFA3A3', 
      messageEN: 'Is prefix \/b\'\/ required here?', 
      messageGA: 'An bhfuil gá leis an réamhlitir \/b\'\/ ?'
    },
    "GENDER": {
      nameEN: 'GENDER DISAGREEMENT',
      nameGA: 'INSCNE MHÍCHEART',
      color: '#FFA3A3', 
      messageEN: 'Gender disagreement?', 
      messageGA: 'Inscne mhícheart? '
    },
    "IOLRA": {
      nameEN: 'PLURAL FORM REQUIRED',
      nameGA: 'GÁ LE HUIMHIR IOLRA',
      color: '#FFA3A3', 
      messageEN: 'Is the plural form required here?', 
      messageGA: 'Uimhir iolra ag teastáil anseo?'
    },
    "NUMBER": {
      nameEN: 'NUMBER DISAGREEMENT',
      nameGA: 'UIMHIR MHÍCHEART',
      color: '#FFA3A3', 
      messageEN: 'Number disagreement?', 
      messageGA: 'Uimhir agsu ainmfhocal ag teacht le chéile?'
    }
  } as const;
                
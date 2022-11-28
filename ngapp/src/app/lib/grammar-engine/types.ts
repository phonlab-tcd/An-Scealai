export type GrammarChecker = {
  check: (input: string) => Promise<ErrorTag[]>;
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
      nameEN: 'These vowels should be in agreement according to the Leathan/Caol rule.',
      nameGA: 'Ba cheart go mbeadh na gutaí seo ar aon dul de réir riail Leathan/Caol.',
      color: 'X', 
      messageEN: '', 
      messageGA: ''
    },
    "RELATIVE-CLAUSE": {
      nameEN: '',
      nameGA: '',
      color: 'X', 
      messageEN: '', 
      messageGA: ''
    },
    "MICHEART": {
      nameEN: 'MINOR ERROR',
      nameGA: 'BOTÚN BEAG',
      color: 'X', 
      messageEN: 'Do you mean #?', 
      messageGA: 'An é # a bhí ar intinn agat?'
    },
    "MOLADH": {
      nameEN: 'ERROR',
      nameGA: 'BOTÚN',
      color: 'X', 
      messageEN: 'Y', 
      messageGA: 'Z'
    },
    "CAIGHDEAN": {
      nameEN: 'NON-STANDARD FORM',
      nameGA: 'FOIRM NEAMHCHAIGHDEÁNACH',
      color: 'X', 
      messageEN: 'Is this a non-standard form of #? e.g. a dialect-specific spelling', 
      messageGA: 'An foirm neamhchaighdeánach de  # é seo? m.sh. litriú canúnach'
    },
    "SEIMHIU": {
      nameEN: 'SÉIMHIÚ/LENITION NEEDED',
      nameGA: 'SÉIMHIÚ AG TEASTÁIL',
      color: 'X', 
      messageEN: 'Is seimhiú / lenition missing?', 
      messageGA: 'An bhfuil séimhiú ar lár?'
    },
    "GRAM": {
      nameEN: 'GAEILGE?',
      nameGA: 'GAEILGE?',
      color: 'X', 
      messageEN: 'Are you sure of the spelling? # is unlike an Irish letter sequence.', 
      messageGA: 'An focal iasachta é seo? Níl dul na Gaeilge ar shraith na litreacha seo #?\''
    },
    "BACHOIR": {
      nameEN: 'LINK WORDS',
      nameGA: 'FOCAIL BHEAGA',
      color: 'X', 
      messageEN: 'Consider the use of # here instead', 
      messageGA: 'Cuimhnigh ar # a úsáid anseo'
    },
    "ANAITHNID": {
      nameEN: 'UNRECOGNISED WORD',
      nameGA: 'FOCAL NÁR AITHNÍODH',
      color: 'X', 
      messageEN: 'Word not recognised by the system', 
      messageGA: 'Ní aithníonn an córas an focal seo'
    },
    "NISEIMHIU": {
      nameEN: 'REMOVE SÉIMHIÚ/LENITION',
      nameGA: 'SÉIMHIÚ LE BAINT',
      color: 'X', 
      messageEN: 'Séimhiú/lenition does not appear to be needed here', 
      messageGA: 'Níl an chuma air go bhfuil gá le séimhiú anseo'
    },
    "COMHCHAIGH": {
      nameEN: 'NON STANDARD COMPOUND?',
      nameGA: 'COMHFHOCAL AS AN NGNÁTH?',
      color: 'X', 
      messageEN: 'Not in database but could it be a non-standard compound (#)?', 
      messageGA: "Níl an focal seo sa bhfoclóir ach an comhfhocal neamhchaighdeánach é (#)?"
    },
    "COMHFHOCAL": {
      nameEN: 'COMPOUND?',
      nameGA: 'COMHFHOCAL?',
      color: 'X', 
      messageEN: 'Not in database but could it be a compound (#)?', 
      messageGA: "Níl an focal seo sa bhfoclóir ach an comhfhocal é (#)?"
    },
    "NOGENITIVE": {
      nameEN: 'UNNECESSARY GENITIVE',
      nameGA: 'GINIDEACH GAN GHÁ',
      color: 'X', 
      messageEN: 'Appears to be an unnecessary use of the genitive case', 
      messageGA: 'Níl sé soiléir go bhfuil an tuiseal ginideach ag teastáil anseo'
    },
    "URU": {
      nameEN: 'URÚ/ECLIPSIS MISSING',
      nameGA: 'URÚ AR LÁR?',
      color: 'X', 
      messageEN: 'It looks as though Urú / Eclipsis is needed here', 
      messageGA: 'Tá an chuma air go bhfuil urú ag teastáil anseo'
    },
    "NEAMHCHOIT": {
      nameEN: 'RARE BUT VALID',
      nameGA: 'NEAMHGHNÁCH ACH BAILÍ',
      color: 'X', 
      messageEN: 'The is a valid word but extremely rare in actual usage. are you sure this is the word you want here?', 
      messageGA: 'Tá an focal seo bailí ach ní úsáidtear go minic é - an é atá uait anseo?'
    },
    "DROCHMHOIRF": {
      nameEN: 'MISMATCH TO ROOT',
      nameGA: 'DIFRIÚIL ÓN FHRÉAMH',
      color: 'X', 
      messageEN: 'Are you sure about this spelling? It differs from the root # we have in database', 
      messageGA: 'An bhfuil tú cinnte faoin leagan seo den fhocal? Difriúil ón bhfréamh # san fhoclóir'
    },
    "MIMHOIRF": {
      nameEN: 'COMMON MISSPELLING',
      nameGA: 'MÍLITRIÚ COITIANTA',
      color: 'X', 
      messageEN: 'Did you mean #? This appears to be a common misspelling.', 
      messageGA: 'An é # a bhí i gceist agat? Tá an chuma air gur mílitriú coitianta é seo.?'
    },
    "CUPLA": {
      nameEN: 'UNUSUAL WORD SEQUENCE',
      nameGA: 'SRAITH NEAMHCHOITIANTA FOCAL',
      color: 'X', 
      messageEN: 'Unusual combination of words, double check that this is what you meant.', 
      messageGA: 'Bheadh sraith focal mar seo neamhchoitianta, an bhfuil tú cinnte go bhfuil sí ceart go leor?'
    },
    "WEAKSEIMHIU": {
      nameEN: 'LENITION AFTER PREPOSITION',
      nameGA: 'SÉIMHIÚ LE RÉAMHFHOCAL',
      color: 'X', 
      messageEN: 'Often the preposition # causes séimhiú/lenition - should there be lenition here?', 
      messageGA: 'Is minicí ná a mhalairt a leanann séimhiú # - ar cheart séimhiú a bheith anseo?'
    },
    "IONADAI": {
      nameEN: 'WORD MIXUP',
      nameGA: 'MEASCÁN FOCAL',
      color: 'X', 
      messageEN: 'Valid word but # is more common', 
      messageGA: 'Is ann don fhocal seo, ach tá # níos coitianta'
    },
    "NIURU": {
      nameEN: 'UNNECESSARY URÚ/ECLIPSIS',
      nameGA: 'URÚ GAN GHÁ',
      color: 'X', 
      messageEN: 'Unnecessary urú/eclipsis (or problem with preceding word) - check this phrase', 
      messageGA: 'Urú gan ghá (nó focal mícheart roimhe) - seiceáil an nath seo'
    },
    "CLAOCHLU": {
      nameEN: 'SÉIMHIÚ/URÚ NEEDED',
      nameGA: 'GÁ LE SÉIMHIÚ/URÚ',
      color: 'X', 
      messageEN: 'Initial mutation missing - add séimhiú/lenition or urú/eclipsis', 
      messageGA: 'Séimhiú nó urú ag teastáil anseo'
    },
    "PREFIXT": {
      nameEN: '\'T\' MISSING',
      nameGA: '\'T\' AR LÁR',
      color: 'X', 
      messageEN: 'Prefix \/t\/ missing - this could be a masculine noun, a feminine noun starting with \'s\' or the genitive case ', 
      messageGA: 'Réamhlitir \/t\/ in easnamh - féach ainmfhocail fhirinscneacha / ainmfhocail bhaininscneacha ag tosú le \'s\' nó focail sa tuiseal ginideach'
    },
    "GENITIVE": {
      nameEN: 'GENITIVE MISSING',
      nameGA: 'GINIDEACH AR LÁR',
      color: 'X', 
      messageEN: 'It appears the genitive case is required here', 
      messageGA: 'Féachann sé go bhfuil gá leis an tuiseal ginideach anseo'
    },
    "PREFIXH": {
      nameEN: '\'H\' MISSING',
      nameGA: '\'H\' AR LÁR',
      color: 'X', 
      messageEN: 'Prefix \/h\/ missing - two vowels together here, one ending a word and the next beginning a new word', 
      messageGA: 'Réamhlitir \/h\/ in easnamh - dhá ghuta ag teacht le chéile anseo, ceann ag deireadh focail agus ceann ag tús an chéad fhocail eile'
    },
    "UATHA": {
      nameEN: 'SINGULAR FORM NEEDED',
      nameGA: 'UIMHIR UATHA AG TEASTÁIL',
      color: 'X', 
      messageEN: 'Consider using the singular form here. Hint: always use the singular form after \'cúpla\' and \'gach\'', 
      messageGA: 'An bhfuil gá leis an uimhir uatha anseo? Nod: leanann uimhir uatha \'cúpla\' agus \'gach\''
    },
    "MOIRF": {
      nameEN: 'WORD NOT IN DATABASE',
      nameGA: 'NÍL AN FOCAL SA CHÓRAS',
      color: 'X', 
      messageEN: 'Not in database - is this formed from the root # ?', 
      messageGA: 'Focal nach bhfuil sa chóras, an bhfuil sé bunaithe ar # ?'
    },
    "INPHRASE": {
      nameEN: 'WORD NOT IN DATABASE',
      nameGA: 'NÍL AN FOCAL SA CHÓRAS',
      color: 'X', 
      messageEN: 'Not in database - is this formed from the root # ?', 
      messageGA: 'Focal nach bhfuil sa chóras, an bhfuil sé bunaithe ar # ?'
    },
    "BREISCHEIM": {
      nameEN: 'WORD NOT IN DATABASE',
      nameGA: 'NÍL AN FOCAL SA CHÓRAS',
      color: 'X', 
      messageEN: 'Not in database - is this formed from the root # ?', 
      messageGA: 'Focal nach bhfuil sa chóras, an bhfuil sé bunaithe ar # ?'
    },
    "NIAITCH": {
      nameEN: 'WORD NOT IN DATABASE',
      nameGA: 'NÍL AN FOCAL SA CHÓRAS',
      color: 'X', 
      messageEN: 'Not in database - is this formed from the root # ?', 
      messageGA: 'Focal nach bhfuil sa chóras, an bhfuil sé bunaithe ar # ?'
    },
    "NEEDART": {
      nameEN: 'WORD NOT IN DATABASE',
      nameGA: 'NÍL AN FOCAL SA CHÓRAS',
      color: 'X', 
      messageEN: 'Not in database - is this formed from the root # ?', 
      messageGA: 'Focal nach bhfuil sa chóras, an bhfuil sé bunaithe ar # ?'
    },
    "CAIGHMOIRF": {
      nameEN: 'WORD NOT IN DATABASE',
      nameGA: 'NÍL AN FOCAL SA CHÓRAS',
      color: 'X', 
      messageEN: 'Not in database - is this formed from the root # ?', 
      messageGA: 'Focal nach bhfuil sa chóras, an bhfuil sé bunaithe ar # ?'
    },
    "NITEE": {
      nameEN: 'WORD NOT IN DATABASE',
      nameGA: 'NÍL AN FOCAL SA CHÓRAS',
      color: 'X', 
      messageEN: 'Not in database - is this formed from the root # ?', 
      messageGA: 'Focal nach bhfuil sa chóras, an bhfuil sé bunaithe ar # ?'
    },
    "NICLAOCHLU": {
      nameEN: 'WORD NOT IN DATABASE',
      nameGA: 'NÍL AN FOCAL SA CHÓRAS',
      color: 'X', 
      messageEN: 'Not in database - is this formed from the root # ?', 
      messageGA: 'Focal nach bhfuil sa chóras, an bhfuil sé bunaithe ar # ?'
    },
    "DUBAILTE": {
      nameEN: 'WORD NOT IN DATABASE',
      nameGA: 'NÍL AN FOCAL SA CHÓRAS',
      color: 'X', 
      messageEN: 'Not in database - is this formed from the root # ?', 
      messageGA: 'Focal nach bhfuil sa chóras, an bhfuil sé bunaithe ar # ?'
    },
    "NOSUBJ": {
      nameEN: 'WORD NOT IN DATABASE',
      nameGA: 'NÍL AN FOCAL SA CHÓRAS',
      color: 'X', 
      messageEN: 'Not in database - is this formed from the root # ?', 
      messageGA: 'Focal nach bhfuil sa chóras, an bhfuil sé bunaithe ar # ?'
    },
    "ABSOLUTE": {
      nameEN: 'WORD NOT IN DATABASE',
      nameGA: 'NÍL AN FOCAL SA CHÓRAS',
      color: 'X', 
      messageEN: 'Not in database - is this formed from the root # ?', 
      messageGA: 'Focal nach bhfuil sa chóras, an bhfuil sé bunaithe ar # ?'
    },
    "PREFIXD": {
      nameEN: 'WORD NOT IN DATABASE',
      nameGA: 'NÍL AN FOCAL SA CHÓRAS',
      color: 'X', 
      messageEN: 'Not in database - is this formed from the root # ?', 
      messageGA: 'Focal nach bhfuil sa chóras, an bhfuil sé bunaithe ar # ?'
    },
    "ONEART": {
      nameEN: 'WORD NOT IN DATABASE',
      nameGA: 'NÍL AN FOCAL SA CHÓRAS',
      color: 'X', 
      messageEN: 'Not in database - is this formed from the root # ?', 
      messageGA: 'Focal nach bhfuil sa chóras, an bhfuil sé bunaithe ar # ?'
    },
    "SYNTHETIC": {
      nameEN: 'WORD NOT IN DATABASE',
      nameGA: 'NÍL AN FOCAL SA CHÓRAS',
      color: 'X', 
      messageEN: 'Not in database - is this formed from the root # ?', 
      messageGA: 'Focal nach bhfuil sa chóras, an bhfuil sé bunaithe ar # ?'
    },
    "NODATIVE": {
      nameEN: 'WORD NOT IN DATABASE',
      nameGA: 'NÍL AN FOCAL SA CHÓRAS',
      color: 'X', 
      messageEN: 'Not in database - is this formed from the root # ?', 
      messageGA: 'Focal nach bhfuil sa chóras, an bhfuil sé bunaithe ar # ?'
    },
    "RELATIVE": {
      nameEN: 'WORD NOT IN DATABASE',
      nameGA: 'NÍL AN FOCAL SA CHÓRAS',
      color: 'X', 
      messageEN: 'Not in database - is this formed from the root # ?', 
      messageGA: 'Focal nach bhfuil sa chóras, an bhfuil sé bunaithe ar # ?'
    },
    "NIDEE": {
      nameEN: 'WORD NOT IN DATABASE',
      nameGA: 'NÍL AN FOCAL SA CHÓRAS',
      color: 'X', 
      messageEN: 'Not in database - is this formed from the root # ?', 
      messageGA: 'Focal nach bhfuil sa chóras, an bhfuil sé bunaithe ar # ?'
    },
    "BADART": {
      nameEN: 'WORD NOT IN DATABASE',
      nameGA: 'NÍL AN FOCAL SA CHÓRAS',
      color: 'X', 
      messageEN: 'Not in database - is this formed from the root # ?', 
      messageGA: 'Focal nach bhfuil sa chóras, an bhfuil sé bunaithe ar # ?'
    },
    "NIGA": {
      nameEN: 'WORD NOT IN DATABASE',
      nameGA: 'NÍL AN FOCAL SA CHÓRAS',
      color: 'X', 
      messageEN: 'Not in database - is this formed from the root # ?', 
      messageGA: 'Focal nach bhfuil sa chóras, an bhfuil sé bunaithe ar # ?'
    },
    "PRESENT": {
      nameEN: 'WORD NOT IN DATABASE',
      nameGA: 'NÍL AN FOCAL SA CHÓRAS',
      color: 'X', 
      messageEN: 'Not in database - is this formed from the root # ?', 
      messageGA: 'Focal nach bhfuil sa chóras, an bhfuil sé bunaithe ar # ?'
    },
    "NIDARASEIMHIU": {
      nameEN: 'WORD NOT IN DATABASE',
      nameGA: 'NÍL AN FOCAL SA CHÓRAS',
      color: 'X', 
      messageEN: 'Not in database - is this formed from the root # ?', 
      messageGA: 'Focal nach bhfuil sa chóras, an bhfuil sé bunaithe ar # ?'
    },
    "NIBEE": {
      nameEN: 'WORD NOT IN DATABASE',
      nameGA: 'NÍL AN FOCAL SA CHÓRAS',
      color: 'X', 
      messageEN: 'Not in database - is this formed from the root # ?', 
      messageGA: 'Focal nach bhfuil sa chóras, an bhfuil sé bunaithe ar # ?'
    },
    "GENDER": {
      nameEN: 'WORD NOT IN DATABASE',
      nameGA: 'NÍL AN FOCAL SA CHÓRAS',
      color: 'X', 
      messageEN: 'Not in database - is this formed from the root # ?', 
      messageGA: 'Focal nach bhfuil sa chóras, an bhfuil sé bunaithe ar # ?'
    },
    "IOLRA": {
      nameEN: 'WORD NOT IN DATABASE',
      nameGA: 'NÍL AN FOCAL SA CHÓRAS',
      color: 'X', 
      messageEN: 'Not in database - is this formed from the root # ?', 
      messageGA: 'Focal nach bhfuil sa chóras, an bhfuil sé bunaithe ar # ?'
    },
    "NUMBER": {
      nameEN: 'WORD NOT IN DATABASE',
      nameGA: 'NÍL AN FOCAL SA CHÓRAS',
      color: 'X', 
      messageEN: 'Not in database - is this formed from the root # ?', 
      messageGA: 'Focal nach bhfuil sa chóras, an bhfuil sé bunaithe ar # ?'
    }
  } as const;
                
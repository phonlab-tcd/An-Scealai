const User = require('../../models/user');

let studentEntries = [
{
	"_id" : "630641585a00d4b783905813",
	"sentences" : [
		{
			"errors" : [
				{
					"start" : 4,
					"length" : 7,
					"type" : "CAIGHDEAN",
					"tooltip" : null,
					"messages" : {
						"en" : "Non-standard form of /daoibh/",
						"ga" : "Foirm neamhchaighdeánach de ‘daoibh’"
					}
				}
			],
			"sentence" : "Dia Dhaoibh!"
		},
		{
			"errors" : [ ],
			"sentence" : "Tá súil agam go raibh seachtain mhaith ag gach duine."
		},
		{
			"errors" : [
				{
					"start" : 137,
					"length" : 8,
					"type" : "MOLADH",
					"tooltip" : null,
					"messages" : {
						"en" : "Unknown word: /hurlabhra/?",
						"ga" : "Focal anaithnid: ‘hurlabhra’?"
					}
				},
				{
					"start" : 146,
					"length" : 7,
					"type" : "NEEDART",
					"tooltip" : null,
					"messages" : {
						"en" : "Definite article required",
						"ga" : "Ba chóir duit an t-alt cinnte a úsáid"
					}
				}
			],
			"sentence" : "Bhain mé taitneamh as ár bplé an tseachtain seo, tá teicneolaíocht na hurlabha nua seo ar fad corraitheach."
		},
		{
			"errors" : [
				{
					"start" : 186,
					"length" : 12,
					"type" : "UATHA",
					"tooltip" : null,
					"messages" : {
						"en" : "The singular form is required here",
						"ga" : "Tá gá leis an leagan uatha anseo"
					}
				},
				{
					"start" : 223,
					"length" : 8,
					"type" : "GRAM",
					"tooltip" : null,
					"messages" : {
						"en" : "Possibly a foreign word (the sequence /Duo/ is highly improbable)",
						"ga" : "B'fhéidir gur focal iasachta é seo (tá na litreacha ‘Duo’ neamhchoitianta)"
					}
				}
			],
			"sentence" : "Mar a deir cúpla daoine eile, ceapaim go bhfuil Duolingo an teicneolaíocht teanga is mó tóir."
		},
		{
			"errors" : [ ],
			"sentence" : "Tá a fhios agam go mbaineann go leor de mo chairde úsáid as."
		},
		{
			"errors" : [ ],
			"sentence" : "Bhí sé an-úsáideach dom san am atá thart freisin."
		},
		{
			"errors" : [ ],
			"sentence" : "D'úsáid mé é chun Iodáilis a fhoghlaim, nuair a bhí mé san idirbhliain."
		},
		{
			"errors" : [
				{
					"start" : 472,
					"length" : 3,
					"type" : "MOLADH",
					"tooltip" : null,
					"messages" : {
						"en" : "Unknown word: /ais, air, asp, ait/?",
						"ga" : "Focal anaithnid: ‘asp, air, ait, ais’?"
					}
				},
				{
					"start" : 476,
					"length" : 12,
					"type" : "MOIRF",
					"tooltip" : null,
					"messages" : {
						"en" : "Not in database but apparently formed from the root /chabhrach/",
						"ga" : "Focal anaithnid ach bunaithe ar ‘chabhrach’ is dócha"
					}
				}
			],
			"sentence" : "Shíl mé go raibh an aip an-chabhrach, ach ar an drochuair níor choinnigh mé suas le mo chuid foghlama air."
		},
		{
			"errors" : [ ],
			"sentence" : "Tá dearmad déanta agam ar a lán de anois!"
		},
		{
			"errors" : [
				{
					"start" : 641,
					"length" : 7,
					"type" : "MOLADH",
					"tooltip" : null,
					"messages" : {
						"en" : "Unknown word: /Erasmus/?",
						"ga" : "Focal anaithnid: ‘Erasmus’?"
					}
				}
			],
			"sentence" : "Fuair a lán de mo chairde atá ag dul ar erasmus i mbliana gur acmhainn iontach é."
		},
		{
			"errors" : [
				{
					"start" : 701,
					"length" : 12,
					"type" : "COMHFHOCAL",
					"tooltip" : null,
					"messages" : {
						"en" : "Not in database but may be a compound /bun+eilimintí/?",
						"ga" : "Focal anaithnid ach b'fhéidir gur comhfhocal ‘bun+eilimintí’ é?"
					}
				}
			],
			"sentence" : "Foghlaimíonn siad buneilimintí theanga na tíre a mbeidh siad ag staidéar ann, mar shampla Ollainnis, Spáinnis, nó Fraincis."
		},
		{
			"errors" : [ ],
			"sentence" : "Maidir leis an gcóras aitheanta cainte, fuair mé amach gur phioc sé an méid a bhí á rá agam go gasta."
		},
		{
			"errors" : [ ],
			"sentence" : "Ní dhearna sé ach botúin ar chúpla focal."
		},
		{
			"errors" : [
				{
					"start" : 987,
					"length" : 6,
					"type" : "PREFIXH",
					"tooltip" : null,
					"messages" : {
						"en" : "Prefix /h/ missing",
						"ga" : "Réamhlitir ‘h’ ar iarraidh"
					}
				}
			],
			"sentence" : "De ghnáth, bhí na botúin ar fhocail le urú."
		},
		{
			"errors" : [ ],
			"sentence" : "Is fíor nach raibh mórán teicneolaíochtaí urlabhra agus teanga ar fáil do na mionteangacha ann roimhe seo, mar sin is feabhas mór é seo."
		},
		{
			"errors" : [ ],
			"sentence" : "Is bealach iontach é freisin chun an Ghaeilge a dhéanamh níos inrochtana, do dhaoine bodhra nó dall."
		},
		{
			"errors" : [ ],
			"sentence" : "Is dea-scéal é seo, mar ní raibh seirbhísí riamh ann mar théacs go hurlabhra don Ghaeilge san am atá thart."
		},
		{
			"errors" : [ ],
			"sentence" : "Nach iontach an dul chun cinn atá á dhéanamh?"
		},
		{
			"errors" : [
				{
					"start" : 1387,
					"length" : 8,
					"type" : "SEIMHIU",
					"tooltip" : null,
					"messages" : {
						"en" : "Lenition missing",
						"ga" : "Séimhiú ar iarraidh"
					}
				}
			],
			"sentence" : "Mo madra."
		},
		{
			"errors" : [
				{
					"start" : 1397,
					"length" : 8,
					"type" : "SEIMHIU",
					"tooltip" : null,
					"messages" : {
						"en" : "Lenition missing",
						"ga" : "Séimhiú ar iarraidh"
					}
				}
			],
			"sentence" : "Mo madra."
		},
		{
			"errors" : [ ],
			"sentence" : "Dia duit."
		},
		{
			"errors" : [
				{
					"start" : 1417,
					"length" : 8,
					"type" : "SEIMHIU",
					"tooltip" : null,
					"messages" : {
						"en" : "Lenition missing",
						"ga" : "Séimhiú ar iarraidh"
					}
				},
				{
					"start" : 1426,
					"length" : 8,
					"type" : "SEIMHIU",
					"tooltip" : null,
					"messages" : {
						"en" : "Lenition missing",
						"ga" : "Séimhiú ar iarraidh"
					}
				}
			],
			"sentence" : "Mo madra mo madra"
		}
	],
	"owner" : "5eecb2edb3d14b78e1c74e9c",
	"storyId" : "5fcb838cf70d505ae91a8bda",
	"timestamp" : new Date("2022-08-24T15:18:48.893Z"),
	"__v" : 0
},
{
	"_id" : "630c8a2ed51f6c0d71b4ffab",
	"sentences" : [
		{
			"errors" : [
				{
					"start" : 4,
					"length" : 7,
					"type" : "CAIGHDEAN",
					"tooltip" : null,
					"messages" : {
						"en" : "Non-standard form of /daoibh/",
						"ga" : "Foirm neamhchaighdeánach de ‘daoibh’"
					}
				}
			],
			"sentence" : "Dia Dhaoibh!"
		},
		{
			"errors" : [ ],
			"sentence" : "Tá súil agam go raibh seachtain mhaith ag gach duine."
		},
		{
			"errors" : [
				{
					"start" : 137,
					"length" : 8,
					"type" : "MOLADH",
					"tooltip" : null,
					"messages" : {
						"en" : "Unknown word: /hurlabhra/?",
						"ga" : "Focal anaithnid: ‘hurlabhra’?"
					}
				},
				{
					"start" : 146,
					"length" : 7,
					"type" : "NEEDART",
					"tooltip" : null,
					"messages" : {
						"en" : "Definite article required",
						"ga" : "Ba chóir duit an t-alt cinnte a úsáid"
					}
				}
			],
			"sentence" : "Bhain mé taitneamh as ár bplé an tseachtain seo, tá teicneolaíocht na hurlabha nua seo ar fad corraitheach."
		},
		{
			"errors" : [
				{
					"start" : 186,
					"length" : 12,
					"type" : "UATHA",
					"tooltip" : null,
					"messages" : {
						"en" : "The singular form is required here",
						"ga" : "Tá gá leis an leagan uatha anseo"
					}
				},
				{
					"start" : 223,
					"length" : 8,
					"type" : "GRAM",
					"tooltip" : null,
					"messages" : {
						"en" : "Possibly a foreign word (the sequence /Duo/ is highly improbable)",
						"ga" : "B'fhéidir gur focal iasachta é seo (tá na litreacha ‘Duo’ neamhchoitianta)"
					}
				}
			],
			"sentence" : "Mar a deir cúpla daoine eile, ceapaim go bhfuil Duolingo an teicneolaíocht teanga is mó tóir."
		},
		{
			"errors" : [ ],
			"sentence" : "Tá a fhios agam go mbaineann go leor de mo chairde úsáid as."
		},
		{
			"errors" : [ ],
			"sentence" : "Bhí sé an-úsáideach dom san am atá thart freisin."
		},
		{
			"errors" : [ ],
			"sentence" : "D'úsáid mé é chun Iodáilis a fhoghlaim, nuair a bhí mé san idirbhliain."
		},
		{
			"errors" : [
				{
					"start" : 472,
					"length" : 3,
					"type" : "MOLADH",
					"tooltip" : null,
					"messages" : {
						"en" : "Unknown word: /air, ais, ait, asp/?",
						"ga" : "Focal anaithnid: ‘ait, air, asp, ais’?"
					}
				},
				{
					"start" : 476,
					"length" : 12,
					"type" : "MOIRF",
					"tooltip" : null,
					"messages" : {
						"en" : "Not in database but apparently formed from the root /chabhrach/",
						"ga" : "Focal anaithnid ach bunaithe ar ‘chabhrach’ is dócha"
					}
				}
			],
			"sentence" : "Shíl mé go raibh an aip an-chabhrach, ach ar an drochuair níor choinnigh mé suas le mo chuid foghlama air."
		},
		{
			"errors" : [ ],
			"sentence" : "Tá dearmad déanta agam ar a lán de anois!"
		},
		{
			"errors" : [
				{
					"start" : 641,
					"length" : 7,
					"type" : "MOLADH",
					"tooltip" : null,
					"messages" : {
						"en" : "Unknown word: /Erasmus/?",
						"ga" : "Focal anaithnid: ‘Erasmus’?"
					}
				},
				{
					"start" : 701,
					"length" : 12,
					"type" : "COMHFHOCAL",
					"tooltip" : null,
					"messages" : {
						"en" : "Not in database but may be a compound /bun+eilimintí/?",
						"ga" : "Focal anaithnid ach b'fhéidir gur comhfhocal ‘bun+eilimintí’ é?"
					}
				}
			],
			"sentence" : "Fuair a lán de mo chairde atá ag dul ar erasmus i mbliana gur acmhainn iontach é. Foghlaimíonn siad buneilimintí theanga na tíre a mbeidh siad ag staidéar ann, mar shampla Ollainnis, Spáinnis, nó Fraincis."
		},
		{
			"errors" : [ ],
			"sentence" : "Maidir leis an gcóras aitheanta cainte, fuair mé amach gur phioc sé an méid a bhí á rá agam go gasta."
		},
		{
			"errors" : [ ],
			"sentence" : "Ní dhearna sé ach botúin ar chúpla focal."
		},
		{
			"errors" : [
				{
					"start" : 987,
					"length" : 6,
					"type" : "PREFIXH",
					"tooltip" : null,
					"messages" : {
						"en" : "Prefix /h/ missing",
						"ga" : "Réamhlitir ‘h’ ar iarraidh"
					}
				}
			],
			"sentence" : "De ghnáth, bhí na botúin ar fhocail le urú."
		},
		{
			"errors" : [ ],
			"sentence" : "Is fíor nach raibh mórán teicneolaíochtaí urlabhra agus teanga ar fáil do na mionteangacha ann roimhe seo, mar sin is feabhas mór é seo."
		},
		{
			"errors" : [ ],
			"sentence" : "Is bealach iontach é freisin chun an Ghaeilge a dhéanamh níos inrochtana, do dhaoine bodhra nó dall."
		},
		{
			"errors" : [ ],
			"sentence" : "Is dea-scéal é seo, mar ní raibh seirbhísí riamh ann mar théacs go hurlabhra don Ghaeilge san am atá thart."
		},
		{
			"errors" : [ ],
			"sentence" : "Nach iontach an dul chun cinn atá á dhéanamh?"
		},
		{
			"errors" : [
				{
					"start" : 1387,
					"length" : 8,
					"type" : "SEIMHIU",
					"tooltip" : null,
					"messages" : {
						"en" : "Lenition missing",
						"ga" : "Séimhiú ar iarraidh"
					}
				}
			],
			"sentence" : "Mo madra."
		},
		{
			"errors" : [
				{
					"start" : 1397,
					"length" : 8,
					"type" : "SEIMHIU",
					"tooltip" : null,
					"messages" : {
						"en" : "Lenition missing",
						"ga" : "Séimhiú ar iarraidh"
					}
				}
			],
			"sentence" : "Mo madra."
		},
		{
			"errors" : [ ],
			"sentence" : "Dia duit."
		},
		{
			"errors" : [
				{
					"start" : 1417,
					"length" : 8,
					"type" : "BUACHAIL",
					"tooltip" : null,
					"messages" : {
						"en" : "Lenition missing",
						"ga" : "Séimhiú ar iarraidh"
					}
				}
			],
			"sentence" : "Mo madra mo mhadra mo mhadra"
		}
	],
	"owner" : "5eecb2edb3d14b78e1c74e9c",
	"storyId" : "5fcb838cf70d505ae91a8bda",
	"timestamp" : new Date("2022-08-29T09:43:10.205Z"),
	"__v" : 0
}
]

const errorSet = [];

// create an array of {error, sentence, timestamp}
for (const errorObject of studentEntries) {
  for (const entry of errorObject.sentences) {
    if (entry.errors.length > 0) {
      for (const error of entry.errors) {
        errorEntry = {error: error.type, sentence: entry.sentence,
          date: errorObject.timestamp.toISOString().slice(0, 10)};
        errorSet.push(errorEntry);
      }
    }
  }
}

// filter out errors that appear in the same sentence on the same day
const unique = errorSet.filter((o, i) =>
  i === errorSet.findIndex((oo) => o.error === oo.error &&
    o.sentence === oo.sentence && o.date === oo.date),
);

console.log(unique.length);


const errorDict = {};

// create a dictionary of errors and dates that the error was made
for (const entry of unique) {
  if (entry.error in errorDict) {
    if (entry.date in error_dict[entry.error]) {
      error_dict[entry.error][entry.date] += 1;
    } else {
      error_dict[entry.error][entry.date] = 1;
    }
  } else {
    error_dict[entry.error] = {};
    error_dict[entry.error][entry.date] = 1;
  }
}

console.log(errorDict);


/**
 * Returns a dictionary of errors and dates for a given student
 *
 * @param req {Object}
 * @param res {Object}
 * @return {Object} error dictionary
 */
async function getGrammarErrors(req, res) {
  return res.status(200).json(errorDict);
}

module.exports = getGrammarErrors;

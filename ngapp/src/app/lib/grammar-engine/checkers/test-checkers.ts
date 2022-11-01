import { leathanCaolChecker } from './leathan-caol-checker';
import { anGramadoir } from './an-gramadoir';
import { genitiveChecker } from './genitive-checker';
import { relativeClauseChecker } from './relative-clause-checker';


async function test() {
  console.log(await leathanCaolChecker.check("Is bealach iontach é freisin chun an Ghaeilge a dhéanamh níos inrochtana"));
  //console.log(await anGramadoir.check("Bhain mé taitneamh as ár bplé an tseachtain seo, tá teicneolaíocht na hurlabha nua seo ar fad corraitheach"));
  //console.log(await genitiveChecker.check("Mála an fear"));
  console.log(await relativeClauseChecker.check("an bord ar a bhfuil an forc"));
}

test();
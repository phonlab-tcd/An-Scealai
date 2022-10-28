import { leathanCaolChecker } from './leathan-caol-checker';
import { anGramadoir } from './an-gramadoir';


async function test() {
  //console.log(await leathanCaolChecker.check("Is bealach iontach é freisin chun an Ghaeilge a dhéanamh níos inrochtana"));
  console.log(await anGramadoir.check("Bhain mé taitneamh as ár bplé an tseachtain seo, tá teicneolaíocht na hurlabha nua seo ar fad corraitheach"));
}

test();
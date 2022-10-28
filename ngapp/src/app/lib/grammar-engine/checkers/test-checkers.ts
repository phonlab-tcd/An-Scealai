import { leathanCaolChecker } from './leathan-caol-checker';


async function test() {
  console.log(await leathanCaolChecker.check("Is bealach iontach é freisin chun an Ghaeilge a dhéanamh níos inrochtana"));
}

test();
import {getDraw} from "./svenskaspel/stryktipset/api-client.js";
import fs from 'fs-extra';

// Or
const main = async function () {

  console.log("Fetching next draw");
  let draw = await getDraw();
  try {
    await fs.writeJson('draws/draw.json', draw, {spaces: 2, EOL: '\n'});
    console.log('success!')
  } catch (err) {
    console.error(err)
  }

};


(async () => {
  await main();
})().catch(e => {
  console.log("error, " + e)
});

function printStats(draw) {
  console.log(draw);

}


// getData(url).then(r => console.log("Do nothing"));

/*

const axios = require("axios");


const getData = async url => {
  try {
    const response = await axios.get(url);
    const data = response.data;
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

return getData(url);
*/

/*

const calculateFromPercentageToOdds = function (percentage) {
  const percentageAsDecimal = percentage / 100;
  const valueToRound = (1 / percentageAsDecimal) * 100;
  return Math.round(valueToRound) / 100;
};

console.log("percentage: 90 is " + calculateFromPercentageToOdds(90));
*/

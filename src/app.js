import {getDraw} from "./svenskaspel/stryktipset/stryktipset-api.js";

const main = async function () {


  console.log("Fetching next draw");

  await getDraw();
  console.log();
};


(async () => {
  await main();
})().catch(e => {
  console.log("error, " + e)
});


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

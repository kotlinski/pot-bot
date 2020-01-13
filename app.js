console.log("hello world");
console.log("percentage: 90 is " + calculateFromPercentageToOdds(90));

const fs = require('fs');

fs.readFile('site.html', 'utf8', function(err, contents) {
  console.log(contents);
});

console.log('after calling readFile');
function calculateFromPercentageToOdds(percentage) {
  const percentageAsDecimal = percentage / 100;
  const valueToRound = (1 / percentageAsDecimal) * 100;
  return Math.round(valueToRound)/100;
}

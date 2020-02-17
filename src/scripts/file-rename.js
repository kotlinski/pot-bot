import fs from 'fs-extra';
import moment from 'moment';

async function renameFilesInDraw(game_type, draw, folder) {
  let path = `./draws/${game_type}/old/${draw}/${folder}/`;
  const files = await fs.readdir(path);
  files.forEach((file) => {
    const file_as_moment = moment(file.split('.json')[0]);
    const new_file_name = file_as_moment.format('YYYYMMDDTHHmm') + '.json';
    console.log(`${file} will be renamed to ${new_file_name}`);
    fs.rename(path + file, path + new_file_name);
  })
}


// Or
const main = async function () {
  let draw = 4632;
  const game_type = "stryktipset"
  await renameFilesInDraw(game_type, draw, 'raw-history');
  await renameFilesInDraw(game_type, draw, 'clean-history');
};


(async () => {
  await main();
})().catch(e => {
  console.log("error, " + e)
});

function printStats(draw) {
  console.log(draw);
}


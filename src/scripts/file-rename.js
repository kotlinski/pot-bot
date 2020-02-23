import fs from 'fs-extra';
import moment from 'moment';

async function renameFilesInDraw(game_type, draw) {
  let path = `./draws/${game_type}/old/${draw}/`;
  const files = await fs.readdir(path);
  files.forEach((file) => {
    console.log('file; ' + file);
   // const file_name = file.split('.json')[0];
    const file_name = file;
    if (file_name === 'raw-after-deadline.json') {
      const new_file_name = 'draw-after-deadline.json';
      console.log(`${file_name} will be renamed to ${new_file_name}`);
      fs.rename(path + file, path + new_file_name);
    } else {
      console.log("could not find: " + file_name);
    }
  })
}

// Or
const main = async function () {
  let draw = 4637;
  const game_type = "stryktipset";
  for (let i = 4577; i <= 4638; i++) {
    try{
      await renameFilesInDraw(game_type, i);
    } catch(error){
      console.log(error);
    }
  }
};


(async () => {
  await main();
})().catch(e => {
  console.log("error, " + e)
});

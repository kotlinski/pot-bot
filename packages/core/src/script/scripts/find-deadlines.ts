import { ScriptWrapper } from '../script-wrapper';
import DrawProvider from '../../svenska-spel/draw/draw-provider';
import { ScriptFactory } from '../script-factory';
import { Storage } from '../../storage/storage';
import dayjs from 'dayjs';

export default class FindDeadlines implements ScriptWrapper {
  private readonly draw_provider: DrawProvider;

  constructor(storage: Storage) {
    const script_factory = new ScriptFactory();
    this.draw_provider = script_factory.createDrawProvider(storage);
  }

  /*
  Conclusions: 4 good lambda trigger dates would be:
  saturday, sundays
  13:55 utc, 14:55 utc.

  Saturday-15:59 441
  Sunday-14:59 6
  Sunday-15:59 4
  Saturday-16:59 2
  Saturday-14:04 1
  Sunday-16:59 1
  Saturday-17:29 1
  Monday-15:59 1
  */
  async run(): Promise<void> {
    const deadlines: Map<string, number> = new Map<string, number>();
    for (let draw_number = 4723; draw_number > 4266; draw_number--) {
      const draw = await this.draw_provider.getDraw(draw_number);
      if (!deadlines.has(dayjs(draw.close_time).format('dddd-HH:mm'))) {
        deadlines.set(dayjs(draw.close_time).format('dddd-HH:mm'), 1);
      } else {
        const old_count = deadlines.get(dayjs(draw.close_time).format('dddd-HH:mm'));
        deadlines.set(dayjs(draw.close_time).format('dddd-HH:mm'), old_count! + 1);
      }
    }
    deadlines.forEach((value: number, key: string) => {
      console.log(key, value);
    });
  }
}

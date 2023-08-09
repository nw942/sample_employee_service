
import { configure, getLogger } from 'log4js';


configure("./dist/src/configuration/log4js.json");

export class Logger {

  public static getLogger(name: string) {
    return getLogger(name);
  }
}

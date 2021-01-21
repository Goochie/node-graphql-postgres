
import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class ConfigService {
    private readonly envConfig: { [key: string]: string };
    private readonly additional: { [key: string]: any};

    constructor(filePath: string, additional: { [key: string]: any} = {}) {
        this.envConfig = dotenv.parse(fs.readFileSync(filePath));
        Object.assign(this.envConfig, process.env);
        this.additional = additional;
    }

    getOptions() {
      return this.additional;
    }

    get(key: string): string {
        return this.envConfig[key];
    }
}

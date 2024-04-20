import fs from 'node:fs';

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { parse } from 'csv-parse';

export class CsvUtils {
    static async readFile(path: string): Promise<string[][]> {
        if (!fs.existsSync(path)) {
            throw new NotFoundException('File does not exist');
        }

        const fileReader = fs.createReadStream(path);
        return new Promise((resolve) => {
            fileReader.pipe(
                parse({ delimiter: ',' }, (err, records) => {
                    if (err) {
                        throw new BadRequestException(err.message);
                    }
                    resolve(records);
                }),
            );
        });
    }

    static async csvToJson(path: string) {
        const rawData: string[][] = await this.readFile(path);
        const headers = rawData.shift();
        return rawData.map((row) =>
            row.reduce(
                (rs, ceil, i) => ({
                    ...rs,
                    [headers[i]]: ceil,
                }),
                {},
            ),
        );
    }
}

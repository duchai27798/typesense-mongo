import { HttpStatus } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { DefaultDataDto } from '@/dto/core/default-data.dto';

export class SuccessDto {
    message?: string;
    statusCode: HttpStatus;
    data?: any;
    metadata?: any;

    constructor(
        message: string | null,
        status: HttpStatus = HttpStatus.OK,
        data: any = null,
        responseDto?: typeof DefaultDataDto,
    ) {
        this.statusCode = status;
        if (message) {
            this.message = message;
        }
        if (data) {
            if (data?.metadata) {
                this.metadata = data.metadata;
                this.data = plainToInstance(responseDto, data.data);
            } else {
                this.data = data;
            }
        }
    }
}

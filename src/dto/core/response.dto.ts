import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

type Constructor<T = any> = new (...args: any[]) => T;

export class MessageResponseDto {
    @ApiProperty()
    message: string;

    @ApiProperty({ enum: HttpStatus, default: HttpStatus.OK })
    statusCode: HttpStatus;
}

export function ResponseDto<TBase extends Constructor>(Base: TBase, isArray = false) {
    class BaseClass extends MessageResponseDto {
        @ApiProperty({ type: () => Base, isArray })
        data?: TBase;
    }

    return BaseClass;
}

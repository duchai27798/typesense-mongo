import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class DefaultDataDto {
    // get object id and transform to string
    @Transform((value) => value.obj._id?.toString() || value.obj.id)
    @Expose({ name: '_id' })
    @ApiProperty({ default: 'ObjectId' })
    id: Types.ObjectId;

    @Expose()
    @ApiProperty({ type: Date })
    createdAt: string;

    @Expose()
    @ApiProperty({ type: Date })
    updatedAt: string;
}

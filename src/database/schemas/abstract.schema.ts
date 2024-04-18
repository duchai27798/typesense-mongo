import { Prop } from '@nestjs/mongoose';

export class AbstractSchema {
    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

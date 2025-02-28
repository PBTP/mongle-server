import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TermController } from "./presentation/terms.controller";
import { TermService } from "./application/terms.service";
import { TERM_REPOSITORY, TermRepository } from "./port/terms.repository";
import { CUSTOMER_TERM_REPOSITORY, CustomerTermRepository } from "./port/customer-terms.repository";
import { TermEntity } from "../schemas/terms.entity";
import { CustomerTermEntity } from "../schemas/customer-terms.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            TermEntity,
            CustomerTermEntity,
        ])
    ],
    controllers: [TermController],
    providers: [
        TermService,
        {provide: TERM_REPOSITORY, useClass: TermRepository},
        {provide: CUSTOMER_TERM_REPOSITORY, useClass: CustomerTermRepository}
    ],
    exports: [TermService]
})
export class TermModule {}
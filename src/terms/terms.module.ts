import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerTermEntity } from "src/schemas/customer-terms.entity";
import { TermEntity } from "src/schemas/terms.entity";
import { TermService } from "./application/terms.service";
import { CUSTOMER_TERM_REPOSITORY, CustomerTermRepository } from "./port/customer-terms.repository";
import { TERM_REPOSITORY, TermRepository } from "./port/terms.repository";
import { TermController } from "./presentation/terms.controller";

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
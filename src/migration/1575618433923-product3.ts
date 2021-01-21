import {MigrationInterface, QueryRunner} from "typeorm";

export class product31575618433923 implements MigrationInterface {
    name = 'product31575618433923'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_656d8c2cd6b2ad7ea0f1d902478"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_8d522f1697132d8e10f4cfff9ea"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_fc2dc6c0268a2f6ecfad30a2e08"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_9b0656c14593e2f078d2f99cbdc" FOREIGN KEY ("org_id") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_80823b7ae866dc5acae2dac6d2c" FOREIGN KEY ("profile_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_1adfd693359b14ecc31af959b4f" FOREIGN KEY ("delivery_id") REFERENCES "deliverysettings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_1adfd693359b14ecc31af959b4f"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_80823b7ae866dc5acae2dac6d2c"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_9b0656c14593e2f078d2f99cbdc"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_fc2dc6c0268a2f6ecfad30a2e08" FOREIGN KEY ("profile_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_8d522f1697132d8e10f4cfff9ea" FOREIGN KEY ("delivery_id") REFERENCES "deliverysettings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_656d8c2cd6b2ad7ea0f1d902478" FOREIGN KEY ("org_id") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}

import {MigrationInterface, QueryRunner} from "typeorm";

export class eventDocument1586411249487 implements MigrationInterface {
    name = 'eventDocument1586411249487'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "event_document" ("id" SERIAL NOT NULL, "key" character varying NOT NULL, "url" character varying NOT NULL, "filename" character varying NOT NULL, "filesize" integer NOT NULL, "filetype" character varying NOT NULL, "user_id" integer, CONSTRAINT "PK_c9022f311243a1503ba8e0c7a2a" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "event_documents" ("event_id" integer NOT NULL, "document_id" integer NOT NULL, CONSTRAINT "PK_583b03bf720b710b49222452908" PRIMARY KEY ("event_id", "document_id"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_0e7beecc0e412805ac01255fd0" ON "event_documents" ("event_id") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_5128ade9c18fd7d91eb81f6eef" ON "event_documents" ("document_id") `, undefined);
        await queryRunner.query(`ALTER TABLE "event_document" ADD CONSTRAINT "FK_9109f0140554d341c5e58b56027" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event_documents" ADD CONSTRAINT "FK_0e7beecc0e412805ac01255fd0f" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "event_documents" ADD CONSTRAINT "FK_5128ade9c18fd7d91eb81f6eefb" FOREIGN KEY ("document_id") REFERENCES "event_document"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_documents" DROP CONSTRAINT "FK_5128ade9c18fd7d91eb81f6eefb"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_documents" DROP CONSTRAINT "FK_0e7beecc0e412805ac01255fd0f"`, undefined);
        await queryRunner.query(`ALTER TABLE "event_document" DROP CONSTRAINT "FK_9109f0140554d341c5e58b56027"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_5128ade9c18fd7d91eb81f6eef"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_0e7beecc0e412805ac01255fd0"`, undefined);
        await queryRunner.query(`DROP TABLE "event_documents"`, undefined);
        await queryRunner.query(`DROP TABLE "event_document"`, undefined);
    }

}

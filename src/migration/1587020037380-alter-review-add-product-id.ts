import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class alterReviewAddProductId1587020037380 implements MigrationInterface {
    name = 'alterReviewAddProductId1587020037380'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("review", new TableColumn({
            name: "product_id",
            type: "uuid",
            isNullable: true,
        }))

        await queryRunner.createForeignKey("review", new TableForeignKey({
            columnNames: ["product_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "product",
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION",
        }));

        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "number" SET DEFAULT nextval('transaction_sequence')`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "number" SET DEFAULT nextval('transaction_sequence')`, undefined);
        const table = await queryRunner.getTable("review");
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("product_id") !== -1);
        await queryRunner.dropForeignKey("review", foreignKey);
        await queryRunner.dropColumn("review", "product_id");
    }

}

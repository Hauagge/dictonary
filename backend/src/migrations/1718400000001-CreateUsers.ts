import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm"

export class CreateUsers1718400000001 implements MigrationInterface {
  name = "CreateUsers1718400000001"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`)

    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "uuid",
          },
          {
            name: "name",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "email",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "passwordHash",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
        ],
        uniques: [
          {
            name: "UQ_email",
            columnNames: ["email"],
          },
        ],
      }),
    )

    await queryRunner.createIndex(
      "users",
      new TableIndex({
        name: "IDX_email",
        columnNames: ["email"],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex("users", "IDX_email")
    await queryRunner.dropTable("users")
    await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`)
  }
}

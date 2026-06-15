import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateWords1718400000002 implements MigrationInterface {
  name = "CreateWords1718400000002"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "words",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "word",
            type: "varchar",
            isNullable: false,
          },
        ],
        uniques: [
          {
            name: "UQ_word",
            columnNames: ["word"],
          },
        ],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("words")
  }
}

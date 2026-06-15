import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm"

export class CreateHistory1718400000003 implements MigrationInterface {
  name = "CreateHistory1718400000003"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "history",
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
          {
            name: "userId",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
        ],
        foreignKeys: [
          {
            name: "FK_user_history",
            columnNames: ["userId"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
        ],
      }),
    )
    await queryRunner.createIndex(
      "history",
      new TableIndex({
        name: "IDX_user_createdAt",
        columnNames: ["userId", "createdAt"],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex("history", "IDX_user_createdAt")
    await queryRunner.dropForeignKey("history", "FK_user_history")
    await queryRunner.dropTable("history")
  }
}

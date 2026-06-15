import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateFavorites1718400000004 implements MigrationInterface {
  name = "CreateFavorites1718400000004"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "favorites",
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
        uniques: [
          {
            name: "UQ_user_word",
            columnNames: ["userId", "word"],
          },
        ],
        foreignKeys: [
          {
            name: "FK_user_favorites",
            columnNames: ["userId"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          },
        ],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("favorites", "FK_user_favorites")
    await queryRunner.dropTable("favorites")
  }
}

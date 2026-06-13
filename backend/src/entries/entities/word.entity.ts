import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm"

@Entity("words")
export class WordEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Index({ unique: true })
  @Column()
  word: string
}

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm"
import { UserEntity } from "../../users/entities/user.entity"

@Entity("favorites")
@Unique(["userId", "word"])
export class FavoriteEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  word: string

  @Column()
  userId: string

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: UserEntity

  @CreateDateColumn()
  createdAt: Date
}

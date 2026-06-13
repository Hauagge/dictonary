import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm"
import { User } from "../../users/entities/user.entity"

@Entity("favorites")
@Unique(["userId", "word"])
export class FavoriteEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  word: string

  @Column()
  userId: string

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User

  @CreateDateColumn()
  createdAt: Date
}

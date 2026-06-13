import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import { User } from "../../users/entities/user.entity"

@Entity("history")
@Index(["userId", "createdAt"])
export class HistoryEntity {
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

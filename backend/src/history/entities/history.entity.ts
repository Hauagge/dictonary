import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import { UserEntity } from "../../users/entities/user.entity"

@Entity("history")
@Index(["userId", "createdAt"])
export class HistoryEntity {
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

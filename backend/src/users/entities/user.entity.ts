import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm"

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @Index({ unique: true })
  @Column()
  email: string

  @Column()
  passwordHash: string

  @CreateDateColumn()
  createdAt: Date
}

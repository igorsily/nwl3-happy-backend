import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TABLE_NAME as Images } from "../database/migrations/1602645079204-create-images";
import Orphanage from "./Orphanages";


@Entity(Images)
export default class Image {
    
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  path: string;

  @ManyToOne(() => Orphanage, orphanage => orphanage.images)
  @JoinColumn({name:"orphanage_id"})
  orphanage: Orphanage
}

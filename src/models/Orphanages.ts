import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { TABLE_NAME as Orphanages } from "../database/migrations/1602632914075-create_orphanages";
import Image from "./Image";

@Entity(Orphanages)
export default class Orphanage {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;

  @Column({type: 'float8'})
  latitude: number;

  @Column({type: 'float8'})
  longitude: number;

  @Column()
  about: string;

  @Column()
  instructions: string;

  @Column()
  opening_hours: string;

  @Column()
  open_on_weekends: boolean;

  @OneToMany(() => Image, (image) => image.orphanage, {
    cascade: ['insert', 'update']
  })
  @JoinColumn({ name: "orphanage_id" })
  images: Array<Image>;
}

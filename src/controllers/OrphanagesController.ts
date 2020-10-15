import { Request, Response } from "express";
import { getRepository } from "typeorm";
import * as Yup from "yup";
import Orphanage from "../models/Orphanages";
import orphanagesView from "../views/orphanages_view";


export default {
  async index(request: Request, response: Response) {
    const orphanagesRepository = getRepository(Orphanage);
    try {
      const orphanages: Array<Orphanage> = await orphanagesRepository.find({
        relations: ["images"],
      });
      return response.status(200).json(orphanagesView.renderMany(orphanages));
    } catch (error) {
      return response.json(error);
    }
  },
  async create(request: Request, response: Response) {
    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
    } = request.body;

    const requestImages = request.files as Array<Express.Multer.File>;

    const orphanagesRepository = getRepository(Orphanage);

    const images = requestImages.map((image) => {
      return {
        path: image.filename,
      };
    });

    const data = {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends: open_on_weekends === "true",
      images,
    };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      about: Yup.string().required().max(300),
      instructions: Yup.string().required(),
      opening_hours: Yup.string().required(),
      open_on_weekends: Yup.boolean().required(),
      images: Yup.array(
        Yup.object().shape({
          path: Yup.string().required(),
        })
      ),
    });

    await schema.validate(data, {
      abortEarly: false,
    });

    const orphanages = orphanagesRepository.create(data);

    try {
      const orphanagesCreated = await orphanagesRepository.save(orphanages);

      return response.status(201).json(orphanagesCreated);
    } catch (error) {
      return response.json(error);
    }
  },

  async show(request: Request, response: Response) {
    const { id } = request.params;
    const orphanagesRepository = getRepository(Orphanage);
    try {
      const orphanage: Orphanage = await orphanagesRepository.findOneOrFail(
        id,
        { relations: ["images"] }
      );

      return response.status(200).json(orphanagesView.render(orphanage));
    } catch (error) {
      return response.json(error);
    }
  },
};

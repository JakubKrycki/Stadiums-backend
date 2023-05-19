import Joi from "joi";

export const UserSpec = {
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
};
  
export const UserCredentialsSpec = {
  email: Joi.string().email().required(),
  password: Joi.string().required(),
};

export const PlacemarkSpec = {
  name: Joi.string().required(),
  added_by: Joi.number().required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  category: Joi.string().required(),
  private: Joi.boolean().required(),
};
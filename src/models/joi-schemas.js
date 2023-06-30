import Joi from "joi";

export const JwtAuth = Joi.object()
  .keys({
    success: Joi.boolean().example("true").required(),
    token: Joi.string().example("eyJhbGciOiJND.g5YmJisIjoiaGYwNTNjAOhE.gCWGmY5-YigQw0DCBo").required(),
  })
  .label("JwtAuth");

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserCredentialsSpec = Joi.object()
  .keys({
    email: Joi.string().email().example("name@surname.pl").required(),
    password: Joi.string().example("secret").required(),
    role: Joi.string(),
  })
  .label("UserCredentials");

export const UserSpec = UserCredentialsSpec.keys({
  firstName: Joi.string().example("Homer").required(),
  lastName: Joi.string().example("Simpson").required(),
}).label("UserDetails");

export const UserSpecPlus = UserSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("UserDetailsPlus");

export const UserArray = Joi.array().items(UserSpecPlus).label("UserArray");

export const PlacemarkSpec = Joi.object()
.keys({
  name: Joi.string().required(),
  team: Joi.string().required(),
  added_by: IdSpec,
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  category: Joi.string().required(),
  private: Joi.boolean().required(),
}).label("Placemark");

export const PlacemarkReadableSpec = Joi.object()
.keys({
  name: Joi.string().required(),
  team: Joi.string().required(),
  added_by: IdSpec,
  added_by_username: Joi.string().required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  category: Joi.string().required(),
  private: Joi.boolean().required(),
}).label("Placemark");

export const PlacemarkSpecPlus = PlacemarkSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("PlacemarkPlus");

export const PlacemarkReadableSpecPlus = PlacemarkReadableSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("PlacemarkReadablePlus");

export const PlacemarkArraySpec = Joi.array().items(PlacemarkReadableSpecPlus).label("PlacemarkArray");

export const ImageSpec = Joi.object()
.keys({
 placemark_id: IdSpec,
 image_url: Joi.string().required(),
}).label("Image");

export const ImageSpecPlus = ImageSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("ImagePlus");

export const ImageArraySpec = Joi.array().items(ImageSpecPlus).label("ImageArray");
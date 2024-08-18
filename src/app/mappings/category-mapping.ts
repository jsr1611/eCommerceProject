import { Category } from "../models/word";

export const CategoryMapping: { [key in Category]: string } = {
  [Category.Verb]: 'Fe’l',
  [Category.Noun]: 'Ot',
  [Category.Adjective]: 'Sifat',
  [Category.Adverb]: 'Hol',
  [Category.Number]: 'Raqam',
  [Category.Other]: 'Boshqa'
};

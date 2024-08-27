import { Category } from "../models/word";

export const CategoryMapping: { [key in Category]: string } = {
  [Category.Verb]: 'Fe’l',
  [Category.Noun]: 'Ot',
  [Category.Adjective]: 'Sifat',
  [Category.Adverb]: 'Hol',
  [Category.Preposition]: 'Predlog',
  [Category.Conjunction]: 'Bog`lovchi',
  [Category.Number]: 'Raqam',
  [Category.Other]: 'Boshqa'
};


export enum TestingLangulages {
  uz_ar = "O`zbekcha-Arabcha",
  uz_en = "O`zbekcha-Inglizcha",
  ar_uz = "Arabcha-O`zbekcha",
  ar_en = "Arabcha-Inglizcha",
  en_uz = "Inglizcha-O`zbekcha",
  en_ar = "Inglizcha-Arabcha" 
};

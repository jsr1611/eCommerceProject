// word.model.ts

export interface Word {
    _id: string; 
    arabic: string;
    pronunciation: string,
    uzbek: string;
    english?: string; // Optional property
    category: Category,
    __v?: number; // Optional property, usually representing the version key in MongoDB
  }  



export enum Category {
    Verb = 'verb',
    Noun = 'noun', 
    Adjective = 'adjective', 
    Adverb = 'adverb', 
    Number = 'number', 
    Other = 'other'
};
import { IAuthor } from './author.model';

export interface IBook {
  _id?: any;
  name?: string;
  isbn?: string;
  author?: IAuthor;
}

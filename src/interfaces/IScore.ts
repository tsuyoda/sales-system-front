import { ICustomer } from './ICustomer';
import { IScoreLevel } from './IScoreLevel';
import { IOption } from './IForm';

export interface IScore {
  _id: string;
  points: number;
  customer: ICustomer;
  scoreLevel?: IScoreLevel;
  createdAt: string;
}

export interface IScoreFilterParams {
  customer?: string;
  scoreLevel?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface IScoreFilterForm {
  score_search_customer: IOption;
  score_search_score_level: IOption;
}

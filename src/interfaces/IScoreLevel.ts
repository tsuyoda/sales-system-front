import { IBenefit } from './IBenefit';
import { IOption } from './IForm';

export interface IScoreLevel {
  _id: string;
  name: string;
  pointsThreshold: number;
  benefits: IBenefit[];
  createdAt: string;
}

export interface IScoreLevelFilterParams {
  name?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface IScoreLevelFilterForm {
  score_level_search_name: string;
}

export interface IScoreLevelEditForm {
  score_level_name: string;
  score_level_pointsThreshold: number;
  score_level_insert_benefit: IOption;
  score_level_benefits: IBenefit[];
}

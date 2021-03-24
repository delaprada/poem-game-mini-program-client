export type PoemType = {
  id: number;
  author_id?: number;
  author?: string;
  title?: string;
  chapter?: string;
  section?: string;
  content: string;
};

export type AuthorType = {
  id: number;
  name: string;
  intro?: string;
  intro_l?: string;
  intro_s?: string;
  dynasty?: string;
};

export type CompositionType = {
  id: number;
  author_id: number;
  title: string;
  content: string;
  author: string;
  category?: number;
};

export type RecordingType = {
  record_id: number;
  record_name: string;
  record_url: string;
  poem_id: number;
  category: number;
};

export interface SentenceType {
  id: number;
  category: number;
  composition_id: number;
  author: string;
  title: string;
  content: string;
  dynasty: string;
};

export type AnswerType = {
  correct: string;
  wrong: string;
};

export type option = {
  content: string;
  option: string;
};

export type quesType = {
  answer: string;
  stem: string;
  options: Array<option>;
  img: string | null;
  no: number;
};

export type idenQuesType = {
  answer: Array<number>;
  stem: string;
  options: Array<string>;
  img: string | null;
  no: number;
};

export type CompoList = Array<CompositionType>;

export type RecordListType = Array<string>;

export type RecordingListType = Array<RecordingType>;

export type AnswerListType = Array<AnswerType>;

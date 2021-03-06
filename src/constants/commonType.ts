export type PoemType = {
  id: number;
  author_id?: number;
  author?: string;
  title?: string;
  chapter?: string,
  section?: string,
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

export type CompoList = Array<CompositionType>;

export type RecordListType = Array<string>;

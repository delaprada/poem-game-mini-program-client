export type PoemType = {
  id: number,
  author_id: number,
  author: string,
  title: string,
  content: string,
}

export type AuthorType = {
  id: number,
  name: string,
  intro?: string,
  intro_l?: string,
  intro_s?: string,
  dynasty?: string,
}
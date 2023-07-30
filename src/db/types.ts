import { Generated } from 'kysely';

export type { Selectable, Insertable } from 'kysely';

interface Blog {
  id: Generated<number>;
  title: string;
  content: string;
  author: string;
  creationTime: number;
}

export interface Database {
  blog: Blog;
}

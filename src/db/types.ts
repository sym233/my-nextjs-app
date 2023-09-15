import { Generated } from 'kysely';

export type { Selectable, Insertable } from 'kysely';

export interface Blog {
  id: Generated<number>;
  title: string;
  author: string;
  creationTime: number;
  content: string;
}

interface BlogInfo {
  id: Generated<number>;
  author: string;
  creationTime: number;
}

interface BlogConent {
  id: Generated<number>;
  blogId: number;
  title: string;
  content: string;
  creationTime: number;
}

export interface Database {
  blogInfo: BlogInfo;
  blogContent: BlogConent
}

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

interface UserInfo {
  id: Generated<number>;
  username: string;
  // email: string;
  // creationTime: number;
}

interface UserPassword {
  id: Generated<number>;
  userId: number;
  hashedPassword: string;
  salt: string;
}

interface Session {
  id: Generated<string>;
  userId: number;
  creationTime: number;
}

export interface Database {
  blogInfo: BlogInfo;
  blogContent: BlogConent;
  userInfo: UserInfo;
  userPassword: UserPassword;
  session: Session;
}

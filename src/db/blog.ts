import { Pr, res } from '../utils';
import db from './client';
import { Blog, Database, Insertable, Selectable } from './types';

export type SBlog = Selectable<Blog>;

async function _blogList(offset: number, limit: number) {
  return (
    await db
      .selectFrom('blogInfo')
      .innerJoin('blogContent', 'blogInfo.id', 'blogContent.blogId')
      .distinctOn('blogContent.blogId')
      .select(['blogInfo.id',  'blogInfo.author', 'blogContent.title', 'blogContent.content', 'blogContent.creationTime'])
      .orderBy('blogContent.blogId', 'desc')
      .orderBy('creationTime', 'desc')
      .offset(offset)
      .limit(limit)
      .execute()
  ).map(o => ({
    ...o,
    // bigint in pg, present as string in js
    // timestamp guaranteed to fit js integer.
    creationTime: Number.parseInt(o.creationTime as unknown as string),
  }));
}

async function _blog(id: number) {
  // 1 blog - multi blogContent
  // choose latest one
  // same result as _bloglist()
  const o = await db
    .selectFrom('blogInfo')
    .innerJoin(eb => eb
      .selectFrom('blogContent')
      .select(['blogContent.blogId', 'blogContent.title', 'blogContent.content', 'blogContent.creationTime'])
      .distinctOn('blogContent.blogId')
      .orderBy('blogContent.blogId', 'desc')
      .orderBy('blogContent.creationTime', 'desc')
      .as('cb'),
      join => join.onRef('cb.blogId', '=', 'blogInfo.id'))
    .where('blogInfo.id', '=', id)
    .select(['blogInfo.id', 'blogInfo.author', 'cb.title', 'cb.content', 'blogInfo.creationTime'])
    .executeTakeFirst();
  return (
    o && {
      ...o,
      creationTime: Number.parseInt(o.creationTime as unknown as string),
    }
  );
}


export async function blogList(offset: number, limit: number): Pr<SBlog[]> {
  return res(_blogList(offset, limit));
}

export async function blog(id: number): Pr<SBlog> {
  return res(_blog(id).then(r => {
    if (r) {
      return r;
    } else {
      throw new Error(`Blog (${id}) not exists`);
    }
  }));
}

export async function createNewBlogs(blogs: Insertable<Blog>[]) {
  const blogIds = await db.insertInto('blogInfo')
    .values(blogs.map(({ author, creationTime }) => ({ author, creationTime })))
    .returning('id')
    .execute();
  await db.insertInto('blogContent')
    .values(blogs.map(({title, content, creationTime}, i) => ({ title, content, creationTime, blogId: blogIds[i].id })))
    .execute();
}

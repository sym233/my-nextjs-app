import db from './client';

export interface Blog {
  id: number;
  title: string;
  content: string;
  author: string;
  creationTime: number;
}

export class BlogDb {
  static async blogList(offset: number, limit: number): Promise<Blog[]> {
    return (
      await db
        .selectFrom('blogInfo')
        .innerJoin('blogContent', 'blogInfo.id', 'blogContent.blogId')
        .distinctOn('blogContent.blogId')
        .select([
          'blogInfo.id',
          'blogInfo.author',
          'blogContent.title',
          'blogContent.content',
          'blogContent.creationTime',
        ])
        .orderBy('blogContent.blogId', 'desc')
        .orderBy('creationTime', 'desc')
        .offset(offset)
        .limit(limit)
        .execute()
    ).map(o => ({
      ...o,
      // bigint in pg, present as string in js
      // timestamp guaranteed to fit js integer.
      creationTime: Number.parseInt(o.creationTime),
    }));
  }

  static async blog(id: number): Promise<Blog | undefined> {
    // 1 blog - multi blogContent
    // choose latest one
    // same result as bloglist()
    const o = await db
      .selectFrom('blogInfo')
      .innerJoin(
        eb =>
          eb
            .selectFrom('blogContent')
            .select([
              'blogContent.blogId',
              'blogContent.title',
              'blogContent.content',
              'blogContent.creationTime',
            ])
            .distinctOn('blogContent.blogId')
            .orderBy('blogContent.blogId', 'desc')
            .orderBy('blogContent.creationTime', 'desc')
            .as('cb'),
        join => join.onRef('cb.blogId', '=', 'blogInfo.id')
      )
      .where('blogInfo.id', '=', id)
      .select([
        'blogInfo.id',
        'blogInfo.author',
        'cb.title',
        'cb.content',
        'blogInfo.creationTime',
      ])
      .executeTakeFirst();
    return (
      o && {
        ...o,
        creationTime: Number.parseInt(o.creationTime),
      }
    );
  }

  static async createNewBlogs(blogs: Omit<Blog, 'id'>[]) {
    const blogIds = await db
      .insertInto('blogInfo')
      .values(
        blogs.map(({ author, creationTime }) => ({ author, creationTime }))
      )
      .returning('id')
      .execute();
    await db
      .insertInto('blogContent')
      .values(
        blogs.map(({ title, content, creationTime }, i) => ({
          title,
          content,
          creationTime,
          blogId: blogIds[i].id,
        }))
      )
      .execute();
  }
}

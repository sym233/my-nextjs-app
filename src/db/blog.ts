import { Generated, Selectable } from 'kysely';

import { createKysely } from '@vercel/postgres-kysely';

interface Blog {
  title: string;
  content: string;
  author: string;
  creationTime: number;
}

type WithId<T> = T & { id: Generated<number> };

interface Database {
  blog: WithId<Blog>;
}

export type SelectBlog = Selectable<Database['blog']>;

const blogs: Blog[] = [
  {
    title: 'hello world',
    content: 'first blog.',
    author: 'admin',
    creationTime: Date.now() - 60 * 1000,
  },
  {
    title: 'test blog',
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Elementum eu facilisis sed odio. Sed velit dignissim sodales ut eu sem integer. In eu mi bibendum neque egestas congue quisque egestas. Tortor consequat id porta nibh venenatis cras sed felis eget. In dictum non consectetur a erat nam at. Non odio euismod lacinia at quis risus sed vulputate. Massa id neque aliquam vestibulum morbi blandit cursus. Sed libero enim sed faucibus turpis in. Erat imperdiet sed euismod nisi. Fringilla est ullamcorper eget nulla facilisi. Pellentesque nec nam aliquam sem et tortor consequat. Venenatis urna cursus eget nunc. Fermentum iaculis eu non diam phasellus vestibulum lorem. Eget aliquet nibh praesent tristique magna sit. Id neque aliquam vestibulum morbi blandit.

Vulputate mi sit amet mauris commodo. Ut venenatis tellus in metus vulputate eu scelerisque felis imperdiet. Eu facilisis sed odio morbi quis commodo odio aenean. Tellus in metus vulputate eu. Natoque penatibus et magnis dis parturient montes nascetur. Tortor at risus viverra adipiscing at in tellus integer. Morbi non arcu risus quis varius quam quisque id. Euismod in pellentesque massa placerat duis ultricies lacus sed. Mattis molestie a iaculis at erat pellentesque. Commodo sed egestas egestas fringilla phasellus faucibus.

Et tortor consequat id porta nibh. Platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim. Ut consequat semper viverra nam libero. Amet consectetur adipiscing elit ut aliquam purus sit amet luctus. At consectetur lorem donec massa. At varius vel pharetra vel turpis nunc. At tempor commodo ullamcorper a lacus vestibulum. Egestas quis ipsum suspendisse ultrices gravida. Elementum pulvinar etiam non quam. Elementum nisi quis eleifend quam adipiscing. Mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare. Sit amet nulla facilisi morbi tempus iaculis urna id. Sed sed risus pretium quam. Fermentum odio eu feugiat pretium nibh ipsum consequat nisl. Non odio euismod lacinia at. In cursus turpis massa tincidunt. Et tortor consequat id porta. Mattis enim ut tellus elementum sagittis vitae et. Velit laoreet id donec ultrices tincidunt. Urna duis convallis convallis tellus id interdum velit laoreet id.

In aliquam sem fringilla ut morbi. Dictum varius duis at consectetur. Eget mi proin sed libero enim sed faucibus turpis. Integer enim neque volutpat ac tincidunt vitae. Sed enim ut sem viverra aliquet eget sit. Nunc eget lorem dolor sed viverra. Metus dictum at tempor commodo ullamcorper a lacus. Id interdum velit laoreet id donec ultrices tincidunt arcu non. Scelerisque viverra mauris in aliquam sem fringilla. Nunc lobortis mattis aliquam faucibus. Euismod elementum nisi quis eleifend. Venenatis tellus in metus vulputate eu. Vulputate sapien nec sagittis aliquam malesuada bibendum. Nisi lacus sed viverra tellus in hac. Diam vulputate ut pharetra sit. Viverra aliquet eget sit amet tellus cras adipiscing enim eu. In massa tempor nec feugiat nisl pretium fusce id velit. Pellentesque habitant morbi tristique senectus et. Morbi leo urna molestie at elementum eu facilisis sed. Lacus viverra vitae congue eu consequat ac.

Massa sed elementum tempus egestas. Nec dui nunc mattis enim ut tellus. Feugiat pretium nibh ipsum consequat nisl vel pretium lectus quam. Blandit turpis cursus in hac. Nisl suscipit adipiscing bibendum est ultricies integer quis. Convallis convallis tellus id interdum velit laoreet id. Nibh sit amet commodo nulla facilisi nullam vehicula. Netus et malesuada fames ac turpis egestas integer. Purus viverra accumsan in nisl nisi. Vulputate ut pharetra sit amet aliquam id diam maecenas ultricies. Est placerat in egestas erat imperdiet. Semper feugiat nibh sed pulvinar.`,
    author: 'admin',
    creationTime: Date.now(),
  },
  {
    title: 'md blog test',
    content: `# Md Blog
A paragraph with *emphasis* and **strong importance**.

List:
- a
- b

* c
* d

Just a link: https://reactjs.com.
`,
    author: 'admin',
    creationTime: Date.now(),
  },
];

let db = createKysely<Database>();

interface Result<T = void> {
  error?: string;
  data?: T;
}

function err<T>(error: any): Result<T> {
  if (error instanceof Error) {
    return { error: error.message };
  } else {
    return { error: 'error' };
  }
}

function ok(): Result<void>;
function ok<T>(data: T): Result<T>;
function ok<T>(data?: T): Result<T> {
  return { data };
}

async function _down() {
  await db.schema.dropTable('blog').ifExists().execute();
}

async function _up() {
  await db.schema
    .createTable('blog')
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('title', 'text', col => col.notNull())
    .addColumn('content', 'text', col => col.notNull())
    .addColumn('author', 'varchar(255)', col => col.notNull())
    .addColumn('creationTime', 'bigint', col => col.notNull())
    .execute();
  await db.insertInto('blog').values(blogs).execute();
}

async function _blogList(offset: number, limit: number) {
  return (
    await db
      .selectFrom('blog')
      .selectAll()
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
  let o = await db
    .selectFrom('blog')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirst();
  return (
    o && {
      ...o,
      creationTime: Number.parseInt(o.creationTime as unknown as string),
    }
  );
}

type Pr<T = void> = Promise<Result<T>>;

export async function init(): Pr {
  try {
    await _down();
    await _up();
    return ok();
  } catch (e) {
    return err(e);
  }
}
// init();

export async function blogList(offset: number, limit: number): Pr<Selectable<Database['blog']>[]> {
  try {
    const res = await _blogList(offset, limit);
    return ok(res);
  } catch (e) {
    return err(e);
  }
}

export async function blog(id: number): Pr<Selectable<Database['blog']>> {
  try {
    const res = await _blog(id);
    if (res) {
      return ok(res);
    } else {
      throw new Error(`Blog (${id}) not exists`);
    }
  } catch (e) {
    return err(e);
  }
}

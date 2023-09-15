import { Blog, Database, Insertable } from './types';
import db from './client';
import { createNewBlogs } from './blog';

const blogs: Insertable<Blog>[] = [
  {
    title: 'hello world',
    content: 'first blog.',
    author: 'admin',
    creationTime: 1694790000000,
  },
  {
    title: 'test blog',
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Elementum eu facilisis sed odio. Sed velit dignissim sodales ut eu sem integer. In eu mi bibendum neque egestas congue quisque egestas. Tortor consequat id porta nibh venenatis cras sed felis eget. In dictum non consectetur a erat nam at. Non odio euismod lacinia at quis risus sed vulputate. Massa id neque aliquam vestibulum morbi blandit cursus. Sed libero enim sed faucibus turpis in. Erat imperdiet sed euismod nisi. Fringilla est ullamcorper eget nulla facilisi. Pellentesque nec nam aliquam sem et tortor consequat. Venenatis urna cursus eget nunc. Fermentum iaculis eu non diam phasellus vestibulum lorem. Eget aliquet nibh praesent tristique magna sit. Id neque aliquam vestibulum morbi blandit.
  
  Vulputate mi sit amet mauris commodo. Ut venenatis tellus in metus vulputate eu scelerisque felis imperdiet. Eu facilisis sed odio morbi quis commodo odio aenean. Tellus in metus vulputate eu. Natoque penatibus et magnis dis parturient montes nascetur. Tortor at risus viverra adipiscing at in tellus integer. Morbi non arcu risus quis varius quam quisque id. Euismod in pellentesque massa placerat duis ultricies lacus sed. Mattis molestie a iaculis at erat pellentesque. Commodo sed egestas egestas fringilla phasellus faucibus.
  
  Et tortor consequat id porta nibh. Platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim. Ut consequat semper viverra nam libero. Amet consectetur adipiscing elit ut aliquam purus sit amet luctus. At consectetur lorem donec massa. At varius vel pharetra vel turpis nunc. At tempor commodo ullamcorper a lacus vestibulum. Egestas quis ipsum suspendisse ultrices gravida. Elementum pulvinar etiam non quam. Elementum nisi quis eleifend quam adipiscing. Mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare. Sit amet nulla facilisi morbi tempus iaculis urna id. Sed sed risus pretium quam. Fermentum odio eu feugiat pretium nibh ipsum consequat nisl. Non odio euismod lacinia at. In cursus turpis massa tincidunt. Et tortor consequat id porta. Mattis enim ut tellus elementum sagittis vitae et. Velit laoreet id donec ultrices tincidunt. Urna duis convallis convallis tellus id interdum velit laoreet id.
  
  In aliquam sem fringilla ut morbi. Dictum varius duis at consectetur. Eget mi proin sed libero enim sed faucibus turpis. Integer enim neque volutpat ac tincidunt vitae. Sed enim ut sem viverra aliquet eget sit. Nunc eget lorem dolor sed viverra. Metus dictum at tempor commodo ullamcorper a lacus. Id interdum velit laoreet id donec ultrices tincidunt arcu non. Scelerisque viverra mauris in aliquam sem fringilla. Nunc lobortis mattis aliquam faucibus. Euismod elementum nisi quis eleifend. Venenatis tellus in metus vulputate eu. Vulputate sapien nec sagittis aliquam malesuada bibendum. Nisi lacus sed viverra tellus in hac. Diam vulputate ut pharetra sit. Viverra aliquet eget sit amet tellus cras adipiscing enim eu. In massa tempor nec feugiat nisl pretium fusce id velit. Pellentesque habitant morbi tristique senectus et. Morbi leo urna molestie at elementum eu facilisis sed. Lacus viverra vitae congue eu consequat ac.
  
  Massa sed elementum tempus egestas. Nec dui nunc mattis enim ut tellus. Feugiat pretium nibh ipsum consequat nisl vel pretium lectus quam. Blandit turpis cursus in hac. Nisl suscipit adipiscing bibendum est ultricies integer quis. Convallis convallis tellus id interdum velit laoreet id. Nibh sit amet commodo nulla facilisi nullam vehicula. Netus et malesuada fames ac turpis egestas integer. Purus viverra accumsan in nisl nisi. Vulputate ut pharetra sit amet aliquam id diam maecenas ultricies. Est placerat in egestas erat imperdiet. Semper feugiat nibh sed pulvinar.`,
    author: 'admin',
    creationTime: 1694792047844,
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
    creationTime: 1694792247844,
  },
];

async function down() {
  await db.schema.dropTable('blogInfo').ifExists().execute();
  await db.schema.dropTable('blogContent').ifExists().execute();
}

async function up() {
  await db.schema
    .createTable('blogInfo')
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('author', 'varchar(255)', col => col.notNull())
    .addColumn('creationTime', 'bigint', col => col.notNull())
    .execute();
  await db.schema.createTable('blogContent')
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('blogId', 'serial', col => col.notNull())
    .addColumn('title', 'text', col => col.notNull())
    .addColumn('content', 'text', col => col.notNull())
    .addColumn('creationTime', 'bigint', col => col.notNull())
    .execute();
  await createNewBlogs(blogs);
}

async function migrate() {
  await down();
  await up();
  console.log('database migrated');
}

migrate().then(() => db.destroy());

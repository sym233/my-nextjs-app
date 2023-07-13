import { FC } from 'react';
import Link from 'next/link';

import { SelectBlog, blogList } from '@/db/blog';

interface BlogDisplayProps {
  blog: SelectBlog
}

const BlogDisplay: FC<BlogDisplayProps> = ({ blog }) => {
  return (
    <div>
      <Link href={`blog/${blog.id}`}>
        <h2>{blog.title}</h2>
        <p>{blog.content.slice(0, 100)}</p>
      </Link>
    </div>
  );
};

const NewBlog = async () => {
  const { error, data } = await blogList(0, 1);
  return (
    <div className="max-w-screen-2xl border shadow-sm rounded p-2">
      <h3 className="text-xl">
        Newest Blog
      </h3>
      {!!error ?
        (<h3>Error: {error}</h3>) :
        ((!!data && data.length) ?
          <BlogDisplay blog={data[0]} /> :
          <h3>No blog yet</h3>)
      }
    </div>
  );
};

export default NewBlog;

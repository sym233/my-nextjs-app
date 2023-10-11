import { FC } from 'react';
import Link from 'next/link';

import { Blog, BlogDb } from '@/db/blog';

interface BlogDisplayProps {
  blog: Blog
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
  const bl = await BlogDb.blogList(0, 1);
  return (
    <div className="max-w-screen-2xl border shadow-sm rounded p-2">
      <h3 className="text-xl">
        Newest Blog
      </h3>
      {bl.length ?
        <BlogDisplay blog={bl[0]} /> :
        <h3>No blog yet</h3>
      }
    </div>
  );
};

export default NewBlog;

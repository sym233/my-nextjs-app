import Link from 'next/link';
import { FC } from 'react';

import { SBlog, blogList } from '@/db/blog';


interface PostListComponentProps {
  blogs: SBlog[];
}
const PostListComponent: FC<PostListComponentProps> = ({ blogs }) => {
  return (<>
    <ul>
      {blogs.map((blog) => (
        <li key={blog.id} className="border border-gray-100 rounded shadow-sm my-2 p-2">
          <Link href={`blog/${blog.id}`}>
            <h5 className="text-lg">{blog.title}</h5>
            <p className="text-gray-600">{blog.content.slice(0, 100)}</p>
            <div className="text-gray-500">
              <span>By {blog.author} at {new Date(blog.creationTime).toLocaleString()}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  </>);
};


const PostList = async () => {
  const res = await blogList(0, 10);
  return (
    <div className="max-w-screen-2xl">
      <h3 className="text-2xl my-2">
        Blog List
      </h3>
      {res.ok ?
        res.data.length ?
          <PostListComponent blogs={res.data} /> :
          <h3>No blog yet</h3> :
        <h3>Error: {res.err}</h3>
      }
    </div>
  );
};

export default PostList;

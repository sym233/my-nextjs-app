import Link from 'next/link';
import { FC } from 'react';

import { SelectBlog, blogList } from '@/db/blog';


interface PostListComponentProps {
  blogs: SelectBlog[];
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
  const { error, data } = await blogList();
  return (<>
    <h3 className="text-xl">
      Post List
    </h3>
    {!!error ?
      (<h3>Error: {error}</h3>) :
      ((!!data && data.length) ?
        <PostListComponent blogs={data} /> :
        <h3>No blog yet</h3>)
    }
  </>);
};

export default PostList;

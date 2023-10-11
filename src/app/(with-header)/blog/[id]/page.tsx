import { FC } from 'react';

import { BlogDb, Blog } from '@/db/blog';
import { Page } from '@/types';
import ReactMarkdown from 'react-markdown';


interface BlogContentProps {
  blog: Blog;
}

const BlogContent: FC<BlogContentProps> = ({ blog }) => {
  const { title, content, author, creationTime } = blog;
  return (<>
    <h3 className="text-2xl font-semibold text-center">{title}</h3>
    <p className="text-center my-2">By {author} at {new Date(creationTime).toLocaleString()}</p>
    <ReactMarkdown className='md'>{content}</ReactMarkdown>
  </>);
}

type BlogPageProps = {
  id: string;
}

const BlogPage: Page<BlogPageProps> = async ({ params }) => {
  const n = parseInt(params.id);
  if (Number.isNaN(n)) {
    return <p>Parameter Error</p>;
  }
  const b = await BlogDb.blog(n);
  if (b) {
    return (
      <div className="border border-gray-100 rounded shadow-sm p-2 max-w-screen-2xl mx-auto">
        <BlogContent blog={b} />
      </div>
    );
  }
  return <p>Error: No Blog Found</p>;
};

export default BlogPage;

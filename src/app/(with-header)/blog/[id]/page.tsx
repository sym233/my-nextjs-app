import { FC } from 'react';
import { notFound } from 'next/navigation';

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
    notFound();
  }
  const b = await BlogDb.blog(n);
  if (b) {
    return (
      <BlogContent blog={b} />
    );
  }
  notFound();
};

export default BlogPage;

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { GetStaticPaths, GetStaticProps } from 'next';
import { remark } from 'remark';
import html from 'remark-html';

type Props = {
  title: string;
  date: string;
  contentHtml: string;
};

export default function PostPage({ title, date, contentHtml }: Props) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-gray-500 mb-6">{date}</p>
      <div className="prose" dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </div>
  );
}

// 获取所有文章路径
export const getStaticPaths: GetStaticPaths = async () => {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);

  const paths = filenames.map((filename) => ({
    params: { slug: filename.replace(/\.md$/, '') },
  }));

  return {
    paths,
    fallback: false,
  };
};

// 获取指定文章内容
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const fullPath = path.join(process.cwd(), 'posts', `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    props: {
      title: data.title || '',
      date: String(data.date || ''),
      contentHtml,
    },
  };
};

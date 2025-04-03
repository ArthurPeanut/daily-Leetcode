import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { GetStaticPaths, GetStaticProps } from 'next';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import 'highlight.js/styles/github.css';
import Link from 'next/link';
import rehypeRaw from 'rehype-raw';


type Props = {
  title: string;
  date: string;
  contentHtml: string;
};

export default function PostPage({ title, date, contentHtml }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-purple-100 py-12">
      <div className="max-w-3xl mx-auto bg-white text-black p-8 rounded-2xl shadow-xl">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 transition"
          >
            ← 返回首页
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-gray-500 mb-6">{date}</p>

        <div
          className="prose prose-lg max-w-none prose-headings:text-gray-900 ..."
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

      </div>
    </div>
  );
}

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

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const fullPath = path.join(process.cwd(), 'posts', `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);


  const contentHtml = processedContent.toString();

  return {
    props: {
      title: data.title || '',
      date: String(data.date || ''),
      contentHtml,
    },
  };
};

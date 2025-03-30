import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import ProgressChart from '../components/ProgressChart';



type Post = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
};

export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);

  const posts: Post[] = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    return {
      slug: filename.replace(/\.md$/, ''),
      title: data.title || '',
      date: String(data.date || ''),
      tags: data.tags || [],
    };
  });

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    props: {
      posts,
    },
  };
}

export default function HomePage({ posts }: { posts: Post[] }) {
  // 统计每日刷题数量
  const dailyCount: Record<string, number> = {};
  posts.forEach((post) => {
    dailyCount[post.date] = (dailyCount[post.date] || 0) + 1;
  });

  const chartData = Object.entries(dailyCount).map(([date, count]) => ({
    date,
    count,
  }));
  
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Haoqing's Daily on Leetcode</h1>
      <p className="text-gray-600 mb-6">To strive, to seek, to find, and to yield.📈</p>

      <ProgressChart data={chartData} />


      {posts.map((post) => (
        <div key={post.slug} className="mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold">
            <Link href={`/${post.slug}`}>{post.title}</Link>
          </h2>
          <p className="text-sm text-gray-500">{post.date}</p>
          <p className="mt-1 text-sm text-gray-700">标签：{post.tags.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}

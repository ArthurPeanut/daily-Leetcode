import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import NoticeBoard from '../components/NoticeBoard';
import { useState } from 'react';
import Image from 'next/image';

type Post = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  type: string;
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
      type: data.type || 'blog',
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
  const [filter, setFilter] = useState<'all' | 'leetcode' | 'blog' | 'devlog'>('all');

  const filteredPosts = filter === 'all' ? posts : posts.filter((post) => post.type === filter);

  const dailyCount: Record<string, number> = {};
  posts.forEach((post) => {
    dailyCount[post.date] = (dailyCount[post.date] || 0) + 1;
  });


  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-purple-100">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* 主体内容区 */}
        <div className="md:col-span-3">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Haoqing&apos;s Coding Daily</h1>
          <p className="text-gray-600 mb-6">To strive, to seek, to find, and not to yield. 📈</p>

          <NoticeBoard />


          {/* 筛选按钮 */}
          <div className="flex gap-4 my-6">
            {['all', 'leetcode', 'blog', 'devlog'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type as typeof filter)}
                className={`px-4 py-1 rounded-full border ${
                  filter === type ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'
                }`}
              >
                {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* 文章列表 */}
          {filteredPosts.map((post) => (
            <div key={post.slug} className="mb-6 border-b pb-4 bg-white rounded-xl shadow-sm p-4">
              <h2 className="text-xl font-semibold text-gray-700">
                <Link href={`/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-sm text-gray-500">{post.date}</p>
              <p className="mt-1 text-sm text-gray-700">Tag：{post.tags.join(', ')}</p>
              <p className="mt-1 text-sm text-gray-500 italic">Type：{post.type}</p>
            </div>
          ))}
        </div>

        {/* 侧边栏 */}
        <div className="hidden md:block">
          <div className="bg-white p-6 rounded-xl shadow-md sticky top-10">
            <div className="flex flex-col items-center text-center">
              {/* 如果你放了 public/me.jpg 就会显示头像 */}
              <Image
                src="/me.jpg"
                alt="Haoqing"
                width={100}
                height={100}
                className="rounded-full mb-4"
              />
              <h2 className="text-lg font-semibold text-gray-700">Haoqing Liu</h2>
              <p className="text-sm text-gray-600 mb-2">🎓 Master of Computing @ ANU</p>
              <p className="text-sm text-gray-600 mb-2">🎓 Bachelor of CS @ SYSU</p>
              <p className="text-sm text-gray-600 mb-4">👨‍💻 Passionate about algorithms, Computer Vision & Full stack development.</p>
              <a href="mailto:haoqing@example.com" className="text-blue-600 text-sm hover:underline">
                📫 haoqing.liu1@anu.edu.au
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

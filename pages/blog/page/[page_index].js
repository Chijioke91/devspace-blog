import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Post from '@/components/Post';
import { sortByDate } from '@/utils/index';
import { POSTS_PER_PAGE } from '@/config/index';
import Pagination from '@/components/Pagination';

export default function BlogPage({ posts, currentPage, numPages }) {
  return (
    <Layout title="Home">
      <h1 className="text-4xl border-b-4 p-5 font-bold">Blog</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((post, idx) => {
          return <Post key={idx} {...post} />;
        })}
      </div>

      <Pagination currentPage={currentPage} numPages={numPages} />
    </Layout>
  );
}

export const getStaticPaths = async () => {
  const files = fs.readdirSync(path.join(process.cwd(), 'posts'));

  const numPages = Math.ceil(files.length / POSTS_PER_PAGE);

  let paths = [];

  for (let i = 1; i <= numPages; i++) {
    paths.push({
      params: { page_index: i.toString() },
    });
  }

  return { paths, fallback: false };
};

export const getStaticProps = async ({ params }) => {
  const page = parseInt(params ? params.page_index : 1);

  const files = fs.readdirSync(path.join(process.cwd(), 'posts'));

  const posts = files.map((filename) => {
    const slug = filename.replace('.md', '');

    const metaMark = fs.readFileSync(path.join(process.cwd(), 'posts', filename), 'utf8');

    const { data: frontMatter } = matter(metaMark);

    return { slug, frontMatter };
  });

  const numPages = Math.ceil(files.length / POSTS_PER_PAGE);
  const pageIndex = page - 1;
  const orderPosts = posts.sort(sortByDate).slice(pageIndex * POSTS_PER_PAGE, (pageIndex + 1) * POSTS_PER_PAGE);

  return {
    props: {
      posts: orderPosts,
      numPages,
      currentPage: page,
    },
  };
};

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Layout from '../../components/Layout';
import Post from '../../components/Post';
import { sortByDate } from '../../utils';

export default function BlogPage({ posts }) {
  return (
    <Layout title="Home">
      <h1 className="text-4xl border-b-4 p-5 font-bold">Blog</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((post, idx) => {
          return <Post key={idx} {...post} />;
        })}
      </div>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const files = fs.readdirSync(path.join(process.cwd(), 'posts'));

  const posts = files.map((filename) => {
    const slug = filename.replace('.md', '');

    const metaMark = fs.readFileSync(path.join(process.cwd(), 'posts', filename), 'utf8');

    const { data: frontMatter } = matter(metaMark);

    return { slug, frontMatter };
  });

  return {
    props: {
      posts: posts.sort(sortByDate),
    },
  };
};

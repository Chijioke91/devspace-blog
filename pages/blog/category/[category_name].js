import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Post from '@/components/Post';
import { sortByDate } from '@/utils/index';

export default function CategoryBlogPage({ posts, category_name }) {
  return (
    <Layout>
      <h1 className="text-4xl border-b-4 p-5 font-bold">{category_name} Posts</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((post, idx) => {
          return <Post key={idx} {...post} />;
        })}
      </div>
      <Link href="/blog">
        <a className="block text-center border border-gray-500 text-gray-800 rounded-md py-4 my-5 transition duration-500 ease select-none hover:text-white hover:bg-gray-900 focus:outline-none focus:shadow-outline w-full">All Posts</a>
      </Link>
    </Layout>
  );
}

export const getStaticPaths = async () => {
  const files = fs.readdirSync(path.join(process.cwd(), 'posts'));

  const categories = files.map((filename) => {
    const metaMark = fs.readFileSync(path.join(process.cwd(), 'posts', filename), 'utf8');

    const { data: frontMatter } = matter(metaMark);

    return frontMatter.category.toLowerCase();
  });

  const paths = categories.map((category) => ({
    params: { category_name: category },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params: { category_name } }) => {
  const files = fs.readdirSync(path.join(process.cwd(), 'posts'));

  const posts = files.map((filename) => {
    const slug = filename.replace('.md', '');

    const metaMark = fs.readFileSync(path.join(process.cwd(), 'posts', filename), 'utf8');

    const { data: frontMatter } = matter(metaMark);

    return { slug, frontMatter };
  });

  const categoryPosts = posts.sort(sortByDate).filter((post) => post.frontMatter.category.toLowerCase() === category_name);

  return {
    props: {
      posts: categoryPosts,
      category_name,
    },
  };
};

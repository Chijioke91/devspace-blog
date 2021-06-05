import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Post from '@/components/Post';
import { getPosts } from '@/lib/posts';
import CategoryList from '@/components/CategoryList';

export default function CategoryBlogPage({ posts, category_name, categories }) {
  return (
    <Layout>
      <div className="flex justify-between">
        <div className="w-3/4 mr-10">
          <h1 className="text-5xl border-b-4 p-5 font-bold">Posts in {category_name}</h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post, index) => (
              <Post key={index} {...post} />
            ))}
          </div>
        </div>

        <div className="w-1/4">
          <CategoryList categories={categories} />
        </div>
      </div>
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
  const posts = getPosts();

  const allCategories = posts.map((post) => post.frontMatter.category);

  // fetch unique sets of categories
  const uniqueCategories = [...new Set(allCategories)];

  const categoryPosts = posts.filter((post) => post.frontMatter.category.toLowerCase() === category_name);

  return {
    props: {
      posts: categoryPosts,
      category_name,
      categories: uniqueCategories,
    },
  };
};

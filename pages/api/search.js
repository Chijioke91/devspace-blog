import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default (req, res) => {
  let posts;

  if (process.env.NODE_ENV === 'production') {
  } else {
    const files = fs.readdirSync(path.join(process.cwd(), 'posts'));

    posts = files.map((filename) => {
      const markDMeta = fs.readFileSync(path.join(process.cwd(), 'posts', filename), 'utf-8');
      const { data: frontMatter } = matter(markDMeta);

      return { frontMatter };
    });
  }

  const results = posts.filter(({ frontMatter: { title, excerpt, category } }) => title.toLowerCase().indexOf(req.query.q.toLowerCase()) !== -1 || excerpt.toLowerCase().indexOf(req.query.q.toLowerCase()) !== -1 || category.toLowerCase().indexOf(req.query.q.toLowerCase()) !== -1);

  console.log(results);

  res.status(200).json({ results });
};

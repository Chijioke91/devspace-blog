import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default (req, res) => {
  let posts;

  if (process.env.NODE_ENV === 'production') {
    // fetch from cache
    posts = require('../../cache/data').posts;
  } else {
    const files = fs.readdirSync(path.join(process.cwd(), 'posts'));

    posts = files.map((filename) => {
      const markDMeta = fs.readFileSync(path.join(process.cwd(), 'posts', filename), 'utf-8');
      const { data: frontMatter } = matter(markDMeta);

      const slug = filename.replace('.md', '');

      return { frontMatter, slug };
    });
  }

  const results = posts.filter(({ frontMatter: { title, excerpt, category } }) => title.toLowerCase().indexOf(req.query.q.toLowerCase()) !== -1 || excerpt.toLowerCase().indexOf(req.query.q.toLowerCase()) !== -1 || category.toLowerCase().indexOf(req.query.q.toLowerCase()) !== -1);

  res.status(200).json({ results });
};

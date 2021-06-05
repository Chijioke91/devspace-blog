const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

function postData() {
  const files = fs.readdirSync(path.join(process.cwd(), 'posts'));

  const posts = files.map((filename) => {
    const markDMeta = fs.readFileSync(path.join(process.cwd(), 'posts', filename), 'utf-8');
    const { data: frontMatter } = matter(markDMeta);

    const slug = filename.replace('.md', '');

    return { frontMatter, slug };
  });

  return `export const posts = ${JSON.stringify({ posts })}`;
}

try {
  fs.readdirSync('cache');
} catch (error) {
  fs.mkdirSync('cache');
}

fs.writeFile('cache/data.js', postData(), (err) => {
  if (err) return console.log(err);
  console.log('Posts cached...');
});

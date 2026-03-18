import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

// A tiny custom plugin to include HTML files using <include src="path" />
const htmlIncludePlugin = () => {
  return {
    name: 'html-include',
    transformIndexHtml(html) {
      return html.replace(/<include src="([^"]+)"\s*\/>/g, (match, srcPath) => {
        try {
          const content = fs.readFileSync(path.resolve(__dirname, srcPath), 'utf-8');
          return content;
        } catch (e) {
          console.error(`Could not load section: ${srcPath}`);
          return match;
        }
      });
    }
  };
};

export default defineConfig({
  plugins: [htmlIncludePlugin()],
});

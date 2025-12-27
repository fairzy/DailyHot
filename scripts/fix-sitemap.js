import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sitemapPath = path.resolve(__dirname, '../dist/sitemap.xml');

if (fs.existsSync(sitemapPath)) {
    let content = fs.readFileSync(sitemapPath, 'utf8');
    // Regex to match history URLs without .html and append it
    // Matches <loc>.../history/YYYY-MM-DD</loc> and replaces with .../history/YYYY-MM-DD.html</loc>
    const fixedContent = content.replace(/(\/history\/\d{4}-\d{2}-\d{2})(<\/loc>)/g, '$1.html$2');

    if (content !== fixedContent) {
        fs.writeFileSync(sitemapPath, fixedContent);
        console.log('✅ Sitemap URLs patched with .html extension.');
    } else {
        console.log('ℹ️ No sitemap URLs needed patching.');
    }
} else {
    console.error('❌ dist/sitemap.xml not found!');
    process.exit(1);
}

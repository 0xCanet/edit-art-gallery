import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {projects,press,exhibition} from './dist/portfolio-data.js';
const source=JSON.parse(readFileSync('research/crawl.json','utf8'));
assert.equal(source.pages.length,26);
assert(source.pages.every(p=>!p.error), 'Every discovered public page must have been fetched.');
assert.equal(exhibition.length,8);
assert.equal(new Set(projects.map(p=>p.id)).size,projects.length);
for(const p of [...projects,...press]){
 assert(p.images.length>0,p.id);
 assert(!p.title.includes('&'), 'Publication titles must decode source HTML entities.');
 assert(source.pages.some(s=>s.url===p.source),p.source);
 for(const photo of p.images){
  assert(photo.file.startsWith('assets/antoine/'));
  assert(existsSync(`dist/${photo.file}`),photo.file);
  assert(photo.width>0&&photo.height>0,photo.file);
  assert(photo.url.startsWith('https://images.squarespace-cdn.com/'),photo.url);
 }
}
for(const work of exhibition){assert(projects.some(p=>p.id===work.project&&p.images.some(i=>i.file===work.image)));assert(existsSync(`dist/${work.image}`));}
const html=readFileSync('dist/index.html','utf8');
assert(html.includes('noindex, nofollow'));
assert(!html.includes('PITTURA'));
assert(readFileSync('dist/app.js','utf8').includes('dialog.showModal()'));
console.log(`Portfolio: ${source.pages.length} source pages, ${projects.length} collections, ${press.length} publications, 8 curated photographs. All local images and source mappings verified.`);

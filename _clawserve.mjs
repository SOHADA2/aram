// 인형뽑기 물리 프로토타입용 임시 정적 서버 (file:// 의 GLB CORS 회피)
import { createServer } from 'node:http';
import { readFile } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const ROOT = process.argv[2] || '.';
const PORT = 8731;
const MIME = {
  '.html':'text/html;charset=utf-8', '.js':'text/javascript', '.mjs':'text/javascript',
  '.css':'text/css', '.json':'application/json', '.glb':'model/gltf-binary',
  '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.mp3':'audio/mpeg', '.wav':'audio/wav',
};
createServer((req, res) => {
  let p; try { p = decodeURIComponent(req.url.split('?')[0]); } catch { p = req.url.split('?')[0]; }
  if (p === '/' ) p = '/인형뽑기-물리-목업.html';
  const safe = normalize(p).replace(/^([\\/]|\.\.[\\/])+/, '');
  const fp = join(ROOT, safe);
  readFile(fp, (e, data) => {
    if (e) { res.writeHead(404); res.end('404: ' + p); return; }
    res.writeHead(200, { 'Content-Type': MIME[extname(fp).toLowerCase()] || 'application/octet-stream', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store, no-cache, must-revalidate' });
    res.end(data);
  });
}).listen(PORT, () => console.log('serving ' + ROOT + ' on http://localhost:' + PORT + '/'));

/**
 * Cloudflare Worker — Riot API CORS Proxy
 *
 * [배포 방법]
 * 1. https://dash.cloudflare.com → Workers & Pages → Create application → Create Worker
 * 2. 이 파일 내용을 붙여넣기 후 배포
 * 3. Settings → Variables → Secrets → RIOT_API_KEY 이름으로 키 값 저장
 * 4. 배포된 Worker URL (예: https://riot-proxy.이름.workers.dev) 복사
 * 5. Firebase /config/riotWorkerUrl 에 해당 URL 저장
 *
 * [지원 경로]
 * GET /{region}/...  → https://{region}.api.riotgames.com/...
 * 예) /kr/lol/spectator/v5/active-games/by-summoner/{puuid}
 *     /asia/lol/match/v5/matches/by-puuid/{puuid}/ids
 *     /asia/riot/account/v1/accounts/by-riot-id/{name}/{tag}
 */

const ALLOWED_REGIONS = ['kr', 'asia', 'na1', 'euw1'];

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405 });
    }

    const url = new URL(request.url);
    const parts = url.pathname.split('/').filter(Boolean);
    const region = parts[0];

    if (!ALLOWED_REGIONS.includes(region)) {
      return new Response(JSON.stringify({ error: 'Invalid region' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const restPath = '/' + parts.slice(1).join('/');
    const riotUrl = `https://${region}.api.riotgames.com${restPath}${url.search}`;

    try {
      const riotRes = await fetch(riotUrl, {
        headers: { 'X-Riot-Token': env.RIOT_API_KEY },
      });

      const body = await riotRes.text();
      return new Response(body, {
        status: riotRes.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Upstream error', detail: e.message }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  },
};

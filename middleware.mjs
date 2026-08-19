import { next } from '@vercel/functions';

export const config = {
  matcher: '/article.html',
};

const BOT_UA = /facebookexternalhit|Facebot|Twitterbot|Slackbot|LinkedInBot|WhatsApp|TelegramBot|Discordbot|Pinterest|redditbot|SkypeUriPreview|vkShare|W3C_Validator|iMessageLinkPreview/i;

const SUPABASE_URL = 'https://gseuejqqwkdjkhxfxxwy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_0Nmw1mwGx__b_jJHLHBDKg__1OAsRuy';
const DEFAULT_IMAGE = 'https://reedefined.app/images/og-image.jpg';
const DEFAULT_DESCRIPTION = 'A personalised digital magazine. Follow the writers, critics and creators whose taste you trust. Every month, your own issue.';

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default async function middleware(request) {
  const ua = request.headers.get('user-agent') || '';
  if (!BOT_UA.test(ua)) return next();

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id || !/^\d+$/.test(id)) return next();

  let article;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/contributions?id=eq.${id}&status=eq.submitted&select=title,tagline,category,photos`,
      { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
    );
    if (!res.ok) return next();
    const rows = await res.json();
    article = rows[0];
  } catch (e) {
    return next();
  }

  if (!article) return next();

  let image = DEFAULT_IMAGE;
  try {
    const photos = JSON.parse(article.photos || '[]');
    if (photos[0]?.url) image = photos[0].url;
  } catch (e) {}

  const title = `${article.title || 'Untitled'} — Reedefined`;
  const description = article.tagline || DEFAULT_DESCRIPTION;
  const pageUrl = `https://reedefined.app/article.html?id=${id}`;

  let html;
  try {
    const htmlRes = await fetch(new URL('/article.html', request.url));
    if (!htmlRes.ok) return next();
    html = await htmlRes.text();
  } catch (e) {
    return next();
  }

  const metaBlock = `<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:image" content="${escapeHtml(image)}">
<meta property="og:image:alt" content="${escapeHtml(article.title || 'Reedefined article')}">
<meta property="og:url" content="${escapeHtml(pageUrl)}">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${escapeHtml(image)}">
</head>`;

  html = html.replace('</head>', metaBlock);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);

  return new Response(html, {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}

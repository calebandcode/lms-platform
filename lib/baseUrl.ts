// lib/baseUrl.ts
function normalize(v?: string | null) {
  return v ? v.replace(/\/+$/, "") : undefined; // strip trailing slash
}

const baseUrl =
  normalize(process.env.NEXT_PUBLIC_SITE_URL) ||              
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) || 
  normalize(process.env.NEXT_PUBLIC_BASE_URL) ||               
  "http://localhost:3000";

export default baseUrl;


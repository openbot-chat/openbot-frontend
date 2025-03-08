

export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // 浏览器端采用相对路径
    return '';
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.render_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  }
  
  return process.env.NEXTAUTH_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;
}
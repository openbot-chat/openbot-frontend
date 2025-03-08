import { NextRequest, NextResponse } from "next/server"



export async function GET(
  request: NextRequest,
) {
  const url = request.nextUrl.searchParams.get('url')
  if (!url) return NextResponse.error() 

  if (url === '/api/proxy') return NextResponse.error()


  const html = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <script type="text/javascript">
      window.location.href = '${url}';
    </script>
  </head>
  <body>
    <a href="${url}">continue</a>
  </body>
</html>
`

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html",
    }
  })
}
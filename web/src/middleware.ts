import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ILoginData } from './repository/auth/loginMutation';

const publicPlaces = ['/login', '/register'];

const validateToken = (request: NextRequest): boolean => {
  const cookiesresponse = request.cookies.get('token');
  console.log('🚀 ~ validateToken ~ cookiesresponse:', cookiesresponse);

  if (cookiesresponse?.value) {
    const tokenJSON = JSON.parse(cookiesresponse.value) as ILoginData['login'];
    const nowInSeconds = Math.floor(Date.now() / 1000);

    const isTokenExpired = tokenJSON.exp < nowInSeconds;

    if (!isTokenExpired) {
      return true;
    }
  }

  return false;
};

export async function middleware(request: NextRequest) {
  const isTokenValid = validateToken(request);
  console.log('🚀 ~ middleware ~ isTokenValid:', isTokenValid);

  if (!isTokenValid && !publicPlaces.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isTokenValid && publicPlaces.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // if (!cookiesresponse && !publicPlaces.includes(request.nextUrl.pathname)) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

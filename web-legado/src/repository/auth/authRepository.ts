import { apolloClient } from '@/lib/apollo-client';
import { ILoginData, loginMutation } from './loginMutation';
import { NextResponse } from 'next/server';

type IFetchLogin = {
  email: string;
  password: string;
};

export const fetchLogin = async (prop: IFetchLogin) => {
  try {
    const { data } = await apolloClient.mutate<ILoginData>({
      mutation: loginMutation,
      variables: {
        prop,
      },
    });

    if (!data?.login) {
      console.log('cai aqui');
      return NextResponse.json({ error: 'Login inválido' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, user: data.login });
    response.cookies.set('token', data.login.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return response;
  } catch {}
};

import { getServerApolloClient } from '@/lib/apollo-server-client';
import { gql } from '@apollo/client';
import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  try {
    const client = await getServerApolloClient();
    console.log('🚀 ~ POST ~ client:', client);

    const body = await req.json();

    const { data } = await client.mutate({
      mutation: gql`
        mutation loginMutation($prop: ILoginInput) {
          login(props: $prop) {
            token
            exp
            createdAt
            name
            email
            id
          }
        }
      `,
      variables: {
        prop: body,
      },
    });

    console.log('🚀 ~ POST ~ data?.login?.token:', data?.login?.token);
    if (!data?.login?.token) {
      return NextResponse.json({ error: 'Login inválido' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true, user: data.login });
    response.cookies.set('token', data.login.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return response;
  } catch (err) {
    console.log('🚀 ~ POST ~ err:', err);
  }
}

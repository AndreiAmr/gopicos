import { getServerApolloClient } from '@/lib/apollo-server-client';
import { gql } from '@apollo/client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const client = await getServerApolloClient();

    const cookie = (await cookies()).get('token');
    console.log('🚀 ~ POST ~ cookie:', cookie);

    const body = await req.formData();

    console.log(
      "🚀 ~ POST ~ `Bearer ${cookie?.value || ''}`:",
      `Bearer ${cookie?.value || ''}`
    );
    const graphqlResponse = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      body,
      headers: {
        'x-apollo-operation-name': 'createSpot',
        Authorization: `Bearer ${cookie?.value || ''}`,
      },
      // NÃO defina headers — o fetch cuidará do multipart boundary automaticamente
    });

    const data = await graphqlResponse.json();
    console.log('🚀 ~ POST ~ data:', data);

    //   const res = await fetch(`http://localhost:4000/graphql`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       query: `
    //        mutation loginMutation($prop: ILoginInput) {
    //         login(props: $prop) {
    //           token
    //           exp
    //           createdAt
    //           name
    //           email
    //           id
    //         }
    // }
    //     `,
    //       variables: { prop: body },
    //     }),
    //   });

    //   const { data } = await res.json();
    //   console.log('🚀 ~ POST ~ data:', data);

    //   if (!data?.login?.token) {
    //     return NextResponse.json({ error: 'Login inválido' }, { status: 401 });
    //   }

    //   // Cria cookie httpOnly no servidor
    //   const response = NextResponse.json({ success: true, user: data.login });
    //   response.cookies.set('token', data.login.token, {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: 'lax',
    //     path: '/',
    //     maxAge: 60 * 60 * 24 * 7, // 7 dias
    //   });

    //   return response;
  } catch (err) {
    console.log('🚀 ~ POST ~ err:', err);
  }
}

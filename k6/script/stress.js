import http from 'k6/http';
import { check } from 'k6';

const host = 'http://host.docker.internal:3000';

export const options = {
  vus: 10,
  duration: '10s',
};

//  user setup
export function setup() {
  let res = http.get(`${host}/test/random/user`);
  console.log('Random User', JSON.stringify(JSON.parse(res.body)));
  let auth = http.post(
    `${host}/v1/auth/login`,
    JSON.stringify(JSON.parse(res.body)),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return { user: JSON.parse(auth.body) };
}

export default async function (data) {
  await test(data, 'GET', '/v1/customer/my', null);
}

export async function test(credential, method, endPoint, body) {
  await http
    .asyncRequest(method, host + endPoint, body, {
      headers: {
        Authorization: `Bearer ${credential.user.accessToken}`,
      },
    })
    .then((secondRes) => {
      if (secondRes.status !== 200) {
        if (secondRes.status === 401) {
          console.warn('Unauthorized Token', credential.user.accessToken);
        }

        console.log(
          'status code',
          secondRes.status,
          'response',
          secondRes.body,
        );
      }

      check(
        secondRes,
        {
          '2xx': (r) => 200 <= r.status && r.status < 300,
          '4xx': (r) => 400 <= r.status && r.status < 500,
          '5xx': (r) => 500 <= r.status && r.status < 600,
        },
        { tag: endPoint },
      );

      if (secondRes.httpRequestStatusCode >= 300) {
        console.warn(
          'Api response status code is not 2xx',
          secondRes.httpRequestStatusCode,
          secondRes.body,
        );
      }
    });
}

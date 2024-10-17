import http from "k6/http";
import { check } from "k6";

export const options = {
  vus: 10,
  duration: '10s',
};

export default async function () {
  const payload = {
    uuid: '',
    customerName: 'John Doe',
    authProvider: 'APPLE',
    userType: 'customer',
  };

  await test(payload, 'GET', '/v1/customer/my', null);
}

export async function test(credential, method, endPoint, body) {
  const host = 'http://host.docker.internal:3000';

  await http
    .asyncRequest('POST', host + '/v1/auth/login', JSON.stringify(credential), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(async (res) => {
      check(
        res,
        {
          login: (r) => 200 <= r.status && r.status < 300,
        },
        { tag: 'login' },
      );

      // Check if the response body is not empty and is a valid JSON
      if (res.body && typeof res.json() === 'object') {
        let accessToken = res.json().accessToken;

        if (accessToken) {
          await http
            .asyncRequest(method, host + endPoint, body, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            })
            .then((secondRes) => {
              check(
                secondRes,
                {
                  api: (r) => 200 <= r.status && r.status < 300,
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
        } else {
          console.log('No accessToken in the response', res.body);
        }
      } else {
        console.log('Invalid or empty JSON response', res.body);
      }
    });
}

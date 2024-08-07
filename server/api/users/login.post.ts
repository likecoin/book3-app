import { verifyMessage } from '@wagmi/vue/actions';
import { parseSiweMessage } from 'viem/siwe';

import { config as wagmiConfig } from '@/wagmi';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const session = await useSession(event, { password: config.sessionSecret });
  if (!session) {
    event.respondWith(new Response('Missing session.', { status: 401 }));
    return;
  }

  const nonce = session.data?.nonce;
  if (!nonce) {
    event.respondWith(new Response('Missing nonce in session.', { status: 401 }));
    return;
  }

  let body: {
    address: `0x${string}`;
    message: string;
    signature: `0x${string}`;
  };
  try {
    body = await readBody(event);
    if (!body.address) {
      event.respondWith(new Response('Missing address in request body.', { status: 400 }));
      return;
    }
    if (!body.message) {
      event.respondWith(new Response('Missing message in request body.', { status: 400 }));
      return;
    }
    if (!body.signature) {
      event.respondWith(new Response('Missing signature in request body.', { status: 400 }));
      return;
    }
  } catch (error) {
    console.error(error);
    event.respondWith(new Response('Invalid request body.', { status: 400 }));
    return;
  }

  try {
    const parsedMessage = parseSiweMessage(body.message);
    if (parsedMessage.address !== body.address) {
      event.respondWith(new Response('Address mismatch.', { status: 422 }));
      return;
    }

    if (parsedMessage.nonce !== nonce) {
      event.respondWith(new Response('Nonce mismatch.', { status: 422 }));
      return;
    }

    const isValid = await verifyMessage(wagmiConfig, {
      address: body.address,
      message: body.message,
      signature: body.signature,
    });

    if (!isValid) {
      event.respondWith(new Response('Invalid signed message for the given address.', { status: 422 }));
      return;
    }

    await session.update({ siwe: parsedMessage, nonce: null });

    return parsedMessage;
  } catch (error) {
    console.error(error);
    await session.clear();
    event.respondWith(new Response("Unknown error.", { status: 422 }));
  }
});

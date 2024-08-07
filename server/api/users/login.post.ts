import { SiweMessage } from 'siwe';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const session = await useSession(event, { password: config.sessionSecret });
  if (!session) {
    event.respondWith(new Response('Unauthorized', { status: 401 }));
    return;
  }

  try {
    const body = await readBody(event).catch(() => {});
    if (!body.address) {
      event.respondWith(new Response('Missing address in request body', { status: 422 }));
      return;
    }
    if (!body.message) {
      event.respondWith(new Response('Missing message in request body', { status: 422 }));
      return;
    }
    if (!body.signature) {
      event.respondWith(new Response('Missing signature in request body', { status: 422 }));
      return;
    }

    const siweMessage = new SiweMessage(body.message);
    const { data: message } = await siweMessage.verify({
      signature: body.signature,
      nonce: session.data?.nonce,
    });

    if (message.address !== body.address) {
      event.respondWith(new Response('Invalid address', { status: 422 }));
      return;
    }

    await session.update({ siwe: message, nonce: null });

    return { address: message.address };
  } catch (e) {
    await session.clear();
    console.error(e);
    event.respondWith(new Response(e?.toString(), { status: 500 }));
  }
});

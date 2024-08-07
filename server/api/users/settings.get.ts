export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const session = await useSession(event, { password: config.sessionSecret });
  const siweData = session.data?.siwe;
  if (!siweData) {
    event.respondWith(new Response('Unauthorized', { status: 401 }));
    return;
  }

  return siweData;
});

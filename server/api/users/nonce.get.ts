import { generateNonce } from 'siwe';

export default defineEventHandler(async (event) => {
  const nonce = generateNonce();

  const config = useRuntimeConfig(event);
  const session = await useSession(event, { name: config.public.sessionName, password: config.sessionSecret });
  await session.update({ nonce });

  return nonce;
});

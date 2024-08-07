import { generateNonce } from 'siwe';

export default defineEventHandler(async (event) => {
  const nonce = generateNonce();

  const config = useRuntimeConfig(event);
  const session = await useSession(event, { password: config.sessionSecret });
  await session.update({ nonce });

  return nonce;
});

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const session = await useSession(event, { name: config.public.sessionName, password: config.sessionSecret });
  await session.clear();
});

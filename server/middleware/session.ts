const {
  NODE_ENV,
} = process.env;

const isDev = NODE_ENV !== 'production';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  await useSession(event, {
    name: 'book3_app_session',
    password: config.sessionSecret,
    cookie: {
      sameSite: isDev ? 'lax' : undefined,
    },
  });
});

export default () => {
  const parsePort = (
    value: string | undefined,
    defaultValue: number,
  ): number => {
    const port = parseInt(value || '', 10);
    return isNaN(port) || port <= 0 ? defaultValue : port;
  };

  const parseString = (value: string | undefined): string | undefined => {
    return value === '' ? undefined : value;
  };

  return {
    port: parsePort(process.env.PORT, 3000),
    database: {
      host: process.env.DATABASE_HOST || 'localhost',
      port: parsePort(process.env.DATABASE_PORT, 5432),
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'project_name',
    },
    jwt: {
      secret: parseString(process.env.JWT_SECRET),
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
    mail: {
      host: process.env.MAIL_HOST || 'smtp.gmail.com',
      port: parsePort(process.env.MAIL_PORT, 587),
      user: process.env.MAIL_USER || '',
      password: process.env.MAIL_PASSWORD || '',
      from: process.env.MAIL_FROM || '',
    },
  };
};

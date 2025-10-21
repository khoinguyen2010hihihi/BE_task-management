import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { pino } from 'pino';

import { healthCheckRouter } from '@/api/healthCheck/healthCheckRouter';
import { userRouter } from '@/api/user/userRouter';
import { openAPIRouter } from '@/api-docs/openAPIRouter';
import errorHandler from '@/common/middleware/errorHandler';
import rateLimiter from '@/common/middleware/rateLimiter';
import requestLogger from '@/common/middleware/requestLogger';
import { env } from '@/common/utils/envConfig';
import { AppDataSource } from '@/configs/typeorm.config';
import 'reflect-metadata';
import { authRouter } from './api/auth/authRouter';
import { workspaceRouter } from './api/workspace/workspaceRouter';
import { workspaceMemberRouter } from './api/workspace-member/workspaceMemberRouter';
import { boardRouter } from './api/board/boardRouter';
import { boardMemberRouter } from './api/board-member/boardMemberRouter';

AppDataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

const logger = pino({ name: 'server start' });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

app.use(express.json())

// Request logging
app.use(requestLogger);

// Routes
app.use('/health-check', healthCheckRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/workspaces', workspaceRouter);
app.use('/ws-members', workspaceMemberRouter);
app.use('/boards', boardRouter);
app.use('/board-members', boardMemberRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
import { config } from 'dotenv';
import Fastify from 'fastify';
import rateLimit from '@fastify/rate-limit';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { exec } from 'child_process';
import { createHmac } from 'crypto';

config();

const GITHUB_SECRET = process.env.GITHUB_SECRET;

const fastify = Fastify({
  logger: false,
});
await fastify.register(cors);
await fastify.register(helmet, { global: true });
await fastify.register(rateLimit, {
  timeWindow: '1 minute',
  max: 100,
});

fastify.addHook('onRequest', (request, reply, done) => {
  const type = reply.getHeader('content-type');
  if (!type || type.indexOf('json') < 0) {
    request.headers['content-type'] = 'application/json';
  }
  done();
});
fastify.setErrorHandler(function (error, request, reply) {
  if (error.codeCode === 429) {
    reply.code(429);
    error.message = 'You hit the rate limit! Slow down please!';
  }

  reply.send(error);
});

function verifyGitHubPayload(request, secret) {
  const signature = request.headers['x-hub-signature-256'] || '';
  const hmac = createHmac('sha256', secret);
  const digest =
    'sha256=' + hmac.update(JSON.stringify(request.body)).digest('hex');
  return signature === digest;
}

fastify.post('/webhook', async (request, reply) => {
  if (!verifyGitHubPayload(request, GITHUB_SECRET)) {
    return reply
      .code(403)
      .send({ success: false, message: 'Invalid signature' });
  }

  const { repository, branch, folder } = request.query;

  // Assuming the format 'username/repo-name' for repository
  const [username, repoName] = repository.split('/');

  // Pull and restart only if it's the specified branch
  if (branch === 'master') {
    console.log(`Pulling ${username}/${repoName}...`);
    exec(
      `cd ${folder} && git pull origin ${branch} && pnpm start`,
      (err, stdout, stderr) => {
        if (err) {
          reply.send({ success: false, message: stderr });
          return;
        }
        reply.send({ success: true, message: stdout });
      }
    );
  } else {
    reply.send({ success: false, message: 'No action taken' });
  }
});

fastify.get('/test', async (request, reply) => {
  reply.send({ success: true });
});

const port = process.env.PORT;
fastify.listen({ port }, (err) => {
  if (err) {
    fastify.log.error(err);
  }
  console.log(`Server is running on http://localhost:${port}`);
});

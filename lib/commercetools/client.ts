import { ClientBuilder } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

const projectKey = process.env.CTP_PROJECT_KEY!;
const clientSecret = process.env.CTP_CLIENT_SECRET!;
const clientId = process.env.CTP_CLIENT_ID!;
const authUrl = process.env.CTP_AUTH_URL!;
const apiUrl = process.env.CTP_API_URL!;
const scopes = [process.env.CTP_SCOPES!];

const ctpClient = new ClientBuilder()
  .withProjectKey(projectKey)
  .withClientCredentialsFlow({
    host: authUrl,
    projectKey,
    credentials: { clientId, clientSecret },
    scopes,
  })
  .withHttpMiddleware({ host: apiUrl, fetch })
  .build();

export const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey });

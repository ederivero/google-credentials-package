import { GOOGLE_CREDENTIALS } from "./types"
import stackdriver from "pino-stackdriver"

function validateCredentials(google_credentials_env: string) {
  const env = process.env[google_credentials_env]

  if (!env) {
    throw new Error("Unable to find Google Credentials")
  }

  const credentials: GOOGLE_CREDENTIALS = JSON.parse(env)

  if (
    !credentials.type ||
    !credentials.project_id ||
    !credentials.private_key_id ||
    !credentials.private_key ||
    !credentials.client_email ||
    !credentials.client_id ||
    !credentials.auth_uri ||
    !credentials.token_uri ||
    !credentials.auth_provider_x509_cert_url ||
    !credentials.client_x509_cert_url
  ) {
    throw new Error("Unable to find Google Credentials")
  }

  return credentials
}

export function NestJsLogger(
  google_credentials_env: string = "GOOGLE_APPLICATION_CREDENTIALS",
) {
  let pinoHttp
  if (process.env.NODE_ENV === "production") {
    const credentials = validateCredentials(google_credentials_env)

    pinoHttp = [
      { level: "info" },
      stackdriver.createWriteStream({
        projectId: credentials.project_id,
        credentials: {
          client_email: credentials.client_email,
          private_key: credentials.private_key,
        },
      }),
    ]
  } else {
    pinoHttp = [
      {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: true,
            levelFirst: true,
          },
        },
      },
    ]
  }

  return pinoHttp
}

export function ExpressLogger(
  google_credentials_env: string = "GOOGLE_APPLICATION_CREDENTIALS",
) {
  if (process.env.NODE_ENV === "production") {
    const credentials = validateCredentials(google_credentials_env)

    return {
      options: {
        level: "info",
      },
      stream: stackdriver.createWriteStream({
        projectId: credentials.project_id,
        credentials: {
          client_email: credentials.client_email,
          private_key: credentials.private_key,
        },
        logName: "heimdall-webhook-proxies",
      }),
    }
  } else {
    return {
      options: {
        level: "debug",
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: true,
            levelFirst: true,
          },
        },
      },
      stream: null,
    }
  }
}

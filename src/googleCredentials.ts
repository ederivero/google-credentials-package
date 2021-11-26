import { GOOGLE_CREDENTIALS } from "./types"

export function googleApplicationCredentials(
  env = "GOOGLE_APPLICATION_CREDENTIALS",
) {
  if (!process.env[env]) {
    throw new Error("Unable to find Google Credentials")
  }
  const credentials: GOOGLE_CREDENTIALS = JSON.parse(process.env[env] ?? "")
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

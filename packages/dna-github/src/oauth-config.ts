/**
 * First-party GitHub OAuth App client ID for device-flow login.
 * Override with DNA_GITHUB_CLIENT_ID for custom OAuth apps.
 *
 * Register at: https://github.com/settings/applications/new
 * Enable "Device Flow" and set homepage to https://dna.humaan.app
 */
export const DNA_OAUTH_CLIENT_ID = "DNA_GITHUB_OAUTH_APP";

/** True when the shipped placeholder has not been replaced with a registered app ID. */
export function isPlaceholderClientId(clientId: string): boolean {
  return clientId === DNA_OAUTH_CLIENT_ID || clientId === "DNA_GITHUB_OAUTH_APP";
}

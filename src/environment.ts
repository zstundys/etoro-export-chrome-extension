/**
 * Use this when consuming env variables. The variables are normalized
 * here to fix common issues when copy pasting the keys from Google Console to the .env file. (trailing spaces, new lines, etc.)
 */
export const environment = {
  isPrivate: !!process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
  sheetIdForHoldings: process.env.HOLDINGS_SHEET_ID?.replace(/\\n/g, "\n"),
  sheetIdForPatreon: process.env.PATREON_SHEET_ID?.replace(/\\n/g, "\n"),
  apiClientEmail: process.env.CLIENT_EMAIL?.replace(/\\n/g, "\n"),
  apiPrivateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
} as const;

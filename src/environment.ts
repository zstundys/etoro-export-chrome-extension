import secrets from "../secrets.json";

export const environment = {
  isPrivate: !!secrets.private_key,
  sheetIdForHoldings: secrets.holdings_sheet_id,
  sheetIdForPatreon: secrets.patreon_sheet_id,
  apiClientEmail: secrets.client_email,
  apiPrivateKey: secrets.private_key,
} as const;

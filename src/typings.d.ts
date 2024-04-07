declare namespace NodeJS {
  // eslint-disable-next-line unicorn/prevent-abbreviations
  interface ProcessEnv {
    /** @deprecated use `src/environment.ts` instead */
    PRIVATE_KEY: string;
    /** @deprecated use `src/environment.ts` instead */
    HOLDINGS_SHEET_ID: string;
    /** @deprecated use `src/environment.ts` instead */
    PATREON_SHEET_ID: string;
    /** @deprecated use `src/environment.ts` instead */
    CLIENT_EMAIL: string;
  }
}

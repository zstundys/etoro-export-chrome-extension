export class ElementNotFoundError implements Error {
  readonly name = "Element not found";
  message: string;
  stack?: string | undefined;

  constructor(public selector: string) {
    const elementSelectorToNameMap: Record<string, string> = {
      '[data-etoro-automation-id="portfolio-overview-table-body-cell-market-name"]': `Stock symbol was not found`,
      '[data-etoro-automation-id="portfolio-overview-table-body-cell-units-value"]': `"Units" column was not found`,
      '[data-etoro-automation-id="portfolio-overview-table-body-cell-total-amount"]': `"Invested" column was not found`,
      '[data-etoro-automation-id="portfolio-overview-table-body-cell-equity"]': `"Value" column was not found`,
      '[data-etoro-automation-id="portfolio-overview-table-body-cell-avg-open-rate"]': `"Avg. open" column was not found`,
      '[data-etoro-automation-id="portfolio-manual-trades-table-body-market-name"]': `Stock symbol was not found`,
      '[data-etoro-automation-id="portfolio-manual-trades-table-body-invested-value"]': `"Invested" column was not found`,
      '[data-etoro-automation-id="portfolio-manual-trades-table-body-open-rate"]': `"Open" column was not found`,
      '[automation-id="account-balance-availible-unit-value"]': `Account balance was not found`,
    };

    this.message = elementSelectorToNameMap[selector];
  }

  static handle(cb: () => void) {
    try {
      cb();
    } catch (error: unknown) {
      if (error instanceof ElementNotFoundError) {
        alert(error.message);
      } else {
        throw error;
      }
    }
  }
}

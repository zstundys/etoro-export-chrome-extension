class PageUtils {
  static getTableForTradesPage() {
    const dom = {
      SYMBOL:
        '[data-etoro-automation-id="portfolio-manual-trades-table-body-market-name"]',
      SHARES:
        '[data-etoro-automation-id="portfolio-overview-table-body-cell-units-value"]',
      PRICE:
        '[data-etoro-automation-id="portfolio-manual-trades-table-body-open-rate"]',

      invested:
        '[data-etoro-automation-id="portfolio-manual-trades-table-body-invested-value"]',
      root: '[data-etoro-automation-id="portfolio-manual-trades-table"]',
    };

    const rowData = PageUtils.getRowElements(dom.root)
      .map((rowElement) => [
        PageUtils.getContentForChild(rowElement, dom.SYMBOL),
        PageUtils.getContentForChild(rowElement, dom.PRICE),
        PageUtils.getContentForChild(rowElement, dom.invested),
      ])
      .map(([symbol, price, invested]) => {
        const shares = (invested / price).toFixed(4);
        return [symbol, shares, price];
      });

    DataUtils.sortMatrixByColumn(rowData, 0);
    const columns = Object.keys(dom).slice(0, rowData[0].length);

    return [columns, ...rowData];
  }

  static getTableForPortfolioPage() {
    const dom = {
      SYMBOL:
        '[data-etoro-automation-id="portfolio-overview-table-body-cell-market-name"]',
      SHARES:
        '[data-etoro-automation-id="portfolio-overview-table-body-cell-units-value"]',
      INVESTED:
        '[data-etoro-automation-id="portfolio-overview-table-body-cell-total-amount"]',
      MARKET_VALUE:
        '[data-etoro-automation-id="portfolio-overview-table-body-cell-equity"]',

      root: '[data-etoro-automation-id="portfolio-overview-table-body"]',
    };

    const rowData = PageUtils.getRowElements(dom.root).map((el) => [
      PageUtils.getContentForChild(el, dom.SYMBOL),
      PageUtils.getContentForChild(el, dom.SHARES),
      PageUtils.getContentForChild(el, dom.INVESTED),
      PageUtils.getContentForChild(el, dom.MARKET_VALUE),
    ]);

    DataUtils.sortMatrixByColumn(rowData, 0);
    const columns = Object.keys(dom).slice(0, rowData[0].length);

    return [columns, ...rowData];
  }

  static checkPage() {
    const isPortfolio = window.location.pathname.endsWith("portfolio");
    const isTrades = window.location.pathname.endsWith("manual-trades");

    return { isPortfolio, isTrades };
  }

  /**
   *
   * @returns {[any[][], string]}
   */
  static getDatasetAndFileNameForPage() {
    const { isPortfolio, isTrades } = PageUtils.checkPage();

    if (isPortfolio) {
      return [PageUtils.getTableForPortfolioPage(), "portfolio"];
    }
    if (isTrades) {
      return [PageUtils.getTableForTradesPage(), "trades"];
    }

    return [[], ""];
  }

  static getContentForChild(parent, childSelector) {
    return parent
      .querySelector(childSelector)
      ?.textContent.trim()
      .replace(/\$|,/gi, "");
  }

  /**
   * Returns an array of row elements for given table
   * @param {string} tableSelector
   * @returns {HTMLElement[]}
   */
  static getRowElements(tableSelector) {
    return Array.from(
      document
        .querySelector(tableSelector)
        .querySelectorAll(".ui-table-row-container")
    );
  }
}

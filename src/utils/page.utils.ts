import {
  ExportedHoldingCsvData,
  RowData,
  TradeTuple,
} from "../typings/csv-data";
import { ElementNotFoundError } from "./error.utils";

import { DataUtils } from "./data.utils";

export class PageUtils {
  static getTableForTradesPage(): ExportedHoldingCsvData {
    const dom = {
      SYMBOL:
        '[data-etoro-automation-id="portfolio-manual-trades-table-body-market-name"]',
      SHARES:
        '[data-etoro-automation-id="portfolio-overview-table-body-cell-units-value"]',
      INVESTED:
        '[data-etoro-automation-id="portfolio-manual-trades-table-body-invested-value"]',
      price:
        '[data-etoro-automation-id="portfolio-manual-trades-table-body-open-rate"]',

      root: '[data-etoro-automation-id="portfolio-manual-trades-table"]',
    } as const;

    const rowData: TradeTuple[] = PageUtils.getRowElements(dom.root)
      .map((rowElement) => [
        PageUtils.getContentForChild(rowElement, dom.SYMBOL),
        PageUtils.getContentForChild(rowElement, dom.price),
        PageUtils.getContentForChild(rowElement, dom.INVESTED),
      ])
      .map(([symbol, price, invested]) => {
        const shares = (parseFloat(invested) / parseFloat(price)).toFixed(4);
        return [symbol, parseFloat(shares), parseFloat(invested)];
      });

    const exportedData = confirm(
      "Would you like to aggregate the data by symbol?"
    )
      ? this.formatRowData(this.aggregateData(rowData))
      : this.formatRowData(rowData);

    DataUtils.sortMatrixByColumn(exportedData, 0);
    const columns = Object.keys(dom).slice(0, exportedData[0].length);

    return [columns, ...exportedData];
  }

  static getTableForPortfolioPage(): ExportedHoldingCsvData {
    const dom = {
      SYMBOL:
        '[data-etoro-automation-id="portfolio-overview-table-body-cell-market-name"]',
      SHARES:
        '[data-etoro-automation-id="portfolio-overview-table-body-cell-units-value"]',
      INVESTED:
        '[data-etoro-automation-id="portfolio-overview-table-body-cell-total-amount"]',
      MARKET_VALUE:
        '[data-etoro-automation-id="portfolio-overview-table-body-cell-equity"]',
      AVERAGE_PRICE:
        '[data-etoro-automation-id="portfolio-overview-table-body-cell-avg-open-rate"]',

      root: '[data-etoro-automation-id="portfolio-overview-table-body"]',
    };

    const rowData = PageUtils.getRowElements(dom.root).map((el) => [
      PageUtils.getContentForChild(el, dom.SYMBOL),
      PageUtils.getContentForChild(el, dom.SHARES),
      PageUtils.getContentForChild(el, dom.INVESTED),
      PageUtils.getContentForChild(el, dom.MARKET_VALUE),
      PageUtils.getContentForChild(el, dom.AVERAGE_PRICE),
    ]);

    DataUtils.sortMatrixByColumn(rowData, 0);
    const columns = Object.keys(dom).slice(0, rowData[0].length);

    return [columns, ...rowData];
  }

  static aggregateData(duplicateData: TradeTuple[]): TradeTuple[] {
    type HoldingsMap = {
      [symbol: string]: TradeTuple;
    };

    const summedRowData = duplicateData.reduce<HoldingsMap>(
      (acc, [symbol, shares, invested]) => {
        if (symbol in acc) {
          const [, accShares, accInvested] = acc[symbol];

          return {
            ...acc,
            [symbol]: [symbol, accShares + shares, accInvested + invested],
          };
        } else {
          return {
            ...acc,
            [symbol]: [symbol, shares, invested],
          };
        }
      },
      {}
    );

    return Object.values(summedRowData);
  }

  static checkPage(): { isPortfolio: boolean; isTrades: boolean } {
    const isPortfolio = window.location.pathname.endsWith("portfolio");
    const isTrades = window.location.pathname.endsWith("manual-trades");

    return { isPortfolio, isTrades };
  }

  static getDatasetAndFileNameForPage(): [
    dataset: ExportedHoldingCsvData,
    fileName: string
  ] {
    const { isPortfolio, isTrades } = PageUtils.checkPage();

    if (isPortfolio) {
      return [PageUtils.getTableForPortfolioPage(), "portfolio"];
    }
    if (isTrades) {
      return [PageUtils.getTableForTradesPage(), "trades"];
    }

    return [[[]], ""];
  }

  static getAvailableToSpend(): number {
    const footerEl = document.querySelector<HTMLElement>("et-account-balance");

    if (footerEl) {
      const availableToSpend = PageUtils.getContentForChild(
        footerEl,
        '[automation-id="account-balance-availible-unit-value"]'
      );

      return parseFloat(availableToSpend);
    } else {
      return 0;
    }
  }

  static getContentForChild(
    parent: HTMLElement,
    childSelector: string
  ): string {
    const childElement = parent.querySelector(childSelector);

    if (!childElement) {
      throw new ElementNotFoundError(childSelector);
    }

    const childElementText = childElement.textContent ?? "";
    const cleanText = childElementText.trim().replace(/\$|,/gi, "");

    return cleanText;
  }

  /** Returns an array of row elements for given table */
  static getRowElements(tableSelector: string): HTMLElement[] {
    return Array.from(
      document
        .querySelector(tableSelector)
        ?.querySelectorAll(".ui-table-row-container") ?? []
    );
  }

  static formatRowData(rawRowData: TradeTuple[]): RowData[] {
    return rawRowData.map(([symbol, shares, price]) => [
      symbol,
      shares.toFixed(4),
      price.toFixed(2),
    ]);
  }
}

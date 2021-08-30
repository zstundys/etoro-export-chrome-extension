import { ExportedHoldingCsvData } from "../types";

const cryptoMap = new Map<string, string>();

cryptoMap.set("BTC", "BTCUSDT");
cryptoMap.set("ETH", "ETHUSDT");
cryptoMap.set("ETHEREUM", "ETHUSDT");
cryptoMap.set("ADA", "ADAUSDT");

const stockMap = new Map<string, string>();

stockMap.set("DASH.US", "DASH");

export class DataUtils {
  /** Filters crypto rows out from given dataset */
  static excludeCryptoRows(
    matrix: ExportedHoldingCsvData,
    symbolIndex: number
  ): ExportedHoldingCsvData {
    const [columns, ...rows] = matrix;
    const stockRows = rows.filter((row) => !cryptoMap.has(row[symbolIndex]));

    return [columns, ...stockRows];
  }

  /** Keeps only crypto rows from given dataset */
  static keepOnlyCryptoRows(
    matrix: ExportedHoldingCsvData,
    symbolIndex: number
  ): ExportedHoldingCsvData {
    const [columns, ...rows] = matrix;

    const cryptoRows = rows.filter((row) => cryptoMap.has(row[symbolIndex]));
    return [columns, ...cryptoRows];
  }

  /** Maps crypto symbols to Qualtrimm supported format */
  static mapCryptoSymbolsRows(
    matrix: string[][],
    symbolIndex: number
  ): string[][] {
    const [columns, ...rows] = matrix;
    const mappedRows = rows.map((row) => {
      const rawSymbol = row[symbolIndex];
      const symbol = cryptoMap.get(rawSymbol) || rawSymbol;

      row.splice(symbolIndex, 1, symbol);

      return row;
    });

    return [columns, ...mappedRows];
  }

  /** Maps stock symbols to Qualtrimm supported format */
  static mapStockSymbolsRows(
    matrix: ExportedHoldingCsvData,
    symbolIndex: number
  ): ExportedHoldingCsvData {
    const [columns, ...rows] = matrix;
    const mappedRows = rows.map((row) => {
      const rawSymbol = row[symbolIndex];
      const symbol = stockMap.get(rawSymbol) || rawSymbol;

      row.splice(symbolIndex, 1, symbol);

      return row;
    });

    return [columns, ...mappedRows];
  }

  static sortMatrixByColumn(matrix: string[][], columnIndex: number): void {
    matrix.sort((a, b) => a[columnIndex].localeCompare(b[columnIndex]));
  }
}

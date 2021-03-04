const cryptoMap = {
  BTC: "BTCUSDT",
  ETHEREUM: "ETHUSDT",
  ADA: "ADA",
};

const stockMap = {
  "DASH.US": "DASH",
};

class DataUtils {
  /**
   * Filters crypto rows out from given dataset
   * @param {string[][]} matrix stock data
   * @param {number} symbolIndex index for symbol column
   * @returns {string[][]}
   */
  static excludeCryptoRows(matrix, symbolIndex) {
    return matrix.filter(
      (row) => !Object.keys(cryptoMap).includes(row[symbolIndex])
    );
  }

  /**
   * Keeps only crypto rows from given dataset
   * @param {string[][]} matrix stock data
   * @param {number} symbolIndex index for symbol column
   * @returns {string[][]}
   */
  static keepOnlyCryptoRows(matrix, symbolIndex) {
    const [columns, ...rows] = matrix;

    const cryptoRows = rows.filter((row) =>
      Object.keys(cryptoMap).includes(row[symbolIndex])
    );
    return [columns, ...cryptoRows];
  }

  /**
   * Maps crypto symbols to Qualtrimm supported format
   * @param {string[][]} matrix stock data
   * @param {number} symbolIndex index for symbol column
   * @returns {string[][]}
   */
  static mapCryptoSymbolsRows(matrix, symbolIndex) {
    const [columns, ...rows] = matrix;
    const mappedRows = rows.map((row) => {
      const rawSymbol = row[symbolIndex];
      const symbol = cryptoMap[rawSymbol] || rawSymbol;

      row.splice(symbolIndex, 1, symbol);

      return row;
    });

    return [columns, ...mappedRows];
  }

  /**
   * Maps stock symbols to Qualtrimm supported format
   * @param {string[][]} matrix stock data
   * @param {number} symbolIndex index for symbol column
   * @returns {string[][]}
   */
  static mapStockSymbolsRows(matrix, symbolIndex) {
    const [columns, ...rows] = matrix;
    const mappedRows = rows.map((row) => {
      const rawSymbol = row[symbolIndex];
      const symbol = stockMap[rawSymbol] || rawSymbol;

      row.splice(symbolIndex, 1, symbol);

      return row;
    });

    return [columns, ...mappedRows];
  }

  static sortMatrixByColumn(matrix, columnIndex) {
    matrix.sort((a, b) => a[columnIndex].localeCompare(b[columnIndex]));
  }
}

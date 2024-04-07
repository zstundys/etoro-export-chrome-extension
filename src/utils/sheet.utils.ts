import { GoogleSpreadsheet } from "google-spreadsheet";
import { environment } from "../environment";
import { JWT } from "google-auth-library";

import { ExportedHoldingCsvData } from "../typings/csv-data";
import { Log } from "./log.utils";
import { raise } from "./error.utils";

export class SheetUtils {
  private static readonly auth = new JWT({
    email: environment.apiClientEmail,
    key: environment.apiPrivateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  private static readonly savingsDocument = new GoogleSpreadsheet(
    environment.sheetIdForHoldings ?? raise("Sheet ID for holdings is missing"),
    this.auth
  );
  private static readonly patreonDocument = new GoogleSpreadsheet(
    environment.sheetIdForPatreon ?? raise("Sheet ID for patreon is missing"),
    this.auth
  );

  // Holdings sheet
  private static readonly holdingsSheetTitle = "Holdings";
  private static readonly holdingsRange = "A8:Q108";
  private static readonly holdingsRangeHeight = 100;
  private static readonly holdingsRangeRow = 8;
  // Allocation sheet
  private static readonly allocationSheetTitle = "Allocation";
  private static readonly availableToSpendCell = "B1";
  // Patreon sheet
  private static readonly patreonHoldingsSheetTitle = "Enter-Data-Here";
  private static readonly patreonHoldingsRange = "A4:C104";
  private static readonly patreonHoldingsRangeHeight = 100;
  private static readonly patreonHoldingsRangeRow = 4;

  static async syncHoldings(dataset: ExportedHoldingCsvData) {
    Log.info("Syncing holdings to Google Sheets...");

    await this.initialize(this.savingsDocument);
    const sheet = SheetUtils.getHoldingsSheet();
    await sheet.loadCells(this.holdingsRange);

    SheetUtils.clearHoldings();
    const [, ...rowData] = dataset;

    for (const [i, row] of rowData.entries()) {
      const r = this.holdingsRangeRow + i;
      const [symbol, shares, invested] = row;

      const rowCells = this.getHoldings(r);
      rowCells.A.value = symbol;
      rowCells.B.value = parseFloat(shares);
      rowCells.C.value = parseFloat(invested);
      rowCells.D.formula = `=GOOGLEFINANCE(A${r}, "price")*B${r}`;
      rowCells.E.formula = `=D${r}-C${r}`;
      rowCells.F.formula = `=D${r}/C${r} - 1`;
      rowCells.G.formula = `=GOOGLEFINANCE($A${r}) / INDEX(GOOGLEFINANCE($A${r},"price",TODAY()-52*7),2, 2) - 1`;
      rowCells.H.formula = `=GOOGLEFINANCE($A${r}) / INDEX(GOOGLEFINANCE($A${r},"price",TODAY()-90),2, 2) - 1`;
      rowCells.I.formula = `=GOOGLEFINANCE($A${r}) / INDEX(GOOGLEFINANCE($A${r},"price",TODAY()-30),2, 2) - 1`;
      rowCells.J.formula = `=GOOGLEFINANCE($A${r}) / INDEX(GOOGLEFINANCE($A${r},"price",TODAY()-10),2, 2) - 1`;
      rowCells.K.formula = `=GOOGLEFINANCE($A${r}) / INDEX(GOOGLEFINANCE($A${r},"price",TODAY()-3),2, 2) - 1`;
      rowCells.L.formula = `=GOOGLEFINANCE(A${r},"eps")`;
      rowCells.M.formula = `=GOOGLEFINANCE(A${r},"pe")`;
      rowCells.N.formula = `=GOOGLEFINANCE(A${r},"beta")`;
      rowCells.O.formula = `=VLOOKUP($A${r},StockRef,4, false)`;
      rowCells.P.formula = `=D${r}*O${r}`;
      rowCells.Q.formula = `=VLOOKUP($A${r},Ref!$B$2:$C,2, false)`;
    }

    await sheet.saveUpdatedCells();

    Log.info("Syncing holdings to Google Sheets... Done");
  }

  static async syncPatreonHoldings(dataset: ExportedHoldingCsvData) {
    Log.info("Syncing patreon holdings to Google Sheets...");

    await this.initialize(this.patreonDocument);
    const sheet = SheetUtils.getPatreonHoldingsSheet();
    await sheet.loadCells(this.patreonHoldingsRange);

    SheetUtils.clearPatreonHoldings();
    const [, ...rowData] = dataset;

    rowData.forEach((row, i) => {
      const r = this.patreonHoldingsRangeRow + i;
      const [symbol, shares, _invested, _marketValue, avgPrice] = row;

      const rowCells = this.getPatreonHoldings(r);
      rowCells.A.value = symbol;
      rowCells.B.value = parseFloat(shares);
      rowCells.C.value = parseFloat(avgPrice);
    });

    await sheet.saveUpdatedCells();

    Log.info("Syncing patreon holdings to Google Sheets... Done");
  }

  static async syncAvailableToSpend(availableToSpend: number) {
    Log.info(`Updating available to spend cell (${availableToSpend}$)...`);

    await this.initialize(this.savingsDocument);
    const sheet = this.getAllocationSheet();
    await sheet.loadCells(this.availableToSpendCell);

    const cell = sheet.getCellByA1(this.availableToSpendCell);
    cell.value = availableToSpend;

    await sheet.saveUpdatedCells();

    Log.info(
      `Updating available to spend cell (${availableToSpend}$)... Done `
    );
  }

  private static async initialize(document: GoogleSpreadsheet) {
    await document.loadInfo();
  }

  private static getHoldingsSheet() {
    return this.savingsDocument.sheetsByTitle[this.holdingsSheetTitle];
  }

  private static getAllocationSheet() {
    return this.savingsDocument.sheetsByTitle[this.allocationSheetTitle];
  }

  private static getPatreonHoldingsSheet() {
    return this.patreonDocument.sheetsByTitle[this.patreonHoldingsSheetTitle];
  }

  private static clearHoldings() {
    for (let i = 0; i <= this.holdingsRangeHeight; i++) {
      const row = this.holdingsRangeRow + i;

      const rowCells = this.getHoldings(row);

      Object.values(rowCells).forEach((cell) => {
        cell.value = "";
      });
    }
  }

  private static clearPatreonHoldings() {
    for (let i = 0; i <= this.patreonHoldingsRangeHeight; i++) {
      const row = this.patreonHoldingsRangeRow + i;

      const rowCells = this.getPatreonHoldings(row);

      for (const cell of Object.values(rowCells)) {
        cell.value = "";
      }
    }
  }

  private static getHoldings(rowNumber: number) {
    const sheet = this.getHoldingsSheet();

    return {
      /** Stock */
      A: sheet.getCellByA1(`A${rowNumber}`),
      /** Units */
      B: sheet.getCellByA1(`B${rowNumber}`),
      /** Invested */
      C: sheet.getCellByA1(`C${rowNumber}`),
      /** Market Price `=GOOGLEFINANCE(A8, "price")*B8` */
      D: sheet.getCellByA1(`D${rowNumber}`),
      /** P/L ($) `=D8-C8` */
      E: sheet.getCellByA1(`E${rowNumber}`),
      /** P/L (%) `=D8/C8 - 1` */
      F: sheet.getCellByA1(`F${rowNumber}`),
      /** Last 52 weeks `=GOOGLEFINANCE($A8) / INDEX(GOOGLEFINANCE($A8,"price",TODAY()-52*7),2, 2) - 1` */
      G: sheet.getCellByA1(`G${rowNumber}`),
      /** Last 90 days `=GOOGLEFINANCE($A8) / INDEX(GOOGLEFINANCE($A8,"price",TODAY()-90),2, 2) - 1` */
      H: sheet.getCellByA1(`H${rowNumber}`),
      /** Last 30 days `=GOOGLEFINANCE($A8) / INDEX(GOOGLEFINANCE($A8,"price",TODAY()-30),2, 2) - 1` */
      I: sheet.getCellByA1(`I${rowNumber}`),
      /** Last 10 days `=GOOGLEFINANCE($A8) / INDEX(GOOGLEFINANCE($A8,"price",TODAY()-10),2, 2) - 1` */
      J: sheet.getCellByA1(`J${rowNumber}`),
      /** Last 3 days `=GOOGLEFINANCE($A8) / INDEX(GOOGLEFINANCE($A8,"price",TODAY()-3),2, 2) - 1` */
      K: sheet.getCellByA1(`K${rowNumber}`),
      /** EPS `=GOOGLEFINANCE(A8,"eps")` */
      L: sheet.getCellByA1(`L${rowNumber}`),
      /** P/E `=GOOGLEFINANCE(A8,"pe")` */
      M: sheet.getCellByA1(`M${rowNumber}`),
      /** Beta `=GOOGLEFINANCE(A8,"beta")` */
      N: sheet.getCellByA1(`N${rowNumber}`),
      /** Dividend Yield `=VLOOKUP($A8,StockRef,4, false)` */
      O: sheet.getCellByA1(`O${rowNumber}`),
      /** Dividend Income `=D8*O8` */
      P: sheet.getCellByA1(`P${rowNumber}`),
      /** Sector `=VLOOKUP($A8,Ref!$B$2:$C,2, false)` */
      Q: sheet.getCellByA1(`Q${rowNumber}`),
    };
  }

  private static getPatreonHoldings(rowNumber: number) {
    const sheet = this.getPatreonHoldingsSheet();

    return {
      /** Ticker */
      A: sheet.getCellByA1(`A${rowNumber}`),
      /** Shares */
      B: sheet.getCellByA1(`B${rowNumber}`),
      /** Avg. Price */
      C: sheet.getCellByA1(`C${rowNumber}`),
    };
  }
}

import { GoogleSpreadsheet } from "google-spreadsheet";

import secrets from "../../secrets.json";
import { ExportedHoldingCsvData } from "../typings/csv-data";

export class SheetUtils {
  private static readonly document = new GoogleSpreadsheet(
    secrets.holdings_sheet_id
  );

  // Holdings sheet
  private static readonly holdingsSheetTitle = "Holdings";
  private static readonly holdingsRange = "A8:Q108";
  private static readonly holdingsRangeHeight = 100;
  private static readonly holdingsRangeRow = 8;
  // Allocation sheet
  private static readonly allocationSheetTitle = "Allocation";
  private static readonly availableToSpendCell = "B1";
  // Secrets
  private static readonly clientEmail = secrets.client_email;
  private static readonly privateKey = secrets.private_key;

  static async syncHoldings(dataset: ExportedHoldingCsvData) {
    console.log("Syncing holdings to Google Sheets...");

    await this.initialize();
    const sheet = SheetUtils.getHoldingsSheet();
    await sheet.loadCells(this.holdingsRange);

    SheetUtils.clearHoldings();
    const [, ...rowData] = dataset;

    rowData.forEach((row, i) => {
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
    });

    await sheet.saveUpdatedCells();

    console.log("Syncing holdings to Google Sheets... Done");
  }

  static async syncAvailableToSpend(availableToSpend: number) {
    console.log(`Updating available to spend cell (${availableToSpend}$)...`);

    await this.initialize();
    const sheet = this.getAllocationSheet();
    await sheet.loadCells(this.availableToSpendCell);

    const cell = sheet.getCellByA1(this.availableToSpendCell);
    cell.value = availableToSpend;

    await sheet.saveUpdatedCells();

    console.log(
      `Updating available to spend cell (${availableToSpend}$)... Done `
    );
  }

  private static async initialize() {
    await this.document.useServiceAccountAuth({
      client_email: this.clientEmail,
      private_key: this.privateKey,
    });

    await this.document.loadInfo();
  }

  private static getHoldingsSheet() {
    return this.document.sheetsByTitle[this.holdingsSheetTitle];
  }

  private static getAllocationSheet() {
    return this.document.sheetsByTitle[this.allocationSheetTitle];
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
}

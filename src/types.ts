export type TradeTuple = [symbol: string, shares: number, invested: number];
export type RowData = string[];
export type ExportedHoldingCsvData = [columns: string[], ...rowData: RowData[]];

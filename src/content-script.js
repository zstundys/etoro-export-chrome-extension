import { google } from "googleapis";

chrome.runtime.onMessage.addListener((message) => {
  const actionMap = {
    "export-all": () => {
      const [dataset, fileName] = PageUtils.getDatasetAndFileNameForPage();
      const exported = DataUtils.mapCryptoSymbolsRows(dataset, 0);

      console.log(message.action, exported);
      // FileUtils.downloadMatrixAsCsv(exported, `${fileName}-all`);
    },
    "export-stocks": async () => {
      const [dataset, fileName] = PageUtils.getDatasetAndFileNameForPage();
      const stocksDataset = DataUtils.excludeCryptoRows(dataset, 0);
      const exported = DataUtils.mapStockSymbolsRows(stocksDataset, 0);

      console.log(message.action, exported);
      // FileUtils.downloadMatrixAsCsv(exported, `${fileName}-stocks`);
      debugger;

      const auth = await google.auth.getClient({
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });

      const sheets = google.sheets({ version: "v4", auth });

      const range = `Test!A1:A`;
      const response = await sheets.spreadsheets.values.get({
        range,
        spreadsheetId: "1OimgZPHE6na4Lz4eOSoWZr8NkQQ6p7Nlmu0vXRm2-ls",
      });
    },
    "export-crypto": () => {
      const [dataset, fileName] = PageUtils.getDatasetAndFileNameForPage();
      const exported = DataUtils.keepOnlyCryptoRows(dataset, 0);
      const mapped = DataUtils.mapCryptoSymbolsRows(exported, 0);

      console.log(message.action, mapped);
      // FileUtils.downloadMatrixAsCsv(mapped, `${fileName}-crypto`);
    },
  };

  actionMap[message.action]();
});

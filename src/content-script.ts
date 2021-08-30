import { DataUtils } from "./utils/data.utils";
import { PageUtils } from "./utils/page.utils";
import { FileUtils } from "./utils/file.utils";

enum ExportAction {
  ExportAll = "export-all",
  ExportStocks = "export-stocks",
  ExportCrypto = "export-crypto",
}

interface ExportMessage {
  action: ExportAction;
}

chrome.runtime.onMessage.addListener((message: ExportMessage) => {
  const actionMap: Record<ExportAction, () => void> = {
    [ExportAction.ExportAll]: () => {
      const [dataset, fileName] = PageUtils.getDatasetAndFileNameForPage();
      const exported = DataUtils.mapCryptoSymbolsRows(dataset, 0);

      console.log(message.action, exported);
      FileUtils.downloadMatrixAsCsv(exported, `${fileName}-all`);
    },
    [ExportAction.ExportStocks]: () => {
      const [dataset, fileName] = PageUtils.getDatasetAndFileNameForPage();
      const stocksDataset = DataUtils.excludeCryptoRows(dataset, 0);
      const exported = DataUtils.mapStockSymbolsRows(stocksDataset, 0);

      console.log(message.action, exported);
      FileUtils.downloadMatrixAsCsv(exported, `${fileName}-stocks`);
    },
    [ExportAction.ExportCrypto]: () => {
      const [dataset, fileName] = PageUtils.getDatasetAndFileNameForPage();
      const exported = DataUtils.keepOnlyCryptoRows(dataset, 0);
      const mapped = DataUtils.mapCryptoSymbolsRows(exported, 0);

      console.log(message.action, mapped);
      FileUtils.downloadMatrixAsCsv(mapped, `${fileName}-crypto`);
    },
  };

  actionMap[message.action]();
});

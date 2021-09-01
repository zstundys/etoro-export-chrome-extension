import { DataUtils } from "./utils/data.utils";
import { PageUtils } from "./utils/page.utils";
import { FileUtils } from "./utils/file.utils";
import { SheetUtils } from "./utils/sheet.utils";
import { Log } from "./utils/log.utils";

enum ExportAction {
  ExportAll = "export-all",
  ExportStocks = "export-stocks",
  SyncStocks = "sync-stocks",
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

      Log.info("Exporting all...", exported);
      FileUtils.downloadMatrixAsCsv(exported, `${fileName}-all`);
    },
    [ExportAction.ExportStocks]: () => {
      const [dataset, fileName] = PageUtils.getDatasetAndFileNameForPage();
      const stocksDataset = DataUtils.excludeCryptoRows(dataset, 0);
      const exported = DataUtils.mapStockSymbolsRows(stocksDataset, 0);

      Log.info("Exporting stocks...", exported);
      FileUtils.downloadMatrixAsCsv(exported, `${fileName}-stocks`);
    },
    [ExportAction.SyncStocks]: async () => {
      const [dataset] = PageUtils.getDatasetAndFileNameForPage();
      const stocksDataset = DataUtils.excludeCryptoRows(dataset, 0);
      const exported = DataUtils.mapStockSymbolsRows(stocksDataset, 0);
      const availableToSpend = PageUtils.getAvailableToSpend();

      Log.info("Synchronizing stocks...", exported);
      await SheetUtils.syncHoldings(exported);
      await SheetUtils.syncAvailableToSpend(availableToSpend);
      await SheetUtils.syncPatreonHoldings(exported);
      Log.info("Synchronizing stocks... Done");
    },
    [ExportAction.ExportCrypto]: () => {
      const [dataset, fileName] = PageUtils.getDatasetAndFileNameForPage();
      const exported = DataUtils.keepOnlyCryptoRows(dataset, 0);
      const mapped = DataUtils.mapCryptoSymbolsRows(exported, 0);

      Log.info("Exporting crypto...", exported);
      FileUtils.downloadMatrixAsCsv(mapped, `${fileName}-crypto`);
    },
  };

  actionMap[message.action]();
});

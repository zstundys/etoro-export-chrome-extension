chrome.runtime.onMessage.addListener((message) => {
  const actionMap = {
    "export-all": () => {
      const [dataset, fileName] = PageUtils.getDatasetAndFileNameForPage();
      const exported = DataUtils.mapCryptoSymbolsRows(dataset, 0);

      console.log(message.action, exported);
      FileUtils.downloadMatrixAsCsv(exported, fileName);
    },
    "export-stocks": () => {
      const [dataset, fileName] = PageUtils.getDatasetAndFileNameForPage();
      const stocksDataset = DataUtils.excludeCryptoRows(dataset, 0);
      const exported = DataUtils.mapStockSymbolsRows(stocksDataset, 0);

      console.log(message.action, exported);
      FileUtils.downloadMatrixAsCsv(exported, fileName);
    },
    "export-crypto": () => {
      const [dataset, fileName] = PageUtils.getDatasetAndFileNameForPage();
      const exported = DataUtils.keepOnlyCryptoRows(dataset, 0);
      const mapped = DataUtils.mapCryptoSymbolsRows(exported, 0);

      console.log(message.action, mapped);
      FileUtils.downloadMatrixAsCsv(mapped, fileName);
    },
  };

  actionMap[message.action]();
});

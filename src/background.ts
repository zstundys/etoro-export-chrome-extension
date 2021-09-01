import { ExportAction } from "./typings/export-action";

const actionTitleMap: Record<ExportAction, string> = {
  [ExportAction.ExportAll]: "Export all",
  [ExportAction.ExportStocks]: "Export stocks",
  [ExportAction.ExportCrypto]: "Export crypto",
  [ExportAction.SyncStocks]: "Sync stocks",
} as const;

const actions = Object.entries(actionTitleMap) as [ExportAction, string][];

actions.forEach(([action, title]) => {
  chrome.contextMenus.create({
    title,
    documentUrlPatterns:
      action === ExportAction.SyncStocks
        ? ["https://*.etoro.com/portfolio"]
        : [
            "https://*.etoro.com/portfolio",
            "https://*.etoro.com/portfolio/manual-trades",
          ],
    contexts: ["page", "link"],
    onclick: (_, tab) => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, { action });
      }
    },
  });
});

import { environment } from "./environment";
import { ExportAction } from "./typings/export-action";

const actions: ExportAction[] = environment.isPrivate
  ? [
      ExportAction.ExportAll,
      ExportAction.ExportCrypto,
      ExportAction.ExportStocks,
      ExportAction.SyncStocks,
    ]
  : [ExportAction.ExportAll];

actions.forEach((action) => {
  const actionTitleMap: Record<ExportAction, string> = {
    [ExportAction.ExportAll]: "Export to CSV",
    [ExportAction.ExportStocks]: "Export stocks",
    [ExportAction.ExportCrypto]: "Export crypto",
    [ExportAction.SyncStocks]: "Sync stocks",
  } as const;

  const title = actionTitleMap[action];

  chrome.contextMenus.create({
    id: action,
    title,
    documentUrlPatterns:
      action === ExportAction.SyncStocks
        ? ["https://*.etoro.com/portfolio"]
        : [
            "https://*.etoro.com/portfolio",
            "https://*.etoro.com/portfolio/manual-trades",
          ],
    contexts: ["page", "link"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (tab?.id) {
    chrome.tabs.sendMessage(tab.id, { action: info.menuItemId });
  }
});

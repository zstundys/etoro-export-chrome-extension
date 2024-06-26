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

for (const action of actions) {
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
    documentUrlPatterns: ["https://*.etoro.com/portfolio/overview"],
    contexts: ["page", "link"],
  });
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (tab?.id) {
    chrome.tabs.sendMessage(tab.id, { action: info.menuItemId });
  }
});

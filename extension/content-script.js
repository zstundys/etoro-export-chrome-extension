// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"utils/data.utils.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataUtils = void 0;

var __spreadArray = void 0 && (void 0).__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};

var cryptoMap = new Map();
cryptoMap.set("BTC", "BTCUSDT");
cryptoMap.set("ETH", "ETHUSDT");
cryptoMap.set("ETHEREUM", "ETHUSDT");
cryptoMap.set("ADA", "ADAUSDT");
var stockMap = new Map();
stockMap.set("DASH.US", "DASH");

var DataUtils = function () {
  function DataUtils() {}
  /** Filters crypto rows out from given dataset */


  DataUtils.excludeCryptoRows = function (matrix, symbolIndex) {
    return matrix.filter(function (row) {
      return !cryptoMap.has(row[symbolIndex]);
    });
  };
  /** Keeps only crypto rows from given dataset */


  DataUtils.keepOnlyCryptoRows = function (matrix, symbolIndex) {
    var columns = matrix[0],
        rows = matrix.slice(1);
    var cryptoRows = rows.filter(function (row) {
      return cryptoMap.has(row[symbolIndex]);
    });
    return __spreadArray([columns], cryptoRows, true);
  };
  /** Maps crypto symbols to Qualtrimm supported format */


  DataUtils.mapCryptoSymbolsRows = function (matrix, symbolIndex) {
    var columns = matrix[0],
        rows = matrix.slice(1);
    var mappedRows = rows.map(function (row) {
      var rawSymbol = row[symbolIndex];
      var symbol = cryptoMap.get(rawSymbol) || rawSymbol;
      row.splice(symbolIndex, 1, symbol);
      return row;
    });
    return __spreadArray([columns], mappedRows, true);
  };
  /** Maps stock symbols to Qualtrimm supported format */


  DataUtils.mapStockSymbolsRows = function (matrix, symbolIndex) {
    var columns = matrix[0],
        rows = matrix.slice(1);
    var mappedRows = rows.map(function (row) {
      var rawSymbol = row[symbolIndex];
      var symbol = stockMap.get(rawSymbol) || rawSymbol;
      row.splice(symbolIndex, 1, symbol);
      return row;
    });
    return __spreadArray([columns], mappedRows, true);
  };

  DataUtils.sortMatrixByColumn = function (matrix, columnIndex) {
    matrix.sort(function (a, b) {
      return a[columnIndex].localeCompare(b[columnIndex]);
    });
  };

  return DataUtils;
}();

exports.DataUtils = DataUtils;
},{}],"utils/page.utils.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageUtils = void 0;

var _data = require("./data.utils");

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __spreadArray = void 0 && (void 0).__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};

var PageUtils = function () {
  function PageUtils() {}

  PageUtils.getTableForTradesPage = function () {
    var dom = {
      SYMBOL: '[data-etoro-automation-id="portfolio-manual-trades-table-body-market-name"]',
      SHARES: '[data-etoro-automation-id="portfolio-overview-table-body-cell-units-value"]',
      INVESTED: '[data-etoro-automation-id="portfolio-manual-trades-table-body-invested-value"]',
      price: '[data-etoro-automation-id="portfolio-manual-trades-table-body-open-rate"]',
      root: '[data-etoro-automation-id="portfolio-manual-trades-table"]'
    };
    var rowData = PageUtils.getRowElements(dom.root).map(function (rowElement) {
      return [PageUtils.getContentForChild(rowElement, dom.SYMBOL), PageUtils.getContentForChild(rowElement, dom.price), PageUtils.getContentForChild(rowElement, dom.INVESTED)];
    }).map(function (_a) {
      var symbol = _a[0],
          price = _a[1],
          invested = _a[2];
      var shares = (parseFloat(invested) / parseFloat(price)).toFixed(4);
      return [symbol, parseFloat(shares), parseFloat(invested)];
    });
    var exportedData = confirm("Would you like to aggregate the data by symbol?") ? this.formatRowData(this.aggregateData(rowData)) : this.formatRowData(rowData);

    _data.DataUtils.sortMatrixByColumn(exportedData, 0);

    var columns = Object.keys(dom).slice(0, exportedData[0].length);
    return __spreadArray([columns], exportedData, true);
  };

  PageUtils.aggregateData = function (duplicateData) {
    var summedRowData = duplicateData.reduce(function (acc, _a) {
      var _b, _c;

      var symbol = _a[0],
          shares = _a[1],
          invested = _a[2];

      if (symbol in acc) {
        var _d = acc[symbol],
            accShares = _d[1],
            accInvested = _d[2];
        return __assign(__assign({}, acc), (_b = {}, _b[symbol] = [symbol, accShares + shares, accInvested + invested], _b));
      } else {
        return __assign(__assign({}, acc), (_c = {}, _c[symbol] = [symbol, shares, invested], _c));
      }
    }, {});
    return Object.values(summedRowData);
  };

  PageUtils.getTableForPortfolioPage = function () {
    var dom = {
      SYMBOL: '[data-etoro-automation-id="portfolio-overview-table-body-cell-market-name"]',
      SHARES: '[data-etoro-automation-id="portfolio-overview-table-body-cell-units-value"]',
      INVESTED: '[data-etoro-automation-id="portfolio-overview-table-body-cell-total-amount"]',
      MARKET_VALUE: '[data-etoro-automation-id="portfolio-overview-table-body-cell-equity"]',
      AVERAGE_PRICE: '[data-etoro-automation-id="portfolio-overview-table-body-cell-avg-open-rate"]',
      root: '[data-etoro-automation-id="portfolio-overview-table-body"]'
    };
    var rowData = PageUtils.getRowElements(dom.root).map(function (el) {
      return [PageUtils.getContentForChild(el, dom.SYMBOL), PageUtils.getContentForChild(el, dom.SHARES), PageUtils.getContentForChild(el, dom.INVESTED), PageUtils.getContentForChild(el, dom.MARKET_VALUE), PageUtils.getContentForChild(el, dom.AVERAGE_PRICE)];
    });

    _data.DataUtils.sortMatrixByColumn(rowData, 0);

    var columns = Object.keys(dom).slice(0, rowData[0].length);
    return __spreadArray([columns], rowData, true);
  };

  PageUtils.checkPage = function () {
    var isPortfolio = window.location.pathname.endsWith("portfolio");
    var isTrades = window.location.pathname.endsWith("manual-trades");
    return {
      isPortfolio: isPortfolio,
      isTrades: isTrades
    };
  };

  PageUtils.getDatasetAndFileNameForPage = function () {
    var _a = PageUtils.checkPage(),
        isPortfolio = _a.isPortfolio,
        isTrades = _a.isTrades;

    if (isPortfolio) {
      return [PageUtils.getTableForPortfolioPage(), "portfolio"];
    }

    if (isTrades) {
      return [PageUtils.getTableForTradesPage(), "trades"];
    }

    return [[[]], ""];
  };

  PageUtils.getContentForChild = function (parent, childSelector) {
    var _a, _b;

    var childElementText = (_b = (_a = parent.querySelector(childSelector)) === null || _a === void 0 ? void 0 : _a.textContent) !== null && _b !== void 0 ? _b : "";
    var cleanText = childElementText.trim().replace(/\$|,/gi, "");
    return cleanText;
  };
  /** Returns an array of row elements for given table */


  PageUtils.getRowElements = function (tableSelector) {
    var _a, _b;

    return Array.from((_b = (_a = document.querySelector(tableSelector)) === null || _a === void 0 ? void 0 : _a.querySelectorAll(".ui-table-row-container")) !== null && _b !== void 0 ? _b : []);
  };

  PageUtils.formatRowData = function (rawRowData) {
    return rawRowData.map(function (_a) {
      var symbol = _a[0],
          shares = _a[1],
          price = _a[2];
      return [symbol, shares.toFixed(4), price.toFixed(2)];
    });
  };

  return PageUtils;
}();

exports.PageUtils = PageUtils;
},{"./data.utils":"utils/data.utils.ts"}],"utils/file.utils.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileUtils = void 0;

var FileUtils = function () {
  function FileUtils() {}
  /** Adds a date-time suffix to given string */


  FileUtils.addSuffix = function (word) {
    var dateSuffix = new Date().toISOString().substr(0, 19).replace(/:/g, ".");
    return word + "_" + dateSuffix;
  };
  /** Downloads given matrix to a file */


  FileUtils.downloadMatrixAsCsv = function (matrix, fileName) {
    var csvString = matrix.map(function (e) {
      return e.join(",");
    }).join("\n");
    var link = document.createElement("a");
    link.setAttribute("href", encodeURI("data:text/csv;charset=utf-8," + csvString));
    link.setAttribute("download", FileUtils.addSuffix(fileName) + ".csv");
    document.body.appendChild(link);
    link.click();
    setTimeout(link.remove, 300);
  };

  return FileUtils;
}();

exports.FileUtils = FileUtils;
},{}],"content-script.ts":[function(require,module,exports) {
"use strict";

var _data = require("./utils/data.utils");

var _page = require("./utils/page.utils");

var _file = require("./utils/file.utils");

var ExportAction;

(function (ExportAction) {
  ExportAction["ExportAll"] = "export-all";
  ExportAction["ExportStocks"] = "export-stocks";
  ExportAction["ExportCrypto"] = "export-crypto";
})(ExportAction || (ExportAction = {}));

chrome.runtime.onMessage.addListener(function (message) {
  var _a;

  var actionMap = (_a = {}, _a[ExportAction.ExportAll] = function () {
    var _a = _page.PageUtils.getDatasetAndFileNameForPage(),
        dataset = _a[0],
        fileName = _a[1];

    var exported = _data.DataUtils.mapCryptoSymbolsRows(dataset, 0);

    console.log(message.action, exported);

    _file.FileUtils.downloadMatrixAsCsv(exported, fileName + "-all");
  }, _a[ExportAction.ExportStocks] = function () {
    var _a = _page.PageUtils.getDatasetAndFileNameForPage(),
        dataset = _a[0],
        fileName = _a[1];

    var stocksDataset = _data.DataUtils.excludeCryptoRows(dataset, 0);

    var exported = _data.DataUtils.mapStockSymbolsRows(stocksDataset, 0);

    console.log(message.action, exported);

    _file.FileUtils.downloadMatrixAsCsv(exported, fileName + "-stocks");
  }, _a[ExportAction.ExportCrypto] = function () {
    var _a = _page.PageUtils.getDatasetAndFileNameForPage(),
        dataset = _a[0],
        fileName = _a[1];

    var exported = _data.DataUtils.keepOnlyCryptoRows(dataset, 0);

    var mapped = _data.DataUtils.mapCryptoSymbolsRows(exported, 0);

    console.log(message.action, mapped);

    _file.FileUtils.downloadMatrixAsCsv(mapped, fileName + "-crypto");
  }, _a);
  actionMap[message.action]();
});
},{"./utils/data.utils":"utils/data.utils.ts","./utils/page.utils":"utils/page.utils.ts","./utils/file.utils":"utils/file.utils.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "35541" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","content-script.ts"], null)
//# sourceMappingURL=/content-script.js.map
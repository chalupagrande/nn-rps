/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "61b87349dbe6707ecdb1"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "../helpers.js":
/***/ (function(module, exports) {

const key = {
  'rock': [1, 0, 0],
  'paper': [0, 1, 0],
  'scissors': [0, 0, 1],
  '[1,0,0]': 'rock',
  '[0,1,0]': 'paper',
  '[0,0,1]': 'scissors'
};

function convertRPStoArray(entry) {
  return key[entry];
}

function convertRPSGametoArray(game) {
  let key = {
    'rock': [1, 0, 0],
    'paper': [0, 1, 0],
    'scissors': [0, 0, 1]
  };
  return game.map(e => key[e]);
}

function getResults(cb) {
  EntryModel.find({}).then(res => cb(res)).catch(err => console.log(err));
}

function combineGames(entries) {
  let result = [];
  entries.forEach(entry => {
    result = result.concat(entry.game);
  });
  return result;
}

function analyzeResults(games) {
  const results = {
    wins: 0,
    losses: 0,
    ties: 0,
    total: games.length,
    rock: 0,
    paper: 0,
    scissors: 0,
    rockWins: 0,
    paperWins: 0,
    scissorsWins: 0,
    longestStreak: 0
  };
  let currentStreak = 0;

  games.forEach(entry => {
    let c1 = key[JSON.stringify(entry[0])];
    let c2 = key[JSON.stringify(entry[1])];

    results[c1] += 1;
    let gameResult = determineWinner(c1, c2);
    if (gameResult > 0) {
      results.wins += 1;
      results[`${c1}Wins`] += 1;
      currentStreak += 1;
    } else if (gameResult == 0) {
      results.ties += 1;
      checkStreak();
    } else {
      results.losses += 1;
      checkStreak();
    }
  });

  function checkStreak() {
    if (currentStreak > results.longestStreak) results.longestStreak = currentStreak;
    currentStreak = 0;
  }

  return results;
}

function determineWinner(c1, c2) {
  if (c1 == 'rock') {
    if (c2 == 'rock') return 0;
    if (c2 == 'scissors') return 1;
    if (c2 == 'paper') return -1;
  } else if (c1 == 'paper') {
    if (c2 == 'paper') return 0;else if (c2 == 'rock') return 1;else if (c2 == 'scissors') return -1;
  } else if (c1 == 'scissors') {
    if (c2 == 'scissors') return 0;else if (c2 == 'paper') return 1;else if (c2 == 'rock') return -1;
  }
}
function determinePrediction(predictionArray) {
  let max = predictionArray.reduce((a, b) => Math.max(a, b), 0);
  return predictionArray.map(e => e == max ? 1 : 0);
}

function chooseOnPrediction(prediction) {
  if (prediction[0]) return 'paper';else if (prediction[1]) return 'scissors';else if (prediction[2]) return 'rock';
}

function makeVote(predictionArray) {
  let p = determinePrediction(predictionArray);
  return chooseOnPrediction(p);
}

// Choose random play. Rock, Paper, or Scissors
function chooseRandom() {
  const choices = ['rock', 'paper', 'scissors'];
  return choices[Math.floor(Math.random() * 3)];
}

function p(n, t) {
  return Math.round(n / t * 1000 / 10) + '%';
}

module.exports = {
  combineGames,
  determineWinner,
  chooseRandom,
  p,
  key,
  convertRPSGametoArray,
  convertRPStoArray,
  makeVote
};

/***/ }),

/***/ "./scripts/app.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers__ = __webpack_require__("../helpers.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__helpers__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__connections__ = __webpack_require__("./scripts/connections.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__connections___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__connections__);



let slackURI = "https://hooks.slack.com/services/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";
let lastMoves = [];

const stats = {
  win: 0,
  tie: 0,
  loss: 0,
  total: 0
};
let counting = false;
// ^^^^ prevents multiple votes during countdown

// Event Listeners
const buttons = document.querySelectorAll('button');
buttons.forEach(b => b.addEventListener('click', e => {
  e.preventDefault();
  let val = e.target.value;
  if (!counting) handleVote(val);
}));

window.addEventListener('keydown', e => {
  const key = { 37: 'rock', 82: 'rock',
    80: 'paper', 40: 'paper',
    83: 'scissors', 39: 'scissors' };
  const vote = key[e.keyCode];
  if (vote && !counting) handleVote(vote);
});

// Runner Functions
function handleVote(hv) {
  let hvEncoded = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["convertRPStoArray"])(hv);
  if (!counting) {
    let cv, cvEncoded;
    console.log(lastMoves);
    if (lastMoves.length < 3 * 2 * 3 + 1) {
      console.log('choosing randomly');
      //choose randomly at first.
      cv = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["chooseRandom"])();
      cvEncoded = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["convertRPStoArray"])(cv);
      lastMoves.push(...hvEncoded, ...cvEncoded);
      run(hv, cv);
    } else {
      console.log('predicting');
      //get annettes predicitions
      Object(__WEBPACK_IMPORTED_MODULE_1__connections__["fetchAnnettesPrediction"])(lastMoves, p => {
        let cv = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["makeVote"])(p);
        cvEncoded = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["convertRPStoArray"])(cv);
        run(hv, cv);
        lastMoves.splice(0, 6);
        lastMoves.push(...hvEncoded, ...cvEncoded);
      });
    }

    function run(hv, cv) {
      let r = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["determineWinner"])(hv, cv);
      updateStats(r);
      let sessionId = localStorage.getItem('nn-session-id') * 1;
      Object(__WEBPACK_IMPORTED_MODULE_1__connections__["sendResults"])(hv, cv, sessionId, stats);
      countDown(hv, cv, r);
    }
  }
}

function countDown(humanVote, compVote, result) {
  counting = true;
  let count = 3;
  updateWinLossColors(0);
  const id = setInterval(run, 700);
  run();
  function run() {
    if (count == 0) {
      window.clearInterval(id);
      finishScreen(humanVote, compVote, result);
      counting = false;
    } else {
      document.querySelector('.choice.human').innerText = count;
      document.querySelector('.choice.computer').innerText = count;
    }
    count -= 1;
  }
}

function finishScreen(humanVote, compVote, result) {
  updateStatsScreen(result);
  updateMoves(humanVote, compVote, result);
}

function updateStats(result) {
  if (result >= 1) stats.win += 1;else if (result == 0) stats.tie += 1;else stats.loss += 1;
  stats.total += 1;
}

function updateStatsScreen() {
  document.querySelector('.stat--number.win').innerText = stats.win;
  document.querySelector('.stat--number.tie').innerText = stats.tie;
  document.querySelector('.stat--number.loss').innerText = stats.loss;

  document.querySelector('.stat--percentage.win').innerText = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["p"])(stats.win, stats.total);
  document.querySelector('.stat--percentage.tie').innerText = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["p"])(stats.tie, stats.total);
  document.querySelector('.stat--percentage.loss').innerText = Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["p"])(stats.loss, stats.total);
}

// Change the Colors of the Play depending on WIN or LOSS
function updateWinLossColors(r) {
  let hv = document.querySelector('.choice.human');
  let cv = document.querySelector('.choice.computer');
  if (r >= 1) {
    hv.classList.remove('loss');
    hv.classList.add('win');
    cv.classList.remove('win');
    cv.classList.add('loss');
  } else if (r == 0) {
    hv.classList.remove('loss');
    hv.classList.remove('win');
    cv.classList.remove('win');
    cv.classList.remove('loss');
  } else {
    hv.classList.remove('win');
    hv.classList.add('loss');
    cv.classList.remove('loss');
    cv.classList.add('win');
  }
}

// Update Previous Moves List
function updateMoves(h, c, r) {
  h = h.toUpperCase();
  c = c.toUpperCase();
  updateWinLossColors(r);
  document.querySelector('.choice.human').innerText = h;
  document.querySelector('.choice.computer').innerText = c;

  let hc = document.createElement('li');
  hc.innerText = h;
  let cc = document.createElement('li');
  cc.innerText = c;

  let hl = document.querySelector('.move-list.human');
  let cl = document.querySelector('.move-list.computer');

  //cap the moves list to 10
  if (hl.childElementCount >= 10) {
    hl.children[9].remove();
    cl.children[9].remove();
  }
  hl.prepend(hc);
  cl.prepend(cc);
}

function handleServerError(err) {
  alert('There was a problem connecting to the server. Your results wont be recorded.');
  console.log(err);
}

Object(__WEBPACK_IMPORTED_MODULE_1__connections__["fetchSessionId"])();
// trainNet()

/***/ }),

/***/ "./scripts/connections.js":
/***/ (function(module, exports) {

const endpoint = '';

function sendResults(hv, cv, sessionId, stats) {
  let payload = JSON.stringify({
    game: [hv, cv],
    sessionId,
    stats
  });
  let myInit = {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: payload,
    mode: 'cors',
    cache: 'default'
  };

  fetch(endpoint + '/api/entry', myInit).then(res => {
    return res.json();
  }).then(json => {
    console.log(json);
    if (!json.success) handleServerError(json.msg);
  }).catch(err => handleServerError(err));
}

function fetchSessionId() {
  let myInit = {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    cache: 'default'
  };
  fetch(endpoint + '/api/session', myInit).then(r => r.json()).then(r => {
    localStorage.setItem('nn-session-id', r.sessionId);
    slackURI = r.slackURI;
    console.log("SessionId: " + r.sessionId);
  });
}
function fetchAnnettesPrediction(payload, cb) {
  payload = JSON.stringify(payload);
  let myInit = {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: payload,
    mode: 'cors',
    cache: 'default'
  };
  fetch(endpoint + '/api/net/annette', myInit).then(r => r.json()).then(r => {
    console.log('PREDICTION: ', r);
    cb(r.msg);
  }).catch(err => console.log(err));
}

function trainNet() {
  let myInit = {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    cache: 'default'
  };
  fetch(endpoint + '/api/net/train', myInit).then(r => r.json()).then(r => {
    console.log(r);
  });
}

module.exports = {
  sendResults,
  fetchSessionId,
  trainNet,
  fetchAnnettesPrediction
};

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./scripts/app.js");


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNjFiODczNDlkYmU2NzA3ZWNkYjEiLCJ3ZWJwYWNrOi8vLy4uL2hlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9hcHAuanMiLCJ3ZWJwYWNrOi8vLy4vc2NyaXB0cy9jb25uZWN0aW9ucy5qcyJdLCJuYW1lcyI6WyJrZXkiLCJjb252ZXJ0UlBTdG9BcnJheSIsImVudHJ5IiwiY29udmVydFJQU0dhbWV0b0FycmF5IiwiZ2FtZSIsIm1hcCIsImUiLCJnZXRSZXN1bHRzIiwiY2IiLCJFbnRyeU1vZGVsIiwiZmluZCIsInRoZW4iLCJyZXMiLCJjYXRjaCIsImVyciIsImNvbnNvbGUiLCJsb2ciLCJjb21iaW5lR2FtZXMiLCJlbnRyaWVzIiwicmVzdWx0IiwiZm9yRWFjaCIsImNvbmNhdCIsImFuYWx5emVSZXN1bHRzIiwiZ2FtZXMiLCJyZXN1bHRzIiwid2lucyIsImxvc3NlcyIsInRpZXMiLCJ0b3RhbCIsImxlbmd0aCIsInJvY2siLCJwYXBlciIsInNjaXNzb3JzIiwicm9ja1dpbnMiLCJwYXBlcldpbnMiLCJzY2lzc29yc1dpbnMiLCJsb25nZXN0U3RyZWFrIiwiY3VycmVudFN0cmVhayIsImMxIiwiSlNPTiIsInN0cmluZ2lmeSIsImMyIiwiZ2FtZVJlc3VsdCIsImRldGVybWluZVdpbm5lciIsImNoZWNrU3RyZWFrIiwiZGV0ZXJtaW5lUHJlZGljdGlvbiIsInByZWRpY3Rpb25BcnJheSIsIm1heCIsInJlZHVjZSIsImEiLCJiIiwiTWF0aCIsImNob29zZU9uUHJlZGljdGlvbiIsInByZWRpY3Rpb24iLCJtYWtlVm90ZSIsInAiLCJjaG9vc2VSYW5kb20iLCJjaG9pY2VzIiwiZmxvb3IiLCJyYW5kb20iLCJuIiwidCIsInJvdW5kIiwibW9kdWxlIiwiZXhwb3J0cyIsInNsYWNrVVJJIiwibGFzdE1vdmVzIiwic3RhdHMiLCJ3aW4iLCJ0aWUiLCJsb3NzIiwiY291bnRpbmciLCJidXR0b25zIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwiYWRkRXZlbnRMaXN0ZW5lciIsInByZXZlbnREZWZhdWx0IiwidmFsIiwidGFyZ2V0IiwidmFsdWUiLCJoYW5kbGVWb3RlIiwid2luZG93Iiwidm90ZSIsImtleUNvZGUiLCJodiIsImh2RW5jb2RlZCIsImN2IiwiY3ZFbmNvZGVkIiwicHVzaCIsInJ1biIsImZldGNoQW5uZXR0ZXNQcmVkaWN0aW9uIiwic3BsaWNlIiwiciIsInVwZGF0ZVN0YXRzIiwic2Vzc2lvbklkIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInNlbmRSZXN1bHRzIiwiY291bnREb3duIiwiaHVtYW5Wb3RlIiwiY29tcFZvdGUiLCJjb3VudCIsInVwZGF0ZVdpbkxvc3NDb2xvcnMiLCJpZCIsInNldEludGVydmFsIiwiY2xlYXJJbnRlcnZhbCIsImZpbmlzaFNjcmVlbiIsInF1ZXJ5U2VsZWN0b3IiLCJpbm5lclRleHQiLCJ1cGRhdGVTdGF0c1NjcmVlbiIsInVwZGF0ZU1vdmVzIiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiYWRkIiwiaCIsImMiLCJ0b1VwcGVyQ2FzZSIsImhjIiwiY3JlYXRlRWxlbWVudCIsImNjIiwiaGwiLCJjbCIsImNoaWxkRWxlbWVudENvdW50IiwiY2hpbGRyZW4iLCJwcmVwZW5kIiwiaGFuZGxlU2VydmVyRXJyb3IiLCJhbGVydCIsImZldGNoU2Vzc2lvbklkIiwiZW5kcG9pbnQiLCJwYXlsb2FkIiwibXlJbml0IiwibWV0aG9kIiwiaGVhZGVycyIsImJvZHkiLCJtb2RlIiwiY2FjaGUiLCJmZXRjaCIsImpzb24iLCJzdWNjZXNzIiwibXNnIiwic2V0SXRlbSIsInRyYWluTmV0Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1FQUEyRDtBQUMzRDtBQUNBO0FBQ0EsV0FBRzs7QUFFSCxvREFBNEM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx3REFBZ0Q7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7Ozs7QUFJQTtBQUNBLHNEQUE4QztBQUM5QztBQUNBO0FBQ0Esb0NBQTRCO0FBQzVCLHFDQUE2QjtBQUM3Qix5Q0FBaUM7O0FBRWpDLCtDQUF1QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4Q0FBc0M7QUFDdEM7QUFDQTtBQUNBLHFDQUE2QjtBQUM3QixxQ0FBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUFvQixnQkFBZ0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQW9CLGdCQUFnQjtBQUNwQztBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsYUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUJBQWlCLDhCQUE4QjtBQUMvQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7O0FBRUEsNERBQW9EO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUFtQiwyQkFBMkI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQWtCLGNBQWM7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQWEsNEJBQTRCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLHNCQUFjLDRCQUE0QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHNCQUFjLDRCQUE0QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBZ0IsdUNBQXVDO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBZ0IsdUNBQXVDO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQWdCLHNCQUFzQjtBQUN0QztBQUNBO0FBQ0E7QUFDQSxnQkFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBYSx3Q0FBd0M7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxlQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQSw4Q0FBc0MsdUJBQXVCOztBQUU3RDtBQUNBOzs7Ozs7OztBQ250QkEsTUFBTUEsTUFBTTtBQUNWLFVBQVEsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FERTtBQUVWLFdBQVMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FGQztBQUdWLGNBQVksQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FIRjtBQUlWLGFBQVcsTUFKRDtBQUtWLGFBQVcsT0FMRDtBQU1WLGFBQVc7QUFORCxDQUFaOztBQVNBLFNBQVNDLGlCQUFULENBQTJCQyxLQUEzQixFQUFpQztBQUMvQixTQUFPRixJQUFJRSxLQUFKLENBQVA7QUFDRDs7QUFFRCxTQUFTQyxxQkFBVCxDQUErQkMsSUFBL0IsRUFBb0M7QUFDbEMsTUFBSUosTUFBTTtBQUNSLFlBQVEsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FEQTtBQUVSLGFBQVMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FGRDtBQUdSLGdCQUFZLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMO0FBSEosR0FBVjtBQUtBLFNBQU9JLEtBQUtDLEdBQUwsQ0FBU0MsS0FBS04sSUFBSU0sQ0FBSixDQUFkLENBQVA7QUFDRDs7QUFFRCxTQUFTQyxVQUFULENBQW9CQyxFQUFwQixFQUF1QjtBQUNyQkMsYUFBV0MsSUFBWCxDQUFnQixFQUFoQixFQUNDQyxJQURELENBQ01DLE9BQU9KLEdBQUdJLEdBQUgsQ0FEYixFQUVDQyxLQUZELENBRU9DLE9BQU1DLFFBQVFDLEdBQVIsQ0FBWUYsR0FBWixDQUZiO0FBR0Q7O0FBRUQsU0FBU0csWUFBVCxDQUFzQkMsT0FBdEIsRUFBOEI7QUFDNUIsTUFBSUMsU0FBUyxFQUFiO0FBQ0FELFVBQVFFLE9BQVIsQ0FBaUJsQixLQUFELElBQVM7QUFDdkJpQixhQUFTQSxPQUFPRSxNQUFQLENBQWNuQixNQUFNRSxJQUFwQixDQUFUO0FBQ0QsR0FGRDtBQUdBLFNBQU9lLE1BQVA7QUFDRDs7QUFFRCxTQUFTRyxjQUFULENBQXdCQyxLQUF4QixFQUE4QjtBQUM1QixRQUFNQyxVQUFVO0FBQ2RDLFVBQU0sQ0FEUTtBQUVkQyxZQUFRLENBRk07QUFHZEMsVUFBSyxDQUhTO0FBSWRDLFdBQU9MLE1BQU1NLE1BSkM7QUFLZEMsVUFBTSxDQUxRO0FBTWRDLFdBQU8sQ0FOTztBQU9kQyxjQUFVLENBUEk7QUFRZEMsY0FBVSxDQVJJO0FBU2RDLGVBQVcsQ0FURztBQVVkQyxrQkFBYyxDQVZBO0FBV2RDLG1CQUFlO0FBWEQsR0FBaEI7QUFhQSxNQUFJQyxnQkFBZ0IsQ0FBcEI7O0FBRUFkLFFBQU1ILE9BQU4sQ0FBY2xCLFNBQVE7QUFDcEIsUUFBSW9DLEtBQUt0QyxJQUFJdUMsS0FBS0MsU0FBTCxDQUFldEMsTUFBTSxDQUFOLENBQWYsQ0FBSixDQUFUO0FBQ0EsUUFBSXVDLEtBQUt6QyxJQUFJdUMsS0FBS0MsU0FBTCxDQUFldEMsTUFBTSxDQUFOLENBQWYsQ0FBSixDQUFUOztBQUVBc0IsWUFBUWMsRUFBUixLQUFlLENBQWY7QUFDQSxRQUFJSSxhQUFhQyxnQkFBZ0JMLEVBQWhCLEVBQW1CRyxFQUFuQixDQUFqQjtBQUNBLFFBQUdDLGFBQWEsQ0FBaEIsRUFBa0I7QUFDaEJsQixjQUFRQyxJQUFSLElBQWUsQ0FBZjtBQUNBRCxjQUFTLEdBQUVjLEVBQUcsTUFBZCxLQUF3QixDQUF4QjtBQUNBRCx1QkFBZ0IsQ0FBaEI7QUFDRCxLQUpELE1BSU8sSUFBR0ssY0FBYyxDQUFqQixFQUFtQjtBQUN4QmxCLGNBQVFHLElBQVIsSUFBZSxDQUFmO0FBQ0FpQjtBQUNELEtBSE0sTUFHQTtBQUNMcEIsY0FBUUUsTUFBUixJQUFpQixDQUFqQjtBQUNBa0I7QUFDRDtBQUNGLEdBakJEOztBQW1CQSxXQUFTQSxXQUFULEdBQXNCO0FBQ3BCLFFBQUdQLGdCQUFnQmIsUUFBUVksYUFBM0IsRUFBMENaLFFBQVFZLGFBQVIsR0FBd0JDLGFBQXhCO0FBQzFDQSxvQkFBZ0IsQ0FBaEI7QUFDRDs7QUFFRCxTQUFPYixPQUFQO0FBQ0Q7O0FBRUQsU0FBU21CLGVBQVQsQ0FBeUJMLEVBQXpCLEVBQTZCRyxFQUE3QixFQUFnQztBQUM5QixNQUFHSCxNQUFNLE1BQVQsRUFBZ0I7QUFDZCxRQUFHRyxNQUFNLE1BQVQsRUFBaUIsT0FBTyxDQUFQO0FBQ2pCLFFBQUdBLE1BQU0sVUFBVCxFQUFxQixPQUFPLENBQVA7QUFDckIsUUFBR0EsTUFBTSxPQUFULEVBQWtCLE9BQU8sQ0FBQyxDQUFSO0FBQ25CLEdBSkQsTUFLSyxJQUFHSCxNQUFNLE9BQVQsRUFBaUI7QUFDcEIsUUFBR0csTUFBTSxPQUFULEVBQWtCLE9BQU8sQ0FBUCxDQUFsQixLQUNLLElBQUdBLE1BQU0sTUFBVCxFQUFpQixPQUFPLENBQVAsQ0FBakIsS0FDQSxJQUFHQSxNQUFNLFVBQVQsRUFBcUIsT0FBTyxDQUFDLENBQVI7QUFDM0IsR0FKSSxNQUtBLElBQUdILE1BQU0sVUFBVCxFQUFvQjtBQUN2QixRQUFHRyxNQUFNLFVBQVQsRUFBcUIsT0FBTyxDQUFQLENBQXJCLEtBQ0ssSUFBR0EsTUFBTSxPQUFULEVBQWtCLE9BQU8sQ0FBUCxDQUFsQixLQUNBLElBQUdBLE1BQU0sTUFBVCxFQUFpQixPQUFPLENBQUMsQ0FBUjtBQUN2QjtBQUNGO0FBQ0QsU0FBU0ksbUJBQVQsQ0FBNkJDLGVBQTdCLEVBQTZDO0FBQzNDLE1BQUlDLE1BQU1ELGdCQUFnQkUsTUFBaEIsQ0FBdUIsQ0FBQ0MsQ0FBRCxFQUFHQyxDQUFILEtBQU9DLEtBQUtKLEdBQUwsQ0FBU0UsQ0FBVCxFQUFXQyxDQUFYLENBQTlCLEVBQTZDLENBQTdDLENBQVY7QUFDQSxTQUFPSixnQkFBZ0J6QyxHQUFoQixDQUFvQkMsS0FBS0EsS0FBS3lDLEdBQUwsR0FBVyxDQUFYLEdBQWUsQ0FBeEMsQ0FBUDtBQUNEOztBQUVELFNBQVNLLGtCQUFULENBQTRCQyxVQUE1QixFQUF1QztBQUNyQyxNQUFHQSxXQUFXLENBQVgsQ0FBSCxFQUFrQixPQUFPLE9BQVAsQ0FBbEIsS0FDSyxJQUFHQSxXQUFXLENBQVgsQ0FBSCxFQUFrQixPQUFPLFVBQVAsQ0FBbEIsS0FDQSxJQUFHQSxXQUFXLENBQVgsQ0FBSCxFQUFrQixPQUFPLE1BQVA7QUFDeEI7O0FBRUQsU0FBU0MsUUFBVCxDQUFrQlIsZUFBbEIsRUFBa0M7QUFDaEMsTUFBSVMsSUFBSVYsb0JBQW9CQyxlQUFwQixDQUFSO0FBQ0EsU0FBT00sbUJBQW1CRyxDQUFuQixDQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxTQUFTQyxZQUFULEdBQXVCO0FBQ3JCLFFBQU1DLFVBQVUsQ0FBQyxNQUFELEVBQVMsT0FBVCxFQUFrQixVQUFsQixDQUFoQjtBQUNBLFNBQU9BLFFBQVFOLEtBQUtPLEtBQUwsQ0FBV1AsS0FBS1EsTUFBTCxLQUFjLENBQXpCLENBQVIsQ0FBUDtBQUNEOztBQUVELFNBQVNKLENBQVQsQ0FBV0ssQ0FBWCxFQUFhQyxDQUFiLEVBQWU7QUFDYixTQUFPVixLQUFLVyxLQUFMLENBQWFGLElBQUVDLENBQUgsR0FBTSxJQUFQLEdBQWEsRUFBeEIsSUFBOEIsR0FBckM7QUFDRDs7QUFHREUsT0FBT0MsT0FBUCxHQUFpQjtBQUNmL0MsY0FEZTtBQUVmMEIsaUJBRmU7QUFHZmEsY0FIZTtBQUlmRCxHQUplO0FBS2Z2RCxLQUxlO0FBTWZHLHVCQU5lO0FBT2ZGLG1CQVBlO0FBUWZxRDtBQVJlLENBQWpCLEM7Ozs7Ozs7Ozs7Ozs7QUMzSEE7QUFLQTs7QUFLQSxJQUFJVyxXQUFXLCtFQUFmO0FBQ0EsSUFBSUMsWUFBWSxFQUFoQjs7QUFFQSxNQUFNQyxRQUFRO0FBQ1pDLE9BQUssQ0FETztBQUVaQyxPQUFLLENBRk87QUFHWkMsUUFBTSxDQUhNO0FBSVoxQyxTQUFPO0FBSkssQ0FBZDtBQU1BLElBQUkyQyxXQUFXLEtBQWY7QUFDQTs7QUFFQTtBQUNBLE1BQU1DLFVBQVVDLFNBQVNDLGdCQUFULENBQTBCLFFBQTFCLENBQWhCO0FBQ0FGLFFBQVFwRCxPQUFSLENBQWdCOEIsS0FBR0EsRUFBRXlCLGdCQUFGLENBQW1CLE9BQW5CLEVBQTZCckUsQ0FBRCxJQUFLO0FBQ2xEQSxJQUFFc0UsY0FBRjtBQUNBLE1BQUlDLE1BQU12RSxFQUFFd0UsTUFBRixDQUFTQyxLQUFuQjtBQUNBLE1BQUcsQ0FBQ1IsUUFBSixFQUFjUyxXQUFXSCxHQUFYO0FBQ2YsQ0FKa0IsQ0FBbkI7O0FBTUFJLE9BQU9OLGdCQUFQLENBQXdCLFNBQXhCLEVBQW1DckUsS0FBRztBQUNwQyxRQUFNTixNQUFNLEVBQUMsSUFBSSxNQUFMLEVBQVksSUFBRyxNQUFmO0FBQ0YsUUFBSSxPQURGLEVBQ1csSUFBSSxPQURmO0FBRUYsUUFBSSxVQUZGLEVBRWMsSUFBSSxVQUZsQixFQUFaO0FBR0EsUUFBTWtGLE9BQU9sRixJQUFJTSxFQUFFNkUsT0FBTixDQUFiO0FBQ0EsTUFBR0QsUUFBUSxDQUFDWCxRQUFaLEVBQXNCUyxXQUFXRSxJQUFYO0FBQ3ZCLENBTkQ7O0FBUUE7QUFDQSxTQUFTRixVQUFULENBQW9CSSxFQUFwQixFQUF1QjtBQUNyQixNQUFJQyxZQUFZLG1FQUFBcEYsQ0FBa0JtRixFQUFsQixDQUFoQjtBQUNBLE1BQUcsQ0FBQ2IsUUFBSixFQUFhO0FBQ1gsUUFBSWUsRUFBSixFQUFRQyxTQUFSO0FBQ0F4RSxZQUFRQyxHQUFSLENBQVlrRCxTQUFaO0FBQ0EsUUFBR0EsVUFBVXJDLE1BQVYsR0FBbUIsSUFBRSxDQUFGLEdBQUksQ0FBSixHQUFRLENBQTlCLEVBQWdDO0FBQzlCZCxjQUFRQyxHQUFSLENBQVksbUJBQVo7QUFDQTtBQUNBc0UsV0FBSyw4REFBQTlCLEVBQUw7QUFDQStCLGtCQUFZLG1FQUFBdEYsQ0FBa0JxRixFQUFsQixDQUFaO0FBQ0FwQixnQkFBVXNCLElBQVYsQ0FBZSxHQUFHSCxTQUFsQixFQUE2QixHQUFHRSxTQUFoQztBQUNBRSxVQUFJTCxFQUFKLEVBQU9FLEVBQVA7QUFDRCxLQVBELE1BT087QUFDTHZFLGNBQVFDLEdBQVIsQ0FBWSxZQUFaO0FBQ0E7QUFDQTBFLE1BQUEsNkVBQUFBLENBQXdCeEIsU0FBeEIsRUFBbUNYLENBQUQsSUFBSztBQUNyQyxZQUFJK0IsS0FBSywwREFBQWhDLENBQVNDLENBQVQsQ0FBVDtBQUNBZ0Msb0JBQVksbUVBQUF0RixDQUFrQnFGLEVBQWxCLENBQVo7QUFDQUcsWUFBSUwsRUFBSixFQUFPRSxFQUFQO0FBQ0FwQixrQkFBVXlCLE1BQVYsQ0FBaUIsQ0FBakIsRUFBbUIsQ0FBbkI7QUFDQXpCLGtCQUFVc0IsSUFBVixDQUFlLEdBQUdILFNBQWxCLEVBQTZCLEdBQUdFLFNBQWhDO0FBQ0QsT0FORDtBQVFEOztBQUVELGFBQVNFLEdBQVQsQ0FBYUwsRUFBYixFQUFnQkUsRUFBaEIsRUFBbUI7QUFDakIsVUFBSU0sSUFBSSxpRUFBQWpELENBQWdCeUMsRUFBaEIsRUFBb0JFLEVBQXBCLENBQVI7QUFDQU8sa0JBQVlELENBQVo7QUFDQSxVQUFJRSxZQUFZQyxhQUFhQyxPQUFiLENBQXFCLGVBQXJCLElBQXNDLENBQXREO0FBQ0FDLE1BQUEsaUVBQUFBLENBQVliLEVBQVosRUFBZ0JFLEVBQWhCLEVBQW9CUSxTQUFwQixFQUErQjNCLEtBQS9CO0FBQ0ErQixnQkFBVWQsRUFBVixFQUFjRSxFQUFkLEVBQWtCTSxDQUFsQjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxTQUFTTSxTQUFULENBQW1CQyxTQUFuQixFQUE4QkMsUUFBOUIsRUFBd0NqRixNQUF4QyxFQUErQztBQUM3Q29ELGFBQVcsSUFBWDtBQUNBLE1BQUk4QixRQUFRLENBQVo7QUFDQUMsc0JBQW9CLENBQXBCO0FBQ0EsUUFBTUMsS0FBS0MsWUFBWWYsR0FBWixFQUFpQixHQUFqQixDQUFYO0FBQ0FBO0FBQ0EsV0FBU0EsR0FBVCxHQUFjO0FBQ1osUUFBR1ksU0FBUyxDQUFaLEVBQWM7QUFDWnBCLGFBQU93QixhQUFQLENBQXFCRixFQUFyQjtBQUNBRyxtQkFBYVAsU0FBYixFQUF3QkMsUUFBeEIsRUFBa0NqRixNQUFsQztBQUNBb0QsaUJBQVcsS0FBWDtBQUNELEtBSkQsTUFJTztBQUNMRSxlQUFTa0MsYUFBVCxDQUF1QixlQUF2QixFQUF3Q0MsU0FBeEMsR0FBb0RQLEtBQXBEO0FBQ0E1QixlQUFTa0MsYUFBVCxDQUF1QixrQkFBdkIsRUFBMkNDLFNBQTNDLEdBQXVEUCxLQUF2RDtBQUNEO0FBQ0RBLGFBQVMsQ0FBVDtBQUNEO0FBQ0Y7O0FBRUQsU0FBU0ssWUFBVCxDQUFzQlAsU0FBdEIsRUFBaUNDLFFBQWpDLEVBQTJDakYsTUFBM0MsRUFBa0Q7QUFDaEQwRixvQkFBa0IxRixNQUFsQjtBQUNBMkYsY0FBWVgsU0FBWixFQUF1QkMsUUFBdkIsRUFBaUNqRixNQUFqQztBQUNEOztBQUVELFNBQVMwRSxXQUFULENBQXFCMUUsTUFBckIsRUFBNEI7QUFDMUIsTUFBR0EsVUFBVSxDQUFiLEVBQWdCZ0QsTUFBTUMsR0FBTixJQUFZLENBQVosQ0FBaEIsS0FDSyxJQUFHakQsVUFBVSxDQUFiLEVBQWdCZ0QsTUFBTUUsR0FBTixJQUFZLENBQVosQ0FBaEIsS0FDQUYsTUFBTUcsSUFBTixJQUFhLENBQWI7QUFDTEgsUUFBTXZDLEtBQU4sSUFBYyxDQUFkO0FBQ0Q7O0FBRUQsU0FBU2lGLGlCQUFULEdBQTRCO0FBQzFCcEMsV0FBU2tDLGFBQVQsQ0FBdUIsbUJBQXZCLEVBQTRDQyxTQUE1QyxHQUF3RHpDLE1BQU1DLEdBQTlEO0FBQ0FLLFdBQVNrQyxhQUFULENBQXVCLG1CQUF2QixFQUE0Q0MsU0FBNUMsR0FBd0R6QyxNQUFNRSxHQUE5RDtBQUNBSSxXQUFTa0MsYUFBVCxDQUF1QixvQkFBdkIsRUFBNkNDLFNBQTdDLEdBQXlEekMsTUFBTUcsSUFBL0Q7O0FBRUFHLFdBQVNrQyxhQUFULENBQXVCLHVCQUF2QixFQUFnREMsU0FBaEQsR0FBNEQsbURBQUFyRCxDQUFFWSxNQUFNQyxHQUFSLEVBQWFELE1BQU12QyxLQUFuQixDQUE1RDtBQUNBNkMsV0FBU2tDLGFBQVQsQ0FBdUIsdUJBQXZCLEVBQWdEQyxTQUFoRCxHQUE0RCxtREFBQXJELENBQUVZLE1BQU1FLEdBQVIsRUFBYUYsTUFBTXZDLEtBQW5CLENBQTVEO0FBQ0E2QyxXQUFTa0MsYUFBVCxDQUF1Qix3QkFBdkIsRUFBaURDLFNBQWpELEdBQTZELG1EQUFBckQsQ0FBRVksTUFBTUcsSUFBUixFQUFjSCxNQUFNdkMsS0FBcEIsQ0FBN0Q7QUFDRDs7QUFFRDtBQUNBLFNBQVMwRSxtQkFBVCxDQUE2QlYsQ0FBN0IsRUFBK0I7QUFDN0IsTUFBSVIsS0FBS1gsU0FBU2tDLGFBQVQsQ0FBdUIsZUFBdkIsQ0FBVDtBQUNBLE1BQUlyQixLQUFLYixTQUFTa0MsYUFBVCxDQUF1QixrQkFBdkIsQ0FBVDtBQUNBLE1BQUdmLEtBQUksQ0FBUCxFQUFTO0FBQ1BSLE9BQUcyQixTQUFILENBQWFDLE1BQWIsQ0FBb0IsTUFBcEI7QUFDQTVCLE9BQUcyQixTQUFILENBQWFFLEdBQWIsQ0FBaUIsS0FBakI7QUFDQTNCLE9BQUd5QixTQUFILENBQWFDLE1BQWIsQ0FBb0IsS0FBcEI7QUFDQTFCLE9BQUd5QixTQUFILENBQWFFLEdBQWIsQ0FBaUIsTUFBakI7QUFDRCxHQUxELE1BS08sSUFBR3JCLEtBQUksQ0FBUCxFQUFVO0FBQ2ZSLE9BQUcyQixTQUFILENBQWFDLE1BQWIsQ0FBb0IsTUFBcEI7QUFDQTVCLE9BQUcyQixTQUFILENBQWFDLE1BQWIsQ0FBb0IsS0FBcEI7QUFDQTFCLE9BQUd5QixTQUFILENBQWFDLE1BQWIsQ0FBb0IsS0FBcEI7QUFDQTFCLE9BQUd5QixTQUFILENBQWFDLE1BQWIsQ0FBb0IsTUFBcEI7QUFDRCxHQUxNLE1BS0E7QUFDTDVCLE9BQUcyQixTQUFILENBQWFDLE1BQWIsQ0FBb0IsS0FBcEI7QUFDQTVCLE9BQUcyQixTQUFILENBQWFFLEdBQWIsQ0FBaUIsTUFBakI7QUFDQTNCLE9BQUd5QixTQUFILENBQWFDLE1BQWIsQ0FBb0IsTUFBcEI7QUFDQTFCLE9BQUd5QixTQUFILENBQWFFLEdBQWIsQ0FBaUIsS0FBakI7QUFDRDtBQUNGOztBQUVEO0FBQ0EsU0FBU0gsV0FBVCxDQUFxQkksQ0FBckIsRUFBdUJDLENBQXZCLEVBQXlCdkIsQ0FBekIsRUFBMkI7QUFDekJzQixNQUFJQSxFQUFFRSxXQUFGLEVBQUo7QUFDQUQsTUFBSUEsRUFBRUMsV0FBRixFQUFKO0FBQ0FkLHNCQUFvQlYsQ0FBcEI7QUFDQW5CLFdBQVNrQyxhQUFULENBQXVCLGVBQXZCLEVBQXdDQyxTQUF4QyxHQUFvRE0sQ0FBcEQ7QUFDQXpDLFdBQVNrQyxhQUFULENBQXVCLGtCQUF2QixFQUEyQ0MsU0FBM0MsR0FBdURPLENBQXZEOztBQUVBLE1BQUlFLEtBQUs1QyxTQUFTNkMsYUFBVCxDQUF1QixJQUF2QixDQUFUO0FBQ0FELEtBQUdULFNBQUgsR0FBZU0sQ0FBZjtBQUNBLE1BQUlLLEtBQUs5QyxTQUFTNkMsYUFBVCxDQUF1QixJQUF2QixDQUFUO0FBQ0FDLEtBQUdYLFNBQUgsR0FBZU8sQ0FBZjs7QUFFQSxNQUFJSyxLQUFLL0MsU0FBU2tDLGFBQVQsQ0FBdUIsa0JBQXZCLENBQVQ7QUFDQSxNQUFJYyxLQUFLaEQsU0FBU2tDLGFBQVQsQ0FBdUIscUJBQXZCLENBQVQ7O0FBRUE7QUFDQSxNQUFHYSxHQUFHRSxpQkFBSCxJQUF3QixFQUEzQixFQUE4QjtBQUM1QkYsT0FBR0csUUFBSCxDQUFZLENBQVosRUFBZVgsTUFBZjtBQUNBUyxPQUFHRSxRQUFILENBQVksQ0FBWixFQUFlWCxNQUFmO0FBQ0Q7QUFDRFEsS0FBR0ksT0FBSCxDQUFXUCxFQUFYO0FBQ0FJLEtBQUdHLE9BQUgsQ0FBV0wsRUFBWDtBQUNEOztBQUdELFNBQVNNLGlCQUFULENBQTJCL0csR0FBM0IsRUFBK0I7QUFDN0JnSCxRQUFNLDhFQUFOO0FBQ0EvRyxVQUFRQyxHQUFSLENBQVlGLEdBQVo7QUFDRDs7QUFFRCxvRUFBQWlIO0FBQ0EsYTs7Ozs7OztBQ3pLQSxNQUFNQyxXQUFXLEVBQWpCOztBQUVBLFNBQVMvQixXQUFULENBQXFCYixFQUFyQixFQUF3QkUsRUFBeEIsRUFBNEJRLFNBQTVCLEVBQXVDM0IsS0FBdkMsRUFBNkM7QUFDM0MsTUFBSThELFVBQVUxRixLQUFLQyxTQUFMLENBQWU7QUFDM0JwQyxVQUFNLENBQUNnRixFQUFELEVBQUtFLEVBQUwsQ0FEcUI7QUFFM0JRLGFBRjJCO0FBRzNCM0I7QUFIMkIsR0FBZixDQUFkO0FBS0EsTUFBSStELFNBQVM7QUFDWEMsWUFBUSxNQURHO0FBRVhDLGFBQVM7QUFDSCxnQkFBVSxtQ0FEUDtBQUVILHNCQUFnQjtBQUZiLEtBRkU7QUFNWEMsVUFBTUosT0FOSztBQU9YSyxVQUFNLE1BUEs7QUFRWEMsV0FBTztBQVJJLEdBQWI7O0FBV0FDLFFBQU1SLFdBQVcsWUFBakIsRUFBK0JFLE1BQS9CLEVBQ0N2SCxJQURELENBQ09DLEdBQUQsSUFBTztBQUNYLFdBQU9BLElBQUk2SCxJQUFKLEVBQVA7QUFDRCxHQUhELEVBSUM5SCxJQUpELENBSU84SCxJQUFELElBQVE7QUFDWjFILFlBQVFDLEdBQVIsQ0FBWXlILElBQVo7QUFDQSxRQUFHLENBQUNBLEtBQUtDLE9BQVQsRUFBa0JiLGtCQUFrQlksS0FBS0UsR0FBdkI7QUFDbkIsR0FQRCxFQU9HOUgsS0FQSCxDQU9TQyxPQUFPK0csa0JBQWtCL0csR0FBbEIsQ0FQaEI7QUFRRDs7QUFFRCxTQUFTaUgsY0FBVCxHQUF5QjtBQUN2QixNQUFJRyxTQUFTO0FBQ1hDLFlBQVEsS0FERztBQUVYQyxhQUFTO0FBQ0gsZ0JBQVUsbUNBRFA7QUFFSCxzQkFBZ0I7QUFGYixLQUZFO0FBTVhFLFVBQU0sTUFOSztBQU9YQyxXQUFPO0FBUEksR0FBYjtBQVNBQyxRQUFNUixXQUFXLGNBQWpCLEVBQWlDRSxNQUFqQyxFQUNHdkgsSUFESCxDQUNRaUYsS0FBR0EsRUFBRTZDLElBQUYsRUFEWCxFQUVHOUgsSUFGSCxDQUVRaUYsS0FBRztBQUNQRyxpQkFBYTZDLE9BQWIsQ0FBcUIsZUFBckIsRUFBc0NoRCxFQUFFRSxTQUF4QztBQUNBN0IsZUFBVzJCLEVBQUUzQixRQUFiO0FBQ0FsRCxZQUFRQyxHQUFSLENBQVksZ0JBQWdCNEUsRUFBRUUsU0FBOUI7QUFDRCxHQU5IO0FBT0Q7QUFDRCxTQUFTSix1QkFBVCxDQUFpQ3VDLE9BQWpDLEVBQTBDekgsRUFBMUMsRUFBNkM7QUFDM0N5SCxZQUFVMUYsS0FBS0MsU0FBTCxDQUFleUYsT0FBZixDQUFWO0FBQ0EsTUFBSUMsU0FBUztBQUNYQyxZQUFRLE1BREc7QUFFWEMsYUFBUztBQUNILGdCQUFVLG1DQURQO0FBRUgsc0JBQWdCO0FBRmIsS0FGRTtBQU1YQyxVQUFNSixPQU5LO0FBT1hLLFVBQU0sTUFQSztBQVFYQyxXQUFPO0FBUkksR0FBYjtBQVVBQyxRQUFNUixXQUFXLGtCQUFqQixFQUFxQ0UsTUFBckMsRUFDR3ZILElBREgsQ0FDUWlGLEtBQUdBLEVBQUU2QyxJQUFGLEVBRFgsRUFFRzlILElBRkgsQ0FFUWlGLEtBQUc7QUFDUDdFLFlBQVFDLEdBQVIsQ0FBWSxjQUFaLEVBQTJCNEUsQ0FBM0I7QUFDQXBGLE9BQUdvRixFQUFFK0MsR0FBTDtBQUNELEdBTEgsRUFNRzlILEtBTkgsQ0FNU0MsT0FBT0MsUUFBUUMsR0FBUixDQUFZRixHQUFaLENBTmhCO0FBT0Q7O0FBRUQsU0FBUytILFFBQVQsR0FBbUI7QUFDakIsTUFBSVgsU0FBUztBQUNYQyxZQUFRLEtBREc7QUFFWEMsYUFBUztBQUNILGdCQUFVLG1DQURQO0FBRUgsc0JBQWdCO0FBRmIsS0FGRTtBQU1YRSxVQUFNLE1BTks7QUFPWEMsV0FBTztBQVBJLEdBQWI7QUFTQUMsUUFBTVIsV0FBVyxnQkFBakIsRUFBbUNFLE1BQW5DLEVBQ0d2SCxJQURILENBQ1FpRixLQUFHQSxFQUFFNkMsSUFBRixFQURYLEVBRUc5SCxJQUZILENBRVFpRixLQUFHO0FBQ1A3RSxZQUFRQyxHQUFSLENBQVk0RSxDQUFaO0FBQ0QsR0FKSDtBQUtEOztBQUVEN0IsT0FBT0MsT0FBUCxHQUFpQjtBQUNmaUMsYUFEZTtBQUVmOEIsZ0JBRmU7QUFHZmMsVUFIZTtBQUlmbkQ7QUFKZSxDQUFqQixDIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdGZ1bmN0aW9uIGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKSB7XG4gXHRcdGRlbGV0ZSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF07XG4gXHR9XG4gXHR2YXIgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2sgPSB3aW5kb3dbXCJ3ZWJwYWNrSG90VXBkYXRlXCJdO1xuIFx0d2luZG93W1wid2VicGFja0hvdFVwZGF0ZVwiXSA9IFxyXG4gXHRmdW5jdGlvbiB3ZWJwYWNrSG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKTtcclxuIFx0XHRpZihwYXJlbnRIb3RVcGRhdGVDYWxsYmFjaykgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xyXG4gXHR9IDtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF07XHJcbiBcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XHJcbiBcdFx0c2NyaXB0LnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xyXG4gXHRcdHNjcmlwdC5jaGFyc2V0ID0gXCJ1dGYtOFwiO1xyXG4gXHRcdHNjcmlwdC5zcmMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgY2h1bmtJZCArIFwiLlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzXCI7XHJcbiBcdFx0O1xyXG4gXHRcdGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRNYW5pZmVzdChyZXF1ZXN0VGltZW91dCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0cmVxdWVzdFRpbWVvdXQgPSByZXF1ZXN0VGltZW91dCB8fCAxMDAwMDtcclxuIFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiBcdFx0XHRpZih0eXBlb2YgWE1MSHR0cFJlcXVlc3QgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdHJldHVybiByZWplY3QobmV3IEVycm9yKFwiTm8gYnJvd3NlciBzdXBwb3J0XCIpKTtcclxuIFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiBcdFx0XHRcdHZhciByZXF1ZXN0UGF0aCA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIFwiXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNvblwiO1xyXG4gXHRcdFx0XHRyZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgcmVxdWVzdFBhdGgsIHRydWUpO1xyXG4gXHRcdFx0XHRyZXF1ZXN0LnRpbWVvdXQgPSByZXF1ZXN0VGltZW91dDtcclxuIFx0XHRcdFx0cmVxdWVzdC5zZW5kKG51bGwpO1xyXG4gXHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0cmV0dXJuIHJlamVjdChlcnIpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0aWYocmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSByZXR1cm47XHJcbiBcdFx0XHRcdGlmKHJlcXVlc3Quc3RhdHVzID09PSAwKSB7XHJcbiBcdFx0XHRcdFx0Ly8gdGltZW91dFxyXG4gXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoXCJNYW5pZmVzdCByZXF1ZXN0IHRvIFwiICsgcmVxdWVzdFBhdGggKyBcIiB0aW1lZCBvdXQuXCIpKTtcclxuIFx0XHRcdFx0fSBlbHNlIGlmKHJlcXVlc3Quc3RhdHVzID09PSA0MDQpIHtcclxuIFx0XHRcdFx0XHQvLyBubyB1cGRhdGUgYXZhaWxhYmxlXHJcbiBcdFx0XHRcdFx0cmVzb2x2ZSgpO1xyXG4gXHRcdFx0XHR9IGVsc2UgaWYocmVxdWVzdC5zdGF0dXMgIT09IDIwMCAmJiByZXF1ZXN0LnN0YXR1cyAhPT0gMzA0KSB7XHJcbiBcdFx0XHRcdFx0Ly8gb3RoZXIgZmFpbHVyZVxyXG4gXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoXCJNYW5pZmVzdCByZXF1ZXN0IHRvIFwiICsgcmVxdWVzdFBhdGggKyBcIiBmYWlsZWQuXCIpKTtcclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHQvLyBzdWNjZXNzXHJcbiBcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdHZhciB1cGRhdGUgPSBKU09OLnBhcnNlKHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGUpIHtcclxuIFx0XHRcdFx0XHRcdHJlamVjdChlKTtcclxuIFx0XHRcdFx0XHRcdHJldHVybjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0cmVzb2x2ZSh1cGRhdGUpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9O1xyXG4gXHRcdH0pO1xyXG4gXHR9XHJcblxuIFx0XHJcbiBcdFxyXG4gXHR2YXIgaG90QXBwbHlPblVwZGF0ZSA9IHRydWU7XHJcbiBcdHZhciBob3RDdXJyZW50SGFzaCA9IFwiNjFiODczNDlkYmU2NzA3ZWNkYjFcIjsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90UmVxdWVzdFRpbWVvdXQgPSAxMDAwMDtcclxuIFx0dmFyIGhvdEN1cnJlbnRNb2R1bGVEYXRhID0ge307XHJcbiBcdHZhciBob3RDdXJyZW50Q2hpbGRNb2R1bGU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzID0gW107IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IFtdOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgbWUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRpZighbWUpIHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fO1xyXG4gXHRcdHZhciBmbiA9IGZ1bmN0aW9uKHJlcXVlc3QpIHtcclxuIFx0XHRcdGlmKG1lLmhvdC5hY3RpdmUpIHtcclxuIFx0XHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XSkge1xyXG4gXHRcdFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKSA8IDApXHJcbiBcdFx0XHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMucHVzaChtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHJlcXVlc3Q7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYobWUuY2hpbGRyZW4uaW5kZXhPZihyZXF1ZXN0KSA8IDApXHJcbiBcdFx0XHRcdFx0bWUuY2hpbGRyZW4ucHVzaChyZXF1ZXN0KTtcclxuIFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlcXVlc3QgKyBcIikgZnJvbSBkaXNwb3NlZCBtb2R1bGUgXCIgKyBtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW107XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhyZXF1ZXN0KTtcclxuIFx0XHR9O1xyXG4gXHRcdHZhciBPYmplY3RGYWN0b3J5ID0gZnVuY3Rpb24gT2JqZWN0RmFjdG9yeShuYW1lKSB7XHJcbiBcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXHJcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcbiBcdFx0XHRcdGdldDogZnVuY3Rpb24oKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX19bbmFtZV07XHJcbiBcdFx0XHRcdH0sXHJcbiBcdFx0XHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuIFx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdID0gdmFsdWU7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH07XHJcbiBcdFx0fTtcclxuIFx0XHRmb3IodmFyIG5hbWUgaW4gX193ZWJwYWNrX3JlcXVpcmVfXykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKF9fd2VicGFja19yZXF1aXJlX18sIG5hbWUpICYmIG5hbWUgIT09IFwiZVwiKSB7XHJcbiBcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgbmFtZSwgT2JqZWN0RmFjdG9yeShuYW1lKSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcdGZuLmUgPSBmdW5jdGlvbihjaHVua0lkKSB7XHJcbiBcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicmVhZHlcIilcclxuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcclxuIFx0XHRcdGhvdENodW5rc0xvYWRpbmcrKztcclxuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLmUoY2h1bmtJZCkudGhlbihmaW5pc2hDaHVua0xvYWRpbmcsIGZ1bmN0aW9uKGVycikge1xyXG4gXHRcdFx0XHRmaW5pc2hDaHVua0xvYWRpbmcoKTtcclxuIFx0XHRcdFx0dGhyb3cgZXJyO1xyXG4gXHRcdFx0fSk7XHJcbiBcdFxyXG4gXHRcdFx0ZnVuY3Rpb24gZmluaXNoQ2h1bmtMb2FkaW5nKCkge1xyXG4gXHRcdFx0XHRob3RDaHVua3NMb2FkaW5nLS07XHJcbiBcdFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIpIHtcclxuIFx0XHRcdFx0XHRpZighaG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0aWYoaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcclxuIFx0XHRcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9O1xyXG4gXHRcdHJldHVybiBmbjtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgaG90ID0ge1xyXG4gXHRcdFx0Ly8gcHJpdmF0ZSBzdHVmZlxyXG4gXHRcdFx0X2FjY2VwdGVkRGVwZW5kZW5jaWVzOiB7fSxcclxuIFx0XHRcdF9kZWNsaW5lZERlcGVuZGVuY2llczoge30sXHJcbiBcdFx0XHRfc2VsZkFjY2VwdGVkOiBmYWxzZSxcclxuIFx0XHRcdF9zZWxmRGVjbGluZWQ6IGZhbHNlLFxyXG4gXHRcdFx0X2Rpc3Bvc2VIYW5kbGVyczogW10sXHJcbiBcdFx0XHRfbWFpbjogaG90Q3VycmVudENoaWxkTW9kdWxlICE9PSBtb2R1bGVJZCxcclxuIFx0XHJcbiBcdFx0XHQvLyBNb2R1bGUgQVBJXHJcbiBcdFx0XHRhY3RpdmU6IHRydWUsXHJcbiBcdFx0XHRhY2NlcHQ6IGZ1bmN0aW9uKGRlcCwgY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGRlcCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZBY2NlcHRlZCA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJmdW5jdGlvblwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkFjY2VwdGVkID0gZGVwO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXHJcbiBcdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcclxuIFx0XHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XHJcbiBcdFx0XHRcdGVsc2VcclxuIFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcF0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGRlY2xpbmU6IGZ1bmN0aW9uKGRlcCkge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgZGVwID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkRlY2xpbmVkID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxyXG4gXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlXHJcbiBcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBdID0gdHJ1ZTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRkaXNwb3NlOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRhZGREaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0cmVtb3ZlRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdHZhciBpZHggPSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5pbmRleE9mKGNhbGxiYWNrKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIGhvdC5fZGlzcG9zZUhhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHJcbiBcdFx0XHQvLyBNYW5hZ2VtZW50IEFQSVxyXG4gXHRcdFx0Y2hlY2s6IGhvdENoZWNrLFxyXG4gXHRcdFx0YXBwbHk6IGhvdEFwcGx5LFxyXG4gXHRcdFx0c3RhdHVzOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdGlmKCFsKSByZXR1cm4gaG90U3RhdHVzO1xyXG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGFkZFN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRyZW1vdmVTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdHZhciBpZHggPSBob3RTdGF0dXNIYW5kbGVycy5pbmRleE9mKGwpO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkgaG90U3RhdHVzSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcclxuIFx0XHRcdC8vaW5oZXJpdCBmcm9tIHByZXZpb3VzIGRpc3Bvc2UgY2FsbFxyXG4gXHRcdFx0ZGF0YTogaG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdXHJcbiBcdFx0fTtcclxuIFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSB1bmRlZmluZWQ7XHJcbiBcdFx0cmV0dXJuIGhvdDtcclxuIFx0fVxyXG4gXHRcclxuIFx0dmFyIGhvdFN0YXR1c0hhbmRsZXJzID0gW107XHJcbiBcdHZhciBob3RTdGF0dXMgPSBcImlkbGVcIjtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdFNldFN0YXR1cyhuZXdTdGF0dXMpIHtcclxuIFx0XHRob3RTdGF0dXMgPSBuZXdTdGF0dXM7XHJcbiBcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGhvdFN0YXR1c0hhbmRsZXJzLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0aG90U3RhdHVzSGFuZGxlcnNbaV0uY2FsbChudWxsLCBuZXdTdGF0dXMpO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHQvLyB3aGlsZSBkb3dubG9hZGluZ1xyXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzID0gMDtcclxuIFx0dmFyIGhvdENodW5rc0xvYWRpbmcgPSAwO1xyXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90QXZhaWxhYmxlRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdERlZmVycmVkO1xyXG4gXHRcclxuIFx0Ly8gVGhlIHVwZGF0ZSBpbmZvXHJcbiBcdHZhciBob3RVcGRhdGUsIGhvdFVwZGF0ZU5ld0hhc2g7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiB0b01vZHVsZUlkKGlkKSB7XHJcbiBcdFx0dmFyIGlzTnVtYmVyID0gKCtpZCkgKyBcIlwiID09PSBpZDtcclxuIFx0XHRyZXR1cm4gaXNOdW1iZXIgPyAraWQgOiBpZDtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q2hlY2soYXBwbHkpIHtcclxuIFx0XHRpZihob3RTdGF0dXMgIT09IFwiaWRsZVwiKSB0aHJvdyBuZXcgRXJyb3IoXCJjaGVjaygpIGlzIG9ubHkgYWxsb3dlZCBpbiBpZGxlIHN0YXR1c1wiKTtcclxuIFx0XHRob3RBcHBseU9uVXBkYXRlID0gYXBwbHk7XHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiY2hlY2tcIik7XHJcbiBcdFx0cmV0dXJuIGhvdERvd25sb2FkTWFuaWZlc3QoaG90UmVxdWVzdFRpbWVvdXQpLnRoZW4oZnVuY3Rpb24odXBkYXRlKSB7XHJcbiBcdFx0XHRpZighdXBkYXRlKSB7XHJcbiBcdFx0XHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XHJcbiBcdFx0XHRcdHJldHVybiBudWxsO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcclxuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xyXG4gXHRcdFx0aG90QXZhaWxhYmxlRmlsZXNNYXAgPSB1cGRhdGUuYztcclxuIFx0XHRcdGhvdFVwZGF0ZU5ld0hhc2ggPSB1cGRhdGUuaDtcclxuIFx0XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xyXG4gXHRcdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuIFx0XHRcdFx0aG90RGVmZXJyZWQgPSB7XHJcbiBcdFx0XHRcdFx0cmVzb2x2ZTogcmVzb2x2ZSxcclxuIFx0XHRcdFx0XHRyZWplY3Q6IHJlamVjdFxyXG4gXHRcdFx0XHR9O1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0XHRob3RVcGRhdGUgPSB7fTtcclxuIFx0XHRcdHZhciBjaHVua0lkID0gMDtcclxuIFx0XHRcdHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1sb25lLWJsb2Nrc1xyXG4gXHRcdFx0XHQvKmdsb2JhbHMgY2h1bmtJZCAqL1xyXG4gXHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcclxuIFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmV0dXJuIHByb21pc2U7XHJcbiBcdFx0fSk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRpZighaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gfHwgIWhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdKVxyXG4gXHRcdFx0cmV0dXJuO1xyXG4gXHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gZmFsc2U7XHJcbiBcdFx0Zm9yKHZhciBtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0aG90VXBkYXRlW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFx0aWYoLS1ob3RXYWl0aW5nRmlsZXMgPT09IDAgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCkge1xyXG4gXHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCkge1xyXG4gXHRcdGlmKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSkge1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzKys7XHJcbiBcdFx0XHRob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90VXBkYXRlRG93bmxvYWRlZCgpIHtcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJyZWFkeVwiKTtcclxuIFx0XHR2YXIgZGVmZXJyZWQgPSBob3REZWZlcnJlZDtcclxuIFx0XHRob3REZWZlcnJlZCA9IG51bGw7XHJcbiBcdFx0aWYoIWRlZmVycmVkKSByZXR1cm47XHJcbiBcdFx0aWYoaG90QXBwbHlPblVwZGF0ZSkge1xyXG4gXHRcdFx0Ly8gV3JhcCBkZWZlcnJlZCBvYmplY3QgaW4gUHJvbWlzZSB0byBtYXJrIGl0IGFzIGEgd2VsbC1oYW5kbGVkIFByb21pc2UgdG9cclxuIFx0XHRcdC8vIGF2b2lkIHRyaWdnZXJpbmcgdW5jYXVnaHQgZXhjZXB0aW9uIHdhcm5pbmcgaW4gQ2hyb21lLlxyXG4gXHRcdFx0Ly8gU2VlIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTQ2NTY2NlxyXG4gXHRcdFx0UHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0cmV0dXJuIGhvdEFwcGx5KGhvdEFwcGx5T25VcGRhdGUpO1xyXG4gXHRcdFx0fSkudGhlbihcclxuIFx0XHRcdFx0ZnVuY3Rpb24ocmVzdWx0KSB7XHJcbiBcdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xyXG4gXHRcdFx0XHR9LFxyXG4gXHRcdFx0XHRmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZXJyKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0KTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XHJcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2godG9Nb2R1bGVJZChpZCkpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RBcHBseShvcHRpb25zKSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcInJlYWR5XCIpIHRocm93IG5ldyBFcnJvcihcImFwcGx5KCkgaXMgb25seSBhbGxvd2VkIGluIHJlYWR5IHN0YXR1c1wiKTtcclxuIFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIGNiO1xyXG4gXHRcdHZhciBpO1xyXG4gXHRcdHZhciBqO1xyXG4gXHRcdHZhciBtb2R1bGU7XHJcbiBcdFx0dmFyIG1vZHVsZUlkO1xyXG4gXHRcclxuIFx0XHRmdW5jdGlvbiBnZXRBZmZlY3RlZFN0dWZmKHVwZGF0ZU1vZHVsZUlkKSB7XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW3VwZGF0ZU1vZHVsZUlkXTtcclxuIFx0XHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpLm1hcChmdW5jdGlvbihpZCkge1xyXG4gXHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdGNoYWluOiBbaWRdLFxyXG4gXHRcdFx0XHRcdGlkOiBpZFxyXG4gXHRcdFx0XHR9O1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRcdHZhciBxdWV1ZUl0ZW0gPSBxdWV1ZS5wb3AoKTtcclxuIFx0XHRcdFx0dmFyIG1vZHVsZUlkID0gcXVldWVJdGVtLmlkO1xyXG4gXHRcdFx0XHR2YXIgY2hhaW4gPSBxdWV1ZUl0ZW0uY2hhaW47XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZighbW9kdWxlIHx8IG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0aWYobW9kdWxlLmhvdC5fc2VsZkRlY2xpbmVkKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1kZWNsaW5lZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihtb2R1bGUuaG90Ll9tYWluKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwidW5hY2NlcHRlZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbW9kdWxlLnBhcmVudHMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50SWQgPSBtb2R1bGUucGFyZW50c1tpXTtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50ID0gaW5zdGFsbGVkTW9kdWxlc1twYXJlbnRJZF07XHJcbiBcdFx0XHRcdFx0aWYoIXBhcmVudCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRlY2xpbmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0cGFyZW50SWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZihvdXRkYXRlZE1vZHVsZXMuaW5kZXhPZihwYXJlbnRJZCkgPj0gMCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRpZighb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxyXG4gXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0gPSBbXTtcclxuIFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSwgW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXTtcclxuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XHJcbiBcdFx0XHRcdFx0cXVldWUucHVzaCh7XHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxyXG4gXHRcdFx0XHRcdFx0aWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHJcbiBcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHR0eXBlOiBcImFjY2VwdGVkXCIsXHJcbiBcdFx0XHRcdG1vZHVsZUlkOiB1cGRhdGVNb2R1bGVJZCxcclxuIFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzOiBvdXRkYXRlZE1vZHVsZXMsXHJcbiBcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzOiBvdXRkYXRlZERlcGVuZGVuY2llc1xyXG4gXHRcdFx0fTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGZ1bmN0aW9uIGFkZEFsbFRvU2V0KGEsIGIpIHtcclxuIFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdHZhciBpdGVtID0gYltpXTtcclxuIFx0XHRcdFx0aWYoYS5pbmRleE9mKGl0ZW0pIDwgMClcclxuIFx0XHRcdFx0XHRhLnB1c2goaXRlbSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBhdCBiZWdpbiBhbGwgdXBkYXRlcyBtb2R1bGVzIGFyZSBvdXRkYXRlZFxyXG4gXHRcdC8vIHRoZSBcIm91dGRhdGVkXCIgc3RhdHVzIGNhbiBwcm9wYWdhdGUgdG8gcGFyZW50cyBpZiB0aGV5IGRvbid0IGFjY2VwdCB0aGUgY2hpbGRyZW5cclxuIFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcclxuIFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0dmFyIGFwcGxpZWRVcGRhdGUgPSB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSA9IGZ1bmN0aW9uIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSgpIHtcclxuIFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiKSB0byBkaXNwb3NlZCBtb2R1bGVcIik7XHJcbiBcdFx0fTtcclxuIFx0XHJcbiBcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGVJZCA9IHRvTW9kdWxlSWQoaWQpO1xyXG4gXHRcdFx0XHR2YXIgcmVzdWx0O1xyXG4gXHRcdFx0XHRpZihob3RVcGRhdGVbaWRdKSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0gZ2V0QWZmZWN0ZWRTdHVmZihtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJkaXNwb3NlZFwiLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IGlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR2YXIgYWJvcnRFcnJvciA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9BcHBseSA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9EaXNwb3NlID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBjaGFpbkluZm8gPSBcIlwiO1xyXG4gXHRcdFx0XHRpZihyZXN1bHQuY2hhaW4pIHtcclxuIFx0XHRcdFx0XHRjaGFpbkluZm8gPSBcIlxcblVwZGF0ZSBwcm9wYWdhdGlvbjogXCIgKyByZXN1bHQuY2hhaW4uam9pbihcIiAtPiBcIik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0c3dpdGNoKHJlc3VsdC50eXBlKSB7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInNlbGYtZGVjbGluZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBvZiBzZWxmIGRlY2xpbmU6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJkZWNsaW5lZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIG9mIGRlY2xpbmVkIGRlcGVuZGVuY3k6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIgaW4gXCIgKyByZXN1bHQucGFyZW50SWQgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInVuYWNjZXB0ZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25VbmFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uVW5hY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlVW5hY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImFjY2VwdGVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25BY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0ZG9BcHBseSA9IHRydWU7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiZGlzcG9zZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EaXNwb3NlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRpc3Bvc2VkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRkb0Rpc3Bvc2UgPSB0cnVlO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0ZGVmYXVsdDpcclxuIFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhjZXB0aW9uIHR5cGUgXCIgKyByZXN1bHQudHlwZSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoYWJvcnRFcnJvcikge1xyXG4gXHRcdFx0XHRcdGhvdFNldFN0YXR1cyhcImFib3J0XCIpO1xyXG4gXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChhYm9ydEVycm9yKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihkb0FwcGx5KSB7XHJcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSBob3RVcGRhdGVbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgcmVzdWx0Lm91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0XHRcdFx0Zm9yKG1vZHVsZUlkIGluIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXHJcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XHJcbiBcdFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSwgcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGRvRGlzcG9zZSkge1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgW3Jlc3VsdC5tb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBTdG9yZSBzZWxmIGFjY2VwdGVkIG91dGRhdGVkIG1vZHVsZXMgdG8gcmVxdWlyZSB0aGVtIGxhdGVyIGJ5IHRoZSBtb2R1bGUgc3lzdGVtXHJcbiBcdFx0dmFyIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSAmJiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0b3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLnB1c2goe1xyXG4gXHRcdFx0XHRcdG1vZHVsZTogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZFxyXG4gXHRcdFx0XHR9KTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIE5vdyBpbiBcImRpc3Bvc2VcIiBwaGFzZVxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImRpc3Bvc2VcIik7XHJcbiBcdFx0T2JqZWN0LmtleXMoaG90QXZhaWxhYmxlRmlsZXNNYXApLmZvckVhY2goZnVuY3Rpb24oY2h1bmtJZCkge1xyXG4gXHRcdFx0aWYoaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gPT09IGZhbHNlKSB7XHJcbiBcdFx0XHRcdGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9KTtcclxuIFx0XHJcbiBcdFx0dmFyIGlkeDtcclxuIFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKTtcclxuIFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xyXG4gXHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRpZighbW9kdWxlKSBjb250aW51ZTtcclxuIFx0XHJcbiBcdFx0XHR2YXIgZGF0YSA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdC8vIENhbGwgZGlzcG9zZSBoYW5kbGVyc1xyXG4gXHRcdFx0dmFyIGRpc3Bvc2VIYW5kbGVycyA9IG1vZHVsZS5ob3QuX2Rpc3Bvc2VIYW5kbGVycztcclxuIFx0XHRcdGZvcihqID0gMDsgaiA8IGRpc3Bvc2VIYW5kbGVycy5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHRjYiA9IGRpc3Bvc2VIYW5kbGVyc1tqXTtcclxuIFx0XHRcdFx0Y2IoZGF0YSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF0gPSBkYXRhO1xyXG4gXHRcclxuIFx0XHRcdC8vIGRpc2FibGUgbW9kdWxlICh0aGlzIGRpc2FibGVzIHJlcXVpcmVzIGZyb20gdGhpcyBtb2R1bGUpXHJcbiBcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBtb2R1bGUgZnJvbSBjYWNoZVxyXG4gXHRcdFx0ZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcclxuIFx0XHRcdC8vIHdoZW4gZGlzcG9zaW5nIHRoZXJlIGlzIG5vIG5lZWQgdG8gY2FsbCBkaXNwb3NlIGhhbmRsZXJcclxuIFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFxyXG4gXHRcdFx0Ly8gcmVtb3ZlIFwicGFyZW50c1wiIHJlZmVyZW5jZXMgZnJvbSBhbGwgY2hpbGRyZW5cclxuIFx0XHRcdGZvcihqID0gMDsgaiA8IG1vZHVsZS5jaGlsZHJlbi5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHR2YXIgY2hpbGQgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZS5jaGlsZHJlbltqXV07XHJcbiBcdFx0XHRcdGlmKCFjaGlsZCkgY29udGludWU7XHJcbiBcdFx0XHRcdGlkeCA9IGNoaWxkLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSB7XHJcbiBcdFx0XHRcdFx0Y2hpbGQucGFyZW50cy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gcmVtb3ZlIG91dGRhdGVkIGRlcGVuZGVuY3kgZnJvbSBtb2R1bGUgY2hpbGRyZW5cclxuIFx0XHR2YXIgZGVwZW5kZW5jeTtcclxuIFx0XHR2YXIgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXM7XHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0aWYobW9kdWxlKSB7XHJcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0Zm9yKGogPSAwOyBqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tqXTtcclxuIFx0XHRcdFx0XHRcdGlkeCA9IG1vZHVsZS5jaGlsZHJlbi5pbmRleE9mKGRlcGVuZGVuY3kpO1xyXG4gXHRcdFx0XHRcdFx0aWYoaWR4ID49IDApIG1vZHVsZS5jaGlsZHJlbi5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIE5vdCBpbiBcImFwcGx5XCIgcGhhc2VcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJhcHBseVwiKTtcclxuIFx0XHJcbiBcdFx0aG90Q3VycmVudEhhc2ggPSBob3RVcGRhdGVOZXdIYXNoO1xyXG4gXHRcclxuIFx0XHQvLyBpbnNlcnQgbmV3IGNvZGVcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gYXBwbGllZFVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFwcGxpZWRVcGRhdGUsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGVzW21vZHVsZUlkXSA9IGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gY2FsbCBhY2NlcHQgaGFuZGxlcnNcclxuIFx0XHR2YXIgZXJyb3IgPSBudWxsO1xyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKG1vZHVsZSkge1xyXG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdHZhciBjYWxsYmFja3MgPSBbXTtcclxuIFx0XHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldO1xyXG4gXHRcdFx0XHRcdFx0Y2IgPSBtb2R1bGUuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBlbmRlbmN5XTtcclxuIFx0XHRcdFx0XHRcdGlmKGNiKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKGNhbGxiYWNrcy5pbmRleE9mKGNiKSA+PSAwKSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2goY2IpO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHRcdGNiID0gY2FsbGJhY2tzW2ldO1xyXG4gXHRcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdFx0Y2IobW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMpO1xyXG4gXHRcdFx0XHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XHJcbiBcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRkZXBlbmRlbmN5SWQ6IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldLFxyXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTG9hZCBzZWxmIGFjY2VwdGVkIG1vZHVsZXNcclxuIFx0XHRmb3IoaSA9IDA7IGkgPCBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdHZhciBpdGVtID0gb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzW2ldO1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBpdGVtLm1vZHVsZTtcclxuIFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcclxuIFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpO1xyXG4gXHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGl0ZW0uZXJyb3JIYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpIHtcclxuIFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0aXRlbS5lcnJvckhhbmRsZXIoZXJyKTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGVycjIpIHtcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25FcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yLWhhbmRsZXItZXJyb3JlZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyMixcclxuIFx0XHRcdFx0XHRcdFx0XHRvcmdpbmFsRXJyb3I6IGVyciwgLy8gVE9ETyByZW1vdmUgaW4gd2VicGFjayA0XHJcbiBcdFx0XHRcdFx0XHRcdFx0b3JpZ2luYWxFcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnIyO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxyXG4gXHRcdGlmKGVycm9yKSB7XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJmYWlsXCIpO1xyXG4gXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XHJcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcclxuIFx0XHRcdHJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGhvdDogaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSxcbiBcdFx0XHRwYXJlbnRzOiAoaG90Q3VycmVudFBhcmVudHNUZW1wID0gaG90Q3VycmVudFBhcmVudHMsIGhvdEN1cnJlbnRQYXJlbnRzID0gW10sIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCksXG4gXHRcdFx0Y2hpbGRyZW46IFtdXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvXCI7XG5cbiBcdC8vIF9fd2VicGFja19oYXNoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18uaCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaG90Q3VycmVudEhhc2g7IH07XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIGhvdENyZWF0ZVJlcXVpcmUoMCkoX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNjFiODczNDlkYmU2NzA3ZWNkYjEiLCJjb25zdCBrZXkgPSB7XG4gICdyb2NrJzogWzEsMCwwXSxcbiAgJ3BhcGVyJzogWzAsMSwwXSxcbiAgJ3NjaXNzb3JzJzogWzAsMCwxXSxcbiAgJ1sxLDAsMF0nOiAncm9jaycsXG4gICdbMCwxLDBdJzogJ3BhcGVyJyxcbiAgJ1swLDAsMV0nOiAnc2Npc3NvcnMnLFxufVxuXG5mdW5jdGlvbiBjb252ZXJ0UlBTdG9BcnJheShlbnRyeSl7XG4gIHJldHVybiBrZXlbZW50cnldXG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRSUFNHYW1ldG9BcnJheShnYW1lKXtcbiAgbGV0IGtleSA9IHtcbiAgICAncm9jayc6IFsxLDAsMF0sXG4gICAgJ3BhcGVyJzogWzAsMSwwXSxcbiAgICAnc2Npc3NvcnMnOiBbMCwwLDFdXG4gIH1cbiAgcmV0dXJuIGdhbWUubWFwKGUgPT4ga2V5W2VdKVxufVxuXG5mdW5jdGlvbiBnZXRSZXN1bHRzKGNiKXtcbiAgRW50cnlNb2RlbC5maW5kKHt9KVxuICAudGhlbihyZXMgPT4gY2IocmVzKSlcbiAgLmNhdGNoKGVycj0+IGNvbnNvbGUubG9nKGVycikpXG59XG5cbmZ1bmN0aW9uIGNvbWJpbmVHYW1lcyhlbnRyaWVzKXtcbiAgbGV0IHJlc3VsdCA9IFtdXG4gIGVudHJpZXMuZm9yRWFjaCgoZW50cnkpPT57XG4gICAgcmVzdWx0ID0gcmVzdWx0LmNvbmNhdChlbnRyeS5nYW1lKVxuICB9KVxuICByZXR1cm4gcmVzdWx0XG59XG5cbmZ1bmN0aW9uIGFuYWx5emVSZXN1bHRzKGdhbWVzKXtcbiAgY29uc3QgcmVzdWx0cyA9IHtcbiAgICB3aW5zOiAwLFxuICAgIGxvc3NlczogMCxcbiAgICB0aWVzOjAsXG4gICAgdG90YWw6IGdhbWVzLmxlbmd0aCxcbiAgICByb2NrOiAwLFxuICAgIHBhcGVyOiAwLFxuICAgIHNjaXNzb3JzOiAwLFxuICAgIHJvY2tXaW5zOiAwLFxuICAgIHBhcGVyV2luczogMCxcbiAgICBzY2lzc29yc1dpbnM6IDAsXG4gICAgbG9uZ2VzdFN0cmVhazogMCxcbiAgfVxuICBsZXQgY3VycmVudFN0cmVhayA9IDBcblxuICBnYW1lcy5mb3JFYWNoKGVudHJ5ID0+e1xuICAgIGxldCBjMSA9IGtleVtKU09OLnN0cmluZ2lmeShlbnRyeVswXSldXG4gICAgbGV0IGMyID0ga2V5W0pTT04uc3RyaW5naWZ5KGVudHJ5WzFdKV1cblxuICAgIHJlc3VsdHNbYzFdICs9IDFcbiAgICBsZXQgZ2FtZVJlc3VsdCA9IGRldGVybWluZVdpbm5lcihjMSxjMilcbiAgICBpZihnYW1lUmVzdWx0ID4gMCl7XG4gICAgICByZXN1bHRzLndpbnMgKz0xXG4gICAgICByZXN1bHRzW2Ake2MxfVdpbnNgXSArPSAxXG4gICAgICBjdXJyZW50U3RyZWFrICs9MVxuICAgIH0gZWxzZSBpZihnYW1lUmVzdWx0ID09IDApe1xuICAgICAgcmVzdWx0cy50aWVzICs9MVxuICAgICAgY2hlY2tTdHJlYWsoKSAgXG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdHMubG9zc2VzICs9MVxuICAgICAgY2hlY2tTdHJlYWsoKVxuICAgIH1cbiAgfSlcblxuICBmdW5jdGlvbiBjaGVja1N0cmVhaygpe1xuICAgIGlmKGN1cnJlbnRTdHJlYWsgPiByZXN1bHRzLmxvbmdlc3RTdHJlYWspIHJlc3VsdHMubG9uZ2VzdFN0cmVhayA9IGN1cnJlbnRTdHJlYWtcbiAgICBjdXJyZW50U3RyZWFrID0gMFxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdHNcbn1cblxuZnVuY3Rpb24gZGV0ZXJtaW5lV2lubmVyKGMxLCBjMil7XG4gIGlmKGMxID09ICdyb2NrJyl7XG4gICAgaWYoYzIgPT0gJ3JvY2snKSByZXR1cm4gMFxuICAgIGlmKGMyID09ICdzY2lzc29ycycpIHJldHVybiAxXG4gICAgaWYoYzIgPT0gJ3BhcGVyJykgcmV0dXJuIC0xXG4gIH1cbiAgZWxzZSBpZihjMSA9PSAncGFwZXInKXtcbiAgICBpZihjMiA9PSAncGFwZXInKSByZXR1cm4gMFxuICAgIGVsc2UgaWYoYzIgPT0gJ3JvY2snKSByZXR1cm4gMVxuICAgIGVsc2UgaWYoYzIgPT0gJ3NjaXNzb3JzJykgcmV0dXJuIC0xXG4gIH1cbiAgZWxzZSBpZihjMSA9PSAnc2Npc3NvcnMnKXtcbiAgICBpZihjMiA9PSAnc2Npc3NvcnMnKSByZXR1cm4gMFxuICAgIGVsc2UgaWYoYzIgPT0gJ3BhcGVyJykgcmV0dXJuIDFcbiAgICBlbHNlIGlmKGMyID09ICdyb2NrJykgcmV0dXJuIC0xXG4gIH1cbn1cbmZ1bmN0aW9uIGRldGVybWluZVByZWRpY3Rpb24ocHJlZGljdGlvbkFycmF5KXtcbiAgbGV0IG1heCA9IHByZWRpY3Rpb25BcnJheS5yZWR1Y2UoKGEsYik9Pk1hdGgubWF4KGEsYiksIDApXG4gIHJldHVybiBwcmVkaWN0aW9uQXJyYXkubWFwKGUgPT4gZSA9PSBtYXggPyAxIDogMClcbn1cblxuZnVuY3Rpb24gY2hvb3NlT25QcmVkaWN0aW9uKHByZWRpY3Rpb24pe1xuICBpZihwcmVkaWN0aW9uWzBdKSByZXR1cm4gJ3BhcGVyJ1xuICBlbHNlIGlmKHByZWRpY3Rpb25bMV0pIHJldHVybiAnc2Npc3NvcnMnXG4gIGVsc2UgaWYocHJlZGljdGlvblsyXSkgcmV0dXJuICdyb2NrJ1xufVxuXG5mdW5jdGlvbiBtYWtlVm90ZShwcmVkaWN0aW9uQXJyYXkpe1xuICBsZXQgcCA9IGRldGVybWluZVByZWRpY3Rpb24ocHJlZGljdGlvbkFycmF5KVxuICByZXR1cm4gY2hvb3NlT25QcmVkaWN0aW9uKHApXG59XG5cbi8vIENob29zZSByYW5kb20gcGxheS4gUm9jaywgUGFwZXIsIG9yIFNjaXNzb3JzXG5mdW5jdGlvbiBjaG9vc2VSYW5kb20oKXtcbiAgY29uc3QgY2hvaWNlcyA9IFsncm9jaycsICdwYXBlcicsICdzY2lzc29ycyddXG4gIHJldHVybiBjaG9pY2VzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSozKV1cbn1cblxuZnVuY3Rpb24gcChuLHQpe1xuICByZXR1cm4gTWF0aC5yb3VuZCgoKG4vdCkqMTAwMCkvMTApICsgJyUnXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNvbWJpbmVHYW1lcyxcbiAgZGV0ZXJtaW5lV2lubmVyLFxuICBjaG9vc2VSYW5kb20sXG4gIHAsXG4gIGtleSxcbiAgY29udmVydFJQU0dhbWV0b0FycmF5LFxuICBjb252ZXJ0UlBTdG9BcnJheSxcbiAgbWFrZVZvdGVcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vaGVscGVycy5qcyIsImltcG9ydCB7ZGV0ZXJtaW5lV2lubmVyLFxuICAgICAgICBjaG9vc2VSYW5kb20sXG4gICAgICAgIHAsXG4gICAgICAgIGNvbnZlcnRSUFN0b0FycmF5LFxuICAgICAgICBtYWtlVm90ZX0gZnJvbSAnLi4vLi4vaGVscGVycyc7XG5pbXBvcnQge3NlbmRSZXN1bHRzLFxuICAgICAgICB0cmFpbk5ldCxcbiAgICAgICAgZmV0Y2hTZXNzaW9uSWQsXG4gICAgICAgIGZldGNoQW5uZXR0ZXNQcmVkaWN0aW9ufSBmcm9tICcuL2Nvbm5lY3Rpb25zJztcblxubGV0IHNsYWNrVVJJID0gXCJodHRwczovL2hvb2tzLnNsYWNrLmNvbS9zZXJ2aWNlcy9UMUE4WDNUUVYvQjlCSzlHR0JaLzNpVXREN3VLMkZPNXF1aFZQUmw4ZUZLRlwiXG5sZXQgbGFzdE1vdmVzID0gW11cblxuY29uc3Qgc3RhdHMgPSB7XG4gIHdpbjogMCxcbiAgdGllOiAwLFxuICBsb3NzOiAwLFxuICB0b3RhbDogMFxufVxubGV0IGNvdW50aW5nID0gZmFsc2Vcbi8vIF5eXl4gcHJldmVudHMgbXVsdGlwbGUgdm90ZXMgZHVyaW5nIGNvdW50ZG93blxuXG4vLyBFdmVudCBMaXN0ZW5lcnNcbmNvbnN0IGJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24nKVxuYnV0dG9ucy5mb3JFYWNoKGI9PmIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSk9PntcbiAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gIGxldCB2YWwgPSBlLnRhcmdldC52YWx1ZVxuICBpZighY291bnRpbmcpIGhhbmRsZVZvdGUodmFsKVxufSkpXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZT0+e1xuICBjb25zdCBrZXkgPSB7Mzc6ICdyb2NrJyw4Mjoncm9jaycsXG4gICAgICAgICAgICA4MDogJ3BhcGVyJywgNDA6ICdwYXBlcicsXG4gICAgICAgICAgICA4MzogJ3NjaXNzb3JzJywgMzk6ICdzY2lzc29ycyd9XG4gIGNvbnN0IHZvdGUgPSBrZXlbZS5rZXlDb2RlXVxuICBpZih2b3RlICYmICFjb3VudGluZykgaGFuZGxlVm90ZSh2b3RlKVxufSlcblxuLy8gUnVubmVyIEZ1bmN0aW9uc1xuZnVuY3Rpb24gaGFuZGxlVm90ZShodil7XG4gIGxldCBodkVuY29kZWQgPSBjb252ZXJ0UlBTdG9BcnJheShodilcbiAgaWYoIWNvdW50aW5nKXtcbiAgICBsZXQgY3YsIGN2RW5jb2RlZDtcbiAgICBjb25zb2xlLmxvZyhsYXN0TW92ZXMpXG4gICAgaWYobGFzdE1vdmVzLmxlbmd0aCA8IDMqMiozICsgMSl7XG4gICAgICBjb25zb2xlLmxvZygnY2hvb3NpbmcgcmFuZG9tbHknKVxuICAgICAgLy9jaG9vc2UgcmFuZG9tbHkgYXQgZmlyc3QuXG4gICAgICBjdiA9IGNob29zZVJhbmRvbSgpXG4gICAgICBjdkVuY29kZWQgPSBjb252ZXJ0UlBTdG9BcnJheShjdilcbiAgICAgIGxhc3RNb3Zlcy5wdXNoKC4uLmh2RW5jb2RlZCwgLi4uY3ZFbmNvZGVkKVxuICAgICAgcnVuKGh2LGN2KVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygncHJlZGljdGluZycpXG4gICAgICAvL2dldCBhbm5ldHRlcyBwcmVkaWNpdGlvbnNcbiAgICAgIGZldGNoQW5uZXR0ZXNQcmVkaWN0aW9uKGxhc3RNb3ZlcywocCk9PntcbiAgICAgICAgbGV0IGN2ID0gbWFrZVZvdGUocClcbiAgICAgICAgY3ZFbmNvZGVkID0gY29udmVydFJQU3RvQXJyYXkoY3YpXG4gICAgICAgIHJ1bihodixjdilcbiAgICAgICAgbGFzdE1vdmVzLnNwbGljZSgwLDYpXG4gICAgICAgIGxhc3RNb3Zlcy5wdXNoKC4uLmh2RW5jb2RlZCwgLi4uY3ZFbmNvZGVkKVxuICAgICAgfSlcbiAgICAgIFxuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBydW4oaHYsY3Ype1xuICAgICAgbGV0IHIgPSBkZXRlcm1pbmVXaW5uZXIoaHYsIGN2KVxuICAgICAgdXBkYXRlU3RhdHMocilcbiAgICAgIGxldCBzZXNzaW9uSWQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnbm4tc2Vzc2lvbi1pZCcpKjFcbiAgICAgIHNlbmRSZXN1bHRzKGh2LCBjdiwgc2Vzc2lvbklkLCBzdGF0cylcbiAgICAgIGNvdW50RG93bihodiwgY3YsIHIpXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGNvdW50RG93bihodW1hblZvdGUsIGNvbXBWb3RlLCByZXN1bHQpe1xuICBjb3VudGluZyA9IHRydWVcbiAgbGV0IGNvdW50ID0gM1xuICB1cGRhdGVXaW5Mb3NzQ29sb3JzKDApXG4gIGNvbnN0IGlkID0gc2V0SW50ZXJ2YWwocnVuLCA3MDApXG4gIHJ1bigpXG4gIGZ1bmN0aW9uIHJ1bigpe1xuICAgIGlmKGNvdW50ID09IDApe1xuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwoaWQpXG4gICAgICBmaW5pc2hTY3JlZW4oaHVtYW5Wb3RlLCBjb21wVm90ZSwgcmVzdWx0KVxuICAgICAgY291bnRpbmcgPSBmYWxzZVxuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2hvaWNlLmh1bWFuJykuaW5uZXJUZXh0ID0gY291bnRcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jaG9pY2UuY29tcHV0ZXInKS5pbm5lclRleHQgPSBjb3VudFxuICAgIH1cbiAgICBjb3VudCAtPSAxXG4gIH1cbn1cblxuZnVuY3Rpb24gZmluaXNoU2NyZWVuKGh1bWFuVm90ZSwgY29tcFZvdGUsIHJlc3VsdCl7XG4gIHVwZGF0ZVN0YXRzU2NyZWVuKHJlc3VsdClcbiAgdXBkYXRlTW92ZXMoaHVtYW5Wb3RlLCBjb21wVm90ZSwgcmVzdWx0KVxufVxuXG5mdW5jdGlvbiB1cGRhdGVTdGF0cyhyZXN1bHQpe1xuICBpZihyZXN1bHQgPj0gMSkgc3RhdHMud2luICs9MTtcbiAgZWxzZSBpZihyZXN1bHQgPT0gMCkgc3RhdHMudGllICs9MTtcbiAgZWxzZSBzdGF0cy5sb3NzICs9MTtcbiAgc3RhdHMudG90YWwgKz0xXG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVN0YXRzU2NyZWVuKCl7XG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdGF0LS1udW1iZXIud2luJykuaW5uZXJUZXh0ID0gc3RhdHMud2luXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdGF0LS1udW1iZXIudGllJykuaW5uZXJUZXh0ID0gc3RhdHMudGllXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdGF0LS1udW1iZXIubG9zcycpLmlubmVyVGV4dCA9IHN0YXRzLmxvc3NcblxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3RhdC0tcGVyY2VudGFnZS53aW4nKS5pbm5lclRleHQgPSBwKHN0YXRzLndpbiwgc3RhdHMudG90YWwpXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdGF0LS1wZXJjZW50YWdlLnRpZScpLmlubmVyVGV4dCA9IHAoc3RhdHMudGllLCBzdGF0cy50b3RhbClcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnN0YXQtLXBlcmNlbnRhZ2UubG9zcycpLmlubmVyVGV4dCA9IHAoc3RhdHMubG9zcywgc3RhdHMudG90YWwpXG59XG5cbi8vIENoYW5nZSB0aGUgQ29sb3JzIG9mIHRoZSBQbGF5IGRlcGVuZGluZyBvbiBXSU4gb3IgTE9TU1xuZnVuY3Rpb24gdXBkYXRlV2luTG9zc0NvbG9ycyhyKXtcbiAgbGV0IGh2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNob2ljZS5odW1hbicpXG4gIGxldCBjdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jaG9pY2UuY29tcHV0ZXInKVxuICBpZihyID49MSl7IFxuICAgIGh2LmNsYXNzTGlzdC5yZW1vdmUoJ2xvc3MnKVxuICAgIGh2LmNsYXNzTGlzdC5hZGQoJ3dpbicpXG4gICAgY3YuY2xhc3NMaXN0LnJlbW92ZSgnd2luJylcbiAgICBjdi5jbGFzc0xpc3QuYWRkKCdsb3NzJylcbiAgfSBlbHNlIGlmKHIgPT0wKSB7XG4gICAgaHYuY2xhc3NMaXN0LnJlbW92ZSgnbG9zcycpXG4gICAgaHYuY2xhc3NMaXN0LnJlbW92ZSgnd2luJylcbiAgICBjdi5jbGFzc0xpc3QucmVtb3ZlKCd3aW4nKVxuICAgIGN2LmNsYXNzTGlzdC5yZW1vdmUoJ2xvc3MnKVxuICB9IGVsc2Uge1xuICAgIGh2LmNsYXNzTGlzdC5yZW1vdmUoJ3dpbicpXG4gICAgaHYuY2xhc3NMaXN0LmFkZCgnbG9zcycpXG4gICAgY3YuY2xhc3NMaXN0LnJlbW92ZSgnbG9zcycpXG4gICAgY3YuY2xhc3NMaXN0LmFkZCgnd2luJylcbiAgfVxufVxuXG4vLyBVcGRhdGUgUHJldmlvdXMgTW92ZXMgTGlzdFxuZnVuY3Rpb24gdXBkYXRlTW92ZXMoaCxjLHIpe1xuICBoID0gaC50b1VwcGVyQ2FzZSgpXG4gIGMgPSBjLnRvVXBwZXJDYXNlKClcbiAgdXBkYXRlV2luTG9zc0NvbG9ycyhyKVxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2hvaWNlLmh1bWFuJykuaW5uZXJUZXh0ID0gaFxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2hvaWNlLmNvbXB1dGVyJykuaW5uZXJUZXh0ID0gY1xuICBcbiAgbGV0IGhjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKVxuICBoYy5pbm5lclRleHQgPSBoXG4gIGxldCBjYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJylcbiAgY2MuaW5uZXJUZXh0ID0gY1xuXG4gIGxldCBobCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb3ZlLWxpc3QuaHVtYW4nKVxuICBsZXQgY2wgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubW92ZS1saXN0LmNvbXB1dGVyJylcblxuICAvL2NhcCB0aGUgbW92ZXMgbGlzdCB0byAxMFxuICBpZihobC5jaGlsZEVsZW1lbnRDb3VudCA+PSAxMCl7XG4gICAgaGwuY2hpbGRyZW5bOV0ucmVtb3ZlKClcbiAgICBjbC5jaGlsZHJlbls5XS5yZW1vdmUoKVxuICB9XG4gIGhsLnByZXBlbmQoaGMpXG4gIGNsLnByZXBlbmQoY2MpXG59XG5cblxuZnVuY3Rpb24gaGFuZGxlU2VydmVyRXJyb3IoZXJyKXtcbiAgYWxlcnQoJ1RoZXJlIHdhcyBhIHByb2JsZW0gY29ubmVjdGluZyB0byB0aGUgc2VydmVyLiBZb3VyIHJlc3VsdHMgd29udCBiZSByZWNvcmRlZC4nKVxuICBjb25zb2xlLmxvZyhlcnIpXG59XG5cbmZldGNoU2Vzc2lvbklkKClcbi8vIHRyYWluTmV0KClcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zY3JpcHRzL2FwcC5qcyIsImNvbnN0IGVuZHBvaW50ID0gJydcblxuZnVuY3Rpb24gc2VuZFJlc3VsdHMoaHYsY3YsIHNlc3Npb25JZCwgc3RhdHMpe1xuICBsZXQgcGF5bG9hZCA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICBnYW1lOiBbaHYsIGN2XSxcbiAgICBzZXNzaW9uSWQsXG4gICAgc3RhdHNcbiAgfSlcbiAgbGV0IG15SW5pdCA9IHsgXG4gICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgaGVhZGVyczoge1xuICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbiwgKi8qJyxcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICB9LFxuICAgIGJvZHk6IHBheWxvYWQsXG4gICAgbW9kZTogJ2NvcnMnLFxuICAgIGNhY2hlOiAnZGVmYXVsdCdcbiAgfTtcblxuICBmZXRjaChlbmRwb2ludCArICcvYXBpL2VudHJ5JywgbXlJbml0KVxuICAudGhlbigocmVzKT0+e1xuICAgIHJldHVybiByZXMuanNvbigpXG4gIH0pXG4gIC50aGVuKChqc29uKT0+e1xuICAgIGNvbnNvbGUubG9nKGpzb24pXG4gICAgaWYoIWpzb24uc3VjY2VzcykgaGFuZGxlU2VydmVyRXJyb3IoanNvbi5tc2cpXG4gIH0pLmNhdGNoKGVyciA9PiBoYW5kbGVTZXJ2ZXJFcnJvcihlcnIpKVxufVxuXG5mdW5jdGlvbiBmZXRjaFNlc3Npb25JZCgpe1xuICBsZXQgbXlJbml0ID0geyBcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKicsXG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSxcbiAgICBtb2RlOiAnY29ycycsXG4gICAgY2FjaGU6ICdkZWZhdWx0J1xuICB9O1xuICBmZXRjaChlbmRwb2ludCArICcvYXBpL3Nlc3Npb24nLCBteUluaXQpXG4gICAgLnRoZW4ocj0+ci5qc29uKCkpXG4gICAgLnRoZW4ocj0+e1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ25uLXNlc3Npb24taWQnLCByLnNlc3Npb25JZClcbiAgICAgIHNsYWNrVVJJID0gci5zbGFja1VSSVxuICAgICAgY29uc29sZS5sb2coXCJTZXNzaW9uSWQ6IFwiICsgci5zZXNzaW9uSWQpXG4gICAgfSlcbn1cbmZ1bmN0aW9uIGZldGNoQW5uZXR0ZXNQcmVkaWN0aW9uKHBheWxvYWQsIGNiKXtcbiAgcGF5bG9hZCA9IEpTT04uc3RyaW5naWZ5KHBheWxvYWQpXG4gIGxldCBteUluaXQgPSB7IFxuICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKicsXG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSxcbiAgICBib2R5OiBwYXlsb2FkLFxuICAgIG1vZGU6ICdjb3JzJyxcbiAgICBjYWNoZTogJ2RlZmF1bHQnXG4gIH07XG4gIGZldGNoKGVuZHBvaW50ICsgJy9hcGkvbmV0L2FubmV0dGUnLCBteUluaXQpXG4gICAgLnRoZW4ocj0+ci5qc29uKCkpXG4gICAgLnRoZW4ocj0+e1xuICAgICAgY29uc29sZS5sb2coJ1BSRURJQ1RJT046ICcscilcbiAgICAgIGNiKHIubXNnKVxuICAgIH0pXG4gICAgLmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKVxufVxuXG5mdW5jdGlvbiB0cmFpbk5ldCgpe1xuICBsZXQgbXlJbml0ID0geyBcbiAgICBtZXRob2Q6ICdHRVQnLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKicsXG4gICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgfSxcbiAgICBtb2RlOiAnY29ycycsXG4gICAgY2FjaGU6ICdkZWZhdWx0J1xuICB9O1xuICBmZXRjaChlbmRwb2ludCArICcvYXBpL25ldC90cmFpbicsIG15SW5pdClcbiAgICAudGhlbihyPT5yLmpzb24oKSlcbiAgICAudGhlbihyPT57XG4gICAgICBjb25zb2xlLmxvZyhyKVxuICAgIH0pXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZW5kUmVzdWx0cyxcbiAgZmV0Y2hTZXNzaW9uSWQsXG4gIHRyYWluTmV0LFxuICBmZXRjaEFubmV0dGVzUHJlZGljdGlvblxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NjcmlwdHMvY29ubmVjdGlvbnMuanMiXSwic291cmNlUm9vdCI6IiJ9

//
// MIT licensed
//
// Copyright (c) 2015 Thomas Lehmann
//

"use strict";

var path = require("path");

function resolve(config, modulePath, deps) {
	var baseUrl = config.baseUrl,			// /src/js
		resolvedDeps;

	resolvedDeps = deps.map(function(depPath) {
		var depPathParts,
			moduleConfig,
			moduleName,
			subPath;

		// strip off plugin references
		depPath = depPath.replace(/^[^!]+!/, "");

		if (/^\.{1,2}\//.test(depPath)) {
			// relative path

			// path relative to this module's location
			return path.join(path.dirname(modulePath), depPath);
		} else {
			// module name

			// match a/b/c and capture a (module name) and b/c (sub path)
			depPathParts = /^([^\/]+)\/(.+)$/.exec(depPath);

			if (depPathParts) {
				// module "a/b/c" is named "a" and sub path is "b/c"

				moduleName = depPathParts[1];
				subPath = depPathParts[2];
			} else {
				// module is named only "xyz"

				moduleName = depPath;
				subPath = "";
			}

			// 1st: lookup under modules
			moduleConfig = config.packages.filter(function(moduleCfg) {
				return moduleCfg.name == moduleName;
			})[0];

			if (moduleConfig) {
				// module config found

				return path.join(baseUrl, moduleConfig.location, subPath ? subPath : moduleConfig.main || "main");
			}

			// 2nd: not found by modules, try path

			if (config.paths[moduleName]) {
				// found by path
				return path.join(baseUrl, config.paths[moduleName], subPath);
			}

			// 3rd: even no module config, try looking up at baseUrl
			return path.join(baseUrl, depPath);
		}
	});

	return resolvedDeps;
}

module.exports = {
	resolve: resolve
};

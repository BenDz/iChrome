/**
 * Concatenates the locale json files into one requirejs object module.
 *
 * This task also copies over the webstore required locale keys to the Chrome locale files
 */
var _ = require("lodash");

module.exports = function(grunt) {
	grunt.registerMultiTask("i18n", "Compile iChrome i18n files", function() {
		this.files.forEach(function(file) {
			var locales = file.src.filter(function(filepath) {
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');

					return false;
				}
				else {
					return true;
				}
			}).map(function(filepath) {
				return grunt.file.readJSON(filepath);
			});


			locales = _.zipObject(_.pluck(locales, "lang_code"), locales);

			_.mapValues(locales, function(e, i) {
				var lang = e.lang_code.replace("-widgets", "");

				if (e.lang_code.indexOf("-widgets") !== -1 && locales[lang]) {
					delete locales[e.lang_code];
					delete e.lang_code;

					_.assign(locales[lang].widgets, e);
				}
			});


			var outDir = this.options().outDir;

			_.each(locales, function(e, i) {
				var data = {
					lang_code: {
						message: i
					},
					extDescription: {
						message: e.extDescription
					},
					extName: {
						message: e.extName
					},
					themes_upload_image: {
						message: e.themes.upload_image
					}
				};

				grunt.file.write(outDir + "/_locales/" + i.replace("-", "_") + "/messages.json", JSON.stringify(data));
			});

			grunt.file.write(file.dest, "define(" + JSON.stringify(locales) + ");");

			grunt.log.writeln('File "' + file.dest + '" created.');
		}.bind(this));
	});
};
sap.ui.require([
    "com/sap/acs/ui/dashboard/util/formatter"
],
    function (formatter) {
        "use strict";

        QUnit.module("Formatting functions");

        QUnit.test("Should return the Images", function (assert) {
            // System under test
            var fnIsolatedFormatter = formatter.getImage;
            // Assert
            assert.strictEqual(fnIsolatedFormatter("Red"), jQuery.sap.getModulePath("com.sap.acs.ui.dashboard") + "/images/red.png", "The image is Red");
            assert.strictEqual(fnIsolatedFormatter("Amber"), jQuery.sap.getModulePath("com.sap.acs.ui.dashboard") + "/images/amber.png", "The image is amber");
            assert.strictEqual(fnIsolatedFormatter("Green"), jQuery.sap.getModulePath("com.sap.acs.ui.dashboard") + "/images/green.png", "The image is green");
            assert.strictEqual(fnIsolatedFormatter("Default"), jQuery.sap.getModulePath("com.sap.acs.ui.dashboard") + "/images/green.png", "The image is green");
        });

        QUnit.test("Should return the Colors", function (assert) {
            // System under test
            var fnColorFormatter = formatter.getColor;
            // Assert
            assert.strictEqual(fnColorFormatter("Red"), "Error", "The color is Red");
            assert.strictEqual(fnColorFormatter("Amber"), "Warning", "The color is amber");
            assert.strictEqual(fnColorFormatter("Green"), "Success", "The color is green");
            assert.strictEqual(fnColorFormatter("Default"), "Success", "The color is green");
        });

        // "My To Do List" qunit test cases begin.        
        QUnit.test("It should test the formatted date", function (assert) {
            // System under test
            var fnDateFormatFormatter = formatter.getFormattedDate,
                sDate = "2021-09-03T00:00:00Z";
            // Assert
            assert.strictEqual(fnDateFormatFormatter(new Date(sDate)), "2021-09-03T00:00:00.00", "Formatted date");
        });

        QUnit.test("It should test the highlighters", function (assert) {
            // System under test
            var fnGetHighlighter = formatter.getHighlighter;
            // Assert
            assert.strictEqual(fnGetHighlighter("1"), "Success", "Highlighter is green");
            assert.strictEqual(fnGetHighlighter("2"), "Warning", "Highlighter is amber");
            assert.strictEqual(fnGetHighlighter("3"), "Error", "Highlighter is red");
            assert.strictEqual(fnGetHighlighter(""), "None", "Highlighter is none");
        });
        // "My To Do List" qunit test cases end.
    }
);
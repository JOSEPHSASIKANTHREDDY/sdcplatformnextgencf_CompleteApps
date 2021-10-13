sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("ns.UIAPP.controller.View1", {
            onInit: function () {

            }, onAfterRendering: function () {
                var g = this;

                $.ajax({

                    url: "../user",
                    async: false,

                }).done(function (data, status, jqxhr) {
                    console.log(data);

                });
            }, onLogin: function (oEvent) {
                var g = this;

                $.ajax({

                    url: "../twitter/login",
                    async: false,

                }).done(function (data, status, jqxhr) {
                    console.log(data);

                });
            }
        });
    });

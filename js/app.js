/*jslint browser: true*/
/*global $, jQuery, alert, form, table*/
(function iife() {
    'use strict';
    /**
     * Imports html content in div with id view
     * @param data
     */
    function importInView(data) {
        $('#view').html(data);
    }

    /**
     * Extends import in view by adding some events
     * @param data
     */
    function importInViewFormDataAndEvents(data){
        importInView.call(this, data);

        if(table.editMode() === true){
            form.fillData(table.getCars(), table.getCarToEdit());
        }

        $('#submitButton').on('click', form.validate).on('click', function() {
            table.addCar(form.getData());
        });
    }

    /**
     * Extends import in view by redrawing table content
     * then adds some events to table
     * @param data
     */
    function importInViewTableDataAndEvents(data){
        importInView.call(this, data);

        table.drawTable();

        $('table').on('click', table.editData);
    }

    /**
     * Makes ajax request for some url and on success imports in in view
     */
    function ajaxRequestWithCallback(url, callback) {
        $.ajax(url).done(callback);
    }

    /**
     * Makes routing according to hash change
     */
    function routing() {
        switch (document.location.hash) {
            case '':
                ajaxRequestWithCallback('views/home.html', importInView);
                break;
            case "#addCar":
                ajaxRequestWithCallback('views/form.html', importInViewFormDataAndEvents);
                break;
            case "#allCars":
                ajaxRequestWithCallback('views/table.html', importInViewTableDataAndEvents);
                break;
            case "#editCar":
                ajaxRequestWithCallback('views/form.html', importInViewFormDataAndEvents);
                break;
            default:
                ajaxRequestWithCallback('views/pageNotFound.html', importInView);
                break;
        }
    }

    /**
     * Adds event listener to window on load event and on window hash change event.
     */
    function addEventListeners() {
        $(window).load(routing);
        $(window).bind('hashchange', routing);
    }

    addEventListeners();
}());
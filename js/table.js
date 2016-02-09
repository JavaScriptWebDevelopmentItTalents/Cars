/*jslint browser: true*/
/*global $, jQuery, alert*/
var table = (function iife() {
    'use strict';
    var allCars = [],
        tableRows = [],
        carToEdit = null,
        editMode = false;

    /**
     * Adds car to table rows array
     * @param car
     */
    function appendCarToTable(car) {
        var row = $('<tr class="info text-center"></tr>'),
            data,
            property;

        row.append($('<td></td>'));

        for(property in car){
            data = $('<td></td>'). append(car[property].value);
            row.append(data);
        }

        row.append('<td><button class="btn btn-info btn-sm edit"><span class="glyphicon glyphicon-pencil edit">' +
            '</div></button></td>');
        row.append('<td><button class="btn btn-danger btn-sm remove"><span class="glyphicon glyphicon-trash remove">' +
            '</div></button></td>');

        tableRows.push(row);
    }

    /**
     * Checks if the input param car has the correct data to be added to data,
     * then if ok adds it.
     * @param car
     */
    function checkCar(car) {
        var correctCarInput = true,
            property;

        if (car) {
            for (property in car) {
                if (car[property].value === '') {
                    correctCarInput = false;
                }
                if ( ( car[property].name === 'kilometres' || car[property].name === 'yearOfManufacture' )
                    && + car[property].value % 1 !== 0) {
                    correctCarInput = false;
                }
            }

            if (correctCarInput) {
                if(!editMode){
                    allCars.push(car);
                } else{
                    allCars[carToEdit] = car;
                    editMode = false;
                }

                //Changes the location after successfull import of a car
                window.location.hash = '#allCars';
            }
        }
    }

    /**
     * Returns the list of cars.
     * @returns {Array.<T>}
     */
    function getCars() {
        return allCars.slice();
    }

    /**
     * Gets the car index which should be edited.
     * @param index
     */
    function getCarIndexToEdit(){
        return carToEdit;
    }

    /**
     * Get info if table is in edit mode
     */
    function getMode(){
        return editMode;
    }

    /**
     * Writes current data to table
     */
    function rewriteTable() {
        var row,
            rowCounter = 0,
            car,
            tbody;

        tableRows = [];

        for(car in allCars){
            appendCarToTable(allCars[car]);
        }

        tbody = $('<tbody></tbody>');

        //makes row index of table
        for(row in tableRows){
            tableRows[row].children(':first-child').replaceWith($('<td></td>').append( rowCounter +=1 ));
            tbody.append(tableRows[row]);
        }

        //adds new table to dom
        $('tbody').replaceWith(tbody);
    }

    /**
     * Edit or remove a car
     * @param e
     */
    function editData(e){
        if(e.target.className.indexOf('edit') !== -1){
            editMode = true;
            carToEdit = $(e.target).closest('tr').children(':first-child').text() - 1;
            window.location.hash = '#editCar';
        }
        if(e.target.className.indexOf('remove') !== -1){
            if(confirm("Are you sure you want to delete this car?")){
                allCars.splice($(e.target).closest('tr').children(':first-child').text() - 1, 1);
                rewriteTable();
            }
        }
    }

    return {
        addCar: checkCar,
        drawTable: rewriteTable,
        editData: editData,
        getCarToEdit: getCarIndexToEdit,
        getCars: getCars,
        editMode: getMode
    };
}());

/*jslint browser: true*/
/*global $, jQuery, alert*/
/**
 * @type {{function}}
 */
var form = (function iife() {
    'use strict';
    var emptyFields = [],
        notWholeNumbers = [],
        ERRORS_TYPE = {
            empty: '*should not be empty*',
            notWholeNumber: '*should be whole number*'
        },
        hasErrors = true;

    /**
     * Checks if any of the input fields are empty and add value of name attribute to error list.
     */
    function checkForEmptyFields() {
        hasErrors = false;
        $('input').each(function () {
            if ($(this)[0].value === '') {
                hasErrors = true;
                emptyFields.push($(this).attr('name'));
            }
        });
    }

    /**
     * Checks if input fields of type number has whole numbers;
     */
    function checkIfWholeNumber() {
        $('input[type=number]').each(function () {
            if ($(this)[0].value % 1 !== 0) {
                notWholeNumbers.push($(this).attr('name'));
            }
        });
    }

    /**
     * Adds errors with error type to element
     * @param errorType
     * @param $element
     */
    function showErrors(errorType, $element) {
        $element.removeClass('has-success');
        $element.addClass('has-error');

        $element.children(':nth-child(2)').qtip({
            content: {
                text: errorType
            },
            style: {
                classes: 'qtip-red'
            }
        });
    }

    /**
     * Append errors to lines where values from errors[] is the same as the name attribute of the input.
     */
    function addErrors() {
        $('#form').children().each(function () {
            var input = $(this).children(':last-child'),
                indexOfEmptyFields = emptyFields.indexOf(input.attr('name')),
                indexOfNotWholeNumbers = notWholeNumbers.indexOf(input.attr('name'));

            if ((input.attr('class') === 'form-control')) {
                if (indexOfEmptyFields !== -1) {
                    showErrors(ERRORS_TYPE.empty, $(this));
                }
                if (indexOfNotWholeNumbers !== -1) {
                    showErrors(ERRORS_TYPE.notWholeNumber, $(this));
                }
            }
        });
    }

    /**
     * Adds event listeners to input fields to check if they are correctly filled.
     */
    function addDynamicErrors() {
        $('form').on('keyup', function (e) {
            if(e.target.tagName === 'INPUT'){
                if (e.target.value === '') {
                    showErrors(ERRORS_TYPE.empty, $(e.target).parent());
                } else if (e.target.value % 1 !== 0 && e.target.type === 'number') {
                    showErrors(ERRORS_TYPE.notWholeNumber, $(e.target).parent());
                } else {
                    $(".qtip").remove();
                    $(e.target).parent().removeClass('has-error');
                    $(e.target).parent().addClass('has-success');
                }
            }
        });
    }

    /**
     * Calls the other functions.
     * @param e - event listener
     */
    function validate(e) {
        e.preventDefault();
        checkForEmptyFields();
        checkIfWholeNumber();
        addErrors();
        addDynamicErrors();
        emptyFields = [];
        notWholeNumbers = [];
    }

    /**
     * Gets data from form.
     * @returns {*}
     */
    function getData(){
        if(!hasErrors){
            return $('form').serializeArray();
        }
        return '';
    }

    /**
     * Fills form with text from car which is edited in the input fields
     * @param cars
     * @param index
     */
    function fillInputData(cars, index){
        var property;

        for( property in cars[index] ){
            $("input[name=" + cars[index][property].name + "]")[0].value = cars[index][property].value;
        }

        $('#submitButton').text('Edit Car');
    }

    return{
        validate: validate,
        getData: getData,
        fillData: fillInputData
    };
}());

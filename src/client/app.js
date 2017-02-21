import jQuery from "jquery";
import $ from "jquery";

import service from "./services/app.service";
import helpers from "./helpers/app.helpers";

export default class App {

    constructor() {
        this.from = null;
        this.to = null;
        this.date = new Date();
        
        // elements
        this.fromElement = "#from-location";
        this.toElement = "#to-location";
        this.datePickerElement = ".date";
        this.searchElement = "#search";
        this.fieldsetElement = ".search-form-elements";
        this.contentElement = "#search-result";
        this.tabsContentElement = "#search-result-tabs";
        
        jQuery(document).ready(() => {
            // init datepicker and autocomplete
            helpers.initAutocomplete(this.fromElement, this, "from", this.searchElement, "to");
            helpers.initAutocomplete(this.toElement, this, "to", this.searchElement, "from");
            helpers.initDatepicker(this.datePickerElement, this, "date");
            
            // event handlers
            $(this.searchElement).on("click", (e) => {
                e.preventDefault();
                this.search();
            });

            // prevent form submit with incorrect data
            $(this.fromElement).on("keyup", () => {
                this.preventIncorrectSearch("from");
            });
            $(this.toElement).on("keyup", () => {
                this.preventIncorrectSearch("to");
            });
        });
    }

    search() {
        $(this.fieldsetElement).prop("disabled", true);
        service.search(this.from, this.to, this.date)
            .done((result) => {
                $(this.contentElement).empty();
                $(this.tabsContentElement).empty();
                $(this.fieldsetElement).prop("disabled", false);
                //render tabs and content from search result
                helpers.renderTabNavigators(this.tabsContentElement, this.date, this.tab.bind(this));
                helpers.renderResultTable(result, this.contentElement);
            });
    }
    
    tab(date) {
        $(this.fieldsetElement).prop("disabled", true);
        service.search(this.from, this.to, date)
            .done((result) => {
                $(this.contentElement).empty();
                $(this.fieldsetElement).prop("disabled", false);
                //render content from search result
                helpers.renderResultTable(result, this.contentElement);
            });
    }
    
    preventIncorrectSearch(prop) {
        // preventing search with changed value from autocomplete
        this[prop] = null;
        if(!$(this.searchElement).is(":disabled")) {
            $(this.searchElement).prop("disabled", true);
        }
    }
}

const app = new App();
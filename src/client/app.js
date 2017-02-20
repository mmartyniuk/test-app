import jQuery from "jquery";
import $ from "jquery";

import service from "./services/app.service";
import helpers from "./helpers/app.helpers";

export default class App {

    constructor() {
        this.from = null;
        this.to = null;
        this.date = new Date();

        this.fromElement = "#from-location";
        this.toElement = "#to-location";
        this.datePickerElement = ".date";
        this.searchElement = "#search";
        this.fieldsetElement = "#search-form";
        this.content = "#search-result";
        

        jQuery(document).ready(() => {
            helpers.initAutocomplete(this.fromElement, this, "from");
            helpers.initAutocomplete(this.toElement, this, "to");
            helpers.initDatepicker(this.datePickerElement, this, "date");
            $(this.searchElement).on("click", () => {
                this.search();
            })
        });
    }

    search() {
        $(this.fieldsetElement).prop("disabled", true);
        service.search(this.from, this.to, this.date)
            .done((result) => {
                $(this.fieldsetElement).prop("disabled", false);
                helpers.renderResultTable(result, this.content);
            });
    }
}

const app = new App();
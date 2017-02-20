import jQuery from "jquery";
import $ from "jquery";

import service from "./services/app.service";
import helpers from "./helpers/app.helpers";

export default class App {

    constructor() {
        this.from = null;
        this.to = null;
        this.date = new Date()
        this.fromElement = "#fromLocation";
        this.toElement = "#toLocation";
        this.datePickerElement = ".date";
        this.searchElement = "#search";
        

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
        console.log($(this.datePickerElement).data('date'));
        //service.search(this.from, this.to);
    }
}

const app = new App();
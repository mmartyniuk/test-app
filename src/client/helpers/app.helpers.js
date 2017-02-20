import $ from "jquery";
import "bootstrap-datepicker";
import "devbridge-autocomplete";

import service from "./../services/app.service";

export default {
    debounce: (func, wait, immediate) => {
        var timeout;
        return function() {
            var context = this,
                args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait || 200);
            if (callNow) { 
                func.apply(context, args);
            }
        };
    },
    initAutocomplete(elementName, self, propertyName) {
        let loadAPIdeboundced = this.debounce((query, done) => {
            service.getAirports(query).done((airports) => {
                let result = {
                    suggestions: airports
                }
                done(result);
            })
        }, 500);
        $(elementName).autocomplete({
            lookup: (query, done) => {
                loadAPIdeboundced(query, done);
            },
            noCache: true,
            minChars: 2,
            onSelect: (suggestion) => {
                self[propertyName] = suggestion.data;
            }
        });
    },
    initDatepicker(elementName, self, propertyName) {
        $(elementName).datepicker({
            autoclose: true,
            format: 'yyyy-mm-dd',
            startDate: self[propertyName]
        }).on("changeDate", function(e) {
            console.log(self, $(e.currentTarget).val());
        });
        $(elementName).datepicker('setDate', new Date());
    }
}
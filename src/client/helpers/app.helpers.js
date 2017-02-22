import $ from "jquery";
import "bootstrap-datepicker";
import "devbridge-autocomplete";
import moment from "moment";

import service from "./../services/app.service";

export default {
    sortByPrices: (a, b) => {
        if (a.price < b.price)
            return -1;
        if (a.price > b.price)
            return 1;
        return 0;
    },
    // debounce function to prevent big amount of api calls
    // when user is typing too quickly
    debounce: (func, wait, immediate) => {
        let timeout;
        return function() {
            let context = this,
                args = arguments;
            let later = () => {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            };
            let callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait || 200);
            if (callNow) { 
                func.apply(context, args);
            }
        };
    },
    // autocomplete function, takes element on which we have to render autocomplete,
    // context, property that should be updated on autocomplete select,
    // submit button id to enable it if form has valid data, and opposite property
    // to check if search is ready to be started
    initAutocomplete(elementName, self, propertyName, searchElement, opposite) {
        let loadAPIdeboundced = this.debounce((query, done) => {
            service.getAirports(query).done((airports) => {
                let result = {
                    suggestions: airports
                };
                done(result);
            });
        }, 500);
        $(elementName).autocomplete({
            lookup: (query, done) => {
                loadAPIdeboundced(query, done);
            },
            noCache: true,
            minChars: 2,
            onSelect: (suggestion) => {
                self[propertyName] = suggestion.data;
                if (self[opposite]) {
                    $(searchElement).prop("disabled", false);
                }
            }
        });
    },
    // datepicker, takes element, where we should render datepicker,
    // context, property that should store datepicker data
    initDatepicker(elementName, self, propertyName) {
        $(elementName).datepicker({
            autoclose: true,
            todayHighlight: true,
            format: "dd/mm/yyyy",
            startDate: self[propertyName]
        }).on("changeDate", () => {
            self[propertyName] = $(elementName).datepicker("getDate");
        });
        $(elementName).datepicker("setDate", new Date());
    },
    // table with results render function,
    // takes content from backend API and element, in which content
    // should be appended
    renderResultTable(content, element) {
        // th"s and empty table elems
        let tableHeadings = ["Flight number", "From", "To", "Departure", "Arrival", "Airline", "Plane", "Price"];
        let table = $("<table></table>").addClass("table table-striped");
        let tableHead = $("<thead></thead>");
        let tableBody= $("<tbody></tbody>");
        let row = $("<tr></tr>");
        // filling thead row here
        for(let i = 0, len = tableHeadings.length; i < len; i++) {
            row.append($("<th></th>").text(tableHeadings[i]));
        }
        tableHead.append(row);
        table.append(tableHead);
        let sortedContent = content.sort(this.sortByPrices);
        // appending tbody content
        for(let i= 0, len = sortedContent.length; i < len; i++) {
            let row = $("<tr></tr>");
            for (let prop in sortedContent[i]) {
                row.append($("<td></td>").text(sortedContent[i][prop]));
            }
            tableBody.append(row);
        }
        table.append(tableBody);
        $(element).append(table);
    },
    // tabs, takes element, in which tabs should be appended, selected date from search form,
    // and clickhandler from app.js to make api calls.
    renderTabNavigators(element, date, clickHandler) {
        // date variables
        let today = moment(),
            // this is needed to check if tab date is in the past
            yesterdayStart = today.clone().subtract(1, "days").startOf("day"),
            beforeYesterdayStart = today.clone().subtract(2, "days").startOf("day"),
            selectedDate = moment(date.getTime()),
            // tabs
            tomorrow = moment(selectedDate).add(1, "day"),
            afterTomorrow = moment(selectedDate).add(2, "days"),
            yesterday = moment(selectedDate).subtract(1, "day"),
            beforeYesterday = moment(selectedDate).subtract(2, "days"),
            tabs = [beforeYesterday, yesterday, selectedDate, tomorrow, afterTomorrow];

        let fieldset = $("<fieldset></fieldset>").addClass("search-form-elements");
        let tabsContainer = $("<div></div>").addClass("btn-group btn-group-justified");
        
        for(let i = 0, len = tabs.length; i < len; i++) {
            let tabsWrapper = $("<div></div>").addClass("btn-group");
            let tab = $("<button></button>")
                .addClass("btn btn-default")
                .text(moment(tabs[i]).format("MMMM Do"));
            // if selected date is today, there is no need to enable previous tabs
            // to prevent api calls with error response
            if(tabs[i].isSame(yesterdayStart, "d") || tabs[i].isSame(beforeYesterdayStart, "d")) {
                tab.prop("disabled", true);
            }
            if(tabs[i] === selectedDate) {
                tab.addClass("active");
            }
            tab.click(() => {
                $(".btn.btn-default.active").removeClass("active");
                tab.addClass("active");
                // api call
                clickHandler(tabs[i]);
            });
            tabsWrapper.append(tab);
            tabsContainer.append(tabsWrapper);
        }
        fieldset.append(tabsContainer);
        $(element).append(fieldset);
    }
}
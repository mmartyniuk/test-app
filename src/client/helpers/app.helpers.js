import $ from "jquery";
import "bootstrap-datepicker";
import "devbridge-autocomplete";
import moment from "moment";

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
            format: 'dd/mm/yyyy',
            startDate: self[propertyName]
        }).on("changeDate", function(e) {
            self[propertyName] = $(elementName).datepicker("getDate");
        });
        $(elementName).datepicker("setDate", new Date());
    },
    renderResultTable(content, element) {
        let table = $("<table></table>").addClass("table table-striped");
        let tableHead = $("<thead></thead>");
        let tableBody= $("<tbody></tbody>");
        let row = $("<tr></tr>");
        row.append($("<th></th>").text('Flight number'));
        row.append($("<th></th>").text('From'));
        row.append($("<th></th>").text('To'));
        row.append($("<th></th>").text('Departure'));
        row.append($("<th></th>").text('Arrival'));
        row.append($("<th></th>").text('Airline'));
        row.append($("<th></th>").text('Plane'));
        row.append($("<th></th>").text('Price'));
        tableHead.append(row);
        table.append(tableHead);
        for(let i= 0, len = content.length; i < len; i++) {
            let row = $("<tr></tr>");
            let startTime = content[i].start.dateTime;
            row.append($("<td></td>").text(content[i].flightNum));
            row.append($("<td></td>").text(content[i].start.airportName));
            row.append($("<td></td>").text(content[i].finish.airportName));
            row.append($("<td></td>").text(moment(startTime).format('llll')));
            row.append($("<td></td>").text(moment(startTime).add(content[i].durationMin).format('llll')));
            row.append($("<td></td>").text(content[i].airline.name));
            row.append($("<td></td>").text(content[i].plane.shortName));
            row.append($("<td></td>").text(content[i].price + '$'));
            tableBody.append(row);
        }
        table.append(tableBody);
        $(element).append(table);
    }
}
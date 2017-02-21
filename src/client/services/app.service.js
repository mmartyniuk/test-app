import * as $ from "jquery";
import moment from "moment";
// service to handle api calls to local backend API
export default {
    getAirports: (query) => {
        return $.ajax({
            url: "/airports",
            data: {
                q: query
            }
        });
    },
    search: (from, to, date) => {
        return $.ajax({
            url: "/search",
            data: {
                date: moment(date).format("YYYY-MM-DD"),
                from: from,
                to: to
            }
        });
    }
}
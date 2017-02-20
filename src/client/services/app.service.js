import * as $ from "jquery";

export default {
    getAirports: (query) => {
        return $.ajax({
            url: "/airports",
            data: {
                q: query
            }
        })
    },
    search: (from, to, date) => {
        return $.ajax({
            url: "/search",
            data: {
                date: date,
                from: from,
                to: to
            }
        })
    }
}
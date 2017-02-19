import * as $ from "jquery";

export default {
    // ajax example for now
    airlines: () => {
        $.ajax({
            url: "/airlines"
        }).done((response) => {
            console.log(response);
        });
    }
}
import moment from "moment";

export default {
    getUtcTime: (time) => {
        let startTimeMoment = moment(time, "YYYY/MM/DD HH:mm");
        return [
            startTimeMoment.format("YYYY"),
            startTimeMoment.format("M")-1,
            startTimeMoment.format("D"),
            startTimeMoment.format("HH"),
            startTimeMoment.format("mm")
        ];
    }
}
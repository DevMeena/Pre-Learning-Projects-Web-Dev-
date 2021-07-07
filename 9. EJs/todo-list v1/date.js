// Extra junk code for day generation

module.exports = getDay; // dont use parantheses ( we are not calling but just binding it )

function dateDay() {
    const today = new Date();

var options = {
    weekday: "long",
    day: "numeric",
    month: "long"
};

let day = today.toLocaleDateString("en-US",options);

return day;

}
class galleryConstructor{
    constructor(){
        this.ID = "";
        this.Type = "";
        this.Path = ""
    };
};

class disabledDatesContructor{
    constructor(){
        this.ID = [];
        this.Date = [];
        this.IsRange = [];
        this.MinDate = "";
    };
};

let gallery = new galleryConstructor;
let disabledDates = new disabledDatesContructor


module.exports = {
    galleryConstructor,
    disabledDatesContructor,
    gallery,
    disabledDates
}
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

class flavoursConstructor{
    constructor(){
        this.ID = [];
        this.Heading = [];
        this.Type = [];
        this.Text = [];
        this.Flavours = [];
    }
}

let gallery = new galleryConstructor;
let disabledDates = new disabledDatesContructor;
let flavours = new flavoursConstructor;


module.exports = {
    galleryConstructor,
    disabledDatesContructor,
    flavoursConstructor,
    flavours,
    gallery,
    disabledDates
}
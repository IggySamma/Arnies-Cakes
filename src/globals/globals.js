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
let publicGallery = "/usr/src/app/src/public/gallery/" //Docker
let devGallery = "./public/gallery/"

module.exports = {
	galleryConstructor,
	disabledDatesContructor,
	flavoursConstructor,
	flavours,
	gallery,
	disabledDates,
	publicGallery,
	devGallery
}
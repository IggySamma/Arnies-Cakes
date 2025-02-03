const serverConfig = require('../config/config.js');

/*------------------------------- Gallery functions ----------------------------*/

/*------------------------------- MySql  ----------------------------*/
/*
function insertNewToGallery(newType, newPath) {
    let newImage = [
        Type = newType,
        Path = newPath,
    ];
    serverConfig.connection.query('INSERT INTO Gallery(Type, Path) Values(?, ?);', newImage,(error, res, fields) => {
        if (error) throw error;
     });
}

function deleteFromGalleryByID(data, res){
    serverConfig.connection.query('DELETE FROM Gallery WHERE ID= ?;', data.ID ,(error, result) => {
        if(result === undefined){
            res.json(new Error("Error rows is undefined"));
        }else{
            res.sendStatus(200);
    }})
}
*/

/*------------------------------- MySql2  ----------------------------*/

function insertNewToGallery(newType, newPath) {
    let newImage = [
        Type = newType,
        Path = newPath,
    ];

   serverConfig.connection.execute(
        'INSERT INTO Gallery(Type, Path) Values(?, ?);', 
        [newImage],
        function (err, results) {
            if (err) {
                console.log(err);
            }
        }
   );
}

function deleteFromGalleryByID(data, res){
    serverConfig.connection.execute(
        'DELETE FROM Gallery WHERE ID= ?;', 
        [data.ID],
        function (err, results) {
            if (err) {
                console.log(err);
                res.json(new Error(err));
            } else {
                res.sendStatus(200);
            }
        }
    );
}


/*------------------------------- Enquires ------------------------------------*/

/*--------------------------- Main Page Retrieve --------------------- */
/*------------------------------- MySql  ----------------------------*/
/*
function getEnquiresMainHeaders(req, res){
    serverConfig.connection.query('SELECT * FROM mainHeaders;', (error, result) => {
        if (error) { 
            throw error; 
        } else {
            var obj = JSON.parse(JSON.stringify(result));
            res.json(obj);
        }
    })
}

function getEnquiresSubHHeaders(req, res){
    serverConfig.connection.query('SELECT * FROM subHeaders;', (error, result) => {
        if (error) { 
            throw error; 
        } else {
            var obj = JSON.parse(JSON.stringify(result));
            res.json(obj);
        }
    })
}
*/

/*------------------------------- MySql2  ----------------------------*/

function getEnquiresMainHeaders(req, res){
   serverConfig.connection.execute(
        'SELECT * FROM mainHeaders;',
        function (err, results) {
            if (err) {
                console.log(err);
                res.json(new Error(err));
            } else {
                var obj = JSON.parse(JSON.stringify(results));
                res.json(obj);
            }
        }
   );
}

function getEnquiresSubHHeaders(req, res){
    serverConfig.connection.execute(
        'SELECT * FROM subHeaders;',
        function (err, results) {
            if (err) {
                console.log(err);
                res.json(new Error(err));
            } else {
                var obj = JSON.parse(JSON.stringify(results));
                res.json(obj);
            }
        }
    );
}

/*--------------------------- Calender functions --------------------- */
/*------------------------------- MySql ----------------------------*/
/*function insertDisabledDate(req, res, Date, isRange){
    let updateData = [
        nDate = Date,
        nIsRange = isRange,
    ]
    serverConfig.connection.query('insert into disabledDates (Date, IsRange) values (?, ?);', updateData, (error, result) => {
        if (error) { 
            throw error; 
        } else {
            var obj = JSON.parse(JSON.stringify(result));
            res.json(obj);
        }
    })
}

function deleteDisabledDate(req, res, ID){
    serverConfig.connection.query('delete from disabledDates where ID=;', ID, (error, result) => {
        if (error) { 
            throw error; 
        } else {
            var obj = JSON.parse(JSON.stringify(result));
            res.json(obj);
        }
    })
}
*/

/*------------------------------- MySql2 ----------------------------*/

function insertDisabledDate(req, res, Date, isRange){
    let updateData = [
        nDate = Date,
        nIsRange = isRange,
    ]

    serverConfig.connection.execute(
        'insert into disabledDates (Date, IsRange) values (?, ?);',
        [updateData],
        function (err, results) {
            if (err) {
                console.log(err);
                res.json(new Error(err));
            } else {
                var obj = JSON.parse(JSON.stringify(results));
                res.json(obj);
            }
        }
    );
}

function deleteDisabledDate(req, res, ID){
    serverConfig.connection.execute(
        'delete from disabledDates where ID=;',
        [ID],
        function (err, results) {
            if (err) {
                console.log(err);
                res.json(new Error(err));
            } else {
                var obj = JSON.parse(JSON.stringify(results));
                res.json(obj);
            }
        }
    );
}

/*--------------------------- Enquire functions --------------------- */

/*------------------------------- MySql ----------------------------*/
/*
function storeNewEnquire(res, cb){
    return new Promise((resolve, reject) => {
        let storeLink = [
            date = "",
            Confirmed = "No",
            Link = "",
            Completed = "No",
        ]
        serverConfig.connection.query('INSERT INTO enquires(Date, Confirmed, Link, Completed) Values(?, ?, ?, ?);', storeLink, (error, result) => {
            if (error) { 
                console.log(error);
                res.sendStatus(500); 
            }
            resolve(cb())
        })
    })
}


function storeEnquireLink(newDate, newLink, nID, res){
    let storeLink = [
        date = newDate,
        Link = newLink,
        ID = nID,
    ]
    serverConfig.connection.query('UPDATE enquires SET date = ?, Link = ? WHERE ID = ?;', storeLink, (error, result) => {
        if (error) { 
            console.log(error);
            res.sendStatus(500); 
        }
        res.sendStatus(200);
    })
}

function getAllEnquires(){
    return new Promise((resolve, reject) => {
        serverConfig.connection.query('SELECT * FROM enquires;', (error, result) => {
            if (error) { 
                reject(error)
                return
            } else {
                resolve(JSON.parse(JSON.stringify(result)))
            }
        })
    })
}

function updateEnquiresConfirmed(req, res, ID, Date, Confirmed){
    let updateData = [
        ndate = Date,
        nConfirmed = Confirmed,
        nID = ID,
    ]
    serverConfig.connection.query('UPDATE enquires SET Date = ?, Confirmed = ? WHERE ID = ?;', updateData, (error, result) => {
        if (error) { 
            throw error; 
        } else {
            var obj = JSON.parse(JSON.stringify(result));
            res.json(obj);
        }
    })
}

function removeEnquire(req, res, ID){
    serverConfig.connection.query('delete from mainHeaders where ID=;', ID, (error, result) => {
        if (error) { 
            throw error; 
        } else {
            var obj = JSON.parse(JSON.stringify(result));
            res.json(obj);
        }
    })
}*/

/*------------------------------- MySql2 ----------------------------*/

/*fix me*/
function storeNewEnquire(res, cb){
    return new Promise((resolve, reject) => {
        let storeLink = [
            date = "",
            Confirmed = "No",
            Link = "",
            Completed = "No",
        ]

        serverConfig.connection.execute(
            'INSERT INTO enquires(Date, Confirmed, Link, Completed) Values(?, ?, ?, ?);',
            [storelink],
            function (err) {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                } else {
                    resolve(cb())
                }
            }
        );
    })
}


function storeEnquireLink(newDate, newLink, nID, res){
    let storeLink = [
        date = newDate,
        Link = newLink,
        ID = nID,
    ]

    serverConfig.connection.execute(
        'UPDATE enquires SET date = ?, Link = ? WHERE ID = ?;', 
        [storeLink],
        function (err, results) {
            if (err) {
                console.log(err);
                res.json(new Error(err));
            } else {
                res.sendStatus(200);
            }
        }
    );
}

function getAllEnquires(){
    return new Promise((resolve, reject) => {
        try {
            const [results] = serverConfig.connection.execute(
                'SELECT * FROM enquires;'
            );
            resolve(JSON.parse(JSON.stringify(results)))
        } catch (err) {
            reject(err)
        }
    })
}

function updateEnquiresConfirmed(req, res, ID, Date, Confirmed){
    let updateData = [
        ndate = Date,
        nConfirmed = Confirmed,
        nID = ID,
    ]

    serverConfig.connection.execute(
        'UPDATE enquires SET Date = ?, Confirmed = ? WHERE ID = ?;', 
        [updateData],
        function (err, results) {
            if (err) {
                console.log(err);
                res.json(new Error(err));
            } else {
                var obj = JSON.parse(JSON.stringify(results));
                res.json(obj);
            }
        }
    );
}

function removeEnquire(req, res, ID){
    serverConfig.connection.execute(
        'delete from mainHeaders where ID=;'
        [ID],
        function (err, results) {
            if (err) {
                console.log(err);
                res.json(new Error(err));
            } else {
                var obj = JSON.parse(JSON.stringify(results));
                res.json(obj);
            }
        }
    );
}

module.exports = {
    getEnquiresMainHeaders,
    getEnquiresSubHHeaders,
    insertNewToGallery,
    deleteFromGalleryByID,
    storeEnquireLink,
    updateEnquiresConfirmed,
    removeEnquire,
    insertDisabledDate,
    deleteDisabledDate,
    getAllEnquires,
    storeNewEnquire
}
const cds = require('@sap/cds')
module.exports = async function (srv) {

    const db = await cds.connect.to('db') // connect to database service
    const { Locations, Sanitizers } = db.entities;        // get reflected definitions

    // Reduce stock of ordered books if available stock suffices
    this.on('getSafetyRooms', async (req) => {

        var res = req._.req.res;
        /*const rooms = await srv.run(SELECT.from(Locations)
            .join(Sanitizers)
            .on({'Locations.LOCATIONID':{'=': Sanitizers.LOCATIONID}}));*/
        const rooms = await cds.run(cds.parse.cql(`Select * from COVID19_SAP_LOCATIONS inner join COVID19_SAP_SANITIZERS on COVID19_SAP_LOCATIONS.LocationID=COVID19_SAP_SANITIZERS.LocationID order by CREATEDAT DESC`));
        const events = await cds.run(cds.parse.cql(`Select * from COVID19_SAP_EVENTS as E inner join COVID19_SAP_TAGS as T on E.DEVICEID=T.DEVICEID inner join COVID19_SAP_LOCATIONS as L on T.LOCATIONID=L.LOCATIONID order by CREATEDAT DESC`));
        // new Date(new Date(new Date().toDateString()).getTime() + parseInt("14") * 3600000 + (330 * 60000)).toISOString()

        console.log(rooms.length, events.length);
        var result_rooms = [];
        rooms.forEach((hash => a => {
            if (!hash[a.LOCATIONID]) {
                hash[a.LOCATIONID] = { LOCATIONID: a.LOCATIONID, LOCATIONNAME: "", CAPACITY: 0, LOCATIONTYPE: "", SANITIZEDAT: new Date(15) };
                result_rooms.push(hash[a.LOCATIONID]);
            }
            hash[a.LOCATIONID].LOCATIONNAME = a.LOCATIONNAME;
            hash[a.LOCATIONID].CAPACITY = a.CAPACITY;
            hash[a.LOCATIONID].LOCATIONTYPE = a.LOCATIONTYPE;
            hash[a.LOCATIONID].SANITIZEDAT = new Date(Math.max(new Date(hash[a.LOCATIONID].SANITIZEDAT), new Date(a.CREATEDAT)));

        })(Object.create(null)));

        // console.log(result_rooms);


        var result_events = [];

        events.forEach((hash => a => {
            if (!hash[a.LOCATIONID]) {
                hash[a.LOCATIONID] = { LOCATIONID: a.LOCATIONID, LOCATIONNAME: "", DISTANCE: 0, LOCATIONTYPE: "", USEDAT: new Date(15), CAPACITY: 0, DEVICEID: "" };
                result_events.push(hash[a.LOCATIONID]);
            }
            hash[a.LOCATIONID].LOCATIONNAME = a.LOCATIONNAME;
            hash[a.LOCATIONID].DISTANCE = a.DISTANCE;
            hash[a.LOCATIONID].CAPACITY = a.CAPACITY;
            hash[a.LOCATIONID].DEVICEID = a.DEVICEID;
            hash[a.LOCATIONID].LOCATIONTYPE = a.LOCATIONTYPE;
            hash[a.LOCATIONID].USEDAT = new Date(Math.max(new Date(hash[a.LOCATIONID].USEDAT), new Date(a.CREATEDAT)));

        })(Object.create(null)));

        // console.log(result_events);
        console.log(req.data)
        var msg = (req.data.value == -1) ? "" : "At " + req.data.value;
        console.log(msg)
        var comparisons = [],

            w = {};
        result_events.forEach((a) => {
            w = result_rooms.filter((b) => {
                return (
                    a.LOCATIONID == b.LOCATIONID && new Date(a.USEDAT) < new Date(b.SANITIZEDAT)
                );
            })[0];
            // console.log(w);
            if (w) {
                // console.log(w);
                comparisons.push(w);
            }
        });

        var used_rooms = [];
        w = {};
        result_rooms.forEach((a) => {
            a.COUNT = 0;
            w = result_events.forEach((b) => {
                if (a.LOCATIONID == b.LOCATIONID && new Date(a.SANITIZEDAT) < new Date(b.USEDAT)) {
                    a.COUNT++;
                }
                a.USAGE = a.COUNT / a.CAPACITY;
            });

        });
        // console.log(result_rooms);
        result_rooms.sort(function (a, b) { return a.USAGE - b.USAGE });
        // console.log(result_rooms);
        comparisons.sort(function (a, b) { return new Date(b.SANITIZEDAT) - new Date(a.SANITIZEDAT) });
        // console.log(comparisons);
        if (comparisons.length < 1) {
            // res.send({ Msg: result_rooms[0].LOCATIONNAME + " is Safest" });
            res.send({ Msg: "As per the last sanitization and utlization details, meeting room " + result_rooms[0].LOCATIONNAME + " is free to use." + msg });
        }
        else {
            // res.send({ Msg: comparisons[0].LOCATIONNAME + " is Available" });
            res.send({ Msg: "As per the last sanitization and utlization details, meeting room " + comparisons[0].LOCATIONNAME + " is free to use." + msg });

        }


    });
    this.on('getLastSanitized', async (req) => {
        console.log(req.data)
        var room = req.data.value;
        var res = req._.req.res;
        const rooms = await cds.run(cds.parse.cql(`Select * from COVID19_SAP_LOCATIONS inner join COVID19_SAP_SANITIZERS on COVID19_SAP_LOCATIONS.LocationID=COVID19_SAP_SANITIZERS.LocationID WHERE LCASE(COVID19_SAP_LOCATIONS.LOCATIONNAME)=LCASE('${room}') order by CREATEDAT DESC LIMIT 1`));
        console.log(rooms);
        if (rooms.length < 1) {
            res.send({ Msg: "Enter a valid " + req.data.type + " ID" });
        }
        else {
            res.send({ Msg: req.data.type + " was last Sanitized at " + new Date(rooms[0].CREATEDAT).toLocaleTimeString() });
        }
    });
    this.on('usageCount', async (req) => {
        console.log(req.data)
        var room = req.data.value,
            date = new Date(req.data.date.split("T")[0]).toISOString();
        // date=req.data.date;
        console.log(room, date);
        var res = req._.req.res;
        const rooms = await cds.run(cds.parse.cql(`Select Count(*) as Count from COVID19_SAP_EVENTS as E inner join COVID19_SAP_TAGS as T on E.DEVICEID=T.DEVICEID inner join COVID19_SAP_LOCATIONS as L on T.LOCATIONID=L.LOCATIONID where LCASE(L.LOCATIONNAME)=LCASE('${room}') and E.CREATEDAT>'${date}'`));
        console.log(rooms)
        if (rooms[0].Count < 1) {
            res.send({ Msg: room + " not Used Today" });
        }
        res.send({ Msg: req.data.type + " is used " + rooms[0].Count + " time(s)" });
    });
    this.on('getEvents', async (req) => {
        var res = req._.req.res;
        var date = req.data.date;
        var users = ["I327885", "I326821", "I326212", "I059360", "I326961"];
        // const events = await cds.run(cds.parse.cql(`Select * from (Select E.*,L.* from COVID19_SAP_EVENTS as E inner join COVID19_SAP_TAGS as T on E.DEVICEID=T.DEVICEID right outer join COVID19_SAP_LOCATIONS as L on T.LOCATIONID=L.LOCATIONID where TO_DATE(E.CREATEDAT)=TO_DATE('${date}')) S right outer join COVID19_SAP_LOCATIONS as SL on S.LOCATIONID=SL.LOCATIONID`));
        const events = await cds.run(cds.parse.cql(`Select * from (Select E.DEVICEID,E.DISTANCE,E.CREATEDAT,E.EMPID as USER,L.LOCATIONID,L.LOCATIONNAME,L.LOCATIONTYPE,L.CAPACITY from COVID19_SAP_EVENTS as E inner join COVID19_SAP_TAGS as T on E.DEVICEID=T.DEVICEID right outer join COVID19_SAP_LOCATIONS as L on T.LOCATIONID=L.LOCATIONID where TO_DATE(E.CREATEDAT)=TO_DATE('${date}')) S right outer join COVID19_SAP_LOCATIONS as SL on S.LOCATIONID=SL.LOCATIONID`));
        // events.map(x => { x.USER = users[Math.floor(Math.random() * 5)]; });
        var occupied = events.filter(x => { return x.DEVICEID != null; });
        var unused = events.filter(x => { return x.DEVICEID == null; });
        unused.map(x => { x.USED = 0 });
        console.log(occupied.length);
        var result_events = [];

        occupied.forEach((hash => a => {
            if (!hash[a.LOCATIONID]) {
                hash[a.LOCATIONID] = { LOCATIONID: a.LOCATIONID, LOCATIONNAME: "", DISTANCE: "", LOCATIONTYPE: "", CAPACITY: 0, DEVICEID: "", USED: 0, USERS: [] };
                result_events.push(hash[a.LOCATIONID]);
            }
            hash[a.LOCATIONID].LOCATIONNAME = a.LOCATIONNAME;
            hash[a.LOCATIONID].DISTANCE = a.DISTANCE || hash[a.LOCATIONID].DISTANCE;
            hash[a.LOCATIONID].CAPACITY = a.CAPACITY;
            hash[a.LOCATIONID].DEVICEID = a.DEVICEID;
            hash[a.LOCATIONID].LOCATIONTYPE = a.LOCATIONTYPE;
            if (!(hash[a.LOCATIONID].USERS.includes(a.USER))) { hash[a.LOCATIONID].USERS.push(a.USER); hash[a.LOCATIONID].USED++ }

        })(Object.create(null)));
        var unused_new = [];
        unused.forEach((x) => {
            unused_new.push({
                "LOCATIONID": x.LOCATIONID,
                "LOCATIONNAME": x.LOCATIONNAME,
                "DISTANCE": "",
                "LOCATIONTYPE": x.LOCATIONTYPE,
                "CAPACITY": x.CAPACITY,
                "DEVICEID": x.DEVICEID,
                "USED": 0,
                "USERS": [
                    
                ]
            });
        });
        res.send({ results: result_events.concat(unused) });
        // res.send([...result_events, ...unused]);
    });

}
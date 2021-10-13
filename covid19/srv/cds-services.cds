using {covid19.sap as my} from '../db/schema';

service CV19Service {
    entity Devices         as projection on my.Devices;
    entity Tags            as projection on my.Tags;
    entity Events          as projection on my.Events;
    entity Locations       as projection on my.Locations;
    entity Sanitizers      as projection on my.Sanitizers;
    entity Users           as projection on my.Users;
    entity SeatAssignments as projection on my.SeatAssignments;
    entity SafetyRooms     as projection on my.Sanitizers;
    action getSafetyRooms(value:String,);
    action getLastSanitized(type:String ,value : String);
    action usageCount(type:String,value:String, date:DateTime);
    action getEvents(date:DateTime);

}

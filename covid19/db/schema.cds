namespace covid19.sap;


entity Devices {

    key DeviceID    : String;
        DeviceType  : String;
        Description : String;
        OwnedBy     : String;
        Capacity    : Integer;
        Major       : String;
        Minor       : String;

}


entity Tags {


    key DeviceID   : String;
    key LocationID : String;


}


entity Events {


    key DeviceID  : String;
        Distance  : Decimal(10, 2);
    key CreatedAt : DateTime;
        EMPID     : String;


}


entity Locations {


    key LocationID   : UUID;
        LocationName : String;
        LocationType : String;
        Capacity     : Integer;


}


entity Sanitizers {


    key SanitizerID : UUID;
        LocationID  : String;
        Comment     : String;
        CreatedAt   : DateTime;


}


entity Users {


    key EMPID          : String;
        FirstName      : String;
        LastName       : String;
        EmailID        : String;
        MobileNo       : String;
        ManagerEmailID : String;


}


entity SeatAssignments {


    key ID             : UUID;
        EMPID          : String;
        ManagerEmailID : String;
        LocationID     : String;
        StartDate      : DateTime;
        EndDate        : DateTime;
        CreatedAt      : DateTime;


}

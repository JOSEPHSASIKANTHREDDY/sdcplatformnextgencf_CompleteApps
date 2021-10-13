using { Currency, managed, sap } from '@sap/cds/common';
namespace my.social;
 
entity Enrollments{
key ID : UUID;
user_id :String(50);
email_id: String(50);
subject:String(5000);
mobile_number:String(50);
social_channel:String(20);
from_date:Date;
end_date:Date;
status :Boolean;
 
}
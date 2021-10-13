namespace com.social;

entity Enrollments{
key ID : UUID;
user_id :String(50);
email_id: String(50);
subject:String(5000);
mobile_number:String(50);
social_channel:String(20);
from_date:Date @cds.valid.from;
end_date:Date @cds.valid.to;
status :Boolean;
 
}
using {my.social as social} from '../db/schema';

service CatalogService @(path : '/srv') {
     entity Enrollments as projection on social.Enrollments;
     action websocketposting(id:String,from:String,to:String,body:String,type:String,received_at:String);    
};
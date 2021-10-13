using com.social as my from '../db/data-model';

service CatalogService {
    entity Enrollments as projection on my.Enrollments;
}
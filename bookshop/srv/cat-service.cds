using {sap.capire.bookshop as my} from '../db/schema';

service CatalogService @(path : '/browse') {

    entity Books as select from my.Books;

    entity Orders as projection on my.Orders;
}

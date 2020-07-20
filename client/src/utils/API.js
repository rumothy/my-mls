import axios from "axios";

// The getRecipes method retrieves recipes from the server
// It accepts a "query" or term to search the recipe api for
export default {
  getRecipes: function(query) {
    return axios.get("/api/recipes", { params: { q: query } });
  },

  getProperties: function(query){
    return axios.get("/api/properties", { params: { q: query } })  
  },
};

/*
class Query {
  City: string;
  Price: string?; // If price is set order by price
  Beds: String?; // If beds is set order by beds
  // If both are set order by price then beds
} ???

class ByPriceQuery : Query {
  Orderby
}

*/
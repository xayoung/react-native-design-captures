"use strict";

var API_URL = "https://api.dribbble.com/v1/",
    ACCESS_TOKEN = "682980c8af77de282f59ac36673dbb8af7bb588e7798654fd308e9d84276b5c1";

function fetchData(URL) {
  return fetch(URL, {
    headers: {
      "Authorization": "Bearer " + ACCESS_TOKEN
    }
  }).then((response) => response.json())
}

module.exports = {
  getShotsByType(type, pageNumber){
    var URL = API_URL + "shots/?list=" + type;
    if (pageNumber) {
      URL += "&per_page=10&page=" + pageNumber;
    }
    console.log(URL);
    return fetchData(URL);
  },

  getResources(url){
    return fetchData(url);
  }

};

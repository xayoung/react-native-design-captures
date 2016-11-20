"use strict";

var Dribbble_API_URL = "https://api.dribbble.com/v1/",
    Dribbble_ACCESS_TOKEN = "682980c8af77de282f59ac36673dbb8af7bb588e7798654fd308e9d84276b5c1",
    Behance_API_URL = "http://www.behance.net/v2/projects",
    Behance_ACCESS_TOKEN = "ZQCdTvMMZC7ZEj7zuJ7ojCH9dAs1Soi1";

function fetchDribbbleData(URL) {
  return fetch(URL, {
    headers: {
      "Authorization": "Bearer " + Dribbble_ACCESS_TOKEN
    }
  }).then((response) => response.json())
}

function fetchBehanceData(URL) {
  return fetch(URL, {
    headers: {

    }
  }).then((response) => response.json())
}

module.exports = {
  getShotsByType(type, pageNumber){
    var URL = Dribbble_API_URL + "shots/?list=" + type;
    if (pageNumber) {
      URL += "&per_page=8&page=" + pageNumber;
    }
    console.log(URL);
    return fetchDribbbleData(URL);
  },

  getResources(url){
    console.log(url)
    return fetchDribbbleData(url);
  },

  getBehanceProjectsByType(fields, pageNumber){
    var URL = Behance_API_URL + "?client_id=" + Behance_ACCESS_TOKEN;
    if (pageNumber) {
      URL += "&page=" + pageNumber;
    }
    if (fields) {
      URL += "&field=" + fields;
    }

    return fetchBehanceData(URL);
  },

  getBehanceProjectResources(id){
    var URL = Behance_API_URL + "/" + id + "?client_id=" + Behance_ACCESS_TOKEN;
    console.log(URL)
    return fetchBehanceData(URL);
  },

};

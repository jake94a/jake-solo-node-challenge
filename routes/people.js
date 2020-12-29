var express = require("express");
var router = express.Router();
var axios = require("axios");

const apiUrl = "https://swapi.dev/api/people/";

// check if response has a next page url
// if so, axios.get it
const getAllResults = async (res) => {
  const count = res.data.count;

  // get initial results
  const response = res.data.results;

  // get next responses
  // while 'next' is not null, get the next page of results
  while (res.data.next) {
    const nextResponse = await axios.get(res.data.next);
    nextResponse.data.results.map((item) => response.push(item));
    res = await axios.get(res.data.next);
  }

  return response;
};

/* GET users listing. */
router.get("/", function (req, res, next) {
  const fetchData = async () => {
    try {
      const response = await axios.get(apiUrl);
      const results = await getAllResults(response);

      // if there is data, display it
      if (response.data) {
        res.send(results);
      } else {
        res.send({ message: "no results" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  fetchData();
});

module.exports = router;

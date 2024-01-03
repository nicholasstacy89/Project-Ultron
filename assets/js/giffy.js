"use strict";

///////////////////////////////////////////////////////////////////////////////
//                              Global Variables                             //
///////////////////////////////////////////////////////////////////////////////

// DOM elements
const searchBtnEl = document.querySelector("#search-btn");
const nameInputEl = document.querySelector("#superhero-name");
const resultsDivEl = document.querySelector("#results");
const savedDivEl = document.querySelector("#saved-giffy");

// global for convenience in storing and retrieval
let superheroName = "";
let savedSearches = [];
let giffyResults = [];

///////////////////////////////////////////////////////////////////////////////
//                           Function Declarations                           //
///////////////////////////////////////////////////////////////////////////////

// calback function for search events (clicking button, hitting enter)
// function gets name from the input and calls the fetch function
function startSearch() {
  superheroName = nameInputEl.value;

  // check for blank input first
  if (superheroName == "") {
    // TODO: replace alert window with something better
    // (remember alerts not allowed in final product)
    alert("Please input a name!")
  } else {
    // retrieve the giffys and blank the input
    getGiffy(superheroName);
    nameInputEl.value = "";
  }
}

// function to fetch the giffys and display them, allowing for user to choose
// input is the superhero name, normally obtained from the input form
// function uses a named callback function to alter the DOM
// would be nice if re-doing the search would not return the same images
// maybe retrieve (say) 24 results, show them 6 at a time, and be able to look
// at others. Or use an image carousel (code for that is not hard to find)
function getGiffy(name) {
  let giphyAPIkey = "V8zVuDYLK9YXnITSBHQrcoevS2oMCdUY";
  let trendingURL = "https://api.giphy.com/v1/gifs/trending";
  let giphyURL = "https://api.giphy.com/v1/gifs/search"
  let URL = "";
  let trendingGIF = false;  // use trending endpoint?

  // construct fetch URL; retrieve data on 6 images
  if (trendingGIF) {
    URL = trendingURL + "?api_key=" + giphyAPIkey + "&q=" + name + "&limit=6";
  } else {
    URL = giphyURL + "?api_key=" + giphyAPIkey + "&q=" + name + "&limit=6";
  }

  fetch(URL)
    .then(response => response.json())
    .then(displayGiffy)
    .catch(e => console.log(e.message));
}

// callback function for getGiffy
// input is an object or an object array containing superheroine name,
// giffy URL, and possibly a giffy ID of some kind
function displayGiffy(obj) {
  giffyResults = [];

  // let's retrieve some info from the json object
  // API info: https://developers.giphy.com/docs/api/schema#gif-object
  // I figure the small-still image for the "saved" section
  for (let i = 0; i < obj.data.length; i++) {
    giffyResults[i] = {id: obj.data[i].id,
                       name: superheroName,
                       image_title: obj.data[i].title,
                       image_orig: obj.data[i].images.original.url,
                       image_small_still: obj.data[i].images.fixed_height_small_still.url};
  }

  // display the images in the results division, allow user to choose one
  // will need to set up a listener for the results div
  // set the focus on the first image to allow keyboard navigation (ENTER to select)
  // TAB or ESC to go back to the name input field (ie, to not save)

  for (let i = 0; i < giffyResults.length; i++) {
    let imgEl = document.createElement("img");
    imgEl.src = giffyResults[i].image_orig;
    imgEl.dataset.index = i;  // for identification if selected
    resultsDivEl.appendChild(imgEl);
  }
}

// function accepts an index (for the results object area)
// it displays the small version of the image in the "saved" div
// it also updates local storage with the info
function saveGiffy(index) {

  console.log(giffyResults[index]);

}

// loads data from local storage and sets up the "saved searches" images area
function initDisplay() {

}

///////////////////////////////////////////////////////////////////////////////
//                     Event Listeners and Code Execution                    //
///////////////////////////////////////////////////////////////////////////////

// wait for confirmation that the DOM is ready
document.addEventListener('DOMContentLoaded', () => {

  // Event listeners for superhero name
  searchBtnEl.addEventListener("click", startSearch);
  nameInputEl.addEventListener("keypress", e => {
    if (e.key == "Enter") {
      startSearch();
    }
  });

  // Event listeners to select an image to store
  resultsDivEl.addEventListener("click", e => {
    let index = parseInt(e.target.dataset.index);
    saveGiffy(index);
  });

  // need to initialize the display by loading data from local storage
  // and setting up the saved images
  initDisplay();

  // start with focus on the name field
  nameInputEl.focus();

}, false);  // end DOM ready

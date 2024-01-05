"use strict";

// TODO: Arrows should be invisible or greyed when there are no results
// TODO: Mousover of saved images will display a larger version of the image
//      (or provide some other way to view the enlarged version of the saved image)
// TODO: Double-clicking a saved image will remove it
// TODO: Provide a way to clear all saved images
// TODO: review global variables. Do I really need that many?

///////////////////////////////////////////////////////////////////////////////
//                              Global Variables                             //
///////////////////////////////////////////////////////////////////////////////

// DOM elements
const searchBtnEl = document.querySelector("#search-btn");
const nameInputEl = document.querySelector("#superhero-name");
const resultsDivEl = document.querySelector("#results");
const savedDivEl = document.querySelector("#saved-giffy");
const resultsFiguresEl = document.querySelectorAll("#results figure");
const resultsLeftArrowEl = document.querySelector("#results-left-arrow");
const resultsRightArrowEl = document.querySelector("#results-right-arrow");

// global for convenience in storing and retrieval
let superheroName = "";
let giffyResults = [];
let currentGiffyResultsIndex = 0;
let savedSearches = [];

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

  // construct fetch URL; default retrieves 50 images
  URL = giphyURL + "?api_key=" + giphyAPIkey + "&q=" + name;

  fetch(URL)
    .then(response => response.json())
    .then(json => {
      giffyResults = [];
      // let's retrieve some info from the json object
      // API info: https://developers.giphy.com/docs/api/schema#gif-object
      for (let i = 0; i < json.data.length; i++) {
        giffyResults[i] = {id: json.data[i].id,
                           name: superheroName,
                           image_title: json.data[i].title,
                           image_orig: json.data[i].images.original.url,
                           image_small: json.data[i].images.fixed_height_small.url};
      }


      // shuffle the order so that doing the same search looks new
      giffyResults = shuffle(giffyResults);

      // show the first image
      displayGiffy(0);

    })
    .catch(e => console.log(e.message));
}

// creates images within figure elements, whose visibility is controlled by CSS
// input argument is the index within the results array to display first
function displayGiffy(startIndex) {
  let resultsIndex;  // index into the results array, allowing wrap-around
  //set the first image to the results index
  for (let i = 0; i < resultsFiguresEl.length; i++) {
    // use modulus to wrap around the results array
    // from https://stackoverflow.com/questions/52883995/how-to-loop-through-wrap-around-an-array-based-on-starting-index
    resultsIndex = (startIndex + i) % giffyResults.length;
    // clear any previous results
    resultsFiguresEl[i].innerHTML = "";
    // set image and its caption
    let imgEl = document.createElement("img");
    let captionEl = document.createElement("figcaption");
    imgEl.src = giffyResults[resultsIndex].image_orig;
    imgEl.alt = giffyResults[resultsIndex].image_title;
    captionEl.textContent = giffyResults[resultsIndex].image_title;
    imgEl.dataset.index = resultsIndex;  // for identification if selected
    resultsFiguresEl[i].appendChild(imgEl);
    resultsFiguresEl[i].appendChild(captionEl);
  }
}

// function to shuffle array elements
// taken from SO: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length;
  var randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

// function accepts an index (for the results object area)
// it displays the small version of the image in the "saved" div
// it also updates local storage with the info and clears the results
// (should it do the latter?)
function saveGiffy(index) {
  // add small image to saved results area
  addGiffy(giffyResults[index]);

  // update the saved search array and save to localStorage
  // At some point we may limit the number of saved searches
  savedSearches.push(giffyResults[index]);
  localStorage.setItem("savedSearches", JSON.stringify(savedSearches));
}

// adds giffy panel to saved search area
// use figure element with caption set to superhero name
// will need to change to an inline display
// function called by saveGIffy() and initDisplay()
function addGiffy(giffyObj) {
  let figEl = document.createElement("figure");
  let imgEl = document.createElement("img");
  let captionEl = document.createElement("figcaption");

  // set the visible elements
  imgEl.src = giffyObj.image_small;
  imgEl.alt = giffyObj.image_title;
  captionEl.textContent = giffyObj.name;

  // same name as data attribute for re-launching searches
  imgEl.dataset.name = giffyObj.name;
  captionEl.dataset.name = giffyObj.name;
  figEl.dataset.name = giffyObj.name;

  // create figure and its children image & caption
  let newFigEl = savedDivEl.appendChild(figEl);
  newFigEl.appendChild(imgEl);
  newFigEl.appendChild(captionEl);
}

// loads data from local storage and sets up the "saved searches" images area
function initDisplay() {
  // retrieve array of previous searches from local storage
  savedSearches = JSON.parse(localStorage.getItem("savedSearches"));

  // assuming there are some, set up the giffy panels
  if (savedSearches !== null) {
    for (let i = 0; i < savedSearches.length; i++) {
      addGiffy(savedSearches[i]);
    }
  } else {
    // want it as an empty array not null
    savedSearches = [];
  }
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

  // Event listener to results area. Respond to clicks on images or arrows.
  resultsDivEl.addEventListener("click", e => {
    // if there are no results, get out of here
    if (giffyResults.length===0) {return;}

    if (e.target === resultsLeftArrowEl) {
      // scroll left
      currentGiffyResultsIndex--;
      if (currentGiffyResultsIndex < 0) {
        // set to the final element (wrap around)
        currentGiffyResultsIndex = giffyResults.length-1;
      }
      displayGiffy(currentGiffyResultsIndex);
    } else if (e.target === resultsRightArrowEl) {
      // scroll right
      currentGiffyResultsIndex++;
      if (currentGiffyResultsIndex >= giffyResults.length) {
        // set to the firtst element (wrap around)
        currentGiffyResultsIndex = 0;
      }
      displayGiffy(currentGiffyResultsIndex);
    } else if (e.target.tagName == "IMG") {
      let index = parseInt(e.target.dataset.index);
      saveGiffy(index);
    }
  });

  // Listener for the saved images, clicking will start new search for name
  savedDivEl.addEventListener("click", e => {
    let name = e.target.dataset.name;
    if (name !== "") {
      superheroName = name;
      // launch new search
      getGiffy(superheroName);
    }
  });

  // need to initialize the display by loading data from local storage
  // and setting up the saved images
  initDisplay();

  // start with focus on the name field
  nameInputEl.focus();

}, false);  // end DOM ready

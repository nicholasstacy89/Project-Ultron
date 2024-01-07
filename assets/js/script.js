///////////////////////////////////////////////////////////////////////////////
//                              Global Variables                             //
///////////////////////////////////////////////////////////////////////////////

// DOM elements
var btn = document.getElementById('search');
var showContainer = document.getElementById('list-container');
var listContainer = document.getElementById('name-list');
var input = document.getElementById('supername');  // text input
var superCard = document.getElementById('superCard');

const resultsDivEl = document.querySelector("#results");
const savedDivEl = document.querySelector("#saved-giffy");
const resultsFiguresEl = document.querySelectorAll("#results figure");
const resultsLeftArrowEl = document.querySelector("#results-left-arrow");
const resultsRightArrowEl = document.querySelector("#results-right-arrow");

// global variables for convenience in storing and retrieval

// array of candidate superhero names in autocomplete list
var superList = [];

// below are for Giphy searches/retrieval
let superheroName = "";
let superheroID = "";
let giffyResults = [];
let currentGiffyResultsIndex = 0;
let savedSearches = [];

///////////////////////////////////////////////////////////////////////////////
//                        Functions for Superhero API                        //
///////////////////////////////////////////////////////////////////////////////

// Retrieves data from the superhero API and displays it
// https://www.superheroapi.com for documentation
// Also retrieve gifs from giphy.com and displays a subset
// Input is the (numeric) ID of the superhero character
function getSuperData(superID) {
  fetch('https://www.superheroapi.com/api.php/10163066703485828/'+superID)
    .then(response => response.json())
    .then(data => {
      // create the superhero card
      createSuper(data);
      // cleanup input
      listContainer.style.display = 'none';
      superList = [];
      input.value = '';
      return data;
    })
    .then(data => {
      // return giphy results
      superheroName = data.name;
      superheroID = data.id;
      getGiffy(superheroName);
    })
    .catch( error => console.log(error));
}

// Modifies the DOM to display superhero data in the character card div
// Called by getSuperData()
// Input is the JSON object returned by the superhero API
function createSuper(data) {
  // clear the previous card data
  $('#superCard').empty();

  var superName = data.name;
  var eyes = data.appearance["eye-color"];
  var height = data.appearance.height[0];
  var hair = data.appearance["hair-color"];
  var race = data.appearance.race;
  var superIntelligence = data.powerstats.intelligence;
  var superStrength = data.powerstats.strength;
  var superSpeed = data.powerstats.speed;
  var groupAffiliation = data.connections["group-affiliation"];
  var fullName = data.biography["full-name"];
  var cardName = $('<h1>').html(superName);
  superCard.style.display = 'block';

  var createdSuper = $('<div>').attr('class', 'pop-card');
  $('#superCard').append(createdSuper);
  createdSuper.append(cardName);
  createdSuper.append($('<img>').attr('src', data.image.url));
  createdSuper.append($('<p>').html('Full Name: '+ fullName));
  createdSuper.append($('<p>').html('Group Affiliation: '+ groupAffiliation));
  createdSuper.append($('<p>').text('Height: '+ height));
  createdSuper.append($('<p>').html('Hair: '+ hair));
  createdSuper.append($('<p>').html('Eyes: '+ eyes));
  createdSuper.append($('<p>').html('Race:' + race));
  createdSuper.append($('<p>').html('Intelligence: '+ superIntelligence));
  createdSuper.append($('<p>').html('Strength: '+ superStrength));
  createdSuper.append($('<p>').html('Speed: '+ superSpeed));
}

// gets the value from the text input and returns the superhero API ID
// asynchronous function; called by goBtn() which is triggered by clicking the search button
function getID() {
  var supername = document.getElementById('supername').value;
  fetch('https://www.superheroapi.com/api.php/10163066703485828/search/'+supername)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      usesuperID(data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

// extracts the character ID from the JSON response then gets associated data
// Called by getID(), goBtn(); not used presently I think
function usesuperID(data) {
  var superID = data.results[0].id;
  getSuperData(superID);
}

// callback function for clicking on search button
// Obsolete at this point I think
function goBtn(){
  getID();
  usesuperID();
  getSuperData();
  createSuper();
}

///////////////////////////////////////////////////////////////////////////////
//                        Functions for Giphy API                            //
///////////////////////////////////////////////////////////////////////////////

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
        giffyResults[i] = {giffid: json.data[i].id,
                           superheroID: superheroID,
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
// it also updates local storage with the info
// calls addGiffy to actually change the DOM
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
  imgEl.dataset.id = giffyObj.superheroID;

  // create figure children
  figEl.appendChild(imgEl);
  figEl.append(captionEl)

  // create a span element for the larger image, it can be hidden/revealed in CSS using :hover
  let spanEl = document.createElement("span");
  spanEl.className = "large";
  let largeFigEl = document.createElement("img");
  largeFigEl.src = giffyObj.image_orig;
  largeFigEl.alt = giffyObj.image_title;
  largeFigEl.className = "large-image";

  // line below "turns off" the large image to hide it
  // Ultimately the line should be discarded and CSS used to hide and then show on :hover
  largeFigEl.style.display = "none";
  // another option to hide/show images is with the opacity style attribute (along with position, etc)
  // largeFigEl.style.opacity = "0.5";

  // add it to the page
  spanEl.appendChild(largeFigEl);
  figEl.appendChild(spanEl);

  // create figure and its children
  savedDivEl.appendChild(figEl);
}

// function to clear out all images from the "saved searches" area
function clearSaved() {
    localStorage.removeItem("savedSearches");
    savedSearches = [];
    let savedFiguresEl = document.querySelectorAll("#saved-giffy figure");
    for (let i = 0; i < savedFiguresEl.length; i++) {
      savedFiguresEl[i].remove();
    }
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

  // watch keyboard entries and generate dynamic autocomplete list of superhero names
  // the candidate names are pulled from the superhero API dynamically
  input.addEventListener('keyup', async () => {
    // URL for searching for superhero IDs
    var url = 'https://www.superheroapi.com/api.php/10163066703485828/search/' +input.value;

    // only search if there are 4+ characters
    if (input.value.length <4) {
      listContainer.innerHTML = '';
      return;
    }

    // get (asynchronous) data from the API
    var response = await fetch(url);
    var JsonData = await response.json();

    JsonData.results.forEach(result => {
      // I am not sure why this is here
      if (superList.includes(result.id) === true) {
        return;
      }
      // add ID to the superList array
      superList.push(result.id);
      var superID = result.id;
      var name = result.name;

      // not sure why this is here
      var input = document.getElementById('supername');

      // elements in the autocomplete list, with styling
      var list = document.createElement('li');
      list.style.color = 'black';
      list.style.cursor = 'pointer';
      list.style.overflow = 'auto';
      list.style.textAlign = 'center';
      list.style.margin = '1px';
      list.style.padding = '1px';
      list.style.listStyle = 'none';
      list.style.fontSize = '10px';
      list.style.fontFamily = 'monospace';
      list.style.fontWeight = 'bold';
      list.style.height = '15px';
      list.style.width = 'auto';
      list.style.display = 'block';
      list.style.backgroundColor = 'white';
      list.style.borderRadius = '5px';
      list.id = result.id;
      listContainer.style.display = 'block';
      list.innerHTML = name;
      // add to the DOM to display the list
      listContainer.appendChild(list);

      // clicking on an entry in the list will launch a search
      list.addEventListener('click', () => {
        // start a new search
        // first the superhero info
        getSuperData(superID);
      });
    })}); // end input keyup event listerner

  // Search button click
  btn.addEventListener('click', goBtn);

  // Event listener to results area. Respond to clicks on images or arrows.
  // Clicking arrow scrolls, clicking an image saves that giffy
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
    // need to click on an image
    if (e.target.tagName != "IMG") {
      return;
    }
    // get the name of the superhero from the data attribute
    let name = e.target.dataset.name;
    if (name !== "") {
      superheroName = name;
      superheroID = e.target.dataset.id;
      // launch new search
      getSuperData(superheroID);
    }
  });

  // Listener for the saved images, double-clicking will delete that particular image
  // from the search area
  savedDivEl.addEventListener("dblclick", e => {
    // array of saved (small) images should match savedSearches[] array
    let resultsImgEl = document.querySelectorAll("#saved-giffy figure > img");
    let index = 0;

    // need to click on an image
    if (e.target.tagName != "IMG") {
      return;
    }

    // if there is just one saved search, clear out the area
    if (resultsImgEl.length === 1) {
      clearSaved();
      return
    }

    // get the index in the array
    for (let i = 0; i < resultsImgEl.length; i++) {
      if (savedSearches[i].image_small === e.target.src) {
        index = i;
        break;
      }
    }

    // delete entry from savedSearches[] array in memory
    savedSearches.splice(index, 1);

    // store the updated array in local Storage
    localStorage.setItem("savedSearches", JSON.stringify(savedSearches));

    // clear the image from the saved images area
    resultsImgEl[index].parentElement.remove();
  });


  // Listener for clear-all button, clicking will delete local storage and clear the results area
  document.querySelector("#clear-all").addEventListener("click", clearSaved);

  // need to initialize the display by loading data from local storage
  // and setting up the saved images
  initDisplay();

  // start with focus on the name field
  input.focus();

}, false);  // end DOM ready

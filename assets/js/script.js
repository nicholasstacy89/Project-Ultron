/*
 * Global variables
 */

var btn = document.getElementById('search');
var supername = document.getElementById('supername').value;
var btn = document.getElementById('search');
var giphyAPIkey = 'V8zVuDYLK9YXnITSBHQrcoevS2oMCdUY';

/*
 * Function declarations
 */
function getSuperData(superID) {
    fetch('https://www.superheroapi.com/api.php/10163066703485828/'+superID)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //console.log(data);
            createSuper(data);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function getID() {
    console.log(supername);
    fetch('https://www.superheroapi.com/api.php/10163066703485828/search/'+supername)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //console.log(data);
            usesuperID(data);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function usesuperID(data) {
    console.log(data);
    var superID = data.results[0].id;
    console.log(superID);
    getSuperData(superID);

}

function createSuper(data) {
    var superName = data.name;
    var eyes = data.appearance["eye-color"];
    var height = data.appearance.height[0];
    var hair = data.appearance["hair-color"];
    var race = data.appearance.race;
    var superIntelligence = data.powerstats.intelligence;
    var superStrength = data.powerstats.strength;
    var superSpeed = data.powerstats.speed;
    var appearance = data.appearance;

    console.log('name: '+ superName);
    console.log('height: '+ height);
    console.log('hair: '+ hair);
    console.log('eyes: '+ eyes);
    console.log('race: '+race);
    console.log('intelligence: '+superIntelligence);
    console.log('strenght: '+ superStrength);
    console.log('speed: '+ superSpeed);
}

// Document ready

document.addEventListener('DOMContentLoaded', () => {

    // event listeners
    btn.addEventListener('click', getID);
    btn.addEventListener('click', getSuperData);

    // not sure what this is supposed to do here?
    createSuper();

}, false);  // end DOM ready

// will get super data function to work before moving

// function getGiphyData() {
//     var giphyURL = 'https://api.giphy.com/v1/gifs/search?api_key=' + giphyAPIkey + '&q=' + supername;
//     console.log(giphyURL);
//     fetch(giphyURL)
//         .then(function (response) {
//             return response.json();
//         })
//         .then(function (data) {
//             console.log(data);
//             //giphyIMG(data);
//         })
//         .catch(function (error) {
//             console.log(error);
//         });

// }

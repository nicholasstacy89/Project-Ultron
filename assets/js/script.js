var btn = document.getElementById('search');
var showContainer = document.getElementById('list-container');
var listContainer = document.getElementById('name-list');
var input = document.getElementById('supername');
var superList = []; 
var superCard = document.getElementById('superCard');


function displayName(name) {
    input.value = name;
    removeElements();
}

 removeElements = () => {
   listContainer.innerHTML = '';
 }

input.addEventListener('keyup', async () => {
    var url = 'https://www.superheroapi.com/api.php/10163066703485828/search/' +input.value;
    var response = await fetch(url);
    var JsonData = await response.json();
    if (input.value.length <3) {
        removeElements();
        return;
    }   
    
    if (input.value.length >= 3) {
        console.log(JsonData);
        console.log(url);
        

        JsonData.results.forEach(result => {
        var checkArray = superList.includes(result.id);
        if (checkArray === true) {
            return;
        }
        else (checkArray === false); {
        superList.push(result.id);
        var superID = result.id;
        var name = result.name;
        var input = document.getElementById('supername');
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
        
        
        listContainer.appendChild(list);
        }



        
        list.addEventListener('click', () => getSuperData(superID));
        }
       )}});


    
      
 

    









function getID() {
    var supername = document.getElementById('supername').value;
    console.log(supername);
    fetch('https://www.superheroapi.com/api.php/10163066703485828/search/'+supername)        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            usesuperID(data);
        })
        .catch(function (error) {
            console.log(error);
        });
    
}

function getSuperData(superID) {
    fetch('https://www.superheroapi.com/api.php/10163066703485828/'+superID)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //console.log(data);
            createSuper(data);
            listContainer.style.display = 'none';
            $(input).val('');
        })
        .catch(function (error) {
            console.log(error);
        });
}
function usesuperID(data) {
    //console.log(data);
    var superID = data.results[0].id;
    console.log(superID);
    getSuperData(superID);
    
}
function clearSuperCard() {
    $('#superCard').empty();
}   

function createSuper(data) { 

    
     clearSuperCard();   
    
    var superName = data.name;
    var eyes = data.appearance["eye-color"];
    var height = data.appearance.height[0];
    var hair = data.appearance["hair-color"];
    var race = data.appearance.race;
    var superIntelligence = data.powerstats.intelligence;
    var superStrength = data.powerstats.strength;
    var superSpeed = data.powerstats.speed;
    var cardName = $('<h1>').html(superName);
    superCard.style.display = 'block';
    console.log('name: '+ superName);
    console.log('height: '+ height);
    console.log('hair: '+ hair);
    console.log('eyes: '+ eyes);
    console.log('race: '+race);
    console.log('intelligence: '+superIntelligence);
    console.log('strength: '+ superStrength);
    console.log('speed: '+ superSpeed);
    var createdSuper = $('<div>').attr('class', 'pop-card');
    $('#superCard').append(createdSuper);
    createdSuper.append(cardName);
    createdSuper.append($('<img>').attr('src', data.image.url));
    createdSuper.append($('<p>').text('Height: '+ height));
    createdSuper.append($('<p>').html('Hair: '+ hair));
    createdSuper.append($('<p>').html('Eyes: '+ eyes));
    createdSuper.append($('<p>').html('Race:' + race));
    createdSuper.append($('<p>').html('Intelligence: '+ superIntelligence));
    createdSuper.append($('<p>').html('Strength: '+ superStrength));
    createdSuper.append($('<p>').html('Speed: '+ superSpeed));


    

}
function goBtn(){
    getID();
    usesuperID();
    getSuperData();
    createSuper();
    


}

btn.addEventListener('click', goBtn);


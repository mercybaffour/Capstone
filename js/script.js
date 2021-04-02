/* 1. New Ajax Request to get one TARGET CHEMBLID information.
  2. In callback, parse out responseText.
  3. For the JSON array of objects, have a function that returns objects only with the user-selected target CHEMBLID.
  4. Filter array to only objects with type = "IC50".
  5. To Display Report Card:
5a. Have a function that targets/selects HTML elements and assigns HTML elements to target id object's property values.
6. Retrieving specific bioactivity data
        6a. For each returned object, add a property titled bioactivity_class. This property value will be equal to "active", "inactive", or "intermediary" based on standard value values.
        6b. For each returned object, delete properties that are not molecule_chembl_id, canonical_smiles, standard_value
        6c. Result: each returned object will characterize a drug-like compound with these four properties.
7. Transform returned objects into CSV format.
8. Have a function that allows user to download csv.
*/



//Event Listener on Download CSV Button
function onClickCSV(){
    let button = document.getElementById('csvbutton');
    button.addEventListener('click', fetchData);
}

//Calling sequence of created functions that manipulate data from activity API on click of button.
onClickCSV();

function fetchData(){
    let input = document.getElementById('target');
    let url = "https://www.ebi.ac.uk/chembl/api/data/activity/search.json?limit=100&q=" + input.value;
    return fetch(url)
        .then(response => response.json())
        .catch(err => console.log('failed', err))
}

async function manipulateData(){
    let data = await fetchData();
    console.log(data);
    data.then((array) => {
        console.log(array);
        let activities = array.activities;
        console.log(activities);
        return activities
    });
}

//Filter array with type = "IC50", and return new array with 4 relevant properties.
async function filterArray(){
    let newArr = await manipulateData();
    newArr.then(array => array.filter( (item) => {
        return item.type === "IC50";
    }).map( (item) => {
        return {
            molecule_chembl_id: item.molecule_chembl_id,
            canonical_smiles: item.canonical_smiles,
            standard_value: item.standard_value
        }
    }));
    return newArr;
}

//Add bioactivity_class to array.
async function classifyActivity(){
    let arr = await filterArray();
    for(let i=0; i<arr.length; i++){
        if(arr[i].standard_value >= 10000){
            arr[i].bioactivity_class = "inactive";
        } else if(arr[i].standard_value <= 1000){
            arr[i].bioactivity_class = "active";
        } else {
            arr[i].bioactivity_class = "intermediary";
        }
    }
    return arr;
}

//Display list of molecules with their canonical smiles and link to structures
async function displayStructure(){
    let arr = await classifyActivity();
    let ul = document.createElement('ul');
    ul.style.listStyle = "none";
    let div = document.getElementById('renderList');
    div.appendChild(ul);
    for(let i=0; i<arr.length; i++){
        let molecule = document.createElement('li');
        molecule.textContent = arr[i].molecule_chembl_id
        molecule.style.fontWeight = "bold";
        ul.appendChild(molecule);
        let smiles = document.createElement('li');
        smiles.textContent = arr[i].canonical_smiles
        ul.appendChild(smiles);
        var link = document.createElement('a');
        var linkText = document.createTextNode("3D Structure");
        link.setAttribute('href', "https://chemapps.stolaf.edu/jmol/jmol.php?model=" + smiles.textContent);
        link.appendChild(linkText);
        ul.appendChild(link);
    }
}

//Array of Objects to Array of Arrays
async function toArrayOfArrays(){
    let input = await classifyActivity();
    let output = input.map(function(obj) {
        return Object.keys(obj).sort().map(function(key) {
            return obj[key];
        });
    });
    return output;
}

//Convert to CSV format
async function ConvertToCSV(){
    let arr = await toArrayOfArrays();
    let csvContent = "data:text/csv;charset=utf-8,"
        + arr.map(e => e.join(",")).join("\n");
    return csvContent;
}

async function downloadFile(){
    let dataset = await ConvertToCSV();
    var a = document.createElement('a');
    a.href = 'data:attachment/csv,' +  encodeURIComponent(dataset);
    a.target = '_blank';
    a.download = 'myFile.csv';
    document.body.appendChild(a);
    a.click();
}

downloadFile();

// //Duplicate Deletion
// function deleteDuplicates(largeArray){
//     let stringArray = largeArray.map(JSON.stringify);
//     console.log(stringArray);
//     let uniqueStringArray = new Set(stringArray);
//     console.log(uniqueStringArray);
//     let uniqueArray = Array.from(uniqueStringArray, JSON.parse);
//     console.log(uniqueArray);
//     return uniqueArray;
// }

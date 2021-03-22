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

To Do Checklist
On-click of button, completely run AJAX call and its callback functions. Have another function to have a dynamic URL to reflect user's target ID.
Have another javascript file so that on click of button, AJAX call runs and report card is displayed.
*/

//AJAX Call/Request
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if(xhr.readyState === 4 && xhr.status === 200) {
    let parsed = JSON.parse(this.responseText);
    let activities = parsed.activities;
    console.log(activities);
    let filteredArray = filterArray(activities);
    let jsonObject = classifyActivity(filteredArray);
    console.log(jsonObject);
    let mdArray = toArrayOfArrays(jsonObject);
    console.log(mdArray);
    let content = ConvertToCSV(mdArray);
    console.log(content);

    //Browser prompting user to download CSV file
    var a         = document.createElement('a');
    a.href        = 'data:attachment/csv,' +  encodeURIComponent(content);
    a.target      = '_blank';
    a.download    = 'myFile.csv';

    document.body.appendChild(a);
    a.click();
    }
}

xhr.open("GET", "https://www.ebi.ac.uk/chembl/api/data/activity/search.json?limit=100&q=CHEMBL3927");
xhr.send();

//Filter array with type = "IC50", and return new array with 4 relevant properties.
function filterArray(arr){
    let newArr = arr
    .filter( (item) => {
        return item.type === "IC50";
    }).map( (item) => {
        return {
            molecule_chembl_id: item.molecule_chembl_id,
            canonical_smiles: item.canonical_smiles,
            standard_value: item.standard_value
        }
    });
    return newArr;
}

//Add bioactivity_class to array.
function classifyActivity(arr){
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


//Array of Objects to Array of Arrays
function toArrayOfArrays(input){
    let output = input.map(function(obj) {
        return Object.keys(obj).sort().map(function(key) {
            return obj[key];
        });
    });
    return output;
}

//Convert to CSV format
function ConvertToCSV(arr){
    let csvContent = "data:text/csv;charset=utf-8,"
        + arr.map(e => e.join(",")).join("\n");
    return csvContent;
}

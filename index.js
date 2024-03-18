var baza

const loader = document.getElementById('loader')
const showTable = document.getElementById('data')
const form = document.getElementById('form')
const progBar = document.getElementById('progress')
const noResults = document.getElementById('noresults')
let serwChosenArr = []
let serwChoosen 
let searchData = {}
let singleKeys

// Loading Data Json File 
async function fetchData() {
    try {
      const response = await fetch('./data-baza.json');
      baza = await response.json();
      return baza;
    } catch (error) {
      console.error(`Error fetching data: ${error.message}`);
      return null;
    } finally {
      loader.classList.add("hide")
      console.log('Finished fetching data');
      main()
    }
  }


   fetchData()

   //Core Functionality And Data Formating
function main(){
  const dateTruncate = baza.Serwis.map(el => {
    return el.slice(0,10)
  });
  const lowerSerwisant = baza.Serwisant.map(el => {
    return el.toLowerCase()
  });
  const lowerWydzial = baza.Wydział.map(el => {
    return el.toLowerCase()
  });
  const lowerSymbol = baza.Symbol.map(el => {
    return el.toLowerCase()
  });
  const lowerPunkt = baza.Punkt.map(el => {
    return el.toLowerCase()
  });
  const lowerOpisP = baza["Opis punktu"].map(el => {
    return el.toLowerCase()
  });
  const lowerOpisU = baza["Opis usterki"].map(el => {
    return el.toLowerCase()
  });

  baza.Serwis = dateTruncate
  baza.Serwisant = lowerSerwisant
  baza.Wydział = lowerWydzial
  baza.Symbol = lowerSymbol
  baza.Punkt = lowerPunkt
  baza["Opis punktu"] = lowerOpisP
  baza["Opis usterki"] = lowerOpisU

  // console.log("baza below Serwisant")
  //   console.log(baza.Serwisant)
    

}


form.addEventListener("submit",(e) => {
  e.preventDefault();

  let formData = new Object()

  formData["Serwisant"] = e.target.Serwisant.value 
  formData["Wydział"] = e.target.Wydział.value 
  formData["Symbol"] = e.target.Symbol.value 
  formData["Punkt"] = e.target.Punkt.value 
  formData["Opis punktu"] = e.target.OpisPunktu.value 
  formData["Projekt"] = e.target.Projekt.value 
  formData["Opis usterki"] = e.target.Fraza.value 
  formData.fromDate = e.target.fromDate.value
  formData.toDate = e.target.toDate.value 
// console.log(formData)
progBar.classList.add("show")
search(formData)
})

// Computing Dates Range From Form

function checkRange(from, to){
 
let begin = baza.Serwis.indexOf(`${from}, 00:00`)
let end = baza.Serwis.indexOf(`${to}, 00:00`)


// console.log("begin " + begin)
// console.log("end " + end)
  let sum
  let indArr = []
 

if (from !== ""){
  if (to !== ""){
    sum = end - begin
  }
  sum = baza.Serwis.length - begin

} else {
  to !== "" ? sum = end : sum = baza.Serwis.length
}



function loop(){

  for (let j = 0; j < sum; j++){
    if (sum === baza.Serwis.length){
    indArr.push(j)

    } else{
    let Inumb = begin + j
  begin > 0 ? indArr.push(Inumb): indArr.push(j)
    }
  }
}

loop()

  
  return [...indArr]
}

// Serching Matches And Saving Indexes

function search(formData){

  
  singleKeys = Object.keys(baza)
  // console.log("singlekey bellow")
  // console.log(singleKeys)
  

 let searchIndex = {"Serwisant":[], "Wydział":[], "Symbol":[], "Punkt":[], "Opis punktu":[], "Projekt":[], "Opis usterki":[], "Serwis":[]}
    let dateRange
//     console.log("dataRange below")
//  console.log(dateRange)
dateRange = []
  if (baza.Serwis.includes(formData.fromDate) && baza.Serwis.includes(formData.toDate)){
  dateRange.push(checkRange(formData.fromDate, formData.toDate))
  // console.log('dateRange when date bellow')
  // console.log(dateRange )
  } else {
    dateRange.push(0)
    alert("Choose correct dates or skip it")
  }

  //Checking Matching Frazes ---------------

singleKeys.map((it)=>{
  let n = 0
  let ind 
  if (formData[it] !== undefined && formData[it] !== null && formData[it] !== ""){
    while (n < baza[it].length) {
      let fraza = formData[it].toLowerCase()
      if (it === "Serwisant" || it === "Wydział"){
        baza[it][n] === fraza ? ind = n : ind = -1
      } else {
        baza[it][n].includes(fraza) ? ind = n : ind = -1
      }
    
      ind >= 0 ?searchIndex[it].push(ind): searchIndex[it].push(undefined)
      n++
    }
  
  }  else if (it === "Serwis"){
    for (let i = 0; i < dateRange.length; i++){
      ind = baza.Serwis.indexOf(dateRange[i])
   ind >= 0?searchIndex.Serwis.push(ind) : null
    }
  }
})
//--------------------------------------
// console.log('search indexes below')
// console.log(searchIndex)
serwChoosen = false
serwChosenArr = []
find(searchIndex)

}

//Mathing Search Results

function find(indexes){
  let arrCheck = (Object.values(indexes))
  let choiceCheck = arrCheck.map((subArr)=>{
    const isUnd = Array.from(new Set(subArr))
    // console.log('subArr = '+ subArr)
    // console.log('isUnd below '+isUnd)
    // console.log(isUnd)
   return isUnd.includes(undefined) && isUnd.length === 1 && subArr.length > 0
  })

  let sizeArr = arrCheck.map((it) => it.length)
  // console.log('arrCHeeck below')
  // console.log(arrCheck)
  // console.log('chocieCheck below')
  // console.log(choiceCheck)
  // console.log('sizeArr below')
  // console.log(sizeArr)
  let arr = [[],[],[],[],[],[],[],[]]

//-------------------------------Filtering Search Results

for (let k = 0; k < 8; k++){
  let toMap 
 toMap = arrCheck[k]
 if (toMap !== undefined && toMap.length > 0) {
 mapuj(toMap, k)
 } else {
  console.log('no conition for the loop' + k)
 }
 console.log('end of map ' + k)
 
}

function mapuj(arrToMap,u){

    function cutUndefined(cut){
        // console.log('nowyMap includes undefined')
        let toCut = cut.indexOf(undefined)
        // console.log('toCut = ' + toCut)
       cut.splice(toCut, 1)
      //  console.log('should be cuted below')
      //  console.log(cut)
       return cut
    
    }

  let s = u - 1
  let nowyMap
  let cutMap = Array.from(new Set(arrToMap))
  // console.log('cutMap below')
  // console.log(cutMap)
  if (cutMap.includes(undefined)){
nowyMap = cutUndefined(cutMap)
// console.log(nowyMap + ' cutted')

  } else {
    nowyMap = cutMap
    // console.log(nowyMap + ' no cut')

  }


  // console.log('nowyMap below')
  // console.log(nowyMap)
  
 return nowyMap.map((it) => {
    // console.log('loop')
          if ( sizeArr[u] > 0 && choiceCheck[u] === false && u > 0){
       
            if (arrCheck[s] !== undefined  && choiceCheck[s] === false && sizeArr[s] > 0){ 
           
                  if (it !== undefined){
                    let findArr = Array.from(new Set(arrCheck[s]))
                    let afterCut = cutUndefined(findArr)
                    let findRes = afterCut.includes(it)
                    // console.log('findArr below')
                    // console.log(findRes)

                    findRes ? arr[u].push(it) : console.log('does not go through '+ it) // arrCheck[s].filter((f)=>f===it)
                    // console.log('succes - ' + it)
                  } else {
                    // console.log('null') 
                  }
              
             
      } else if (arrCheck[s] !== undefined  && choiceCheck[s] === false && sizeArr[s] === 0){
        let w = s - 1;
        let wn = 0
        // console.log('w - poczatkowe = '+ w)
        while (w >= 0) {
          // console.log('w = '+ w)
            if (arrCheck[w] !== undefined  && choiceCheck[w] === false && sizeArr[w] > 0){
              //  console.log('W loop nr = '+ wn)
                if (it !== undefined){
                    let findArr = Array.from(new Set(arrCheck[w]))
                    let afterCut = cutUndefined(findArr)
                    let findRes = afterCut.includes(it)

                    findRes ? arr[u].push(it) : console.log('nie spełniło warunku filter w W') 
                    // console.log('succes - przez W  ')
                  } else {
                    console.log('null') 
                  }
            }
                wn = wn + 1
                w = w -1;
        }

        arr[u].push(it)
       
    }
              } else if ( u === 0 && choiceCheck[u] === false && it !== undefined && sizeArr[u] > 0){
                serwChoosen = true
                arr[u].push(it)
                serwChosenArr.push(it)
               
               } else if ( choiceCheck[u] ){
                console.log('nie ma wynikku')
              
              }
             
      })
    
}
//------------------------Action depended on number of filled form's fields

let emptyArraysCount = 0;

arrCheck.map(innerArr => {
  if (innerArr.length === 0) {
    emptyArraysCount++;
  }
});


//---------- ----------------------
// console.log("arr belw")
// console.log(arr)



console.log('Number of empty inner arrays:', emptyArraysCount);
let noFind = false
if (emptyArraysCount < 7){


let commonElementsInPopulatedArrays = [];

// Find the common elements in populated arrays
if (arrCheck.length > 0) {
  // Find the arrays with elements
  const populatedArrays = arrCheck.filter(array => array.length > 0);

  if (populatedArrays.length > 0) {
    // Get the first populated array
    const firstArray = populatedArrays[0];
    
    // Check each element in the first populated array
    firstArray.forEach(element => {
      // Check if the element is present in all other populated arrays
      const isInAllArrays = populatedArrays.every(array => array.includes(element));
      if (isInAllArrays && !commonElementsInPopulatedArrays.includes(element) && element !== undefined ) {
        commonElementsInPopulatedArrays.push(element);
      }
    });
  }
}
console.log('commonElementsInPopulatedArrays below');
console.log(commonElementsInPopulatedArrays);
if (commonElementsInPopulatedArrays !== undefined){
  arr = commonElementsInPopulatedArrays
  commonElementsInPopulatedArrays.length === 0 ? noFind = true: null
} else {
   console.log('no repeating elemnts')
}

}
//--------------------------


  const flated = arr.flat()

  console.log('flated below')
  console.log(flated)

  const checkIfSum = flated.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0)

  console.log('checkIfSum below')
  console.log(checkIfSum)

 let checkIfEmpty 

flated.length > 0 ? checkIfEmpty = false: checkIfEmpty = true

  console.log('check if emty below')
  console.log(checkIfEmpty)

  let found 

// Checks What To Display ----------------------------------------------

  if (checkIfSum > 0 && !checkIfEmpty && !choiceCheck.includes(true)){
    found = Array.from(new Set(flated))
    console.log('fuond below')
    console.log(found)
  } else if (checkIfEmpty && choiceCheck.includes(true) ){
found = []
console.log('nie znaleziono')
  } else if (!checkIfEmpty && choiceCheck.includes(true) ){
    found = []
    console.log('nie znaleziono')
      } else if (serwChoosen && checkIfEmpty && !noFind) {
found = serwChosenArr
  } else if (checkIfEmpty && noFind ){
found = []
  } else if (checkIfSum === 0 && !checkIfEmpty) {
    found = Array.from(new Set(flated))
  } else if (checkIfSum === undefined && noFind) {
    found = []
    console.log('nie znaleziono')
  } else {
    found = []
    for (let y = 0; y < baza.Serwisant.length; y++){
      found.push(y)
    }
    console.log('fuond allIndexes below')
    console.log(found)
  }

  renderData(found)
  found.length === 0 ? 
  noResults.innerHTML=`<h2 style="color:#e62e00; text-align:center;">Nie znaleziono wyników w tej kategori</h2>` 
  : noResults.innerHTML=``
}
//Display Results

function renderData(key){
  progBar.classList.remove("show")
  let rows

for(let q = 0; q < key.length; q++){

  rows += `<tr>
  <th scope="row">${baza[singleKeys[0]][key[q]].toUpperCase()}</th>
  <td>${baza[singleKeys[1]][key[q]]}</td>
  <td>${baza[singleKeys[2]][key[q]]}</td>
  <td>${baza[singleKeys[3]][key[q]]}</td>
  <td>${baza[singleKeys[4]][key[q]]}</td>
  <td>${baza[singleKeys[5]][key[q]]}</td>
  <td>${baza[singleKeys[6]][key[q]]}</td>
  <td>${baza[singleKeys[7]][key[q]]}</td>
  <td>${baza[singleKeys[9]][key[q]]}</td>
</tr>`
}

const tableHtml = `<table>
  <thead>

    <tr>
      <th scope="col">${singleKeys[0]}</th>
      <th scope="col">${singleKeys[1]}</th>
      <th scope="col">${singleKeys[2]}</th>
      <th scope="col">${singleKeys[3]}</th>
      <th scope="col">${singleKeys[4]}</th>
      <th scope="col">${singleKeys[5]}</th>
      <th scope="col">${singleKeys[6]}</th>
      <th scope="col">${singleKeys[7]}</th>
      <th scope="col">${singleKeys[9]}</th>
    </tr>
  </thead>
  <tbody>
 ${rows}
  </tbody>

</table>`
  showTable.innerHTML = tableHtml
  
}

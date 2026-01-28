import Color from 'color'; 


function colorFuser(colorArray) {

    const len = colorArray.length;
    if (len === 0) return Color("black");
    if (len === 1) return colorArray[0]; // Extra shortcut: no math needed!
    // Check if both arguments are instances of the Color class
    let redAccum = 0, greenAccum = 0 , blueAccum = 0;


    for (let i = 0; i < len; i++) {
        let colorRGB = colorArray[i].rgb().array()
        redAccum += colorRGB[0] ;
        greenAccum += colorRGB[1]; 
        blueAccum += colorRGB[2] ;
    }
    
    return Color.rgb(redAccum/len, greenAccum/len , blueAccum/len )
}

function arrayMultiplier(array, multiplier) {
    
    return array.map((value) => value * multiplier )

}

function arrayAdder(arrayA, arrayB) {
    // Ensure arrayB exists, otherwise return a copy of arrayA
    if (!arrayB) return [...arrayA]; 
    
    return arrayA.map((value, i) => value + (arrayB[i] || 0));
}


function colorArraySplitter(weightedColors, maxNoOfSplit) {
    let returnArray = []

    var noOfSplits = maxNoOfSplit
    
    // if (weightedColors.length > maxNoOfSplit) {
    //     noOfSplits = maxNoOfSplit;
    // } else {
    //     return weightedColors
    // }

    
    
    const totalWeight = weightedColors.reduce((sum, item) => sum + item[0], 0);
    const weightPerSeg = totalWeight/ noOfSplits 
    var stepsToEvaluate;
    
    let dataIndex = 0
    let nextIndexDestWeight = weightedColors[dataIndex][0]
    let currentSegWeight = 0
    let segCounter = 1
    let accumArray = [0,0,0]


    while (currentSegWeight < totalWeight) {

    
        if (nextIndexDestWeight  < weightPerSeg * segCounter ) {
            stepsToEvaluate = nextIndexDestWeight - currentSegWeight
            accumArray = arrayAdder(accumArray, arrayMultiplier(weightedColors[dataIndex][1].rgb().array(), stepsToEvaluate))
            dataIndex += 1
            nextIndexDestWeight += weightedColors[dataIndex][0] 
        
        } else if(nextIndexDestWeight == weightPerSeg * segCounter) {

            stepsToEvaluate = nextIndexDestWeight - currentSegWeight
            accumArray = arrayAdder(accumArray, arrayMultiplier(weightedColors[dataIndex][1].rgb().array(), stepsToEvaluate))
            dataIndex += 1
            segCounter += 1
            arrayMultiplier(accumArray, 1 / weightPerSeg)
            returnArray.push(arrayMultiplier(accumArray, 1 / weightPerSeg))
            console.log(accumArray)
            accumArray = [0,0,0]
            
        } else {
            
            stepsToEvaluate = weightPerSeg - currentSegWeight
            accumArray = arrayAdder(accumArray, arrayMultiplier(weightedColors[dataIndex][1].rgb().array(), stepsToEvaluate))
            segCounter += 1
            returnArray.push(arrayMultiplier(accumArray, 1 / weightPerSeg))
            console.log(accumArray)
            accumArray = [0,0,0]

        }

            currentSegWeight += stepsToEvaluate 

    } 



}



function weightedColorArray(array, timeElapsed, delta , frequency ) {
    let returnArray = []
    const frequencyMillie = frequency / 1000
    const endFloat = timeElapsed * frequencyMillie
    const endIndexCount = Math.floor(endFloat)
    const endPortion = endFloat - endIndexCount
    
    const firstFloat = (timeElapsed - delta) * frequencyMillie
    const firstIndexCount = Math.floor(firstFloat)
    const firstPortion = 1 - (firstFloat - firstIndexCount)

    let counter = firstIndexCount 
    
    // Negative time jump when timer resets
    if (firstFloat < 0) {
        return returnArray
    }

    if (firstPortion < 1) {
        returnArray.push([firstPortion , array[firstIndexCount % array.length]])
        counter += 1
    }
    
    while (counter  < endIndexCount) {
        returnArray.push([1,array[counter % array.length]])
        counter += 1
    }
    if (endPortion > 0) {
        returnArray.push([endPortion  , array[endIndexCount % array.length]])
    }
    return returnArray
}


var colorArray = [Color("red"),Color("green"),Color("blue")]
var testArrayblank =[1,2,3,4]
let recordedArray= weightedColorArray(colorArray,5000,500,5)

colorArraySplitter(recordedArray,3)
recordedArray.forEach((nestedArray) => console.log(nestedArray)) 
// console.log(colorFuser(colorArray))
// console.log(colorArraySplitter(colorArray,1))





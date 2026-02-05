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


export function colorArraySplitter(weightedColors, maxNoOfSplit, specifiedFraction = 1) {
    let returnArray = []
    var stepsToEvaluate;

    if (maxNoOfSplit == 0) {
        return returnArray
    }

    if (weightedColors.length <= maxNoOfSplit) {
        return weightedColors
    }
    var noOfSplits = maxNoOfSplit
    const totalWeight = weightedColors.reduce((sum, item) => sum + item[0], 0) * specifiedFraction;
    const weightPerSeg = totalWeight/ noOfSplits * specifiedFraction
    
    
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
            nextIndexDestWeight += (weightedColors[dataIndex] ? weightedColors[dataIndex][0] : 0); 
        
        } else if(nextIndexDestWeight == weightPerSeg * segCounter) {

            stepsToEvaluate = nextIndexDestWeight - currentSegWeight
            accumArray = arrayAdder(accumArray, arrayMultiplier(weightedColors[dataIndex][1].rgb().array(), stepsToEvaluate))
            dataIndex += 1
            segCounter += 1
            arrayMultiplier(accumArray, 1 / weightPerSeg)
            returnArray.push([weightPerSeg, Color.rgb(arrayMultiplier(accumArray, 1 / weightPerSeg))])
            // console.log(accumArray)
            accumArray = [0,0,0]
            
        } else {
            
            stepsToEvaluate = weightPerSeg - currentSegWeight
            accumArray = arrayAdder(accumArray, arrayMultiplier(weightedColors[dataIndex][1].rgb().array(), stepsToEvaluate))
            segCounter += 1
            returnArray.push([weightPerSeg, Color.rgb(arrayMultiplier(accumArray, 1 / weightPerSeg))])
            // console.log(accumArray)
            accumArray = [0,0,0]

        }

            currentSegWeight += stepsToEvaluate 

    } 
    return returnArray



}



export function weightedColorArray(array, startCount, endCount) {
    let returnArray = []
    const endFloat = endCount
    const endIndexCount = Math.floor(endFloat)
    const endPortion = endFloat - endIndexCount
    
    const firstFloat = startCount
    const firstIndexCount = Math.floor(firstFloat)
    const firstPortion = 1 - (firstFloat - firstIndexCount)

    let counter = firstIndexCount 
    
    // Negative time jump when timer resets
    if (firstFloat < 0) {
        return returnArray
    }

    if (firstPortion > 0) {
        returnArray.push([firstPortion , array[firstIndexCount % array.length]])
        counter += 1
    }
    
    while (counter  < endIndexCount) {
        returnArray.push([1,array[counter % array.length]])
        counter += 1
    }
    if (endPortion > 0) {
        returnArray.push([endPortion, array[endIndexCount % array.length]])
    }
    return returnArray
}

export function rangeGenerator(minDiameter, frequency, speed, weightedArray) {
    let returnArray = []
    let startPoint = 0

    let waveLength = speed/frequency

    weightedArray.forEach(element => {
        let weight = element[0]
        let color = element[1].rgb().string() 
        
        let step = weight * waveLength
        returnArray.push([[startPoint, startPoint + step + minDiameter], color])
        startPoint += step  
    });


    return returnArray

}

export function findColorSegments(data) {
    let events = [];
    
    // 1. Create events
    data.forEach(([range, color]) => {
        events.push({ pos: range[0], type: 1, color: color }); // start
        events.push({ pos: range[1], type: 0, color: color }); // end
    });

    // 2. Sort (end=0 before start=1 at same position)
    events.sort((a, b) => a.pos - b.pos || a.type - b.type);

    let segments = [];
    let activeColors = new Set();
    let lastPos = events[0].pos;
    let lastColorKey = '';

    // 3. Sweep
    for (let event of events) {
        if (event.pos > lastPos && activeColors.size > 0) {
            // Create a sorted key for color comparison
            let colorKey = Array.from(activeColors).sort().join('|');
            
            if (colorKey === lastColorKey) {
                // Extend previous segment
                segments[segments.length - 1].range[1] = event.pos;
            } else {
                // New segment
                segments.push({
                    range: [lastPos, event.pos],
                    colors: colorKey.split('|'),
                    count: activeColors.size
                });
                lastColorKey = colorKey;
            }
        }

        event.type ? activeColors.add(event.color) : activeColors.delete(event.color);
        lastPos = event.pos;
    }

    return segments;
}

// For testing
var colorArray = [Color("red"),Color("green"),Color("blue")]
// var testArrayblank =[1,2,3,4]
let recordedArray = weightedColorArray(colorArray,4990,5000)
let rangesForColor =  rangeGenerator(20, 100, 500, recordedArray)


// console.log(recordedArray)
// console.log(rangesForColor)
// console.log(findColorSegments(rangesForColor))
// recordedArray.forEach(nestedArray => console.log(nestedArray))
// newSplit.forEach((nestedArray) => console.log(nestedArray)) 
// // console.log(colorFuser(colorArray))
// // console.log(colorArraySplitter(colorArray,2))

// console.log(Color("red").alpha(0.2))



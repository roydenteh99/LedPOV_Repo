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
        let color = element[1]
        
        let step = weight * waveLength
        returnArray.push([[startPoint, startPoint + step + minDiameter], color])
        startPoint += step  
    });


    return returnArray

}


function fuseColor(sumR, sumG, sumB, count) {
    if (!count) return 0

    let r = (sumR / count) | 0
    let g = (sumG / count) | 0
    let b = (sumB / count) | 0

    return (r << 16) | (g << 8) | b
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


// export function findUintFusionColorSegments(data) {
//     let events = [];

//     data.forEach(([range, color]) => {
//         events.push({ pos: range[0], type: 1, color });
//         events.push({ pos: range[1], type: 0, color });
//     });

//     events.sort((a,b)=> a.pos - b.pos || a.type - b.type);

//     const segments = [];
//     const activeColors = new Map(); // color -> count
//     let sumR = 0, sumG = 0, sumB = 0;
//     let lastPos = events[0].pos;

//     let mergeHash = 0;  // running hash key
//     let lastHash = 0;

//     const PRIME = 2654435761; // large prime for hashing

//     for (const event of events) {
//         if (event.pos > lastPos && activeColors.size > 0) {

//             const totalCount = Array.from(activeColors.values()).reduce((a,b)=>a+b,0);
//             const fused = fuseColor(sumR, sumG, sumB, totalCount);

//             if (mergeHash === lastHash) {
//                 segments[segments.length-1].range[1] = event.pos;
//             } else {
//                 segments.push({
//                     range: [lastPos, event.pos],
//                     color: fused,
//                     count: totalCount
//                 });
//                 lastHash = mergeHash;
//             }
//         }

//         // update active colors, sums, and running hash
//         const c = event.color;
//         const r = (c >>> 16) & 0xFF;
//         const g = (c >>> 8) & 0xFF;
//         const b = c & 0xFF;

//         if (event.type === 1) {
//             // add
//             const prev = activeColors.get(c) || 0;
//             activeColors.set(c, prev + 1);
//             sumR += r; sumG += g; sumB += b;

//             // update hash incrementally
//             mergeHash ^= ((c + (prev + 1)) * PRIME) >>> 0;
//             if (prev > 0) mergeHash ^= ((c + prev) * PRIME) >>> 0; // remove old count
//         } else {
//             // remove
//             const prev = activeColors.get(c);
//             if (prev === 1) activeColors.delete(c);
//             else activeColors.set(c, prev - 1);
//             sumR -= r; sumG -= g; sumB -= b;

//             // update hash incrementally
//             mergeHash ^= ((c + prev) * PRIME) >>> 0;
//             if (prev > 1) mergeHash ^= ((c + prev - 1) * PRIME) >>> 0; // add new count if still exists
//         }

//         lastPos = event.pos;
//     }

//     return segments;
// }

// For testing
var colorArray = [Color("red"),Color("green"),Color("blue")]

let recordedArray = weightedColorArray(colorArray,4990,5000)
let rangesForColor =  rangeGenerator(20, 100, 500, recordedArray)

var colorUint32 = colorArray.map((color)=> (color.red() << 16) | (color.green() << 8) | color.blue())
let recordedArrayUint32 = weightedColorArray(colorUint32,4990,5000)
let rangesForUintColor = rangeGenerator(20, 100, 500, recordedArrayUint32)
// // console.log(recordedArray)
// console.log(recordedArrayUint32)
// // console.log(rangesForColor)
// console.log(rangesForUintColor)

console.log(findColorSegments(rangesForUintColor))


// recordedArray.forEach(nestedArray => console.log(nestedArray))
// newSplit.forEach((nestedArray) => console.log(nestedArray)) 
// // console.log(colorFuser(colorArray))
// // console.log(colorArraySplitter(colorArray,2))

// console.log(Color("red").alpha(0.2))



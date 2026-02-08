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

export function rangeAndColor (minLength, frequency, speed, weightedArray ,sorted = true , fusionLengthRatio = 0.25 , reverse = true ){
    let waveLength = speed /frequency
    let fusionLength = (minLength + waveLength) * fusionLengthRatio
    
    let events = eventGenerator(minLength, frequency, speed, weightedArray ,sorted)
    if (reverse) { return intersectAndFuse(events, fusionLength).reverse()}
    else { return intersectAndFuse(events, fusionLength)}
     
}

function eventGenerator(minLength, frequency, speed, weightedArray ,sorted = true ) {
    let eventArray = []
    let startPoint = 0
    

    let waveLength = speed /frequency


    weightedArray.forEach((element, index) => {
        let weight = element[0]
        let color = element[1]
        
        let step = weight * waveLength
        eventArray.push({pos: startPoint, type : 1 , color : color , key : index})
        eventArray.push({pos: startPoint + step + minLength, type : 0 , color : color , key : index})
        startPoint += step 
        
    });

    if (sorted) {
        eventArray.sort((a,b) => a.pos - b.pos || a.type - b.type)
    }

    return eventArray
}


function intersectAndFuseDebug(sortedEventArray , fusionLength = 0 )
{   let returnSegment = []
    let lastPos = 0
    let activeMap = new Map()
    sortedEventArray.forEach((ledEvent ,index) => {
        if (ledEvent.pos <= lastPos) {
            // console.log(ledEvent.pos, "at current position")
            // console.log(activeMap ,"at current position")
        
        } else {
            // console.log(ledEvent.pos, "at different position")
            // console.log(activeMap ,"logging at different position")
            const mapCopy = new Map(activeMap);
            returnSegment.push([[lastPos,ledEvent.pos],mapCopy])
        }

        if (ledEvent.type == 1) {
            activeMap.set(ledEvent.key,ledEvent.color )
        } else {
            activeMap.delete(ledEvent.key)
        }

        lastPos = ledEvent.pos
    })
    return returnSegment
}


function intersectAndFuse(sortedEventArray, fusionLength = 0)
{   let returnSegment = []
    let lastPos = 0
    let sumR = 0
    let sumG = 0
    let sumB = 0
    let count = 0  

    sortedEventArray.forEach((ledEvent) => {
        if (ledEvent.pos <= lastPos) {
            // console.log(ledEvent.pos, "at current position")
            // console.log(sumR, sumG , sumB , "at current position")         
            
        } else {
            let length = ledEvent.pos - lastPos
            if (length > fusionLength) {
                // console.log(ledEvent.pos, "at different position")
                // console.log(sumR, sumG , sumB ,"logging at different position")
                returnSegment.push([[lastPos,ledEvent.pos] , fuseColor(sumR, sumG, sumB, count)])

                lastPos = ledEvent.pos
            } else {
                // console.log(ledEvent.pos, "at different position")
                // console.log("fusion length too shot :", length)
            }


        }

        if (ledEvent.type == 1) {
            sumR +=  ledEvent.color >> 16 & 0xFF;
            sumG += ledEvent.color >> 8 & 0xFF;
            sumB += ledEvent.color & 0xFF;
            count += 1
        } else {
             
            sumR -=  ledEvent.color >> 16 & 0xFF;
            sumG -= ledEvent.color >> 8 & 0xFF;
            sumB -= ledEvent.color & 0xFF;
            count -= 1
            
        }
        
    })
    return returnSegment
}



function fuseColor(sumR, sumG, sumB, count) {
    if (!count) return 0

    let r = (sumR / count) | 0
    let g = (sumG / count) | 0
    let b = (sumB / count) | 0

    return Color.rgb(r, g, b)
}


export function Uint24ToColor(uintValue) {
    return Color.rgb(uintValue>> 16 & 0xFF , uintValue >> 8 & 0xFF ,uintValue >> 0 & 0xFF)

}

// export function ColorToUint24(color) {

//     return (color.red() << 16 | color.green() << 8 | color.blue() )
// }

// For testing
var colorArray = [Color("red"),Color("green"),Color("blue")]

// // let recordedArray = weightedColorArray(colorArray,4990,5000)
// // let rangesForColor =  eventGeneratorGenerator(20, 100, 500, recordedArray)

// var colorUint32 = colorArray.map((color)=> (color.red() << 16) | (color.green() << 8) | color.blue())
// let recordedArrayUint32 = weightedColorArray(colorUint32,4995,5000)
// let rangesForUintColorUnsorted = eventGenerator(20, 100, 700, recordedArrayUint32,false)
// let rangesForUintColor = eventGenerator(20, 100 ,700, recordedArrayUint32,true)
// let colorOutput = rangeAndColor(20, 100 ,700, recordedArrayUint32,true)

// console.log(rangesForUintColor)
// console.log(rangesForUintColorUnsorted)
// console.log(intersectAndFuseDebug(rangesForUintColor))
// console.log(intersectAndFuse(rangesForUintColor))
// console.log(colorOutput)
// let testNumber = Color("red").rgbNumber()
// console.log(testNumber)
// console.log(testNumber >> 16 & 0xFF , testNumber >> 8 & 0xFF ,testNumber >> 0 & 0xFF)



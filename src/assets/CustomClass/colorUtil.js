import { green } from '@mui/material/colors';
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


function colorArraySplitter(colors, maxNoOfSplit) {
    var returnColorArray=[];
    var noOfSplits;
    
    if (colors.length > maxNoOfSplit) {
        noOfSplits = maxNoOfSplit;
    } else {
        return colors
    }

    var discreteStep =  colors.length / noOfSplits;
    
    
    for (let i=0 ; i < noOfSplits ; i++) {
        let colorSlice = colors.slice(Math.floor(discreteStep * i), Math.ceil(discreteStep * (i + 1)));
        // console.log(colorSlice)
        // console.log(colorFuser(colorSlice))
        returnColorArray.push(colorFuser(colorSlice));
    }

    return returnColorArray

}

function arrayMultiplier(array, multiplier) {
    let returnArray = [];
    for (let i = 0 ; i < multiplier ; i++)
    {
            returnArray.push(...array)
        }
    return returnArray
}



var colorArray = [Color("red"),Color("green"),Color("blue")]
var colorArrayblank =[]
console.log(colorFuser(colorArray))
console.log(colorArraySplitter(colorArray,1))
console.log(arrayMultiplier([1,2,3],3).length)




//Setup file reader
const fs = require('fs');
const readline = require('readline');
//setup input file to log to console

//Created additional file to read from which has multiple winners(same score)
//uncomment below to test 1 winner vs multiple winners
var inputFile = 'abc.txt';
//var inputFile = 'withMultiWinners.txt';
//var inputFile = 'error.txt';


var lineReader = readline.createInterface({
    input: fs.createReadStream(inputFile)
});

//Add up player hands
var grandTotalArray = [];
var playerNameAndTotalArray = [];
var output = '';
lineReader.on('line', function (line) {
    var player = line.substring(0, line.indexOf(':'));
    var playerHandArray = line.substring(line.indexOf(':') + 1).split(',');
    var total = 0;
    var tieBreakerSuiteTotal = 0;
    var grandTotal = 0;
    for (var i = 0; i < playerHandArray.length; i++) {
        var card = playerHandArray[i].slice(0, -1);
        var suite = playerHandArray[i].slice(-1);
        if (card == 'J' || card == 'Q' || card == 'K') {
            total += 10;
            tieBreakerSuiteTotal += suiteCalc(suite);
        } else if (card == 'A') {
            total += 1;
            tieBreakerSuiteTotal += suiteCalc(suite);
        } else {
            total += parseInt(card);
            tieBreakerSuiteTotal += suiteCalc(suite);
        }
    }
    grandTotal = total + tieBreakerSuiteTotal;
    playerNameAndTotalArray.push([player, grandTotal]);
    //console.log(playerNameAndTotalArray);
    grandTotalArray.push(grandTotal);
    
    

});

function suiteCalc(suite) {
    try{
    if (suite == 'H') {
        suiteTotal = 3;
    } else if (suite == 'D') {
        suiteTotal = 2;
    } else if (suite == 'C') {
        suiteTotal = 1;
    } else if (suite == 'S') {
        suiteTotal = 4;
    }else{
        suiteTotal = 'ERROR';
        throw new Error('ERROR');
    }
    return suiteTotal;
    }catch(e){
        output = 'ERROR';
        fs.writeFile('xyz.txt', output, function (e) {
            if (e) throw e;
        });
    }
}

function findWinner() {
    var winningScore = Math.max.apply(Math, grandTotalArray);
    //count how many times winner occurs
    var count = 0;
    var winnerIndex = [];
    for (var i = 0; i < grandTotalArray.length; i++) {
        if (grandTotalArray[i] == winningScore) {
            count++;
        }
    }
    //if more than one winner, find the highest suite
    if (count > 1) {
        //find the index of the winners using the highest score
        for (var i = 0; i < grandTotalArray.length; i++) {
            if (grandTotalArray[i] == winningScore) {
                winnerIndex.push(i);
            }
        }
        //console.log('winnerIndex', winnerIndex);

        //Who winners are
        var winners = [];
        for (var i = 0; i < winnerIndex.length; i++) {
            winners.push(playerNameAndTotalArray[winnerIndex[i]][0]);
        }
        //log winners with score
        if(winners.length > 1){
        output = winners + ' : ' + winningScore;
        }else{
        output = 'ERROR';
        }
        //write to file
        fs.writeFile('xyz.txt', output, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    }else{
        //log winner with score
        if(playerNameAndTotalArray[grandTotalArray.indexOf(winningScore)]==undefined){
            output = 'ERROR';
            //write to file
            fs.writeFile('xyz.txt', output, function (err) {
            if (err) throw err;
            console.log('ERROR!');
        });
        }else{
            output = playerNameAndTotalArray[grandTotalArray.indexOf(winningScore)][0] + ' : ' + winningScore;
            //write to file
            fs.writeFile('xyz.txt', output, function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
        }
        
    }
}

//run findWinner function when file is done reading
lineReader.on('close', function () {
    findWinner();
});
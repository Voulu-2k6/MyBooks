const COMMON_WORDS = [
    "of", "in", "to", "on", "by", "at", "as", "is", "it", "an",
    "or", "he", "be", "we", "me", "my", "no", "do", "so", "up",
    "if", "us", "am", "the", "and", "for", "not", "all", "you", "her", "his", "she",
    "man", "one", "who", "are", "out", "off", "was", "our", "can",
    "new", "way", "why", "any", "too", "how", "see", "got", "had",
    "let", "now", "day", "use", "old", "two", "may", "did", "its",
    "top"
];  

const fs = require('fs');
const readStream = fs.createReadStream('../public/metadata/generalSubjects.txt', 'utf8');

let lines = [];
readStream.on('data', (chunk) => {
    lines = lines.concat(chunk.split(/\r?\n/));
});

readStream.on('end', () => {
    console.log('Finished reading.');
    console.log(lines.length);
    main(lines);
});

readStream.on('error', (err) => {
    console.error('Read error:', err);
});

let fails = 0;
let falseNeg = 0;

async function main(lines){

    for(let q = 605; q<lines.length; q++){
        console.log(lines[q]);

        let relevance = await parseQ(lines[q], 200, 10);

        if(relevance > 150){
            console.log(lines[q] + " reached recursion threshold with " + relevance);
            let query = lines[q] + "+intitle:";
            relevance = Math.max(await skimParse(query), relevance);
        }

        console.log(lines[q] + " final relevance: " + relevance);
        fs.appendFile('../public/metadata/tagsAndRelevance.txt', `\n${lines[q]},${relevance}`, 'utf8', (err) => {
            if (err) console.error('Write error:', err);
        });
    }

    console.log("false negative rate: " + ((falseNeg/fails)*100).toFixed(2) + "%");

}

async function parseQ(q, limit, size){

    let i = 0;
    let maxKnownResults = 0;
    let url;
    
    while(i < limit){

        url = `https://www.googleapis.com/books/v1/volumes?q=subject:${q}&langRestrict=en&printType=books&maxResults=${size}&startIndex=${i}`;

        try{
            let response = await fetch(url);
            let data = await response.json();
            if(data.items.length){maxKnownResults = i+data.items.length;}

        } catch (error) {

            console.log(`Error fetching books`);
            fails++;
            await sleep(2500);

            try{

                let response = await fetch(url);
                let data = await response.json();
                if(data.items.length){maxKnownResults = i+data.items.length; falseNeg++; console.log("false negative..."); await sleep(4000);}

            } catch (error) {console.log(`Error fetching books`); await sleep(1500);}
        }

        i += size;
    }

    console.log("subject:" + q + ": " + maxKnownResults);
    return maxKnownResults;

}

async function skimParse(q){
    let sum = 0;

    for(w of COMMON_WORDS)
    {
        sum += await parseQ(q + w, 40, 40);
        await sleep(300);
    }

    return sum;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
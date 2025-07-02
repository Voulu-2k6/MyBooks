const fs = require('fs');
const readStream = fs.createReadStream('../public/metadata/tagsAndRelevance.txt', 'utf8');

let lines = [];
readStream.on('data', (chunk) => {
    lines = lines.concat(chunk.split(/\r?\n/));
});

readStream.on('end', () => {
    console.log('Finished reading.');
    console.log(lines.length);
    write(sort(map(lines)));
});

readStream.on('error', (err) => {
    console.error('Read error:', err);
});

function map(lines){

    let tags = new Map();

    for(l of lines){

        let carry = l.length-1;
        while(carry > 0){
            if(l.substring(carry, carry+1) == ","){
                break;
            }
            carry--;
        }

        tags.set(l.substring(0, carry), parseInt(l.substring(carry+1)));
    }

    return tags;
    
}

function sort(lines){  
    console.log(lines);
    let myMap = new Map([...lines.entries()].sort((a, b) => b[1] - a[1]));
    return myMap;
}

function write(myMap){
    for(const [name, relevance] of myMap){
        fs.appendFile('../public/metadata/tagsByRelevance.txt', `\n${name},${relevance}`, 'utf8', (err) => {
            if (err) console.error('Write error:', err);
        });
    }

}


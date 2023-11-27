
const testReservedWords = (words) =>{
    const fs = require('fs');
    const result = fs.readFileSync("reservedKeyWords.txt","utf-8").split("\r\n");
    words.forEach((word) =>{
        let upperWord = word.toUpperCase();
        if(result.includes(upperWord)){
            console.log(`${upperWord} is present. Use a placeholder name.`);
        }
        else{
            console.log(`Its all good in the hood. We could not find ${upperWord}`);
        }
    })
}



testReservedWords(["id", "title", "text", "createdAt", "updatedAt"]);
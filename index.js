'use strict';

require('dotenv').config();
const readlineSync = require('readline-sync')
const colors = require('colors/safe')
const path = require('path');
const fs = require('fs');
var glob = require("glob")


const envExtentions = process.env.EXTENSIONS
const targetDirectory = process.env.TARGET_DIR;

if(typeof envExtentions === "undefined" || typeof targetDirectory === 'undefined'){
    console.log('>> envファイルに必要が記述がありません')
    process.exit()
}

const absolutePath = path.resolve(targetDirectory);
const extentions = envExtentions.split(',');
const confimText = '>> 対象ディレクトリは「' + colors.green(absolutePath) + '」となります。\n  本当に実行しますか？';

if (readlineSync.keyInYN(confimText)) {
    console.log(colors.green(absolutePath) );
    console.log(colors.green('>> Execute'))  
    main(extentions);
} else {
    console.log(colors.yellow('>> Cancel'))
    process.exit()
}


async function main(extentions){
    for(let i = 0, len = extentions.length; i < len; i++){
        let files = await find(extentions[i]);
        files.forEach(file => {
            console.log(file)
            fs.unlinkSync(file);
        });
    }
    console.log(colors.green('>>finished'))
}

function find(ext) {
    return new Promise(resolve => {
        const pattern = "**/*." + ext;
        glob(path.join(absolutePath,pattern), function(err, files) {
        if(err) {
            console.log(err)
        }
            resolve(files);
        })
    })
}
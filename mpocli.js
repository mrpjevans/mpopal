#!/usr/bin/env node
const fs = require('fs/promises');
const path = require('path');

const threedfren = require('threedfren');
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const { trace } = require('console');

const argv = yargs(hideBin(process.argv))
    .alias('h', 'help')
    .alias('i', 'input')
    .alias('t', 'transformations')
    .alias('o', 'output')
    .describe('i', 'Input file or directory')
    .describe('t', 'Type of transformation to perform (split, parallel, cross, triplet')
    .describe('o', 'Output directory')
    .argv;

const input = argv.i ?? process.cwd();
const outputDirectory = argv.o ?? process.cwd();
let transformations = argv.t ?? 'split';
if (!Array.isArray(transformations)) {
    transformations = [ transformations ];
}

(async () => {

    let inputStat = null;

    try {
        inputStat = await fs.stat(input);
    } catch(err) {
        console.error('ERROR: Unable to access input file or directory');
        process.exit();
    }

    try {
        outputStat = await fs.stat(outputDirectory);
    } catch(err) {
        console.error('ERROR: Unable to access output directory');
        process.exit();
    }

    if (!outputStat.isDirectory()) {
        console.error('ERROR: Output is not a valid directory');
        process.exit();
    }


    let inputDirectory = "";
    let inputFiles = [];

    if (inputStat.isDirectory()) {
        inputDirectory = input;
        inputFiles = await fs.readdir(input);
    } else {
        const inputPathInfo = path.parse(input);
        inputDirectory = inputPathInfo.dir;
        inputFiles = [ inputPathInfo.base ];
    }

    for (file of inputFiles) {
        const fullPath = inputDirectory + '/' + file;
        console.log(`Processing ${fullPath}`);

        const pathInfo = path.parse(file);
        if (pathInfo.ext.toLowerCase() !== '.mpo') {
            console.error('ERROR: Not an MPO file, skipping');
            continue;
        }

        try {
            await threedfren.loadMpo(fullPath);
        } catch(err) {
            console.error(err.message);
            continue;
        }

        for (const transformation of transformations) {

            const basePath = outputDirectory + '/' + pathInfo.name + '_';
            const leftPath =  basePath + 'l.jpg';
            const rightPath =  basePath + 'r.jpg';
            const outputPath =  basePath + transformation + '.jpg';

            try {

                switch(transformation) {
                    case 'split':
                        console.log(`Splitting to ${leftPath}, ${rightPath}`);
                        await threedfren.saveSplit(leftPath, rightPath);
                        break;
                    case 'triplet':
                        console.log(`Generating triplet ${outputPath}`);
                        await threedfren.toTriplet(outputPath);
                        break;
                    case 'cross':
                        console.log(`Generating cross ${outputPath}`);
                        await threedfren.toCross(outputPath);
                        break;
                    case 'parallel':
                        console.log(`Generating parallel ${outputPath}`);
                        await threedfren.toParallel(outputPath);
                        break;
                    default:
                        console.log(`Unknown transformation type: ${transformation}`);
                }

            } catch(err) {
                console.error('ERROR: ' + err.message);
            }

        }

    }

    console.log('Complete');

})();

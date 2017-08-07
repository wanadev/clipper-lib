"use strict";

var expect = require("expect.js");
const holes = require("../compiled-helper/bundle");
const assert = require('assert');
const lodash = require("lodash");
const clipperLib = require("../clipper.js")


function isOkPoint(pointOut, pathIn) {

  if(!pointOut.data){
    return false;
  }

  // gets the points with the same coords:
  const matchCoords = pathIn.filter( pt => (pt.X === pointOut.X && pt.Y === pointOut.Y));
  if(matchCoords.length === 0) {
      return true;
  }

  // gets the parent points :
  const parents = matchCoords.filter( pt => lodash.intersection(pt.data.parent, pointOut.data.parent).length > 0);

  if(matchCoords.length > 0 && parents.length === 0){
      return false;
  }
  return true;
}

function isOkResultOffset(pathsIn, pathsOut) {
  const pathIn = [];
  for (let i in pathsIn) {
    pathIn.push(...pathsIn[i]);
  }
  for (let i in pathsOut) {
    for (let j in pathsOut[i]) {
      if (!pathsOut[i][j].data) return false;
    }
  }
  return true;
}

function isOkResult(pathsIn, pathsOut) {
  const pathIn = [];
  for (let i in pathsIn) {
    pathIn.push(...pathsIn[i]);
  }
  for (let i in pathsOut) {
    for (let j in pathsOut[i]) {
      if (!isOkPoint(pathsOut[i][j], pathIn)) return false;
    }
  }
  return true;
}

function runTestOffset(kazaFlag) {
    const operation = "offset";
    holes.getData(operation,kazaFlag).tests.forEach((test) => {
      it(getTestName(operation, false,kazaFlag)+' OFFSET PATH, test index= '+ test.index, function() {
        let res = holes.executeOffset(test.subj.concat(test.clip));
          expect(isOkResultOffset(test.subj.concat(test.clip), res)).to.be.equal(true);
      });
    });
}

function runTest(operation, polyFlag, kazaFlag ){
  holes.getData(operation,kazaFlag).tests.forEach((test) => {
    // if(test.index !== 8) return
    it(getTestName(operation, polyFlag,kazaFlag)+', test index= '+ test.index, function() {
      let res = holes.getTestResult(test,polyFlag);
        expect(isOkResult(test.subj.concat(test.clip), res)).to.be.equal(true);
    });
  });
}

function getTestName(operation, polyFlag,kazaFlag){
  let res = '';
  switch(operation){
    case clipperLib.ClipType.ctUnion:
      res+= 'UNION ';
      break;
    case clipperLib.ClipType.ctXor:
      res+= 'XOR ';
      break;
    case clipperLib.ClipType.ctIntersection:
      res+= 'Intersection ';
      break;
    case clipperLib.ClipType.ctDifference:
      res+= 'ctDifference ';
      break;
  }
  res+= 'PolyType: ';
  switch (polyFlag) {
    case true:
        res+= 'true';
      break;
    case false:
      res+= 'false';
     break;
  }

  res+= ' DataType: '
  switch (kazaFlag) {
    case true:
        res+= 'From Kaza';
      break;
    case false:
      res+= 'From Tests';
     break;
  }
  return res;
}

function getTestsOffset() {
        const operations = [clipperLib.ClipType.ctUnion,clipperLib.ClipType.ctXor, clipperLib.ClipType.ctIntersection,clipperLib.ClipType.ctDifference];
}

function getTests(){
  const operations = [clipperLib.ClipType.ctUnion,clipperLib.ClipType.ctXor, clipperLib.ClipType.ctIntersection,clipperLib.ClipType.ctDifference];
  const polyFlags = [false,true];
  const kazaflags = [false,true];

  const res =[];
  for(let i in kazaflags){
    for(let j in polyFlags){
      for(let k in operations)
        res.push({operation: operations[k], polyFlag: polyFlags[j], kazaFlag: kazaflags[i]});
    }
  }
  return res;
}


describe('Clipper', function() {
  describe('executeClipper', function() {
    // getTests().forEach((test) => {
    //       runTest(test.operation, test.polyFlag, test.kazaFlag );
    // });

    getTests().forEach((test) => {
          runTestOffset(false);
    });


     describe('CLean', function() {
         const path = JSON.parse('[{"X":11516650,"Y":7157118,"data":[{"id":"4bddee4a-b140-43d6-8524-39c2c5128b7d","edgeIndex":3}]},{"X":9196025,"Y":9058353,"data":[{"id":"4bddee4a-b140-43d6-8524-39c2c5128b7d","edgeIndex":3}]},{"X":-11216650,"Y":-15857118,"data":[{"id":"4bddee4a-b140-43d6-8524-39c2c5128b7d","edgeIndex":3}]},{"X":-8896025,"Y":-17758353,"data":[{"id":"4bddee4a-b140-43d6-8524-39c2c5128b7d","edgeIndex":3}]}]');
         const res = clipperLib.Clipper.CleanPolygon(path,10000);
         expect(res[0].data).to.be.ok();
     });

     describe('union2', function() {
         const paths = JSON.parse('[[{"X":31400000,"Y":25000000},{"X":-31400000,"Y":25000000},{"X":-31400000,"Y":-1000000000},{"X":31400000,"Y":-1000000000}],[{"X":-31400000,"Y":25000000},{"X":31400000,"Y":25000000},{"X":31400000,"Y":-1000000000},{"X":-31400000,"Y":-1000000000}]]');
         paths[0].reverse();

         const res =  holes.executeClipper(paths, [], clipperLib.ClipType.ctUnion);
         expect(res).to.be.ok();
         console.log("res",  res);
     });
  });

});

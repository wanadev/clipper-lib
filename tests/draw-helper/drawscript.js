
var holes = require("../../helper/index");
var clipperLib = require('../../clipper');


var drawscript = {


chooseColor: function (point){
  if(!point.data || !point.data.parent) return [0,0,0];

  const colorMap ={
    hole:[0,0,255],
    longHole:[0,255,0],
    inHole:[127,127,127],
    ininHole:[127,127,0],
    inininHole:[127,0,127],
  }
  let color = [0,0,0];
  point.data.parent.forEach( elt => {
    if(!colorMap[elt]) return;
    if(elt instanceof Number) {
      for(let i in colorMap[elt]){
        color[i] = (color[i] + Object.values(colorMap)[elt][i])%256;
      }
    } else{
      for(let i in colorMap[elt]){
        color[i] = (color[i] + colorMap[elt][i])%256;
      }
    }
  });
  return "rgb("+color[0]+","+color[1]+","+color[2]+")";
},

drawPaths: function (ctx,paths, position) {
  ctx.clearRect(position.X, position.Y, 300, 333);
  for (const i in paths ){
    drawscript.drawPath(ctx, paths[i],position)
  }
},

drawPath:function (ctx, pathToDraw, position) {
    if (!position) {
        position = {
            X: 0,
            Y: 0,
        };
    }

    const path = [];
    if (pathToDraw.length === 0) return;
    for (const i in pathToDraw) {
        path.push({
            X: pathToDraw[i].X + position.X,
            Y: pathToDraw[i].Y + position.Y,
            data: pathToDraw[i].data
        });
    }
// Draws the inner of the path
    const pathFill = new Path2D();
    for (let i = 0; i < path.length; i++) {
        ctx.beginPath();
        ctx.strokeStyle = drawscript.chooseColor(path[i]);
        ctx.moveTo(path[i].X, path[i].Y);
        ctx.lineTo(path[(i+1)%path.length].X, path[(i+1)%path.length].Y);
        ctx.stroke();
        ctx.closePath();

    }

    // pathFill.lineTo(path[0].X, path[0].Y);

  // Draws the dots:
  for (let i = 0; i < path.length; i++) {
      ctx.strokeStyle = drawscript.chooseColor(path[i]);
      ctx.fillStyle = drawscript.chooseColor(path[i]);
      ctx.fillRect(path[i].X, path[i].Y, 4, 4);
  }

},

checkTest:function (tests,index,ctxIn,ctxOut){
  const scale = 1 ;/// Math.ceil(tests.tests.length / 12)

  ctxIn.scale(scale, scale);
  ctxOut.scale(scale, scale);

  const COLS = 5;
  const ROWS = 14;
  row = Math.floor(index / COLS);
  rowSize = Math.floor(3600 / ROWS)
  column = index % COLS;
  columnSize = Math.floor(900 / COLS);

  const pt = { X:0 + column*columnSize, Y:100 + row*rowSize };
  const test = tests.tests[index];
    drawscript.drawPaths(ctxIn,test.subj.concat(test.clip),pt);
  let res = holes.getTestResult(test,false);
    drawscript.drawPaths(ctxOut,res,pt, scale);

    [ctxIn, ctxOut].forEach(ctx => {
      ctx.font = "30px Arial";
      ctx.fillText("INDEX: "+index,pt.X + 10,pt.Y+50);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    })
},
// console.log("LA ");

draw:function (){
    var canvas1 = document.getElementById("canvas1");
    var ctx1= canvas1.getContext('2d');
    var canvas2 = document.getElementById("canvas2");
    var ctx2= canvas2.getContext('2d');

    const tests = holes.getData(clipperLib.ClipType.ctUnion);
    for (const i in tests.tests){
      drawscript.checkTest(tests,i,ctx1,ctx2);
    }

    holes.executeOffset(JSON.parse('[[{"X":30,"Y":30,"data":{"index":0}},{"X":130,"Y":30,"data":{"index":1}},{"X":130,"Y":130,"data":{"index":2}},{"X":30,"Y":130,"data":{"index":3}}],\
                                     [{"X":60,"Y":60,"data":{"index":10}},{"X":60,"Y":100,"data":{"index":11}},{"X":100,"Y":100,"data":{"index":12}},{"X":100,"Y":60,"data":{"index":13}}]]'));


},

};

module.exports = drawscript;

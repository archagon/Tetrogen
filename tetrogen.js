// TODO:
// * import external js correctly
// * improve algorithm
// * jquery
// * correct coordinate shifts/scales -- realtime?
// * multiple threads
// * generate image download link
// * generate background automatically
// * Amazon affiliate
// * Google ads
// * PayPal donate

/* minified seedrandom.js by David Bau ; thank you very much! */

(function(a,b,c,d,e,f){function k(a){var b,c=a.length,e=this,f=0,g=e.i=e.j=0,h=e.S=[];for(c||(a=[c++]);d>f;)h[f]=f++;for(f=0;d>f;f++)h[f]=h[g=j&g+a[f%c]+(b=h[f])],h[g]=b;(e.g=function(a){for(var b,c=0,f=e.i,g=e.j,h=e.S;a--;)b=h[f=j&f+1],c=c*d+h[j&(h[f]=h[g=j&g+b])+(h[g]=b)];return e.i=f,e.j=g,c})(d)}function l(a,b){var e,c=[],d=(typeof a)[0];if(b&&"o"==d)for(e in a)try{c.push(l(a[e],b-1))}catch(f){}return c.length?c:"s"==d?a:a+"\0"}function m(a,b){for(var d,c=a+"",e=0;c.length>e;)b[j&e]=j&(d^=19*b[j&e])+c.charCodeAt(e++);return o(b)}function n(c){try{return a.crypto.getRandomValues(c=new Uint8Array(d)),o(c)}catch(e){return[+new Date,a,a.navigator.plugins,a.screen,o(b)]}}function o(a){return String.fromCharCode.apply(0,a)}var g=c.pow(d,e),h=c.pow(2,f),i=2*h,j=d-1;c.seedrandom=function(a,f){var j=[],p=m(l(f?[a,o(b)]:0 in arguments?a:n(),3),j),q=new k(j);return m(o(q.S),b),c.random=function(){for(var a=q.g(e),b=g,c=0;h>a;)a=(a+c)*d,b*=d,c=q.g(1);for(;a>=i;)a/=2,b/=2,c>>>=1;return(a+c)/b},p},m(c.random(),b)})(this,[],Math,256,6,52);

/* tetrogen.js by Archagon ; aka, baby's first Javascript program */

//////////////////////
// HELPER FUNCTIONS //
//////////////////////

var debugIterMode = true; // use the right arrow key to move through the iterations one by one!

function pr(string)
{
    console.log(string);
};

Number.prototype.mod = function(n)
{
    return ((this % n) + n) % n;
};

function rand(minInclusive, maxExclusive)
{
    return Math.floor((Math.random() * maxExclusive) + minInclusive);
};

// TODO: jQuery dat shit
// TODO: only compares pairs
function contains(array, item)
{
    for (var i in array)
    {
        arrayItem = array[i];

        if (arrayItem[0] == item[0] && arrayItem[1] == item[1])
        {
            return true;
        }
    }

    return false;
};

// Stolen shamelessly from http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array
// because it's easier than thinking for 5 minutes!
function shuffle(array)
{
    var i = array.length, j, temp;

    if (i === 0)
    {
        return false;    
    }
    
    while (--i)
    {
        j = Math.floor(Math.random() * (i + 1));
        temp = array[i];
        array[i] = array[j]; 
        array[j] = temp;
   }
};

// borrowed from http://blog.magnetiq.com/post/514962277/finding-out-class-names-of-javascript-objects
function getObjectClass(obj)
{
    if (obj && obj.constructor && obj.constructor.toString)
    {
        var arr = obj.constructor.toString().match(/function\s*(\w+)/);

        if (arr && arr.length == 2)
        {
            return arr[1];
        }
    }

    return undefined;
};

/////////////////////
// TETROMINO CLASS //
/////////////////////

tetromino.rotation =
{
    up: 0,
    right: 1,
    down: 2,
    left: 3
};

// TODO: double bleh, I need to figure out how to do class variables and/or proper hash keys in JS
// TODO: also need to figure out chained constructors
tetromino.globalId = 0;

function tetromino()
{
    this.rotation = tetromino.rotation.up;
    this.x = 0;
    this.y = 0;
    this.width = 0; // applies to default rotation
    this.height = 0; // applies to default rotation
};
tetromino.prototype.decodeSquaresString = function(squaresString)
{
    var outputArray = [];
    var currentPair = [];

    for (var i = 0; i < squaresString.length; i++)
    {
        if (squaresString[i] >= '0' && squaresString[i] <= '9')
        {
            if (currentPair.length == 0)
            {
                currentPair[0] = squaresString[i] - '0';
            }
            else
            {
                currentPair[1] = squaresString[i] - '0';
                outputArray.push(currentPair);
                currentPair = [];
            }
        }
    }

    return outputArray;
};
tetromino.prototype.rotatedWidth = function()
{
    if (this.rotation == tetromino.rotation.up || this.rotation == tetromino.rotation.down)
    {
        return this.width;
    }
    else
    {
        return this.height;
    }
};
tetromino.prototype.rotatedHeight = function()
{
    if (this.rotation == tetromino.rotation.up || this.rotation == tetromino.rotation.down)
    {
        return this.height;
    }
    else
    {
        return this.width;
    }
};
tetromino.prototype.squares = function()
{
    // I didn't feel like figuring the math out for the rotations, so I just encoded them manually
    return [];
};
tetromino.prototype.surroundingSquares = function() // TODO: this is super duper slow, but whatever
{
    var squares = this.squares();
    var surroundingSquaresSet = {};
    var surroundingSquares = [];

    for (var i in squares)
    {
        var squarePair = squares[i];

        // check each tile around the tile in question
        for (var xDiff = -1; xDiff <= 1; xDiff += 1)
        {
            for (var yDiff = -1; yDiff <= 1; yDiff += 1)
            {
                var diffPair = [squarePair[0]+xDiff, squarePair[1]+yDiff];

                if (!contains(squares, diffPair))
                {
                    surroundingSquaresSet[diffPair] = true;
                }
            }
        }
    }

    // Object.keys would be better, but it's only supported in modern browsers
    for (var pair in surroundingSquaresSet)
    {
        surroundingSquares.push([pair[0], pair[1]]);
    }

    pr("Surrounding squares: " + surroundingSquares);
    return surroundingSquares;
};
// tetromino.prototype.areaSquares = function() // TODO: rename
// {
//     var outputArray = [];

//     for (var x = -1; x < this.rotatedWidth()+1; x += 1)
//     {
//         for (var y = -1; y < this.rotatedHeight()+1; y += 1)
//         {
//             outputArray.push([x, y]);
//         }
//     }

//     return outputArray;
// };
// tetromino.prototype.areaEmptySquares = function() // TODO: inefficient and dumb, maybe fix later
// {
//     var outputArray = [];
//     var squares = this.squares();
//     var areaSquares = this.areaSquares();

//     for (var i in areaSquares)
//     {
//         pair = areaSquares[i];

//         if (!contains(squares, pair))
//         {
//             outputArray.push(pair);
//         }
//     }

//     return outputArray;
// };
tetromino.prototype.convertToAbs = function(arrayOfPairs)
{
    var absPairs = [];
    for (var pair in arrayOfPairs)
    {
        absPairs.push([arrayOfPairs[pair][0] + this.x, arrayOfPairs[pair][1] + this.y]);
    }
    return absPairs;
};
tetromino.prototype.hashKey = function()
{
    return getObjectClass(this) + "-" + this.id;
};
tetromino.prototype.toString = function()
{
    return "{tetromino " + getObjectClass(this) + " at (" + this.x + "," + this.y + ") with rotation " + this.rotation + "}";
};

tLLeft.prototype = new tetromino();
tLLeft.prototype.constructor = tLLeft;
tLLeft.superclass = tetromino.prototype;
function tLLeft()
{
    this.id = tetromino.globalId;
    tetromino.globalId += 1;
    this.color = 'red';
    this.width = 2;
    this.height = 3;
};
tLLeft.prototype.squares = function()
{
    if (this.rotation == tetromino.rotation.up) { return this.decodeSquaresString("00 10 11 12"); }
    if (this.rotation == tetromino.rotation.right) { return this.decodeSquaresString("01 00 10 20"); }
    if (this.rotation == tetromino.rotation.down) { return this.decodeSquaresString("12 02 01 00"); }
    if (this.rotation == tetromino.rotation.left) { return this.decodeSquaresString("20 21 11 01"); }
};

tLRight.prototype = new tetromino();
tLRight.prototype.constructor = tLRight;
tLRight.superclass = tetromino.prototype;
function tLRight()
{
    this.id = tetromino.globalId;
    tetromino.globalId += 1;
    this.color = 'orange';
    this.width = 2;
    this.height = 3;
};
tLRight.prototype.squares = function()
{
    if (this.rotation == tetromino.rotation.up) { return this.decodeSquaresString("10 00 01 02"); }
    if (this.rotation == tetromino.rotation.right) { return this.decodeSquaresString("00 01 11 21"); }
    if (this.rotation == tetromino.rotation.down) { return this.decodeSquaresString("02 12 11 10"); }
    if (this.rotation == tetromino.rotation.left) { return this.decodeSquaresString("21 20 10 00"); }
};

tZigLeft.prototype = new tetromino();
tZigLeft.prototype.constructor = tZigLeft;
tZigLeft.superclass = tetromino.prototype;
function tZigLeft()
{
    this.id = tetromino.globalId;
    tetromino.globalId += 1;
    this.color = 'yellow';
    this.width = 3;
    this.height = 2;
};
tZigLeft.prototype.squares = function()
{
    if (this.rotation == tetromino.rotation.up) { return this.decodeSquaresString("01 11 10 20"); }
    if (this.rotation == tetromino.rotation.right) { return this.decodeSquaresString("00 01 11 12"); }
    if (this.rotation == tetromino.rotation.down) { return this.decodeSquaresString("01 11 10 20"); }
    if (this.rotation == tetromino.rotation.left) { return this.decodeSquaresString("00 01 11 12"); }
};

tZigRight.prototype = new tetromino();
tZigRight.prototype.constructor = tZigRight;
tZigRight.superclass = tetromino.prototype;
function tZigRight()
{
    this.id = tetromino.globalId;
    tetromino.globalId += 1;
    this.color = 'green';
    this.width = 3;
    this.height = 2;
};
tZigRight.prototype.squares = function()
{
    if (this.rotation == tetromino.rotation.up) { return this.decodeSquaresString("00 10 11 21"); }
    if (this.rotation == tetromino.rotation.right) { return this.decodeSquaresString("02 01 11 10"); }
    if (this.rotation == tetromino.rotation.down) { return this.decodeSquaresString("00 10 11 21"); }
    if (this.rotation == tetromino.rotation.left) { return this.decodeSquaresString("02 01 11 10"); }
};

tT.prototype = new tetromino();
tT.prototype.constructor = tT;
tT.superclass = tetromino.prototype;
function tT()
{
    this.id = tetromino.globalId;
    tetromino.globalId += 1;
    this.color = 'blue';
    this.width = 3;
    this.height = 2;
};
tT.prototype.squares = function()
{
    if (this.rotation == tetromino.rotation.up) { return this.decodeSquaresString("00 10 20 11"); }
    if (this.rotation == tetromino.rotation.right) { return this.decodeSquaresString("00 01 02 11"); }
    if (this.rotation == tetromino.rotation.down) { return this.decodeSquaresString("01 11 21 10"); }
    if (this.rotation == tetromino.rotation.left) { return this.decodeSquaresString("12 11 10 01"); }
};

tLine.prototype = new tetromino();
tLine.prototype.constructor = tLine;
tLine.superclass = tetromino.prototype;
function tLine()
{
    this.id = tetromino.globalId;
    tetromino.globalId += 1;
    this.color = 'gray';
    this.width = 1;
    this.height = 4;
};
tLine.prototype.squares = function()
{
    if (this.rotation == tetromino.rotation.up) { return this.decodeSquaresString("00 01 02 03"); }
    if (this.rotation == tetromino.rotation.right) { return this.decodeSquaresString("00 10 20 30"); }
    if (this.rotation == tetromino.rotation.down) { return this.decodeSquaresString("00 01 02 03"); }
    if (this.rotation == tetromino.rotation.left) { return this.decodeSquaresString("00 10 20 30"); }
};

tSquare.prototype = new tetromino();
tSquare.prototype.constructor = tSquare;
tSquare.superclass = tetromino.prototype;
function tSquare()
{
    this.id = tetromino.globalId;
    tetromino.globalId += 1;
    this.color = 'pink';
    this.width = 2;
    this.height = 2;
};
tSquare.prototype.squares = function()
{
    if (this.rotation == tetromino.rotation.up) { return this.decodeSquaresString("00 10 11 01"); }
    if (this.rotation == tetromino.rotation.right) { return this.decodeSquaresString("00 10 11 01"); }
    if (this.rotation == tetromino.rotation.down) { return this.decodeSquaresString("00 10 11 01"); }
    if (this.rotation == tetromino.rotation.left) { return this.decodeSquaresString("00 10 11 01"); }
};

///////////////////
// SURFACE CLASS //
///////////////////

function surface(width, height)
{
    this._canvas = document.getElementById('canvas');
    this._context = canvas.getContext('2d');

    this.tetrominoObjects = {};
    this.tetrominos = {};
    this.grid = {};

    this.width = width;
    this.height = height;

    this.spritemap = null;
};
surface.prototype.actualCoord = function(pair)
{
    pair[0] = pair[0].mod(this.width);
    pair[1] = pair[1].mod(this.height);

    return pair;
};
// This function flood fills the grid from an empty starting coordinate and returns a set
// of the empty coordinates that are part of that flood fill.
// TODO: horribly inefficient, optimize
surface.prototype.floodFill = function(startingPair, additionalPairs)
{
    var traversedPairs = {};
    var emptyPairs = {};

    var currentPairsToExamine = [startingPair];

    while (currentPairsToExamine.length > 0)
    {
        var currentPair = currentPairsToExamine.pop();

        if (!traversedPairs[currentPair])
        {
            var pairIsNotOnGrid = (!this.grid[currentPair] && !contains(additionalPairs, currentPair));
            var pairIsWithinBounds = (currentPair[0] >= 0 && currentPair[0] < this.width &&
                                      currentPair[1] >= 0 && currentPair[1] < this.height);

            // test if empty, and only proceed if it is
            if (pairIsNotOnGrid && pairIsWithinBounds)
            {
                emptyPairs[currentPair] = true;

                var diffArray = [-1, 1];
                for (var xIndex in diffArray)
                {
                    for (var yIndex in diffArray)
                    {
                        var surroundingPairToTest = [currentPair[0]+diffArray[xIndex], currentPair[1]+diffArray[yIndex]];
                        currentPairsToExamine.push(surroundingPairToTest);
                    }
                }
            }

            traversedPairs[currentPair] = true;
        }
    }

    return emptyPairs;
};
surface.prototype.addTetromino = function(tetromino)
{
    // wtf stop it what are you doing
    if (this.tetrominos[tetromino.hashKey()])
    {
        return false;
    }

    var accepted = true;

    var squares = tetromino.convertToAbs(tetromino.squares());
    var absAreaEmptySquares = tetromino.convertToAbs(tetromino.surroundingSquares());
    pr("AREA EMPTY SQUARES: " + absAreaEmptySquares);

    for (var i in squares)
    {
        var pair = this.actualCoord(squares[i]);

        // oops! there's already a tetromino there
        if (this.hasTetromino(pair))
        {
            accepted = false;
            break;
        }
    }

    for (var i in absAreaEmptySquares)
    {
        pair = absAreaEmptySquares[i];

        if (this.hasTetromino(pair))
        {
            continue;
        }

        var offsets = [[-1, 0], [0, -1], [1, 0], [0, 1]];
        var numberFound = 0;
        for (var i in offsets)
        {
            var offset = offsets[i];
            var offsetPair = [pair[0] + offset[0], pair[1] + offset[1]];

            if (this.hasTetromino(offsetPair) || contains(squares, offsetPair))
            {
                numberFound += 1;
            }
            else
            {
                break;
            }
        }

        // oops! adding this tetromino will create empty, unreachable pockets
        if (numberFound == offsets.length)
        {
            accepted = false;
            break;
        }
    }

    if (accepted)
    {
        var actualCoords = [];

        for (var i in squares)
        {
            var pair = this.actualCoord(squares[i]);
            this.grid[pair] = tetromino;
            actualCoords.push(pair);
        }

        this.tetrominos[tetromino.hashKey()] = actualCoords;
        this.tetrominoObjects[tetromino.hashKey()] = tetromino;

        // TODO: until I add textures
        tetromino.color = "rgba(" + rand(0, 256) + "," + rand(0, 256) + "," + rand(0, 256) + ", 1)";
    }

    return accepted;
};
surface.prototype.delTetromino = function(tetromino)
{
    var pairs = this.tetrominos[tetromino.hashKey()];

    for (var i in pairs)
    {
        var pair = pairs[i];
        delete this.grid[pair];
    }

    delete this.tetrominos[tetromino.hashKey()];
    delete this.tetrominoObjects[tetromino.hashKey()];
};
surface.prototype.hasTetromino = function(pair) // transforms the coordinate to enable roll-around
{
    pair = this.actualCoord(pair);

    if (this.grid[pair])
    {
        return true;
    }
    else
    {
        return false;
    }
};
surface.prototype.drawSquare = function(size, pair, color)
{
    var x = pair[0];
    var y = pair[1];

    var actualY = this._canvas.height - ((y + 1) * size[1]);

    this._context.fillStyle = color;
    this._context.fillRect(x * size[0], actualY, size[0], size[1]);
};
surface.prototype.drawTetromino = function(singleTileSize, offset, tetr)
{
    // TODO: make these static
    var spritemapWidth = this.spritemap.width / 16;
    var spritemapHeight = this.spritemap.height / 4;
    var spritemapOffsets =
    {
        tLLeft : 0,
        tLRight : 2,
        tZigLeft : 4,
        tZigRight : 7,
        tT : 10,
        tLine : 13,
        tSquare : 14
    }

    var spritemapOffset = spritemapOffsets[getObjectClass(tetr)];

    var x = tetr.x + offset[0];
    var y = tetr.y + offset[1];

    var fractionAngle;

    if (tetr.rotation == tetromino.rotation.up)
    {
        fractionAngle = 0;
    }
    else if (tetr.rotation == tetromino.rotation.right)
    {
        fractionAngle = 0.25;
    }
    else if (tetr.rotation == tetromino.rotation.down)
    {
        fractionAngle = 0.50;
    }
    else
    {
        fractionAngle = 0.75;
    }

    var angle = 2 * Math.PI * fractionAngle;

    var actualX = x * singleTileSize[0];
    var actualY = this._canvas.height - (y * singleTileSize[1]) - (tetr.height * singleTileSize[1]);

    var yAdjustment;
    var xAdjustment;
    
    if (fractionAngle < 0.25)
    {
        xAdjustment = 0;
        yAdjustment = 0;
    }
    else if (fractionAngle < 0.5)
    {
        xAdjustment = 0;
        yAdjustment = tetr.width * singleTileSize[1];
    }
    else if (fractionAngle < 0.75)
    {
        xAdjustment = tetr.width * singleTileSize[0];
        yAdjustment = tetr.height * singleTileSize[1];
    }
    else
    {
        xAdjustment = tetr.height * singleTileSize[0];
        yAdjustment = 0;
    }

    this._context.save();

    this._context.translate(actualX + xAdjustment, actualY + singleTileSize[1] * tetr.height - yAdjustment);
    this._context.rotate(angle);

    var tileSizeMultiplier = Math.abs(Math.sin(angle));
    var rotatedSingleTileSize = [((1 - tileSizeMultiplier) * singleTileSize[0] + tileSizeMultiplier * singleTileSize[1]),
                                 ((1 - tileSizeMultiplier) * singleTileSize[1] + tileSizeMultiplier * singleTileSize[0])];
    var rotatedTileWidth = rotatedSingleTileSize[0] * tetr.width;
    var rotatedTileHeight = rotatedSingleTileSize[1] * tetr.height;

    this._context.drawImage(
        this.spritemap,
        spritemapWidth * spritemapOffset, (4 - tetr.height) * spritemapHeight, spritemapWidth * tetr.width, spritemapHeight * tetr.height,
        0, -rotatedTileHeight, rotatedTileWidth, rotatedTileHeight);

    this._context.restore();
};
surface.prototype.clr = function()
{
    this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
};
surface.prototype.draw = function(offset, percentage)
{
    offset = typeof offset !== 'undefined' ? offset : [0,0];
    percentage = typeof percentage !== 'undefined' ? percentage : 1.0;

    var actualSquareWidth = this._canvas.width / this.width * percentage;
    var actualSquareHeight = this._canvas.height / this.height * percentage;

    if (!this.spritemap)
    {
        pr("Rendering with color and percentage = " + percentage);
        for (var pair in this.grid)
        {
            // TODO: bleh
            var numPair = pair.split(',');
            numPair[0] = parseInt(numPair[0]);
            numPair[1] = parseInt(numPair[1]);

            var tetr = this.grid[pair];
            var color = tetr.color;

            this.drawSquare([actualSquareWidth, actualSquareHeight], [numPair[0] + offset[0], numPair[1] + offset[1]], color);
        }
    }
    else
    {
        pr("Rendering with texture and percentage = " + percentage);
        for (var key in this.tetrominoObjects)
        {
            this.drawTetromino([actualSquareWidth, actualSquareHeight], offset, this.tetrominoObjects[key]);
        }
    }
};
surface.prototype.loadSpritemap = function(path)
{
    // TODO: lots of weird stuff in here
    var img = new Image();
    img.src = path;
    var surfaceObj = this;
    img.onload = function()
    {
        pr("Spritemap loaded with width: " + img.width + ", height: " + img.height);
        surfaceObj.spritemap = img;
        renderFinalImage(surfaceObj);
    };
};

///////////////////////
// THE SCRIPT ITSELF //
///////////////////////

function createNewTetrominoState(pair)
{
    // this "struct" will be used to restore state when a match fails
    // TODO: I should probably use recursion for this
    var tetrominoState =
    {
        randClasses : [tLLeft, tLRight, tZigLeft, tZigRight, tT, tLine, tSquare],
        randRotations : [tetromino.rotation.up, tetromino.rotation.down, tetromino.rotation.left, tetromino.rotation.right],
        randSquares : [0, 1, 2, 3],
        classi : 0,
        rotationi : 0,
        squarei : 0,
        gridX : pair[0],
        gridY : pair[1],
        tetr : null
    }

    return tetrominoState;
};

// TODO: replace with an actual algorithm, like maybe A*
function addTetrominoState(tetrominoState, surface)
{
    var x = tetrominoState.gridX;
    var y = tetrominoState.gridY;
    var resuming = (tetrominoState.tetr != null);

    if (!resuming)
    {
        shuffle(tetrominoState.randClasses);
        tetrominoState.classi = 0;
    }

    for (; tetrominoState.classi < tetrominoState.randClasses.length; tetrominoState.classi += 1)
    {
        if (!resuming)
        {
            var randClass = tetrominoState.randClasses[tetrominoState.classi];
            tetrominoState.tetr = new randClass();
            shuffle(tetrominoState.randRotations);
            tetrominoState.rotationi = 0;
        }

        for (; tetrominoState.rotationi < tetrominoState.randRotations.length; tetrominoState.rotationi += 1)
        {
            if (!resuming)
            {
                var randRotation = tetrominoState.randRotations[tetrominoState.rotationi];
                tetrominoState.tetr.rotation = randRotation;
                shuffle(tetrominoState.randSquares);
                tetrominoState.squarei = 0;
            }

            resuming = false;

            for (; tetrominoState.squarei < tetrominoState.randSquares.length; tetrominoState.squarei += 1)
            {
                var randSquare = tetrominoState.randSquares[tetrominoState.squarei];
                
                var squares = tetrominoState.tetr.squares();
                var square = squares[randSquare];

                var xDiff = square[0];
                var yDiff = square[1];
                tetrominoState.tetr.x = x - xDiff;
                tetrominoState.tetr.y = y - yDiff;

                var absSquares = tetrominoState.tetr.convertToAbs(tetrominoState.tetr.squares());
                var passedCollisionTest = false;

                for (var j in absSquares)
                {
                    if (surface.addTetromino(tetrominoState.tetr))
                    {
                        return true;
                    }
                }
            }
        }
    }

    return false;
};

function renderFinalImage(surface)
{
    surface.clr();

    var fraction = 0.25;
    var itemsPerRow = 1/fraction;

    for (var i = 0; i < itemsPerRow + 1; i += 1)
    {
        for (var j = 0; j < itemsPerRow + 1; j += 1)
        {
            var multiplieri = itemsPerRow/2 + (fraction - i) + 1;
            var multiplierj = itemsPerRow/2 + (fraction - j) + 1;
            surface.draw([surface.width * multiplieri, surface.height * multiplierj], fraction);
        }
    }

    // var i = itemsPerRow/2;
    // var j = itemsPerRow/2;
    // var multiplieri = itemsPerRow/2 + (fraction - i) + 1;
    // var multiplierj = itemsPerRow/2 + (fraction - j) + 1;
    // surface.draw([surface.width * multiplieri, surface.height * multiplierj], fraction);

    // surface.draw([surface.width * 0.5, surface.height * 0.5], 0.5);
    // surface.draw([surface.width * -0.5, surface.height * 0.5], 0.5);
    // surface.draw([surface.width * 1.5, surface.height * 0.5], 0.5);

    // surface.draw([surface.width * 0.5, surface.height * 1.5], 0.5);
    // surface.draw([surface.width * -0.5, surface.height * 1.5], 0.5);
    // surface.draw([surface.width * 1.5, surface.height * 1.5], 0.5);

    // surface.draw([surface.width * 0.5, surface.height * -0.5], 0.5);
    // surface.draw([surface.width * -0.5, surface.height * -0.5], 0.5);
    // surface.draw([surface.width * 1.5, surface.height * -0.5], 0.5);
};

// I can't use yield in my version of JS, so I guess I have to do this
function mainRunner(seed)
{
    // one might think it's stupid to seed a random number generator with a
    // random number from that same generator... and yet... ehm... derr...
    // (seriously though, I needed a human-readable seed to print out)
    seed = typeof seed !== 'undefined' ? seed : (Math.floor(Math.random() * Number.MAX_VALUE));
    this.mathSeed = Math.seedrandom(seed);
    pr("Creating pattern with seed = " + this.mathSeed);

    this.debugIter = 0;
    this.surf = new surface(16, 16);
    this.surf.loadSpritemap("spritemap.png");

    this.tetrominoStates = [];
    this.shouldCreateNew = true;

    this.x = 0;
    this.y = 0;
};
mainRunner.prototype.main = function()
{
    while (this.mainIter()) {}
    renderFinalImage(this.surf);
};
mainRunner.prototype.mainIter = function(print)
{
    var retVal = this.mainIterHelper();
    if (print)
    {
        renderFinalImage(this.surf);   
    }
    return retVal;
};
mainRunner.prototype.mainIterHelper = function()
{
    // this is a nested for loop unfurled into a stateful single iteration; oh yield, how I yearn for thee!
    if (this.y < this.surf.height)
    {
        if (this.x < this.surf.width)
        {
            if (this.surf.hasTetromino([this.x, this.y]))
            {
                this.x += 1;
                return this.mainIter();
            }

            if (this.shouldCreateNew)
            {
                // we're on a roll, keep going
                this.tetrominoStates.push(createNewTetrominoState([this.x, this.y]));
            }
            else
            {
                // we couldn't place the next tetromino piece, so backtrack

                if (this.debugIter >= 1000)
                {
                    // brute force is slow
                    pr("ERROR: hit iteration limit!");
                    return false;
                }

                var failedState = this.tetrominoStates.pop();
                pr("FAILED with " + failedState.tetr);

                var prevTetromino = this.tetrominoStates[this.tetrominoStates.length-1];
                this.surf.delTetromino(prevTetromino.tetr);
                prevTetromino.squarei += 1; // to move it forward one step
                this.x = prevTetromino.gridX;
                this.y = prevTetromino.gridY;

                this.debugIter += 1;
            }

            var tetrominoState = this.tetrominoStates[this.tetrominoStates.length-1];

            // proceed only if the add operation was successful
            this.shouldCreateNew = addTetrominoState(tetrominoState, this.surf);

            if (this.shouldCreateNew)
            {
                pr("PLACED with " + this.tetrominoStates[this.tetrominoStates.length-1].tetr);
            }

            this.x += 1;

            return true;
        }
        else
        {
            this.x = 0;
            this.y += 1;
            return this.mainIter();
        }
    }
    else
    {
        return false;
    }
};

if (true)
{
    var mr = new mainRunner();

    document.onkeydown = function(event)
    {
        event = event || window.event;
        switch(event.keyCode)
        {
            case 39:
                pr("Right arrow pressed!");
                mr.mainIter(true);
                break;
        }
    };
}
else
{
    // TODO: fix seed
    var mr = new mainRunner();
    mr.main();
}

// Interesting seeds:
// 3.3731420304401715e+307
// 5.89213914154486e+307
// 8.984008512770523e+307

// algorithm steps:
// 1. check every empty cell that touches the tetromino
// 2. flood fill each of these cells -- does each flood fill have a number of tiles divisible by 4?
//    (optimization: keep track of the giant empty space above and break early if flood fill hits it)
// 3. if it doesn't, invalid! remove
// 4. in case it doesn't work, ensure that backtracking algorithm is a-ok

/* tetrogen.js by Archagon ; aka, baby's first Javascript program */

//////////////////////
// HELPER FUNCTIONS //
//////////////////////

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

// stolen shamelessly from http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array
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
tetromino.globalId = 0;

function tetromino()
{
    this.rotation = tetromino.rotation.up;
    this.x = 0;
    this.y = 0;
    this.id = tetromino.globalId;
    tetromino.globalId += 1;
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
tetromino.prototype.squares = function()
{
    // I didn't feel like figuring the math out for the rotations, so I just encoded them manually -- sue me!
    return [];
};
tetromino.prototype.absSquares = function()
{
    var squares = this.squares();
    for (var i in squares)
    {
        squares[i][0] += this.x;
        squares[i][1] += this.y;
    }
    return squares;
};
tetromino.prototype.hashKey = function()
{
    return getObjectClass(this) + "-" + this.id;
};

tLLeft.prototype = new tetromino();
tLLeft.prototype.constructor = tLLeft;
tLLeft.superclass = tetromino.prototype;
function tLLeft()
{
    this.color = 'red';
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
    this.color = 'orange';
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
    this.color = 'yellow';
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
    this.color = 'green';
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
    this.color = 'blue';
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
    this.color = 'gray';
};
tLine.prototype.squares = function()
{
    if (this.rotation == tetromino.rotation.up) { return this.decodeSquaresString("00 01 02 03"); }
    if (this.rotation == tetromino.rotation.right) { return this.decodeSquaresString("00 10 20 30"); }
    if (this.rotation == tetromino.rotation.down) { return this.decodeSquaresString("00 01 02 03"); }
    if (this.rotation == tetromino.rotation.left) { return this.decodeSquaresString("00 10 20 30"); }
};

///////////////////
// SURFACE CLASS //
///////////////////

function surface(squareWidth, width, height)
{
    this._canvas = document.getElementById('canvas');
    this._context = canvas.getContext('2d');

    this.tetrominos = {};
    this.grid = {};

    this.squareWidth = squareWidth;
    this.width = width;
    this.height = height;
};
surface.prototype.actualCoord = function(pair)
{
    pair[0] = pair[0].mod(this.width);
    pair[1] = pair[1].mod(this.height);

    return pair;
};
surface.prototype.addTetromino = function(tetromino)
{
    // wtf stop it what are you doing
    if (this.tetrominos[tetromino.hashKey()])
    {
        return false;
    }

    var accepted = true;

    var squares = tetromino.absSquares();
    for (var i in squares)
    {
        var pair = this.actualCoord(squares[i]);

        if (this.grid[pair])
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
};
surface.prototype.hasTetromino = function(pair)
{
    if (this.grid[pair])
    {
        return true;
    }
    else
    {
        return false;
    }
};
surface.prototype.drawSquare = function(pair, color)
{
    var x = pair[0];
    var y = pair[1];

    var actualY = this._canvas.height - ((y + 1) * this.squareWidth);

    this._context.fillStyle = color;
    this._context.fillRect(x * this.squareWidth, actualY, this.squareWidth, this.squareWidth);
};
surface.prototype.draw = function(offset)
{
    offset = typeof offset !== 'undefined' ? offset : [0,0];

    for (var pair in this.grid)
    {
        // TODO: bleh
        numPair = pair.split(',');
        numPair[0] = parseInt(numPair[0]);
        numPair[1] = parseInt(numPair[1]);

        tetr = this.grid[pair];
        color = tetr.color;
        this.drawSquare([numPair[0] + offset[0], numPair[1] + offset[1]], color);
    }
};

///////////////////////
// THE SCRIPT ITSELF //
///////////////////////

function createNewTetrominoState(pair)
{
    // this "struct" will be used to restore state when a match fails
    var tetrominoState =
    {
        randClasses : [tLLeft, tLRight, tZigLeft, tZigRight, tT, tLine],
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

// TODO: scramble each rand array for each iteration
function addTetrominoState(tetrominoState, surface)
{
    var x = tetrominoState.gridX;
    var y = tetrominoState.gridY;
    var resuming = (tetrominoState.tetr != null);
    var debugWasResuming = resuming;

    shuffle(tetrominoState.randClasses);
    tetrominoState.classi = 0;

    for (; tetrominoState.classi < tetrominoState.randClasses.length; tetrominoState.classi += 1)
    {
        // if (!resuming)
        // {
            var randClass = tetrominoState.randClasses[tetrominoState.classi];
            tetrominoState.tetr = new randClass();
            shuffle(tetrominoState.randRotations);
            tetrominoState.rotationi = 0;
        // }
        // else
        // {
        //     pr("resuming (" + tetrominoState.tetr.hashKey() + ") with " + tetrominoState.classi + ", " + tetrominoState.rotationi + ", " + tetrominoState.squarei);
        // }

        for (; tetrominoState.rotationi < tetrominoState.randRotations.length; tetrominoState.rotationi += 1)
        {
            // if (!resuming)
            // {
                var randRotation = tetrominoState.randRotations[tetrominoState.rotationi];
                tetrominoState.tetr.rotation = randRotation;
                shuffle(tetrominoState.randSquares);
                tetrominoState.squarei = 0;
            // }

            // resuming = false;

            for (; tetrominoState.squarei < tetrominoState.randSquares.length; tetrominoState.squarei += 1)
            {
                // if (debugWasResuming)
                // {
                    pr("trying (" + tetrominoState.tetr.hashKey() + ") with " + tetrominoState.squarei + ", " + tetrominoState.rotationi + ", " + tetrominoState.classi);
                // }

                var randSquare = tetrominoState.randSquares[tetrominoState.squarei];
                
                var squares = tetrominoState.tetr.squares();
                var square = squares[randSquare];

                var xDiff = square[0];
                var yDiff = square[1];
                tetrominoState.tetr.x = x - xDiff;
                tetrominoState.tetr.y = y - yDiff;

                var absSquares = tetrominoState.tetr.absSquares();
                var passedCollisionTest = false;

                for (var j in absSquares)
                {
                    if (surface.addTetromino(tetrominoState.tetr))
                    {
                        pr("success!!!!!");
                        return true;
                    }
                }
            }
        }
    }

    pr("failure :(");
    return false;
};

function main()
{
    var debugIter = 0;
    var surf = new surface(16, 8, 8);

    var tetrominoStates = [];
    var shouldCreateNew = true;

    for (var y = 0; y < surf.height; y += 1)
    {
        for (var x = 0; x < surf.width; x += 1)
        {
            if (surf.hasTetromino([x, y]))
            {
                continue;
            }

            if (true)//shouldCreateNew)
            {
                tetrominoStates.push(createNewTetrominoState([x,y]));
            }
            else
            {
                if (debugIter >= 500)
                {
                    pr("ERROR: hit iteration limit!");
                    surf.draw();
                    return;
                }

                tetrominoStates.pop();

                if (tetrominoStates.length == 0)
                {
                    pr("ERROR: popped all states!");
                    surf.draw();
                    return;
                }

                var prevTetromino = tetrominoStates[tetrominoStates.length-1];
                surf.delTetromino(prevTetromino.tetr);
                prevTetromino.squarei += 1; // to move it forward one step
                x = prevTetromino.gridX;
                y = prevTetromino.gridY;

                pr("back to " + x + ", " + y);
                debugIter += 1;
            }

            var tetrominoState = tetrominoStates[tetrominoStates.length-1];

            // proceed only if the add operation was successful
            shouldCreateNew = addTetrominoState(tetrominoState, surf);
        }
    }

    surf.draw();
    surf.draw([surf.width, 0]);
    surf.draw([0, surf.height]);
    surf.draw([surf.width, surf.height]);
};

main();
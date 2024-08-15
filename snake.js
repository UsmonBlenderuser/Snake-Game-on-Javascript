const scoreHtml = document.getElementById('score')
const BestscoreHtml = document.getElementById('bestscore')

let direction = 'right'
let snakeLangth = 20
let score = 0
let deshboard = [20, 20]
let position = [deshboard[0]/2-1, deshboard[1]/2]

let applePosition = []

let deshboardBlocks = []

let canMove = false
let canTurn = true

let tail = [position.slice()]

let speed = 200

let Game = null;



scoreHtml.innerHTML = 'score: 0'
BestscoreHtml.innerHTML = 'Best score: ' + localStorage.getItem('Bestscore')



function Save(){
    speed = parseInt(document.querySelector('.Speedinput').value) || 200

    deshboard[0] = parseInt(document.querySelector('.borderX').value) || 20
    deshboard[1] = parseInt(document.querySelector('.borderY').value) || 20

    Reset()
}

function GetreadyDashboard(){
    deshboardBlocks = []
    for(let row = 0; row <= deshboard[1]; row ++){
        deshboardBlocks.push(newBlock(0, -1))
    }
}

function newBlock(x, y){

    let blocks = []

    for(let block = 0; block <= deshboard[0]; block ++){
        if (block == x && y != -1){
            blocks.push(snakeLangth)
        } else {
            blocks.push(0)
        }
    }

    return blocks.slice()
}

function up(){
    if (direction != 'down' && canMove && canTurn){
        direction = 'up'
        canTurn = false
        setTimeout(function(){
            canTurn = true
        }, parseInt(speed/2)+10)
    }
}

function down(){
    if (direction != 'up' && canMove && canTurn){
        direction = 'down'
        canTurn = false
        setTimeout(function(){
            canTurn = true
        }, parseInt(speed/2)+10)
    }
}

function left(){
    if (direction != 'right' && canMove && canTurn){
        direction = 'left'
        canTurn = false
        setTimeout(function(){
            canTurn = true
        }, parseInt(speed/2)+10)
    }
}

function right(){
    if (direction != 'left' && canMove && canTurn){
        direction = 'right'
        canTurn = false
        setTimeout(function(){
            canTurn = true
        }, parseInt(speed/2)+10)
    }
}

function eat(){

    // snakeLangth += 1
    addApple()
    score += 1

    scoreHtml.innerHTML = 'score: ' + JSON.stringify(score)
    BestscoreHtml.innerHTML = 'Best score: ' +  localStorage.getItem('Bestscore')

}

function checkLife(x, y){
    if((x == deshboard[0]) || (y == deshboard[1]) || (x == 0) || (y == 0)){
        canMove = false
        let lastBest = parseInt(localStorage.getItem('Bestscore')) || 0
        let newBest = Math.max(score, lastBest)
        
        alert('You are dead!! ). your score is ' + score + '\nYour Best score is ' + newBest)
        localStorage.setItem('Bestscore', newBest)

    }
    if((deshboardBlocks[y][x] > 0 - score)){
        alert('You are dead!! ). your score is ' + score)
        canMove = false
        let lastBest = parseInt(localStorage.getItem('Bestscore')) || 0
        let newBest = Math.max(score, lastBest)

        localStorage.setItem('Bestscore', newBest)
    }
}


function addApple(){

    let freeSpaces = []
    
    console.log(JSON.stringify(deshboardBlocks))

    for(let row = 1; row < deshboard[1]; row ++){
        for(let block = 1; block < deshboard[0]; block ++){
            
            if(deshboardBlocks[row][block] >= 1 - score){
                let passs;
                passs = 1
            }else{
                freeSpaces.push([row, block])
            }

            // if(deshboardBlocks[row][block] < score + 1){
            // }
        }
    }
    // console.log(freeSpaces.length)
    if(freeSpaces.length == 0){
        alert('Cangratulations !! you win this game')
    } else {
        let randomNumber = (Math.floor(Math.random() * 1000))%(freeSpaces.length);

        let randpose = freeSpaces[randomNumber]

        // console.log(JSON.stringify(freeSpaces))

        applePosition = [randpose[1], randpose[0]]

        deshboardBlocks[randpose[0]][randpose[1]] = -999
    }
}


function move(dir){

    let xpos = position[0], ypos = position[1]
    if(canMove){
        if(dir == 'down'){
            ypos += 1
        }
        if(dir == 'up'){
            ypos -= 1
        }
        if(dir == 'left'){
            xpos -= 1
        }
        if(dir == 'right'){
            xpos += 1
        }
    }

    checkLife(xpos, ypos)

    if(canMove){


        // console.log(JSON.stringify(deshboardBlocks))
        
        deshboardBlocks[ypos][xpos] = snakeLangth;

        tail.push(position)

        position = [xpos, ypos]
        
        // console.log(applePosition, [xpos, ypos])

        if(JSON.stringify(applePosition) == JSON.stringify([xpos, ypos])){
            eat()
        }

        // console.log(position)

        refreshDeshboard()
    }
} 

function refreshDeshboard(){

    let htmlDesh = '<br>'

    for(let row = 0; row <= deshboard[1]; row ++){
        for(let block = 0; block <= deshboard[0]; block ++){
            
            if(deshboardBlocks[row][block] >= 1 - score){
                deshboardBlocks[row][block] -= 1
            }

            if(row == 0 || row == deshboard[1] || block == 0 || block == deshboard[0]){
                htmlDesh += '<button class="yellowBoard">'
            } else {

                if(deshboardBlocks[row][block] == 0 - score){
                    htmlDesh += '<button class="blackBoard">'
                } else if(deshboardBlocks[row][block] > 0 - score){
                    htmlDesh += '<button class="snakeTail">'
                } else if(deshboardBlocks[row][block] >= -999) {
                    htmlDesh += '<button class="apple">'
                }
            }

            htmlDesh += "0</button>";

            // console.log(htmlDesh)
        }
        htmlDesh += '<br>'
    }
    document.querySelector('.dashboard').innerHTML = (htmlDesh)
}

function Reset(){
    canMove = true
    score = 0
    snakeLangth = 5
    position = [deshboard[0]/2-1, deshboard[1]/2]
    direction = 'right'

    GetreadyDashboard()

    addApple()

    if(!Game){
        Game = setInterval(function() {
            if(canMove){
                move(direction)
            }
        } , speed)
    }
}

function Pause(){
    canMove = !canMove
}

// GetreadyDashboard()

// addApple()

// setInterval(function() {
//     if(canMove){
//         move(direction)
//     }
// } , speed)



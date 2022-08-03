import { grabImage } from './images.js'
import { getBorder, getAdjacentTerritories } from './borders.js'
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const green = '#00ff00'
const red = '#ff0000'
const blue = '#0000ff'
const yellow = '#ffff00'
const orange = '#ffa500'
const gray = '#808080'
const black = '#000000'
const white = '#ffffff'
canvas.height = window.document.defaultView.innerHeight-20
canvas.width = window.document.defaultView.innerWidth-20
class Map{
    constructor(){
        this.map = grabImage('riskMap')
        this.territories = ['Alaska','Alberta','Central America','Eastern United States','Greenland','Northwest Territory',
        'Ontario','Quebec','Western United States','Argentina','Brazil','Peru','Venezuela','Great Britian','Iceland','Russia',
        'Northern Europe','Scandinavia','Southern Europe','Western Europe','Congo','East Africa','Egypt','Madagascar',
        'North Africa','South Africa','Eastern Australia','Indonesia','New Guinea','Western Australia','Afghanistan',
        'China','India','Irkutsk','Japan','Kamchatka','Middle East','Mongolia','Siam','Siberia','Ural','Yakutsk']
        this.continents = ['Asia','North America','South America','Europe','Austrailia','Africa']
        this.continentTerritories = {
            'Asia': ['Afghanistan','China','India','Irkutsk','Japan','Kamchatka',
            'Middle East','Mongolia','Siam','Siberia','Ural','Yakutsk'],
            'North America': ['Alaska','Alberta','Central America','Eastern United States',
            'Greenland','Northwest Territory','Ontario','Quebec','Western United States'],
            'South America': ['Argentina','Brazil','Peru','Venezuela'],
            'Europe': ['Great Britian','Iceland','Russia','Northern Europe',
            'Scandinavia','Southern Europe','Western Europe'],
            'Austrailia': ['Eastern Australia','Indonesia','New Guinea','Western Australia'],
            'Africa': ['Congo','East Africa','Egypt','Madagascar','North Africa','South Africa']
        }
        this.continentBonuses = {
            'Asia': 7,
            'North America': 5,
            'South America': 2,
            'Europe': 5,
            'Australia': 2,
            'Africa': 3
        }
        this.widthTimer = 0
        this.countup = true
        this.selectedTerritory = undefined
        this.turn = green
    }
    draw(){
        const { width: w, height: h } = this.map
        const ratio = w/(w+h)
        let width = 0
        let height = 0
        if(ratio>canvas.width/(canvas.width+canvas.height)){
            width = canvas.width
            height = width*ratio
        }
        else{
            height = canvas.height
            width = height*(1/ratio)
        }
        ctx.drawImage(this.map,0,0,width,height)
        if(this.selectedTerritory != undefined){
            if(this.countup == true){
                this.widthTimer += 60/fps
                if(this.widthTimer >= 60){
                    this.countup = false
                }
            }
            else{
                this.widthTimer -= 60/fps
                if(this.widthTimer <= 0){
                    this.countup = true
                }
            }
            const adjacentTerritories = getAdjacentTerritories(this.selectedTerritory)
            for(let i=0; i<adjacentTerritories.length; i++){
                this.drawBorder(adjacentTerritories[i],red,(3+this.widthTimer/36)/(w/width))
            }
            this.drawBorder(this.selectedTerritory,green,(3+this.widthTimer/12)/(w/width))
        }
    }
    drawBorder(territory,color,lineWidth){
        const { width: w, height: h } = this.map
        const ratio = w/(w+h)
        let width = 0
        let height = 0
        if(ratio>canvas.width/(canvas.width+canvas.height)){
            width = canvas.width
            height = width*ratio
        }
        else{
            height = canvas.height
            width = height*(1/ratio)
        }
        const border = getBorder(territory)
        ctx.beginPath()
        ctx.strokeStyle = color
        ctx.moveTo(border[0][0]/(w/width),border[0][1]/(h/height))
        for(let i=1; i<border.length; i++){
            const dif1 = border[i][0]-border[i-1][0]
            const dif2 = border[i][1]-border[i-1][1]
            const dif = Math.sqrt(Math.pow(dif1,2)+Math.pow(dif2,2))
            if(dif>40){
                ctx.moveTo(border[i][0]/(w/width),border[i][1]/(h/height))
            }
            else{
                ctx.lineTo(border[i][0]/(w/width),border[i][1]/(h/height))
            }
            if(i == border.length-1){
                const dif3 = Math.sqrt(Math.pow(border[0][0]-border[i][0],2)+Math.pow(border[0][1]-border[i][1],2))
                if(dif3<50){
                    ctx.lineTo(border[0][0]/(w/width),border[0][1]/(h/height))
                }
            }
        }
        ctx.lineWidth = lineWidth
        ctx.stroke()
    }
    wasClicked(e){
        const { width: w, height: h } = this.map
        const ratio = w/(w+h)
        let width = 0
        let height = 0
        if(ratio>canvas.width/(canvas.width+canvas.height)){
            width = canvas.width
            height = width*ratio
        }
        else{
            height = canvas.height
            width = height*(1/ratio)
        }
        const x = (e.pageX-10)/(width/w)
        const y = (e.pageY-10)/(height/h)
        for(let i=0; i<this.territories.length; i++){
            const border = getBorder(this.territories[i])
            if(border.length>0){
                const b1 = border.find(b => b[0]<x && b[1]<y)
                const b2 = border.find(b => b[0]>x && b[1]<y)
                const b3 = border.find(b => b[0]<x && b[1]>y)
                const b4 = border.find(b => b[0]>x && b[1]>y)
                if(b1 != undefined && b2 != undefined && b3 != undefined && b4 != undefined){
                    this.selectedTerritory = this.territories[i]            
                }
            }
        }
    }
}
class Game{
    constructor(){
        this.map = new Map()
        this.screen = 'mainMenu'
        this.interactives = {
            'mainMenu': [new Button(canvas.width/2,canvas.height/2,150,64,'Play',48,blue,red,function(){game.screen = 'gameSettings'}),new Button(canvas.width/2,canvas.height/2+74,150,64,'How',48,blue,red,function(){game.screen = 'how'})],
            'how': [new Button(canvas.width/2,canvas.height/1.5,150,64,'Back',48,blue,red,function(){game.screen = 'mainMenu'})],
            'gameSettings': [new Adjuster(canvas.width/2-75,canvas.height/2.5-85,150,50,[2,3,4,5,6],2,'Players'),new Button(canvas.width/2,canvas.height/1.15,150,64,'Back',48,blue,red,function(){game.screen = 'mainMenu'}),
            new Button(canvas.width/2,canvas.height/1.4,150,64,'Play',48,blue,red,function(){game.screen = 'gameSetup'})],
            'gameSetup': [this.map]
        }
    }
    draw(){
        this[this.screen]()
        for(let i=0; i<this.interactives[this.screen].length; i++){
            this.interactives[this.screen][i].draw()
        } 
    }
    mainMenu(){
        this.map.draw()
        ctx.fillStyle = red
        ctx.font = '128px Arial'
        const width = ctx.measureText('RISK').width
        ctx.fillText('RISK',canvas.width/2-width/2,128)
    }
    how(){
        this.map.draw()
        ctx.fillStyle = black
        ctx.font = '36px Arial'
        const txt = 'Nothing here yet'
        const width = ctx.measureText(txt).width
        ctx.fillText(txt,canvas.width/2-width/2,canvas.height/3)
    }
    gameSettings(){
        this.map.draw()
    }
    gameSetup(){
        this.map.draw()
    }
    wasClicked(e){
        for(let i=0; i<this.interactives[this.screen].length; i++){
            this.interactives[this.screen][i].wasClicked(e)
        }
    }
    updatePos(){
        this.interactives = {
            'mainMenu': [new Button(canvas.width/2,canvas.height/2,150,64,'Play',48,blue,red,function(){game.screen = 'gameSettings'}),new Button(canvas.width/2,canvas.height/2+74,150,64,'How',48,blue,red,function(){game.screen = 'how'})],
            'how': [new Button(canvas.width/2,canvas.height/1.5,150,64,'Back',48,blue,red,function(){game.screen = 'mainMenu'})],
            'gameSettings': [new Adjuster(canvas.width/2-75,canvas.height/2.5-85,150,50,[2,3,4,5,6],2,'Players'),new Button(canvas.width/2,canvas.height/1.15,150,64,'Back',48,blue,red,function(){game.screen = 'mainMenu'}),
            new Button(canvas.width/2,canvas.height/1.4,150,64,'Play',48,blue,red,function(){game.screen = 'gameSetup'})]
        }
    }
}
class Button{
    constructor(x,y,w,h,txt,fontSize,buttonColor,txtColor,fn,centerX=true,centerY=true){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.txt = txt
        this.fontSize = fontSize
        this.buttonColor = buttonColor
        this.txtColor = txtColor
        if(centerX == true){
            this.x -= this.w/2
        }
        if(centerY == true){
            this.y -= this.h/2
        }
        this.fn = fn
    }
    draw(){
        ctx.fillStyle = this.buttonColor
        ctx.fillRect(this.x,this.y,this.w,this.h)
        ctx.fillStyle = this.txtColor
        ctx.font = this.fontSize+'px Arial'
        const width = ctx.measureText(this.txt).width
        let y = this.y+this.h/2+this.fontSize/3
        const lowerLetters = ['p','q','y','g','j']
        for(let i=0; i<this.txt.length; i++){
            if(lowerLetters.find(l => l == this.txt[i])){
                y -= this.fontSize/12
                break
            }
        }
        ctx.fillText(this.txt,this.x+this.w/2-width/2,y)
    }
    wasClicked(e){
        const x = e.pageX-10
        const y = e.pageY-10
        if(x>=this.x && x<=this.x+this.w && y<=this.y+this.h && y>=this.y){
            this.fn()
        }
    }
}
class Adjuster{
    constructor(x,y,w,h,choices,choiceNumber,title,fontSize=36){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.choices = choices
        this.choiceNumber = choiceNumber
        this.fontSize = fontSize
        this.title = title
    }
    draw(){
        ctx.fillStyle = gray
        ctx.fillRect(this.x,this.y,this.w,this.h)
        ctx.fillStyle = black
        ctx.font = this.fontSize+'px Arial'
        let width = ctx.measureText(this.choices[this.choiceNumber]).width
        ctx.fillText(this.choices[this.choiceNumber],this.x+this.w/2-width/2,this.y+this.h/2+this.fontSize/3)
        width = ctx.measureText(this.title).width
        ctx.fillText(this.title,this.x+this.w/2-width/2,this.y-this.fontSize/3)
        ctx.fillStyle = green
        ctx.beginPath()
        ctx.moveTo(this.x+this.w+10,this.y)
        ctx.lineTo(this.x+this.w+10+this.h/2,this.y+this.h/2)
        ctx.lineTo(this.x+this.w+10,this.y+this.h)
        ctx.lineTo(this.x+this.w+10,this.y)
        ctx.moveTo(this.x-10,this.y)
        ctx.lineTo(this.x-10-this.h/2,this.y+this.h/2)
        ctx.lineTo(this.x-10,this.y+this.h)
        ctx.lineTo(this.x-10,this.y)
        ctx.fill()
        ctx.lineWidth = 2
        ctx.stroke()
    }
    wasClicked(e){
        const x = e.pageX-10
        const y = e.pageY-10
        if(x>=this.x+this.w+10 && x<=this.x+this.w+this.h/2+10 && x-((this.x+this.w+10)-this.y)<=y && y<=-x+(this.y+this.h+this.x+this.w+10)){
            if(this.choiceNumber == this.choices.length-1){
                this.choiceNumber = 0
            }
            else{
                this.choiceNumber += 1
            }
        }
        if(x>=this.x-10-this.h/2 && x<=this.x-10 && y>=-x+(this.y+this.x-10) && x-((this.x-10-this.h)-this.y)>=y){
            if(this.choiceNumber == 0){
                this.choiceNumber = this.choices.length-1
            }
            else{
                this.choiceNumber -= 1
            }
        }
    }
}
const game = new Game()
let timer = 0
let fps = 60
function mainLoop(){
    timer += 1
    ctx.fillStyle = white
    ctx.fillRect(0,0,canvas.width,canvas.height)
    game.draw()
    ctx.fillStyle = black
    ctx.font = '10px Arial'
    ctx.fillText(fps,50,50)
    requestAnimationFrame(mainLoop)
}
mainLoop()
window.addEventListener('resize',function(e){
    canvas.height = e.currentTarget.innerHeight-20
    canvas.width = e.currentTarget.innerWidth-20
    game.updatePos()
})
window.addEventListener('mousedown',function(e){
    game.wasClicked(e)
})
setInterval(() => {
    fps = timer
    timer = 0
},1000)
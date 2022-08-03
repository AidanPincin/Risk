function image(src){const img = new Image(); img.src = src; return img}
const images = {
    riskMap: image('Images/riskMap.webp')
}
export function grabImage(name){
    return images[name]
}
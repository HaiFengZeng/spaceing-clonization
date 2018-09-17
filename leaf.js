/**
 * Created by zenghaifeng on 16/11/19.
 */
function Leaf(x,y) {
    if(x===undefined&&y==undefined){
        this.pos=createVector(random(width),random(height)-100);
    }
    else {
        this.pos=createVector(x,y);
    }
    this.reached=false;
    this.show=function () {
        fill(255);
        noStroke();
        ellipse(this.pos.x,this.pos.y,3,3);
    }

}
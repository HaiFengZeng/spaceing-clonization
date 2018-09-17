/**
 * Created by zenghaifeng on 16/11/19.
 */
var tree;
var h;
var rains;
function setup () {
    createCanvas(800, 600);
    let hearts = randHeart(500);
    tree = new Tree(hearts);
}

function draw () {
    background(255);
    // h.show();
    tree.show();
    tree.grow();
}
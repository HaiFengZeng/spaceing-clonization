/**
 * Created by zenghaifeng on 16/11/19.
 */
function Leaf (x, y) {
    if (x === undefined && y == undefined) {
        this.pos = createVector(random(width), random(height) - 100);
    }
    else {
        this.pos = createVector(x, y);
    }
    this.reached = false;
    this.show = function () {
        fill(255);
        noStroke();
        ellipse(this.pos.x, this.pos.y, 3, 3);
    }

}
// rains bring me inspirations
// love you anyway
function rain () {

}


let rainList = [];


function Branch (pos, parent, dir) {
    this.pos = pos;
    this.parent = parent;
    this.dir = dir;
    this.orignalDir = this.dir.copy();
    this.count = 0;
    this.length = 7;
    this.sw = 5;
    this.lifeSpan = 1000;
    // try to find the branch who has no children
    this.children = 0;
    this.drawHeart = random() < 0.52;
    this.hasHeart = false;
    this.flag = true;
    this.toRain = random() < 0.05;
    this.rgb = [255, random(2), random(1)];
    this.ratio = 0.99;
    if (parent) {
        this.rgb[0] = this.parent.rgb[0] * this.ratio;
        this.rgb[1] = this.parent.rgb[1] * (this.ratio + 0.05);
        this.rgb[2] = this.parent.rgb[2] * (this.ratio + 0.08);
    }

    this.shake = function () {
        this.pos.x += random(2) * -1;
        this.pos.y += random(2) * -1;
    };
    this.next = function () {
        let dir_len = p5.Vector.mult(this.dir, this.length);
        let nextPos = p5.Vector.add(this.pos, dir_len);
        let nextBranch = new Branch(nextPos, this, this.dir.copy());
        nextBranch.sw = this.sw * 0.99;
        this.children++;
        return nextBranch;
    };
    this.reset = function () {
        this.count = 0;
        this.dir = this.orignalDir.copy();
    };
    let h;
    if (this.children == 0 && this.parent && this.drawHeart && !this.hasHeart) {
        let alpha = atan2(this.dir.y, this.dir.x) + PI / 2;
        let center = createVector(this.parent.pos.x, this.parent.pos.y);
        let r = 6 + random(1, 2);
        h = new Heart(50, r, center);
        h.rotatePoints(alpha);
    }
    this.show = function () {
        if (this.parent) {
            strokeWeight(this.sw);
            stroke(interplot(this.parent.rgb[0], this.rgb[0], 0.3),
                interplot(this.parent.rgb[1], this.rgb[1], 0.3),
                interplot(this.parent.rgb[2], this.rgb[2], 0.3)
            );
            line(this.parent.pos.x, this.parent.pos.y, this.pos.x, this.pos.y);
            if (h && this.children == 0 && this.lifeSpan > 0) {
                this.hasHeart = true;
                h.show();
                this.lifeSpan--;

            }
            if (this.hasHeart) {
                if (this.toRain) {
                    h.acc.x = (random() - 0.5) * 0.0008;
                    h.acc.y = (random()) * 1.02;
                    h.update();
                    h.rgb.a = this.lifeSpan * 255 / 1000;
                    h.rotatePoints(0.05 + (random() - 0.5) * 0.15);
                }
            }

        }
    }
}

function interplot (a, b, t) {
    return a * t + b * (1 - t);
}


function Heart (pointsNum, r, center) {
    this.shape = random() > 0.2 ? "shape" : "clover";
    let num = pointsNum || 80;
    this.points = new Array(num);
    this.R = r || 150;
    this.acc = createVector(0, 0);
    this.vel = createVector(0, 0);
    this.center = center || createVector(width / 2, height / 2);
    this.rgb = { r: 255, g: 125 * random(), b: 160 * random(), a: 255 };
    if (this.shape === "clover") {
        for (let i = 0; i < pointsNum; i++) {
            let alpha = i * Math.PI * 2 / pointsNum;
            let a = Math.atan2(sin(alpha), cos(alpha));
            let r = 0.4 * this.R + 0.4 * this.R * cos(3 * a);
            let s = 0.4 * this.R + 0.8 * this.R * Math.pow(r, 0.1);
            s -= 0.05 * this.R * cos(6 * a);
            let x = this.center.x + s * cos(alpha);
            let y = this.center.y + s * sin(alpha);
            this.points[i] = createVector(x, y);
        }
    } else {
        for (let i = 0; i < pointsNum; i++) {
            let theta = i * Math.PI * 2 / pointsNum;
            let x = this.R * cos(theta);
            let y = this.R * sin(theta) + 2.1 * Math.pow(x * x, 1 / 3);
            this.points[i] = createVector(this.center.x + x, -y + this.center.y);
        }
    }

    this.rotatePoints = function (a) {
        let c = cos(a),
            s = sin(a);
        for (let i = 0; i < this.points.length; i++) {
            let p = this.points[i];
            p.x -= center.x;
            p.y -= center.y;
            let x = p.x * c - p.y * s;
            let y = p.x * s + p.y * c;
            p.x = x + center.x, p.y = y + center.y;
        }
    };
    this.show = function () {
        noStroke();
        fill(this.rgb.r, this.rgb.g, this.rgb.b, this.rgb.a);
        beginShape();
        for (let i = 0; i < this.points.length; i++) {
            let p = this.points[i];
            vertex(p.x, p.y);
        }
        vertex(this.points[0].x, this.points[0].y);
        endShape();
    };
    this.update = function () {
        this.vel.add(this.acc);
        for (let i = 0; i < this.points.length; i++) {
            this.points[i].add(this.vel);
        }
        this.acc.mult(0);
    };

    this.applyForce = function (force) {
        this.acc.add(force);
    }
}


let min_dist = 7;
let max_dist = 100;
function hearts (pointsNum, cx, cy) {
    let points = [];
    for (let i = 0; i < pointsNum; i++) {
        let theta = i * Math.PI * 2 / pointsNum;
        let R = 100;
        let x = R * cos(theta);
        let y = R * sin(theta) + 2.1 * Math.pow(x * x, 1 / 3);
        points.push(createVector(cx + x, -y + cy));
    }
    return points;
}
function randHeart (count) {
    let k = 0,
        leaves = [];
    while (k < count * 2) {
        while (true) {
            let x = 3 * (random() - 0.5);
            let y = 2.8 * random() - 1;
            if (0.8 * x * x + (y - Math.pow(x * x, 1 / 3)) * (y - Math.pow(x * x, 1 / 3)) < 1.2) {
                leaves.push(new Leaf(400 + x * 200, 350 - y * 200));
                k += 1;
                break;
            }
        }
    }
    return leaves;
}
function Tree (leaveShape) {
    this.leaves_count = 500;
    this.leaves = leaveShape;
    this.branches = [];
    let pos = createVector(width / 2, height / 2);
    let root_dir = createVector(0, -1);
    let root = new Branch(pos, null, root_dir);
    let found = false;
    let current = root;
    this.branches.push(root);
    // set the first branch
    while (!found) {
        for (let i = 0; i < this.leaves.length; i++) {
            let d = p5.Vector.dist(current.pos, this.leaves[i].pos);
            if (d < min_dist) {
                found = true;
            }
        }
        if (!found) {
            let root_next_branch = current.next();
            root_next_branch.flag = false;
            current = root_next_branch;
            this.branches.push(root_next_branch);
        }
    }
    // for now there many branches
    //the tree will grow
    this.grow = function () {
        for (let i = 0; i < this.leaves.length; i++) {
            let leaf = this.leaves[i];
            let closetBranch = null;
            let closestDist = 100000;
            for (let j = 0; j < this.branches.length; j++) {
                let branch = this.branches[j];
                // search the closest brach
                let dist = p5.Vector.dist(branch.pos, leaf.pos);
                if (dist < min_dist) {
                    leaf.reached = true;
                } else if (dist < max_dist) {
                    if (dist < closestDist) {
                        closestDist = dist;
                        closetBranch = branch;
                    }
                } else {

                }
            }

            if (closetBranch) {
                let dir = p5.Vector.sub(leaf.pos, closetBranch.pos);
                dir.normalize();
                closetBranch.dir.add(dir);
                closetBranch.count++;
            }
        }
        for (let i = this.leaves.length - 1; i >= 0; i--) {
            if (this.leaves[i].reached) {
                this.leaves.splice(i, 1);
            }
        }
        for (let i = this.branches.length - 1; i >= 0; i--) {
            if (this.branches[i].count > 0) {
                this.branches[i].dir.div(this.branches[i].count + 1);
                this.branches.push(this.branches[i].next());
            }

        }
        for (let i = 0; i < this.branches.length; i++) {
            this.branches[i].reset();
        }
    };
    this.show = function () {
        //show leaves
        // for (let i = 0; i < this.leaves.length; i++) {
        //     this.leaves[i].show();
        // }
        //show branches
        for (let i = 0; i < this.branches.length; i++) {
            if (this.branches[i].flag) {
                this.branches[i].show();
            }


        }
    }
}
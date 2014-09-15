console.log('Hello World!');

var dataNum = 200;
var clusterNum = 4;
var centroid = true;
var first = false;

clusterColor = ['#a00', '#aa0', '#0a0', '#00a', '#0aa']
centroidColor = ['#f00', '#ff0', '#0f0', '#00f', '#0ff']

//  Stepを進めるボタン
var button = d3.select('body')
                .append('div')
                .style({
                    'background-color': 'red',
                    'height': '80px',
                    'width': '80px'
                })
                .on('click', function () {
                    if (!first) {
                        firstCluster();
                    } else {
                        if (centroid) {
                            calCentroid();
                        } else {
                            calDistance();
                        }
                    }
                })

// 二つの正規分布などからサンプリングしたい
var svg = d3.select('body').append('svg')
    .style({
        'height': '400px',
        'width': '400px'
    });

dataset = []

for (var i = 0; i < dataNum; i++) {
    rand = parseInt((Math.random() * clusterNum), 10);
    obj = {
        x: parseInt(normalRand(80 * rand + 100, 20), 10),
        y: parseInt(normalRand(80 * rand + 100, 20), 10),
        cluster: parseInt(Math.random() * clusterNum, 10) + 1
    }
    console.log('x = ' + obj.x, 'y = ' + obj.y)
    dataset.push(obj);
}

// データを点として打つ
var dataPoint = svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('circle')
    .attr({
        'class': 'data',
        cx : function(d){ return d.x; },
        cy : function(d){ return d.y; },
        r : 0,
        // height : function(d){ return d; },
        'cluster' : function(d){ return d.cluster; }
        // fill : function(d){ return clusterColor[d.cluster]; }
    })
    .transition()
    // .delay(function(d, i){
    //     return i * 5;
    // }) 
    .duration(150)
    .ease('bounce')
    .attr({
        r: 5
    });

var centroidArr = []
// for (var cnt = 0; cnt < 20; cnt ++) {
function firstCluster () {
    d3.selectAll('.data')
        .data(dataset)
        .attr({
            fill : function(d){ return clusterColor[d.cluster]; }
    })

    first = true;
}

function calCentroid () {
    var dataset = d3.selectAll('.data')[0];    
    console.log(d3.selectAll('.centroid'));

    
    // 重心の作成
    for (var i = 1; i <= clusterNum; i++) {
        var c = {
            "x": d3.mean(dataset, function (d) {
                x = d.getAttribute('cx');
                cluster = d.getAttribute('cluster');
                // console.log('x=' + x, ' cluster=' + cluster)

                if (cluster == i) {
                    return parseInt(x, 10);
                }
            }),
            "y": d3.mean(dataset, function (d) {
                y = d.getAttribute('cx');
                cluster = d.getAttribute('cluster');

                if (cluster == i) {
                    return parseInt(y, 10);
                }
            }),
            "cluster": i
        }
        centroidArr[i - 1] = c;
        // console.log(c)
    }

    console.log(d3.selectAll('.centroid'));

    if (d3.selectAll('.centroid')[0].length > 0) {
        console.log('あるよ！');
        // for (var i = 1; i <= centroidArr.length; i++) {
        //     console.log(svg.selectAll('.cluster' + i));

        svg.selectAll('.centroid')
            .data(centroidArr)
            .transition()
            .duration(300)
            .ease('bounce')
            .attr({
                cx : function(d) { return d.x; },
                cy : function(d) { return d.y; }
            });
        // }
    } else {
        console.log('ないよ！');
         // データを点として打つ
        svg.selectAll('rect')
            .data(centroidArr)
            .enter()
            .append('circle')
            .attr({
                cx : function(d){ return d.x; },
                cy : function(d){ return d.y; },
                r : 0,
                'class': function(d){ return 'centroid cluster' + d.cluster; },
                // height : function(d){ return d; },
                fill : function(d){ return centroidColor[d.cluster]; },
                "cluster" : function(d){ return d.cluster; }
            })
            .transition()
            .delay(function(d, i){
                return i * 5;
            }) 
            .duration(150)
            .ease('bounce')
            .attr({
                r: 7,
                stroke: "black" 
            });
    }
        centroid = false;

}

function calDistance() {
        d3.selectAll('.data')
            .transition()
            .delay(function(d, i){
                return i * 5;
            }) 
            .duration(150)
            .attr({
               fill: function (d) {
                    min = 10000000;
                    cluster = 0;

                    for (var i = 1; i <= clusterNum; i++) {
                        console.log(centroidArr[i - 1].x, centroidArr[i - 1].y)
                        // ユークリッド距離の計算
                        distance = 
                            Math.sqrt(
                                Math.pow((centroidArr[i - 1].x - d.x), 2) + Math.pow((centroidArr[i - 1].y - d.y), 2)
                            );

                        console.log(distance);
                        if (min >= distance) {
                            min = distance;
                            cluster = i;
                        }
                    }
                    // console.log(cluster);
                    // console.log(this);
                    return clusterColor[cluster];
               },
               cluster: function (d) {
                    min = 10000000;
                    cluster = 0;

                    for (var i = 1; i <= clusterNum; i++) {
                        // ユークリッド距離の計算
                        distance = 
                            Math.sqrt(
                                Math.pow((centroidArr[i - 1].x - d.x), 2) + Math.pow((centroidArr[i - 1].y - d.y), 2)
                            );

                        console.log(distance);
                        if (min >= distance) {
                            min = distance;
                            cluster = i;
                        }
                    }
                    console.log(cluster);
                    return cluster;
               }
            });
    centroid = true;
}
// }

function normalRand (m, s) {
    var a = 1 - Math.random();
    var b = 1 - Math.random();
    var c = Math.sqrt(-2 * Math.log(a));
    if(0.5 - Math.random() > 0) {
        return c * Math.sin(Math.PI * 2 * b) * s + m;
    }else{
        return c * Math.cos(Math.PI * 2 * b) * s + m;
    }
};
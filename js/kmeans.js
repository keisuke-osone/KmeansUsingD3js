console.log('Hello World!');

var dataNum = 100;
var clusterNum = 4;
var centroid = true;
var first = false;
var finish = false;
var dataset = []
var centroidArr = []

clusterColor = ['#a00', '#aa0', '#0a0', '#00a', '#0aa']
centroidColor = ['#f00', '#ff0', '#0f0', '#00f', '#0ff']



// 二つの正規分布などからサンプリングしたい
var svg = d3.select('body')
    .append('div')
    .attr({
        'id': 'main'
    })
    .style({
        'margin': '0 auto',
        'display': '-webkit-box'
    })
    .append('svg')
    .style({
        'background-color': '#ccc',
        'height': '400px',
        'width': '400px'
    });

var process = d3.select('#main')
    .append('div')
    .attr({
        'id': 'process'
    })
    .style({
        'background-color': 'gray',
        'height': '400px',
        'width': '300px'
    })

//  Stepを進めるボタン
process.append('button')
    .style({
        'background-color': '#a00',
        'border-radius': '10px',
        'color': '#ddd',
        'height': '40px',
        'margin': '0 auto',
        'width': '100px',
        'text-align': 'center'
    })
    .on('click', function () {
        if (!first) {
            firstCluster();
            d3.selectAll('.processDescription')
                .style({
                    'background-color': function (d, i) {
                        if (i == 0) {
                            return 'white';
                        } else {
                            return 'gray';
                        }
                    }
                });
        } else {
            if (centroid) {
                d3.selectAll('.processDescription')
                .style({
                    'background-color': function (d, i) {
                        if (i == 1) {
                            return 'white';
                        } else {
                            return 'gray';
                        }
                    }
                });
                calCentroid();
            } else {
                if (!finish) {
                    d3.selectAll('.processDescription')
                    .style({
                        'background-color': function (d, i) {
                            if (i == 2) {
                                return 'white';
                            } else {
                                return 'gray';
                            }
                        }
                    });
                    calDistance();
                }
            }
        }
    })
    .text('Next Step');

//  初期化するボタン
process.append('button')
    .style({
        'background-color': '#a00',
        'border-radius': '10px',
        'color': '#ddd',
        'height': '40px',
        'margin': '0 auto',
        'width': '100px',
        'text-align': 'center'
    })
    .on('click', function () {
        init();
    })
    .text('最初から');

init();

var processArray = [
    '各データに対してランダムでクラスタを割り振る',
    '各クラスタの重心を計算する(算術平均(ユークリッド距離))',
    '各データに対して重心が最も近いクラスタに割り当て直す',
    '移動しなくなったら終了'
];

process
    .selectAll('div')
    .data(processArray)
    .enter()
    .append('div')
    .attr({
        'id': function(d, i) {
            return 'process' + i;
        },
        'class': 'processDescription'
    })
    .style({
        'border': 'solid 2px #333',
        'margin': '10px',
        'height': '70px'
    })
    .text(function(d) { return d; })

function init () {
    dataset = []
    centroidArr = []
    centroid = true;
    first = false;
    finish = false;


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

    svg.selectAll('circle')
        .remove();

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
}

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
    var notMove = 0;
    
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
        if (centroidArr.length >= clusterNum && c.x == centroidArr[i - 1].x && c.y == centroidArr[i - 1].y) {
            notMove++;
        }

        if (c.x > 0) {
            centroidArr[i - 1] = c;
        }        
    }

    if (notMove >= clusterNum) {
        console.log('完了');
        d3.selectAll('.processDescription')
            .style({
                'background-color': function (d, i) {
                    if (i == 3) {
                        return 'white';
                    } else {
                        return 'gray';
                    }
                }
            });
        finish = true;
    }

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
                        // console.log(centroidArr[i - 1].x, centroidArr[i - 1].y)
                        // ユークリッド距離の計算
                        distance = 
                            Math.sqrt(
                                Math.pow((centroidArr[i - 1].x - d.x), 2) + Math.pow((centroidArr[i - 1].y - d.y), 2)
                            );

                        // console.log(distance);
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

                        // console.log(distance);
                        if (min >= distance) {
                            min = distance;
                            cluster = i;
                        }
                    }
                    // console.log(cluster);
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
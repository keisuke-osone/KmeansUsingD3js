console.log('Hello World!');

var dataNum = 50;
var clusterNum = 2;

clusterColor = ['#a00', '#aa0', '#0a0']
centroidColor = ['#f00', '#ff0', '#0f0']

// 二つの正規分布などからサンプリングしたい
var svg = d3.select('body').append('svg')
    .style({
        'height': '400px',
        'width': '400px'
    });

dataset = []

for (var i = 0; i < dataNum; i++) {
    obj = {
        x: parseInt(Math.random() * 400, 10),
        y: parseInt(Math.random() * 400, 10),
        cluster: parseInt(Math.random() * clusterNum, 10) + 1
    }
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
        'cluster' : function(d){ return clusterColor[d.cluster]; },
        fill : function(d){ return clusterColor[d.cluster]; }
    })
    .transition()
    // .delay(function(d, i){
    //     return i * 5;
    // }) 
    .duration(150)
    .ease('bounce')
    .attr({
        r: 15
    });

for (var cnt = 0; cnt < 10; cnt ++) {
centroid = []

// 重心の作成
for (var i = 1; i <= clusterNum; i++) {
    var c = {
        "x": d3.mean(dataset, function (d) {
            if (d.cluster == i) {
                return d.x;
            }
        }),
        "y": d3.mean(dataset, function (d) {
            if (d.cluster == i) {
                return d.y;
            }
        }),
        "cluster": i
    }
    centroid[i - 1] = c;
    console.log(c)
}

// データを点として打つ
svg.selectAll('rect')
    .data(centroid)
    .enter()
    .append('circle')
    .attr({
        cx : function(d){ return d.x; },
        cy : function(d){ return d.y; },
        r : 0,
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
        r: 10,
        stroke: "black" 
    });

// 重心との距離を計算
// dataset.forEach(function (d, num) {
//     min = 10000000;
//     clusterNum = 0;

//     for (var i = 1; i <= clusterNum; i++) {
//         // ユークリッド距離の計算
//         distance = 
//             Math.sqrt(
//                 Math.pow(centroid[i - 1].x, d.x) + Math.pow(centroid[i - 1].y, d.y)
//             );

//         if (min >= distance) {
//             clusterNum = i;
//         }
//     }

    console.log(dataPoint);

    dataPoint.attr({
       fill: function (d) {
            min = 10000000;
            cluster = 0;

            for (var i = 1; i <= clusterNum; i++) {
                console.log(centroid[i - 1].x, centroid[i - 1].y)
                // ユークリッド距離の計算
                distance = 
                    Math.sqrt(
                        Math.pow((centroid[i - 1].x - d.x), 2) + Math.pow((centroid[i - 1].y - d.y), 2)
                    );

                console.log(distance);
                if (min >= distance) {
                    min = distance;
                    cluster = i;
                }
            }
            console.log(cluster);
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
                        Math.pow((centroid[i - 1].x - d.x), 2) + Math.pow((centroid[i - 1].y - d.y), 2)
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

    // console.log(dataPoint[0][num].getAttributeNode("fill"));
    // dataPoint[0][num].setAttribute("fill", clusterColor[d.cluster]);
    // console.log("から");
    // console.log(dataPoint[0][num].getAttributeNode("fill"));

// })

}


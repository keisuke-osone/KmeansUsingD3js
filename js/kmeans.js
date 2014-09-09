console.log('Hello World!');

var dataNum = 100;
var clusterNum = 2;

clusterColor = ['#c00', '#cc0', '#0c0']

// 二つの正規分布などからサンプリングしたい
var svg = d3.select('body').append('svg')
    .style({
        'height': '600px',
        'width': '600px'
    });

dataset = []

for (var i = 0; i < dataNum; i++) {
    obj = {
        x: parseInt(Math.random() * 600, 10),
        y: parseInt(Math.random() * 600, 10),
        cluster: parseInt(Math.random() * clusterNum, 10) + 1
    }
    dataset.push(obj);
}

// データを点として打つ
svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('circle')
    .attr({
        cx : function(d){ return d.x; },
        cy : function(d){ return d.y; },
        r : 5,
        // height : function(d){ return d; },
        fill : function(d){ return clusterColor[d.cluster]; }
    });


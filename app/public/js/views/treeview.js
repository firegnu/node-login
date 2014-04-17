/**
 * Created by Administrator on 2014/4/17.
 */
var treeData = [
    {
        "text" : "矢量数据",
        "children" : [
            { "text" : "数据格式", "state" : {"opened": false,"selected" : false },  "children" : []}
        ]
    },
    {
        "text" : "影像数据",
        "children" : [
            { "text" : "数据格式", "state" : {"opened": false, "selected" : false }, "children" : []}
        ]
    },
    {
        "text" : "DEM数据",
        "children" : [
            { "text" : "数据格式", "state" : {"opened": false, "selected" : false }, "children" : []}
        ]
    },
    {
        "text" : "扫描数据",
        "children" : [
            { "text" : "数据格式", "state" : {"opened": false, "selected" : false }, "children" : []}
        ]
    },
    {
        "text" : "其他数据",
        "children" : [
            { "text" : "数据格式", "state" : {"opened": false, "selected" : false }, "children" : []}
        ]
    }
];
var analyzingDBJSONData = function(dbObject, treeIndex) {
    //var dbObject = JSON.parse(dbObect);
    var formatArray = [];
    for(var i = 0; i < dbObject.data.length; i++) {
        var dbData = dbObject.data[i];
        if(formatArray.indexOf(dbData.数据格式) !== -1) {
            treeData[treeIndex].children[0].children[formatArray.indexOf(dbData.数据格式)].children.push(dbData.数据名称);
            continue;
        }
        formatArray.push(dbData.数据格式);
        var newFormat = {"text" : dbData.数据格式,"state" : {"opened": false, "selected" : false },
            "children" : [
            ]};
        treeData[treeIndex].children[0].children.push(newFormat);
        treeData[treeIndex].children[0].children[formatArray.indexOf(dbData.数据格式)].children.push(dbData.数据名称);
    }
    //remove duplicate 数据名称
    for(var i = 0; i < treeData[treeIndex].children[0].children.length; i++) {
        var treeDataNameArray = treeData[treeIndex].children[0].children[i].children;
        var duplicateNameArray = [];
        for(var j = 0; j < treeDataNameArray.length; j++) {
            if(duplicateNameArray.indexOf(treeDataNameArray[j]) === -1) {
                duplicateNameArray.push(treeDataNameArray[j]);
            }
        }
        ////have duplicate data and remove
        treeData[treeIndex].children[0].children[i].children = [];
        for(var j = 0; j < duplicateNameArray.length; j++) {
            var newFormatName = {"text" : duplicateNameArray[j],
                "children" : [
                ]};
            treeData[treeIndex].children[0].children[i].children.push(newFormatName);
        }
    }
    //add leaf node
    for(var i = 0; i < treeData[treeIndex].children[0].children.length; i++) {
        var formatName = treeData[treeIndex].children[0].children[i].text;
        for(var j = 0; j < treeData[treeIndex].children[0].children[i].children.length; j++) {
            var dataName = treeData[treeIndex].children[0].children[i].children[j].text;
            for(var k = 0; k < dbObject.data.length; k++) {
                if(dbObject.data[k].数据格式 === formatName && dbObject.data[k].数据名称 === dataName) {
                    var leafName = {"text" : dbObject.data[k].图名, "state" : {"opened": false, "selected" : false }};
                    treeData[treeIndex].children[0].children[i].children[j].children.push(leafName);
                }
            }
        }
    }
};

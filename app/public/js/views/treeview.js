/**
 * Created by Administrator on 2014/4/17.
 */
(function(treeView) {

    treeView.treeData = [
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

    treeView.customMenu = function(node) {
        var items = {
            downloadItem: {
                label: "Download",
                action: function () {
                    /*var alertMsg = $(node)[0].data.数据类型 + '\n';
                    alertMsg += $(node)[0].data.数据名称 + '\n';
                    alertMsg += $(node)[0].data.比例尺 + '\n';
                    alertMsg += $(node)[0].data.图名 + '\n';
                    alertMsg += $(node)[0].data.数据格式 + '\n';
                    alertMsg += $(node)[0].data.数据来源 + '\n';
                    alertMsg += $(node)[0].data.生产日期 + '\n';
                    alertMsg += $(node)[0].data.入库时间 + '\n';
                    alertMsg += 'sss:' + $(node)[0].data.数据描述;
                    alert(alertMsg);*/
                    $('.modal-treeview-download').modal({ show : true, keyboard : true, backdrop : true });
                }
            }
        };
        if ($(node)[0].children.length > 0) {
            delete items.downloadItem;
        }
        return items;
    };

    treeView.analyzingDBJSONData = function(dbObject, treeIndex) {
        var formatArray = [];
        for(var i = 0; i < dbObject.data.length; i++) {
            var dbData = dbObject.data[i];
            if(formatArray.indexOf(dbData.数据格式) !== -1) {
                treeView.treeData[treeIndex].children[0].children[formatArray.indexOf(dbData.数据格式)].children.push(dbData.数据名称);
                continue;
            }
            formatArray.push(dbData.数据格式);
            var newFormat = {"text" : dbData.数据格式,"state" : {"opened": false, "selected" : false },
                "children" : [
                ]};
            treeView.treeData[treeIndex].children[0].children.push(newFormat);
            treeView.treeData[treeIndex].children[0].children[formatArray.indexOf(dbData.数据格式)].children.push(dbData.数据名称);
        }
        //remove duplicate 数据名称
        for(var i = 0; i < treeView.treeData[treeIndex].children[0].children.length; i++) {
            var treeDataNameArray = treeView.treeData[treeIndex].children[0].children[i].children;
            var duplicateNameArray = [];
            for(var j = 0; j < treeDataNameArray.length; j++) {
                if(duplicateNameArray.indexOf(treeDataNameArray[j]) === -1) {
                    duplicateNameArray.push(treeDataNameArray[j]);
                }
            }
            ////have duplicate data and remove
            treeView.treeData[treeIndex].children[0].children[i].children = [];
            for(var j = 0; j < duplicateNameArray.length; j++) {
                var newFormatName = {"text" : duplicateNameArray[j],
                    "children" : [
                    ]};
                treeView.treeData[treeIndex].children[0].children[i].children.push(newFormatName);
            }
        }
        //add leaf node
        for(var i = 0; i < treeView.treeData[treeIndex].children[0].children.length; i++) {
            var formatName = treeView.treeData[treeIndex].children[0].children[i].text;
            for(var j = 0; j < treeView.treeData[treeIndex].children[0].children[i].children.length; j++) {
                var dataName = treeView.treeData[treeIndex].children[0].children[i].children[j].text;
                for(var k = 0; k < dbObject.data.length; k++) {
                    if(dbObject.data[k].数据格式 === formatName && dbObject.data[k].数据名称 === dataName) {
                        var leafName = {"text" : dbObject.data[k].图名, "state" : {"opened": false, "selected" : false }, "data": dbObject.data[k]};
                        treeView.treeData[treeIndex].children[0].children[i].children[j].children.push(leafName);
                    }
                }
            }
        }
    };

})(window.treeView = window.treeView || {});

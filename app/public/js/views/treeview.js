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

    treeView.mouseEnterTip = function(contentText, x, y, title, tableData) {
        $('#giscontent').qtip({
            content: {
                text: contentText,
                title: {
                    text: title
                },
                button: 'close'
            },
            position: {
                target: [x, y]
            },
            show: {
                event: false,
                solo: true,
                ready: true
            },
            hide: {
                fixed: true,
                delay: 300
            },
            style: 'qtip-shadow qtip-rounded qtip-jtools',
            events: {
                render: function(event, api) {
                    $('button', api.elements.content).click(function(e) {
                        api.hide(e);
                        treeViewDownload.jsonData.data.length = 0;
                        treeViewDownload.jsonData.data.push(tableData);
                        treeViewDownload.jsonData.totalRows = treeViewDownload.jsonData.data.length;
                        treeViewDownload.loadTreeviewDownloadData();
                        $('.modal-treeview-download').modal({ show : true, keyboard : true, backdrop : true });
                        treeViewDownload.jsonData.perPage = 10;
                        //hard code???how to redraw the datatable
                        $($('.modal-dialog-treeview-download li')[0]).click();
                    });
                },
                hide: function(event, api) { api.destroy(); }
            }
        });
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

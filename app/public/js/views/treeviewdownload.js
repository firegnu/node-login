/**
 * Created by Administrator on 2014/4/22.
 */
/**
 * Created by Administrator on 2014/4/17.
 */
(function(treeViewDownload) {
    treeViewDownload.jsonData = { "currentPage" : 1,
        "data" : [
        ],
        "filter" : { "column_0" : "foo" },
        "perPage" : 10,
        "posted" : [  ],
        "sort" : [ [ "column_0",
            "desc"
        ],
            [ "column_2",
                "asc"
            ]
        ],
        "totalRows" : 200
    };

    treeViewDownload.loadTreeviewDownloadData = function() {
        $("#table-container_1").datatable({
            perPage: 10
            , url: ''
            , title: '搜索结果'
            , data: treeViewDownload.jsonData
            , showPagination: true
            , showFilter: true
            , filterModal: $("#myModal")
            , columns: [
                {
                    title: "数据类型"
                    , sortable: true
                    , field: "column_0"
                    , callback: function ( data, cell ) {
                    return data[cell.field];
                }
                    , filter: true
                }
                , {
                    title: "数据名称"
                    , sortable: true
                    , field: "column_1"
                }
                ,
                {
                    title: "比例尺"
                    , sortable: true
                    , field: "column_2"
                    , callback: function ( data, cell ) {
                    return data[cell.field];
                }
                    , filter: true
                }
                , {
                    title: "图名"
                    , sortable: true
                    , field: "column_3"
                }
                , {
                    title: "数据格式"
                    , sortable: true
                    , field: "column_4"
                    , callback: function ( data, cell ) {
                        return data[cell.field];
                    }
                    , filter: true
                }
                , {
                    title: "数据来源"
                    , sortable: true
                    , field: "column_5"
                }
                , {
                    title: "生产日期"
                    , sortable: true
                    , field: "column_6"
                }
                , {
                    title: "入库日期"
                    , sortable: true
                    , field: "column_7"
                }
                ,{
                    title: "数据描述"
                    , sortable: false
                    , field: "column_8"
                    , filter: true
                    , css: {
                        textAlign: 'right'
                    }
                }
            ]
        });
    };

})(window.treeViewDownload = window.treeViewDownload || {});

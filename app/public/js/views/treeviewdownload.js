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
                ,{
                    title: "数据路径"
                    , sortable: false
                    , field: "column_9"
                    , filter: true
                    , css: {
                        display: 'none'
                    }
                }
            ]
        });

    };

    $('.treeviewdownloadbtn').click(function() {
        var desFile = [];
        desFile.push($('.modal-dialog-treeview-download').find('td:last').text());
        var form = $('<form>', {action: '/Download', method: 'POST'});
        form.append($('<input>', {name: 'image_path', value: desFile}));
        form.submit();
    });

    $('.modal-treeview-download').on('shown.bs.modal', function() {
        for(var i = 0; i < $('.modal-dialog-treeview-download').find('td').length; i++) {
            $($('.modal-dialog-treeview-download').find('td')[i]).css({'background-color': 'rgba(71, 164, 71, 0.8)'});
        }
    });

})(window.treeViewDownload = window.treeViewDownload || {});

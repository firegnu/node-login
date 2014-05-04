/**
 * Created by Administrator on 2014/5/4.
 */
(function(myHistory) {

    myHistory.jsonData = { "currentPage" : 1,
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

    $('#myhistorymodal').on('shown.bs.modal', function(){
        $.ajax({
            type: 'GET',
            url: '/myhistory',
            success: function(data) {
                for(var i = 0; i < data.length; i++) {
                    var tableData = {};
                    tableData.column_0 = data[i].lendfile;
                    tableData.column_1 = data[i].lenddate;
                    myHistory.jsonData.data.push(tableData);
                }
                myHistory.loadMyhistoryData();
                $($('#myhistorymodal li')[0]).click();
            },
            fail: function(data) {
                //alert('request world map fail!');
            }
        });
    });

    myHistory.loadMyhistoryData = function() {
        $("#table-container_2").datatable({
            perPage: 1000
            , url: ''
            , title: '下载记录'
            , data: myHistory.jsonData
            , showPagination: true
            , showFilter: true
            , filterModal: $("#myModal")
            , columns: [
                {
                    title: "下载文件"
                    , sortable: true
                    , field: "column_0"
                    , callback: function ( data, cell ) {
                    return data[cell.field];
                }
                    , filter: true
                }
                , {
                    title: "下载时间"
                    , sortable: true
                    , field: "column_1"
                }
            ]
        });

    };

})(window.myHistory = window.myHistory || {});

/**
 * Created by Administrator on 2014/4/22.
 */
/**
 * Created by Administrator on 2014/4/17.
 */
(function(treeViewDownload) {
    var jsonData = { "currentPage" : 1,
        "data" : [ { "column_0" : "row: 1 column 1 44",
            "column_1" : "row: 1 column 2 82",
            "column_2" : "row: 1 column 3 4"
        },
            { "column_0" : "row: 2 column 1 56",
                "column_1" : "row: 2 column 2 59",
                "column_2" : "row: 2 column 3 37"
            },
            { "column_0" : "row: 3 column 1 12",
                "column_1" : "row: 3 column 2 63",
                "column_2" : "row: 3 column 3 41"
            },
            { "column_0" : "row: 4 column 1 6",
                "column_1" : "row: 4 column 2 92",
                "column_2" : "row: 4 column 3 14"
            },
            { "column_0" : "row: 5 column 1 65",
                "column_1" : "row: 5 column 2 43",
                "column_2" : "row: 5 column 3 24"
            },
            { "column_0" : "row: 6 column 1 17",
                "column_1" : "row: 6 column 2 48",
                "column_2" : "row: 6 column 3 34"
            },
            { "column_0" : "row: 7 column 1 54",
                "column_1" : "row: 7 column 2 26",
                "column_2" : "row: 7 column 3 2"
            },
            { "column_0" : "row: 8 column 1 40",
                "column_1" : "row: 8 column 2 81",
                "column_2" : "row: 8 column 3 31"
            },
            { "column_0" : "row: 9 column 1 62",
                "column_1" : "row: 9 column 2 35",
                "column_2" : "row: 9 column 3 79"
            },
            { "column_0" : "row: 10 column 1 94",
                "column_1" : "row: 10 column 2 16",
                "column_2" : "row: 10 column 3 35"
            }
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

    $("#table-container_1").datatable({
        perPage: 5
        , url: ''
        , data: jsonData
        , showPagination: true
        , showFilter: true
        , filterModal: $("#myModal")
        , columns: [
            {
                title: "Column 1"
                , sortable: true
                , field: "column_0"
                , callback: function ( data, cell ) {
                return data[cell.field];
            }
                , filter: true
            }
            , {
                title: "Column 2"
                , sortable: true
                , field: "column_1"
            }
            , {
                title: "Column 3"
                , sortable: false
                , field: "column_2"
                , filter: true
                , css: {
                    textAlign: 'right'
                }
            }
        ]
    });
})(window.treeViewDownload = window.treeViewDownload || {});

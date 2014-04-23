/**
 * Created by Administrator on 2014/4/23.
 */
(function(search) {

    search.allDataDB = [];

    $('#searchdatepicker').datepicker({
    });

    $('#searchdatatypeselect').change(function() {
        $('#searchdataformatselect').empty();
        if(this.value === '矢量') {
            $('#searchdataformatselect').append('<option value="新军标生产">新军标生产</option>');
            $('#searchdataformatselect').append('<option value="新军标交换">新军标交换</option>');
            $('#searchdataformatselect').append('<option value="旧军标生产">旧军标生产</option>');
            $('#searchdataformatselect').append('<option value="旧军标交换">旧军标交换</option>');
            $('#searchdataformatselect').append('<option value="军用海图">军用海图</option>');
            $('#searchdataformatselect').append('<option value="MAPGIS格式">MAPGIS格式</option>');
            $('#searchdataformatselect').append('<option value="SHP格式">SHP格式</option>');
            $('#searchdataformatselect').append('<option value="MIF格式">MIF格式</option>');
            $('#searchdataformatselect').append('<option value="DXF格式">DXF格式</option>');
            $('#searchdataformatselect').append('<option value="E00格式">E00格式</option>');
            $('#searchdataformatselect').append('<option value="XML格式">XML格式</option>');
            $('#searchdataformatselect').append('<option value="其他">其他</option>');

        }
        else if(this.value === 'DEM') {
            $('#searchdataformatselect').append('<option value="EGC格式">EGC格式</option>');
            $('#searchdataformatselect').append('<option value="EGX格式">EGX格式</option>');
            $('#searchdataformatselect').append('<option value="GRID格式">GRID格式</option>');
            $('#searchdataformatselect').append('<option value="E00格式">E00格式</option>');
            $('#searchdataformatselect').append('<option value="其他">其他</option>');
        }
        else if(this.value === '影像') {
            $('#searchdataformatselect').append('<option value="TIFF格式">TIFF格式</option>');
            $('#searchdataformatselect').append('<option value="BMP格式">BMP格式</option>');
            $('#searchdataformatselect').append('<option value="JPEG格式">JPEG格式</option>');
            $('#searchdataformatselect').append('<option value="RAW格式">RAW格式</option>');
            $('#searchdataformatselect').append('<option value="ECW格式">ECW格式</option>');
            $('#searchdataformatselect').append('<option value="其他">其他</option>');
        }
        else if(this.value === '扫描图') {
            $('#searchdataformatselect').append('<option value="TIFF格式">TIFF格式</option>');
            $('#searchdataformatselect').append('<option value="BMP格式">BMP格式</option>');
            $('#searchdataformatselect').append('<option value="JPEG格式">JPEG格式</option>');
            $('#searchdataformatselect').append('<option value="其他">其他</option>');
        }
        else if(this.value === '其他资料') {
            $('#searchdataformatselect').append('<option value="文本格式">文本格式</option>');
            $('#searchdataformatselect').append('<option value="doc格式">doc格式</option>');
            $('#searchdataformatselect').append('<option value="其他">其他</option>');
        }

    });

    $('#searchdatatypeselect').val('矢量').change();

    search.jsonData = { "currentPage" : 1,
        "data" : [],
        "filter" : { "column_0" : "foo" },
        "perPage" : 1000,
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

    //
    var fillSearchData = function() {
        //search.allDataDB = [];
        var searchName = $('#searchname').val();
        var searchDataName = $('#searchdataname').val();
        var searchType = $('#searchdatatypeselect option:selected ').text();
        var searchBlc = $('#searchblcselect option:selected ').text();
        var searchFormat = $('#searchdataformatselect option:selected ').text();
        var searchProduceDate = $('#searchdatepicker').val();
        for(var i = 0; i < search.allDataDB.length; i++) {
            var leafData = search.allDataDB[i].data;
            if(leafData.数据类型 === searchType && leafData.比例尺 === searchBlc && leafData.数据格式 === searchFormat) {
                var searResultData = {};
                searResultData.column_00 = '';
                searResultData.column_0 = leafData.数据类型;
                searResultData.column_1 = leafData.数据名称;
                searResultData.column_2 = leafData.比例尺;
                searResultData.column_3 = leafData.图名;
                searResultData.column_4 = leafData.数据格式;
                searResultData.column_5 = leafData.数据来源;
                searResultData.column_6 = leafData.生产日期;
                searResultData.column_7 = leafData.入库时间;
                searResultData.column_8 = leafData.数据描述;
                searResultData.column_9 = leafData.数据路径;
                search.jsonData.data.push(searResultData);
            }
        }
    };

    $('#btnSearch').click(function() {
        search.jsonData.data.length = 0;
        fillSearchData();
        search.jsonData.totalRows = search.jsonData.data.length;
        $("#serarresult").datatable({
            perPage: 1000
            , url: ''
            , data: search.jsonData
            , checkbox: true
            , title: '搜索结果'
            , showPagination: true
            , showFilter: true
            , filterModal: $("#myModal")
            , columns: [
                {
                    title: "#"
                    , field: "column_00"
                },
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
                },
                {
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
        $($('#searchmodal li')[0]).click();
        for(var i = 0; i < $('#searchmodal tbody').find('tr').length; i++) {
            $($($('#searchmodal tbody').find('tr'))[i]).find('td')[1].remove();
        }
        $('.searchcheckbox').click(function() {
            if($(this).is(':checked')) {
                $(this).parent().parent().find('td').css({'background-color': '#47a447'});
            }
            else {
                $(this).parent().parent().find('td').css({'background-color': 'white'});
            }
        });
    });

    $('#searchmodal').on('hidden.bs.modal', function () {
        search.jsonData.data.length = 0;
        $($('#searchmodal li')[0]).click();
    });

    $('.searchdownloadbtn').click(function() {
        for(var i = 0; i < $('.searchcheckbox').length; i++) {
            if($($('.searchcheckbox')[i]).is(':checked')) {
                //start download selected files
                alert($($('.searchcheckbox')[i]).parent().parent().find('td:last').text());
            }
        }
    });

})(window.search = window.search || {});
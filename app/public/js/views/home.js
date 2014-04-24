
$(document).ready(function(){
    $('body').css('background',"rgb(0,0,0)");

	var hc = new HomeController();
	var av = new AccountValidator();

    $('#giscontent').css({'height': (window.innerHeight - 5)*0.9});
    $('#giscontent').css({'width': '300px'});
    //
    $('#mapcanvas').css({'height': (window.innerHeight - 5)*0.9 + 44});
    $('#mapcanvas').css({'width': (window.innerWidth - 310)});
    //ToDo
    $('#mapcanvas').css({'margin-top': -(window.innerHeight - 5)*0.9 - 44});//-945
    //margin-top -954px
	$('#account-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			if (av.validateForm() == false){
				return false;
			} 	else{
			// push the disabled username field onto the form data array //
				formData.push({name:'user', value:$('#user-tf').val()})
				return true;
			}
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') hc.onUpdateSuccess();
		},
		error : function(e){
			if (e.responseText == 'email-taken'){
			    av.showInvalidEmail();
			}	else if (e.responseText == 'username-taken'){
			    av.showInvalidUserName();
			}
		}
	});

	$('#name-tf').focus();
	//$('#github-banner').css('top', '41px');
    //modalmyprofile
    $('#modalmyprofile').modal({ show : false, keyboard : true, backdrop : true });

    // setup the confirm window that displays when the user chooses to delete their account //
	$('.modal-confirm').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-confirm .modal-header h3').text('Delete Account');
	$('.modal-confirm .modal-body p').html('Are you sure you want to delete your account?');
	$('.modal-confirm .cancel').html('Cancel');
	$('.modal-confirm .submit').html('Delete');
	$('.modal-confirm .submit').addClass('btn-danger');

    $('.js-loading-bar').modal({backdrop: 'static',show: true
    }).on('shown.bs.modal', function( event ) {
        var $bar = $(event.target).find('.progress-bar');
        $bar.addClass('animate');
    });
    var progress = setInterval(function() {
        var $bar = $('.progress-bar');

        if ($bar.width()==400) {
            $('.progress').removeClass('active');
        } else {
            $bar.width($bar.width()+200);
        }
        $bar.text($bar.width()/4 + "%");
    }, 800);
    //request DB file from server
    $.ajax({
        type: 'GET',
        url: '/dbfile',
        success: function(data) {
            treeView.analyzingDBJSONData(JSON.parse(data[0]), 0);
            treeView.analyzingDBJSONData(JSON.parse(data[1]), 1);
            treeView.analyzingDBJSONData(JSON.parse(data[2]), 2);
            treeView.analyzingDBJSONData(JSON.parse(data[3]), 3);
            treeView.analyzingDBJSONData(JSON.parse(data[4]), 4);
            $('#giscontent').jstree({
                'plugins':["search", "state", "wholerow", "unique", "types", "contextmenu"], 'core' : {
                'data' : treeView.treeData
            }});
            var to = false;
            $('#treesearch').keyup(function () {
                if(to) { clearTimeout(to); }
                to = setTimeout(function () {
                    var v = $('#treesearch').val();
                    $('#giscontent').jstree(true).search(v);
                }, 250);
            });
            //request worldmap from server
            $.ajax({
                type: 'GET',
                url: '/worldmap',
                success: function(data) {
                    //paint worldmap
                    worldMapView.draw(data);
                    mapindex.DrawAllMaps();
                    paper.view.draw();
                    $('.progress-bar').width(400);
                    $('.progress-bar').text(100 + "%");
                    clearInterval(progress);
                    $('.js-loading-bar').modal('hide');
                    $('.progress-bar').removeClass('animate');
                },
                fail: function(data) {
                    //alert('request world map fail!');
                }
            });
        },
        fail: function(data) {

        }
    });

    //request FakeDB file from server
    $.ajax({
        type: 'GET',
        url: '/fakeWorldmap',
        success: function(data) {
            $('#giscontent').on('changed.jstree', function (e, data) {
                var r = [];
                if(data.instance.get_node(data.selected[0]).children.length === 0) {
                    r.push(data.instance.get_node(data.selected[0]).data);
                    var nodeData = data.instance.get_node(data.selected[0]).data;
                    var pathCircleStr = "<h6><font color=red>" + "数据类型:</font>:" + nodeData.数据类型 + "" + "</h6>";
                    pathCircleStr += "<h6><font color=red>" + "数据名称:</font>:" + nodeData.数据名称 + "" + "</h6>";
                    pathCircleStr += "<h6><font color=red>" + "比例尺:</font>:" + nodeData.比例尺 + "</h6>";
                    pathCircleStr += "<h6><font color=red>" + "图名:</font>:" + nodeData.图名 + "" + "</h6>";
                    pathCircleStr += "<h6><font color=red>" + "数据格式:</font>:" + nodeData.数据格式 + "</h6>";
                    pathCircleStr += "<h6><font color=red>" + "数据来源:</font>:" + nodeData.数据来源 + "" + "</h6>";
                    pathCircleStr += "<h6><font color=red>" + "生产日期:</font>:" + nodeData.生产日期 + "</h6>";
                    pathCircleStr += "<h6><font color=red>" + "入库日期:</font>:" + nodeData.入库时间 + "</h6>";
                    pathCircleStr += "<h6><font color=red>" + "数据描述:</font>:" + nodeData.数据描述 + "</h6>";
                    pathCircleStr += '<button type="button" class="btn btn-xs btn-success">Download</button>';
                    var tableData = {};
                    tableData.column_0 = nodeData.数据类型;
                    tableData.column_1 = nodeData.数据名称;
                    tableData.column_2 = nodeData.比例尺;
                    tableData.column_3 = nodeData.图名;
                    tableData.column_4 = nodeData.数据格式;
                    tableData.column_5 = nodeData.数据来源;
                    tableData.column_6 = nodeData.生产日期;
                    tableData.column_7 = nodeData.入库时间;
                    tableData.column_8 = nodeData.数据描述;
                    tableData.column_9 = nodeData.数据路径;
                    if(r.length !== 0) {
                        treeView.mouseEnterTip(pathCircleStr, data.event.clientX, data.event.clientY, '数据基本情况', tableData);
                    }
                }
            });
        },
        fail: function(data) {
            alert('DB server do not response');
        }
    });

})
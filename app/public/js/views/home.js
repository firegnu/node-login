
$(document).ready(function(){

	var hc = new HomeController();
	var av = new AccountValidator();
	//
    $('#giscontent').css({'height': (window.innerHeight - 52)*0.9});
    $('#giscontent').css({'width': '300px'});
    //
    $('#mapcanvas').css({'height': (window.innerHeight - 52)*0.9 + 44});
    $('#mapcanvas').css({'width': (window.innerWidth - 310)});
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
                'plugins':["search", "state", "wholerow", "unique", "types", "contextmenu"], contextmenu: {items: treeView.customMenu}, 'core' : {
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
                /*var r = [];
                if(data.instance.get_node(data.selected[0]).children.length === 0) {
                    r.push(data.instance.get_node(data.selected[0]).data);
                    var alertMsg = data.instance.get_node(data.selected[0]).data.数据类型 + '\n';
                    alertMsg += data.instance.get_node(data.selected[0]).data.数据名称 + '\n';
                    alertMsg += data.instance.get_node(data.selected[0]).data.比例尺 + '\n';
                    alertMsg += data.instance.get_node(data.selected[0]).data.图名 + '\n';
                    alertMsg += data.instance.get_node(data.selected[0]).data.数据格式 + '\n';
                    alertMsg += data.instance.get_node(data.selected[0]).data.数据来源 + '\n';
                    alertMsg += data.instance.get_node(data.selected[0]).data.生产日期 + '\n';
                    alertMsg += data.instance.get_node(data.selected[0]).data.入库时间 + '\n';
                    alertMsg += data.instance.get_node(data.selected[0]).data.数据描述;
                    if(r.length !== 0) {
                        alert(alertMsg);
                    }
                }*/
            });
        },
        fail: function(data) {
            alert('DB server do not response');
        }
    });

})

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
	$('#github-banner').css('top', '41px');
// customize the account settings form //
//modalmyprofile
    $('#modalmyprofile').modal({ show : false, keyboard : true, backdrop : true });

// setup the confirm window that displays when the user chooses to delete their account //

	$('.modal-confirm').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-confirm .modal-header h3').text('Delete Account');
	$('.modal-confirm .modal-body p').html('Are you sure you want to delete your account?');
	$('.modal-confirm .cancel').html('Cancel');
	$('.modal-confirm .submit').html('Delete');
	$('.modal-confirm .submit').addClass('btn-danger');

    var treeData = [
        {
            "text" : "矢量数据",
            "children" : [
                { "text" : "数据格式", "state" : { "selected" : false }, "children" : []}
            ]
        },
        {
            "text" : "影像数据",
            "children" : [
                { "text" : "数据格式", "state" : { "selected" : false }, "children" : []}
            ]
        },
        {
            "text" : "DEM数据",
            "children" : [
                { "text" : "数据格式", "state" : { "selected" : false }, "children" : []}
            ]
        },
        {
            "text" : "扫描数据",
            "children" : [
                { "text" : "数据格式", "state" : { "selected" : false }, "children" : []}
            ]
        },
        {
            "text" : "其他数据",
            "children" : [
                { "text" : "数据格式", "state" : { "selected" : false }, "children" : []}
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
            var newFormat = {"text" : dbData.数据格式,
                "children" : [
                ]};
            treeData[treeIndex].children[0].children.push(newFormat);
            treeData[treeIndex].children[0].children[formatArray.indexOf(dbData.数据格式)].children.push(dbData.数据名称);
        }
    };

    //request DB file from server
    $.ajax({
        type: 'GET',
        url: '/dbfile',
        success: function(data) {
            analyzingDBJSONData(JSON.parse(data[0]), 0);
            analyzingDBJSONData(JSON.parse(data[1]), 1);
            analyzingDBJSONData(JSON.parse(data[2]), 2);
            analyzingDBJSONData(JSON.parse(data[3]), 3);
            analyzingDBJSONData(JSON.parse(data[4]), 4);
            $('#giscontent').jstree({'plugins':["search", "state", "wholerow"], 'core' : {
                'data' : treeData
            }});
            var to = false;
            $('#treesearch').keyup(function () {
                if(to) { clearTimeout(to); }
                to = setTimeout(function () {
                    var v = $('#treesearch').val();
                    $('#giscontent').jstree(true).search(v);
                }, 250);
            });
        },
        fail: function(data) {
            alert('DB server do not response');
        }
    });
})
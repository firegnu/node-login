
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
//selizase the dbjson data
    var vectorDBObject = eval(SQLDB_VECTOR);
    var scanningDBObject = eval(SQLDB_SCANIMG);
    var imageDBObject = eval(SQLDB_IMAGE);
    var demDBObject = eval(SQLDB_DEM);
    var qitaDBObject = eval(SQLDB_DATUM);

    var analyzingDBJSONData = function(dbObect, treeIndex) {
        var formatArray = [];
        for(var i = 0; i < dbObect.data.length; i++) {
            var dbData = dbObect.data[i];
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
//vecot data
    analyzingDBJSONData(vectorDBObject, 0);
//image data
    analyzingDBJSONData(imageDBObject, 1);
//dem data
    analyzingDBJSONData(demDBObject, 2);
//scanning data
    analyzingDBJSONData(scanningDBObject, 3);
//other data
    analyzingDBJSONData(qitaDBObject, 4);
//setup tree
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
})

$(document).ready(function(){

	var hc = new HomeController();
	var av = new AccountValidator();
	//
    $('#giscontent').css({'height': window.innerHeight - 80});
    $('#giscontent').css({'width': '300px'});
    //
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
//setup tree
    //$('#giscontent').jstree();
    $('#giscontent').jstree({'plugins':["wholerow","checkbox"], 'core' : {
        'data' : [
            {
                "text" : "Same but with checkboxes",
                "children" : [
                    { "text" : "initially selected", "state" : { "selected" : true } },
                    { "text" : "custom icon URL", "icon" : "http://jstree.com/tree-icon.png" },
                    { "text" : "initially open", "state" : { "opened" : true }, "children" : [ "Another node" ] },
                    { "text" : "custom icon class", "icon" : "glyphicon glyphicon-leaf" }
                ]
            },
            "And wholerow selection"
        ]
    }});
})
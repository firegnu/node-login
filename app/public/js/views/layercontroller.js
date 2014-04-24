/**
 * Created by Administrator on 2014/4/24.
 */
/**
 * Created by Administrator on 2014/4/17.
 */
(function(layercontroller) {
    $('#btn-controlpanel').click(function() {
        $('#layercontroller').modal({ show : true, keyboard : true, backdrop : true });
        $('.modal-layercontroller').css({'position': 'absolute'});
        $('.modal-layercontroller').css({'top': '30px'});
        $('.modal-layercontroller').css({'right': '30px'});
    });

})(window.layercontroller = window.layercontroller || {});

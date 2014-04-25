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

    $('#layercontroller').on('shown.bs.modal', function(){
        if(paper.project.layers[worldMapView.getLayerByName('worldmap')].children[0].visible) {
            $('#worldmaplayer').prop('checked', true);
        }
        else {
            $('#worldmaplayer').prop('checked', false);
        }
        if(paper.project.layers[worldMapView.getLayerByName('mapIndex')].children[0].visible) {
            $('#mapindexlayer').prop('checked', true);
        }
        else {
            $('#mapindexlayer').prop('checked', false);
        }
        if(paper.project.layers[worldMapView.getLayerByName('mapIndexNum')].children[0].visible) {
            $('#mapindexnumlayer').prop('checked', true);
        }
        else {
            $('#mapindexnumlayer').prop('checked', false);
        }
    });

    $("#worldmaplayer").change(function() {
        if(this.checked) {
            paper.project.layers[worldMapView.getLayerByName('worldmap')].children[0].visible = true;
        }
        else {
            paper.project.layers[worldMapView.getLayerByName('worldmap')].children[0].visible = false;
        }
    });

    $("#mapindexlayer").change(function() {
        if(this.checked) {
            paper.project.layers[worldMapView.getLayerByName('mapIndex')].children[0].visible = true;
        }
        else {
            paper.project.layers[worldMapView.getLayerByName('mapIndex')].children[0].visible = false;
        }
    });

    $("#mapindexnumlayer").change(function() {
        if(this.checked) {
            paper.project.layers[worldMapView.getLayerByName('mapIndexNum')].children[0].visible = true;
        }
        else {
            paper.project.layers[worldMapView.getLayerByName('mapIndexNum')].children[0].visible = false;
        }
    });

})(window.layercontroller = window.layercontroller || {});

/**
 * Created by Administrator on 2014/4/24.
 */
/**
 * Created by Administrator on 2014/4/17.
 */
(function(layercontroller) {
    $('#btn-controlpanel').click(function() {
        $('.modal-layercontroller').css({'position': 'absolute'});
        $('.modal-layercontroller').css({'top': '30px'});
        $('.modal-layercontroller').css({'right': '30px'});
        $('.modal-backdrop').css({'display': 'none'});
        $('#layercontroller').modal({ show : true, keyboard : true, backdrop : true });

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
        if(mapindex.currentMapIndexNum == '') {
            $('#mapindex').val('1:100万');
        }
        else {
            $('#mapindex').val(mapindex.currentMapIndexNum);
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

    $('#mapindex').change(function() {
        mapindex.currentMapIndexNum = $(this).val();
        if(paper.project.layers[worldMapView.getLayerByName('mapIndex')] !== undefined ||
            paper.project.layers[worldMapView.getLayerByName('mapIndexNum')] !== undefined) {
            paper.project.layers[worldMapView.getLayerByName('mapIndex')].remove();
            paper.project.layers[worldMapView.getLayerByName('mapIndexNum')].remove();
            //todo: set current matrix to mapindex layer
            mapindex.DrawAllMaps($(this).val());
            if(($("#mapindexnumlayer").is(":checked"))) {
                paper.project.layers[worldMapView.getLayerByName('mapIndexNum')].children[0].visible = true;
            }
            else {
                paper.project.layers[worldMapView.getLayerByName('mapIndexNum')].children[0].visible = false;
            }
            if(($("#worldmaplayer").is(":checked"))) {
                paper.project.layers[worldMapView.getLayerByName('worldmap')].children[0].visible = true;
            }
            else {
                paper.project.layers[worldMapView.getLayerByName('worldmap')].children[0].visible = false;
            }
            if(($("#mapindexlayer").is(":checked"))) {
                paper.project.layers[worldMapView.getLayerByName('mapIndex')].children[0].visible = true;
            }
            else {
                paper.project.layers[worldMapView.getLayerByName('mapIndex')].children[0].visible = false;
            }
            //remainOringinDisplay('worldmap');
            remainOringinDisplay('mapIndexNum');
            remainOringinDisplay('mapIndex');
            paper.view.draw();
        }

    });

    var remainOringinDisplay = function(layerName) {
        var matrix = new paper.Matrix();
        matrix = matrix.translate(worldMapView.layerMatrix.translateX, worldMapView.layerMatrix.translateY, 0.0).scale(worldMapView.layerMatrix.scaleX,
            worldMapView.layerMatrix.scaleY ,[paper.view.viewSize.width/2, paper.view.viewSize.height/2]);
        paper.project.layers[worldMapView.getLayerByName(layerName)].transform(matrix, true);
    };

})(window.layercontroller = window.layercontroller || {});

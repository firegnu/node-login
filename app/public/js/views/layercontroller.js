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
        if(mapIndex.currentMapIndexNum == '') {
            $('#mapindex').val('100');
        }
        else {
            $('#mapindex').val(mapIndex.currentMapIndexNum);
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
        mapIndex.currentMapIndexNum = $(this).val();
        if(paper.project.layers[mapIndex.getLayerByName('mapIndex')] !== undefined ||
            paper.project.layers[mapIndex.getLayerByName('mapIndexNum')] !== undefined) {
            paper.project.layers[mapIndex.getLayerByName('worldmap')].remove();
            paper.project.layers[mapIndex.getLayerByName('mapIndex')].remove();
            paper.project.layers[mapIndex.getLayerByName('mapIndexNum')].remove();
            //todo: set current matrix to mapindex layer
            var mapScaleNum = -1;
            if($(this).val() === '1') {
                mapScaleNum = 6;
            }
            if($(this).val() === '2.5') {
                mapScaleNum = 5;
            }
            if($(this).val() === '5') {
                mapScaleNum = 4;
            }
            if($(this).val() === '10') {
                mapScaleNum = 3;
            }
            if($(this).val() === '25') {
                mapScaleNum = 2;
            }
            if($(this).val() === '50') {
                mapScaleNum = 1;
            }
            if($(this).val() === '100') {
                mapScaleNum = 0;
            }
            if($(this).val() === '200') {
                mapScaleNum = -1;
            }
            mapIndex.DrawAllMaps(mapScaleNum, 'K');
            if(($("#mapindexnumlayer").is(":checked"))) {
                paper.project.layers[mapIndex.getLayerByName('mapIndexNum')].children[0].visible = true;
            }
            else {
                paper.project.layers[mapIndex.getLayerByName('mapIndexNum')].children[0].visible = false;
            }
            if(($("#worldmaplayer").is(":checked"))) {
                paper.project.layers[mapIndex.getLayerByName('worldmap')].children[0].visible = true;
            }
            else {
                paper.project.layers[mapIndex.getLayerByName('worldmap')].children[0].visible = false;
            }
            if(($("#mapindexlayer").is(":checked"))) {
                paper.project.layers[worldMapView.getLayerByName('mapIndex')].children[0].visible = true;
            }
            else {
                paper.project.layers[worldMapView.getLayerByName('mapIndex')].children[0].visible = false;
            }
            //remainOringinDisplay('worldmap');
            //remainOringinDisplay('mapIndexNum');
            //remainOringinDisplay('mapIndex');
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

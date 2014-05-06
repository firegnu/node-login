/**
 * Created by Administrator on 2014/4/21.
 */
(function(worldMapView) {

    var minX = -180 * 3600;//Infinity;
    var maxX = 180 * 3600;//-Infinity;
    var minY = 0;//Infinity;
    var maxY = 90 * 3600;//-Infinity;

    worldMapView.functionIndex = 'null';

    worldMapView.data = {};

    worldMapView.layerMatrix = new paper.Matrix();

    var getMinMaxXY = function(x, y) {
        if(x * 3600 > maxX) {
            maxX = x * 3600;
        }
        if(x * 3600 < minX) {
            minX = x * 3600;
        }
        if(y * 3600 > maxY) {
            maxY = y * 3600;
        }
        if(y * 3600 < minY) {
            minY = y * 3600;
        }
    };

    worldMapView.getLayerByName = function(layerName) {
        for(var i = 0; i < paper.project.layers.length; i++) {
            var layer = paper.project.layers[i];
            if(layer.name === layerName) {
                return i;
                break;
            }
        }
    };

    var getScale = function(deltaX, deltaY, width, height) {
        if(deltaX === 0 || deltaY === 0) {
            return 1;
        }
        var xScale, yScale;
        xScale = width / deltaX;
        yScale = height / deltaY;
        if(xScale <= yScale) {
            return xScale;
        } else {
            return yScale;
        }
    };

    var refreshPainter = function(deltX, deltY, scale, centerX, centerY) {
        var martrix = new paper.Matrix();
        martrix = martrix.translate(deltX, deltY, 0.0).scale(scale, [centerX, centerY]);
        paper.project.layers[worldMapView.getLayerByName('worldmap')].transform(martrix, true);
        paper.project.layers[worldMapView.getLayerByName('mapIndex')].transform(martrix, true);
        paper.project.layers[worldMapView.getLayerByName('mapIndexNum')].transform(martrix, true);

        worldMapView.layerMatrix.scaleX *= martrix.scaleX;
        worldMapView.layerMatrix.scaleY *= martrix.scaleY;
        worldMapView.layerMatrix.translateX += deltX;
        worldMapView.layerMatrix.translateY += deltY;
    };

    var rubberBand = function(downX, downY, currentX, currentY, rubber) {
        var pathRubberBand = new paper.Path.Rectangle([downX, downY], [currentX - downX, currentY - downY]);
        pathRubberBand.strokeColor = 'red';
        pathRubberBand.fillColor = 'cyan';
        pathRubberBand.strokeWidth = 1;
        pathRubberBand.opacity = 0.7;
        pathRubberBand.removeOnDrag();
        pathRubberBand.removeOnUp();
        rubber.addChild(pathRubberBand);
        //rubber.bringToFront();
    };

    var init = function() {
        var canvas = document.getElementById('mapcanvas');
        paper.setup(canvas);

        var toolForCanvas = new paper.Tool();
        //toolForCanvas.minDistance = 20;
        var rubberBandLayer = new paper.Layer();
        rubberBandLayer._name = 'rubberBandLayer';
        toolForCanvas.onMouseDown = function(event) {

        };
        toolForCanvas.onMouseDrag = function(event) {
            if(event.event.button === 0 && worldMapView.functionIndex === 'null') {
                refreshPainter(event.point.x - event.lastPoint.x, event.point.y - event.lastPoint.y, 1.0,
                        paper.view.viewSize.width/2, paper.view.viewSize.height/2);
            }
            else if(event.event.button === 1) {
                rubberBand(event.downPoint.x, event.downPoint.y, event.point.x, event.point.y, rubberBandLayer);
            }
        };

        toolForCanvas.onMouseUp = function(event) {
            if(event.event.button === 0) {
                if (worldMapView.functionIndex === 'oneclickdownload') {
                    var currentCoor = {};
                    currentCoor.screenx = event.point.x;
                    currentCoor.screeny = event.point.y;
                    var mapCoor = mapIndexTransform.ScreenToMap(currentCoor);
                }
            }
            else if(event.event.button === 1) {
                rubberBandLayer.removeChildren();
                var panZoomScale = getScale(Math.abs(event.point.x - event.downPoint.x),
                    Math.abs(event.point.y - event.downPoint.y), paper.view.viewSize.width, paper.view.viewSize.height);
                refreshPainter(0, 0, panZoomScale,
                        Math.abs(event.point.x + event.downPoint.x)/2, Math.abs(event.point.y + event.downPoint.y)/2);
            }
            else if(event.event.button === 2) {
                //$.contextMenu;
            }
        };

        $('#mapcanvas').mousewheel(function(event, delta, deltaX, deltaY) {
            //zoomin&out
            if(delta < 0) {
                refreshPainter(0, 0, 1.2, paper.view.viewSize.width/2, paper.view.viewSize.height/2);
            } else if(delta > 0) {
                refreshPainter(0, 0, 0.8, paper.view.viewSize.width/2, paper.view.viewSize.height/2);
            }
            return false;
        });
    };

    var contriesColors = ['#A52A2A', '#FFFF00', '#32CD32', '#F5F5F5', '#F4A460'];

    //5*Math.random()
    var drawMap = function(countryArray, scale) {
        var countryGroup = new paper.Group();
        var countries = new paper.Group();
        var countriesName = new paper.Group();
        for(var i = 0; i < countryArray.length; i++) {//
            var bName = false;
            for(var j = 0; j < countryArray[i].geoPolygon.length; j++) {
                var path = new paper.Path();
                path.strokeColor = 'black';
                //path.opacity = 0.5;
                path.fillColor = contriesColors[parseInt(5*Math.random())];
                path.name = countryArray[i].name;
                for(var k = 0; k < countryArray[i].geoPolygon[j].length; k++) {
                    var point = new paper.Point((countryArray[i].geoPolygon[j][k].x - minX) * scale,
                            paper.view.viewSize.height - (countryArray[i].geoPolygon[j][k].y - minY) * scale);
                    path.add(point);
                }
                path.closePath();
                /*path.onMouseEnter = function(data, event) {
                    this.fillColor = 'pink';
                    mouseEnterTip('', data.event.clientX, data.event.clientY, this.name);
                };
                path.onMouseLeave = function() {
                    this.fillColor = 'cyan';
                };*/
                if(!bName) {
                    var pathBound = path.bounds;
                    /*var countryName = new paper.PointText({
                        x: pathBound.x + pathBound.width/2 - 30,
                        y: pathBound.y + pathBound.height/2
                    });
                    countryName.content = countryArray[i].name;
                    countryName.characterStyle = {
                        fontFamily: 'microsoft yahei',
                        fontSize: 5,
                        fillColor: 'black'
                    };
                    countryName.data = {
                        type: 'cqtext'
                    };
                    countriesName.addChild(countryName);*/
                    bName = true;
                }
                countries.addChild(path);
            }
        }
        countryGroup.addChild(countries);
        //countryGroup.addChild(countriesName);
        var mapLayer = new paper.Layer([countryGroup]);
        mapLayer.name = 'worldmap';

    };

    worldMapView.draw = function(dataView) {
        init();
        var conutryies = [];
        var mapData = JSON.parse(dataView);
        for(var i = 0; i < mapData.features.length; i++) {
            var country = {};
            country.name = mapData.features[i].properties.NAME;
            country.geoPolygon = [];
            if(mapData.features[i].geometry.type === 'Polygon') {
                country.polygonNum = 1;
                var countryPoints = [];
                for(var j = 0; j < mapData.features[i].geometry.coordinates[0].length; j++) {
                    var x = mapData.features[i].geometry.coordinates[0][j][0];
                    var y = mapData.features[i].geometry.coordinates[0][j][1];
                    countryPoints.push({'x':x * 3600, 'y':y * 3600});
                    getMinMaxXY(x, y);
                }
                country.geoPolygon.push(countryPoints);
                //country.geoPoints = ;
                conutryies.push(country);
            }
            else if(mapData.features[i].geometry.type === 'MultiPolygon') {
                country.polygonNum = mapData.features[i].geometry.coordinates.length;
                for(var j = 0; j < mapData.features[i].geometry.coordinates.length; j++) {
                    var countryPoints = [];
                    for(var k = 0; k < mapData.features[i].geometry.coordinates[j].length; k++) {
                        for(var l = 0; l < mapData.features[i].geometry.coordinates[j][0].length; l++) {
                            var x = mapData.features[i].geometry.coordinates[j][0][l][0];
                            var y = mapData.features[i].geometry.coordinates[j][0][l][1];
                            countryPoints.push({'x':x * 3600, 'y':y * 3600});
                            getMinMaxXY(x, y);
                        }
                    }
                    country.geoPolygon.push(countryPoints);
                }
                conutryies.push(country);
            }
        }

        //get xScale&yScale
        var scale = 0.0;
        var scaleX = paper.view.viewSize.width/(maxX - minX);
        var scaleY = paper.view.viewSize.height/(maxY - minY);
        if(scaleX <= scaleX) {
            scale = scaleX;
        }
        else {
            scale = scaleY;
        }
        //draw the map
        drawMap(conutryies, scale);
    };
})(window.worldMapView = window.worldMapView || {});

/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 14-3-19
 * Time: 上午10:16
 * To change this template use File | Settings | File Templates.
 */
(function(mapIndex) {
    mapIndex.mapInit = function() {
    var canvas = document.getElementById("mapcanvas");
    paper.setup(canvas);
    this.DrawAllMaps(0,'K');
};

mapIndex.currentMapIndexNum = '';
//鼠标点取方式选择
mapIndex.functionIndex = 'null';

var polygondownloadPoints = [];

var coorscale = 360000.0;

CoorTransform = function()
{
    this.mscale = 1.0;
    this.mxstart = 0.0;
    this.mystart = 0.0;
    this.mhscreen = 0;
    this.mwscreen = 0;
}

MapCoor = function()
{
    this.mapx;
    this.mapy;
}
ScreenCoor = function()
{
    this.screenx;
    this.screeny;
}

function ScaleMapCoor(mapcoor)
{
    var newmapcoor = new MapCoor();
    newmapcoor.mapx = mapcoor.mapx * coorscale;
    newmapcoor.mapy = mapcoor.mapy * coorscale;
    return newmapcoor;
}

function OriginMapCoor(mapcoor)
{
    mapcoor.mapx = mapcoor.mapx/coorscale;
    mapcoor.mapy = mapcoor.mapy/coorscale;
    return mapcoor;
}

CoorTransform.prototype.MapToScreen = function(mapcoor)
{
    var screencoor = new ScreenCoor();
    screencoor.screenx = Math.floor((mapcoor.mapx - this.mxstart)/this.mscale);
    screencoor.screeny = Math.floor(this.mhscreen - (mapcoor.mapy - this.mystart)/this.mscale);
    return screencoor;
}

CoorTransform.prototype.ScreenToMap = function(screencoor)
{
    var mapcoor = new MapCoor();
    mapcoor.mapx = (this.mxstart + screencoor.screenx * this.mscale);
    mapcoor.mapy = (this.mystart + this.mscale * (this.mhscreen - screencoor.screeny));
    return mapcoor;
}

RowCollum = function()
{
    this.row = 0;
    this.collum = 0;
}

OneMap = function()
{
    this.blmapcoor = new MapCoor();
    this.urmapcoor = new MapCoor();
    this.rowcol = new RowCollum();
    this.nsflag = null;
    this.mapindex = null;
}

XYdetal = function()
{
    this.xdetal = 0;
    this.ydetal = 0;
}

function Get200WDetalByMapCoor(mapcoor)
{
    mydetal = new XYdetal();
    var latitude,longitude;
    var nsflag;
    if(mapcoor.mapx>=0)
        longitude = 180 + mapcoor.mapx;
    else
        longitude = -mapcoor.mapy;
    if(mapcoor.mapy>=0)
    {
        latitude = mapcoor.mapy;
        nsflag = "N";
        mydetal.ydetal = 8;
    }
    else
    {
        latitude = -mapcoor.mapy;
        nsflag = "S";
        mydetal.ydetal = -8;
    }

    if(latitude>= 0 && latitude <= 48)
    {
        mydetal.xdetal = 12;
    }
    if(latitude> 48 && latitude <= 64)
    {
        mydetal.xdetal = 18;
    }
    if(latitude> 64 && latitude <= 72)
    {
        mydetal.xdetal = 24;
    }
    if(latitude> 72 && latitude <= 80)
    {
        mydetal.xdetal = 30;
    }
    if(latitude> 80 && latitude <= 88)
    {
        mydetal.xdetal = 48;
    }
    return mydetal;
}

function GetDetalByMapCoor(mapcoor,maptype)
{
    mydetal = new XYdetal();
    var latitude,longitude;
    var nsflag;
    if(mapcoor.mapx>=0)
        longitude = mapcoor.mapx;
    else
        longitude = -mapcoor.mapy;
    if(mapcoor.mapy>=0)
    {
        latitude = mapcoor.mapy;
        nsflag = "N";
        mydetal.ydetal = 4;
    }
    else
    {
        latitude = -mapcoor.mapy;
        nsflag = "S";
        mydetal.ydetal = -4;
    }

    if(maptype=='K')
    {
        if(latitude>= 0 && latitude <= 48)
        {
            mydetal.xdetal = 6;
        }
        if(latitude> 48 && latitude <= 60)
        {
            mydetal.xdetal = 9;
        }
        if(latitude> 60 && latitude <= 68)
        {
            mydetal.xdetal = 12;
        }
        if(latitude> 68 && latitude <= 76)
        {
            mydetal.xdetal = 15;
        }
        if(latitude> 76 && latitude <= 88)
        {
            mydetal.xdetal = 24;
        }
    }
    if(maptype=='D')
    {
        if(latitude>= 0 && latitude <= 60)
        {
            mydetal.xdetal = 6;
        }
        if(latitude> 60 && latitude <= 76)
        {
            mydetal.xdetal = 12;
        }
        if(latitude> 76 && latitude <= 88)
        {
            mydetal.xdetal = 24;
        }
    }
    return mydetal;
}

function GetDetalByRowCol(rowcol,maptype,nsflag)
{
    mydetal = new XYdetal();
    if(nsflag == 'N')
        mydetal.ydetal = 4;
    else
        mydetal.ydetal = -4;
    if(maptype=='K')
    {
        if( rowcol.row <= 12)
        {
            mydetal.xdetal = 6;
        }
        if( rowcol.row <= 15 && rowcol.row > 12)
        {
            mydetal.xdetal = 9;
        }
        if( rowcol.row<= 17 && rowcol.row > 15)
        {
            mydetal.xdetal = 12;
        }
        if( rowcol.row <= 19 && rowcol.row > 17)
        {
            mydetal.xdetal = 15;
        }
        if( rowcol.row <= 22 && rowcol.row > 19)
        {
            mydetal.xdetal = 24;
        }
    }
    if(maptype=='D')
    {
        if(rowcol.row <= 15)
        {
            mydetal.xdetal = 6;
        }
        if(rowcol.row <= 19 && rowcol.row > 15)
        {
            mydetal.xdetal = 12;
        }
        if(rowcol.row <= 22 && rowcol.row > 19)
        {
            mydetal.xdetal = 24;
        }
    }
    return mydetal;
}

function GetNSflag(mapcoor)
{
    var nsflag = 'N';
    if(mapcoor.mapy < 0)
        nsflag = 'S';
    return nsflag;
}

function GetRowCode(n)
{
    var rowcode = '';
    switch(n)
    {
        case 1:
            rowcode = 'A';
            break;
        case 2:
            rowcode = 'B';
            break;
        case 3:
            rowcode = 'C';
            break;
        case 4:
            rowcode = 'D';
            break;
        case 5:
            rowcode = 'E';
            break;
        case 6:
            rowcode = 'F';
            break;
        case 7:
            rowcode = 'G';
            break;
        case 8:
            rowcode = 'H';
            break;
        case 9:
            rowcode = 'I';
            break;
        case 10:
            rowcode = 'J';
            break;
        case 11:
            rowcode = 'K';
            break;
        case 12:
            rowcode = 'L';
            break;
        case 13:
            rowcode = 'M';
            break;
        case 14:
            rowcode = 'N';
            break;
        case 15:
            rowcode = 'O';
            break;
        case 16:
            rowcode = 'P';
            break;
        case 17:
            rowcode = 'Q';
            break;
        case 18:
            rowcode = 'R';
            break;
        case 19:
            rowcode = 'S';
            break;
        case 20:
            rowcode = 'T';
            break;
        case 21:
            rowcode = 'U';
            break;
        case 22:
            rowcode = 'V';
            break;
    }
    return rowcode;
}

function CalculateByDetal(xdetal,ydetal,latitude,longitude)
{
    var rowcol = new RowCollum();
    if(latitude % Math.abs(ydetal) == 0)
        rowcol.row = Math.floor(Math.abs(latitude)/Math.abs(ydetal));
    else
        rowcol.row = Math.floor(Math.abs(latitude)/Math.abs(ydetal)) + 1;
    if(longitude % xdetal == 0)
        rowcol.collum = Math.floor(longitude/xdetal);
    else
        rowcol.collum = Math.floor(longitude/xdetal) + 1;
    return rowcol;
}

function Get200WDetalByRowcol(currowcol,nsflag)
{
    var mydetal = new XYdetal();
    if(nsflag == 'N')
        mydetal.ydetal = 8;
    else
        mydetal.ydetal = -8;
    if( currowcol.row <= 6)
    {
        mydetal.xdetal = 12;
    }
    if( currowcol.row <= 8 && currowcol.row > 6)
    {
        mydetal.xdetal = 18;
    }
    if( currowcol.row<= 9 && currowcol.row > 8)
    {
        mydetal.xdetal = 24;
    }
    if( currowcol.row <= 10 && currowcol.row > 9)
    {
        mydetal.xdetal = 30;
    }
    if( currowcol.row <= 11 && currowcol.row > 10)
    {
        mydetal.xdetal = 48;
    }
    return mydetal;
}

function Get200WMapIndexByRowCol(currowcol,nsflag)
{
    var map = new OneMap();
    var detal = Get200WDetalByRowcol(currowcol,nsflag);
    var leftlong = (currowcol.collum - 1) * detal.xdetal;
    var rightlong = currowcol.collum * detal.xdetal;
    var bottomlat = (currowcol.row - 1) * detal.ydetal;
    var uplat = currowcol.row * detal.ydetal;

    var xdetal = 6;
    var ydetal = 4;
    var flag = 1;
    if(detal.ydetal < 0)
        flag = -1;

    var blrowcol = CalculateByDetal(xdetal,ydetal * flag,bottomlat + 2*flag,leftlong + 2);
    var ulrowcol = CalculateByDetal(xdetal,ydetal * flag,uplat - 2*flag,leftlong + 2);
    var urrowcol = CalculateByDetal(xdetal,ydetal * flag,uplat - 2*flag,rightlong - 2);
    var brrowcol = CalculateByDetal(xdetal,ydetal * flag,uplat + 2*flag,rightlong - 2);

    map.blmapcoor.mapx = leftlong;
    map.blmapcoor.mapy = bottomlat;
    map.urmapcoor.mapx = rightlong;
    map.urmapcoor.mapy = uplat;
    map.rowcol.row = currowcol.row;
    map.rowcol.collum = currowcol.collum;
    map.nsflag = nsflag;

    var indexblrow,indexulrow,indexblcol,indexurcol;
    if(blrowcol.row < 10)
        indexblrow = '0' + Math.abs(blrowcol.row).toString();
    else
        indexblrow =  Math.abs(blrowcol.row).toString();
    if(ulrowcol.row < 10)
        indexulrow = '0' +  Math.abs(ulrowcol.row).toString();
    else
        indexulrow =  Math.abs(ulrowcol.row).toString();
    if(blrowcol.collum < 10)
        indexblcol = '0' + blrowcol.collum.toString();
    else
        indexblcol = blrowcol.collum.toString();
    if(urrowcol.collum < 10)
        indexurcol = '0' + urrowcol.collum.toString();
    else
        indexurcol = urrowcol.collum.toString();

    map.mapindex = 'K' + map.nsflag + indexblrow + indexulrow + indexblcol + indexurcol;
    return map;
}

function Get200WMapIndex(mapcoor)
{
    var detal = Get200WDetalByMapCoor(mapcoor);
    var currowcol = CalculateByDetal(detal.xdetal,detal.ydetal,mapcoor.mapy,mapcoor.mapx);
    var nsflag;
    if(mapcoor.mapy > 0)
        nsflag = 'N';
    else
        nsflag = 'S';
    var map = Get200WMapIndexByRowCol(currowcol,nsflag);
    return map;
}

function GetHemisphereMaps(nsflag)
{
    var maparray = [];
    for(var row = 1;row <= 11;row ++)
    {
        if(row <= 6)
        {
            for(var col = 1;col <=30;col ++)
            {
                var temprowcol = new RowCollum();
                temprowcol.row = row;
                temprowcol.collum = col;
                var tempmap = Get200WMapIndexByRowCol(temprowcol,nsflag);
                maparray.push(tempmap);
            }
        }
        if( row <= 8 && row > 6)
        {
            for(var col = 1;col <=20;col ++)
            {
                var temprowcol = new RowCollum();
                temprowcol.row = row;
                temprowcol.collum = col;
                var tempmap = Get200WMapIndexByRowCol(temprowcol,nsflag);
                maparray.push(tempmap);
            }
        }
        if( row == 9)
        {
            for(var col = 1;col <=15;col ++)
            {
                var temprowcol = new RowCollum();
                temprowcol.row = row;
                temprowcol.collum = col;
                var tempmap = Get200WMapIndexByRowCol(temprowcol,nsflag);
                maparray.push(tempmap);
            }
        }
        if( row == 10)
        {
            for(var col = 1;col <=12;col ++)
            {
                var temprowcol = new RowCollum();
                temprowcol.row = row;
                temprowcol.collum = col;
                var tempmap = Get200WMapIndexByRowCol(temprowcol,nsflag);
                maparray.push(tempmap);
            }
        }
        if( row == 11)
        {
            for(var col = 1;col <=8;col ++)
            {
                var temprowcol = new RowCollum();
                temprowcol.row = row;
                temprowcol.collum = col;
                var tempmap = Get200WMapIndexByRowCol(temprowcol,nsflag);
                maparray.push(tempmap);
            }
        }
    }
    return maparray;
}

function GetAll200WMaps()
{
    var maparray = [];
    var smaparray = GetHemisphereMaps('S');
    var nmaparray = GetHemisphereMaps('N');
    maparray = smaparray;
    for(var i = 0; i < nmaparray.length; i ++)
    {
        maparray.push(nmaparray[i]);
    }
    return maparray;
}

function CaculateBoundByRowCol(rowcol,maptype,nsflag)
{
    var curdetal = GetDetalByRowCol(rowcol,maptype,nsflag);
    var onemap = new OneMap();
    onemap.blmapcoor.mapx = (rowcol.collum - 1)*curdetal.xdetal;
    onemap.blmapcoor.mapy = (rowcol.row - 1)*curdetal.ydetal;
    onemap.urmapcoor.mapx = rowcol.collum*curdetal.xdetal;
    onemap.urmapcoor.mapy = rowcol.row*curdetal.ydetal;
    onemap.rowcol = rowcol;
    var indexrow,indexcol;
    if(rowcol.row < 10)
        indexrow = '0' + rowcol.row.toString();
    else
        indexrow = rowcol.row.toString();
    if(rowcol.collum < 10)
        indexcol = '0' + rowcol.collum.toString();
    else
        indexcol = rowcol.collum.toString();
    onemap.mapindex = maptype + nsflag +indexrow + indexcol;
    onemap.nsflag = nsflag;
    return onemap;
}

function CalculateOneMapindex(mapcoor,maptype)
{
    var latitude,longitude;
    var nsflag;
    longitude = 180 + mapcoor.mapx;
    if(mapcoor.mapy>=0)
    {
        latitude = mapcoor.mapy;
        nsflag = "N";
    }
    else
    {
        latitude = -mapcoor.mapy;
        nsflag = "S";
    }
    var curdetal = GetDetalByMapCoor(mapcoor,maptype);
    hundredrowcol = CalculateByDetal(curdetal.xdetal,curdetal.ydetal,latitude,longitude);
    onemap = CaculateBoundByRowCol(hundredrowcol,maptype,nsflag);

    return onemap;
}

function GetMaxCol(lbrowcol,rtrowcol,maptype)
{
    var sbcol = 0;
    if(maptype=='K')
    {
        if(lbrowcol.row <= 12)
        {
            if(rtrowcol.row <= 12)
                sbcol = rtrowcol.collum;
            if(rtrowcol.row > 12 && rtrowcol.row <= 15)
            {
                if(rtrowcol.collum % 2 == 0)
                    sbcol = Math.floor(rtrowcol.collum * 1.5);
                else
                    sbcol = Math.floor(rtrowcol.collum * 1.5) + 1;
            }
            if(rtrowcol.row > 15 && rtrowcol.row <= 17)
                sbcol = rtrowcol.collum * 2;
            if(rtrowcol.row > 17 && rtrowcol.row <= 19)
            {
                if(rtrowcol.collum % 2 == 0)
                    sbcol = Math.floor(rtrowcol.collum * 2.5);
                else
                    sbcol = Math.floor(rtrowcol.collum * 2.5) + 1;
            }
            if(rtrowcol.row > 19 && rtrowcol.row <= 22)
                sbcol = rtrowcol.collum * 4;
        }
        if(lbrowcol.row > 12 && lbrowcol.row <= 15)
        {
            if(rtrowcol.row <= 12)
            {
                if(rtrowcol.collum % 2 == 0)
                    sbcol =  Math.floor(rtrowcol.collum * 3.0/2.0);
                else
                    sbcol =  Math.floor(rtrowcol.collum * 3.0/2.0) + 1;
            }
            if(rtrowcol.row > 12 && rtrowcol.row <= 15)
                sbcol = rtrowcol.collum;
            if(rtrowcol.row > 15 && rtrowcol.row <= 17)
            {
                if(rtrowcol.collum % 3 == 0)
                    sbcol =  Math.floor(rtrowcol.collum * 4.0/3.0);
                else
                    sbcol =  Math.floor(rtrowcol.collum * 4.0/3.0) + 1;
            }
            if(rtrowcol.row > 17 && rtrowcol.row <= 19)
            {
                if(rtrowcol.collum % 3 == 0)
                    sbcol = Math.floor(rtrowcol.collum * 5.0/3.0);
                else
                    sbcol = Math.floor(rtrowcol.collum * 5.0/3.0) + 1;
            }
            if(rtrowcol.row > 19 && rtrowcol.row <= 22)
            {
                if(rtrowcol.collum % 3 == 0)
                    sbcol = Math.floor(rtrowcol.collum * 8.0/3.0);
                else
                    sbcol = Math.floor(rtrowcol.collum * 8.0/3.0) + 1;
            }
        }
        if(lbrowcol.row > 15 && lbrowcol.row <= 17)
        {
            if(rtrowcol.row <= 12)
            {
                if(rtrowcol.collum % 2 == 0)
                    sbcol = Math.floor(rtrowcol.collum / 2.0);
                else
                    sbcol = Math.floor(rtrowcol.collum / 2.0) + 1;
            }
            if(rtrowcol.row > 12 && rtrowcol.row <= 15)
            {
                if(rtrowcol.collum % 4 == 0)
                    sbcol = Math.floor(rtrowcol.collum * 3.0/4.0);
                else
                    sbcol = Math.floor(rtrowcol.collum *3.0/4.0) + 1;
            }
            if(rtrowcol.row > 15 && rtrowcol.row <= 17)
                sbcol = rtrowcol.collum;
            if(rtrowcol.row > 17 && rtrowcol.row <= 19)
            {
                if(rtrowcol.collum % 4 == 0)
                    sbcol = Math.floor(rtrowcol.collum * 5.0/4.0);
                else
                    sbcol = Math.floor(rtrowcol.collum * 5.0/4.0) + 1;
            }
            if(rtrowcol.row > 19 && rtrowcol.row <= 22)
            {
                sbcol = rtrowcol.collum * 2;
            }
        }
        if(lbrowcol.row > 17 && lbrowcol.row <= 19)
        {
            if(rtrowcol.row <= 12)
            {
                if(rtrowcol.collum % 5 == 0)
                    sbcol = Math.floor(rtrowcol.collum * 2.0 / 5.0);
                else
                    sbcol = Math.floor(rtrowcol.collum *2.0 / 5.0) + 1;
            }
            if(rtrowcol.row > 12 && rtrowcol.row <= 15)
            {
                if(rtrowcol.collum % 5 == 0)
                    sbcol = Math.floor(rtrowcol.collum * 3.0/5.0);
                else
                    sbcol = Math.floor(rtrowcol.collum * 3.0/5.0) + 1;
            }
            if(rtrowcol.row > 17 && rtrowcol.row <= 19)
                sbcol = rtrowcol.collum;
            if(rtrowcol.row > 19 && rtrowcol.row <= 22)
            {
                if(rtrowcol.collum % 5 == 0)
                    sbcol = Math.floor(rtrowcol.collum * 8.0/5.0);
                else
                    sbcol = Math.floor(rtrowcol.collum * 8.0/5.0) + 1;
            }
        }
        if(lbrowcol.row > 19 && lbrowcol.row <= 22)
        {
            if(rtrowcol.row <= 12)
            {
                if(rtrowcol.collum % 4 == 0)
                    sbcol = Math.floor(rtrowcol.collum * 1.0 / 4.0);
                else
                    sbcol = Math.floor(rtrowcol.collum * 1.0 / 4.0) + 1;
            }
            if(rtrowcol.row > 12 && rtrowcol.row <= 15)
            {
                if(rtrowcol.collum % 8 == 0)
                    sbcol = Math.floor(rtrowcol.collum * 3.0/8.0);
                else
                    sbcol = Math.floor(rtrowcol.collum * 3.0/8.0) + 1;
            }
            if(rtrowcol.row > 17 && rtrowcol.row <= 19)
            {
                if(rtrowcol.collum % 8 == 0)
                    sbcol = Math.floor(rtrowcol.collum * 5.0/8.0);
                else
                    sbcol = Math.floor(rtrowcol.collum * 5.0/8.0) + 1;
            }
            if(rtrowcol.row > 19 && rtrowcol.row <= 22)
                sbcol = rtrowcol.collum;
        }
    }
    if(maptype == 'D')
    {
        if(lbrowcol <= 15)
        {
            if(rtrowcol.row <= 15)
                sbcol = rtrowcol.collum;
            if(rtrowcol.row > 15 && rtrowcol.row <= 19)
                sbcol = rtrowcol.collum * 2;
            if(rtrowcol.row > 19 && rtrowcol.row <= 22)
                sbcol = rtrowcol.collum * 4;
        }
        if(lbrowcol.row > 15 && lbrowcol.row <= 19)
        {
            if(rtrowcol.row <= 15)
            {
                if(rtrowcol.collum % 2 == 0)
                    sbcol = Math.floor(rtrowcol.collum /2.0);
                else
                    sbcol = Math.floor(rtrowcol.collum /2.0) + 1;
            }
            if(rtrowcol.row > 15 && rtrowcol.row <= 19)
                sbcol = rtrowcol.collum;
            if(rtrowcol.row > 19 && rtrowcol.row <= 22)
                sbcol = rtrowcol.collum * 2;
        }
        if(lbrowcol.row > 19 && lbrowcol.row <= 22)
        {
            if(rtrowcol.row <= 15)
            {
                if(rtrowcol.collum % 4 == 0)
                    sbcol = Math.floor(rtrowcol.collum /4.0);
                else
                    sbcol = Math.floor(rtrowcol.collum /4.0) + 1;
            }
            if(rtrowcol.row > 15 && rtrowcol.row <= 19)
            {
                if(rtrowcol.collum % 2 == 0)
                    sbcol = Math.floor(rtrowcol.collum /2.0);
                else
                    sbcol = Math.floor(rtrowcol.collum /2.0) + 1;
            }
            if(rtrowcol.row > 19 && rtrowcol.row <= 22)
                sbcol = rtrowcol.collum;
        }
    }
    return sbcol;
}

function GetSRBMap(lbrowcol,rtrowcol,maptype,nsflag)
{
    var srbmap = new OneMap();
    var sbcol = GetMaxCol(lbrowcol,rtrowcol,maptype);
    srbmap.rowcol.row = lbrowcol.row;
    srbmap.rowcol.collum = sbcol;
    srbmap = CaculateBoundByRowCol(srbmap.rowcol,maptype,nsflag);
    return srbmap;
}

function GetRBmapFromDesignrow(row,rtrowcol,maptype)
{
    var rescol = 0;
    if(maptype == 'K')
    {
        if(row <= 12)
        {
            if(rtrowcol.row <= 12)
                rescol = rtrowcol.collum;
            if(rtrowcol.row <= 15 && rtrowcol.row > 12)
            {
                if(rtrowcol.collum % 2 == 0)
                    rescol = Math.floor(rtrowcol.collum * 9 / 6);
                else
                    rescol = Math.floor(rtrowcol.collum * 9 / 6) + 1;
            }
            if( rtrowcol.row <= 17 && rtrowcol.row > 15)
                rescol = Math.floor(rtrowcol.collum * 12 / 6);
            if( rtrowcol.row <= 19 && rtrowcol.row > 17)
            {
                if(rtrowcol.collum % 3 == 0)
                    rescol = Math.floor(rtrowcol.collum * 15 / 6);
                else
                    rescol = Math.floor(rtrowcol.collum * 15 / 6) + 1;
            }
            if( rtrowcol.row <= 22 && rtrowcol.row > 19)
                rescol = Math.floor(rtrowcol.collum * 24 / 6);
        }
        if(row <= 15 && row > 12)
        {
            if(rtrowcol.row <= 15 && rtrowcol.row > 12)
                rescol = rtrowcol.collum;
            if( rtrowcol.row <= 17 && rtrowcol.row > 15)
            {
                if(rtrowcol.collum % 3 == 0)
                    rescol = Math.floor(rtrowcol.collum * 12 / 9);
                else
                    rescol = Math.floor(rtrowcol.collum * 12 / 9) + 1;
            }
            if( rtrowcol.row <= 19 && rtrowcol.row > 17)
            {
                if(rtrowcol.collum % 3 == 0)
                    rescol = Math.floor(rtrowcol.collum * 15 / 9);
                else
                    rescol = Math.floor(rtrowcol.collum * 15 / 9) + 1;
            }
            if( rtrowcol.row <= 22 && rtrowcol.row > 19)
            {
                if(rtrowcol.collum % 3 == 0)
                    rescol = Math.floor(rtrowcol.collum * 24 / 9);
                else
                    rescol = Math.floor(rtrowcol.collum * 24 / 9) + 1;
            }
        }
        if(row <= 17 && row > 15)
        {
            if( rtrowcol.row <= 17 && rtrowcol.row > 15)
                rescol = rtrowcol.collum;
            if( rtrowcol.row <= 19 && rtrowcol.row > 17)
            {
                if(rtrowcol.collum % 4 == 0)
                    rescol = Math.floor(rtrowcol.collum * 15 / 12);
                else
                    rescol = Math.floor(rtrowcol.collum * 15 / 12) + 1;
            }
            if( rtrowcol.row <= 22 && rtrowcol.row > 19)
                rescol = Math.floor(rtrowcol.collum * 24 / 12);
        }
        if(row <= 19 && row > 17)
        {
            if( rtrowcol.row <= 19 && rtrowcol.row > 17)
                rescol = rtrowcol.collum;
            if( rtrowcol.row <= 22 && rtrowcol.row > 19)
            {
                if(rtrowcol.collum % 5 == 0)
                    rescol = Math.floor(rtrowcol.collum * 24 / 15);
                else
                    rescol = Math.floor(rtrowcol.collum * 24 / 15) + 1;
            }
        }
        if(row <= 22 && row > 19)
        {
            if( rtrowcol.row <= 22 && rtrowcol.row > 19)
                rescol = rtrowcol.collum;
        }
    }
    if(maptype == 'D')
    {
        if(row <= 15)
        {
            if(rtrowcol.row <= 15)
                rescol = rtrowcol.collum;
            if( rtrowcol.row <= 19 && rtrowcol.row > 15)
                rescol = Math.floor(rtrowcol.collum * 12 / 6);
            if( rtrowcol.row <= 22 && rtrowcol.row > 19)
                rescol = Math.floor(rtrowcol.collum * 24 / 6);
        }
        if(row <= 19 && row > 15)
        {
            if( rtrowcol.row <= 19 && rtrowcol.row > 15)
                rescol = rtrowcol.collum;
            if( rtrowcol.row <= 22 && rtrowcol.row > 19)
                rescol = Math.floor(rtrowcol.collum * 24 / 12);
        }
        if(row <= 22 && row > 19)
        {
            if( rtrowcol.row <= 22 && rtrowcol.row > 19)
                rescol = rtrowcol.collum;
        }
    }
    return rescol;
}


function GetMapsBetween(lbrowcol,rtrowcol,nsflag,maptype)
{
    var maparray = [];

    for(var i = lbrowcol.row;i <= rtrowcol.row;i ++)
    {
        if(maptype=='K')
        {
            if( i <= 12)
            {
                var endcol = GetRBmapFromDesignrow(12,rtrowcol,maptype);
                for(var j = lbrowcol.collum;j <= endcol;j ++)
                {
                    var currowcol = new RowCollum();
                    currowcol.row = i;
                    currowcol.collum = j;
                    var curmap = CaculateBoundByRowCol(currowcol,maptype,nsflag);
                    maparray.push(curmap);
                }
            }
            if( i<= 15 && i > 12)
            {
                var jstart;
                if(lbrowcol.row <= 12)
                    jstart = Math.floor((lbrowcol.collum-1) * 6 / 9) + 1;
                else
                    jstart = lbrowcol.collum;
                var endcol = GetRBmapFromDesignrow(15,rtrowcol,maptype);
                for(var j = jstart;j <= endcol;j ++)
                {
                    var currowcol = new RowCollum();
                    currowcol.row = i;
                    currowcol.collum = j;
                    var curmap = CaculateBoundByRowCol(currowcol,maptype,nsflag);
                    maparray.push(curmap);
                }
            }
            if( i<= 17 && i > 15)
            {
                var jstart;
                if(lbrowcol.row <= 12)
                    jstart = Math.floor((lbrowcol.collum-1) * 6 / 12) + 1;
                else if( lbrowcol.row <= 15 && lbrowcol.row > 12)
                    jstart = Math.floor((lbrowcol.collum-1) * 9 / 12) + 1;
                else
                    jstart = lbrowcol.collum;
                var endcol = GetRBmapFromDesignrow(17,rtrowcol,maptype);
                for(var j = jstart;j <= endcol;j ++)
                {
                    var currowcol = new RowCollum();
                    currowcol.row = i;
                    currowcol.collum = j;
                    var curmap = CaculateBoundByRowCol(currowcol,maptype,nsflag);
                    maparray.push(curmap);
                }
            }
            if( i<= 19 && i > 17)
            {
                var jstart;
                if(lbrowcol.row <= 12)
                    jstart = Math.floor((lbrowcol.collum - 1) * 6 / 15) + 1;
                else if( lbrowcol.row <= 15 && lbrowcol.row > 12)
                    jstart = Math.round((lbrowcol.collum - 1) * 9 / 15) + 1;
                else if( lbrowcol.row <= 17 && lbrowcol.row > 15)
                    jstart = Math.floor((lbrowcol.collum - 1) * 12 / 15) + 1;
                else
                    jstart = lbrowcol.collum;
                var endcol = GetRBmapFromDesignrow(19,rtrowcol,maptype);
                for(var j = jstart;j <= endcol;j ++)
                {
                    var currowcol = new RowCollum();
                    currowcol.row = i;
                    currowcol.collum = j;
                    var curmap = CaculateBoundByRowCol(currowcol,maptype,nsflag);
                    maparray.push(curmap);
                }
            }
            if( i<= 22 && i > 19)
            {
                var jstart;
                if(lbrowcol.row <= 12)
                    jstart = Math.floor((lbrowcol.collum-1) * 6 / 24) + 1;
                else if( lbrowcol.row <= 15 && lbrowcol.row > 12)
                    jstart = Math.floor((lbrowcol.collum-1) * 9 / 24) +1;
                else if( lbrowcol.row <= 17 && lbrowcol.row > 15)
                    jstart = Math.floor((lbrowcol.collum-1) * 12 / 24) + 1;
                else if( lbrowcol.row <= 19 && lbrowcol.row > 17)
                    jstart = Math.floor((lbrowcol.collum-1) * 15 / 24) + 1;
                else
                    jstart = lbrowcol.collum;
                var endcol = GetRBmapFromDesignrow(22,rtrowcol,maptype);
                for(var j = jstart;j <= endcol;j ++)
                {
                    var currowcol = new RowCollum();
                    currowcol.row = i;
                    currowcol.collum = j;
                    var curmap = CaculateBoundByRowCol(currowcol,maptype,nsflag);
                    maparray.push(curmap);
                }
            }
        }
        if(maptype=='D')
        {
            if(i <= 15)
            {
                var endcol = GetRBmapFromDesignrow(15,rtrowcol,maptype);
                for(var j = lbrowcol.collum;j <= endcol;j ++)
                {
                    var currowcol = new RowCollum();
                    currowcol.row = i;
                    currowcol.collum = j;
                    var curmap = CaculateBoundByRowCol(currowcol,maptype,nsflag);
                    maparray.push(curmap);
                }
            }
            if(i <= 19 && i > 15)
            {
                var jstart;
                if(lbrowcol.row <= 15)
                    jstart = Math.floor((lbrowcol.collum-1) * 6 / 12) + 1;
                else
                    jstart = lbrowcol.collum;
                var endcol = GetRBmapFromDesignrow(19,rtrowcol,maptype);
                for(var j = jstart;j <= endcol;j ++)
                {
                    var currowcol = new RowCollum();
                    currowcol.row = i;
                    currowcol.collum = j;
                    var curmap = CaculateBoundByRowCol(currowcol,maptype,nsflag);
                    maparray.push(curmap);
                }
            }
            if(i <= 22 && i > 19)
            {
                var jstart;
                if(lbrowcol.row <= 15)
                    jstart = Math.floor((lbrowcol.collum - 1) * 6 / 24) + 1;
                else if(lbrowcol.row <= 19 && lbrowcol.row > 15)
                    jstart = Math.floor((lbrowcol.collum - 1) * 12 / 24) + 1;
                else
                    jstart = lbrowcol.collum;
                var endcol = GetRBmapFromDesignrow(22,rtrowcol,maptype);
                for(var j = jstart;j <= endcol;j ++)
                {
                    var currowcol = new RowCollum();
                    currowcol.row = i;
                    currowcol.collum = j;
                    var curmap = CaculateBoundByRowCol(currowcol,maptype,nsflag);
                    maparray.push(curmap);
                }
            }
        }
    }
    return maparray;
}

function GetOneRow(rowcol,maptype)
{
    var maxcol = 0;
    if(maptype=='K')
    {
        if(rowcol.row <= 12)
            maxcol = rowcol.collum;
        if(rowcol.row > 12 && rowcol.row <= 15)
        {
            if(rowcol.collum % 2 == 0)
                maxcol = Math.floor(rowcol.collum * 1.5) - 1;
            else
                maxcol = Math.floor(rowcol.collum * 1.5);
        }
        if(rowcol.row > 15 && rowcol.row <= 17)
            maxcol = (rowcol.collum - 1) * 2 + 1;
        if(rowcol.row > 17 && rowcol.row <= 19)
            maxcol = (rowcol.collum - 1) * 2 + 1;
        if(rowcol.row > 19 && rowcol.row <= 22)
            maxcol = (rowcol.collum - 1) * 4 + 1;
    }
    if(maptype=='D')
    {
        if(rowcol.row <= 15)
            maxcol = rowcol.collum;
        if(rowcol.row > 15 && rowcol.row <= 19)
            maxcol = (rowcol.collum - 1) * 2 + 1;
        if(rowcol.row > 19 && rowcol.row <= 22)
            maxcol = (rowcol.collum - 1) * 4 + 1;
    }
    var currowcol = new RowCollum();
    currowcol.row = 1;
    currowcol.collum = maxcol;
    return currowcol;
}

function GetMapsBetweenTwoIntervel(lbrowcol,lbnsflag,rtrowcol,rtnsflag,maptype)
{
    var maparray = [];
    if(lbnsflag == rtnsflag)
    {
        if(lbnsflag == 'S')
        {
            var temprow = lbrowcol.row;
            lbrowcol.row = rtrowcol.row;
            rtrowcol.row = temprow;
        }

        maparray = GetMapsBetween(lbrowcol,rtrowcol,lbnsflag,maptype);
    }
    else
    {
        var lbfirstrow = GetOneRow(lbrowcol,maptype);
        //var rtfirstrow = GetOneRow(rtrowcol,maptype);
        var srbmap = GetSRBMap(lbrowcol,rtrowcol,maptype,'S');
        var slbrowcol = new RowCollum();
        slbrowcol.row = srbmap.rowcol.row;
        slbrowcol.collum = srbmap.rowcol.collum;
        var smaparray = GetMapsBetween(lbfirstrow,slbrowcol,lbnsflag,maptype);
        var nmaparray = GetMapsBetween(lbfirstrow,rtrowcol,rtnsflag,maptype);
        maparray = smaparray;
        for(var i = 0; i < nmaparray.length; i ++)
        {
            maparray.push(nmaparray[i]);
        }
    }
    return maparray;
}

function GetMaxRCbyScale(scaleflag)
{
    var maxrowcol = new RowCollum();
    switch (scaleflag)
    {
        case 1://50W
        {
            maxrowcol.row = 2;
            maxrowcol.collum = 2;
            break;
        }
        case 2://25W
        {
            maxrowcol.row = 4;
            maxrowcol.collum = 4;
            break;
        }
        case 3://10W
        {
            maxrowcol.row = 12;
            maxrowcol.collum = 12;
            break;
        }
        case 4://5W--以10W为基础
        {
            maxrowcol.row = 2;
            maxrowcol.collum = 2;
            break;
        }
        case 5://2.5W--以5W为基础
        {
            maxrowcol.row = 2;
            maxrowcol.collum = 2;
            break;
        }
        case 6://1W--以2.5W为基础
        {
            maxrowcol.row = 2;
            maxrowcol.collum = 2;
            break;
        }
    }
    return maxrowcol;
}

function GetMapsByScale(maparray,scaleflag)
{
    var resultmaparry = [];
    var maxrowcol = GetMaxRCbyScale(scaleflag);
    for(var i = 0;i < maparray.length; i ++)
    {
        var tempmap = maparray[i];
        for(var r = 0;r < maxrowcol.row;r ++)
        {
            for(var c = 0;c < maxrowcol.collum; c++)
            {
                var resmap = new OneMap();
                resmap.rowcol.row = r + 1;
                resmap.rowcol.collum = c + 1;
                resmap.blmapcoor.mapx = tempmap.blmapcoor.mapx + (tempmap.urmapcoor.mapx - tempmap.blmapcoor.mapx) * parseFloat(c)/parseFloat(maxrowcol.collum);
                resmap.blmapcoor.mapy = tempmap.blmapcoor.mapy + (tempmap.urmapcoor.mapy - tempmap.blmapcoor.mapy) * parseFloat(maxrowcol.row - r -1)/parseFloat(maxrowcol.row);
                resmap.urmapcoor.mapx = tempmap.blmapcoor.mapx + (tempmap.urmapcoor.mapx - tempmap.blmapcoor.mapx) * parseFloat(c + 1)/parseFloat(maxrowcol.collum);
                resmap.urmapcoor.mapy = tempmap.blmapcoor.mapy + (tempmap.urmapcoor.mapy - tempmap.blmapcoor.mapy) * parseFloat(maxrowcol.row - r)/parseFloat(maxrowcol.row);
                if((r + 1) * (c + 1) < 10)
                    resmap.mapindex = tempmap.mapindex + '0' + ((r + 1) * (c + 1)).toString();
                else
                    resmap.mapindex = tempmap.mapindex + ((r + 1) * (c + 1)).toString();
                resultmaparry.push(resmap);
            }
        }
    }
    return resultmaparry;
}

function GetMapArrayByScaleflag(maparray,scaleflag)
{
    var resmaparray = [];
    if(scaleflag == -1)
        resmaparray = GetAll200WMaps();
    if(scaleflag == 0)
        resmaparray = maparray;
    if(scaleflag == 1 || scaleflag == 2 || scaleflag == 3)
    {
        resmaparray = GetMapsByScale(maparray,scaleflag);
    }
    if(scaleflag == 4)
    {
        var tenwmaparray = GetMapsByScale(maparray,3);
        resmaparray = GetMapsByScale(tenwmaparray,scaleflag);
    }
    if(scaleflag == 5)
    {
        var tenwmaparray = GetMapsByScale(maparray,3);
        var fivewmaparray = GetMapsByScale(tenwmaparray,4);
        resmaparray = GetMapsByScale(fivewmaparray,scaleflag);
    }
    if(scaleflag == 6)
    {
        var tenwmaparray = GetMapsByScale(maparray,3);
        var fivewmaparray = GetMapsByScale(tenwmaparray,4);
        var twopointfivemaparray = GetMapsByScale(fivewmaparray,5);
        resmaparray = GetMapsByScale(twopointfivemaparray,scaleflag);
    }
    return resmaparray;
}

function GetLBmapFromPointarray(points,maptype)
{
    var minmapx = 180;
    var minmapy = 90;

    for (var i = 0; i < points.length; i ++)
    {
        if(points[i].mapx < minmapx)
            minmapx = points[i].mapx;
        if(points[i].mapy < minmapy)
            minmapy = points[i].mapy;
    }
    var mapcoor = new MapCoor();
    mapcoor.mapx = minmapx;
    mapcoor.mapy = minmapy;
    var lbmap = CalculateOneMapindex(mapcoor,maptype);
    return lbmap;
}

function GetRTmapFromPointarray(points,maptype)
{
    var maxmapx = -180;
    var maxmapy = -90;

    for (var i = 0; i < points.length; i ++)
    {
        if(points[i].mapx > maxmapx)
            maxmapx = points[i].mapx;
        if(points[i].mapy > maxmapy)
            maxmapy = points[i].mapy;
    }
    var mapcoor = new MapCoor();
    mapcoor.mapx = maxmapx;
    mapcoor.mapy = maxmapy;
    var rtmap = CalculateOneMapindex(mapcoor,maptype);
    return rtmap;
}

paper.Path.prototype.isPointInPolygon = function(pt) {
    for(var c = false, i = -1, l = this.segments.length, j = l - 1; ++i < l; j = i)
        ((this.segments[i].point.y <= pt.y && pt.y < this.segments[j].point.y) || (this.segments[j].point.y <= pt.y && pt.y < this.segments[i].point.y))
        && (pt.x < (this.segments[j].point.x - this.segments[i].point.x) * (pt.y - this.segments[i].point.y) / (this.segments[j].point.y - this.segments[i].point.y) + this.segments[i].point.x)
        && (c = !c);
    return c;
}


function IsMapInPolygon(onemap,pathpolygon,transform)
{
    var isintersec = false;
    var blcoor = new MapCoor();
    blcoor.mapx = onemap.blmapcoor.mapx;
    blcoor.mapy = onemap.blmapcoor.mapy;
    var urcoor = new MapCoor();
    urcoor.mapx = onemap.urmapcoor.mapx;
    urcoor.mapy = onemap.urmapcoor.mapy;

    var blscreen = transform.MapToScreen(ScaleMapCoor(blcoor));
    var urscreen = transform.MapToScreen(ScaleMapCoor(urcoor));

    var blpoint = new paper.Point(blscreen.screenx,blscreen.screeny);
    var ulpoint = new paper.Point(blscreen.screenx,urscreen.screeny);
    var urpoint = new paper.Point(urscreen.screenx,urscreen.screeny);
    var brpoint = new paper.Point(urscreen.screenx,blscreen.screeny);
    var mapbound = new paper.Path();
    mapbound.add(blpoint);
    mapbound.add(ulpoint);
    mapbound.add(urpoint);
    mapbound.add(brpoint);
    mapbound.add(blpoint);
    //mapbound.visible = false;
    var inter = pathpolygon.getIntersections(mapbound);

    if(inter.length != 0)
        isintersec = true;
    if(!isintersec && (pathpolygon.isPointInPolygon(blpoint) || pathpolygon.isPointInPolygon(ulpoint) || pathpolygon.isPointInPolygon(urpoint) || pathpolygon.isPointInPolygon(brpoint)))
        isintersec = true;
    var polypoints = pathpolygon.segments;
    for(var i = 0;i < polypoints.length;i++)
    {
        if(mapbound.isPointInPolygon(polypoints[i].point))
        {
            isintersec = true;
            break;
        }
    }
    mapbound.remove();
    return isintersec;
}

function CreatePolygon(points,transform)
{
    var mapcoor = new MapCoor();
    mapcoor.mapx = (180 + points[0].mapx);
    mapcoor.mapy = points[0].mapy;
    var startcreen = transform.MapToScreen(ScaleMapCoor(mapcoor));
    var startpoint =  new paper.Point(startcreen.screenx,startcreen.screeny);
    var polygon = new paper.Path();
    for(var i = 0; i < points.length; i ++)
    {
        var tempmapcoor = new MapCoor();
        tempmapcoor.mapx = (180 + points[i].mapx);
        tempmapcoor.mapy = points[i].mapy;
        var scereen = transform.MapToScreen(ScaleMapCoor(tempmapcoor));
        var point = new paper.Point(scereen.screenx,scereen.screeny);
        polygon.add(point);
    }
    polygon.add(startpoint);
    polygon.closed;
    polygon.style = {
        strokeColor: 'green',
        strokeWidth: 1
    };
    polygon.data = {
        type: 'polyline'
    };
    prePathVector.push(polygon);
    return polygon;
}

function SelectMapsByPolygon(transform,maptype,mapscale,points)
{
    var resmaparray = [];
    var maparray = [];
    if(mapscale == -1)
        maparray = GetAll200WMaps();
    else
    {
        var lbmap = GetLBmapFromPointarray(points,maptype);
        var rtmap = GetRTmapFromPointarray(points,maptype);
        var hundmaparray = GetMapsBetweenTwoIntervel(lbmap.rowcol,lbmap.nsflag,rtmap.rowcol,rtmap.nsflag,maptype);
        maparray = GetMapArrayByScaleflag(hundmaparray,mapscale);
    }
    var polygon = CreatePolygon(points,transform);
    for(var m = 0; m < maparray.length; m ++)
    {
        var isintersect = IsMapInPolygon(maparray[m],polygon,transform);
        if(isintersect)
        {
            var lbmapcoor = maparray[m].blmapcoor;
            var rtmapcoor = maparray[m].urmapcoor;

            var lbscreencoor = transform.MapToScreen(ScaleMapCoor(lbmapcoor));
            var rtscreencoor = transform.MapToScreen(ScaleMapCoor(rtmapcoor));

            var mapwidth = rtscreencoor.screenx - lbscreencoor.screenx;
            var mapheight = lbscreencoor.screeny - rtscreencoor.screeny;
            path = new paper.Path.Rectangle(lbscreencoor.screenx,rtscreencoor.screeny,mapwidth,mapheight);
            path.style = {
                fillColor: 'white',
                strokeColor: 'green',
                strokeWidth: 1
            };
            path.opacity = 0.6;
            prePathVector.push(path);
            resmaparray.push(maparray[m]);
            selectedmap.push(maparray[m].mapindex);
        }
    }
    var polygondis = CreatePolygon(points,transform);
    return resmaparray;
}

function GetCountryData()
{
    var conutryies = [];
    var mapData = worldmapData;
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
                countryPoints.push({'x':x, 'y':y});
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
                        countryPoints.push({'x':x, 'y':y});
                    }
                }
                country.geoPolygon.push(countryPoints);
            }
            conutryies.push(country);
        }
    }
    return conutryies;
}

var contriesColors = ['#A52A2A', '#FFFF00', '#32CD32', '#F5F5F5', '#F4A460'];

function DrawMap(countryArray, transform)
{
    var countryGroup = new paper.Group();
    var countries = new paper.Group();
    var countriesName = new paper.Group();
    for(var i = 0; i < countryArray.length; i++) {//
        var bName = false;
        for(var j = 0; j < countryArray[i].geoPolygon.length; j++) {
            var path = new paper.Path();
            path.strokeColor = 'black';
            path.fillColor = contriesColors[parseInt(5*Math.random())];
            path.name = countryArray[i].name;
            for(var k = 0; k < countryArray[i].geoPolygon[j].length; k++) {
                var mapcoor = new MapCoor();
                mapcoor.mapx = countryArray[i].geoPolygon[j][k].x;
                mapcoor.mapy = countryArray[i].geoPolygon[j][k].y;
                mapcoor.mapx += 180;
                var curscreen = transform.MapToScreen(ScaleMapCoor(mapcoor));

                var point = new paper.Point(curscreen.screenx,curscreen.screeny);
                path.add(point);
            }
            path.closePath();

            if(!bName) {
                var pathBound = path.bounds;
                bName = true;
            }
            countries.addChild(path);
        }
    }
    countryGroup.addChild(countries);
    var mapLayer = new paper.Layer([countryGroup]);
    mapLayer.name = 'worldmap';
}

mapIndex.getLayerByName = function(layerName)
{
    for(var i = 0; i < paper.project.layers.length; i++) {
        var layer = paper.project.layers[i];
        if(layer.name === layerName) {
            return i;
            break;
        }
    }
};

function refreshPainter(deltX, deltY, scale, centerX, centerY)
{
    var martrix = new paper.Matrix();
    martrix = martrix.translate(deltX, deltY, 0.0).scale(scale, [centerX, centerY]);
    paper.project.layers[mapIndex.getLayerByName('worldmap')].transform(martrix, true);
    paper.project.layers[mapIndex.getLayerByName('mapIndex')].transform(martrix, true);
    paper.project.layers[mapIndex.getLayerByName('mapIndexNum')].transform(martrix, true);
};

var clearPathStyle = function(path) {
    if(path.data.type === 'polyline') {
        path.remove();
    }
    else {
        path.style = {
            fillColor:'cyan',
            strokeColor: 'black',
            strokeWidth: 1
        }
        path.opacity = 0.1;
    }
}

mapIndex.clearSelected = function() {
    selectedmap.length = 0;
    //清除单击
    if(prePath != undefined) {
        clearPathStyle(prePath);
    }
    //清除多选
    for(var i = 0; i < prePathVector.length; i++) {
        clearPathStyle(prePathVector[i]);
    }
    //清除多边形选取
    polygondownloadPoints.length = 0;
};


var selectedmap = [];
mapIndex.downloadSelected = function() {
    if(polygondownloadPoints.length > 1) {
        if($('#mapindex').val() === '1') {
            var resultMaps = SelectMapsByPolygon(gTransform, 'K' , 6 , polygondownloadPoints);
        }
        if($('#mapindex').val() === '2.5') {
            var resultMaps = SelectMapsByPolygon(gTransform, 'K' , 5 , polygondownloadPoints);
        }
        if($('#mapindex').val() === '5') {
            var resultMaps = SelectMapsByPolygon(gTransform, 'K' , 4 , polygondownloadPoints);
        }
        if($('#mapindex').val() === '10') {
            var resultMaps = SelectMapsByPolygon(gTransform, 'K' , 3 , polygondownloadPoints);
        }
        if($('#mapindex').val() === '25') {
            var resultMaps = SelectMapsByPolygon(gTransform, 'K' , 2 , polygondownloadPoints);
        }
        if($('#mapindex').val() === '50') {
            var resultMaps = SelectMapsByPolygon(gTransform, 'K' , 1 , polygondownloadPoints);
        }
        if($('#mapindex').val() === '100') {
            var resultMaps = SelectMapsByPolygon(gTransform, 'K' , 0 , polygondownloadPoints);
        }
        if($('#mapindex').val() === '200') {
            var resultMaps = SelectMapsByPolygon(gTransform, 'K' , -1 , polygondownloadPoints);
        }
    }

    var str = '';
    for(var i = 0; i < selectedmap.length; i++) {
        str += selectedmap[i];
    }
    alert(str);
};

var prePath;
var prePathVector = [];

function DrawOneMap(transform,onemap,color,mapIndexGroup,mapIndexTextGroup,textcolor,selectedmap)
{
    var lbmapcoor = onemap.blmapcoor;
    var rtmapcoor = onemap.urmapcoor;

    var lbscreencoor = transform.MapToScreen(ScaleMapCoor(lbmapcoor));
    var rtscreencoor = transform.MapToScreen(ScaleMapCoor(rtmapcoor));

    var mapwidth = rtscreencoor.screenx - lbscreencoor.screenx;
    var mapheight = lbscreencoor.screeny - rtscreencoor.screeny;
    var path = new paper.Path.Rectangle(lbscreencoor.screenx,rtscreencoor.screeny,mapwidth,mapheight);
    path.style = {
        fillColor:'cyan',
        strokeColor: color,
        strokeWidth: 1
    }
    path.opacity = 0.1;
    path.data = {
        mapindex : onemap.mapindex
    };
    path.onMouseUp = function(event)
    {
        var point = new paper.Point(event.point.x,event.point.y);
        if(event.event.button === 0) {
            if(mapIndex.functionIndex === 'oneclickdownload') {
                if(prePath != undefined) {
                    clearPathStyle(prePath);
                }
                this.fillColor = 'white';
                path.opacity = 0.6;
                selectedmap.length = 0;
                selectedmap.push(this.data.mapindex);
                prePath = this;
            }
            else if(mapIndex.functionIndex === 'oneclickmultidownload') {
                this.fillColor = 'white';
                path.opacity = 0.6;
                selectedmap.push(this.data.mapindex);
                prePathVector.push(this);
            }
        }
    };
    mapIndexGroup.addChild(path);
    var text = new paper.PointText(new paper.Point(lbscreencoor.screenx + mapwidth/2, rtscreencoor.screeny + mapheight/2));
    text.justification = 'center';
    text.fillColor = 'black';
    text.content = onemap.mapindex;
    text.characterStyle = {
        fontFamily: 'microsoft yahei',
        fontSize: 3,
        fillColor: textcolor
    };
    text.data = {
        type: 'cqtext'
    };
    mapIndexTextGroup.addChild(text);
}

var caculatePosition = function(x, y) {
    var screencoor1 = new ScreenCoor();
    screencoor1.screenx = x;
    screencoor1.screeny = y;
    var resmap1 = gTransform.ScreenToMap(screencoor1);
    resmap1 = OriginMapCoor(resmap1);
    resmap1.mapx -= 180;

    var point1 = new MapCoor();
    point1.mapx = resmap1.mapx;
    point1.mapy = resmap1.mapy;

    polygondownloadPoints.push(point1);
};

var gTransform;
mapIndex.DrawAllMaps = function(mapscale,maptype)
{
    var transform = new CoorTransform();
    var viewsize =  paper.project.view.size;
    transform.mwscreen = viewsize.width;
    transform.mhscreen = viewsize.height;

    var lbrowcol = new RowCollum();
    lbrowcol.row = 22;
    lbrowcol.collum = 1;
    var rtrowcol = new RowCollum();

    rtrowcol.row = 22;
    rtrowcol.collum = 15;

    var minonemap = CaculateBoundByRowCol(lbrowcol,maptype,'S');
    var maxonemap = CaculateBoundByRowCol(rtrowcol,maptype,'N');

    paper.project.currentStyle = {
        fillColor: 'white',
        strokeColor: 'black'
    };
    if(minonemap.nsflag == 'N')
    {
        transform.mystart = minonemap.blmapcoor.mapy * coorscale;
        transform.mxstart = minonemap.blmapcoor.mapx * coorscale;
    }
    if(minonemap.nsflag == 'S')
    {
        transform.mystart = minonemap.urmapcoor.mapy * coorscale;
        transform.mxstart = minonemap.blmapcoor.mapx * coorscale;
    }
    var wscale = (maxonemap.urmapcoor.mapx - transform.mxstart)/transform.mwscreen;
    var hscale = (maxonemap.urmapcoor.mapy - transform.mystart)/transform.mhscreen;
    if(wscale > hscale)
        transform.mscale = wscale;
    else
        transform.mscale = hscale;

    var onhundmaparray = GetMapsBetweenTwoIntervel(lbrowcol,'S',rtrowcol,'N',maptype);

    var conutryies = GetCountryData();
    DrawMap(conutryies,transform);

    var maparray = GetMapArrayByScaleflag(onhundmaparray,mapscale);
    var mapIndexGroup = new paper.Group();
    var mapIndexTextGroup = new paper.Group();
    //alert( '共'+maparray.length.toString()+'幅');
    for(var i = 0; i < maparray.length; i++)
    {
        DrawOneMap(transform,maparray[i],'black',mapIndexGroup,mapIndexTextGroup,'red',selectedmap);
    }
    var mapIndexLayer = new paper.Layer([mapIndexGroup]);
    var mapIndexNumLayer = new paper.Layer([mapIndexTextGroup]);
    mapIndexLayer.name = 'mapIndex';
    mapIndexNumLayer.name = 'mapIndexNum';


    gTransform = transform;
    var mytool = new paper.Tool();
    mytool.onMouseDown = function(event)
    {

    };


    mytool.onKeyDown = function(event)
    {
        var str = 'The selected maps:';
        if(event.key == 'space')
        {
            for(var j = 0;j < selectedmap.length; j ++)
            {
                str += selectedmap[j] + "  ";
            }
            alert(str);
        }

    };

    mytool.onMouseDrag = function(event) {
        if(event.event.button === 0 && mapIndex.functionIndex !== 'oneclickrubberdownload') {
            refreshPainter(event.point.x - event.lastPoint.x, event.point.y - event.lastPoint.y, 1.0,
                    paper.view.viewSize.width/2, paper.view.viewSize.height/2);
            var screencoor = new ScreenCoor();
            screencoor.screenx = event.point.x;
            screencoor.screeny = event.point.y;
            var resmap = transform.ScreenToMap(screencoor);
            var lastscreencoor = new ScreenCoor();
            lastscreencoor.screenx = event.lastPoint.x;
            lastscreencoor.screeny = event.lastPoint.y;
            var lastresmap = transform.ScreenToMap(lastscreencoor);
            transform.mxstart -= resmap.mapx - lastresmap.mapx;
            transform.mystart -= resmap.mapy - lastresmap.mapy;
            gTransform = transform;
        }
    };



    mytool.onMouseUp = function(event) {
        if(event.event.button === 0 && event.point.x === event.downPoint.x && event.point.y === event.downPoint.y) {
            if(mapIndex.functionIndex === 'oneclickpolygondownload') {
                var screencoor = new ScreenCoor();
                screencoor.screenx = event.point.x;
                screencoor.screeny = event.point.y;
                var resmap = transform.ScreenToMap(screencoor);
                resmap = OriginMapCoor(resmap);
                resmap.mapx -= 180;

                var point = new MapCoor();
                point.mapx = resmap.mapx;
                point.mapy = resmap.mapy;

                polygondownloadPoints.push(point);
            }
        }
        else if(mapIndex.functionIndex === 'oneclickrubberdownload' && event.event.button === 0) {
            caculatePosition(event.downPoint.x, event.downPoint.y);
            caculatePosition(event.downPoint.x, event.point.y);
            caculatePosition(event.point.x, event.point.y);
            caculatePosition(event.point.x, event.downPoint.y);
        }
    };

    $('#mapcanvas').mousewheel(function(event, delta, deltaX, deltaY) {
        //zoomin&out
        var scale = 1;
        if(delta < 0)
            scale *= 1.2;
        else if(delta > 0)
            scale *= 0.8;
        refreshPainter(0, 0, scale, paper.view.viewSize.width/2, paper.view.viewSize.height/2);
        var screencoor = new ScreenCoor();
        screencoor.screenx = paper.view.viewSize.width/2 - transform.mwscreen/(scale * 2);
        screencoor.screeny = paper.view.viewSize.height/2 + transform.mhscreen/(scale * 2);
        var resmap = transform.ScreenToMap(screencoor);
        transform.mxstart = resmap.mapx;
        transform.mystart = resmap.mapy;
        transform.mscale /= scale;

        gTransform = transform;

        return false;
    });
}
})(window.mapIndex = window.mapIndex || {});


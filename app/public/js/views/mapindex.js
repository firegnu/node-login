/**
 * Created by Administrator on 2014/4/24.
 */

//(function(mapindex) {
    mapindex.currentMapIndexNum = '';

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
        mapcoor.mapx = this.mxstart + screencoor.screenx * this.mscale;
        mapcoor.mapy = this.mystart + this.mscale * (this.mhscreen - screencoor.screeny);
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
            rowcol.row = Math.floor(latitude/Math.abs(ydetal));
        else
            rowcol.row = Math.floor(latitude/Math.abs(ydetal)) + 1;
        if(longitude % xdetal == 0)
            rowcol.collum = Math.floor(longitude/xdetal);
        else
            rowcol.collum = Math.floor(longitude/xdetal) + 1;
        return rowcol;
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
        if(mapcoor.mapx>=0)
            longitude = 180 + mapcoor.mapx;
        else
            latitude = -mapcoor.mapy;
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

        var blscreen = transform.MapToScreen(blcoor);
        var urscreen = transform.MapToScreen(urcoor);

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
        mapbound.remove();
        if(inter.length != 0)
            isintersec = true;
        if(!isintersec && (pathpolygon.isPointInPolygon(blpoint) || pathpolygon.isPointInPolygon(ulpoint) || pathpolygon.isPointInPolygon(urpoint) || pathpolygon.isPointInPolygon(brpoint)))
            isintersec = true;
        return isintersec;
    }

    function CreatePolygon(points,transform)
    {
        var mapcoor = new MapCoor();
        if(points[0].mapx < 0)
            mapcoor.mapx = -points[0].mapx;
        else
            mapcoor.mapx = 180 + points[0].mapx;
        mapcoor.mapy = points[0].mapy;
        var startcreen = transform.MapToScreen(mapcoor);
        var startpoint =  new paper.Point(startcreen.screenx,startcreen.screeny);
        var polygon = new paper.Path();
        for(var i = 0; i < points.length; i ++)
        {
            var tempmapcoor = new MapCoor();
            if(points[i].mapx < 0)
                tempmapcoor.mapx = -points[i].mapx;
            else
                tempmapcoor.mapx = 180 + points[i].mapx;
            tempmapcoor.mapy = points[i].mapy;
            var scereen = transform.MapToScreen(tempmapcoor);
            var point = new paper.Point(scereen.screenx,scereen.screeny);
            polygon.add(point);
        }
        polygon.add(startpoint);
        polygon.closed;
        polygon.style = {
            strokeColor: 'green',
            strokeWidth: 1
        };
        return polygon;
    }

    function SelectMapsByPolygon(transform,maptype,mapscale)
    {
        var resmaparray = [];
        var points = [];
        var point1,point2,point3;
        /*point1 = new MapCoor();
         point1.mapx = 2;
         point1.mapy = 3;
         point2 = new MapCoor();
         point2.mapx = 82;
         point2.mapy = -83;
         point3 = new MapCoor();
         point3.mapx = 20;
         point3.mapy = 18;
         point4 = new MapCoor();
         point4.mapx = 40;
         point4.mapy = 86;
         points.push(point1);
         points.push(point2);
         points.push(point3);
         points.push(point4);*/

        point1 = new MapCoor();
        point1.mapx = 1;
        point1.mapy = -82;
        point2 = new MapCoor();
        point2.mapx = 81;
        point2.mapy = 3;
        point3 = new MapCoor();
        point3.mapx = 81;
        point3.mapy = 87;
        points.push(point1);
        points.push(point2);
        points.push(point3);


        var lbmap = GetLBmapFromPointarray(points,maptype);
        var rtmap = GetRTmapFromPointarray(points,maptype);
        var hundmaparray = GetMapsBetweenTwoIntervel(lbmap.rowcol,lbmap.nsflag,rtmap.rowcol,rtmap.nsflag,maptype);

        var maparray = GetMapArrayByScaleflag(hundmaparray,mapscale);

        var polygon = CreatePolygon(points,transform);
        for(var m = 0; m < maparray.length; m ++)
        {
            var isintersect = IsMapInPolygon(maparray[m],polygon,transform);
            if(isintersect)
            {
                var lbmapcoor = maparray[m].blmapcoor;
                var rtmapcoor = maparray[m].urmapcoor;

                var lbscreencoor = transform.MapToScreen(lbmapcoor);
                var rtscreencoor = transform.MapToScreen(rtmapcoor);

                var mapwidth = rtscreencoor.screenx - lbscreencoor.screenx;
                var mapheight = lbscreencoor.screeny - rtscreencoor.screeny;
                path = new paper.Path.Rectangle(lbscreencoor.screenx,rtscreencoor.screeny,mapwidth,mapheight);
                path.style = {
                    fillColor: 'blue',
                    strokeColor: 'green',
                    strokeWidth: 1
                };
                resmaparray.push(maparray[m]);
            }
        }
        var polygondis = CreatePolygon(points,transform);
        return resmaparray;
    }

    //mapindex.ScreenToMap = CoorTransform.prototype.ScreenToMap;
    var mapIndexTransform = {};
    function DrawAllMaps(scaleNum)
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

        var minonemap = CaculateBoundByRowCol(lbrowcol,'K','S');
        var maxonemap = CaculateBoundByRowCol(rtrowcol,'K','N');

        paper.project.currentStyle = {
            fillColor: 'white',
            strokeColor: 'black'
        };
        if(minonemap.nsflag == 'N')
        {
            transform.mystart = minonemap.blmapcoor.mapy;
            transform.mxstart = minonemap.blmapcoor.mapx;
        }
        if(minonemap.nsflag == 'S')
        {
            transform.mystart = minonemap.urmapcoor.mapy;
            transform.mxstart = minonemap.blmapcoor.mapx;
        }
        var wscale = (maxonemap.urmapcoor.mapx - transform.mxstart)/transform.mwscreen;
        var hscale = (maxonemap.urmapcoor.mapy - transform.mystart)/transform.mhscreen;
        if(wscale > hscale)
            transform.mscale = wscale;
        else
            transform.mscale = hscale;

        var maparray = GetMapsBetweenTwoIntervel(lbrowcol,'S',rtrowcol,'N','K');
        var mapIndexGroup = new paper.Group();
        var mapIndexTextGroup = new paper.Group();
        //alert( '共'+maparray.length.toString()+'幅');
        for(var i = 0; i < maparray.length; i ++)
        {
            var lbmapcoor = maparray[i].blmapcoor;
            var rtmapcoor = maparray[i].urmapcoor;

            var lbscreencoor = transform.MapToScreen(lbmapcoor);
            var rtscreencoor = transform.MapToScreen(rtmapcoor);

            var mapwidth = rtscreencoor.screenx - lbscreencoor.screenx;
            var mapheight = lbscreencoor.screeny - rtscreencoor.screeny;
            path = new paper.Path.Rectangle(lbscreencoor.screenx,rtscreencoor.screeny,mapwidth,mapheight);
            //path.opacity = 0.4;
            path.style = {
                strokeColor: 'black',
                strokeWidth: 1
            };
            mapIndexGroup.addChild(path);

            var text = new paper.PointText(new paper.Point(lbscreencoor.screenx + mapwidth/2, rtscreencoor.screeny + mapheight/2));
            text.justification = 'center';
            text.fillColor = 'black';
            text.content = maparray[i].mapindex;
            text.characterStyle = {
                fontFamily: 'microsoft yahei',
                fontSize: 3,
                fillColor: 'black'
            };
            text.data = {
                type: 'cqtext'
            };
            mapIndexTextGroup.addChild(text);
        }
        var mapIndexLayer = new paper.Layer([mapIndexGroup]);
        var mapIndexNumLayer = new paper.Layer([mapIndexTextGroup]);
        //at first do not show mapnum
        mapIndexNumLayer.children[0].visible = false;
        mapIndexLayer.name = 'mapIndex';
        mapIndexNumLayer.name = 'mapIndexNum';
        mapIndexTransform = transform;
    }

//})(window.mapindex = window.mapindex || {});

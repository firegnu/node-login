/**
 * Created by Administrator on 2014/4/24.
 */

(function(mapindex) {
    mapindex.currentMapIndexNum = '';

    CoorTransform = function()
    {
        this.mscale = 1.0;
        this.mxstart = 0.0;
        this.mystart = 0.0;
        this.mhscreen = 0;
        this.mwscreen = 0;
    };

    MapCoor = function()
    {
        this.mapx;
        this.mapy;
    };
    ScreenCoor = function()
    {
        this.screenx;
        this.screeny;
    };

    CoorTransform.prototype.MapToScreen = function(mapcoor)
    {
        var screencoor = new ScreenCoor();
        screencoor.screenx = Math.floor((mapcoor.mapx - this.mxstart)/this.mscale);
        screencoor.screeny = Math.floor(this.mhscreen - (mapcoor.mapy - this.mystart)/this.mscale);
        return screencoor;
    };

    CoorTransform.prototype.ScreenToMap = function(screencoor)
    {
        var mapcoor = new MapCoor();
        mapcoor.mapx = this.mxstart + screencoor * this.mscale;
        mapcoor.mapy = this.mystart + this.mscale * (this.mhscreen - screencoor.screeny);
        return mapcoor;
    };

    RowCollum = function()
    {
        this.row = 0;
        this.collum = 0;
    };

    OneMap = function()
    {
        this.blmapcoor = new MapCoor();
        this.urmapcoor = new MapCoor();
        this.rowcol = new RowCollum();
        this.nsflag = null;
        this.mapindex = null;
    };

    XYdetal = function()
    {
        this.xdetal = 0;
        this.ydetal = 0;
    };

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
    };

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
    };

    function GetNSflag(mapcoor)
    {
        var nsflag = 'N';
        if(mapcoor.mapy < 0)
            nsflag = 'S';
        return nsflag;
    };

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
    };

    function CalculateByDetal(xdetal,ydetal,latitude,longitude)
    {
        var rowcol = new RowCollum();
        rowcol.row = Math.floor(latitude/ydetal) + 1;
        rowcol.collum = Math.floor(longitude/xdetal) + 1;
        return rowcol;
    };

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
    };

    function CalculateOneMapindex(mapcoor,maptype)
    {
        var latitude,longitude;
        var nsflag;
        if(mapcoor.mapx>=0)
            longitude = mapcoor.mapx;
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
        hundredrowcol = CalculateByDetal(curdetal.ydetal,curdetal.xdetal,latitude,longitude);
        onemap = CaculateBoundByRowCol(hundredrowcol,maptype,nsflag);

        return onemap;
    };

    function GetSRBMap(lbrowcol,rtrowcol,maptype,nsflag)
    {
        var srbmap = new OneMap();
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
                sbcol = Math.floor(rtrowcol.collum/1.5);
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
        srbmap.rowcol.row = lbrowcol.row;
        srbmap.rowcol.collum = sbcol;
        srbmap = CaculateBoundByRowCol(srbmap.rowcol,maptype,nsflag);
        return srbmap;
    };

    function GetMapsBetween(lbrowcol,rtrowcol,nsflag,maptype)
    {
        var maparray = [];
        var maxcol = 0;
        var oldcolum = new RowCollum();

        if(maptype=='K')
        {
            if(rtrowcol.row <= 12)
                maxcol = rtrowcol.collum;
            if(rtrowcol.row > 12 && rtrowcol.row <= 15)
            {
                if(rtrowcol.collum % 2 == 0)
                    maxcol = Math.floor(rtrowcol.collum * 1.5);
                else
                    maxcol = Math.floor(rtrowcol.collum * 1.5) + 1;
            }
            if(rtrowcol.row > 15 && rtrowcol.row <= 17)
                maxcol = rtrowcol.collum * 2;
            if(rtrowcol.row > 17 && rtrowcol.row <= 19)
            {
                if(rtrowcol.collum % 2 == 0)
                    maxcol = Math.floor(rtrowcol.collum * 2.5);
                else
                    maxcol = Math.floor(rtrowcol.collum * 2.5) + 1;
            }
            if(rtrowcol.row > 19 && rtrowcol.row <= 22)
                maxcol = rtrowcol.collum * 4;
        }
        if(maptype=='D')
        {
            if(rtrowcol.row <= 15)
                maxcol = rtrowcol.collum;
            if(rtrowcol.row > 15 && rtrowcol.row <= 19)
                maxcol = rtrowcol.collum * 2;
            if(rtrowcol.row > 19 && rtrowcol.row <= 22)
                maxcol = rtrowcol.collum * 4;
        }

        for(var i = lbrowcol.row;i <= rtrowcol.row;i ++)
        {
            for(var j = lbrowcol.collum;j <= maxcol;j ++)
            {
                var curmap = new OneMap();
                var currowcol = new RowCollum();
                currowcol.row = i;
                if(maptype=='K')
                {
                    if( i <= 12)
                    {
                        currowcol.collum = j;
                    }
                    if( i<= 15 && i > 12)
                    {
                        currowcol.collum = Math.floor(j/1.5);
                    }
                    if( i<= 17 && i > 15)
                    {
                        currowcol.collum = Math.floor(j/2);
                    }
                    if( i<= 19 && i > 17)
                    {
                        currowcol.collum = Math.floor(j/2.5);
                    }
                    if( i<= 22 && i > 19)
                    {
                        currowcol.collum = Math.floor(j/4);
                    }
                }
                if(maptype=='D')
                {
                    if(i <= 15)
                    {
                        currowcol.collum = j;
                    }
                    if(i <= 19 && i > 15)
                    {
                        currowcol.collum = Math.floor(j/2) + 1;
                    }
                    if(i <= 22 && i > 19)
                    {
                        currowcol.collum = Math.floor(j/4) + 1;
                    }
                }
                if(!(oldcolum.row ==  currowcol.row && oldcolum.collum ==  currowcol.collum )&& currowcol.collum != 0)
                {
                    curmap = CaculateBoundByRowCol(currowcol,maptype,nsflag);
                    maparray.push(curmap);
                    oldcolum = currowcol;
                }
            }
        }
        return maparray;
    };

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
            if(rtrowcol.row <= 15)
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
    };

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
    };

    mapindex.DrawAllMaps = function(scaleNum)
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
    }

})(window.mapindex = window.mapindex || {});

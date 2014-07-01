/**
 * Created by Administrator on 2014/4/24.
 */
(function ($, window) {

    $.fn.contextMenu = function (settings) {

        return this.each(function () {

            // Open context menu
            $(this).on("contextmenu", function (e) {
                $(settings.menuSelector)
                    .data("invokedOn", $(e.target))
                    .show()
                    .css({
                        position: "absolute",
                        left: getLeftLocation(e),
                        top: getTopLocation(e)
                    });

                return false;
            });

            // click handler for context menu
            $(settings.menuSelector).click(function (e) {
                $(this).hide();

                var $invokedOn = $(this).data("invokedOn");
                var $selectedMenu = $(e.target);

                settings.menuSelected.call($(this), $invokedOn, $selectedMenu);

            });

            //make sure menu closes on any click
            $(document).click(function () {
                $(settings.menuSelector).hide();
            });
        });

        function getLeftLocation(e) {
            var mouseWidth = e.pageX;
            var pageWidth = $(window).width();
            var menuWidth = $(settings.menuSelector).width();

            // opening menu would pass the side of the page
            if (mouseWidth + menuWidth > pageWidth &&
                menuWidth < mouseWidth) {
                return mouseWidth - menuWidth;
            }
            return mouseWidth;
        }

        function getTopLocation(e) {
            var mouseHeight = e.pageY;
            var pageHeight = $(window).height();
            var menuHeight = $(settings.menuSelector).height();

            // opening menu would pass the bottom of the page
            if (mouseHeight + menuHeight > pageHeight &&
                menuHeight < mouseHeight) {
                return mouseHeight - menuHeight;
            }
            return mouseHeight;
        }
    };
})(jQuery, window);


$("#mapcanvas").contextMenu({
    menuSelector: "#contextMenu",
    menuSelected: function (invokedOn, selectedMenu) {
        if(selectedMenu.text() === '点击单选') {
            mapIndex.functionIndex = 'oneclickdownload';
            mapIndex.clearSelected();
        }
        else if(selectedMenu.text() === '点击多选') {
            mapIndex.functionIndex = 'oneclickmultidownload';
            mapIndex.clearSelected();
        }
        else if(selectedMenu.text() === '拉框选取') {
            mapIndex.functionIndex = 'oneclickrubberdownload';
            mapIndex.clearSelected();
        }
        else if(selectedMenu.text() === '多边形选取') {
            mapIndex.functionIndex = 'oneclickpolygondownload';
            mapIndex.clearSelected();
        }
        else if(selectedMenu.text() === '上传文件选取') {
            mapIndex.functionIndex = 'oneclickfiledownload';
            mapIndex.clearSelected();
        }
        else if(selectedMenu.text() === '重置工具') {
            mapIndex.functionIndex = 'null';
            mapIndex.clearSelected();
        }
        else if(selectedMenu.text() === '下载所选') {
            mapIndex.functionIndex = 'downloadSelected';
            mapIndex.downloadSelected();
        }
    }
});
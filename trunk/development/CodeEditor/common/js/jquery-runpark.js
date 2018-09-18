(function($){
    var local = window.location;
    var url = local.origin;
    var homeURI = url + local.pathname.replace(new RegExp("(?:\\\/+[^\\\/]*){0," + ((0 || 0) + 1) + "}$"), "/");
    var parkURI = homeURI + 'park.cgi';
    var json2dl = function(json){
        var dl = $('<dl/>');
        $.each(Object.keys(json).sort(), function(i, k){
            $('<dt/>').text(k).appendTo(dl);
            var dd = $('<dd/>');
            if (k == 'path') {
                var a = $('<a/>');
                a.text(json[k]);
                a.attr('href', homeURI + json[k]);
                a.appendTo(dd);
            } else {
                dd.text(json[k]);
                if (k.match(/^(?:std(?:err|out)|droppings)$/))
                    dd.css({fontFamily:'monospace',whiteSpace:'pre'});
            }
            dd.appendTo(dl);
        });
        return dl;
    };
    $.fn.runPark = function(dst, hook) {
        var json2html = hook || json2dl;
        var query = {s:(this.val() || this.text())};
        $.post(parkURI, query, function(json){
            $(dst).html(json2html(json));
        }, 'json');
    };
    $.fn.rerunPark = function(path, hook){
        var json2html = hook || json2dl;
        var that = this;
        $.get(parkURI + path, null, function(json){
            that.html(json2html(json));
        }, 'json');
    };
})(jQuery);
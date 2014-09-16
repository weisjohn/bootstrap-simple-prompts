(function() {

    // ensure depenencies
    if (!$.fn.modal.Constructor) return;

    // gross helper function to generate markup in a quick way
    function generate(text, title, confirm, warning) {
        var markup = '\
<div class="modal fade" id="bootstrap-simple-prompt"> \
    <div class="modal-dialog"> \
        <div class="modal-content"> \
'
        if (title) {
            markup += '\
            <div class="modal-header"> \
                <button type="button" class="close leave cancel" data-dismiss="modal" aria-hidden="true">&times;</button> \
                <h4 class="modal-title">' + (title) + '</h4> \
            </div> \
            '
        }

        markup += '\
            <div class="modal-body"> \
                <p>' + (text || "") + '</p> \
            </div> \
            <div class="modal-footer">'
                
        
        if (typeof warning === "undefined" || warning == false) {
            if (confirm) markup += '<button type="button" class="btn btn-default leave cancel">Cancel</button>';
            markup += '<button type="button" class="btn btn-primary leave ok" data-dismiss="modal">Ok</button>'
        } else {
            if (confirm) markup += '<button type="button" class="btn btn-primary leave cancel">Cancel</button>';
            markup += '<button type="button" class="btn btn-danger leave ok" data-dismiss="modal">Ok</button>'
        }
        markup += '\
            </div> \
        </div> \
    </div> \
</div> \
';
        return markup;
    }

    // override a function on window
    function override(method, fn) {
        if (!window[method] || typeof window[method] !== "function") {
            console.error("window." + method + " is undefined");
            return;
        } 
        if (typeof fn !== "function") {
            console.error("fn must be a function");
            return;
        }
        var original = window[method];
        fn.original = function() {
            var newarr = [].slice.call(arguments);
            var ret = original.apply(window, newarr);
            if (ret !== undefined && newarr.length > 1) {
                var cb = newarr[newarr.length - 1];
                if (typeof cb === "function") cb(ret);
            }
            return ret;
        }
        window[method] = fn;
    }

    
    function spawn(msg, title, confirm, cb, warning) {
        $("#bootstrap-simple-prompt").remove();
        var $modal = $(generate(msg, title, confirm, warning));
        $('body').append($modal);
        $modal.modal({ show : true });
        if (confirm) {
            $("#bootstrap-simple-prompt .leave").click(function(e) {
                $modal.modal('hide');
                var result = $(this).is('.close, .cancel') ? false : true;
                if (typeof cb === "function") cb(result);
            });
        }
    }

    override('alert', function(msg, title) { spawn(msg, title); });
    override('confirm', function(msg, title, warning, cb) { 
        if (typeof title === "function") cb = title, title = null, warning = false;
        if (typeof warning === "function") cb = warning, warning = false;
        spawn(msg, title, true, cb, warning);
    });

})();
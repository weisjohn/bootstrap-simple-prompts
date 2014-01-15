(function() {

    // ensure depenencies
    if (!$.fn.modal.Constructor) return;

    // gross helper function to generate markup in a quick way
    function generate(text, title, confirm) {
        var markup = '\
<div class="modal fade" id="bootstrap-prompts-modal"> \
    <div class="modal-dialog"> \
        <div class="modal-content"> \
'
        if (title) {
            markup += '\
            <div class="modal-header"> \
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> \
                <h4 class="modal-title">' + (title) + '</h4> \
            </div> \
            '
        }

        markup += '\
            <div class="modal-body"> \
                <p>' + (text || "") + '</p> \
            </div> \
            <div class="modal-footer">'
                
        if (confirm) markup += '<button type="button" class="btn btn-default">Cancel</button>';
        markup += '\
                <button type="button" class="btn btn-primary" data-dismiss="modal">Ok</button>\
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

    
    function spawn(msg, title, confirm, cb) {
        $("#bootstrap-prompts-modal").remove();
        var $modal = $(generate(msg, title, confirm));
        $('body').append($modal);
        $modal.modal({ show : true });
        // TODO: deal with confirm buttons
    }

    override('alert', function(msg, title) { spawn(msg, title); });
    override('confirm', function(msg, title, cb) { 
        if (typeof title === "function") cb = title, title = null;
        spawn(msg, title, true, cb);
    });

})();
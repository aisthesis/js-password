var _c = _c || {};

(function(_c) {
    "use strict";
    _c.RadioGroupView = Backbone.View.extend({
        initialize: function(options) {
            _.bindAll(this,
                'setConstants',
                'getValue'
            );

            this.setConstants(options);
        },

        setConstants: function(options) {
            this.GROUP_NAME = options.groupName;
        },

        getValue: function() {
            return this.$el.find('input[name=' + this.GROUP_NAME + ']:checked').val();
        }
    });
})(_c);

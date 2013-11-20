var codeMelon = codeMelon || {};

(function(_c) {
    "use strict";
    _c.AppView = Backbone.View.extend({
        events: {
            'click #create-btn': 'generatePassword',
            'keyup #length': 'handleLengthChange'
        },

        initialize: function(options) {
            _.bindAll(this,
                'setConstants',
                'initMembers',
                'generatePassword',
                'setAllowed',
                'setRequired',
                'getAllowed',
                'getRequired',
                'getLength',
                'getRandomCharacter',
                'handleLengthChange'
            );
            this.setConstants(options);
            this.initMembers(options);
        },

        setConstants: function(options) {
            this.RADIO_GROUPS = {
                'lowercase': 'abcdefghijklmnopqrstuvwxyz',
                'uppercase': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                'digits': '0123456789',
                'special': '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'
            };
            this.LENGTH_SELECTOR = '#length';
            this.PASSWORD_SELECTOR = '#password';
            this.OTHER_ALLOWED_SELECTOR = '#other-allowed';
            this.OTHER_REQUIRED_SELECTOR = '#other-required';
        },

        initMembers: function(options) {
            var key;

            this.radioGroupViews = {};
            for(key in this.RADIO_GROUPS) {
                this.radioGroupViews[key] = new _c.RadioGroupView({
                    el: '#' + key,
                    groupName: key
                });
            }
        },

        generatePassword: function() {
            var len = this.getLength(),
                pwdArr = [],
                i;

            for (i = 0; i < len; i++) {
                pwdArr.push('');
            }
            this.setRequired(pwdArr);
            this.setAllowed(pwdArr);
            $(this.PASSWORD_SELECTOR).text(pwdArr.join(''));
        },

        setAllowed: function(pwdArr) {
            var allowed = this.getAllowed(),
                i;

            for (i = 0; i < pwdArr.length; i++) {
                if (pwdArr[i].length === 0) {
                    pwdArr[i] = this.getRandomCharacter(allowed);
                }
            }
        },

        setRequired: function(pwdArr) {
            var required = this.getRequired(),
                indices = [],
                indicesForRequired,
                i;

            for (i = 0; i < pwdArr.length; i++) {
                indices.push(i);
            }
            indicesForRequired = _c.utils.randomlyChoose(indices, required.length);
            for (i = 0; i < required.length; i++) {
                pwdArr[indicesForRequired[i]] = this.getRandomCharacter(required[i]);
            }
        },

        getRandomCharacter: function(word) {
            var i = Math.floor(Math.random() * word.length);

            return word[i];
        },

        getAllowed: function() {
            var ret = '',
                key,
                value;

            for (key in this.RADIO_GROUPS) {
                value = this.radioGroupViews[key].getValue();
                if (value === 'required' || value === 'allowed') {
                    ret += this.RADIO_GROUPS[key];
                }
            }
            ret += $(this.OTHER_ALLOWED_SELECTOR).val();
            ret += $(this.OTHER_REQUIRED_SELECTOR).val();
            // remove possible whitespace and duplicates
            return _c.utils.uniq(ret.replace(/\s/g, '')).join('');
        },

        getRequired: function() {
            var ret = [],
                otherRequired,
                key,
                value,
                i;

            for (key in this.RADIO_GROUPS) {
                value = this.radioGroupViews[key].getValue();
                if (value === 'required') {
                    ret.push(this.RADIO_GROUPS[key]);
                }
            }
            otherRequired = $(this.OTHER_REQUIRED_SELECTOR).val().match(/\S+/g);
            if (otherRequired !== null && otherRequired.length > 0) {
                for (i = 0; i < otherRequired.length; i++) {
                    otherRequired[i] = _c.utils.uniq(otherRequired[i]).join('');
                }
                Array.prototype.push.apply(ret, otherRequired);
            }
            return _c.utils.uniq(ret);
        },

        getLength: function() {
            var ret = parseInt($(this.LENGTH_SELECTOR).val());

            if (ret < 8) { ret = 8; }
            if (ret > 32) { ret = 32; }
            return ret; 
        },

        handleLengthChange: function(event) {
            var _this = this,
                val = parseInt($(this.LENGTH_SELECTOR).val());

            setTimeout(function() {
                if (val < 8) {
                    $(_this.LENGTH_SELECTOR).val(8);
                }
                else if (val > 32) {
                    $(_this.LENGTH_SELECTOR).val(32);
                }
            }, 800);
        }
    });
})(codeMelon);

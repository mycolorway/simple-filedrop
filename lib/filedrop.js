(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define('simple-filedrop', ["jquery",
      "simple-module"], function ($, SimpleModule) {
      return (root.returnExportsGlobal = factory($, SimpleModule));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"),
      require("simple-module"));
  } else {
    root.simple = root.simple || {};
    root.simple['filedrop'] = factory(jQuery,
      SimpleModule);
  }
}(this, function ($, SimpleModule) {

var Filedrop, filedrop,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Filedrop = (function(_super) {
  __extends(Filedrop, _super);

  function Filedrop() {
    return Filedrop.__super__.constructor.apply(this, arguments);
  }

  Filedrop.count = 0;

  Filedrop.prototype._entered = 0;

  Filedrop.prototype._dropzoneTpl = "<div class=\"simple-filedrop\">\n  <div class=\"filedrop-dropzone\">\n    <div class=\"filedrop-hints\"></div>\n  </div>\n</div>";

  Filedrop.prototype.opts = {
    el: null,
    types: null,
    hints: "Drop file here"
  };

  Filedrop.prototype.disabled = false;

  Filedrop.prototype._init = function() {
    this.el = $(this.opts.el);
    if (this.el.length === 0) {
      throw new Error('simple-filedrop: el option is invalid');
    }
    this.id = ++this.constructor.count;
    this.el.data('filedrop', this);
    this.dropzone = $(this._dropzoneTpl).find('.filedrop-hints').html(this.opts.hints).end().hide().data('filedrop', this).appendTo(document.body);
    $(document).on("dragover.filedrop-" + this.id, (function(_this) {
      return function(e) {
        e.originalEvent.dataTransfer.dropEffect = "none";
        if (_this.dropzone.hasClass('hover')) {
          _this.dropzone.removeClass('hover');
        }
        return false;
      };
    })(this)).on("drop.filedrop-" + this.id, function(e) {
      return e.preventDefault();
    }).on("dragenter.filedrop-" + this.id, (function(_this) {
      return function(e) {
        if (_this.disabled) {
          return;
        }
        if ((_this._entered += 1) === 1) {
          _this.showDropzone();
          return _this.trigger("dropzoneshow");
        }
      };
    })(this)).on("dragleave.filedrop-" + this.id, (function(_this) {
      return function(e) {
        if (_this.disabled) {
          return;
        }
        if ((_this._entered -= 1) <= 0) {
          _this.hideDropzone();
          return _this.trigger("dropzonehide");
        }
      };
    })(this));
    return this.dropzone.on("dragover", (function(_this) {
      return function(e) {
        var efct;
        try {
          efct = e.originalEvent.dataTransfer.effectAllowed;
        } catch (_error) {}
        e.originalEvent.dataTransfer.dropEffect = 'move' === efct || 'linkMove' === efct ? 'move' : 'copy';
        if (!_this.dropzone.hasClass('hover')) {
          _this.dropzone.addClass("hover");
        }
        return false;
      };
    })(this)).on("drop", (function(_this) {
      return function(e) {
        var file, files, _i, _len, _ref;
        if (_this.disabled) {
          return;
        }
        files = [];
        _ref = e.originalEvent.dataTransfer.files;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          if (_this.opts.types && $.isArray(_this.opts.types) && _this.opts.types.indexOf(file.type) < 0) {
            _this.trigger("dropfail", [file, "Wrong types!"]);
            _this.hideDropzone();
            return false;
          }
          files.push(file);
        }
        _this.trigger("drop", [files]);
        _this.constructor.hideAllDropzone();
        return false;
      };
    })(this));
  };

  Filedrop.prototype.showDropzone = function() {
    var elOffset;
    if (!this.el.is(':visible')) {
      return;
    }
    return this.dropzone.removeClass('hover').show().css({
      zIndex: 9,
      position: 'absolute',
      top: (elOffset = this.el.offset()).top,
      left: elOffset.left,
      width: this.el.outerWidth(),
      height: this.el.outerHeight(),
      opacity: 0.8
    });
  };

  Filedrop.prototype.hideDropzone = function() {
    this.dropzone.hide();
    return this._entered = 0;
  };

  Filedrop.hideAllDropzone = function() {
    return $('.simple-filedrop').each(function() {
      var filedrop;
      filedrop = $(this).data('filedrop');
      if (filedrop) {
        return filedrop.hideDropzone();
      }
    });
  };

  Filedrop.prototype.disable = function() {
    this.disabled = true;
    return this.trigger("disabled");
  };

  Filedrop.prototype.enable = function() {
    this.disabled = false;
    return this.trigger("enabled");
  };

  Filedrop.prototype.destroy = function() {
    this.el.removeData('filedrop');
    $(document).off(".filedrop-" + this.id);
    return this.dropzone.remove();
  };

  return Filedrop;

})(SimpleModule);

filedrop = function(opts) {
  return new Filedrop(opts);
};


return filedrop;


}));


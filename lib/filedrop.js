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

  Filedrop.prototype._entered = 0;

  Filedrop.prototype._dropzoneTpl = "<div class=\"simple-filedrop\">\n  <div class=\"filedrop-dropzone\">\n    <div class=\"filedrop-hints\"></div>\n  </div>\n</div>";

  Filedrop.prototype.opts = {
    el: null,
    types: [],
    hints: null
  };

  Filedrop.prototype._init = function() {
    this.el = $(this.opts.el);
    this.el.data('filedrop', this);
    $(document).on("dragover.filedrop", function(e) {
      e.originalEvent.dataTransfer.dropEffect = "none";
      return e.preventDefault();
    }).on('drop.filedrop', function(e) {
      return e.preventDefault();
    });
    this.dropzone = $(this._dropzoneTpl);
    if (this.opts.hints) {
      this.dropzone.find('.filedrop-hints').html(this.opts.hints);
    } else {
      this.dropzone.find('.filedrop-dropzone').removeClass('filedrop-dropzone');
    }
    this.dropzone.hide().appendTo(document.body);
    this.el.on("dragenter.filedrop", (function(_this) {
      return function() {
        return _this.showDropzone();
      };
    })(this));
    return this.dropzone.on("dragover", (function(_this) {
      return function(e) {
        var efct;
        try {
          efct = e.originalEvent.dataTransfer.effectAllowed;
        } catch (_error) {}
        e.originalEvent.dataTransfer.dropEffect = 'move' === efct || 'linkMove' === efct ? 'move' : 'copy';
        return _this._stopEvent(e);
      };
    })(this)).on("dragenter", (function(_this) {
      return function(e) {
        _this._stopEvent(e);
        if ((_this._entered += 1) === 1) {
          return _this.trigger("fileDragenter", e);
        }
      };
    })(this)).on("dragleave", (function(_this) {
      return function(e) {
        _this._stopEvent(e);
        if ((_this._entered -= 1) <= 0) {
          _this.trigger("fileDragleave", e);
          return _this.hideDropzone();
        }
      };
    })(this)).on("drop", (function(_this) {
      return function(e) {
        var file, files, _i, _len, _ref;
        _this._stopEvent(e);
        files = [];
        _ref = e.originalEvent.dataTransfer.files;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          if (!_this._validFile(file)) {
            _this.trigger("fileDropfails", [file, "Wrong types!"]);
            _this.hideDropzone();
            return false;
          }
          files.push(file);
        }
        _this.trigger("fileDrop", [files, e]);
        return _this.hideDropzone();
      };
    })(this));
  };

  Filedrop.prototype.showDropzone = function() {
    var elOffset;
    return this.dropzone.css({
      zIndex: 9,
      position: 'absolute',
      top: (elOffset = this.el.offset()).top,
      left: elOffset.left,
      width: this.el.innerWidth(),
      height: this.el.innerHeight(),
      opacity: 0.8
    }).show();
  };

  Filedrop.prototype.hideDropzone = function() {
    this.dropzone.hide();
    return this._entered = 0;
  };

  Filedrop.prototype.destroy = function() {
    this.el.off('.filedrop').removeData('filedrop');
    $(document).off('.filedrop');
    return this.dropzone.remove();
  };

  Filedrop.prototype._validFile = function(file) {
    return this.opts.types.indexOf(file.type) > -1;
  };

  Filedrop.prototype._stopEvent = function(e) {
    e.preventDefault();
    e.stopPropagation();
    return e;
  };

  return Filedrop;

})(SimpleModule);

filedrop = function(opts) {
  return new Filedrop(opts);
};


return filedrop;


}));

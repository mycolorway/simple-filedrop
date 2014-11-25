(function() {
  describe('Simple filedrop', function() {
    var filedrop;
    filedrop = null;
    $('<div id="filedrop" style="height: 100px; width: 100px;"></div>').appendTo('body');
    beforeEach(function() {
      return filedrop = simple.filedrop({
        el: '#filedrop',
        types: ['image/png']
      });
    });
    afterEach(function() {
      return filedrop.destroy();
    });
    it('should inherit from SimpleModule', function() {
      return expect(filedrop instanceof SimpleModule).toBe(true);
    });
    describe('could be destroyed', function() {
      it('remove filedrop data of el', function() {
        expect(filedrop.el.data('filedrop')).toBe(filedrop);
        filedrop.destroy();
        return expect(filedrop.el.data('filedrop')).toBe(void 0);
      });
      it('remove .filedrop events which had been binded with document', function() {
        var callback;
        $(document).on("dragenter.filedrop-" + filedrop.id, callback = jasmine.createSpy('callback')).trigger($.Event("dragenter.filedrop-" + filedrop.id));
        expect(callback).toHaveBeenCalled();
        $(document).on("dragenter.filedrop-" + filedrop.id, callback = jasmine.createSpy('callback'));
        filedrop.destroy();
        $(document).trigger($.Event("dragenter.filedrop-" + filedrop.id));
        return expect(callback).not.toHaveBeenCalled();
      });
      return it('remove the dropzone el', function() {
        expect(filedrop.dropzone.parent().length).not.toBe(0);
        filedrop.destroy();
        return expect(filedrop.dropzone.parent().length).toBe(0);
      });
    });
    describe('events', function() {
      it('fileDropShown', function() {
        var callback;
        filedrop.on('dropzoneshow', callback = jasmine.createSpy('callback'));
        $(document).trigger($.Event("dragenter.filedrop-" + filedrop.id));
        return expect(callback).toHaveBeenCalled();
      });
      it('fileDropHidden', function() {
        var callback;
        filedrop.on('dropzonehide', callback = jasmine.createSpy('callback'));
        $(document).trigger($.Event("dragleave.filedrop-" + filedrop.id));
        return expect(callback).toHaveBeenCalled();
      });
      return it('fileDrop', function() {
        var callback;
        filedrop.on('drop', callback = jasmine.createSpy('callback'));
        filedrop.dropzone.trigger($.Event('drop', {
          originalEvent: {
            dataTransfer: {
              files: []
            }
          }
        }));
        return expect(callback).toHaveBeenCalled();
      });
    });
    return describe('options', function() {
      it('accpet png', function() {
        var callback, data;
        callback = jasmine.createSpy('callback');
        filedrop.on('fileDropfail', callback);
        data = {
          originalEvent: {
            dataTransfer: {
              files: [
                {
                  name: "An png image",
                  type: "image/png"
                }
              ]
            }
          }
        };
        filedrop.dropzone.trigger($.Event('drop', data));
        return expect(callback).not.toHaveBeenCalled();
      });
      return it("don't accpet jpeg", function() {
        var callback, data;
        callback = jasmine.createSpy('callback');
        filedrop.on('dropfail', callback);
        data = {
          originalEvent: {
            dataTransfer: {
              files: [
                {
                  name: "An jpg image",
                  type: "image/jpeg"
                }
              ]
            }
          }
        };
        filedrop.dropzone.trigger($.Event('drop', data));
        return expect(callback).toHaveBeenCalled();
      });
    });
  });

}).call(this);


describe 'Simple filedrop', ->
  filedrop = null
  $('<div id="filedrop" style="height: 100px; width: 100px;"></div>').appendTo 'body'

  beforeEach ->
    filedrop = simple.filedrop
      el: '#filedrop',
      types: ['image/png']

  afterEach ->
    filedrop.destroy()

  it 'should inherit from SimpleModule', ->
    expect(filedrop instanceof SimpleModule).toBe(true)

  describe 'could be destroyed', ->
    it 'remove filedrop data of el', ->
      expect filedrop.el.data 'filedrop'
        .toBe filedrop
      filedrop.destroy()
      expect filedrop.el.data 'filedrop'
        .toBe undefined

    it 'remove .filedrop events which had been binded with document', ->
      $ document
        .on 'dragenter.filedrop', callback = jasmine.createSpy 'callback'
        .trigger $.Event 'dragenter.filedrop'
      expect callback
        .toHaveBeenCalled()

      $ document
        .on 'dragenter.filedrop', callback = jasmine.createSpy 'callback'
      filedrop.destroy()
      $ document
        .trigger $.Event 'dragenter.filedrop'
      expect callback
        .not.toHaveBeenCalled()

    it 'remove the dropzone el', ->
      expect filedrop.dropzone.parent().length
        .not.toBe 0
      filedrop.destroy()
      expect filedrop.dropzone.parent().length
        .toBe 0

  describe 'events', ->
    it 'fileDropShown', ->
      filedrop.on 'dropzoneshow', callback = jasmine.createSpy 'callback'
      $ document
        .trigger $.Event 'dragenter.filedrop'
      expect callback
        .toHaveBeenCalled()

    it 'fileDropHidden', ->
      filedrop.on 'dropzonehide', callback = jasmine.createSpy 'callback'
      $ document
        .trigger $.Event 'dragleave.filedrop'
      expect callback
        .toHaveBeenCalled()

    it 'fileDrop', -> 
      filedrop.on 'drop', callback = jasmine.createSpy 'callback'
      filedrop.dropzone
        .trigger $.Event 'drop', originalEvent: dataTransfer: files: []
      expect callback
        .toHaveBeenCalled()

  describe 'options', ->
    it 'accpet png', -> 
      callback = jasmine.createSpy 'callback'
      filedrop.on 'fileDropfail', callback
      data = originalEvent: dataTransfer: files: [{name: "An png image", type: "image/png"}]
      filedrop.dropzone.trigger $.Event 'drop', data
      expect callback
        .not.toHaveBeenCalled()

    it "don't accpet jpeg", ->
      callback = jasmine.createSpy 'callback'
      filedrop.on 'dropfail', callback
      data = originalEvent: dataTransfer: files: [{name: "An jpg image", type: "image/jpeg"}]
      filedrop.dropzone.trigger $.Event 'drop', data
      expect callback
        .toHaveBeenCalled()

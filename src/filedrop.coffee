
class Filedrop extends SimpleModule

  _entered: 0
  _dropzoneTpl: """
    <div class="simple-filedrop">
      <div class="filedrop-dropzone">
        <div class="filedrop-hints"></div>
      </div>
    </div>
  """

  opts:
    el: null
    types: []
    hints: null

  _init: ->
    @el = $ @opts.el
    @el.data 'filedrop', @

    $ document
      .on "dragover.filedrop", (e) ->
        e.originalEvent.dataTransfer.dropEffect = "none"
        e.preventDefault()
      .on 'drop.filedrop', (e) ->
        e.preventDefault()

    @dropzone = $ @_dropzoneTpl
    if @opts.hints
      @dropzone.find '.filedrop-hints'
        .html @opts.hints
    else
      @dropzone.find '.filedrop-dropzone'
        .removeClass 'filedrop-dropzone'
    @dropzone.hide().appendTo document.body

    @el.on "dragenter.filedrop", => @showDropzone()

    @dropzone.on "dragover", (e) =>
      # From Dropzone.js
      # Makes it possible to drag files from chrome's download bar
      # http://stackoverflow.com/questions/19526430/drag-and-drop-file-uploads-from-chrome-downloads-bar
      # Try is required to prevent bug in Internet Explorer 11 (SCRIPT65535 exception)
      try efct = e.originalEvent.dataTransfer.effectAllowed
      e.originalEvent.dataTransfer.dropEffect = if 'move' == efct or 'linkMove' == efct then 'move' else 'copy' 
      @_stopEvent e
    .on "dragenter", (e) =>
      @_stopEvent e
      @trigger("fileDragenter", e) if (@_entered += 1) == 1
    .on "dragleave", (e) =>
      @_stopEvent e
      if (@_entered -= 1) <= 0
        @trigger("fileDragleave", e)
        @hideDropzone()
    .on "drop", (e) =>
      @_stopEvent e
      files = []
      for file in e.originalEvent.dataTransfer.files
        if not @_validFile file
          @trigger("fileDropfails", [file, "Wrong types!"])
          @hideDropzone()
          return false
        files.push file
      @trigger "fileDrop", [files, e]
      @hideDropzone()

  showDropzone: ->
    @dropzone
      .css
        zIndex: 9,
        position: 'absolute',
        top: (elOffset = @el.offset()).top,
        left: elOffset.left,
        width: @el.innerWidth(),
        height: @el.innerHeight(),
        opacity: 0.8
      .show()

  hideDropzone: ->
    @dropzone.hide()
    @_entered = 0

  destroy: ->
    @el.off '.filedrop'
      .removeData 'filedrop'
    $(document).off '.filedrop'
    @dropzone.remove()

  _validFile: (file) ->
    @opts.types.indexOf(file.type) > -1

  _stopEvent: (e) ->
    e.preventDefault()
    e.stopPropagation()
    e

filedrop = (opts) ->
  new Filedrop(opts)

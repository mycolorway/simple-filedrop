
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
    hints: "Drop file here"

  _init: ->
    @el = $ @opts.el
    @el.data 'filedrop', @

    @dropzone = $ @_dropzoneTpl
      .find '.filedrop-hints'
      .html @opts.hints
      .end()
      .hide()
      .appendTo document.body

    $ document
      .on "dragover.filedrop", (e) ->
        e.originalEvent.dataTransfer.dropEffect = "none"
        e.preventDefault()
      .on 'drop.filedrop', (e) ->
        e.preventDefault()
      .on 'dragenter.filedrop', (e) =>
        if (@_entered += 1) == 1
          @showDropzone() 
          @trigger("fileDropShown", e)
      .on 'dragleave.filedrop', (e) =>
        if (@_entered -= 1) <= 0
          @hideDropzone()
          @trigger("fileDropHidden", e)

    @dropzone.on "dragover", (e) =>
      # From Dropzone.js
      # Makes it possible to drag files from chrome's download bar
      # http://stackoverflow.com/questions/19526430/drag-and-drop-file-uploads-from-chrome-downloads-bar
      # Try is required to prevent bug in Internet Explorer 11 (SCRIPT65535 exception)
      try efct = e.originalEvent.dataTransfer.effectAllowed
      e.originalEvent.dataTransfer.dropEffect = if 'move' == efct or 'linkMove' == efct then 'move' else 'copy' 
      false
    .on "drop", (e) =>
      files = []
      for file in e.originalEvent.dataTransfer.files
        unless @opts.types.indexOf(file.type) > -1
          @trigger("fileDropfail", [file, "Wrong types!"])
          @hideDropzone()
          return false
        files.push file
      @trigger "fileDrop", [files, e]
      @hideDropzone()
      false

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
    @el.removeData 'filedrop'
    $(document).off '.filedrop'
    @dropzone.remove()

filedrop = (opts) ->
  new Filedrop(opts)


class Filedrop extends SimpleModule

  @count: 0

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
    types: null
    hints: "Drop file here"

  disabled: false

  _init: ->
    @el = $ @opts.el
    throw new Error 'simple-filedrop: el option is invalid' if @el.length == 0

    @id = ++ @constructor.count
    @el.data 'filedrop', @

    @dropzone = $ @_dropzoneTpl
      .find '.filedrop-hints'
      .html @opts.hints
      .end()
      .hide()
      .data 'filedrop', @
      .appendTo document.body

    $ document
      .on "dragover.filedrop-#{@id}", (e) =>
        e.originalEvent.dataTransfer.dropEffect = "none"
        @dropzone.removeClass 'hover' if @dropzone.hasClass 'hover'
        false
      .on "drop.filedrop-#{@id}", (e) ->
        e.preventDefault()
      .on "dragenter.filedrop-#{@id}", (e) =>
        return if @disabled
        if (@_entered += 1) == 1
          @showDropzone() 
          @trigger("dropzoneshow")
      .on "dragleave.filedrop-#{@id}", (e) =>
        return if @disabled
        if (@_entered -= 1) <= 0
          @hideDropzone()
          @trigger("dropzonehide")

    @dropzone.on "dragover", (e) =>
      # From Dropzone.js
      # Makes it possible to drag files from chrome's download bar
      # http://stackoverflow.com/questions/19526430/drag-and-drop-file-uploads-from-chrome-downloads-bar
      # Try is required to prevent bug in Internet Explorer 11 (SCRIPT65535 exception)
      try efct = e.originalEvent.dataTransfer.effectAllowed
      e.originalEvent.dataTransfer.dropEffect = if 'move' == efct or 'linkMove' == efct then 'move' else 'copy' 
      @dropzone.addClass "hover" unless @dropzone.hasClass 'hover'
      false
    .on "drop", (e) =>
      return if @disabled
      files = []
      for file in e.originalEvent.dataTransfer.files
        if @opts.types and $.isArray(@opts.types) and @opts.types.indexOf(file.type) < 0
          @trigger("dropfail", [file, "Wrong types!"])
          @hideDropzone()
          return false
        files.push file
      @trigger "drop", [files]
      @constructor.hideAllDropzone()
      false

  showDropzone: ->
    return unless @el.is(':visible')

    @dropzone
      .removeClass 'hover'
      .show()
      .css
        zIndex: 9,
        position: 'absolute',
        top: (elOffset = @el.offset()).top,
        left: elOffset.left,
        width: @el.outerWidth(),
        height: @el.outerHeight(),
        opacity: 0.8

  hideDropzone: ->
    @dropzone.hide()
    @_entered = 0

  @hideAllDropzone: ->
    $('.simple-filedrop').each () ->
      filedrop = $(@).data('filedrop')
      filedrop.hideDropzone() if filedrop

  disable: ->
    @disabled = true
    @trigger "disabled"

  enable: ->
    @disabled = false
    @trigger "enabled"

  destroy: ->
    @el.removeData 'filedrop'
    $(document).off ".filedrop-#{@id}"
    @dropzone.remove()

filedrop = (opts) ->
  new Filedrop(opts)

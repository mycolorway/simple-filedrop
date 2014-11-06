
describe 'Simple filedrop', ->

  it 'should inherit from SimpleModule', ->
    filedrop = simple.filedrop()
    expect(filedrop instanceof SimpleModule).toBe(true)

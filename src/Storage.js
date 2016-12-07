'use strict'

const fs = require('fs')
const File = require('adonis-framework/src/File')
const md5File = require('md5-file/promise')

class Storage {

  constructor (driver) {
    this.driver = driver
  }

  /**
   * Determine if a file exists.
   *
   * @param  string  path
   * @return bool
   */
  * exists (path) {
    return yield this.driver.exists(path, this.config)
  }

  /**
   * Get the contents of a file.
   *
   * @param  string  path
   * @return string
   *
   * @throws {FileNotFoundException} If file not found
   */
  * get (path) {
    return yield this.driver.get(path, this.config)
  }

  /**
   * Write the contents of a file.
   *
   * @param  string  $path
   * @param  string|resource  $contents
   * @param  string  $visibility
   * @return bool
   */
  * put (path, contents) {
    if (contents instanceof File) {
      return yield this.putFile(path, contents)
    }
    return yield this.driver.put(path, contents, this.config)
  }

  /**
   * Store the uploaded file with name as md5 hash of file contents
   *
   * @param  string  path
   * @param  {File}  file
   * @return string|false
   */
  * putFile (path, file) {
    const fileHash = yield md5File(file.file.path)
    return yield this.putFileAs(path, file, fileHash)
  }

  /**
   * Store the uploaded file on the disk with a given name.
   *
   * @param  string  path
   * @param  {File} file
   * @param  string  name
   * @return string|false
   */
  * putFileAs (path, file, name) {
    const stream = fs.createReadStream(file.file.path)
    const result = yield this.put(`${path}/${name}`, stream)
    return result ? path : false
  }

}

module.exports = Storage
Multer.prototype._makeMiddleware = function (fields, fileStrategy) {
  function setup() {
    var fileFilter = this.fileFilter;
    var filesLeft = Object.create(null);

    fields.forEach(function (field) {
      if (typeof field.maxCount === 'number') {
        filesLeft[field.name] = field.maxCount;
      } else {
        filesLeft[field.name] = Infinity;
      }
    });

    function wrappedFileFilter(req, file, cb) {
      if ((filesLeft[file.fieldname] || 0) <= 0) {
        return cb(new MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
      }

      filesLeft[file.fieldname] -= 1;
      fileFilter(req, file, cb);
    }

    return {
      limits: this.limits,
      preservePath: this.preservePath,
      storage: this.storage,
      fileFilter: wrappedFileFilter,
      fileStrategy: fileStrategy,
    };
  }

  return makeMiddleware(setup.bind(this));
};

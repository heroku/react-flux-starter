'use strict';

class HTTPError extends Error {
  constructor(url, xhr, status, err, response) {
    this.url = url;
    this.xhr = xhr;
    this.status = status;
    this.error = err;
    this.response = response;
  }

  toString() {
    return `${this.constructor.name} (status=${this.xhr.status}, url=${this.url})`;
  }
}

module.exports = HTTPError;

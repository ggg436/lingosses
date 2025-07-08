// This is a polyfill for undici/lib/web/fetch/util.js
// It replaces the problematic private fields implementation

// Basic mocks for the functionality needed
const util = {
  // Basic type check
  isObject(value) {
    return value !== null && typeof value === 'object';
  },
  
  // Mock for validateHeaderName
  validateHeaderName(name) {
    if (typeof name !== 'string') {
      throw new TypeError(`Header name must be a string`);
    }
    return name.toLowerCase();
  },
  
  // Mock for validateHeaderValue
  validateHeaderValue(value) {
    if (value === undefined) {
      throw new TypeError(`Header value must be a string`);
    }
    return String(value);
  },

  // Replacement for the problematic iterator implementation
  createIterator(target, kind) {
    const iterator = {
      target,
      kind,
      index: 0,
      next() {
        if (!this.target) {
          return { value: undefined, done: true };
        }
        
        if (this.index >= this.target.length) {
          this.target = undefined;
          return { value: undefined, done: true };
        }
        
        const index = this.index++;
        const value = this.target[index];
        
        return {
          value,
          done: false
        };
      }
    };
    
    return iterator;
  }
};

// Export everything to satisfy imports
module.exports = {
  isObject: util.isObject,
  validateHeaderName: util.validateHeaderName,
  validateHeaderValue: util.validateHeaderValue,
  createIterator: util.createIterator,
  // Add any other functions that might be imported
  urlEncodeBytes: () => '',
  normalizeMethodRecord: (record) => record
};

// Support both ESM and CJS
export default module.exports;
export const isObject = util.isObject;
export const validateHeaderName = util.validateHeaderName;
export const validateHeaderValue = util.validateHeaderValue;
export const createIterator = util.createIterator;
export const urlEncodeBytes = module.exports.urlEncodeBytes;
export const normalizeMethodRecord = module.exports.normalizeMethodRecord; 
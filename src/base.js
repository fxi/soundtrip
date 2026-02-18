export {Base};

function Base() {
  const base = this;
  base.opt = {};
  base.optDefault = {};
}

Base.prototype.setOptionsDefault = function(opt) {
  const base = this;
  Object.defineProperty(base, 'optDefault', {
    value: opt,
    writable: false
  });
  Object.defineProperty(base, 'opt', {
    value: opt
  });
};

Base.prototype.setOptions = function(opt) {
  const base = this;
  const options = base.opt;
  Object.assign(options, base.optDefault, opt);
  base.validateOptions();
};

Base.prototype.setOption = function(name, value) {
  const base = this;
  const options = base.opt;
  if (options[name]) {
    options[name] = value;
  }
  base.validateOptions();
};

Base.prototype.resetOptions = function() {
  const base = this;
  base.setOptions(o.optDefault);
};

Base.prototype.validateOptions = function() {
  const base = this;
  const options = base.opt;
  /**
   * Validate types
   */
  Object.keys(base.optDefault).forEach((o) => {
    const def = base.optDefault[o];
    const isNumber = typeof def === 'number';
    const isBoolean = typeof def === 'boolean';
    const valueType = typeof options[o];
    if (isNumber && valueType !== 'number') {
      options[o] = options[o] * 1;
    }
    if (isBoolean && valueType !== 'boolean') {
      options[o] = options[o] === 'true';
    }
  });
};
Base.prototype.getOption = function(name) {
  const base = this;
  return base.opt[name];
};
Base.prototype.getOptions = function() {
  const base = this;
  return base.opt;
};

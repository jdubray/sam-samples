(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.tp = factory());
})(this, (function () { 'use strict';

  // ISC License (ISC)
  // Copyright 2019 Jean-Jacques Dubray

  // Permission to use, copy, modify, and/or distribute this software for any purpose
  // with or without fee is hereby granted, provided that the above copyright notice
  // and this permission notice appear in all copies.

  // THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  // REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
  // FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT,
  // OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA
  // OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION,
  // ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

  /**
   * Modernized SAM Utilities
   *
   * Note: Many functions have been replaced with native JavaScript features:
   * - O() → optional chaining (?.) and nullish coalescing (??)
   * - A() → optional chaining (?.) and nullish coalescing (??)
   * - S() → optional chaining (?.) and nullish coalescing (??)
   * - F() → nullish coalescing (??)
   * - E() → nullish checks (!= null) for simple cases
   *
   * The remaining functions provide specialized functionality beyond
   * what native optional chaining offers.
   */

  // Util functions often used in SAM implementations
  const first = (arr = []) => arr[0];
  const or = (acc, current) => acc || current;
  const and = (acc, current) => acc && current;
  const match = (conditions, values) => first(conditions.map((condition, index) => condition ? values[index] : null).filter(e));
  const step = () => ({});
  const doNotRender = model => () => model.continue() === true;
  const wrap = (s, w) => m => s(w(m));
  const log = f => (...args) => {
    console.log(args);
    f(...args);
  };

  /**
   * Standardized error handling for SAM
   * Creates a consistent error object that can be used across the system
   *
   * @param {Error|string} error - The error to standardize
   * @param {string} [context] - Optional context for the error
   * @param {string} [type='SAM_ERROR'] - Optional error type
   * @returns {Object} Standardized error object
   */
  const standardizeError = (error, context = null, type = 'SAM_ERROR') => {
    if (error instanceof Error) {
      return {
        __error: true,
        message: error.message,
        stack: error.stack,
        type,
        context,
        originalError: error
      };
    }
    return {
      __error: true,
      message: String(error),
      type,
      context
    };
  };

  // Enhanced existence check with support for complex cases
  // This goes beyond simple nullish checks to handle:
  // - Array element existence
  // - String substring checks
  // - Object key existence with truthy values
  const e = value => Array.isArray(value) ? value.map(e).reduce(and, true) : value !== false && value !== null && value !== undefined;
  const i = (value, element) => {
    switch (typeof value) {
      case 'string':
        return typeof element === 'string' && element !== '' && value.includes(element);
      case 'object':
        return Array.isArray(value) ? value.includes(element) : typeof element === 'string' && e(value[element]);
    }
    return value === element;
  };

  /**
   * Enhanced existence check - checks if value exists and optionally if element exists within value
   *
   * @param {*} value - The value to check
   * @param {*} [element] - Optional element to check within value
   * @returns {boolean} True if value exists and (element is undefined or element exists within value)
   *
   * Examples:
   * E(null) → false
   * E(undefined) → false
   * E(false) → false
   * E('hello') → true
   * E('hello', 'ell') → true
   * E('hello', 'xyz') → false
   * E([1,2,3], 2) → true
   * E({a: 1}, 'a') → true
   * E({a: null}, 'a') → false
   */
  const E = (value, element) => {
    if (!e(value)) return false;
    if (element === undefined) return e(value);
    if (!e(element)) return false;
    return i(value, element);
  };

  /**
   * Chainable conditional executor - executes function if value is truthy
   *
   * @param {*} value - Value to check
   * @param {Function} f - Function to execute if value is truthy
   * @param {boolean} [guard=true] - Optional guard condition
   * @returns {Object} Chainable object with .on method
   *
   * Example:
   * on(user.loggedIn, () => console.log('Welcome'))
   *   .on(user.isAdmin, () => console.log('Admin access'))
   */
  const oneOf = (value, f, guard = true) => {
    const triggered = e(value) && guard;
    triggered && f(value);
    return mon(triggered);
  };

  /**
   * Chainable conditional executor - executes function if value is truthy
   * Continues chain regardless of execution
   *
   * @param {*} value - Value to check
   * @param {Function} f - Function to execute if value is truthy
   * @param {boolean} [guard=true] - Optional guard condition
   * @returns {Object} Chainable object with .on method
   */
  const on = (value, f, guard = true) => {
    const triggered = e(value) && guard;
    triggered && f(value);
    return {
      on
    };
  };
  const mon = (triggered = true) => ({
    oneOf: triggered ? () => mon(false) : oneOf
  });

  // Number utilities - still useful for NaN handling
  const N = (val, value = 0) => Number.isNaN(val) ? value : val;
  const NZ = (val, value = 1) => val === 0 || Number.isNaN(val) ? value === 0 ? 1 : value : val;

  // Legacy functions kept for backward compatibility
  // These have been largely replaced by native optional chaining (?.) and nullish coalescing (??)
  const O = (val, value = {}) => val && typeof val === 'object' ? val : value;
  const A = (val, value = []) => val && Array.isArray(val) ? val : value;
  const S = (val, value = '') => val && typeof val === 'string' ? val : value;
  const F = (f, f0 = () => null) => f || f0;

  const safeDeepClone = obj => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(safeDeepClone);
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, safeDeepClone(v)]));
  };
  const clone = state => {
    const comps = state.__components;
    const {
      __components,
      ...stateWithoutComps
    } = state;
    const cln = safeDeepClone(stateWithoutComps);
    if (comps) {
      cln.__components = {};
      Object.keys(comps).forEach(key => {
        const {
          parent,
          ...compWithoutParent
        } = comps[key];
        cln.__components[key] = Object.assign(clone(compWithoutParent), {
          parent: cln
        });
      });
    }
    return cln;
  };
  class History {
    constructor(h = [], options = {}) {
      this.currentIndex = 0;
      this.history = h;
      this.max = options.max;
    }
    snap(state, index) {
      const snapshot = clone(state);
      if (index) {
        this.history[index] = snapshot;
      } else {
        this.history.push(snapshot);
        if (this.max && this.history.length > this.max) {
          this.history.shift();
        }
      }
      return state;
    }
    travel(index = 0) {
      this.currentIndex = index;
      return this.history[index];
    }
    next() {
      return this.history[this.currentIndex++];
    }
    hasNext() {
      return this.history[this.currentIndex] != null;
    }
    last() {
      this.currentIndex = this.history.length - 1;
      return this.history[this.currentIndex];
    }
  }

  const handlers = {};
  var events = {
    on: (event, handler) => {
      if (handlers[event] == null) {
        handlers[event] = [];
      }
      handlers[event].push(handler);
    },
    off: (event, handler) => {
      var _handlers$event$filte, _handlers$event;
      handlers[event] = (_handlers$event$filte = (_handlers$event = handlers[event]) === null || _handlers$event === void 0 ? void 0 : _handlers$event.filter(h => h !== handler)) !== null && _handlers$event$filte !== void 0 ? _handlers$event$filte : [];
    },
    emit: (events = [], data) => {
      if (Array.isArray(events)) {
        events.forEach(event => {
          var _handlers$event2;
          return (_handlers$event2 = handlers[event]) === null || _handlers$event2 === void 0 ? void 0 : _handlers$event2.forEach(f => f(data));
        });
      } else {
        var _handlers$events;
        (_handlers$events = handlers[events]) === null || _handlers$events === void 0 || _handlers$events.forEach(f => f(data));
      }
    }
  };

  // module-level clone so the recursion cannot be shadowed by a model data key
  // named `clone` (issue #29)
  const cloneState = state => {
    const comps = state.__components;
    const {
      __components,
      ...stateWithoutComps
    } = state;

    // Optimized cloning - avoid JSON.parse(JSON.stringify) for better performance
    const cln = Array.isArray(stateWithoutComps) ? [...stateWithoutComps] : {
      ...stateWithoutComps
    };

    // Deep clone nested objects
    Object.keys(cln).forEach(key => {
      const value = cln[key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        cln[key] = cloneState(value);
      } else if (Array.isArray(value)) {
        cln[key] = value.map(item => item && typeof item === 'object' ? cloneState(item) : item);
      }
    });
    if (comps) {
      cln.__components = {};
      Object.keys(comps).forEach(key => {
        const {
          parent,
          ...compWithoutParent
        } = comps[key];
        cln.__components[key] = Object.assign(cloneState(compWithoutParent), {
          parent: cln
        });
      });
    }
    return cln;
  };
  class Model {
    constructor(name) {
      this.__components = {};
      this.__behavior = [];
      this.__name = name;
      this.__lastProposalTimestamp = 0;
      this.__allowedActions = [];
      this.__disallowedActions = [];
      this.__eventQueue = [];
    }
    localState(name) {
      return this.__components[name] || {};
    }
    hasError() {
      return E(this.__error);
    }
    error() {
      return this.__error || undefined;
    }
    errorMessage() {
      var _this$__error;
      return (_this$__error = this.__error) === null || _this$__error === void 0 ? void 0 : _this$__error.message;
    }
    clearError() {
      return delete this.__error;
    }
    allowedActions() {
      return this.__allowedActions;
    }
    disallowedActions() {
      return this.__disallowedActions;
    }
    clearAllowedActions() {
      this.__allowedActions = [];
    }
    clearDisallowedActions() {
      this.__disallowedActions = [];
    }
    addAllowedActions(a) {
      this.__allowedActions.push(a);
    }
    addDisallowedActions(a) {
      this.__disallowedActions.push(a);
    }
    allow(a) {
      this.__allowedActions = this.__allowedActions.concat(a);
    }
    resetBehavior() {
      this.__behavior = [];
    }
    update(snapshot = {}) {
      Object.assign(this, snapshot);
    }
    setComponentState(component) {
      var _component$localState;
      this.__components[component.name] = Object.assign((_component$localState = component.localState) !== null && _component$localState !== void 0 ? _component$localState : {}, {
        parent: this
      });
      component.localState = component.localState || this.__components[component.name];
    }
    hasNext(val) {
      if (val !== undefined) {
        this.__hasNext = val;
      }
      return this.__hasNext;
    }
    continue() {
      return this.__continue === true;
    }
    renderNextTime() {
      delete this.__continue;
    }
    doNotRender() {
      this.__continue = true;
    }
    setLogger(logger) {
      this.__logger = logger;
    }
    log({
      trace,
      info,
      warning,
      error,
      fatal
    }) {
      if (this.__logger) {
        oneOf(trace, v => this.__logger.trace(v)).oneOf(info, v => this.__logger.info(v)).oneOf(warning, v => this.__logger.warning(v)).oneOf(error, v => this.__logger.error(v)).oneOf(fatal, v => this.__logger.fatal(v));
      }
    }
    prepareEvent(event, data) {
      this.__eventQueue.push([event, data]);
    }
    resetEventQueue() {
      this.__eventQueue = [];
    }
    flush() {
      // direct field access: a data key named `continue` must not shadow the check (#29)
      if (this.__continue !== true) {
        var _this$__eventQueue;
        (_this$__eventQueue = this.__eventQueue) === null || _this$__eventQueue === void 0 || _this$__eventQueue.forEach(([event, data]) => events.emit(event, data));
        this.__eventQueue = [];
      }
    }
    clone(state = this) {
      return cloneState(state);
    }
    state(name, clone) {
      const prop = n => E(this[n]) ? this[n] : E(this.__components[n]) ? this.__components[n] : this;
      let state;
      if (Array.isArray(name)) {
        state = name.map(n => prop(n));
      } else {
        state = prop(name);
      }
      return clone && state ? cloneState(state) : state;
    }
  }

  // ISC License (ISC)
  // Copyright 2026 Jean-Jacques Dubray

  // Permission to use, copy, modify, and/or distribute this software for any purpose
  // with or without fee is hereby granted, provided that the above copyright notice
  // and this permission notice appear in all copies.

  // THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  // REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
  // FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT,
  // OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA
  // OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION,
  // ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

  // SAM v2 strict profile (issue #20): named intents with declared payload schemas.
  // Turns the dropped-payload wiring bug — a valid, silently no-oping spec in v1 —
  // into a throw (strict mode) or a loud warning (default mode) on first fire.

  /**
   * Error thrown (strict mode) when a proposal violates its intent's declared
   * payload schema.
   */
  class SamSchemaError extends Error {
    /**
     * @param {string} intentName - name of the intent whose proposal is invalid
     * @param {string[]} violations - human-readable violation descriptions
     */
    constructor(intentName, violations = []) {
      super("Invalid proposal for intent '".concat(intentName, "': ").concat(violations.join('; ')));
      this.name = 'SamSchemaError';
      this.intentName = intentName;
      this.violations = violations;
    }
  }

  /**
   * Error thrown (strict mode) when a model write violates the declared model
   * shape (issue #21): undeclared key, type mismatch, or non-nullable null.
   */
  class SamShapeError extends Error {
    /**
     * @param {string} key - the offending model key
     * @param {string} violation - human-readable violation description
     */
    constructor(key, violation) {
      super("Invalid model write: ".concat(violation));
      this.name = 'SamShapeError';
      this.key = key;
      this.violation = violation;
    }
  }

  /**
   * Error thrown (strict mode) when instance.validate() finds obligations the
   * spec has not declared (missing schemas, domains, or model shape).
   */
  class SamValidationError extends Error {
    /**
     * @param {string[]} problems - human-readable validation problems
     */
    constructor(problems = []) {
      super("SAM spec validation failed:\n- ".concat(problems.join('\n- ')));
      this.name = 'SamValidationError';
      this.problems = problems;
    }
  }

  /**
   * Returns the schema-level type of a value: 'array', 'null', or typeof.
   * @param {*} value
   * @returns {string}
   */
  const typeOf = value => {
    if (Array.isArray(value)) {
      return 'array';
    }
    if (value === null) {
      return 'null';
    }
    return typeof value;
  };

  /**
   * Validates a proposal against a declared payload schema.
   *
   * A schema maps field names to `{ type, required, nullable }`:
   * - `required`: the field must be present (not undefined)
   * - `nullable`: null is an accepted value
   * - `type`: one of 'string' | 'number' | 'boolean' | 'object' | 'array' | 'function'
   *
   * Fields absent from the schema are ignored (the sealed model shape, issue #21,
   * owns that concern).
   *
   * @param {Object} schema - map of field name to field specification
   * @param {Object} proposal - the proposal returned by the action
   * @returns {string[]} violations, empty when the proposal is valid
   */
  const validateProposal = (schema = {}, proposal = {}) => {
    const violations = [];
    Object.keys(schema).forEach(field => {
      var _schema$field;
      const spec = (_schema$field = schema[field]) !== null && _schema$field !== void 0 ? _schema$field : {};
      const value = proposal[field];
      if (value === undefined) {
        if (spec.required) {
          violations.push("missing required field '".concat(field, "'"));
        }
        return;
      }
      if (value === null) {
        if (!spec.nullable) {
          violations.push("field '".concat(field, "' is null but not declared nullable"));
        }
        return;
      }
      if (spec.type && typeOf(value) !== spec.type) {
        violations.push("field '".concat(field, "' expected type '").concat(spec.type, "', got '").concat(typeOf(value), "'"));
      }
    });
    return violations;
  };

  /**
   * Checks a single model write against a declared model shape.
   *
   * A shape maps model keys to `{ type, nullable, derived, internal }`:
   * - `type`/`nullable`: as in payload schemas
   * - `derived`: computed by reactors rather than accepted from proposals
   * - `internal`: visible to tooling but excluded from getState snapshots
   *
   * @param {Object} shape - the declared model shape
   * @param {string} key - the model key being written
   * @param {*} value - the value being written
   * @returns {string|null} a violation description, or null when the write is legal
   */
  const checkShapeWrite = (shape, key, value) => {
    const spec = shape[key];
    if (spec === undefined) {
      return "undeclared model key '".concat(key, "' (declare it in modelShape, or mark it internal)");
    }
    if (value === null || value === undefined) {
      return spec.nullable ? null : "key '".concat(key, "' set to ").concat(value, " but not declared nullable");
    }
    if (spec.type && typeOf(value) !== spec.type) {
      return "key '".concat(key, "' expected type '").concat(spec.type, "', got '").concat(typeOf(value), "'");
    }
    return null;
  };

  /**
   * Validates a proposal against an intent's schema and applies the strict-profile
   * policy: throw in strict mode, warn in default mode.
   *
   * @param {string} intentName
   * @param {Object|undefined} schema - the intent's declared payload schema
   * @param {Object} proposal
   * @param {boolean} strict
   * @throws {SamSchemaError} in strict mode when the proposal is invalid
   */
  const enforceProposalSchema = (intentName, schema, proposal, strict) => {
    if (!schema) {
      return;
    }
    const violations = validateProposal(schema, proposal);
    if (violations.length > 0) {
      const error = new SamSchemaError(intentName !== null && intentName !== void 0 ? intentName : 'anonymous', violations);
      if (strict) {
        throw error;
      }
      console.warn(error.message);
    }
  };

  // ISC License (ISC)
  // Copyright 2019 Jean-Jacques Dubray


  // This is an implementation of SAM using SAM's own principles
  // - SAM's internal model
  // - SAM's internal acceptors
  // - SAM's present function

  // eslint-disable-next-line arrow-body-style
  const stringify = (s, pretty) => {
    return pretty ? JSON.stringify(s, null, 4) : JSON.stringify(s);
  };
  const display = (json = {}, pretty = false) => {
    const keys = Object.keys(json);
    return "".concat(keys.map(key => {
      if (typeof key !== 'string') {
        return '';
      }
      return key.indexOf('__') === 0 ? '' : stringify(json[key], pretty);
    }).filter(val => val !== '').join(', '));
  };
  const react = r => r();
  const accept = (proposal, stepApi) => async a => a(proposal, stepApi);
  // synchronous variant so acceptor exceptions (e.g. SamShapeError) propagate to
  // the intent instead of becoming unhandled rejections
  const acceptSync = (proposal, stepApi) => a => a(proposal, stepApi);

  // errors the strict profile lets propagate to the intent caller rather than
  // converting to an __error proposal
  const isStrictError = err => err.name === 'SamSchemaError' || err.name === 'SamShapeError';

  // v2 (#20): named intents — component.actions may be an object map of
  // name -> action | { action, schema, domain }. Normalizes to an array of
  // decorated action functions; returns undefined for the v1 array form.
  const normalizeNamedActions = actions => {
    if (actions == null || Array.isArray(actions) || typeof actions !== 'object') {
      return undefined;
    }
    return Object.entries(actions).map(([name, definition]) => {
      const action = typeof definition === 'function' ? definition : definition.action;
      if (typeof action !== 'function') {
        throw new Error("SAM: intent '".concat(name, "' must declare an action function"));
      }
      action.__actionName = name;
      if (typeof definition !== 'function') {
        action.__schema = definition.schema;
        action.__domain = definition.domain;
      }
      return action;
    });
  };
  function createInstance (options = {}) {
    var _options$timetravel;
    const {
      max
    } = (_options$timetravel = options.timetravel) !== null && _options$timetravel !== void 0 ? _options$timetravel : {};
    const {
      hasAsyncActions = true,
      instanceName = 'global',
      synchronize = false,
      clone = false,
      requestStateRepresentation,
      strict = false,
      devWarnings = strict,
      neverEnabledThreshold = 3
    } = options;
    const {
      synchronizeInterval = 5
    } = synchronize !== null && synchronize !== void 0 ? synchronize : {};

    // SAM's internal model
    let history;
    const model = new Model(instanceName);

    // framework-internal Model method access, immune to data keys shadowing
    // prototype methods (issue #29: a model key named 'state', 'clone', ...)
    const invokeModel = (method, ...args) => Model.prototype[method].apply(model, args);
    const safeFlush = m => m instanceof Model ? Model.prototype.flush.call(m) : typeof m.flush === 'function' ? m.flush() : undefined;

    // v2 (#21): declared, sealed model shape — SAM's VARIABLES
    let modelShape = null;
    const stepMutations = new Set();

    // v2 (#22): per-step enabledness observability
    const stepWrites = new Set();
    const stepRejections = [];
    let currentIntentName = null;
    let stepListener = null;
    const stepApi = {
      /**
       * Records an explicit, observable rejection of the current proposal —
       * distinct from silent fall-through and from the __error slot.
       * @param {string} reason - why the acceptor rejected the proposal
       */
      reject: reason => {
        stepRejections.push({
          intent: currentIntentName,
          reason
        });
      }
    };

    // shallow write tracking cannot see in-place nested mutations
    // (model.nodes[k].field = v); a strict-mode snapshot comparison catches
    // them so they classify as mutated (deep) instead of a false "unhandled"
    let stepBeforeSnapshot;
    let stepDeepChange = false;
    let stepErrorBefore;
    const beginStep = proposal => {
      var _proposal$__actionNam;
      currentIntentName = (_proposal$__actionNam = proposal.__actionName) !== null && _proposal$__actionNam !== void 0 ? _proposal$__actionNam : null;
      stepMutations.clear();
      stepWrites.clear();
      stepRejections.length = 0;
      stepDeepChange = false;
      stepBeforeSnapshot = strict && currentIntentName != null ? display(model) : undefined;
      stepErrorBefore = model.__error;
    };

    // strict mode hands acceptors/reactors/naps a sealed view of the model:
    // writes to undeclared or ill-typed keys throw SamShapeError; framework
    // internals (__-prefixed) are exempt. Also records per-step mutations.
    const sealedModel = strict ? new Proxy(model, {
      set(target, prop, value) {
        if (typeof prop === 'string' && prop.indexOf('__') !== 0) {
          if (modelShape) {
            const violation = checkShapeWrite(modelShape, prop, value);
            if (violation) {
              throw new SamShapeError(prop, violation);
            }
          }
          stepWrites.add(prop);
          if (target[prop] !== value) {
            stepMutations.add(prop);
          }
        }
        target[prop] = value;
        return true;
      },
      deleteProperty(target, prop) {
        if (typeof prop === 'string' && prop.indexOf('__') !== 0) {
          stepWrites.add(prop);
          stepMutations.add(prop);
        }
        delete target[prop];
        return true;
      }
    }) : model;
    const registerModelShape = shape => {
      modelShape = Object.assign(modelShape !== null && modelShape !== void 0 ? modelShape : {}, shape);
      // #29: the framework is immune to data keys shadowing Model methods, but
      // user code calling model.<key>() in render/naps would see data — flag it
      if (devWarnings) {
        const collisions = Object.keys(shape).filter(key => typeof Model.prototype[key] === 'function');
        if (collisions.length > 0) {
          console.warn("SAM: modelShape key(s) ".concat(collisions.map(k => "'".concat(k, "'")).join(', '), " shadow Model method(s) of the same name; the framework is unaffected, but calling model.").concat(collisions[0], "() in your own render/naps returns the data \u2014 use getState() for snapshots"));
        }
      }
      // validate the current observable state against the declared shape
      Object.keys(model).filter(key => key.indexOf('__') !== 0).forEach(key => {
        const violation = checkShapeWrite(modelShape, key, model[key]);
        if (violation) {
          if (strict) {
            throw new SamShapeError(key, violation);
          }
          console.warn("SAM: model shape violation: ".concat(violation));
        }
      });
    };
    const observableKeys = () => modelShape ? Object.keys(modelShape).filter(key => !modelShape[key].internal) : Object.keys(model).filter(key => key.indexOf('__') !== 0);
    const getState = () => {
      const snapshot = {};
      observableKeys().forEach(key => {
        if (model[key] !== undefined) {
          snapshot[key] = model[key] === null ? null : JSON.parse(JSON.stringify(model[key]));
        }
      });
      return snapshot;
    };
    const setState = (snapshot = {}) => {
      Object.keys(snapshot).forEach(key => {
        if (strict && modelShape) {
          const violation = checkShapeWrite(modelShape, key, snapshot[key]);
          if (violation) {
            throw new SamShapeError(key, violation);
          }
        }
        model[key] = snapshot[key] === null || snapshot[key] === undefined ? snapshot[key] : JSON.parse(JSON.stringify(snapshot[key]));
      });
    };

    // v2 (#21/#22): per-step observability — every no-op step is mechanically
    // classifiable as rejected | unhandled | identity-by-mutation
    const lastStep = () => {
      const rejections = stepRejections.slice();
      const mutations = Array.from(stepMutations);
      const writes = Array.from(stepWrites);
      let classification = 'unhandled';
      if (rejections.length > 0) {
        classification = 'rejected';
      } else if (mutations.length > 0 || stepDeepChange) {
        classification = 'mutated';
      } else if (writes.length > 0) {
        classification = 'identity-by-mutation';
      }
      return {
        intent: currentIntentName,
        mutations,
        writes,
        rejections,
        classification,
        deep: stepDeepChange
      };
    };
    const endStep = () => {
      if (stepBeforeSnapshot !== undefined && stepMutations.size === 0 && stepRejections.length === 0) {
        stepDeepChange = display(model) !== stepBeforeSnapshot;
      }
      // #31: an __error-slot write during a non-mutating step is the v1
      // rejection idiom — classify it as rejected with the error text as the
      // reason, unifying it with reject(reason) under one observable vocabulary
      // (a step that also mutates classifies mutated; the error stays readable)
      if (currentIntentName != null && stepRejections.length === 0 && stepMutations.size === 0 && !stepDeepChange && model.__error != null && model.__error !== stepErrorBefore) {
        var _model$__error$messag, _model$__error;
        stepRejections.push({
          intent: currentIntentName,
          reason: (_model$__error$messag = (_model$__error = model.__error) === null || _model$__error === void 0 ? void 0 : _model$__error.message) !== null && _model$__error$messag !== void 0 ? _model$__error$messag : String(model.__error)
        });
      }
      const step = lastStep();
      if (devWarnings && strict && step.intent != null && step.classification === 'unhandled') {
        console.warn("SAM: unhandled proposal \u2014 intent '".concat(step.intent, "' fired but no acceptor mutated the model or rejected the proposal"));
      }
      stepListener && stepListener(step);
    };

    // v2 (#23/#24): structural registry — external tools (explorer, transpiler,
    // linter) recover intents, schemas, domains, acceptor bindings and the model
    // shape from the instance instead of parsing code or side-channel manifests
    const intentRegistry = {};
    const acceptorRegistry = {
      keyed: [],
      broadcast: 0
    };
    // named intent functions survive across instance calls so tools (e.g. the
    // checker) can drive the spec without a side-channel intent list
    const registeredIntents = {};

    // v2 (#24): validates that every declared obligation is present — the
    // strict analog of TLC refusing to run without CONSTANTS
    const validate = () => {
      const problems = [];
      const names = Object.keys(intentRegistry);
      if (names.length === 0) {
        problems.push('no named intents registered');
      }
      names.forEach(name => {
        const {
          schema,
          domain
        } = intentRegistry[name];
        if (!schema) {
          problems.push("intent '".concat(name, "' has no payload schema"));
        }
        if (domain == null) {
          problems.push("intent '".concat(name, "' has no input domain"));
        }
      });
      if (!modelShape) {
        problems.push('no modelShape declared');
      }
      if (strict && problems.length > 0) {
        throw new SamValidationError(problems);
      }
      return problems;
    };
    const manifest = () => ({
      intents: Object.keys(intentRegistry).reduce((acc, name) => {
        acc[name] = {
          schema: intentRegistry[name].schema,
          domain: intentRegistry[name].domain
        };
        return acc;
      }, {}),
      acceptors: {
        keyed: acceptorRegistry.keyed.slice(),
        broadcast: acceptorRegistry.broadcast
      },
      modelShape: modelShape ? {
        ...modelShape
      } : null
    });
    const mount = (arr = [], elements = [], operand = sealedModel) => elements.map(el => arr.push(el(operand)));
    let intents;
    const acceptors = [({
      __error
    }) => {
      if (__error) {
        if (__error.name !== 'AssertionError') {
          model.__error = __error;
        } else {
          console.log('--------------------------------------');
          console.log(__error);
        }
      }
    }];
    const reactors = [() => {
      invokeModel('hasNext', history ? history.hasNext() : false);
    }];
    const naps = [];

    // ancillary
    let renderView = m => safeFlush(m);
    let _render = m => safeFlush(m);
    let storeRenderView = _render;

    // State Representation
    const state = () => {
      try {
        // Compute state representation
        reactors.forEach(react);

        // render state representation (gated by nap)
        if (!naps.map(react).reduce(or, false)) {
          renderView(clone ? invokeModel('clone') : model);
        }
        invokeModel('renderNextTime');
      } catch (err) {
        if (err.name === 'AssertionError' || isStrictError(err)) {
          throw err;
        }
        setTimeout(() => present({
          __error: err
        }), 0);
      }
    };
    const storeBehavior = proposal => {
      if (proposal.__name != null) {
        const actionName = proposal.__name;
        delete proposal.__name;
        const behavior = model.__formatBehavior ? model.__formatBehavior(actionName, proposal, model) : "".concat(actionName, "(").concat(display(proposal), ") ==> ").concat(display(model));
        model.__behavior.push(behavior);
      }
    };
    const checkForOutOfOrder = proposal => {
      if (proposal.__startTime) {
        if (proposal.__startTime < model.__lastProposalTimestamp) {
          return false;
        }
        model.__lastProposalTimestamp = proposal.__startTime;
      }
      return true;
    };
    const queue = {
      _queue: [],
      _rendering: false,
      add(args) {
        this._queue.push(args);
      },
      synchronize(present) {
        const self = this;
        this._interval = setInterval(async () => {
          if (!self._rendering && self._queue.length > 0) {
            self._rendering = true;
            const [args] = self._queue.slice(0, 1);
            self._queue.shift();
            const [proposal] = args;
            proposal.__rendering = self._rendering;
            await present(...args);
            self._rendering = false;
          }
        }, synchronizeInterval);
        return (...args) => queue.add(args);
      },
      clear() {
        clearInterval(this._interval);
      }
    };
    let present = synchronize ? async (proposal, resolve) => {
      if (checkForOutOfOrder(proposal)) {
        beginStep(proposal);
        invokeModel('resetEventQueue');
        // accept proposal
        await Promise.all(acceptors.map(accept(proposal, stepApi)));
        storeBehavior(proposal);
        endStep();

        // Continue to state representation
        state();
        resolve && resolve();
      }
    } : (proposal, resolve) => {
      if (checkForOutOfOrder(proposal)) {
        beginStep(proposal);
        // accept proposal (synchronously, so strict-profile errors propagate)
        acceptors.forEach(acceptSync(proposal, stepApi));
        storeBehavior(proposal);
        endStep();

        // Continue to state representation
        state();
        resolve && resolve();
      }
    };
    if (synchronize) {
      present = queue.synchronize(present);
    }

    // SAM's internal acceptors
    const addInitialState = (initialState = {}) => {
      invokeModel('update', initialState);
      if (history) {
        history.snap(model, 0);
      }
      invokeModel('resetBehavior');
    };

    // eslint-disable-next-line no-shadow
    const rollback = (conditions = []) => conditions.map(condition => model => () => {
      const isNotSafe = condition.expression(model);
      if (isNotSafe) {
        invokeModel('log', {
          error: {
            name: condition.name,
            model
          }
        });
        // rollback if history is present
        if (history) {
          invokeModel('update', history.last());
          renderView(model);
        }
        return true;
      }
      return false;
    });
    const isAllowed = action => (!model.__blockUnexpectedActions && invokeModel('allowedActions').length === 0 || invokeModel('allowedActions').map(a => typeof a === 'string' ? a === action.__actionName : a === action).reduce(or, false)) && !invokeModel('disallowedActions').map(a => typeof a === 'string' ? a === action.__actionName : a === action).reduce(or, false);
    const acceptLocalState = component => {
      if (component.name != null) {
        invokeModel('setComponentState', component);
      }
    };

    // add one component at a time, returns array of intents from actions
    const addComponent = (component = {}) => {
      var _intents;
      const {
        ignoreOutdatedProposals = false,
        debounce = 0,
        retry
      } = component.options || {};
      if (retry) {
        retry.retryMax = NZ(retry.retryMax);
        retry.retryDelay = N(retry.retryDelay);
      }
      const debounceDelay = debounce;

      // v2 (#21): declared model shape
      if (component.modelShape) {
        registerModelShape(component.modelShape);
      }

      // Add component's private state
      acceptLocalState(component);

      // Clean up old intents to prevent memory leaks
      if ((_intents = intents) !== null && _intents !== void 0 && _intents.length) {
        intents.length = 0;
      }

      // v2 (#20): named intent registration (object map) normalizes to an array;
      // undefined means the v1 positional array form
      const namedActions = normalizeNamedActions(component.actions);
      const actionList = namedActions !== null && namedActions !== void 0 ? namedActions : component.actions;
      let intentList;
      if (namedActions) {
        namedActions.forEach(action => {
          const {
            __actionName: name,
            __schema: schema,
            __domain: domain
          } = action;
          // v2 (#24): payload-object domain entries are schema-validated at
          // declaration time (argument-style entries are validated on fire)
          if (schema && Array.isArray(domain)) {
            domain.forEach(entry => {
              if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
                enforceProposalSchema(name, schema, entry, strict);
              }
            });
          }
          intentRegistry[name] = {
            schema,
            domain
          };
        });
      }

      // Decorate actions to present proposal to the model
      if (hasAsyncActions) {
        intentList = actionList === null || actionList === void 0 ? void 0 : actionList.map(action => {
          let needsDebounce = false;
          let retryCount = 0;
          let noopCount = 0;
          let warnedNeverEnabled = false;
          if (typeof action === 'object') {
            const label = action.label || action[0];
            const smId = E(action) && E(action[2]) ? action[2].id : undefined;
            action = action.action || action[1];
            action.__actionName = label;
            action.__stateMachineId = smId;
          }
          const intent = async (...args) => {
            const startTime = new Date().getTime();
            if (isAllowed(action)) {
              if (debounceDelay > 0 && needsDebounce) {
                var _args$;
                needsDebounce = !((_args$ = args[0]) !== null && _args$ !== void 0 && _args$.__resetDebounce);
                return;
              }
              let proposal = {};
              try {
                proposal = await action(...args);
                proposal.__actionName = action.__actionName;
                proposal.__stateMachineId = action.__stateMachineId;
              } catch (err) {
                if (retry) {
                  retryCount += 1;
                  if (retryCount < retry.retryMax) {
                    setTimeout(() => intent(...args), retry.retryDelay);
                    return;
                  }
                  present({
                    __error: err
                  });
                  retryCount = 0;
                  return;
                }
                if (err.name !== 'AssertionError') {
                  proposal.__error = err;
                } else {
                  throw err;
                }
              }

              // v2 (#20): payload schema enforcement — throws SamSchemaError in
              // strict mode, warns in default mode; error proposals bypass it
              if (!proposal.__error) {
                enforceProposalSchema(action.__actionName, action.__schema, proposal, strict);
              }
              if (ignoreOutdatedProposals) {
                proposal.__startTime = startTime;
              }

              // v2 (#20): never-enabled heuristic — snapshot the observable model
              // around present; synchronize mode queues proposals, so skip there
              const watchForNoop = devWarnings && !synchronize && !proposal.__error;
              const beforeSnapshot = watchForNoop ? display(model) : undefined;
              try {
                if (isAllowed(action)) {
                  present(proposal);
                  retryCount = 0;
                }
              } catch (err) {
                // uncaught exception in an acceptor
                if (err.name === 'AssertionError' || isStrictError(err)) {
                  throw err;
                }
                present({
                  __error: err
                });
              }
              if (watchForNoop) {
                if (stepRejections.length > 0) {
                  // an explicit rejection proves the intent is wired and guarded
                  noopCount = 0;
                } else if (display(model) === beforeSnapshot) {
                  noopCount += 1;
                  if (noopCount >= neverEnabledThreshold && !warnedNeverEnabled) {
                    var _action$__actionName;
                    warnedNeverEnabled = true;
                    console.warn("SAM: intent '".concat((_action$__actionName = action.__actionName) !== null && _action$__actionName !== void 0 ? _action$__actionName : 'anonymous', "' fired ").concat(noopCount, " times without mutating the model \u2014 possibly never enabled (dropped payload or guard mismatch?)"));
                  }
                } else {
                  noopCount = 0;
                }
              }
              if (debounceDelay > 0) {
                needsDebounce = true;
                setTimeout(() => intent({
                  __resetDebounce: true
                }), debounceDelay);
              }
            }
          };
          intent.__actionName = action.__actionName;
          intent.__stateMachineId = action.__stateMachineId;
          intent.__schema = action.__schema;
          intent.__domain = action.__domain;
          return intent;
        });
      } else {
        intentList = actionList === null || actionList === void 0 ? void 0 : actionList.map(action => {
          const intent = (...args) => {
            try {
              if (isAllowed(action)) {
                const proposal = action(...args);
                proposal.__actionName = action.__actionName;
                enforceProposalSchema(action.__actionName, action.__schema, proposal, strict);
                present(proposal);
              } else {
                present({
                  __error: "unexpected action ".concat(action.__actionName || '')
                });
              }
            } catch (err) {
              if (err.name === 'AssertionError' || isStrictError(err)) {
                throw err;
              }
              present({
                __error: err
              });
            }
          };
          intent.__actionName = action.__actionName;
          intent.__stateMachineId = action.__stateMachineId;
          intent.__schema = action.__schema;
          intent.__domain = action.__domain;
          return intent;
        });
      }

      // v2 (#20): named form returns intents keyed by name
      intents = namedActions ? (intentList !== null && intentList !== void 0 ? intentList : []).reduce((acc, intent) => Object.assign(acc, {
        [intent.__actionName]: intent
      }), {}) : intentList;
      if (namedActions) {
        Object.assign(registeredIntents, intents);
      }

      // Add component's acceptors,  reactors, naps and safety condition to SAM instance
      if (component.acceptors && !Array.isArray(component.acceptors) && typeof component.acceptors === 'object') {
        // v2 (#23): keyed acceptor registration — the framework binds each
        // acceptor to its action, so acceptor bodies contain only guards and
        // mutations; the switch-dispatch monolith is inexpressible in this form
        Object.keys(component.acceptors).forEach(key => {
          const acceptorFactory = component.acceptors[key];
          if (key === '*') {
            // explicitly-marked cross-cutting (broadcast) acceptor
            acceptorRegistry.broadcast += 1;
            mount(acceptors, [acceptorFactory], component.localState);
            return;
          }
          if (strict && intentRegistry[key] === undefined) {
            throw new Error("SAM: keyed acceptor '".concat(key, "' does not match any registered intent (declare the intent first, or use '*' for cross-cutting acceptors)"));
          }
          acceptorRegistry.keyed.push(key);
          mount(acceptors, [operand => {
            const acceptor = acceptorFactory(operand);
            return (proposal, api) => proposal.__actionName === key ? acceptor(proposal, api) : undefined;
          }], component.localState);
        });
      } else {
        acceptorRegistry.broadcast += A(component.acceptors).length;
        mount(acceptors, component.acceptors, component.localState);
      }
      mount(reactors, component.reactors, component.localState);
      mount(naps, rollback(component.safety), component.localState);
      mount(naps, component.naps, component.localState);
    };
    const setRender = render => {
      const flushEventsAndRender = m => {
        safeFlush(m);
        render && render(m);
      };
      renderView = history ? wrap(flushEventsAndRender, s => history ? history.snap(s) : s) : flushEventsAndRender;
      _render = render;
    };
    const setLogger = l => {
      invokeModel('setLogger', l);
    };
    const setHistory = h => {
      history = new History(h, {
        max
      });
      invokeModel('hasNext', history.hasNext());
      invokeModel('resetBehavior');
      renderView = wrap(_render, s => history ? history.snap(s) : s);
    };
    const timetravel = (travel = {}) => {
      let travelTo = {};
      if (E(history)) {
        if (travel.reset) {
          travel.index = 0;
          model.__behavior = [];
        }
        if (travel.next) {
          travelTo = history.next();
        } else if (travel.endOfTime) {
          travelTo = history.last();
        } else {
          travelTo = history.travel(travel.index);
        }
      }
      renderView({
        ...model,
        ...travelTo
      });
    };
    const setCheck = ({
      begin = {},
      end
    }) => {
      const {
        render
      } = begin;
      if (E(render)) {
        storeRenderView = renderView;
        renderView = render;
      }
      if (E(end)) {
        renderView = storeRenderView;
      }
    };
    const allowedActions = ({
      actions = [],
      clear = false
    }) => {
      if (clear) {
        invokeModel('clearAllowedActions');
      }
      if (actions.length > 0) {
        invokeModel('addAllowedActions', actions);
      }
      return model.__allowedActions;
    };
    const addEventHandler = ([event, handler]) => events.on(event, handler);

    // SAM's internal present function
    return ({
      // eslint-disable-next-line no-shadow
      initialState,
      component,
      render,
      history,
      travel,
      logger,
      check,
      allowed,
      clearInterval,
      event,
      stepListener: stepListenerParam
    }) => {
      intents = [];
      on(history, setHistory).on(stepListenerParam, listener => {
        stepListener = listener;
      }).on(initialState, addInitialState).on(component, addComponent).on(render, setRender).on(travel, timetravel).on(logger, setLogger).on(check, setCheck).on(allowed, allowedActions).on(clearInterval, () => queue.clear()).on(event, addEventHandler);
      return {
        hasNext: invokeModel('hasNext'),
        hasError: invokeModel('hasError'),
        errorMessage: invokeModel('errorMessage'),
        error: invokeModel('error'),
        intents,
        state: name => invokeModel('state', name, clone),
        getState,
        setState,
        lastStep,
        manifest,
        validate,
        namedIntents: () => ({
          ...registeredIntents
        }),
        dispose: () => synchronize && queue.clear()
      };
    };
  }

  // ISC License (ISC)
  // Copyright 2019 Jean-Jacques Dubray

  const SAM = createInstance();

  // ISC License (ISC)
  // Copyright 2019 Jean-Jacques Dubray


  // A set of methods to use the SAM pattern
  var api = (SAM$1 = SAM) => ({
    // Core SAM API
    addInitialState: initialState => SAM$1({
      initialState
    }),
    addComponent: component => SAM$1({
      component
    }),
    setRender: render => {
      if (Array.isArray(render)) {
        const [display, representation] = render;
        render = state => display(typeof representation === 'function' ? representation(state) : state);
      }
      SAM$1({
        render: render !== null && render !== void 0 ? render : () => null
      });
    },
    addHandler: (event, handler) => SAM$1({
      event: [event, handler]
    }),
    getIntents: actions => SAM$1({
      component: {
        actions
      }
    }),
    addAcceptors: (acceptors, privateModel) => SAM$1({
      component: {
        acceptors,
        privateModel
      }
    }),
    addReactors: (reactors, privateModel) => SAM$1({
      component: {
        reactors,
        privateModel
      }
    }),
    addNAPs: (naps, privateModel) => SAM$1({
      component: {
        naps,
        privateModel
      }
    }),
    addSafetyConditions: (safety, privateModel) => SAM$1({
      component: {
        safety,
        privateModel
      }
    }),
    hasError: () => SAM$1({}).hasError,
    allow: actions => SAM$1({
      allowed: {
        actions
      }
    }),
    clearAllowedActions: () => SAM$1({
      allowed: {
        clear: true
      }
    }),
    allowedActions: () => SAM$1({
      allowed: {}
    }),
    // Time Travel
    addTimeTraveler: (history = []) => SAM$1({
      history
    }),
    travel: (index = 0) => SAM$1({
      travel: {
        index
      }
    }),
    next: () => SAM$1({
      travel: {
        next: true
      }
    }),
    last: () => SAM$1({
      travel: {
        endOfTime: true
      }
    }),
    hasNext: () => SAM$1({}).hasNext,
    reset: initialState => initialState ? SAM$1({
      initialState
    }) : SAM$1({
      travel: {
        reset: true
      }
    }),
    // Checker
    beginCheck: render => SAM$1({
      check: {
        begin: {
          render
        }
      }
    }),
    endCheck: () => SAM$1({
      check: {
        end: true
      }
    })
  });

  const permutations = (arr, perms, currentDepth, depthMax, noDuplicateAction, doNotStartWith) => {
    if (arr.length === 0 || depthMax <= 0) {
      return [];
    }
    const nextLevel = [];
    if (perms.length === 0) {
      arr.forEach(i => {
        if (doNotStartWith.length === 0 || !doNotStartWith.includes(i.name)) {
          nextLevel.push([i]);
        }
      });
    } else {
      perms.forEach(p => {
        const lastInPerm = p[p.length - 1];
        arr.forEach(i => {
          if (noDuplicateAction && lastInPerm === i) {
            return;
          }
          nextLevel.push(p.concat([i]));
        });
      });
    }
    currentDepth++;
    if (currentDepth < depthMax) {
      return permutations(arr, nextLevel, currentDepth, depthMax, noDuplicateAction, doNotStartWith);
    }
    return nextLevel.filter(run => run.length === depthMax);
  };
  const prepareValuePermutations = permutation => {
    const indexMax = permutation.map(intent => {
      var _intent$values$length, _intent$values;
      return (_intent$values$length = intent === null || intent === void 0 || (_intent$values = intent.values) === null || _intent$values === void 0 ? void 0 : _intent$values.length) !== null && _intent$values$length !== void 0 ? _intent$values$length : 0;
    });
    const modMax = indexMax.map((val, index) => {
      let out = 1;
      for (let j = index; j < indexMax.length; j++) {
        out *= indexMax[j];
      }
      return out;
    });
    const increment = currentIndex => modMax.map((m, index) => {
      if (index === modMax.length - 1) {
        return currentIndex % indexMax[index];
      }
      return Math.floor(currentIndex / modMax[index + 1]) % indexMax[index];
    });
    const kmax = indexMax.reduce((acc, val) => acc * val, 1);
    if (kmax === 0) {
      var _error$originalError;
      const error = standardizeError(['Checker: invalid dataset, one of the intents values has no value.', 'If an intent has no parameter, add an empty array to its values'].join('\n'), 'CHECKER_VALIDATION', 'VALIDATION_ERROR');
      throw (_error$originalError = error.originalError) !== null && _error$originalError !== void 0 ? _error$originalError : new Error(error.message);
    }
    return {
      increment,
      kmax
    };
  };
  const apply = (perms = [], resetState, setBehavior) => {
    perms.forEach(permutation => {
      let k = 0;
      const {
        increment,
        kmax
      } = prepareValuePermutations(permutation);
      do {
        // Process a permutation for all possible values
        const currentValueIndex = increment(k++);
        const currentValues = permutation.map((i, forIntent) => i.values[currentValueIndex[forIntent]]);
        // return to initial state
        resetState();
        setBehavior([]);

        // apply behavior (intent(...values))
        permutation.forEach((i, forIntent) => i.intent(...currentValues[forIntent]));
      } while (k < kmax);
    });
  };

  // v2 (#24): derives the checker's intent list from the instance's named
  // intents and their declared input domains — no harness-side configuration.
  // Domain entries: an array spreads as intent arguments, anything else is the
  // single argument; a function domain is a generator evaluated here.
  const intentsFromDomains = instance => {
    const control = instance({});
    if (typeof control.namedIntents !== 'function') {
      return [];
    }
    const named = control.namedIntents();
    return Object.keys(named).map(name => {
      const intent = named[name];
      const domain = typeof intent.__domain === 'function' ? intent.__domain() : intent.__domain;
      return {
        name,
        intent,
        values: (domain !== null && domain !== void 0 ? domain : []).map(entry => Array.isArray(entry) ? entry : [entry])
      };
    }).filter(i => i.values.length > 0);
  };
  const checker = ({
    instance,
    initialState = {},
    intents = [],
    reset,
    liveness,
    safety,
    options
  }, success = () => null, err = () => null) => {
    const {
      beginCheck,
      endCheck
    } = api(instance);
    const {
      depthMax = 5,
      noDuplicateAction = false,
      doNotStartWith = [],
      format
    } = options;
    if (intents.length === 0) {
      intents = intentsFromDomains(instance);
    }
    const [behaviorIntent, formatIntent] = instance({
      component: {
        actions: [__behavior => ({
          __behavior
        }), __setFormatBehavior => ({
          __setFormatBehavior
        })],
        acceptors: [model => ({
          __behavior
        }) => {
          if (__behavior != null) {
            model.__behavior = __behavior;
          }
        }, model => ({
          __setFormatBehavior
        }) => {
          if (__setFormatBehavior != null) {
            model.__formatBehavior = __setFormatBehavior;
          }
        }]
      }
    }).intents;
    formatIntent(format);
    const behavior = [];
    beginCheck(state => {
      if (liveness && liveness(state)) {
        // console.log('check check', state)
        behavior.push({
          liveness: state.__behavior
        });
        success(state.__behavior);
      }
      if (safety && safety(state)) {
        behavior.push({
          safety: state.__behavior
        });
        err(state.__behavior);
      }
    });
    apply(permutations(intents, [], 0, depthMax, noDuplicateAction, doNotStartWith), () => reset(initialState), behaviorIntent);
    endCheck();
    return behavior;
  };

  // ISC License (ISC)
  // Copyright 2019 Jean-Jacques Dubray

  const {
    addInitialState,
    addComponent,
    setRender,
    addSafetyConditions,
    getIntents,
    addAcceptors,
    addReactors,
    addNAPs,
    addHandler
  } = api();
  var index = {
    // Constructors
    SAM,
    createInstance,
    api,
    // SAM Core
    addInitialState,
    addComponent,
    addAcceptors,
    addReactors,
    addNAPs,
    addSafetyConditions,
    getIntents,
    setRender,
    addHandler,
    // Utils
    step,
    doNotRender,
    first,
    match,
    on,
    oneOf,
    utils: {
      O,
      A,
      N,
      NZ,
      S,
      F,
      E,
      or,
      and,
      log
    },
    events: {
      on: events.on,
      off: events.off,
      emit: events.emit
    },
    checker,
    permutations,
    apply,
    Model,
    // v2 strict profile
    SamSchemaError,
    SamShapeError,
    SamValidationError,
    validateProposal,
    checkShapeWrite
  };

  return index;

}));

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/semver/internal/constants.js
var require_constants = __commonJS({
  "node_modules/semver/internal/constants.js"(exports, module) {
    "use strict";
    var SEMVER_SPEC_VERSION = "2.0.0";
    var MAX_LENGTH = 256;
    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
    9007199254740991;
    var MAX_SAFE_COMPONENT_LENGTH = 16;
    var MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
    var RELEASE_TYPES = [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ];
    module.exports = {
      MAX_LENGTH,
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_SAFE_INTEGER,
      RELEASE_TYPES,
      SEMVER_SPEC_VERSION,
      FLAG_INCLUDE_PRERELEASE: 1,
      FLAG_LOOSE: 2
    };
  }
});

// node_modules/semver/internal/debug.js
var require_debug = __commonJS({
  "node_modules/semver/internal/debug.js"(exports, module) {
    "use strict";
    var debug = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
    };
    module.exports = debug;
  }
});

// node_modules/semver/internal/re.js
var require_re = __commonJS({
  "node_modules/semver/internal/re.js"(exports, module) {
    "use strict";
    var {
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_LENGTH
    } = require_constants();
    var debug = require_debug();
    exports = module.exports = {};
    var re = exports.re = [];
    var safeRe = exports.safeRe = [];
    var src = exports.src = [];
    var safeSrc = exports.safeSrc = [];
    var t = exports.t = {};
    var R = 0;
    var LETTERDASHNUMBER = "[a-zA-Z0-9-]";
    var safeRegexReplacements = [
      ["\\s", 1],
      ["\\d", MAX_LENGTH],
      [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
    ];
    var makeSafeRegex = (value) => {
      for (const [token, max] of safeRegexReplacements) {
        value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
      }
      return value;
    };
    var createToken = (name2, value, isGlobal) => {
      const safe = makeSafeRegex(value);
      const index = R++;
      debug(name2, index, value);
      t[name2] = index;
      src[index] = value;
      safeSrc[index] = safe;
      re[index] = new RegExp(value, isGlobal ? "g" : void 0);
      safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
    };
    createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
    createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
    createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`);
    createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIER]})`);
    createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
    createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
    createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
    createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
    createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
    createToken("FULL", `^${src[t.FULLPLAIN]}$`);
    createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
    createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
    createToken("GTLT", "((?:<|>)?=?)");
    createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
    createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
    createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COERCEPLAIN", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
    createToken("COERCE", `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
    createToken("COERCEFULL", src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?(?:${src[t.BUILD]})?(?:$|[^\\d])`);
    createToken("COERCERTL", src[t.COERCE], true);
    createToken("COERCERTLFULL", src[t.COERCEFULL], true);
    createToken("LONETILDE", "(?:~>?)");
    createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
    exports.tildeTrimReplace = "$1~";
    createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
    createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("LONECARET", "(?:\\^)");
    createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
    exports.caretTrimReplace = "$1^";
    createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
    createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
    createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
    createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
    exports.comparatorTrimReplace = "$1$2$3";
    createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
    createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`);
    createToken("STAR", "(<|>)?=?\\s*\\*");
    createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  }
});

// node_modules/semver/internal/parse-options.js
var require_parse_options = __commonJS({
  "node_modules/semver/internal/parse-options.js"(exports, module) {
    "use strict";
    var looseOption = Object.freeze({ loose: true });
    var emptyOpts = Object.freeze({});
    var parseOptions = (options) => {
      if (!options) {
        return emptyOpts;
      }
      if (typeof options !== "object") {
        return looseOption;
      }
      return options;
    };
    module.exports = parseOptions;
  }
});

// node_modules/semver/internal/identifiers.js
var require_identifiers = __commonJS({
  "node_modules/semver/internal/identifiers.js"(exports, module) {
    "use strict";
    var numeric = /^[0-9]+$/;
    var compareIdentifiers = (a, b) => {
      if (typeof a === "number" && typeof b === "number") {
        return a === b ? 0 : a < b ? -1 : 1;
      }
      const anum = numeric.test(a);
      const bnum = numeric.test(b);
      if (anum && bnum) {
        a = +a;
        b = +b;
      }
      return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
    };
    var rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
    module.exports = {
      compareIdentifiers,
      rcompareIdentifiers
    };
  }
});

// node_modules/semver/classes/semver.js
var require_semver = __commonJS({
  "node_modules/semver/classes/semver.js"(exports, module) {
    "use strict";
    var debug = require_debug();
    var { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
    var { safeRe: re, t } = require_re();
    var parseOptions = require_parse_options();
    var { compareIdentifiers } = require_identifiers();
    var isPrereleaseIdentifier = (prerelease, identifier) => {
      const identifiers = identifier.split(".");
      if (identifiers.length > prerelease.length) {
        return false;
      }
      for (let i = 0; i < identifiers.length; i++) {
        if (compareIdentifiers(prerelease[i], identifiers[i]) !== 0) {
          return false;
        }
      }
      return true;
    };
    var SemVer = class _SemVer {
      constructor(version, options) {
        options = parseOptions(options);
        if (version instanceof _SemVer) {
          if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
            return version;
          } else {
            version = version.version;
          }
        } else if (typeof version !== "string") {
          throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
        }
        if (version.length > MAX_LENGTH) {
          throw new TypeError(
            `version is longer than ${MAX_LENGTH} characters`
          );
        }
        debug("SemVer", version, options);
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
        if (!m) {
          throw new TypeError(`Invalid Version: ${version}`);
        }
        this.raw = version;
        this.major = +m[1];
        this.minor = +m[2];
        this.patch = +m[3];
        if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
          throw new TypeError("Invalid major version");
        }
        if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
          throw new TypeError("Invalid minor version");
        }
        if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
          throw new TypeError("Invalid patch version");
        }
        if (!m[4]) {
          this.prerelease = [];
        } else {
          this.prerelease = m[4].split(".").map((id) => {
            if (/^[0-9]+$/.test(id)) {
              const num = +id;
              if (num >= 0 && num < MAX_SAFE_INTEGER) {
                return num;
              }
            }
            return id;
          });
        }
        this.build = m[5] ? m[5].split(".") : [];
        this.format();
      }
      format() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) {
          this.version += `-${this.prerelease.join(".")}`;
        }
        return this.version;
      }
      toString() {
        return this.version;
      }
      compare(other) {
        debug("SemVer.compare", this.version, this.options, other);
        if (!(other instanceof _SemVer)) {
          if (typeof other === "string" && other === this.version) {
            return 0;
          }
          other = new _SemVer(other, this.options);
        }
        if (other.version === this.version) {
          return 0;
        }
        return this.compareMain(other) || this.comparePre(other);
      }
      compareMain(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        if (this.major < other.major) {
          return -1;
        }
        if (this.major > other.major) {
          return 1;
        }
        if (this.minor < other.minor) {
          return -1;
        }
        if (this.minor > other.minor) {
          return 1;
        }
        if (this.patch < other.patch) {
          return -1;
        }
        if (this.patch > other.patch) {
          return 1;
        }
        return 0;
      }
      comparePre(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        if (this.prerelease.length && !other.prerelease.length) {
          return -1;
        } else if (!this.prerelease.length && other.prerelease.length) {
          return 1;
        } else if (!this.prerelease.length && !other.prerelease.length) {
          return 0;
        }
        let i = 0;
        do {
          const a = this.prerelease[i];
          const b = other.prerelease[i];
          debug("prerelease compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      compareBuild(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        let i = 0;
        do {
          const a = this.build[i];
          const b = other.build[i];
          debug("build compare", i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      // preminor will bump the version up to the next minor release, and immediately
      // down to pre-release. premajor and prepatch work the same way.
      inc(release, identifier, identifierBase) {
        if (release.startsWith("pre")) {
          if (!identifier && identifierBase === false) {
            throw new Error("invalid increment argument: identifier is empty");
          }
          if (identifier) {
            const match = `-${identifier}`.match(this.options.loose ? re[t.PRERELEASELOOSE] : re[t.PRERELEASE]);
            if (!match || match[1] !== identifier) {
              throw new Error(`invalid identifier: ${identifier}`);
            }
          }
        }
        switch (release) {
          case "premajor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor = 0;
            this.major++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "preminor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "prepatch":
            this.prerelease.length = 0;
            this.inc("patch", identifier, identifierBase);
            this.inc("pre", identifier, identifierBase);
            break;
          // If the input is a non-prerelease version, this acts the same as
          // prepatch.
          case "prerelease":
            if (this.prerelease.length === 0) {
              this.inc("patch", identifier, identifierBase);
            }
            this.inc("pre", identifier, identifierBase);
            break;
          case "release":
            if (this.prerelease.length === 0) {
              throw new Error(`version ${this.raw} is not a prerelease`);
            }
            this.prerelease.length = 0;
            break;
          case "major":
            if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
              this.major++;
            }
            this.minor = 0;
            this.patch = 0;
            this.prerelease = [];
            break;
          case "minor":
            if (this.patch !== 0 || this.prerelease.length === 0) {
              this.minor++;
            }
            this.patch = 0;
            this.prerelease = [];
            break;
          case "patch":
            if (this.prerelease.length === 0) {
              this.patch++;
            }
            this.prerelease = [];
            break;
          // This probably shouldn't be used publicly.
          // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
          case "pre": {
            const base = Number(identifierBase) ? 1 : 0;
            if (this.prerelease.length === 0) {
              this.prerelease = [base];
            } else {
              let i = this.prerelease.length;
              while (--i >= 0) {
                if (typeof this.prerelease[i] === "number") {
                  this.prerelease[i]++;
                  i = -2;
                }
              }
              if (i === -1) {
                if (identifier === this.prerelease.join(".") && identifierBase === false) {
                  throw new Error("invalid increment argument: identifier already exists");
                }
                this.prerelease.push(base);
              }
            }
            if (identifier) {
              let prerelease = [identifier, base];
              if (identifierBase === false) {
                prerelease = [identifier];
              }
              if (isPrereleaseIdentifier(this.prerelease, identifier)) {
                const prereleaseBase = this.prerelease[identifier.split(".").length];
                if (isNaN(prereleaseBase)) {
                  this.prerelease = prerelease;
                }
              } else {
                this.prerelease = prerelease;
              }
            }
            break;
          }
          default:
            throw new Error(`invalid increment argument: ${release}`);
        }
        this.raw = this.format();
        if (this.build.length) {
          this.raw += `+${this.build.join(".")}`;
        }
        return this;
      }
    };
    module.exports = SemVer;
  }
});

// node_modules/semver/functions/parse.js
var require_parse = __commonJS({
  "node_modules/semver/functions/parse.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var parse = (version, options, throwErrors = false) => {
      if (version instanceof SemVer) {
        return version;
      }
      try {
        return new SemVer(version, options);
      } catch (er) {
        if (!throwErrors) {
          return null;
        }
        throw er;
      }
    };
    module.exports = parse;
  }
});

// node_modules/semver/functions/valid.js
var require_valid = __commonJS({
  "node_modules/semver/functions/valid.js"(exports, module) {
    "use strict";
    var parse = require_parse();
    var valid = (version, options) => {
      const v = parse(version, options);
      return v ? v.version : null;
    };
    module.exports = valid;
  }
});

// node_modules/semver/functions/clean.js
var require_clean = __commonJS({
  "node_modules/semver/functions/clean.js"(exports, module) {
    "use strict";
    var parse = require_parse();
    var clean = (version, options) => {
      const s = parse(version.trim().replace(/^[=v]+/, ""), options);
      return s ? s.version : null;
    };
    module.exports = clean;
  }
});

// node_modules/semver/functions/inc.js
var require_inc = __commonJS({
  "node_modules/semver/functions/inc.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var inc = (version, release, options, identifier, identifierBase) => {
      if (typeof options === "string") {
        identifierBase = identifier;
        identifier = options;
        options = void 0;
      }
      try {
        return new SemVer(
          version instanceof SemVer ? version.version : version,
          options
        ).inc(release, identifier, identifierBase).version;
      } catch (er) {
        return null;
      }
    };
    module.exports = inc;
  }
});

// node_modules/semver/functions/diff.js
var require_diff = __commonJS({
  "node_modules/semver/functions/diff.js"(exports, module) {
    "use strict";
    var parse = require_parse();
    var diff = (version1, version2) => {
      const v1 = parse(version1, null, true);
      const v2 = parse(version2, null, true);
      const comparison = v1.compare(v2);
      if (comparison === 0) {
        return null;
      }
      const v1Higher = comparison > 0;
      const highVersion = v1Higher ? v1 : v2;
      const lowVersion = v1Higher ? v2 : v1;
      const highHasPre = !!highVersion.prerelease.length;
      const lowHasPre = !!lowVersion.prerelease.length;
      if (lowHasPre && !highHasPre) {
        if (!lowVersion.patch && !lowVersion.minor) {
          return "major";
        }
        if (lowVersion.compareMain(highVersion) === 0) {
          if (lowVersion.minor && !lowVersion.patch) {
            return "minor";
          }
          return "patch";
        }
      }
      const prefix = highHasPre ? "pre" : "";
      if (v1.major !== v2.major) {
        return prefix + "major";
      }
      if (v1.minor !== v2.minor) {
        return prefix + "minor";
      }
      if (v1.patch !== v2.patch) {
        return prefix + "patch";
      }
      return "prerelease";
    };
    module.exports = diff;
  }
});

// node_modules/semver/functions/major.js
var require_major = __commonJS({
  "node_modules/semver/functions/major.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var major = (a, loose) => new SemVer(a, loose).major;
    module.exports = major;
  }
});

// node_modules/semver/functions/minor.js
var require_minor = __commonJS({
  "node_modules/semver/functions/minor.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var minor = (a, loose) => new SemVer(a, loose).minor;
    module.exports = minor;
  }
});

// node_modules/semver/functions/patch.js
var require_patch = __commonJS({
  "node_modules/semver/functions/patch.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var patch = (a, loose) => new SemVer(a, loose).patch;
    module.exports = patch;
  }
});

// node_modules/semver/functions/prerelease.js
var require_prerelease = __commonJS({
  "node_modules/semver/functions/prerelease.js"(exports, module) {
    "use strict";
    var parse = require_parse();
    var prerelease = (version, options) => {
      const parsed = parse(version, options);
      return parsed && parsed.prerelease.length ? parsed.prerelease : null;
    };
    module.exports = prerelease;
  }
});

// node_modules/semver/functions/compare.js
var require_compare = __commonJS({
  "node_modules/semver/functions/compare.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var compare = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
    module.exports = compare;
  }
});

// node_modules/semver/functions/rcompare.js
var require_rcompare = __commonJS({
  "node_modules/semver/functions/rcompare.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var rcompare = (a, b, loose) => compare(b, a, loose);
    module.exports = rcompare;
  }
});

// node_modules/semver/functions/compare-loose.js
var require_compare_loose = __commonJS({
  "node_modules/semver/functions/compare-loose.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var compareLoose = (a, b) => compare(a, b, true);
    module.exports = compareLoose;
  }
});

// node_modules/semver/functions/compare-build.js
var require_compare_build = __commonJS({
  "node_modules/semver/functions/compare-build.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var compareBuild = (a, b, loose) => {
      const versionA = new SemVer(a, loose);
      const versionB = new SemVer(b, loose);
      return versionA.compare(versionB) || versionA.compareBuild(versionB);
    };
    module.exports = compareBuild;
  }
});

// node_modules/semver/functions/sort.js
var require_sort = __commonJS({
  "node_modules/semver/functions/sort.js"(exports, module) {
    "use strict";
    var compareBuild = require_compare_build();
    var sort = (list2, loose) => list2.sort((a, b) => compareBuild(a, b, loose));
    module.exports = sort;
  }
});

// node_modules/semver/functions/rsort.js
var require_rsort = __commonJS({
  "node_modules/semver/functions/rsort.js"(exports, module) {
    "use strict";
    var compareBuild = require_compare_build();
    var rsort = (list2, loose) => list2.sort((a, b) => compareBuild(b, a, loose));
    module.exports = rsort;
  }
});

// node_modules/semver/functions/gt.js
var require_gt = __commonJS({
  "node_modules/semver/functions/gt.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var gt = (a, b, loose) => compare(a, b, loose) > 0;
    module.exports = gt;
  }
});

// node_modules/semver/functions/lt.js
var require_lt = __commonJS({
  "node_modules/semver/functions/lt.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var lt = (a, b, loose) => compare(a, b, loose) < 0;
    module.exports = lt;
  }
});

// node_modules/semver/functions/eq.js
var require_eq = __commonJS({
  "node_modules/semver/functions/eq.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var eq = (a, b, loose) => compare(a, b, loose) === 0;
    module.exports = eq;
  }
});

// node_modules/semver/functions/neq.js
var require_neq = __commonJS({
  "node_modules/semver/functions/neq.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var neq = (a, b, loose) => compare(a, b, loose) !== 0;
    module.exports = neq;
  }
});

// node_modules/semver/functions/gte.js
var require_gte = __commonJS({
  "node_modules/semver/functions/gte.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var gte = (a, b, loose) => compare(a, b, loose) >= 0;
    module.exports = gte;
  }
});

// node_modules/semver/functions/lte.js
var require_lte = __commonJS({
  "node_modules/semver/functions/lte.js"(exports, module) {
    "use strict";
    var compare = require_compare();
    var lte = (a, b, loose) => compare(a, b, loose) <= 0;
    module.exports = lte;
  }
});

// node_modules/semver/functions/cmp.js
var require_cmp = __commonJS({
  "node_modules/semver/functions/cmp.js"(exports, module) {
    "use strict";
    var eq = require_eq();
    var neq = require_neq();
    var gt = require_gt();
    var gte = require_gte();
    var lt = require_lt();
    var lte = require_lte();
    var cmp = (a, op, b, loose) => {
      switch (op) {
        case "===":
          if (typeof a === "object") {
            a = a.version;
          }
          if (typeof b === "object") {
            b = b.version;
          }
          return a === b;
        case "!==":
          if (typeof a === "object") {
            a = a.version;
          }
          if (typeof b === "object") {
            b = b.version;
          }
          return a !== b;
        case "":
        case "=":
        case "==":
          return eq(a, b, loose);
        case "!=":
          return neq(a, b, loose);
        case ">":
          return gt(a, b, loose);
        case ">=":
          return gte(a, b, loose);
        case "<":
          return lt(a, b, loose);
        case "<=":
          return lte(a, b, loose);
        default:
          throw new TypeError(`Invalid operator: ${op}`);
      }
    };
    module.exports = cmp;
  }
});

// node_modules/semver/functions/coerce.js
var require_coerce = __commonJS({
  "node_modules/semver/functions/coerce.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var parse = require_parse();
    var { safeRe: re, t } = require_re();
    var coerce = (version, options) => {
      if (version instanceof SemVer) {
        return version;
      }
      if (typeof version === "number") {
        version = String(version);
      }
      if (typeof version !== "string") {
        return null;
      }
      options = options || {};
      let match = null;
      if (!options.rtl) {
        match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
      } else {
        const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
        let next;
        while ((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)) {
          if (!match || next.index + next[0].length !== match.index + match[0].length) {
            match = next;
          }
          coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
        }
        coerceRtlRegex.lastIndex = -1;
      }
      if (match === null) {
        return null;
      }
      const major = match[2];
      const minor = match[3] || "0";
      const patch = match[4] || "0";
      const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : "";
      const build = options.includePrerelease && match[6] ? `+${match[6]}` : "";
      return parse(`${major}.${minor}.${patch}${prerelease}${build}`, options);
    };
    module.exports = coerce;
  }
});

// node_modules/semver/functions/truncate.js
var require_truncate = __commonJS({
  "node_modules/semver/functions/truncate.js"(exports, module) {
    "use strict";
    var parse = require_parse();
    var constants = require_constants();
    var SemVer = require_semver();
    var truncate = (version, truncation, options) => {
      if (!constants.RELEASE_TYPES.includes(truncation)) {
        return null;
      }
      const clonedVersion = cloneInputVersion(version, options);
      return clonedVersion && doTruncation(clonedVersion, truncation);
    };
    var cloneInputVersion = (version, options) => {
      const versionStringToParse = version instanceof SemVer ? version.version : version;
      return parse(versionStringToParse, options);
    };
    var doTruncation = (version, truncation) => {
      if (isPrerelease(truncation)) {
        return version.version;
      }
      version.prerelease = [];
      switch (truncation) {
        case "major":
          version.minor = 0;
          version.patch = 0;
          break;
        case "minor":
          version.patch = 0;
          break;
      }
      return version.format();
    };
    var isPrerelease = (type) => {
      return type.startsWith("pre");
    };
    module.exports = truncate;
  }
});

// node_modules/semver/internal/lrucache.js
var require_lrucache = __commonJS({
  "node_modules/semver/internal/lrucache.js"(exports, module) {
    "use strict";
    var LRUCache = class {
      constructor() {
        this.max = 1e3;
        this.map = /* @__PURE__ */ new Map();
      }
      get(key) {
        const value = this.map.get(key);
        if (value === void 0) {
          return void 0;
        } else {
          this.map.delete(key);
          this.map.set(key, value);
          return value;
        }
      }
      delete(key) {
        return this.map.delete(key);
      }
      set(key, value) {
        const deleted = this.delete(key);
        if (!deleted && value !== void 0) {
          if (this.map.size >= this.max) {
            const firstKey = this.map.keys().next().value;
            this.delete(firstKey);
          }
          this.map.set(key, value);
        }
        return this;
      }
    };
    module.exports = LRUCache;
  }
});

// node_modules/semver/classes/range.js
var require_range = __commonJS({
  "node_modules/semver/classes/range.js"(exports, module) {
    "use strict";
    var SPACE_CHARACTERS = /\s+/g;
    var Range = class _Range {
      constructor(range, options) {
        options = parseOptions(options);
        if (range instanceof _Range) {
          if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
            return range;
          } else {
            return new _Range(range.raw, options);
          }
        }
        if (range instanceof Comparator) {
          this.raw = range.value;
          this.set = [[range]];
          this.formatted = void 0;
          return this;
        }
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        this.raw = range.trim().replace(SPACE_CHARACTERS, " ");
        this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
        if (!this.set.length) {
          throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
        }
        if (this.set.length > 1) {
          const first = this.set[0];
          this.set = this.set.filter((c) => !isNullSet(c[0]));
          if (this.set.length === 0) {
            this.set = [first];
          } else if (this.set.length > 1) {
            for (const c of this.set) {
              if (c.length === 1 && isAny(c[0])) {
                this.set = [c];
                break;
              }
            }
          }
        }
        this.formatted = void 0;
      }
      get range() {
        if (this.formatted === void 0) {
          this.formatted = "";
          for (let i = 0; i < this.set.length; i++) {
            if (i > 0) {
              this.formatted += "||";
            }
            const comps = this.set[i];
            for (let k = 0; k < comps.length; k++) {
              if (k > 0) {
                this.formatted += " ";
              }
              this.formatted += comps[k].toString().trim();
            }
          }
        }
        return this.formatted;
      }
      format() {
        return this.range;
      }
      toString() {
        return this.range;
      }
      parseRange(range) {
        range = range.replace(BUILDSTRIPRE, "");
        const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
        const memoKey = memoOpts + ":" + range;
        const cached = cache.get(memoKey);
        if (cached) {
          return cached;
        }
        const loose = this.options.loose;
        const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
        range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
        debug("hyphen replace", range);
        range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
        debug("comparator trim", range);
        range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
        debug("tilde trim", range);
        range = range.replace(re[t.CARETTRIM], caretTrimReplace);
        debug("caret trim", range);
        let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
        if (loose) {
          rangeList = rangeList.filter((comp) => {
            debug("loose invalid filter", comp, this.options);
            return !!comp.match(re[t.COMPARATORLOOSE]);
          });
        }
        debug("range list", rangeList);
        const rangeMap = /* @__PURE__ */ new Map();
        const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
        for (const comp of comparators) {
          if (isNullSet(comp)) {
            return [comp];
          }
          rangeMap.set(comp.value, comp);
        }
        if (rangeMap.size > 1 && rangeMap.has("")) {
          rangeMap.delete("");
        }
        const result = [...rangeMap.values()];
        cache.set(memoKey, result);
        return result;
      }
      intersects(range, options) {
        if (!(range instanceof _Range)) {
          throw new TypeError("a Range is required");
        }
        return this.set.some((thisComparators) => {
          return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators) => {
            return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options);
              });
            });
          });
        });
      }
      // if ANY of the sets match ALL of its comparators, then pass
      test(version) {
        if (!version) {
          return false;
        }
        if (typeof version === "string") {
          try {
            version = new SemVer(version, this.options);
          } catch (er) {
            return false;
          }
        }
        for (let i = 0; i < this.set.length; i++) {
          if (testSet(this.set[i], version, this.options)) {
            return true;
          }
        }
        return false;
      }
    };
    module.exports = Range;
    var LRU = require_lrucache();
    var cache = new LRU();
    var parseOptions = require_parse_options();
    var Comparator = require_comparator();
    var debug = require_debug();
    var SemVer = require_semver();
    var {
      safeRe: re,
      src,
      t,
      comparatorTrimReplace,
      tildeTrimReplace,
      caretTrimReplace
    } = require_re();
    var { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require_constants();
    var BUILDSTRIPRE = new RegExp(src[t.BUILD], "g");
    var isNullSet = (c) => c.value === "<0.0.0-0";
    var isAny = (c) => c.value === "";
    var isSatisfiable = (comparators, options) => {
      let result = true;
      const remainingComparators = comparators.slice();
      let testComparator = remainingComparators.pop();
      while (result && remainingComparators.length) {
        result = remainingComparators.every((otherComparator) => {
          return testComparator.intersects(otherComparator, options);
        });
        testComparator = remainingComparators.pop();
      }
      return result;
    };
    var parseComparator = (comp, options) => {
      comp = comp.replace(re[t.BUILD], "");
      debug("comp", comp, options);
      comp = replaceCarets(comp, options);
      debug("caret", comp);
      comp = replaceTildes(comp, options);
      debug("tildes", comp);
      comp = replaceXRanges(comp, options);
      debug("xrange", comp);
      comp = replaceStars(comp, options);
      debug("stars", comp);
      return comp;
    };
    var isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
    var invalidXRangeOrder = (M, m, p) => isX(M) && !isX(m) || isX(m) && p && !isX(p);
    var replaceTildes = (comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
    };
    var replaceTilde = (comp, options) => {
      const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
      const z2 = options.includePrerelease ? "-0" : "";
      return comp.replace(r, (_, M, m, p, pr) => {
        debug("tilde", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0${z2} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          ret = `>=${M}.${m}.0${z2} <${M}.${+m + 1}.0-0`;
        } else if (pr) {
          debug("replaceTilde pr", pr);
          ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
        } else {
          ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
        }
        debug("tilde return", ret);
        return ret;
      });
    };
    var replaceCarets = (comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
    };
    var replaceCaret = (comp, options) => {
      debug("caret", comp, options);
      const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
      const z2 = options.includePrerelease ? "-0" : "";
      return comp.replace(r, (_, M, m, p, pr) => {
        debug("caret", comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m)) {
          ret = `>=${M}.0.0${z2} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          if (M === "0") {
            ret = `>=${M}.${m}.0${z2} <${M}.${+m + 1}.0-0`;
          } else {
            ret = `>=${M}.${m}.0${z2} <${+M + 1}.0.0-0`;
          }
        } else if (pr) {
          debug("replaceCaret pr", pr);
          if (M === "0") {
            if (m === "0") {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
          }
        } else {
          debug("no pr");
          if (M === "0") {
            if (m === "0") {
              ret = `>=${M}.${m}.${p} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
          }
        }
        debug("caret return", ret);
        return ret;
      });
    };
    var replaceXRanges = (comp, options) => {
      debug("replaceXRanges", comp, options);
      return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
    };
    var replaceXRange = (comp, options) => {
      comp = comp.trim();
      const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
      return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
        debug("xRange", comp, ret, gtlt, M, m, p, pr);
        if (invalidXRangeOrder(M, m, p)) {
          return comp;
        }
        const xM = isX(M);
        const xm = xM || isX(m);
        const xp = xm || isX(p);
        const anyX = xp;
        if (gtlt === "=" && anyX) {
          gtlt = "";
        }
        pr = options.includePrerelease ? "-0" : "";
        if (xM) {
          if (gtlt === ">" || gtlt === "<") {
            ret = "<0.0.0-0";
          } else {
            ret = "*";
          }
        } else if (gtlt && anyX) {
          if (xm) {
            m = 0;
          }
          p = 0;
          if (gtlt === ">") {
            gtlt = ">=";
            if (xm) {
              M = +M + 1;
              m = 0;
              p = 0;
            } else {
              m = +m + 1;
              p = 0;
            }
          } else if (gtlt === "<=") {
            gtlt = "<";
            if (xm) {
              M = +M + 1;
            } else {
              m = +m + 1;
            }
          }
          if (gtlt === "<") {
            pr = "-0";
          }
          ret = `${gtlt + M}.${m}.${p}${pr}`;
        } else if (xm) {
          ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
        } else if (xp) {
          ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
        }
        debug("xRange return", ret);
        return ret;
      });
    };
    var replaceStars = (comp, options) => {
      debug("replaceStars", comp, options);
      return comp.trim().replace(re[t.STAR], "");
    };
    var replaceGTE0 = (comp, options) => {
      debug("replaceGTE0", comp, options);
      return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
    };
    var hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
      if (isX(fM)) {
        from = "";
      } else if (isX(fm)) {
        from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
      } else if (isX(fp)) {
        from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
      } else if (fpr) {
        from = `>=${from}`;
      } else {
        from = `>=${from}${incPr ? "-0" : ""}`;
      }
      if (isX(tM)) {
        to = "";
      } else if (isX(tm)) {
        to = `<${+tM + 1}.0.0-0`;
      } else if (isX(tp)) {
        to = `<${tM}.${+tm + 1}.0-0`;
      } else if (tpr) {
        to = `<=${tM}.${tm}.${tp}-${tpr}`;
      } else if (incPr) {
        to = `<${tM}.${tm}.${+tp + 1}-0`;
      } else {
        to = `<=${to}`;
      }
      return `${from} ${to}`.trim();
    };
    var testSet = (set, version, options) => {
      for (let i = 0; i < set.length; i++) {
        if (!set[i].test(version)) {
          return false;
        }
      }
      if (version.prerelease.length && !options.includePrerelease) {
        for (let i = 0; i < set.length; i++) {
          debug(set[i].semver);
          if (set[i].semver === Comparator.ANY) {
            continue;
          }
          if (set[i].semver.prerelease.length > 0) {
            const allowed = set[i].semver;
            if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
              return true;
            }
          }
        }
        return false;
      }
      return true;
    };
  }
});

// node_modules/semver/classes/comparator.js
var require_comparator = __commonJS({
  "node_modules/semver/classes/comparator.js"(exports, module) {
    "use strict";
    var ANY = /* @__PURE__ */ Symbol("SemVer ANY");
    var Comparator = class _Comparator {
      static get ANY() {
        return ANY;
      }
      constructor(comp, options) {
        options = parseOptions(options);
        if (comp instanceof _Comparator) {
          if (comp.loose === !!options.loose) {
            return comp;
          } else {
            comp = comp.value;
          }
        }
        comp = comp.trim().split(/\s+/).join(" ");
        debug("comparator", comp, options);
        this.options = options;
        this.loose = !!options.loose;
        this.parse(comp);
        if (this.semver === ANY) {
          this.value = "";
        } else {
          this.value = this.operator + this.semver.version;
        }
        debug("comp", this);
      }
      parse(comp) {
        const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
        const m = comp.match(r);
        if (!m) {
          throw new TypeError(`Invalid comparator: ${comp}`);
        }
        this.operator = m[1] !== void 0 ? m[1] : "";
        if (this.operator === "=") {
          this.operator = "";
        }
        if (!m[2]) {
          this.semver = ANY;
        } else {
          this.semver = new SemVer(m[2], this.options.loose);
        }
      }
      toString() {
        return this.value;
      }
      test(version) {
        debug("Comparator.test", version, this.options.loose);
        if (this.semver === ANY || version === ANY) {
          return true;
        }
        if (typeof version === "string") {
          try {
            version = new SemVer(version, this.options);
          } catch (er) {
            return false;
          }
        }
        return cmp(version, this.operator, this.semver, this.options);
      }
      intersects(comp, options) {
        if (!(comp instanceof _Comparator)) {
          throw new TypeError("a Comparator is required");
        }
        if (this.operator === "") {
          if (this.value === "") {
            return true;
          }
          return new Range(comp.value, options).test(this.value);
        } else if (comp.operator === "") {
          if (comp.value === "") {
            return true;
          }
          return new Range(this.value, options).test(comp.semver);
        }
        options = parseOptions(options);
        if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) {
          return false;
        }
        if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) {
          return false;
        }
        if (this.operator.startsWith(">") && comp.operator.startsWith(">")) {
          return true;
        }
        if (this.operator.startsWith("<") && comp.operator.startsWith("<")) {
          return true;
        }
        if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) {
          return true;
        }
        if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) {
          return true;
        }
        if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) {
          return true;
        }
        return false;
      }
    };
    module.exports = Comparator;
    var parseOptions = require_parse_options();
    var { safeRe: re, t } = require_re();
    var cmp = require_cmp();
    var debug = require_debug();
    var SemVer = require_semver();
    var Range = require_range();
  }
});

// node_modules/semver/functions/satisfies.js
var require_satisfies = __commonJS({
  "node_modules/semver/functions/satisfies.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var satisfies = (version, range, options) => {
      try {
        range = new Range(range, options);
      } catch (er) {
        return false;
      }
      return range.test(version);
    };
    module.exports = satisfies;
  }
});

// node_modules/semver/ranges/to-comparators.js
var require_to_comparators = __commonJS({
  "node_modules/semver/ranges/to-comparators.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var toComparators = (range, options) => new Range(range, options).set.map((comp) => comp.map((c) => c.value).join(" ").trim().split(" "));
    module.exports = toComparators;
  }
});

// node_modules/semver/ranges/max-satisfying.js
var require_max_satisfying = __commonJS({
  "node_modules/semver/ranges/max-satisfying.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var Range = require_range();
    var maxSatisfying = (versions, range, options) => {
      let max = null;
      let maxSV = null;
      let rangeObj = null;
      try {
        rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach((v) => {
        if (rangeObj.test(v)) {
          if (!max || maxSV.compare(v) === -1) {
            max = v;
            maxSV = new SemVer(max, options);
          }
        }
      });
      return max;
    };
    module.exports = maxSatisfying;
  }
});

// node_modules/semver/ranges/min-satisfying.js
var require_min_satisfying = __commonJS({
  "node_modules/semver/ranges/min-satisfying.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var Range = require_range();
    var minSatisfying = (versions, range, options) => {
      let min = null;
      let minSV = null;
      let rangeObj = null;
      try {
        rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach((v) => {
        if (rangeObj.test(v)) {
          if (!min || minSV.compare(v) === 1) {
            min = v;
            minSV = new SemVer(min, options);
          }
        }
      });
      return min;
    };
    module.exports = minSatisfying;
  }
});

// node_modules/semver/ranges/min-version.js
var require_min_version = __commonJS({
  "node_modules/semver/ranges/min-version.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var Range = require_range();
    var gt = require_gt();
    var minVersion = (range, loose) => {
      range = new Range(range, loose);
      let minver = new SemVer("0.0.0");
      if (range.test(minver)) {
        return minver;
      }
      minver = new SemVer("0.0.0-0");
      if (range.test(minver)) {
        return minver;
      }
      minver = null;
      for (let i = 0; i < range.set.length; ++i) {
        const comparators = range.set[i];
        let setMin = null;
        comparators.forEach((comparator) => {
          const compver = new SemVer(comparator.semver.version);
          switch (comparator.operator) {
            case ">":
              if (compver.prerelease.length === 0) {
                compver.patch++;
              } else {
                compver.prerelease.push(0);
              }
              compver.raw = compver.format();
            /* fallthrough */
            case "":
            case ">=":
              if (!setMin || gt(compver, setMin)) {
                setMin = compver;
              }
              break;
            case "<":
            case "<=":
              break;
            /* istanbul ignore next */
            default:
              throw new Error(`Unexpected operation: ${comparator.operator}`);
          }
        });
        if (setMin && (!minver || gt(minver, setMin))) {
          minver = setMin;
        }
      }
      if (minver && range.test(minver)) {
        return minver;
      }
      return null;
    };
    module.exports = minVersion;
  }
});

// node_modules/semver/ranges/valid.js
var require_valid2 = __commonJS({
  "node_modules/semver/ranges/valid.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var validRange = (range, options) => {
      try {
        return new Range(range, options).range || "*";
      } catch (er) {
        return null;
      }
    };
    module.exports = validRange;
  }
});

// node_modules/semver/ranges/outside.js
var require_outside = __commonJS({
  "node_modules/semver/ranges/outside.js"(exports, module) {
    "use strict";
    var SemVer = require_semver();
    var Comparator = require_comparator();
    var { ANY } = Comparator;
    var Range = require_range();
    var satisfies = require_satisfies();
    var gt = require_gt();
    var lt = require_lt();
    var lte = require_lte();
    var gte = require_gte();
    var outside = (version, range, hilo, options) => {
      version = new SemVer(version, options);
      range = new Range(range, options);
      let gtfn, ltefn, ltfn, comp, ecomp;
      switch (hilo) {
        case ">":
          gtfn = gt;
          ltefn = lte;
          ltfn = lt;
          comp = ">";
          ecomp = ">=";
          break;
        case "<":
          gtfn = lt;
          ltefn = gte;
          ltfn = gt;
          comp = "<";
          ecomp = "<=";
          break;
        default:
          throw new TypeError('Must provide a hilo val of "<" or ">"');
      }
      if (satisfies(version, range, options)) {
        return false;
      }
      for (let i = 0; i < range.set.length; ++i) {
        const comparators = range.set[i];
        let high = null;
        let low = null;
        comparators.forEach((comparator) => {
          if (comparator.semver === ANY) {
            comparator = new Comparator(">=0.0.0");
          }
          high = high || comparator;
          low = low || comparator;
          if (gtfn(comparator.semver, high.semver, options)) {
            high = comparator;
          } else if (ltfn(comparator.semver, low.semver, options)) {
            low = comparator;
          }
        });
        if (high.operator === comp || high.operator === ecomp) {
          return false;
        }
        if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
          return false;
        } else if (low.operator === ecomp && ltfn(version, low.semver)) {
          return false;
        }
      }
      return true;
    };
    module.exports = outside;
  }
});

// node_modules/semver/ranges/gtr.js
var require_gtr = __commonJS({
  "node_modules/semver/ranges/gtr.js"(exports, module) {
    "use strict";
    var outside = require_outside();
    var gtr = (version, range, options) => outside(version, range, ">", options);
    module.exports = gtr;
  }
});

// node_modules/semver/ranges/ltr.js
var require_ltr = __commonJS({
  "node_modules/semver/ranges/ltr.js"(exports, module) {
    "use strict";
    var outside = require_outside();
    var ltr = (version, range, options) => outside(version, range, "<", options);
    module.exports = ltr;
  }
});

// node_modules/semver/ranges/intersects.js
var require_intersects = __commonJS({
  "node_modules/semver/ranges/intersects.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var intersects = (r1, r2, options) => {
      r1 = new Range(r1, options);
      r2 = new Range(r2, options);
      return r1.intersects(r2, options);
    };
    module.exports = intersects;
  }
});

// node_modules/semver/ranges/simplify.js
var require_simplify = __commonJS({
  "node_modules/semver/ranges/simplify.js"(exports, module) {
    "use strict";
    var satisfies = require_satisfies();
    var compare = require_compare();
    module.exports = (versions, range, options) => {
      const set = [];
      let first = null;
      let prev = null;
      const v = versions.sort((a, b) => compare(a, b, options));
      for (const version of v) {
        const included = satisfies(version, range, options);
        if (included) {
          prev = version;
          if (!first) {
            first = version;
          }
        } else {
          if (prev) {
            set.push([first, prev]);
          }
          prev = null;
          first = null;
        }
      }
      if (first) {
        set.push([first, null]);
      }
      const ranges = [];
      for (const [min, max] of set) {
        if (min === max) {
          ranges.push(min);
        } else if (!max && min === v[0]) {
          ranges.push("*");
        } else if (!max) {
          ranges.push(`>=${min}`);
        } else if (min === v[0]) {
          ranges.push(`<=${max}`);
        } else {
          ranges.push(`${min} - ${max}`);
        }
      }
      const simplified = ranges.join(" || ");
      const original = typeof range.raw === "string" ? range.raw : String(range);
      return simplified.length < original.length ? simplified : range;
    };
  }
});

// node_modules/semver/ranges/subset.js
var require_subset = __commonJS({
  "node_modules/semver/ranges/subset.js"(exports, module) {
    "use strict";
    var Range = require_range();
    var Comparator = require_comparator();
    var { ANY } = Comparator;
    var satisfies = require_satisfies();
    var compare = require_compare();
    var subset = (sub, dom, options = {}) => {
      if (sub === dom) {
        return true;
      }
      sub = new Range(sub, options);
      dom = new Range(dom, options);
      let sawNonNull = false;
      OUTER: for (const simpleSub of sub.set) {
        for (const simpleDom of dom.set) {
          const isSub = simpleSubset(simpleSub, simpleDom, options);
          sawNonNull = sawNonNull || isSub !== null;
          if (isSub) {
            continue OUTER;
          }
        }
        if (sawNonNull) {
          return false;
        }
      }
      return true;
    };
    var minimumVersionWithPreRelease = [new Comparator(">=0.0.0-0")];
    var minimumVersion = [new Comparator(">=0.0.0")];
    var simpleSubset = (sub, dom, options) => {
      if (sub === dom) {
        return true;
      }
      if (sub.length === 1 && sub[0].semver === ANY) {
        if (dom.length === 1 && dom[0].semver === ANY) {
          return true;
        } else if (options.includePrerelease) {
          sub = minimumVersionWithPreRelease;
        } else {
          sub = minimumVersion;
        }
      }
      if (dom.length === 1 && dom[0].semver === ANY) {
        if (options.includePrerelease) {
          return true;
        } else {
          dom = minimumVersion;
        }
      }
      const eqSet = /* @__PURE__ */ new Set();
      let gt, lt;
      for (const c of sub) {
        if (c.operator === ">" || c.operator === ">=") {
          gt = higherGT(gt, c, options);
        } else if (c.operator === "<" || c.operator === "<=") {
          lt = lowerLT(lt, c, options);
        } else {
          eqSet.add(c.semver);
        }
      }
      if (eqSet.size > 1) {
        return null;
      }
      let gtltComp;
      if (gt && lt) {
        gtltComp = compare(gt.semver, lt.semver, options);
        if (gtltComp > 0) {
          return null;
        } else if (gtltComp === 0 && (gt.operator !== ">=" || lt.operator !== "<=")) {
          return null;
        }
      }
      for (const eq of eqSet) {
        if (gt && !satisfies(eq, String(gt), options)) {
          return null;
        }
        if (lt && !satisfies(eq, String(lt), options)) {
          return null;
        }
        for (const c of dom) {
          if (!satisfies(eq, String(c), options)) {
            return false;
          }
        }
        return true;
      }
      let higher, lower;
      let hasDomLT, hasDomGT;
      let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
      let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
      if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === "<" && needDomLTPre.prerelease[0] === 0) {
        needDomLTPre = false;
      }
      for (const c of dom) {
        hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
        hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
        if (gt) {
          if (needDomGTPre) {
            if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) {
              needDomGTPre = false;
            }
          }
          if (c.operator === ">" || c.operator === ">=") {
            higher = higherGT(gt, c, options);
            if (higher === c && higher !== gt) {
              return false;
            }
          } else if (gt.operator === ">=" && !c.test(gt.semver)) {
            return false;
          }
        }
        if (lt) {
          if (needDomLTPre) {
            if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) {
              needDomLTPre = false;
            }
          }
          if (c.operator === "<" || c.operator === "<=") {
            lower = lowerLT(lt, c, options);
            if (lower === c && lower !== lt) {
              return false;
            }
          } else if (lt.operator === "<=" && !c.test(lt.semver)) {
            return false;
          }
        }
        if (!c.operator && (lt || gt) && gtltComp !== 0) {
          return false;
        }
      }
      if (gt && hasDomLT && !lt && gtltComp !== 0) {
        return false;
      }
      if (lt && hasDomGT && !gt && gtltComp !== 0) {
        return false;
      }
      if (needDomGTPre || needDomLTPre) {
        return false;
      }
      return true;
    };
    var higherGT = (a, b, options) => {
      if (!a) {
        return b;
      }
      const comp = compare(a.semver, b.semver, options);
      return comp > 0 ? a : comp < 0 ? b : b.operator === ">" && a.operator === ">=" ? b : a;
    };
    var lowerLT = (a, b, options) => {
      if (!a) {
        return b;
      }
      const comp = compare(a.semver, b.semver, options);
      return comp < 0 ? a : comp > 0 ? b : b.operator === "<" && a.operator === "<=" ? b : a;
    };
    module.exports = subset;
  }
});

// node_modules/semver/index.js
var require_semver2 = __commonJS({
  "node_modules/semver/index.js"(exports, module) {
    "use strict";
    var internalRe = require_re();
    var constants = require_constants();
    var SemVer = require_semver();
    var identifiers = require_identifiers();
    var parse = require_parse();
    var valid = require_valid();
    var clean = require_clean();
    var inc = require_inc();
    var diff = require_diff();
    var major = require_major();
    var minor = require_minor();
    var patch = require_patch();
    var prerelease = require_prerelease();
    var compare = require_compare();
    var rcompare = require_rcompare();
    var compareLoose = require_compare_loose();
    var compareBuild = require_compare_build();
    var sort = require_sort();
    var rsort = require_rsort();
    var gt = require_gt();
    var lt = require_lt();
    var eq = require_eq();
    var neq = require_neq();
    var gte = require_gte();
    var lte = require_lte();
    var cmp = require_cmp();
    var coerce = require_coerce();
    var truncate = require_truncate();
    var Comparator = require_comparator();
    var Range = require_range();
    var satisfies = require_satisfies();
    var toComparators = require_to_comparators();
    var maxSatisfying = require_max_satisfying();
    var minSatisfying = require_min_satisfying();
    var minVersion = require_min_version();
    var validRange = require_valid2();
    var outside = require_outside();
    var gtr = require_gtr();
    var ltr = require_ltr();
    var intersects = require_intersects();
    var simplifyRange = require_simplify();
    var subset = require_subset();
    module.exports = {
      parse,
      valid,
      clean,
      inc,
      diff,
      major,
      minor,
      patch,
      prerelease,
      compare,
      rcompare,
      compareLoose,
      compareBuild,
      sort,
      rsort,
      gt,
      lt,
      eq,
      neq,
      gte,
      lte,
      cmp,
      coerce,
      truncate,
      Comparator,
      Range,
      satisfies,
      toComparators,
      maxSatisfying,
      minSatisfying,
      minVersion,
      validRange,
      outside,
      gtr,
      ltr,
      intersects,
      simplifyRange,
      subset,
      SemVer,
      re: internalRe.re,
      src: internalRe.src,
      tokens: internalRe.t,
      SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
      RELEASE_TYPES: constants.RELEASE_TYPES,
      compareIdentifiers: identifiers.compareIdentifiers,
      rcompareIdentifiers: identifiers.rcompareIdentifiers
    };
  }
});

// src/index.ts
import z from "@deepseek-ai/schemastery";
import { WebError } from "@deepseek-ai/dsh-web";

// src/catalog.ts
var NS = "dsh-search-providers";
var CAPABILITIES = ["news", "papers", "code", "people", "companies", "images", "videos", "extract", "map", "x"];
var PROVIDERS = [
  { id: "keenable", label: "Keenable", env: "KEENABLE_API_KEY", keyOptional: true, capabilities: ["extract"] },
  { id: "nimble", label: "Nimble", env: "NIMBLE_API_KEY", capabilities: ["news", "papers", "code", "extract", "map"] },
  { id: "tinyfish", label: "TinyFish", env: "TINYFISH_API_KEY", capabilities: ["news", "papers", "extract"] },
  { id: "parallel", label: "Parallel", env: "PARALLEL_API_KEY", capabilities: ["extract"] },
  { id: "exa", label: "Exa", env: "EXA_API_KEY", capabilities: ["news", "papers", "people", "companies", "extract"] },
  { id: "brave", label: "Brave", env: "BRAVE_API_KEY", capabilities: ["news", "images", "videos"] },
  { id: "perplexity", label: "Perplexity", env: "PERPLEXITY_API_KEY", capabilities: ["people"] },
  { id: "fxtwitter", label: "FxTwitter", keyOptional: true, webSearch: false, capabilities: ["x"] }
];
function providerOf(id) {
  const provider = PROVIDERS.find((row) => row.id === id);
  if (!provider) throw new SearchError("invalid-request", "Unknown search provider");
  return provider;
}
var providerRoute = (id) => `${NS}-${id}`;
function capabilityOf(value) {
  const capability = CAPABILITIES.find((id) => id === value);
  if (!capability) throw new SearchError("invalid-request", "Unknown search capability");
  return capability;
}
var SearchError = class extends Error {
  code;
  status;
  constructor(code, message, status) {
    super(message);
    this.code = code;
    this.status = status;
  }
};
function object(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new SearchError("invalid-response", "Expected an object");
  return value;
}
function validateSettings(settings) {
  for (const [id, profile] of Object.entries(settings.providers)) {
    providerOf(id);
    if (profile.enabled !== void 0 && typeof profile.enabled !== "boolean") throw new SearchError("invalid-request", "Invalid provider state");
  }
  for (const [id, profile] of Object.entries(settings.tools)) {
    const feature = capabilityOf(id), provider = providerOf(profile.provider);
    if (typeof profile.enabled !== "boolean" || !provider.capabilities.includes(feature)) throw new SearchError("invalid-request", "Unsupported capability");
  }
}

// src/http.ts
function httpUrl(value) {
  if (typeof value !== "string" || value.length > 8192) throw new SearchError("invalid-request", "Invalid URL");
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new SearchError("invalid-request", "Invalid URL");
  }
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) throw new SearchError("invalid-request", "Expected an HTTP URL without credentials");
  return url.href;
}
function publicUrl(value) {
  const parsed = new URL(httpUrl(value)), host = parsed.hostname.toLowerCase().replace(/\.$/, "");
  if (!host.includes(".") || [".local", ".localhost", ".internal", ".lan", ".home"].some((suffix) => host.endsWith(suffix)) || host === "localhost" || host.includes(":") || /^(?:0|10|127)\./.test(host) || /^169\.254\./.test(host) || /^192\.168\./.test(host) || /^172\.(?:1[6-9]|2\d|3[01])\./.test(host) || /^100\.(?:6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(host) || /^198\.(?:18|19)\./.test(host) || /^(?:22[4-9]|23\d|24\d|25[0-5])\./.test(host)) throw new SearchError("blocked-url", "Expected a public web URL");
  return parsed.href;
}
var MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
async function jsonRequest(transport, url, init, signal) {
  const deadline = AbortSignal.timeout(45e3);
  const combined = signal ? AbortSignal.any([signal, deadline]) : deadline;
  combined.throwIfAborted();
  const response = await transport(url, { ...init, redirect: "error", signal: combined });
  if (!response.ok) {
    await response.body?.cancel();
    throw new SearchError(response.status === 429 ? "rate-limited" : response.status === 401 || response.status === 403 ? "authentication-failed" : "provider-failed", `Search API returned HTTP ${response.status}`, response.status);
  }
  if (!response.body) throw new SearchError("invalid-response", "Empty API response");
  const reader = response.body.getReader(), chunks = [];
  let length = 0;
  try {
    while (true) {
      combined.throwIfAborted();
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > MAX_RESPONSE_BYTES) throw new SearchError("response-too-large", "Search API response exceeds the size limit");
      chunks.push(value);
    }
  } catch (error) {
    await reader.cancel().catch(() => {
    });
    throw error;
  } finally {
    reader.releaseLock();
  }
  combined.throwIfAborted();
  try {
    return object(JSON.parse(Buffer.concat(chunks).toString("utf8")));
  } catch (error) {
    if (error instanceof SearchError) throw error;
    throw new SearchError("invalid-response", "Invalid JSON response");
  }
}
var RequestGate = class {
  active = 0;
  queue = [];
  constructor(limit = 4) {
    if (!Number.isSafeInteger(limit) || limit < 1) throw new Error("Invalid request concurrency limit");
    this.limit = limit;
  }
  limit;
  async run(operation, signal) {
    signal?.throwIfAborted();
    if (this.active >= this.limit) await new Promise((resolve2, reject) => {
      const ticket = { resolve: resolve2, ...signal ? { signal } : {}, abort: () => {
        const index = this.queue.indexOf(ticket);
        if (index !== -1) this.queue.splice(index, 1);
        reject(signal?.reason);
      } };
      this.queue.push(ticket);
      signal?.addEventListener("abort", ticket.abort, { once: true });
    });
    else this.active++;
    try {
      signal?.throwIfAborted();
      return await operation();
    } finally {
      const next = this.queue.shift();
      if (next) {
        next.signal?.removeEventListener("abort", next.abort);
        next.resolve();
      } else this.active--;
    }
  }
};

// src/fxtwitter.ts
var HOSTS = /* @__PURE__ */ new Set(["x.com", "twitter.com", "mobile.twitter.com", "fxtwitter.com", "fixupx.com"]);
function xPostId(query) {
  if (!/^https?:\/\//i.test(query)) return void 0;
  const url = new URL(httpUrl(query));
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  const match = /^\/(?:[a-zA-Z0-9_]{1,15}|i\/web)\/status\/(\d{1,30})(?:\/(?:photo|video)\/\d+)?\/?$/.exec(url.pathname);
  if (!HOSTS.has(host) || !match) throw new SearchError("invalid-request", "Expected an X post URL or search keywords");
  return match[1];
}
function xSources(rows, limit, hasMore = false) {
  const sources = [], seen = /* @__PURE__ */ new Set();
  let truncated = hasMore || rows.length > limit;
  for (const raw of rows) {
    const row = object(raw);
    if (row.type === "tombstone") {
      truncated = true;
      continue;
    }
    if (row.type !== "status" || typeof row.id !== "string" || !/^\d{1,30}$/.test(row.id) || typeof row.text !== "string") throw new SearchError("invalid-response", "FxTwitter returned an invalid post");
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    const author = row.author === void 0 || row.author === null ? {} : object(row.author);
    const handle = typeof author.screen_name === "string" && /^[a-zA-Z0-9_]{1,15}$/.test(author.screen_name) ? author.screen_name : void 0;
    const source = { url: `https://x.com/${handle ?? "i"}/status/${row.id}`, snippet: row.text.slice(0, 6e3) };
    truncated ||= row.text.length > 6e3;
    if (typeof author.name === "string" && author.name) source.author = author.name.slice(0, 200);
    if (handle) source.authorHandle = handle;
    if (source.author || handle) source.title = [source.author, handle ? `(@${handle})` : void 0].filter(Boolean).join(" ");
    if (typeof row.created_at === "string" && Number.isFinite(Date.parse(row.created_at))) source.publishedAt = new Date(row.created_at).toISOString();
    for (const key of ["likes", "reposts", "replies", "views"]) {
      const value = row[key];
      if (typeof value === "number" && Number.isSafeInteger(value) && value >= 0) source[key] = value;
    }
    sources.push(source);
  }
  return { sources: sources.slice(0, limit), truncated };
}

// src/adapters.ts
var SNIPPET_LIMIT = 6e3;
var TEXT_LIMIT = 1e5;
function list(value) {
  if (!Array.isArray(value)) throw new SearchError("invalid-response", "Missing API results");
  return value;
}
function text(value) {
  return typeof value === "string" ? value : void 0;
}
function excerpts(value) {
  return Array.isArray(value) ? value.filter((v) => typeof v === "string").join("\n\n") : void 0;
}
function normalized(rows, limit, id, capability) {
  const sources = [], seen = /* @__PURE__ */ new Set();
  let truncated = rows.length > limit;
  for (const value of rows) {
    const row = object(value);
    let url;
    try {
      url = httpUrl(row.url);
    } catch {
      truncated = true;
      continue;
    }
    if (seen.has(url)) continue;
    seen.add(url);
    const source = { url };
    if (typeof row.title === "string") source.title = row.title.slice(0, 1e3);
    const snippet = id === "parallel" ? excerpts(row.excerpts) : id === "exa" ? excerpts(row.highlights) : text(row.snippet) ?? text(row.description);
    if (snippet) {
      source.snippet = snippet.slice(0, SNIPPET_LIMIT);
      truncated ||= snippet.length > SNIPPET_LIMIT;
    }
    const published = id === "nimble" ? void 0 : text(row.publishedDate) ?? text(row.published_at) ?? text(row.publish_date) ?? text(row.date);
    if (published) source.publishedAt = published.slice(0, 100);
    if (capability === "papers") {
      if (Array.isArray(row.authors)) source.authors = row.authors.filter((v) => typeof v === "string").slice(0, 50).map((author) => author.slice(0, 200));
      if (typeof row.year === "number" && Number.isInteger(row.year)) source.year = row.year;
      if (typeof row.venue === "string") source.venue = row.venue.slice(0, 1e3);
      if (typeof row.doi === "string") source.doi = row.doi.slice(0, 1e3);
    }
    if (capability === "images") {
      const properties = row.properties === void 0 ? {} : object(row.properties);
      if (typeof properties.url === "string") {
        try {
          source.mediaUrl = httpUrl(properties.url);
        } catch {
        }
      }
    }
    sources.push(source);
  }
  return { sources: sources.slice(0, limit), truncated };
}
var SearchAdapter = class {
  gate = new RequestGate();
  transport;
  options;
  lifetime = new AbortController();
  constructor(options) {
    this.options = options;
    this.transport = options.transport ?? fetch;
  }
  available() {
    return !this.lifetime.signal.aborted && this.options.enabled();
  }
  dispose() {
    this.lifetime.abort(new SearchError("unavailable", "Search plugin unloaded"));
  }
  async headers() {
    if (!this.available()) throw new SearchError("provider-disabled", `${providerOf(this.options.id).label} is disabled`);
    if (this.options.id === "fxtwitter") return { accept: "application/json" };
    const key = await this.options.resolveKey();
    if (!key && !providerOf(this.options.id).keyOptional) throw new SearchError("missing-key", `No API key for ${providerOf(this.options.id).label}`);
    const headers = { "content-type": "application/json", accept: "application/json" };
    if (this.options.id === "keenable") {
      headers["X-Keenable-Title"] = "DSH Search Providers";
      if (key) headers["X-API-Key"] = key;
    } else if (this.options.id === "brave") headers["X-Subscription-Token"] = key;
    else if (this.options.id === "tinyfish" || this.options.id === "parallel" || this.options.id === "exa") headers["x-api-key"] = key;
    else headers.authorization = `Bearer ${key}`;
    return headers;
  }
  async request(url, body, signal) {
    const combined = signal ? AbortSignal.any([signal, this.lifetime.signal]) : this.lifetime.signal;
    return this.gate.run(async () => {
      const headers = await this.headers();
      if (this.options.id === "keenable" && !headers["X-API-Key"]) {
        const endpoint = new URL(url);
        endpoint.pathname += "/public";
        url = endpoint;
      }
      try {
        return await jsonRequest(this.transport, url, { headers, method: body ? "POST" : "GET", ...body ? { body: JSON.stringify(body) } : {} }, combined);
      } catch (error) {
        if (combined.aborted || error instanceof SearchError) throw error;
        throw new SearchError("provider-failed", "Search API request failed");
      }
    }, combined);
  }
  async search(request, signal, capability) {
    const { query } = request, limit = request.maxResults ?? 8, id = this.options.id;
    if (providerOf(id).webSearch === false) throw new SearchError("unsupported-capability", "This provider does not support web search");
    if (typeof query !== "string" || !query.trim() || query.length > (id === "brave" ? 600 : 2e3) || !Number.isSafeInteger(limit) || limit < 1 || limit > 100) throw new SearchError("invalid-request", "Invalid search query or result limit");
    if (capability && !providerOf(id).capabilities.includes(capability)) throw new SearchError("unsupported-capability", "This provider does not support the selected capability");
    let response;
    switch (id) {
      case "keenable":
        response = await this.request("https://api.keenable.ai/v1/search", { query, max_results: Math.min(limit, 50) }, signal);
        break;
      case "nimble":
        response = await this.request("https://sdk.nimbleway.com/v2/search", {
          query,
          max_results: limit,
          search_depth: "lite",
          full_content: false,
          focus: capability === "news" ? "news" : capability === "papers" ? "academic" : capability === "code" ? "coding" : "general"
        }, signal);
        break;
      case "tinyfish": {
        const url = new URL("https://api.search.tinyfish.ai");
        url.searchParams.set("query", query);
        url.searchParams.set("domain_type", capability === "news" ? "news" : capability === "papers" ? "research_paper" : "web");
        response = await this.request(url, void 0, signal);
        break;
      }
      case "parallel":
        response = await this.request("https://api.parallel.ai/v1/search", { search_queries: [query], mode: "fast", advanced_settings: { max_results: Math.min(limit, 20) } }, signal);
        break;
      case "exa":
        response = await this.request("https://api.exa.ai/search", {
          query,
          type: "auto",
          numResults: limit,
          contents: { highlights: true },
          ...capability ? { category: capability === "papers" ? "publication" : capability === "companies" ? "company" : capability } : {}
        }, signal);
        break;
      case "brave": {
        const vertical = capability === "images" ? "images" : capability === "videos" ? "videos" : capability === "news" ? "news" : "web";
        const url = new URL(`https://api.search.brave.com/res/v1/${vertical}/search`);
        url.searchParams.set("q", query);
        url.searchParams.set("count", String(Math.min(limit, vertical === "web" ? 20 : 50)));
        response = await this.request(url, void 0, signal);
        if (vertical === "web") response = object(response.web);
        break;
      }
      case "perplexity":
        response = await this.request("https://api.perplexity.ai/search", { query, search_type: capability === "people" ? "people" : "web", max_results: Math.min(limit, 20) }, signal);
        break;
      case "fxtwitter":
        throw new SearchError("unsupported-capability", "Use x_search for FxTwitter");
    }
    return normalized(list(response.results), limit, id, capability);
  }
  async xSearch(request, signal) {
    if (this.options.id !== "fxtwitter") throw new SearchError("unsupported-capability", "This provider does not support X search");
    const { query } = request, limit = request.maxResults ?? 8, sort = request.sort ?? "latest";
    if (typeof query !== "string" || !query.trim() || query.length > 8192 || !["latest", "top"].includes(sort) || !Number.isSafeInteger(limit) || limit < 1 || limit > 100) throw new SearchError("invalid-request", "Invalid X search query, order, or result limit");
    const id = xPostId(query.trim());
    const endpoint = new URL(id ? `https://api.fxtwitter.com/2/status/${id}` : "https://api.fxtwitter.com/2/search");
    if (!id) {
      if (query.trim().length > 512) throw new SearchError("invalid-request", "X search queries must be at most 512 characters");
      endpoint.searchParams.set("q", query.trim());
      endpoint.searchParams.set("feed", sort);
      endpoint.searchParams.set("count", String(limit));
    }
    let response;
    try {
      response = await this.request(endpoint, void 0, signal);
    } catch (error) {
      if (error instanceof SearchError && error.status === 404) throw new SearchError(id ? "x-post-unavailable" : "x-search-unavailable", id ? "FxTwitter could not retrieve this post" : "FxTwitter could not retrieve search results; it does not distinguish no matches from unavailable search", 404);
      throw error;
    }
    if (response.code !== 200) {
      if (response.code === 404) throw new SearchError(id ? "x-post-unavailable" : "x-search-unavailable", id ? "FxTwitter could not retrieve this post" : "FxTwitter could not retrieve search results; it does not distinguish no matches from unavailable search", 404);
      throw new SearchError("provider-failed", "FxTwitter returned an unsuccessful response");
    }
    if (id) {
      if (response.status === null) throw new SearchError("x-post-unavailable", "FxTwitter could not retrieve this post");
      const post = object(response.status);
      if (post.type === "tombstone") throw new SearchError("x-post-unavailable", "FxTwitter could not retrieve this post");
      if (post.id !== id) throw new SearchError("invalid-response", "FxTwitter returned a different post");
      return xSources([post], 1);
    }
    const cursor = response.cursor === void 0 || response.cursor === null ? {} : object(response.cursor);
    return xSources(list(response.results), limit, typeof cursor.bottom === "string" && cursor.bottom.length > 0);
  }
  async extract(input, signal) {
    const url = publicUrl(input), id = this.options.id;
    if (!providerOf(id).capabilities.includes("extract")) throw new SearchError("unsupported-capability", "This provider does not support extraction");
    let response, row, content;
    switch (id) {
      case "keenable": {
        const endpoint = new URL("https://api.keenable.ai/v1/fetch");
        endpoint.searchParams.set("url", url);
        endpoint.searchParams.set("live", "true");
        endpoint.searchParams.set("max_chars", String(TEXT_LIMIT + 1));
        response = await this.request(endpoint, void 0, signal);
        row = response;
        content = row.content;
        break;
      }
      case "nimble":
        response = await this.request("https://sdk.nimbleway.com/v2/extract", { url, formats: ["markdown"], request_timeout: 4e4 }, signal);
        row = response;
        if (typeof row.status_code !== "number" || row.status_code < 200 || row.status_code >= 300) throw new SearchError("extract-failed", "The requested page could not be retrieved");
        content = object(row.data).markdown;
        break;
      case "tinyfish":
        response = await this.request("https://api.fetch.tinyfish.ai", { urls: [url], format: "markdown", per_url_timeout_ms: 4e4 }, signal);
        row = object(list(response.results)[0]);
        content = row.text;
        break;
      case "parallel":
        response = await this.request("https://api.parallel.ai/v1/extract", { urls: [url], advanced_settings: { full_content: { max_chars_per_result: TEXT_LIMIT + 1 } } }, signal);
        row = object(list(response.results)[0]);
        content = row.full_content;
        break;
      case "exa":
        response = await this.request("https://api.exa.ai/contents", { ids: [url], text: { maxCharacters: TEXT_LIMIT + 1 } }, signal);
        row = object(list(response.results)[0]);
        content = row.text;
        break;
      default:
        throw new SearchError("unsupported-capability", "This provider does not support extraction");
    }
    if (typeof content !== "string") throw new SearchError("extract-failed", "The API did not return page text");
    const result = { url: httpUrl(row.final_url ?? row.url ?? url), content: content.slice(0, TEXT_LIMIT), truncated: content.length > TEXT_LIMIT };
    if (typeof row.title === "string") result.title = row.title.slice(0, 1e3);
    return result;
  }
  async map(input, signal) {
    if (this.options.id !== "nimble") throw new SearchError("unsupported-capability", "This provider does not support site mapping");
    const url = publicUrl(input);
    const response = await this.request("https://sdk.nimbleway.com/v2/map", { url, domain_filter: "domain", limit: 50 }, signal);
    return normalized(list(response.links), 50, "nimble");
  }
};

// src/search-fallback.ts
function quotaLimited(error) {
  return error instanceof SearchError && error.code === "rate-limited";
}
function skipFallback(error) {
  return error instanceof SearchError && (error.code === "missing-key" || error.code === "provider-disabled" || error.code === "authentication-failed" || quotaLimited(error));
}
async function searchWithFallback(options) {
  const { primary, adapters, request, signal, capability } = options;
  const primaryAdapter = adapters.get(primary);
  if (!primaryAdapter) throw new SearchError("invalid-request", "Unknown search provider");
  let primaryError;
  try {
    return await primaryAdapter.search(request, signal, capability);
  } catch (error) {
    if (signal?.aborted || !quotaLimited(error)) throw error;
    primaryError = error;
  }
  for (const row of PROVIDERS) {
    const provider = providerOf(row.id);
    if (provider.id === primary || provider.webSearch === false) continue;
    if (capability && !provider.capabilities.includes(capability)) continue;
    const adapter = adapters.get(provider.id);
    if (!adapter?.available()) continue;
    try {
      return await adapter.search(request, signal, capability);
    } catch (error) {
      if (signal?.aborted || !skipFallback(error)) throw error;
    }
  }
  throw primaryError;
}

// src/broker.ts
import { credentialKey, credentialRef } from "@deepseek-ai/dsh-credentials";
import { createHash } from "node:crypto";
var fingerprint = (config) => createHash("sha256").update(JSON.stringify(config)).digest("hex");
var SearchBroker = class {
  ctx;
  constructor(ctx) {
    this.ctx = ctx;
  }
  section() {
    const section = this.ctx.settings.describe({ redactSecrets: true }).find((row) => row.ns === NS);
    if (!section) throw new SearchError("unavailable", "Search settings are unavailable");
    return section;
  }
  webEntry() {
    const entry = this.ctx.configEditor.entries().find((row) => row.options.id === "web" && row.options.name === "@deepseek-ai/dsh-web");
    if (!entry) throw new SearchError("unavailable", "The standard web service is unavailable");
    return entry;
  }
  async key(id) {
    const env = providerOf(id).env;
    if (!env) return void 0;
    const saved = await this.ctx.credentials.readRecord(credentialKey(NS, id));
    if (saved?.kind === "api-key" && saved.key) return saved.key;
    return (await this.ctx.credentials.resolve(credentialRef(env)))?.value;
  }
  async credential(id) {
    const env = providerOf(id).env;
    if (!env) return { configured: false, writable: false };
    const saved = await this.ctx.credentials.describeRecord(credentialKey(NS, id));
    const ambient = await this.ctx.credentials.describe(credentialRef(env));
    return {
      configured: saved.configured || ambient.configured,
      writable: saved.writable,
      ...saved.configured ? { source: "saved" } : ambient.configured ? { source: env } : {}
    };
  }
  async snapshot() {
    const section = this.section(), value = object(section.value), providers = object(value.providers ?? {}), config = this.webEntry().options.config ?? {};
    const searchProvider = typeof config.searchProvider === "string" ? config.searchProvider : process.env.DSH_WEB_SEARCH_PROVIDER ?? "deepseek-official";
    return {
      revision: section.revision,
      searchProvider,
      searchRevision: fingerprint(config),
      nativeSearchProvider: typeof value.nativeSearchProvider === "string" ? value.nativeSearchProvider : "deepseek-official",
      tools: value.tools,
      entries: await Promise.all(PROVIDERS.map(async (row) => {
        const provider = providerOf(row.id);
        return {
          ...provider,
          keyOptional: !!provider.keyOptional,
          supportsKeys: !!provider.env,
          webSearch: provider.webSearch !== false,
          enabled: Object.hasOwn(providers, row.id) && object(providers[row.id]).enabled === true,
          ...await this.credential(row.id)
        };
      }))
    };
  }
  checkRevision(revision) {
    if (!Number.isSafeInteger(revision)) throw new SearchError("invalid-request", "Invalid settings revision");
    const current = this.section().revision;
    if (revision !== current) throw new SearchError("settings-changed", "Settings changed in another window");
    return current;
  }
  async dispatch(method, payload) {
    const data = object(payload);
    if (method === "list") return this.snapshot();
    const id = method === "default" && data.provider === "native" ? void 0 : providerOf(data.provider).id;
    if (method === "save-key") {
      if (!id || !providerOf(id).env || typeof data.key !== "string" || !data.key.trim() || data.key.length > 16384 || /[\r\n]/.test(data.key)) throw new SearchError("invalid-request", "Invalid API key");
      const key = data.key.trim();
      await this.ctx.credentials.modifyRecord(credentialKey(NS, id), async () => ({ kind: "api-key", key }));
      return { saved: true };
    }
    if (method === "delete-key") {
      if (!id || !providerOf(id).env) throw new SearchError("invalid-request", "Invalid provider");
      await this.ctx.credentials.deleteRecord(credentialKey(NS, id));
      return { saved: true };
    }
    const revision = this.checkRevision(data.revision);
    if (method === "provider") {
      if (!id || typeof data.enabled !== "boolean") throw new SearchError("invalid-request", "Invalid provider state");
      if (data.enabled && !providerOf(id).keyOptional && !(await this.credential(id)).configured) throw new SearchError("missing-key", "Save an API key first");
      await this.ctx.settings.update(NS, { providers: { [id]: { enabled: data.enabled } } }, revision);
    } else if (method === "tool") {
      const capability = capabilityOf(data.capability);
      if (!id || typeof data.enabled !== "boolean" || !providerOf(id).capabilities.includes(capability)) throw new SearchError("invalid-request", "Unsupported capability");
      const snapshot = await this.snapshot(), entry = snapshot.entries.find((row) => row.id === id);
      if (data.enabled && !entry.enabled) throw new SearchError("provider-disabled", "Enable the provider first");
      if (!data.enabled && snapshot.tools[capability]?.provider !== id) throw new SearchError("settings-changed", "Another provider supplies this capability");
      await this.ctx.settings.update(NS, { tools: { [capability]: { provider: id, enabled: data.enabled } } }, revision);
    } else if (method === "default") {
      if (id && providerOf(id).webSearch === false) throw new SearchError("invalid-request", "This provider only supplies additional tools");
      const snapshot = await this.snapshot(), entry = this.webEntry();
      if (typeof data.searchRevision !== "string" || snapshot.searchRevision !== data.searchRevision) throw new SearchError("settings-changed", "The search provider changed");
      if (id && !snapshot.entries.find((row) => row.id === id)?.enabled) throw new SearchError("provider-disabled", "Enable the provider first");
      let native = snapshot.nativeSearchProvider;
      if (!snapshot.searchProvider.startsWith(`${NS}-`)) {
        native = snapshot.searchProvider;
        await this.ctx.settings.update(NS, { nativeSearchProvider: native }, revision);
      }
      const selection = id ? providerRoute(id) : native;
      await this.ctx.configEditor.edit(entry, (current) => {
        if (fingerprint(current) !== snapshot.searchRevision) throw new SearchError("settings-changed", "The web configuration changed");
        const providers = object(object(this.section().value).providers ?? {});
        if (id && (!Object.hasOwn(providers, id) || object(providers[id]).enabled !== true)) throw new SearchError("provider-disabled", "Enable the provider first");
        return { ...current, searchProvider: selection };
      });
    } else throw new SearchError("invalid-request", "Unknown operation");
    return { saved: true };
  }
};

// src/index.ts
import { getDshRuntimeVersion } from "@deepseek-ai/dsh-app-boot";

// src/updates.ts
import { randomUUID, createHash as createHash2 } from "node:crypto";
import { mkdir, mkdtemp, readFile, rename, writeFile, lstat } from "node:fs/promises";
import { join, resolve, relative, isAbsolute } from "node:path";

// src/update-download.ts
function allowedUrl(value) {
  const url = new URL(String(value));
  if (url.protocol !== "https:" || url.username || url.password || url.port || url.hash) throw new Error("redirect");
  if (url.hostname === "api.github.com" && url.pathname.startsWith(`/repos/${REPOSITORY}/`)) return url;
  if (url.hostname === "github.com" && url.pathname.startsWith(`/${REPOSITORY}/releases/download/`)) return url;
  if (url.hostname === "raw.githubusercontent.com" && url.pathname.startsWith(`/${REPOSITORY}/`)) return url;
  if (["release-assets.githubusercontent.com", "objects.githubusercontent.com"].includes(url.hostname)) return url;
  throw new Error("redirect");
}
async function boundedFetch(url, limit, { fetcher = fetch, signal } = {}) {
  const timeout = AbortSignal.timeout(2e4);
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;
  for (let redirects = 0; redirects <= 4; redirects++) {
    const response = await fetcher(allowedUrl(url), { redirect: "manual", signal: combined, headers: { accept: "application/vnd.github+json" } });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const next = response.headers.get("location");
      await response.body?.cancel();
      if (!next) throw new Error("redirect");
      url = new URL(next, url).href;
      continue;
    }
    if (!response.ok) {
      await response.body?.cancel();
      throw new Error(response.status === 404 ? "release-unavailable" : "network");
    }
    if (Number(response.headers.get("content-length")) > limit) {
      await response.body?.cancel();
      throw new Error("size");
    }
    const chunks = [];
    let bytes = 0;
    const reader = response.body?.getReader();
    if (!reader) throw new Error("network");
    try {
      for (; ; ) {
        combined.throwIfAborted();
        const { done, value } = await reader.read();
        if (done) return Buffer.concat(chunks, bytes);
        bytes += value.byteLength;
        if (bytes > limit) throw new Error("size");
        chunks.push(Buffer.from(value));
      }
    } finally {
      await reader.cancel().catch(() => {
      });
      reader.releaseLock();
    }
  }
  throw new Error("redirect");
}

// src/updates.ts
var import_semver = __toESM(require_semver2(), 1);
import { gunzipSync } from "node:zlib";
import { brandString } from "@deepseek-ai/dsh-brand";
var PACKAGE = "@aero123421/dsh-search-providers";
var REPOSITORY = "Aero123421/dsh-search-providers";
var RELEASES = `https://github.com/${REPOSITORY}/releases`;
function inside(directory, file) {
  const path = relative(resolve(directory), resolve(file));
  return !!path && path !== ".." && !path.startsWith(".." + (process.platform === "win32" ? "\\" : "/")) && !isAbsolute(path);
}
function supportsSource(source, directory, installedVersion) {
  return typeof source === "string" && (/^(?:github:)?Aero123421\/dsh-search-providers(?:#[A-Za-z0-9._/-]+)?$/i.test(source) || /^(?:git\+)?https:\/\/github\.com\/Aero123421\/dsh-search-providers(?:\.git)?(?:#[A-Za-z0-9._/-]+)?$/.test(source) || /^https:\/\/github\.com\/Aero123421\/dsh-search-providers\/releases\/download\/v[^/]+\/aero123421-dsh-search-providers-[^/]+\.tgz$/.test(source) || !!(directory && source.startsWith("file:") && inside(directory, source.slice(5))) || !!(installedVersion && import_semver.default.valid(installedVersion) && source.startsWith("file:") && source.replaceAll("\\", "/").endsWith(`/aero123421-dsh-search-providers-${installedVersion}.tgz`)));
}
function record(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("metadata");
  return value;
}
function changeErrorCode(result) {
  return String(result.error?.code ?? "");
}
async function replaceInstalled(manager, spec, enabled, previous, requestId) {
  if (typeof manager.removeBundle !== "function") return void 0;
  let removed;
  try {
    removed = await manager.removeBundle(PACKAGE);
  } catch (error) {
    const outcome2 = await restoreIfMissing(manager, enabled, previous, void 0);
    if (outcome2) return failedInstall(spec, outcome2);
    throw error;
  }
  if (removed.application === "cancelled" || removed.application === "failed" && changeErrorCode(removed) !== "stop-profile") return removed;
  const removedPackage = removed.application === "applied" || removed.application === "restart-required";
  let installed;
  try {
    installed = await manager.installBundle(spec, { enabled, requestId });
  } catch (error) {
    if (!removedPackage) throw error;
    const outcome2 = await restoreIfMissing(manager, enabled, previous, void 0);
    if (outcome2) return failedInstall(spec, outcome2);
    throw error;
  }
  if (!removedPackage) return installed;
  const outcome = await restoreIfMissing(manager, enabled, previous, installed);
  return outcome ? { ...installed, error: { code: outcome } } : installed;
}
function failedInstall(spec, code) {
  return { changed: false, application: "failed", stage: "install", target: spec, error: { code } };
}
async function packageInstalled(manager) {
  try {
    return (await manager.listBundles()).some((row) => row.name === PACKAGE && row.installed);
  } catch {
    return void 0;
  }
}
async function restoreIfMissing(manager, enabled, previous, installed) {
  if (installed && installed.application !== "failed" && installed.application !== "cancelled") return void 0;
  if (installed && changeErrorCode(installed) === "already-installed") return void 0;
  if (await packageInstalled(manager) !== false) return void 0;
  if (!previous) return "restore-failed";
  try {
    const restored = await manager.installBundle(previous, { enabled, requestId: brandString(randomUUID()) });
    if (restored.application === "failed" || restored.application === "cancelled") return "restore-failed";
    return await packageInstalled(manager) === true ? "restored" : "restore-failed";
  } catch {
    return "restore-failed";
  }
}
function errorCode(value) {
  const values = ["management-required", "unaddressable", "unknown-plugin", "invalid-spec", "ambiguous-install", "not-bundle", "not-removable", "stop-profile", "bundle-in-use", "stale-approval", "incompatible-version", "operation-error", "already-installed", "restored", "restore-failed"];
  return values.find((code) => code === value) ?? "operation-error";
}
function packageManifest(bytes) {
  const tar = gunzipSync(bytes, { maxOutputLength: 128 * 1024 * 1024 });
  let manifest;
  for (let offset = 0; offset + 512 <= tar.length; ) {
    const header = tar.subarray(offset, offset + 512);
    if (header.every((byte) => byte === 0)) break;
    const name2 = header.subarray(0, 100).toString().replace(/\0.*$/, "");
    const prefix = header.subarray(345, 500).toString().replace(/\0.*$/, "");
    const sizeText = header.subarray(124, 136).toString().replace(/\0.*$/, "").trim();
    if (!/^[0-7]+$/.test(sizeText)) throw new Error("metadata");
    const size = Number.parseInt(sizeText, 8);
    if (!Number.isSafeInteger(size) || offset + 512 + size > tar.length) throw new Error("metadata");
    const path = prefix ? `${prefix}/${name2}` : name2;
    if (path === "package/package.json") {
      if (manifest || ![0, 48].includes(header[156]) || size > 65536) throw new Error("metadata");
      manifest = record(JSON.parse(tar.subarray(offset + 512, offset + 512 + size).toString()));
    }
    offset += 512 + Math.ceil(size / 512) * 512;
  }
  if (!manifest) throw new Error("metadata");
  return manifest;
}
async function json(url, fetcher) {
  const response = await fetcher(url, { redirect: "error", signal: AbortSignal.timeout(15e3), headers: { accept: "application/vnd.github+json" } });
  if (!response.ok) throw new Error(`fetch-${response.status}`);
  if (!response.body) throw new Error("metadata");
  const reader = response.body.getReader();
  let length = 0;
  const chunks = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 512e3) throw new Error("metadata-size");
      chunks.push(value);
    }
  } finally {
    await reader.cancel().catch(() => {
    });
    reader.releaseLock();
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
async function getCandidate(runtime, fetcher = fetch) {
  const release = record(await json(`https://api.github.com/repos/${REPOSITORY}/releases/latest`, fetcher));
  const tag = release.tag_name, version = typeof tag === "string" && tag.startsWith("v") ? tag.slice(1) : "";
  if (!Number.isSafeInteger(release.id) || release.draft !== false || release.prerelease !== false || !import_semver.default.valid(version) || import_semver.default.prerelease(version) || release.html_url !== `${RELEASES}/tag/${tag}`) throw new Error("metadata");
  const manifest = record(await json(`https://raw.githubusercontent.com/${REPOSITORY}/${tag}/package.json`, fetcher));
  if (manifest.name !== PACKAGE || manifest.version !== version || record(record(manifest.dsh).bundle).patch !== "./cordis.patch.yml") throw new Error("metadata");
  const peers = record(manifest.peerDependencies);
  const ranges = Object.entries(peers).filter(([name2]) => name2 === "@deepseek-ai/dsh" || name2.startsWith("@deepseek-ai/dsh-"));
  if (!ranges.length || !import_semver.default.valid(runtime) || ranges.some(([, range]) => typeof range !== "string" || !import_semver.default.validRange(range) || !import_semver.default.satisfies(runtime, range, { includePrerelease: true }))) throw new Error("incompatible");
  const filename = `aero123421-dsh-search-providers-${version}.tgz`;
  if (!Array.isArray(release.assets)) throw new Error("asset");
  const assets = release.assets;
  const asset = (name2) => {
    const matches = assets.filter((value2) => record(value2).name === name2);
    if (matches.length !== 1) throw new Error("asset");
    const value = record(matches[0]), url = `https://github.com/${REPOSITORY}/releases/download/${tag}/${name2}`;
    if (!Number.isSafeInteger(value.id) || Number(value.id) <= 0 || !Number.isSafeInteger(value.size) || Number(value.size) <= 0 || value.browser_download_url !== url) throw new Error("asset");
    return url;
  };
  return { filename, tarball: asset(filename), checksum: asset("SHA256SUMS"), id: `${release.id}:${tag}`, version, tag: String(tag), notes: typeof release.body === "string" ? release.body.slice(0, 4e3) : "", url: String(release.html_url), runtime };
}
var Updates = class {
  view;
  candidate;
  operation;
  pendingOperation;
  pending;
  getManager;
  dir;
  profileKey;
  running;
  runtime;
  fetcher;
  closed = false;
  abort = new AbortController();
  constructor(getManager, dir, running, runtime, fetcher = fetch) {
    this.getManager = getManager;
    this.dir = dir;
    this.running = running;
    this.runtime = runtime;
    this.fetcher = (input, options) => fetcher(input, { ...options, signal: options?.signal ? AbortSignal.any([options.signal, this.abort.signal]) : this.abort.signal });
    this.profileKey = dir ? createHash2("sha256").update(`${PACKAGE}:${dir}`).digest("hex") : null;
    this.view = { status: "idle", running, profileKey: this.profileKey };
  }
  dispose() {
    this.closed = true;
    this.abort.abort();
  }
  get manager() {
    return this.getManager();
  }
  path() {
    if (!this.dir) throw new Error("management-required");
    return join(this.dir, ".dsh-search-update", "operation.json");
  }
  async save() {
    const path = this.path();
    await mkdir(join(this.dir, ".dsh-search-update"), { recursive: true, mode: 448 });
    if ((await lstat(join(this.dir, ".dsh-search-update"))).isSymbolicLink()) throw new Error("storage");
    const temp = `${path}.${randomUUID()}.tmp`;
    await writeFile(temp, JSON.stringify({ id: this.operation.id, version: this.operation.version, ...this.operation.result ? { result: { bundle: this.operation.result.bundle, application: this.operation.result.application, version: this.operation.result.version, stage: this.operation.result.stage, error: this.operation.result.error ? { code: this.operation.result.error.code } : void 0 } } : {} }), { mode: 384, flag: "wx" });
    await rename(temp, path);
  }
  async bundle() {
    if (this.closed) throw new Error("cancelled");
    if (!this.manager || !this.dir || typeof this.manager.listBundles !== "function" || typeof this.manager.installBundle !== "function" || typeof this.manager.waitForInstall !== "function") throw new Error("management-required");
    const bundle = (await this.manager.listBundles()).find((row) => row.name === PACKAGE);
    if (!bundle?.installed || bundle.readOnlyReason || bundle.error) throw new Error(bundle?.readOnlyReason ?? "not-installed");
    if (!supportsSource(bundle.source, this.dir && join(this.dir, ".dsh-search-update"), bundle.version)) throw new Error("source-unsupported");
    if (bundle.source?.startsWith("file:")) {
      const file = await lstat(bundle.source.slice(5)).catch(() => void 0);
      if (!file?.isFile() || file.isSymbolicLink()) throw new Error("source-unsupported");
    }
    return bundle;
  }
  fail(error, status = "failed") {
    const reason = error instanceof Error ? error.message : "operation-error";
    const known = ["management-required", "unaddressable", "not-installed", "source-unsupported", "metadata", "metadata-size", "incompatible", "asset", "checksum", "redirect", "size", "storage", "cancelled", "candidate-changed", "settings-changed", "result-unknown", "invalid-request", "journal", "release-unavailable", "network"];
    this.view = { ...this.view, status, reason: known.includes(reason) ? reason : "operation-error" };
    return this.view;
  }
  async status(expectedId) {
    try {
      if (expectedId !== void 0 && (typeof expectedId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(expectedId))) throw new Error("invalid-request");
      const bundle = await this.bundle();
      this.view = { ...this.view, installed: bundle.version ?? "unknown" };
      if (!this.operation) {
        try {
          const value = record(JSON.parse(await readFile(this.path(), "utf8")));
          if (typeof value.id !== "string" || !/^[0-9a-f-]{36}$/.test(value.id) || typeof value.version !== "string" || !import_semver.default.valid(value.version)) throw new Error("journal");
          const operation = { id: value.id, version: value.version };
          if (value.result) {
            const result = record(value.result);
            if (!["applied", "restart-required", "overridden", "failed", "cancelled"].includes(String(result.application)) || !["install", "enable", "remove"].includes(String(result.stage))) throw new Error("journal");
            operation.result = { changed: false, target: PACKAGE, ...result.bundle === PACKAGE ? { bundle: PACKAGE } : {}, application: result.application, stage: result.stage, ...typeof result.version === "string" ? { version: result.version } : {}, ...result.error ? { error: { code: errorCode(record(result.error).code) } } : {} };
          }
          this.operation = operation;
        } catch (error) {
          if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) return this.fail(error, "unknown");
        }
      }
      if (expectedId && expectedId !== this.operation?.id) return { ...this.view, status: "unknown", operation: typeof expectedId === "string" ? expectedId : "invalid" };
      if (this.operation) {
        const result = this.operation.result ?? await this.manager.waitForInstall(brandString(this.operation.id));
        if (!result) {
          this.view = { ...this.view, status: "unknown", operation: this.operation.id };
          return this.view;
        }
        this.operation.result = result;
        await this.save();
        return this.result(result, bundle.version);
      }
      return this.view;
    } catch (error) {
      return this.fail(error, "unavailable");
    }
  }
  result(result, installed) {
    const operation = this.operation;
    let status = result.application;
    if (result.application === "failed" || ["applied", "restart-required"].includes(result.application) && (result.error || result.packageResult && (result.packageResult.exitCode !== 0 || result.packageResult.timedOut))) status = "failed";
    else if (result.application === "applied" || result.application === "restart-required") {
      if (result.bundle !== PACKAGE || result.version !== operation.version || installed !== operation.version) status = "unknown";
      else status = this.running === operation.version ? "applied" : "restart-required";
    }
    const { reason: _reason, ...previous } = this.view;
    this.view = { ...previous, status, operation: this.operation.id, stage: result.stage, ...result.error ? { reason: result.error.code } : {} };
    return this.view;
  }
  check() {
    if (this.pending) return this.pending;
    if (this.view.status === "installing" || this.view.status === "unknown") return this.status();
    this.pending = (async () => {
      try {
        const bundle = await this.bundle();
        this.candidate = void 0;
        this.view = { status: "checking", running: this.running, profileKey: this.profileKey };
        const candidate = await getCandidate(this.runtime, this.fetcher);
        if (!import_semver.default.valid(this.running)) throw new Error("metadata");
        this.candidate = candidate;
        this.view = { status: import_semver.default.gt(candidate.version, bundle.version ?? this.running) ? "available" : "current", running: this.running, profileKey: this.profileKey, candidate, checkedAt: (/* @__PURE__ */ new Date()).toISOString() };
        return this.view;
      } catch (error) {
        return this.fail(error, error instanceof Error && error.message === "incompatible" ? "incompatible" : "failed");
      }
    })().finally(() => {
      this.pending = void 0;
    });
    return this.pending;
  }
  install(candidateId, operationId, expectedProfileKey) {
    if (!this.profileKey || expectedProfileKey !== this.profileKey) return Promise.reject(new Error("profile-changed"));
    if (this.pending) return this.pendingOperation !== void 0 && this.pendingOperation === operationId ? this.pending : Promise.reject(new Error("busy"));
    this.pendingOperation = typeof operationId === "string" ? operationId : void 0;
    this.pending = (async () => {
      let started = false, admitted = false;
      try {
        await this.status();
        if (this.operation?.id === operationId) return this.status();
        if (this.operation && !this.operation.result) throw new Error("result-unknown");
        if (typeof operationId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(operationId)) throw new Error("invalid-request");
        const before = await this.bundle(), candidate = await getCandidate(this.runtime, this.fetcher);
        if (!this.candidate || candidate.id !== candidateId || candidate.id !== this.candidate.id || !import_semver.default.gt(candidate.version, before.version ?? this.running)) throw new Error("candidate-changed");
        this.operation = { id: operationId, version: candidate.version };
        admitted = true;
        await this.save();
        this.view = { ...this.view, status: "installing", operation: operationId };
        let spec = `github:${REPOSITORY}#${candidate.tag}`;
        if (before.source?.startsWith("file:") || before.source?.includes("/releases/download/")) {
          const checksum = (await boundedFetch(candidate.checksum, 8192, { fetcher: this.fetcher })).toString().trim();
          const match = /^([a-fA-F0-9]{64})  (\S+)$/.exec(checksum);
          if (!match || match[2] !== candidate.filename) throw new Error("checksum");
          const bytes = await boundedFetch(candidate.tarball, 32 * 1024 * 1024, { fetcher: this.fetcher });
          if (createHash2("sha256").update(bytes).digest("hex") !== match[1].toLowerCase()) throw new Error("checksum");
          const manifest = packageManifest(bytes);
          if (manifest.name !== PACKAGE || manifest.version !== candidate.version || record(record(manifest.dsh).bundle).patch !== "./cordis.patch.yml") throw new Error("metadata");
          const peers = Object.entries(record(manifest.peerDependencies)).filter(([name2]) => name2 === "@deepseek-ai/dsh" || name2.startsWith("@deepseek-ai/dsh-"));
          if (!peers.length || peers.some(([, range]) => typeof range !== "string" || !import_semver.default.validRange(range) || !import_semver.default.satisfies(this.runtime, range, { includePrerelease: true }))) throw new Error("incompatible");
          const directory = await mkdtemp(join(this.dir, ".dsh-search-update", "verified-"));
          spec = join(directory, candidate.filename);
          await writeFile(spec, bytes, { flag: "wx", mode: 384 });
        }
        const latest = await this.bundle();
        if (latest.source !== before.source || latest.enabled !== before.enabled) throw new Error("settings-changed");
        if (this.closed) throw new Error("cancelled");
        started = true;
        const manager = this.manager;
        const requestId = brandString(operationId);
        let result = await manager.installBundle(spec, { enabled: before.enabled, requestId });
        if (changeErrorCode(result) === "already-installed") {
          const replaced = await replaceInstalled(manager, spec, before.enabled, before.source, requestId);
          if (replaced) result = replaced;
        }
        this.operation.result = result;
        await this.save();
        let installed;
        try {
          installed = this.closed ? (await manager.listBundles()).find((row) => row.name === PACKAGE)?.version : (await this.bundle()).version;
        } catch (error) {
          if (!(error instanceof Error) || error.message !== "not-installed") throw error;
        }
        return this.result(result, installed);
      } catch (error) {
        if (admitted && this.operation && this.operation.id === operationId && !this.operation.result && !started) {
          this.operation.result = { changed: false, application: "failed", target: PACKAGE, stage: "install", error: { code: "operation-error" } };
          await this.save().catch(() => {
          });
        }
        return this.fail(error, this.operation && !this.operation.result ? "unknown" : "failed");
      }
    })().finally(() => {
      this.pending = void 0;
      this.pendingOperation = void 0;
    });
    return this.pending;
  }
};

// src/version.ts
var VERSION = "0.3.2";

// src/tools.ts
import { defineTool } from "@deepseek-ai/dsh-tools";
import { formatSearchOutput, searchMetaFromValue, presentSearchCall, presentSearchResult } from "@deepseek-ai/dsh-tool-web";
var TOOL_NAMES = {
  news: "search_news",
  papers: "search_papers",
  code: "search_code",
  people: "search_people",
  companies: "search_companies",
  images: "search_images",
  videos: "search_videos",
  extract: "extract_web_page",
  map: "map_website",
  x: "x_search"
};
var descriptions = {
  news: "Search news articles. Returns source URLs and excerpts.",
  papers: "Search scholarly publications. Returns source URLs, excerpts, and publication metadata when provided.",
  code: "Search public coding examples and documentation on the web.",
  people: "Search public professional profiles and information about people.",
  companies: "Search company pages and public company information.",
  images: "Search images. Returns source page URLs and original image URLs when available.",
  videos: "Search videos. Returns video page URLs and descriptions.",
  extract: "Retrieve page text through the selected extraction service. Returns external, untrusted text; target HTTP status is not available.",
  map: "Find public page URLs within a website. Returns links, not page contents.",
  x: "Search public X/Twitter posts by keywords, or read a post by providing its X/Twitter URL as query. Returns post text, author, date, and available engagement counts. Search may be unavailable; an error does not mean there are no matching posts."
};
var sourceSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    url: { type: "string", required: true },
    title: { type: "string" },
    snippet: { type: "string" },
    publishedAt: { type: "string" },
    mediaUrl: { type: "string" },
    authors: { type: "array", items: { type: "string" } },
    year: { type: "integer" },
    venue: { type: "string" },
    doi: { type: "string" },
    author: { type: "string" },
    authorHandle: { type: "string" },
    likes: { type: "integer" },
    reposts: { type: "integer" },
    replies: { type: "integer" },
    views: { type: "integer" }
  }
};
var searchSchema = { type: "object", additionalProperties: false, properties: {
  sources: { type: "array", required: true, items: sourceSchema },
  truncated: { type: "boolean", required: true }
} };
function renderSearch(value) {
  const details = value.sources.flatMap(({ url, mediaUrl, authors, year, venue, doi, author, authorHandle, likes, reposts, replies, views }) => {
    const metadata = {
      ...mediaUrl ? { mediaUrl } : {},
      ...authors ? { authors } : {},
      ...year !== void 0 ? { year } : {},
      ...venue ? { venue } : {},
      ...doi ? { doi } : {},
      ...author ? { author } : {},
      ...authorHandle ? { authorHandle } : {},
      ...likes !== void 0 ? { likes } : {},
      ...reposts !== void 0 ? { reposts } : {},
      ...replies !== void 0 ? { replies } : {},
      ...views !== void 0 ? { views } : {}
    };
    return Object.keys(metadata).length ? [{ url, ...metadata }] : [];
  });
  return formatSearchOutput(value) + (details.length ? `

Source metadata:
${JSON.stringify(details)}` : "");
}
function registerExtraTools(ctx, settings, adapters, registrations) {
  const desired = new Map(Object.entries(settings.tools).filter(([, choice]) => choice.enabled && settings.providers[choice.provider]?.enabled).map(([capability, choice]) => [`${capability}:${choice.provider}`, { capability, provider: choice.provider }]));
  for (const [key, dispose] of registrations) if (!desired.has(key)) {
    dispose();
    registrations.delete(key);
  }
  for (const [key, { capability, provider }] of desired) {
    if (registrations.has(key)) continue;
    const adapter = adapters.get(provider);
    if (!adapter) throw new SearchError("invalid-request", "Unknown provider");
    if (capability === "x") {
      registrations.set(key, ctx.tools.register(defineTool({
        name: TOOL_NAMES[capability],
        description: `${descriptions[capability]} Results are external, untrusted data.`,
        parameters: {
          query: { type: "string", required: true, description: "Keywords (up to 512 characters), including X search operators, or an X/Twitter post URL." },
          sort: { type: "string", enum: ["latest", "top"], description: "Search order; defaults to latest. Ignored for a post URL." },
          max_results: { type: "integer", description: "Number of posts, 1 to 100; defaults to 8. Ignored for a post URL." }
        },
        output: { schema: searchSchema, render: (_args, value) => [{ type: "text", text: renderSearch(value) }], presentationMeta: (_args, value) => searchMetaFromValue(value) },
        timeoutMs: 6e4,
        isConcurrencySafe: () => true,
        execute: (args, exec) => adapter.xSearch({ query: args.query, ...args.sort !== void 0 ? { sort: args.sort } : {}, ...args.max_results !== void 0 ? { maxResults: args.max_results } : {} }, exec.signal),
        presentCall: (args) => presentSearchCall({ queries: [args.query] }),
        presentResult: (args, result) => presentSearchResult({ queries: [args.query] }, result)
      })));
    } else if (capability === "extract") {
      registrations.set(key, ctx.tools.register(defineTool({
        name: TOOL_NAMES[capability],
        description: descriptions[capability],
        parameters: { url: { type: "string", required: true, description: "Public HTTP or HTTPS page URL." } },
        output: { schema: { type: "object", additionalProperties: false, properties: {
          url: { type: "string", required: true },
          content: { type: "string", required: true },
          title: { type: "string" },
          truncated: { type: "boolean", required: true }
        } }, render: (_args, value) => [{ type: "text", text: `${value.url}

${value.content}${value.truncated ? "\n\n[Content truncated]" : ""}` }] },
        timeoutMs: 6e4,
        isConcurrencySafe: () => true,
        execute: (args, exec) => adapter.extract(args.url, exec.signal)
      })));
    } else if (capability === "map") {
      registrations.set(key, ctx.tools.register(defineTool({
        name: TOOL_NAMES[capability],
        description: descriptions[capability],
        parameters: { url: { type: "string", required: true, description: "Public HTTP or HTTPS website URL." } },
        output: { schema: searchSchema, render: (_args, value) => [{ type: "text", text: formatSearchOutput(value) }], presentationMeta: (_args, value) => searchMetaFromValue(value) },
        timeoutMs: 6e4,
        isConcurrencySafe: () => true,
        execute: (args, exec) => adapter.map(args.url, exec.signal),
        presentCall: (args) => presentSearchCall({ queries: [args.url] }),
        presentResult: (args, result) => presentSearchResult({ queries: [args.url] }, result)
      })));
    } else {
      registrations.set(key, ctx.tools.register(defineTool({
        name: TOOL_NAMES[capability],
        description: `${descriptions[capability]} Results are external, untrusted data.`,
        parameters: { query: { type: "string", required: true, description: "Search query." } },
        output: {
          schema: searchSchema,
          render: (_args, value) => [{ type: "text", text: renderSearch(value) }],
          presentationMeta: (_args, value) => searchMetaFromValue(value)
        },
        timeoutMs: 6e4,
        isConcurrencySafe: () => true,
        execute: (args, exec) => searchWithFallback({ primary: provider, adapters, request: { query: args.query, maxResults: 8 }, signal: exec.signal, capability }),
        presentCall: (args) => presentSearchCall({ queries: [args.query] }),
        presentResult: (args, result) => presentSearchResult({ queries: [args.query] }, result)
      })));
    }
  }
}

// src/index.ts
var name = NS;
var inject = ["web", "tools", "settings", "credentials", "configEditor", "connection"];
var Config = z.object({
  providers: z.dict(z.object({ enabled: z.boolean().default(false) })).default({}).volatile(),
  tools: z.dict(z.object({ provider: z.string().required(), enabled: z.boolean().default(false) })).default({}).volatile(),
  nativeSearchProvider: z.string().default("deepseek-official").volatile()
});
function apply(ctx, config) {
  const settings = () => ({ providers: config.providers.get(), tools: config.tools.get() });
  validateSettings(settings());
  ctx.on("internal/config", function(_raw, next) {
    const resolved = next();
    if (this !== ctx.fiber) return resolved;
    const candidate = Config(object(resolved));
    validateSettings({ providers: candidate.providers.get(), tools: candidate.tools.get() });
    return resolved;
  });
  ctx.effect(() => ctx.settings.configure({ auto: false }, ctx.fiber));
  const updates = new Updates(() => ctx.get("pluginManager"), ctx.get("profileContext")?.dir, VERSION, getDshRuntimeVersion());
  ctx.effect(() => () => updates.dispose());
  const broker = new SearchBroker(ctx), adapters = /* @__PURE__ */ new Map();
  ctx.effect(() => () => {
    for (const adapter of adapters.values()) adapter.dispose();
  });
  for (const provider of PROVIDERS) {
    const adapter = new SearchAdapter({ id: provider.id, enabled: () => settings().providers[provider.id]?.enabled === true, resolveKey: () => broker.key(provider.id) });
    adapters.set(provider.id, adapter);
    if (providerOf(provider.id).webSearch === false) continue;
    ctx.web.registerSearchProvider({
      id: providerRoute(provider.id),
      available: () => adapter.available(),
      async search(request, signal) {
        try {
          return await searchWithFallback({ primary: provider.id, adapters, request, ...signal ? { signal } : {} });
        } catch (error) {
          if (signal?.aborted) throw new WebError("Search cancelled", "WEB_SEARCH_CANCELLED");
          if (error instanceof SearchError) throw new WebError(error.message, `SEARCH_${error.code.toUpperCase().replaceAll("-", "_")}`);
          throw new WebError("Search request failed", "WEB_PROVIDER_FAILURE");
        }
      }
    });
  }
  const registrations = /* @__PURE__ */ new Map();
  const refreshTools = () => {
    const value = settings();
    validateSettings(value);
    registerExtraTools(ctx, value, adapters, registrations);
  };
  refreshTools();
  ctx.on("settings/document-updated", (namespace) => {
    if (namespace === NS) refreshTools();
  });
  ctx.on("loader/volatile-update", refreshTools);
  ctx.effect(() => () => {
    for (const dispose of registrations.values()) dispose();
    registrations.clear();
  });
  for (const method of ["list", "save-key", "delete-key", "provider", "tool", "default", "update-status", "update-check", "update-install"]) {
    const endpoint = `${NS}/${method}`;
    ctx.connection.fetch.register({
      path: `/api/${endpoint}`,
      methods: ["POST"],
      requestBody: "buffered",
      async fetch(request) {
        let rpcId;
        try {
          if (request.headers.get("content-type")?.split(";")[0] !== "application/json") return new Response("unsupported media type", { status: 415 });
          const envelope = object(await request.json());
          if (envelope.type !== "client-request" || typeof envelope.rpcId !== "string" || envelope.rpcId.length > 100 || envelope.method !== endpoint) return new Response("invalid request", { status: 400 });
          rpcId = envelope.rpcId;
          request.signal.throwIfAborted();
          const payload = object(envelope.payload);
          const value = method === "update-status" ? await updates.status(payload.operationId) : method === "update-check" ? await updates.check() : method === "update-install" ? await updates.install(payload.candidateId, payload.operationId, payload.profileKey) : await broker.dispatch(method, envelope.payload);
          return Response.json({ type: "server-response", rpcId, result: { ok: true, value } }, { headers: { "cache-control": "no-store" } });
        } catch (error) {
          if (rpcId === void 0) return new Response("invalid request", { status: 400 });
          const code = error instanceof SearchError ? error.code : error instanceof Error && ["busy", "profile-changed"].includes(error.message) ? error.message : "unavailable";
          return Response.json({ type: "server-response", rpcId, result: { ok: false, error: { code: `${NS}/${code}`, message: code, details: {} } } }, { headers: { "cache-control": "no-store" } });
        }
      }
    });
  }
}
export {
  Config,
  apply,
  inject,
  name
};

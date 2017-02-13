(function() {
  var _, m$;

  _ = require("underscore");

  m$ = {};

  String.prototype.toDash = function() {
    return this.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  };

  String.prototype.frontCap = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

  String.prototype.pluralize = function(revert) {
    var array, irregular, pattern, plural, reg, replace, singular, uncountable, word;
    if (revert == null) {
      revert = false;
    }
    plural = {
      '(quiz)$': "$1zes",
      '^(ox)$': "$1en",
      '([m|l])ouse$': "$1ice",
      '(matr|vert|ind)ix|ex$': "$1ices",
      '(x|ch|ss|sh)$': "$1es",
      '([^aeiouy]|qu)y$': "$1ies",
      '(hive)$': "$1s",
      '(?:([^f])fe|([lr])f)$': "$1$2ves",
      '(shea|lea|loa|thie)f$': "$1ves",
      'sis$': "ses",
      '([ti])um$': "$1a",
      '(tomat|potat|ech|her|vet)o$': "$1oes",
      '(bu)s$': "$1ses",
      '(alias)$': "$1es",
      '(octop)us$': "$1i",
      '(ax|test)is$': "$1es",
      '(us)$': "$1es",
      '([^s]+)$': "$1s"
    };
    singular = {
      '(quiz)zes$': "$1",
      '(matr)ices$': "$1ix",
      '(vert|ind)ices$': "$1ex",
      '^(ox)en$': "$1",
      '(alias)es$': "$1",
      '(octop|vir)i$': "$1us",
      '(cris|ax|test)es$': "$1is",
      '(shoe)s$': "$1",
      '(o)es$': "$1",
      '(bus)es$': "$1",
      '([m|l])ice$': "$1ouse",
      '(x|ch|ss|sh)es$': "$1",
      '(m)ovies$': "$1ovie",
      '(s)eries$': "$1eries",
      '([^aeiouy]|qu)ies$': "$1y",
      '([lr])ves$': "$1f",
      '(tive)s$': "$1",
      '(hive)s$': "$1",
      '(li|wi|kni)ves$': "$1fe",
      '(shea|loa|lea|thie)ves$': "$1f",
      '(^analy)ses$': "$1sis",
      '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$': "$1$2sis",
      '([ti])a$': "$1um",
      '(n)ews$': "$1ews",
      '(h|bl)ouses$': "$1ouse",
      '(corpse)s$': "$1",
      '(us)es$': "$1",
      's$': ""
    };
    irregular = {
      'move': 'moves',
      'foot': 'feet',
      'goose': 'geese',
      'sex': 'sexes',
      'child': 'children',
      'man': 'men',
      'tooth': 'teeth',
      'person': 'people'
    };
    uncountable = ['sheep', 'fish', 'deer', 'series', 'species', 'money', 'rice', 'information', 'equipment'];
    if (uncountable.indexOf(this.toLowerCase()) >= 0) {
      return this;
    }
    for (word in irregular) {
      if (revert) {
        pattern = new RegExp(irregular[word] + '$', 'i');
        replace = word;
      } else {
        pattern = new RegExp(word + '$', 'i');
        replace = irregular[word];
      }
      if (pattern.test(this)) {
        return this.replace(pattern, replace);
      }
    }
    if (revert) {
      array = singular;
    } else {
      array = plural;
    }
    for (reg in array) {
      pattern = new RegExp(reg, 'i');
      if (pattern.test(this)) {
        return this.replace(pattern, array[reg]);
      }
    }
    return this;
  };

  Function.prototype.clone = function() {
    var j, key, len, temp, that;
    that = this;
    temp = function() {
      return that.apply(this, arguments);
    };
    for (j = 0, len = this.length; j < len; j++) {
      key = this[j];
      if (this.hasOwnProperty(key)) {
        temp[key] = this[key];
      }
    }
    return temp;
  };

  Function.prototype.then = function() {
    return Promise.resolve().then(this);
  };

  _.deepClone = function(obj) {
    var prop, ret;
    ret = _.clone(obj);
    for (prop in ret) {
      if (typeof ret[prop] === "object") {
        ret[prop] = _.deepClone(obj[prop]);
      }
    }
    return ret;
  };

  _.deepSafeExtend = function(parent, child) {
    var prop;
    parent = _.deepClone(parent);
    for (prop in child) {
      if (typeof parent[prop] === "object" && typeof child[prop] === "object") {
        parent[prop] = _.deepSafeExtend(parent[prop], child[prop]);
      } else {
        parent[prop] = child[prop];
      }
    }
    return parent;
  };

  _.toClipboard = function(text) {
    var err, error1, msg, parent, successful, textArea;
    parent = document.activeElement;
    console.log(parent);
    textArea = document.activeElement.appendChild(document.createElement("textarea"));
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;
    textArea.select();
    console.log(textArea);
    try {
      successful = document.execCommand('copy');
      msg = successful != null ? successful : {
        'successful': 'unsuccessful'
      };
      parent.removeChild(textArea);
      return console.log('Copying text command was ' + msg);
    } catch (error1) {
      err = error1;
      parent.removeChild(textArea);
      return console.log('Oops, unable to copy');
    }
  };

  _.forPromise = function(iterable, asyncFN) {
    var i;
    i = 0;
    return new Promise(function(resolve, reject) {
      var next;
      next = function() {
        if (i < iterable.length) {
          return asyncFN(iterable[i]).then(function() {
            i++;
            return next();
          });
        } else {
          console.log("resolving for promise");
          return resolve();
        }
      };
      return next();
    });
  };

  _.getStackTrace = function() {
    var obj;
    obj = {};
    Error.captureStackTrace(obj);
    return obj.stack;
  };

  _.objectifyArray = function(array) {
    var j, key, len, obj, value;
    obj = {};
    for (key = j = 0, len = array.length; j < len; key = ++j) {
      value = array[key];
      obj[key] = value;
    }
    return obj;
  };

  _.glog = function(title, options) {
    var glog, j, len, level, localGlog, ret;
    glog = (function() {
      function glog(title1, parent1) {
        this.title = title1;
        this.parent = parent1;
        this.sublogs = [];
        this.trace = _.getStackTrace().split(/\r?\n/);
      }

      glog.prototype.open = function(title) {
        var newLog;
        newLog = new glog(title, this);
        this.sublogs.push(newLog);
        _.glogs.last = newLog;
        return newLog;
      };

      glog.prototype.add = function(entry) {
        if (_.glogs.live) {
          console.log(entry);
        }
        this.sublogs.push({
          entry: entry,
          trace: _.getStackTrace().split(/\r?\n/)
        });
        _.glogs.last = this;
        return this;
      };

      glog.prototype.error = function(error) {
        return this.sublogs.push({
          error: error
        });
      };

      glog.prototype.get = function(entry) {
        var j, len, log, ref;
        if (Array.isArray(entry) && entry.length === 1) {
          entry = entry[0];
        }
        ref = this.sublogs;
        for (j = 0, len = ref.length; j < len; j++) {
          log = ref[j];
          if (log.title === entry) {
            return log;
          }
        }
        return false;
      };

      glog.prototype.relevantStackCall = function(trace) {
        var entry, j, key, len;
        for (key = j = 0, len = trace.length; j < len; key = ++j) {
          entry = trace[key];
          if (entry.indexOf("glog") === -1 && key > 1) {
            return entry;
          }
        }
      };

      glog.prototype.print = function(trace) {
        var entry, j, k, key, len, len1, log, ref, ref1;
        if (trace == null) {
          trace = 1;
        }
        console.groupCollapsed(this.title);
        if (trace !== 0) {
          console.debug(this.relevantStackCall(this.trace));
        }
        if (this.sublogs.length === 0) {
          console.debug("No Sublogs!");
          console.groupEnd();
          return;
        }
        ref = this.sublogs;
        for (j = 0, len = ref.length; j < len; j++) {
          log = ref[j];
          if (log instanceof glog) {
            log.print(trace);
          } else {
            if (log.entry != null) {
              if (trace === 0 || trace === 1) {
                console.debug(log.entry);
                if (trace === 1) {
                  console.debug("" + (this.relevantStackCall(log.trace)));
                }
              } else if (trace === 2) {
                console.groupCollapsed(log.entry);
                ref1 = this.trace;
                for (key = k = 0, len1 = ref1.length; k < len1; key = ++k) {
                  entry = ref1[key];
                  if (key > 1) {
                    console.debug(entry);
                  }
                }
                console.groupEnd();
              }
            } else if (log.error != null) {
              console.error(log.error);
            }
          }
        }
        console.groupEnd();
        return this;
      };

      return glog;

    })();
    if (_.glogs == null) {
      _.glogs = {};
    }
    if (_.glogs.root == null) {
      _.glogs.root = new glog("root", null);
    }
    if (title === "print_all") {
      _.glogs.root.print(options);
    } else if (title === "error") {
      _.glogs.last.error(options);
    } else if (title === "last") {
      ret = _.glogs.last;
    } else if (Array.isArray(title) && title.length > 1) {
      localGlog = _.glogs.root;
      for (j = 0, len = title.length; j < len; j++) {
        level = title[j];
        if (localGlog.get(level)) {
          localGlog = localGlog.get(level);
        } else {
          localGlog = localGlog.open(level);
        }
      }
      ret = localGlog;
    } else if (!_.glogs.root.get(title)) {
      ret = _.glogs.root.open(title);
    } else {
      ret = _.glogs.root.get(title);
    }
    _.glogs.last = ret;
    return ret;
  };

  window.onerror = function(e) {
    console.log("error!");
    console.error(e);
    return _.glog("error", e);
  };


  /*
  glog = _.glog(["Test Glog", "Level 1a"])
  
  glog.open("Level 2a")
  	.add("some stuff")
  	.add("more stuff")
  	.open("Level 3a")
  	.add("sub child")
  
  console.log "GGGGGGGGGGEEEEEEEEEEEEETTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"
  
  _.glog(["Test Glog"]).open("Level 1b")
  	.add("1b shit")
  	.add("more 1b shit")
  
  console.log _.glog(["Test Glog"])
  
  	.open("Level 2b")
  	.add "2bshit"
  
  _.glog("Test Glog").print(0)
  
  _.glog "Witnesses"
  	.open "Merging Witness Lists for Case"
  _.glog "Witnesses"
  	.add "Test Log"
  _.glog "Witnesses"
  	.add "Test Log2"
  	.add {test: "object", how: "does it work"}
  _.glog "Witnesses"
  _.glog "Witnesses"
  	.open "A new Chain"
  	.add "Test Log 45"
  _.glog "Events"
  	.open "A test list of evevnts"
  	.add "what happens if I add without opening?"
  _.glog "print_all", 0
   */

}).call(this);

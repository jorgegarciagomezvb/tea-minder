var Sg = Object.defineProperty,
  Tg = Object.defineProperties;
var Ag = Object.getOwnPropertyDescriptors;
var jc = Object.getOwnPropertySymbols;
var xg = Object.prototype.hasOwnProperty,
  Ng = Object.prototype.propertyIsEnumerable;
var Uc = (t, e, r) =>
    e in t
      ? Sg(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r })
      : (t[e] = r),
  g = (t, e) => {
    for (var r in (e ||= {})) xg.call(e, r) && Uc(t, r, e[r]);
    if (jc) for (var r of jc(e)) Ng.call(e, r) && Uc(t, r, e[r]);
    return t;
  },
  $ = (t, e) => Tg(t, Ag(e));
var $c = null;
var cs = 1,
  Bc = Symbol("SIGNAL");
function ne(t) {
  let e = $c;
  return ($c = t), e;
}
var Hc = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function Rg(t) {
  if (!(fs(t) && !t.dirty) && !(!t.dirty && t.lastCleanEpoch === cs)) {
    if (!t.producerMustRecompute(t) && !ls(t)) {
      (t.dirty = !1), (t.lastCleanEpoch = cs);
      return;
    }
    t.producerRecomputeValue(t), (t.dirty = !1), (t.lastCleanEpoch = cs);
  }
}
function zc(t) {
  return t && (t.nextProducerIndex = 0), ne(t);
}
function Gc(t, e) {
  if (
    (ne(e),
    !(
      !t ||
      t.producerNode === void 0 ||
      t.producerIndexOfThis === void 0 ||
      t.producerLastReadVersion === void 0
    ))
  ) {
    if (fs(t))
      for (let r = t.nextProducerIndex; r < t.producerNode.length; r++)
        ds(t.producerNode[r], t.producerIndexOfThis[r]);
    for (; t.producerNode.length > t.nextProducerIndex; )
      t.producerNode.pop(),
        t.producerLastReadVersion.pop(),
        t.producerIndexOfThis.pop();
  }
}
function ls(t) {
  Wr(t);
  for (let e = 0; e < t.producerNode.length; e++) {
    let r = t.producerNode[e],
      n = t.producerLastReadVersion[e];
    if (n !== r.version || (Rg(r), n !== r.version)) return !0;
  }
  return !1;
}
function Wc(t) {
  if ((Wr(t), fs(t)))
    for (let e = 0; e < t.producerNode.length; e++)
      ds(t.producerNode[e], t.producerIndexOfThis[e]);
  (t.producerNode.length =
    t.producerLastReadVersion.length =
    t.producerIndexOfThis.length =
      0),
    t.liveConsumerNode &&
      (t.liveConsumerNode.length = t.liveConsumerIndexOfThis.length = 0);
}
function ds(t, e) {
  if ((Og(t), Wr(t), t.liveConsumerNode.length === 1))
    for (let n = 0; n < t.producerNode.length; n++)
      ds(t.producerNode[n], t.producerIndexOfThis[n]);
  let r = t.liveConsumerNode.length - 1;
  if (
    ((t.liveConsumerNode[e] = t.liveConsumerNode[r]),
    (t.liveConsumerIndexOfThis[e] = t.liveConsumerIndexOfThis[r]),
    t.liveConsumerNode.length--,
    t.liveConsumerIndexOfThis.length--,
    e < t.liveConsumerNode.length)
  ) {
    let n = t.liveConsumerIndexOfThis[e],
      i = t.liveConsumerNode[e];
    Wr(i), (i.producerIndexOfThis[n] = e);
  }
}
function fs(t) {
  return t.consumerIsAlwaysLive || (t?.liveConsumerNode?.length ?? 0) > 0;
}
function Wr(t) {
  (t.producerNode ??= []),
    (t.producerIndexOfThis ??= []),
    (t.producerLastReadVersion ??= []);
}
function Og(t) {
  (t.liveConsumerNode ??= []), (t.liveConsumerIndexOfThis ??= []);
}
function Fg() {
  throw new Error();
}
var Pg = Fg;
function qc(t) {
  Pg = t;
}
function M(t) {
  return typeof t == "function";
}
function Yt(t) {
  let r = t((n) => {
    Error.call(n), (n.stack = new Error().stack);
  });
  return (
    (r.prototype = Object.create(Error.prototype)),
    (r.prototype.constructor = r),
    r
  );
}
var qr = Yt(
  (t) =>
    function (r) {
      t(this),
        (this.message = r
          ? `${r.length} errors occurred during unsubscription:
${r.map((n, i) => `${i + 1}) ${n.toString()}`).join(`
  `)}`
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = r);
    }
);
function bt(t, e) {
  if (t) {
    let r = t.indexOf(e);
    0 <= r && t.splice(r, 1);
  }
}
var G = class t {
  constructor(e) {
    (this.initialTeardown = e),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let e;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: r } = this;
      if (r)
        if (((this._parentage = null), Array.isArray(r)))
          for (let o of r) o.remove(this);
        else r.remove(this);
      let { initialTeardown: n } = this;
      if (M(n))
        try {
          n();
        } catch (o) {
          e = o instanceof qr ? o.errors : [o];
        }
      let { _finalizers: i } = this;
      if (i) {
        this._finalizers = null;
        for (let o of i)
          try {
            Zc(o);
          } catch (s) {
            (e = e ?? []),
              s instanceof qr ? (e = [...e, ...s.errors]) : e.push(s);
          }
      }
      if (e) throw new qr(e);
    }
  }
  add(e) {
    var r;
    if (e && e !== this)
      if (this.closed) Zc(e);
      else {
        if (e instanceof t) {
          if (e.closed || e._hasParent(this)) return;
          e._addParent(this);
        }
        (this._finalizers =
          (r = this._finalizers) !== null && r !== void 0 ? r : []).push(e);
      }
  }
  _hasParent(e) {
    let { _parentage: r } = this;
    return r === e || (Array.isArray(r) && r.includes(e));
  }
  _addParent(e) {
    let { _parentage: r } = this;
    this._parentage = Array.isArray(r) ? (r.push(e), r) : r ? [r, e] : e;
  }
  _removeParent(e) {
    let { _parentage: r } = this;
    r === e ? (this._parentage = null) : Array.isArray(r) && bt(r, e);
  }
  remove(e) {
    let { _finalizers: r } = this;
    r && bt(r, e), e instanceof t && e._removeParent(this);
  }
};
G.EMPTY = (() => {
  let t = new G();
  return (t.closed = !0), t;
})();
var hs = G.EMPTY;
function Zr(t) {
  return (
    t instanceof G ||
    (t && "closed" in t && M(t.remove) && M(t.add) && M(t.unsubscribe))
  );
}
function Zc(t) {
  M(t) ? t() : t.unsubscribe();
}
var Ae = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var Qt = {
  setTimeout(t, e, ...r) {
    let { delegate: n } = Qt;
    return n?.setTimeout ? n.setTimeout(t, e, ...r) : setTimeout(t, e, ...r);
  },
  clearTimeout(t) {
    let { delegate: e } = Qt;
    return (e?.clearTimeout || clearTimeout)(t);
  },
  delegate: void 0,
};
function Yr(t) {
  Qt.setTimeout(() => {
    let { onUnhandledError: e } = Ae;
    if (e) e(t);
    else throw t;
  });
}
function Mt() {}
var Yc = ps("C", void 0, void 0);
function Qc(t) {
  return ps("E", void 0, t);
}
function Kc(t) {
  return ps("N", t, void 0);
}
function ps(t, e, r) {
  return { kind: t, value: e, error: r };
}
var _t = null;
function Kt(t) {
  if (Ae.useDeprecatedSynchronousErrorHandling) {
    let e = !_t;
    if ((e && (_t = { errorThrown: !1, error: null }), t(), e)) {
      let { errorThrown: r, error: n } = _t;
      if (((_t = null), r)) throw n;
    }
  } else t();
}
function Jc(t) {
  Ae.useDeprecatedSynchronousErrorHandling &&
    _t &&
    ((_t.errorThrown = !0), (_t.error = t));
}
var St = class extends G {
    constructor(e) {
      super(),
        (this.isStopped = !1),
        e
          ? ((this.destination = e), Zr(e) && e.add(this))
          : (this.destination = Vg);
    }
    static create(e, r, n) {
      return new Jt(e, r, n);
    }
    next(e) {
      this.isStopped ? ms(Kc(e), this) : this._next(e);
    }
    error(e) {
      this.isStopped
        ? ms(Qc(e), this)
        : ((this.isStopped = !0), this._error(e));
    }
    complete() {
      this.isStopped ? ms(Yc, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(e) {
      this.destination.next(e);
    }
    _error(e) {
      try {
        this.destination.error(e);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  kg = Function.prototype.bind;
function gs(t, e) {
  return kg.call(t, e);
}
var vs = class {
    constructor(e) {
      this.partialObserver = e;
    }
    next(e) {
      let { partialObserver: r } = this;
      if (r.next)
        try {
          r.next(e);
        } catch (n) {
          Qr(n);
        }
    }
    error(e) {
      let { partialObserver: r } = this;
      if (r.error)
        try {
          r.error(e);
        } catch (n) {
          Qr(n);
        }
      else Qr(e);
    }
    complete() {
      let { partialObserver: e } = this;
      if (e.complete)
        try {
          e.complete();
        } catch (r) {
          Qr(r);
        }
    }
  },
  Jt = class extends St {
    constructor(e, r, n) {
      super();
      let i;
      if (M(e) || !e)
        i = { next: e ?? void 0, error: r ?? void 0, complete: n ?? void 0 };
      else {
        let o;
        this && Ae.useDeprecatedNextContext
          ? ((o = Object.create(e)),
            (o.unsubscribe = () => this.unsubscribe()),
            (i = {
              next: e.next && gs(e.next, o),
              error: e.error && gs(e.error, o),
              complete: e.complete && gs(e.complete, o),
            }))
          : (i = e);
      }
      this.destination = new vs(i);
    }
  };
function Qr(t) {
  Ae.useDeprecatedSynchronousErrorHandling ? Jc(t) : Yr(t);
}
function Lg(t) {
  throw t;
}
function ms(t, e) {
  let { onStoppedNotification: r } = Ae;
  r && Qt.setTimeout(() => r(t, e));
}
var Vg = { closed: !0, next: Mt, error: Lg, complete: Mt };
var Xt = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function fe(t) {
  return t;
}
function ys(...t) {
  return Ds(t);
}
function Ds(t) {
  return t.length === 0
    ? fe
    : t.length === 1
    ? t[0]
    : function (r) {
        return t.reduce((n, i) => i(n), r);
      };
}
var O = (() => {
  class t {
    constructor(r) {
      r && (this._subscribe = r);
    }
    lift(r) {
      let n = new t();
      return (n.source = this), (n.operator = r), n;
    }
    subscribe(r, n, i) {
      let o = Ug(r) ? r : new Jt(r, n, i);
      return (
        Kt(() => {
          let { operator: s, source: a } = this;
          o.add(
            s ? s.call(o, a) : a ? this._subscribe(o) : this._trySubscribe(o)
          );
        }),
        o
      );
    }
    _trySubscribe(r) {
      try {
        return this._subscribe(r);
      } catch (n) {
        r.error(n);
      }
    }
    forEach(r, n) {
      return (
        (n = Xc(n)),
        new n((i, o) => {
          let s = new Jt({
            next: (a) => {
              try {
                r(a);
              } catch (u) {
                o(u), s.unsubscribe();
              }
            },
            error: o,
            complete: i,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(r) {
      var n;
      return (n = this.source) === null || n === void 0
        ? void 0
        : n.subscribe(r);
    }
    [Xt]() {
      return this;
    }
    pipe(...r) {
      return Ds(r)(this);
    }
    toPromise(r) {
      return (
        (r = Xc(r)),
        new r((n, i) => {
          let o;
          this.subscribe(
            (s) => (o = s),
            (s) => i(s),
            () => n(o)
          );
        })
      );
    }
  }
  return (t.create = (e) => new t(e)), t;
})();
function Xc(t) {
  var e;
  return (e = t ?? Ae.Promise) !== null && e !== void 0 ? e : Promise;
}
function jg(t) {
  return t && M(t.next) && M(t.error) && M(t.complete);
}
function Ug(t) {
  return (t && t instanceof St) || (jg(t) && Zr(t));
}
function ws(t) {
  return M(t?.lift);
}
function x(t) {
  return (e) => {
    if (ws(e))
      return e.lift(function (r) {
        try {
          return t(r, this);
        } catch (n) {
          this.error(n);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function T(t, e, r, n, i) {
  return new Cs(t, e, r, n, i);
}
var Cs = class extends St {
  constructor(e, r, n, i, o, s) {
    super(e),
      (this.onFinalize = o),
      (this.shouldUnsubscribe = s),
      (this._next = r
        ? function (a) {
            try {
              r(a);
            } catch (u) {
              e.error(u);
            }
          }
        : super._next),
      (this._error = i
        ? function (a) {
            try {
              i(a);
            } catch (u) {
              e.error(u);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = n
        ? function () {
            try {
              n();
            } catch (a) {
              e.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var e;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: r } = this;
      super.unsubscribe(),
        !r && ((e = this.onFinalize) === null || e === void 0 || e.call(this));
    }
  }
};
function en() {
  return x((t, e) => {
    let r = null;
    t._refCount++;
    let n = T(e, void 0, void 0, void 0, () => {
      if (!t || t._refCount <= 0 || 0 < --t._refCount) {
        r = null;
        return;
      }
      let i = t._connection,
        o = r;
      (r = null), i && (!o || i === o) && i.unsubscribe(), e.unsubscribe();
    });
    t.subscribe(n), n.closed || (r = t.connect());
  });
}
var tn = class extends O {
  constructor(e, r) {
    super(),
      (this.source = e),
      (this.subjectFactory = r),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      ws(e) && (this.lift = e.lift);
  }
  _subscribe(e) {
    return this.getSubject().subscribe(e);
  }
  getSubject() {
    let e = this._subject;
    return (
      (!e || e.isStopped) && (this._subject = this.subjectFactory()),
      this._subject
    );
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: e } = this;
    (this._subject = this._connection = null), e?.unsubscribe();
  }
  connect() {
    let e = this._connection;
    if (!e) {
      e = this._connection = new G();
      let r = this.getSubject();
      e.add(
        this.source.subscribe(
          T(
            r,
            void 0,
            () => {
              this._teardown(), r.complete();
            },
            (n) => {
              this._teardown(), r.error(n);
            },
            () => this._teardown()
          )
        )
      ),
        e.closed && ((this._connection = null), (e = G.EMPTY));
    }
    return e;
  }
  refCount() {
    return en()(this);
  }
};
var el = Yt(
  (t) =>
    function () {
      t(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    }
);
var re = (() => {
    class t extends O {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(r) {
        let n = new Kr(this, this);
        return (n.operator = r), n;
      }
      _throwIfClosed() {
        if (this.closed) throw new el();
      }
      next(r) {
        Kt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let n of this.currentObservers) n.next(r);
          }
        });
      }
      error(r) {
        Kt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = r);
            let { observers: n } = this;
            for (; n.length; ) n.shift().error(r);
          }
        });
      }
      complete() {
        Kt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: r } = this;
            for (; r.length; ) r.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }
      get observed() {
        var r;
        return (
          ((r = this.observers) === null || r === void 0 ? void 0 : r.length) >
          0
        );
      }
      _trySubscribe(r) {
        return this._throwIfClosed(), super._trySubscribe(r);
      }
      _subscribe(r) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(r),
          this._innerSubscribe(r)
        );
      }
      _innerSubscribe(r) {
        let { hasError: n, isStopped: i, observers: o } = this;
        return n || i
          ? hs
          : ((this.currentObservers = null),
            o.push(r),
            new G(() => {
              (this.currentObservers = null), bt(o, r);
            }));
      }
      _checkFinalizedStatuses(r) {
        let { hasError: n, thrownError: i, isStopped: o } = this;
        n ? r.error(i) : o && r.complete();
      }
      asObservable() {
        let r = new O();
        return (r.source = this), r;
      }
    }
    return (t.create = (e, r) => new Kr(e, r)), t;
  })(),
  Kr = class extends re {
    constructor(e, r) {
      super(), (this.destination = e), (this.source = r);
    }
    next(e) {
      var r, n;
      (n =
        (r = this.destination) === null || r === void 0 ? void 0 : r.next) ===
        null ||
        n === void 0 ||
        n.call(r, e);
    }
    error(e) {
      var r, n;
      (n =
        (r = this.destination) === null || r === void 0 ? void 0 : r.error) ===
        null ||
        n === void 0 ||
        n.call(r, e);
    }
    complete() {
      var e, r;
      (r =
        (e = this.destination) === null || e === void 0
          ? void 0
          : e.complete) === null ||
        r === void 0 ||
        r.call(e);
    }
    _subscribe(e) {
      var r, n;
      return (n =
        (r = this.source) === null || r === void 0
          ? void 0
          : r.subscribe(e)) !== null && n !== void 0
        ? n
        : hs;
    }
  };
var K = class extends re {
  constructor(e) {
    super(), (this._value = e);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(e) {
    let r = super._subscribe(e);
    return !r.closed && e.next(this._value), r;
  }
  getValue() {
    let { hasError: e, thrownError: r, _value: n } = this;
    if (e) throw r;
    return this._throwIfClosed(), n;
  }
  next(e) {
    super.next((this._value = e));
  }
};
var Bn = {
  now() {
    return (Bn.delegate || Date).now();
  },
  delegate: void 0,
};
var Es = class extends re {
  constructor(e = 1 / 0, r = 1 / 0, n = Bn) {
    super(),
      (this._bufferSize = e),
      (this._windowTime = r),
      (this._timestampProvider = n),
      (this._buffer = []),
      (this._infiniteTimeWindow = !0),
      (this._infiniteTimeWindow = r === 1 / 0),
      (this._bufferSize = Math.max(1, e)),
      (this._windowTime = Math.max(1, r));
  }
  next(e) {
    let {
      isStopped: r,
      _buffer: n,
      _infiniteTimeWindow: i,
      _timestampProvider: o,
      _windowTime: s,
    } = this;
    r || (n.push(e), !i && n.push(o.now() + s)),
      this._trimBuffer(),
      super.next(e);
  }
  _subscribe(e) {
    this._throwIfClosed(), this._trimBuffer();
    let r = this._innerSubscribe(e),
      { _infiniteTimeWindow: n, _buffer: i } = this,
      o = i.slice();
    for (let s = 0; s < o.length && !e.closed; s += n ? 1 : 2) e.next(o[s]);
    return this._checkFinalizedStatuses(e), r;
  }
  _trimBuffer() {
    let {
        _bufferSize: e,
        _timestampProvider: r,
        _buffer: n,
        _infiniteTimeWindow: i,
      } = this,
      o = (i ? 1 : 2) * e;
    if ((e < 1 / 0 && o < n.length && n.splice(0, n.length - o), !i)) {
      let s = r.now(),
        a = 0;
      for (let u = 1; u < n.length && n[u] <= s; u += 2) a = u;
      a && n.splice(0, a + 1);
    }
  }
};
var Jr = class extends G {
  constructor(e, r) {
    super();
  }
  schedule(e, r = 0) {
    return this;
  }
};
var Hn = {
  setInterval(t, e, ...r) {
    let { delegate: n } = Hn;
    return n?.setInterval ? n.setInterval(t, e, ...r) : setInterval(t, e, ...r);
  },
  clearInterval(t) {
    let { delegate: e } = Hn;
    return (e?.clearInterval || clearInterval)(t);
  },
  delegate: void 0,
};
var Xr = class extends Jr {
  constructor(e, r) {
    super(e, r), (this.scheduler = e), (this.work = r), (this.pending = !1);
  }
  schedule(e, r = 0) {
    var n;
    if (this.closed) return this;
    this.state = e;
    let i = this.id,
      o = this.scheduler;
    return (
      i != null && (this.id = this.recycleAsyncId(o, i, r)),
      (this.pending = !0),
      (this.delay = r),
      (this.id =
        (n = this.id) !== null && n !== void 0
          ? n
          : this.requestAsyncId(o, this.id, r)),
      this
    );
  }
  requestAsyncId(e, r, n = 0) {
    return Hn.setInterval(e.flush.bind(e, this), n);
  }
  recycleAsyncId(e, r, n = 0) {
    if (n != null && this.delay === n && this.pending === !1) return r;
    r != null && Hn.clearInterval(r);
  }
  execute(e, r) {
    if (this.closed) return new Error("executing a cancelled action");
    this.pending = !1;
    let n = this._execute(e, r);
    if (n) return n;
    this.pending === !1 &&
      this.id != null &&
      (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }
  _execute(e, r) {
    let n = !1,
      i;
    try {
      this.work(e);
    } catch (o) {
      (n = !0), (i = o || new Error("Scheduled action threw falsy error"));
    }
    if (n) return this.unsubscribe(), i;
  }
  unsubscribe() {
    if (!this.closed) {
      let { id: e, scheduler: r } = this,
        { actions: n } = r;
      (this.work = this.state = this.scheduler = null),
        (this.pending = !1),
        bt(n, this),
        e != null && (this.id = this.recycleAsyncId(r, e, null)),
        (this.delay = null),
        super.unsubscribe();
    }
  }
};
var nn = class t {
  constructor(e, r = t.now) {
    (this.schedulerActionCtor = e), (this.now = r);
  }
  schedule(e, r = 0, n) {
    return new this.schedulerActionCtor(this, e).schedule(n, r);
  }
};
nn.now = Bn.now;
var ei = class extends nn {
  constructor(e, r = nn.now) {
    super(e, r), (this.actions = []), (this._active = !1);
  }
  flush(e) {
    let { actions: r } = this;
    if (this._active) {
      r.push(e);
      return;
    }
    let n;
    this._active = !0;
    do if ((n = e.execute(e.state, e.delay))) break;
    while ((e = r.shift()));
    if (((this._active = !1), n)) {
      for (; (e = r.shift()); ) e.unsubscribe();
      throw n;
    }
  }
};
var zn = new ei(Xr),
  tl = zn;
var ae = new O((t) => t.complete());
function ti(t) {
  return t && M(t.schedule);
}
function Is(t) {
  return t[t.length - 1];
}
function ni(t) {
  return M(Is(t)) ? t.pop() : void 0;
}
function ke(t) {
  return ti(Is(t)) ? t.pop() : void 0;
}
function nl(t, e) {
  return typeof Is(t) == "number" ? t.pop() : e;
}
function il(t, e, r, n) {
  function i(o) {
    return o instanceof r
      ? o
      : new r(function (s) {
          s(o);
        });
  }
  return new (r || (r = Promise))(function (o, s) {
    function a(l) {
      try {
        c(n.next(l));
      } catch (d) {
        s(d);
      }
    }
    function u(l) {
      try {
        c(n.throw(l));
      } catch (d) {
        s(d);
      }
    }
    function c(l) {
      l.done ? o(l.value) : i(l.value).then(a, u);
    }
    c((n = n.apply(t, e || [])).next());
  });
}
function rl(t) {
  var e = typeof Symbol == "function" && Symbol.iterator,
    r = e && t[e],
    n = 0;
  if (r) return r.call(t);
  if (t && typeof t.length == "number")
    return {
      next: function () {
        return (
          t && n >= t.length && (t = void 0), { value: t && t[n++], done: !t }
        );
      },
    };
  throw new TypeError(
    e ? "Object is not iterable." : "Symbol.iterator is not defined."
  );
}
function Tt(t) {
  return this instanceof Tt ? ((this.v = t), this) : new Tt(t);
}
function ol(t, e, r) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var n = r.apply(t, e || []),
    i,
    o = [];
  return (
    (i = {}),
    s("next"),
    s("throw"),
    s("return"),
    (i[Symbol.asyncIterator] = function () {
      return this;
    }),
    i
  );
  function s(f) {
    n[f] &&
      (i[f] = function (h) {
        return new Promise(function (m, F) {
          o.push([f, h, m, F]) > 1 || a(f, h);
        });
      });
  }
  function a(f, h) {
    try {
      u(n[f](h));
    } catch (m) {
      d(o[0][3], m);
    }
  }
  function u(f) {
    f.value instanceof Tt
      ? Promise.resolve(f.value.v).then(c, l)
      : d(o[0][2], f);
  }
  function c(f) {
    a("next", f);
  }
  function l(f) {
    a("throw", f);
  }
  function d(f, h) {
    f(h), o.shift(), o.length && a(o[0][0], o[0][1]);
  }
}
function sl(t) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var e = t[Symbol.asyncIterator],
    r;
  return e
    ? e.call(t)
    : ((t = typeof rl == "function" ? rl(t) : t[Symbol.iterator]()),
      (r = {}),
      n("next"),
      n("throw"),
      n("return"),
      (r[Symbol.asyncIterator] = function () {
        return this;
      }),
      r);
  function n(o) {
    r[o] =
      t[o] &&
      function (s) {
        return new Promise(function (a, u) {
          (s = t[o](s)), i(a, u, s.done, s.value);
        });
      };
  }
  function i(o, s, a, u) {
    Promise.resolve(u).then(function (c) {
      o({ value: c, done: a });
    }, s);
  }
}
var ri = (t) => t && typeof t.length == "number" && typeof t != "function";
function ii(t) {
  return M(t?.then);
}
function oi(t) {
  return M(t[Xt]);
}
function si(t) {
  return Symbol.asyncIterator && M(t?.[Symbol.asyncIterator]);
}
function ai(t) {
  return new TypeError(
    `You provided ${
      t !== null && typeof t == "object" ? "an invalid object" : `'${t}'`
    } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  );
}
function $g() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var ui = $g();
function ci(t) {
  return M(t?.[ui]);
}
function li(t) {
  return ol(this, arguments, function* () {
    let r = t.getReader();
    try {
      for (;;) {
        let { value: n, done: i } = yield Tt(r.read());
        if (i) return yield Tt(void 0);
        yield yield Tt(n);
      }
    } finally {
      r.releaseLock();
    }
  });
}
function di(t) {
  return M(t?.getReader);
}
function H(t) {
  if (t instanceof O) return t;
  if (t != null) {
    if (oi(t)) return Bg(t);
    if (ri(t)) return Hg(t);
    if (ii(t)) return zg(t);
    if (si(t)) return al(t);
    if (ci(t)) return Gg(t);
    if (di(t)) return Wg(t);
  }
  throw ai(t);
}
function Bg(t) {
  return new O((e) => {
    let r = t[Xt]();
    if (M(r.subscribe)) return r.subscribe(e);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable"
    );
  });
}
function Hg(t) {
  return new O((e) => {
    for (let r = 0; r < t.length && !e.closed; r++) e.next(t[r]);
    e.complete();
  });
}
function zg(t) {
  return new O((e) => {
    t.then(
      (r) => {
        e.closed || (e.next(r), e.complete());
      },
      (r) => e.error(r)
    ).then(null, Yr);
  });
}
function Gg(t) {
  return new O((e) => {
    for (let r of t) if ((e.next(r), e.closed)) return;
    e.complete();
  });
}
function al(t) {
  return new O((e) => {
    qg(t, e).catch((r) => e.error(r));
  });
}
function Wg(t) {
  return al(li(t));
}
function qg(t, e) {
  var r, n, i, o;
  return il(this, void 0, void 0, function* () {
    try {
      for (r = sl(t); (n = yield r.next()), !n.done; ) {
        let s = n.value;
        if ((e.next(s), e.closed)) return;
      }
    } catch (s) {
      i = { error: s };
    } finally {
      try {
        n && !n.done && (o = r.return) && (yield o.call(r));
      } finally {
        if (i) throw i.error;
      }
    }
    e.complete();
  });
}
function ue(t, e, r, n = 0, i = !1) {
  let o = e.schedule(function () {
    r(), i ? t.add(this.schedule(null, n)) : this.unsubscribe();
  }, n);
  if ((t.add(o), !i)) return o;
}
function fi(t, e = 0) {
  return x((r, n) => {
    r.subscribe(
      T(
        n,
        (i) => ue(n, t, () => n.next(i), e),
        () => ue(n, t, () => n.complete(), e),
        (i) => ue(n, t, () => n.error(i), e)
      )
    );
  });
}
function hi(t, e = 0) {
  return x((r, n) => {
    n.add(t.schedule(() => r.subscribe(n), e));
  });
}
function ul(t, e) {
  return H(t).pipe(hi(e), fi(e));
}
function cl(t, e) {
  return H(t).pipe(hi(e), fi(e));
}
function ll(t, e) {
  return new O((r) => {
    let n = 0;
    return e.schedule(function () {
      n === t.length
        ? r.complete()
        : (r.next(t[n++]), r.closed || this.schedule());
    });
  });
}
function dl(t, e) {
  return new O((r) => {
    let n;
    return (
      ue(r, e, () => {
        (n = t[ui]()),
          ue(
            r,
            e,
            () => {
              let i, o;
              try {
                ({ value: i, done: o } = n.next());
              } catch (s) {
                r.error(s);
                return;
              }
              o ? r.complete() : r.next(i);
            },
            0,
            !0
          );
      }),
      () => M(n?.return) && n.return()
    );
  });
}
function pi(t, e) {
  if (!t) throw new Error("Iterable cannot be null");
  return new O((r) => {
    ue(r, e, () => {
      let n = t[Symbol.asyncIterator]();
      ue(
        r,
        e,
        () => {
          n.next().then((i) => {
            i.done ? r.complete() : r.next(i.value);
          });
        },
        0,
        !0
      );
    });
  });
}
function fl(t, e) {
  return pi(li(t), e);
}
function hl(t, e) {
  if (t != null) {
    if (oi(t)) return ul(t, e);
    if (ri(t)) return ll(t, e);
    if (ii(t)) return cl(t, e);
    if (si(t)) return pi(t, e);
    if (ci(t)) return dl(t, e);
    if (di(t)) return fl(t, e);
  }
  throw ai(t);
}
function L(t, e) {
  return e ? hl(t, e) : H(t);
}
function E(...t) {
  let e = ke(t);
  return L(t, e);
}
function rn(t, e) {
  let r = M(t) ? t : () => t,
    n = (i) => i.error(r());
  return new O(e ? (i) => e.schedule(n, 0, i) : n);
}
function bs(t) {
  return !!t && (t instanceof O || (M(t.lift) && M(t.subscribe)));
}
var Qe = Yt(
  (t) =>
    function () {
      t(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence");
    }
);
function pl(t) {
  return t instanceof Date && !isNaN(t);
}
function _(t, e) {
  return x((r, n) => {
    let i = 0;
    r.subscribe(
      T(n, (o) => {
        n.next(t.call(e, o, i++));
      })
    );
  });
}
var { isArray: Zg } = Array;
function Yg(t, e) {
  return Zg(e) ? t(...e) : t(e);
}
function gi(t) {
  return _((e) => Yg(t, e));
}
var { isArray: Qg } = Array,
  { getPrototypeOf: Kg, prototype: Jg, keys: Xg } = Object;
function mi(t) {
  if (t.length === 1) {
    let e = t[0];
    if (Qg(e)) return { args: e, keys: null };
    if (em(e)) {
      let r = Xg(e);
      return { args: r.map((n) => e[n]), keys: r };
    }
  }
  return { args: t, keys: null };
}
function em(t) {
  return t && typeof t == "object" && Kg(t) === Jg;
}
function vi(t, e) {
  return t.reduce((r, n, i) => ((r[n] = e[i]), r), {});
}
function Gn(...t) {
  let e = ke(t),
    r = ni(t),
    { args: n, keys: i } = mi(t);
  if (n.length === 0) return L([], e);
  let o = new O(tm(n, e, i ? (s) => vi(i, s) : fe));
  return r ? o.pipe(gi(r)) : o;
}
function tm(t, e, r = fe) {
  return (n) => {
    gl(
      e,
      () => {
        let { length: i } = t,
          o = new Array(i),
          s = i,
          a = i;
        for (let u = 0; u < i; u++)
          gl(
            e,
            () => {
              let c = L(t[u], e),
                l = !1;
              c.subscribe(
                T(
                  n,
                  (d) => {
                    (o[u] = d), l || ((l = !0), a--), a || n.next(r(o.slice()));
                  },
                  () => {
                    --s || n.complete();
                  }
                )
              );
            },
            n
          );
      },
      n
    );
  };
}
function gl(t, e, r) {
  t ? ue(r, t, e) : e();
}
function ml(t, e, r, n, i, o, s, a) {
  let u = [],
    c = 0,
    l = 0,
    d = !1,
    f = () => {
      d && !u.length && !c && e.complete();
    },
    h = (F) => (c < n ? m(F) : u.push(F)),
    m = (F) => {
      o && e.next(F), c++;
      let b = !1;
      H(r(F, l++)).subscribe(
        T(
          e,
          (C) => {
            i?.(C), o ? h(C) : e.next(C);
          },
          () => {
            b = !0;
          },
          void 0,
          () => {
            if (b)
              try {
                for (c--; u.length && c < n; ) {
                  let C = u.shift();
                  s ? ue(e, s, () => m(C)) : m(C);
                }
                f();
              } catch (C) {
                e.error(C);
              }
          }
        )
      );
    };
  return (
    t.subscribe(
      T(e, h, () => {
        (d = !0), f();
      })
    ),
    () => {
      a?.();
    }
  );
}
function z(t, e, r = 1 / 0) {
  return M(e)
    ? z((n, i) => _((o, s) => e(n, o, i, s))(H(t(n, i))), r)
    : (typeof e == "number" && (r = e), x((n, i) => ml(n, i, t, r)));
}
function it(t = 1 / 0) {
  return z(fe, t);
}
function vl() {
  return it(1);
}
function ot(...t) {
  return vl()(L(t, ke(t)));
}
function yi(t) {
  return new O((e) => {
    H(t()).subscribe(e);
  });
}
function Ms(...t) {
  let e = ni(t),
    { args: r, keys: n } = mi(t),
    i = new O((o) => {
      let { length: s } = r;
      if (!s) {
        o.complete();
        return;
      }
      let a = new Array(s),
        u = s,
        c = s;
      for (let l = 0; l < s; l++) {
        let d = !1;
        H(r[l]).subscribe(
          T(
            o,
            (f) => {
              d || ((d = !0), c--), (a[l] = f);
            },
            () => u--,
            void 0,
            () => {
              (!u || !d) && (c || o.next(n ? vi(n, a) : a), o.complete());
            }
          )
        );
      }
    });
  return e ? i.pipe(gi(e)) : i;
}
function yl(t = 0, e, r = tl) {
  let n = -1;
  return (
    e != null && (ti(e) ? (r = e) : (n = e)),
    new O((i) => {
      let o = pl(t) ? +t - r.now() : t;
      o < 0 && (o = 0);
      let s = 0;
      return r.schedule(function () {
        i.closed ||
          (i.next(s++), 0 <= n ? this.schedule(void 0, n) : i.complete());
      }, o);
    })
  );
}
function nm(...t) {
  let e = ke(t),
    r = nl(t, 1 / 0),
    n = t;
  return n.length ? (n.length === 1 ? H(n[0]) : it(r)(L(n, e))) : ae;
}
function ee(t, e) {
  return x((r, n) => {
    let i = 0;
    r.subscribe(T(n, (o) => t.call(e, o, i++) && n.next(o)));
  });
}
function st(t) {
  return x((e, r) => {
    let n = null,
      i = !1,
      o;
    (n = e.subscribe(
      T(r, void 0, void 0, (s) => {
        (o = H(t(s, st(t)(e)))),
          n ? (n.unsubscribe(), (n = null), o.subscribe(r)) : (i = !0);
      })
    )),
      i && (n.unsubscribe(), (n = null), o.subscribe(r));
  });
}
function Dl(t, e, r, n, i) {
  return (o, s) => {
    let a = r,
      u = e,
      c = 0;
    o.subscribe(
      T(
        s,
        (l) => {
          let d = c++;
          (u = a ? t(u, l, d) : ((a = !0), l)), n && s.next(u);
        },
        i &&
          (() => {
            a && s.next(u), s.complete();
          })
      )
    );
  };
}
function Ke(t, e) {
  return M(e) ? z(t, e, 1) : z(t, 1);
}
function rm(t, e = zn) {
  return x((r, n) => {
    let i = null,
      o = null,
      s = null,
      a = () => {
        if (i) {
          i.unsubscribe(), (i = null);
          let c = o;
          (o = null), n.next(c);
        }
      };
    function u() {
      let c = s + t,
        l = e.now();
      if (l < c) {
        (i = this.schedule(void 0, c - l)), n.add(i);
        return;
      }
      a();
    }
    r.subscribe(
      T(
        n,
        (c) => {
          (o = c), (s = e.now()), i || ((i = e.schedule(u, t)), n.add(i));
        },
        () => {
          a(), n.complete();
        },
        void 0,
        () => {
          o = i = null;
        }
      )
    );
  });
}
function at(t) {
  return x((e, r) => {
    let n = !1;
    e.subscribe(
      T(
        r,
        (i) => {
          (n = !0), r.next(i);
        },
        () => {
          n || r.next(t), r.complete();
        }
      )
    );
  });
}
function Ie(t) {
  return t <= 0
    ? () => ae
    : x((e, r) => {
        let n = 0;
        e.subscribe(
          T(r, (i) => {
            ++n <= t && (r.next(i), t <= n && r.complete());
          })
        );
      });
}
function wl() {
  return x((t, e) => {
    t.subscribe(T(e, Mt));
  });
}
function Wn(t) {
  return _(() => t);
}
function _s(t, e) {
  return e
    ? (r) => ot(e.pipe(Ie(1), wl()), r.pipe(_s(t)))
    : z((r, n) => H(t(r, n)).pipe(Ie(1), Wn(r)));
}
function im(t, e = zn) {
  let r = yl(t, e);
  return _s(() => r);
}
function Di(t = om) {
  return x((e, r) => {
    let n = !1;
    e.subscribe(
      T(
        r,
        (i) => {
          (n = !0), r.next(i);
        },
        () => (n ? r.complete() : r.error(t()))
      )
    );
  });
}
function om() {
  return new Qe();
}
function ut(t) {
  return x((e, r) => {
    try {
      e.subscribe(r);
    } finally {
      r.add(t);
    }
  });
}
function Le(t, e) {
  let r = arguments.length >= 2;
  return (n) =>
    n.pipe(
      t ? ee((i, o) => t(i, o, n)) : fe,
      Ie(1),
      r ? at(e) : Di(() => new Qe())
    );
}
function on(t) {
  return t <= 0
    ? () => ae
    : x((e, r) => {
        let n = [];
        e.subscribe(
          T(
            r,
            (i) => {
              n.push(i), t < n.length && n.shift();
            },
            () => {
              for (let i of n) r.next(i);
              r.complete();
            },
            void 0,
            () => {
              n = null;
            }
          )
        );
      });
}
function Ss(t, e) {
  let r = arguments.length >= 2;
  return (n) =>
    n.pipe(
      t ? ee((i, o) => t(i, o, n)) : fe,
      on(1),
      r ? at(e) : Di(() => new Qe())
    );
}
function Ts(t, e) {
  return x(Dl(t, e, arguments.length >= 2, !0));
}
function sm(t) {
  return ee((e, r) => t <= r);
}
function As(...t) {
  let e = ke(t);
  return x((r, n) => {
    (e ? ot(t, r, e) : ot(t, r)).subscribe(n);
  });
}
function ce(t, e) {
  return x((r, n) => {
    let i = null,
      o = 0,
      s = !1,
      a = () => s && !i && n.complete();
    r.subscribe(
      T(
        n,
        (u) => {
          i?.unsubscribe();
          let c = 0,
            l = o++;
          H(t(u, l)).subscribe(
            (i = T(
              n,
              (d) => n.next(e ? e(u, d, l, c++) : d),
              () => {
                (i = null), a();
              }
            ))
          );
        },
        () => {
          (s = !0), a();
        }
      )
    );
  });
}
function wi(t) {
  return x((e, r) => {
    H(t).subscribe(T(r, () => r.complete(), Mt)), !r.closed && e.subscribe(r);
  });
}
function Z(t, e, r) {
  let n = M(t) || e || r ? { next: t, error: e, complete: r } : t;
  return n
    ? x((i, o) => {
        var s;
        (s = n.subscribe) === null || s === void 0 || s.call(n);
        let a = !0;
        i.subscribe(
          T(
            o,
            (u) => {
              var c;
              (c = n.next) === null || c === void 0 || c.call(n, u), o.next(u);
            },
            () => {
              var u;
              (a = !1),
                (u = n.complete) === null || u === void 0 || u.call(n),
                o.complete();
            },
            (u) => {
              var c;
              (a = !1),
                (c = n.error) === null || c === void 0 || c.call(n, u),
                o.error(u);
            },
            () => {
              var u, c;
              a && ((u = n.unsubscribe) === null || u === void 0 || u.call(n)),
                (c = n.finalize) === null || c === void 0 || c.call(n);
            }
          )
        );
      })
    : fe;
}
var od = "https://g.co/ng/security#xss",
  v = class extends Error {
    constructor(e, r) {
      super(Xi(e, r)), (this.code = e);
    }
  };
function Xi(t, e) {
  return `${`NG0${Math.abs(t)}`}${e ? ": " + e : ""}`;
}
function j(t) {
  for (let e in t) if (t[e] === j) return e;
  throw Error("Could not find renamed property on target object.");
}
function um(t, e) {
  for (let r in e) e.hasOwnProperty(r) && !t.hasOwnProperty(r) && (t[r] = e[r]);
}
function de(t) {
  if (typeof t == "string") return t;
  if (Array.isArray(t)) return "[" + t.map(de).join(", ") + "]";
  if (t == null) return "" + t;
  if (t.overriddenName) return `${t.overriddenName}`;
  if (t.name) return `${t.name}`;
  let e = t.toString();
  if (e == null) return "" + e;
  let r = e.indexOf(`
`);
  return r === -1 ? e : e.substring(0, r);
}
function Cl(t, e) {
  return t == null || t === ""
    ? e === null
      ? ""
      : e
    : e == null || e === ""
    ? t
    : t + " " + e;
}
var cm = j({ __forward_ref__: j });
function wn(t) {
  return (
    (t.__forward_ref__ = wn),
    (t.toString = function () {
      return de(this());
    }),
    t
  );
}
function ie(t) {
  return sd(t) ? t() : t;
}
function sd(t) {
  return (
    typeof t == "function" && t.hasOwnProperty(cm) && t.__forward_ref__ === wn
  );
}
function ad(t) {
  return t && !!t.ɵproviders;
}
var lm = j({ ɵcmp: j }),
  dm = j({ ɵdir: j }),
  fm = j({ ɵpipe: j }),
  hm = j({ ɵmod: j }),
  Ni = j({ ɵfac: j }),
  qn = j({ __NG_ELEMENT_ID__: j }),
  El = j({ __NG_ENV_ID__: j });
function eo(t) {
  return typeof t == "string" ? t : t == null ? "" : String(t);
}
function pm(t) {
  return typeof t == "function"
    ? t.name || t.toString()
    : typeof t == "object" && t != null && typeof t.type == "function"
    ? t.type.name || t.type.toString()
    : eo(t);
}
function gm(t, e) {
  let r = e ? `. Dependency path: ${e.join(" > ")} > ${t}` : "";
  throw new v(-200, t);
}
function La(t, e) {
  throw new v(-201, !1);
}
function w(t) {
  return {
    token: t.token,
    providedIn: t.providedIn || null,
    factory: t.factory,
    value: void 0,
  };
}
function me(t) {
  return { providers: t.providers || [], imports: t.imports || [] };
}
function to(t) {
  return Il(t, cd) || Il(t, ld);
}
function ud(t) {
  return to(t) !== null;
}
function Il(t, e) {
  return t.hasOwnProperty(e) ? t[e] : null;
}
function mm(t) {
  let e = t && (t[cd] || t[ld]);
  return e || null;
}
function bl(t) {
  return t && (t.hasOwnProperty(Ml) || t.hasOwnProperty(vm)) ? t[Ml] : null;
}
var cd = j({ ɵprov: j }),
  Ml = j({ ɵinj: j }),
  ld = j({ ngInjectableDef: j }),
  vm = j({ ngInjectorDef: j }),
  N = (function (t) {
    return (
      (t[(t.Default = 0)] = "Default"),
      (t[(t.Host = 1)] = "Host"),
      (t[(t.Self = 2)] = "Self"),
      (t[(t.SkipSelf = 4)] = "SkipSelf"),
      (t[(t.Optional = 8)] = "Optional"),
      t
    );
  })(N || {}),
  zs;
function dd() {
  return zs;
}
function le(t) {
  let e = zs;
  return (zs = t), e;
}
function fd(t, e, r) {
  let n = to(t);
  if (n && n.providedIn == "root")
    return n.value === void 0 ? (n.value = n.factory()) : n.value;
  if (r & N.Optional) return null;
  if (e !== void 0) return e;
  La(t, "Injector");
}
var he = globalThis;
var y = class {
  constructor(e, r) {
    (this._desc = e),
      (this.ngMetadataName = "InjectionToken"),
      (this.ɵprov = void 0),
      typeof r == "number"
        ? (this.__NG_ELEMENT_ID__ = r)
        : r !== void 0 &&
          (this.ɵprov = w({
            token: this,
            providedIn: r.providedIn || "root",
            factory: r.factory,
          }));
  }
  get multi() {
    return this;
  }
  toString() {
    return `InjectionToken ${this._desc}`;
  }
};
var ym = {},
  Yn = ym,
  Gs = "__NG_DI_FLAG__",
  Ri = "ngTempTokenPath",
  Dm = "ngTokenPath",
  wm = /\n/gm,
  Cm = "\u0275",
  _l = "__source",
  ln;
function Em() {
  return ln;
}
function ct(t) {
  let e = ln;
  return (ln = t), e;
}
function Im(t, e = N.Default) {
  if (ln === void 0) throw new v(-203, !1);
  return ln === null
    ? fd(t, void 0, e)
    : ln.get(t, e & N.Optional ? null : void 0, e);
}
function D(t, e = N.Default) {
  return (dd() || Im)(ie(t), e);
}
function p(t, e = N.Default) {
  return D(t, no(e));
}
function no(t) {
  return typeof t > "u" || typeof t == "number"
    ? t
    : 0 | (t.optional && 8) | (t.host && 1) | (t.self && 2) | (t.skipSelf && 4);
}
function Ws(t) {
  let e = [];
  for (let r = 0; r < t.length; r++) {
    let n = ie(t[r]);
    if (Array.isArray(n)) {
      if (n.length === 0) throw new v(900, !1);
      let i,
        o = N.Default;
      for (let s = 0; s < n.length; s++) {
        let a = n[s],
          u = bm(a);
        typeof u == "number" ? (u === -1 ? (i = a.token) : (o |= u)) : (i = a);
      }
      e.push(D(i, o));
    } else e.push(D(n));
  }
  return e;
}
function hd(t, e) {
  return (t[Gs] = e), (t.prototype[Gs] = e), t;
}
function bm(t) {
  return t[Gs];
}
function Mm(t, e, r, n) {
  let i = t[Ri];
  throw (
    (e[_l] && i.unshift(e[_l]),
    (t.message = _m(
      `
` + t.message,
      i,
      r,
      n
    )),
    (t[Dm] = i),
    (t[Ri] = null),
    t)
  );
}
function _m(t, e, r, n = null) {
  t =
    t &&
    t.charAt(0) ===
      `
` &&
    t.charAt(1) == Cm
      ? t.slice(2)
      : t;
  let i = de(e);
  if (Array.isArray(e)) i = e.map(de).join(" -> ");
  else if (typeof e == "object") {
    let o = [];
    for (let s in e)
      if (e.hasOwnProperty(s)) {
        let a = e[s];
        o.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : de(a)));
      }
    i = `{${o.join(", ")}}`;
  }
  return `${r}${n ? "(" + n + ")" : ""}[${i}]: ${t.replace(
    wm,
    `
  `
  )}`;
}
function sr(t) {
  return { toString: t }.toString();
}
var pd = (function (t) {
    return (t[(t.OnPush = 0)] = "OnPush"), (t[(t.Default = 1)] = "Default"), t;
  })(pd || {}),
  $e = (function (t) {
    return (
      (t[(t.Emulated = 0)] = "Emulated"),
      (t[(t.None = 2)] = "None"),
      (t[(t.ShadowDom = 3)] = "ShadowDom"),
      t
    );
  })($e || {}),
  fn = {},
  be = [],
  ge = (function (t) {
    return (
      (t[(t.None = 0)] = "None"),
      (t[(t.SignalBased = 1)] = "SignalBased"),
      (t[(t.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
      t
    );
  })(ge || {});
function gd(t, e, r) {
  let n = t.length;
  for (;;) {
    let i = t.indexOf(e, r);
    if (i === -1) return i;
    if (i === 0 || t.charCodeAt(i - 1) <= 32) {
      let o = e.length;
      if (i + o === n || t.charCodeAt(i + o) <= 32) return i;
    }
    r = i + 1;
  }
}
function qs(t, e, r) {
  let n = 0;
  for (; n < r.length; ) {
    let i = r[n];
    if (typeof i == "number") {
      if (i !== 0) break;
      n++;
      let o = r[n++],
        s = r[n++],
        a = r[n++];
      t.setAttribute(e, s, a, o);
    } else {
      let o = i,
        s = r[++n];
      Tm(o) ? t.setProperty(e, o, s) : t.setAttribute(e, o, s), n++;
    }
  }
  return n;
}
function Sm(t) {
  return t === 3 || t === 4 || t === 6;
}
function Tm(t) {
  return t.charCodeAt(0) === 64;
}
function Qn(t, e) {
  if (!(e === null || e.length === 0))
    if (t === null || t.length === 0) t = e.slice();
    else {
      let r = -1;
      for (let n = 0; n < e.length; n++) {
        let i = e[n];
        typeof i == "number"
          ? (r = i)
          : r === 0 ||
            (r === -1 || r === 2
              ? Sl(t, r, i, null, e[++n])
              : Sl(t, r, i, null, null));
      }
    }
  return t;
}
function Sl(t, e, r, n, i) {
  let o = 0,
    s = t.length;
  if (e === -1) s = -1;
  else
    for (; o < t.length; ) {
      let a = t[o++];
      if (typeof a == "number") {
        if (a === e) {
          s = -1;
          break;
        } else if (a > e) {
          s = o - 1;
          break;
        }
      }
    }
  for (; o < t.length; ) {
    let a = t[o];
    if (typeof a == "number") break;
    if (a === r) {
      if (n === null) {
        i !== null && (t[o + 1] = i);
        return;
      } else if (n === t[o + 1]) {
        t[o + 2] = i;
        return;
      }
    }
    o++, n !== null && o++, i !== null && o++;
  }
  s !== -1 && (t.splice(s, 0, e), (o = s + 1)),
    t.splice(o++, 0, r),
    n !== null && t.splice(o++, 0, n),
    i !== null && t.splice(o++, 0, i);
}
var md = "ng-template";
function Am(t, e, r) {
  let n = 0,
    i = !0;
  for (; n < t.length; ) {
    let o = t[n++];
    if (typeof o == "string" && i) {
      let s = t[n++];
      if (r && o === "class" && gd(s.toLowerCase(), e, 0) !== -1) return !0;
    } else if (o === 1) {
      for (; n < t.length && typeof (o = t[n++]) == "string"; )
        if (o.toLowerCase() === e) return !0;
      return !1;
    } else typeof o == "number" && (i = !1);
  }
  return !1;
}
function vd(t) {
  return t.type === 4 && t.value !== md;
}
function xm(t, e, r) {
  let n = t.type === 4 && !r ? md : t.value;
  return e === n;
}
function Nm(t, e, r) {
  let n = 4,
    i = t.attrs || [],
    o = Fm(i),
    s = !1;
  for (let a = 0; a < e.length; a++) {
    let u = e[a];
    if (typeof u == "number") {
      if (!s && !xe(n) && !xe(u)) return !1;
      if (s && xe(u)) continue;
      (s = !1), (n = u | (n & 1));
      continue;
    }
    if (!s)
      if (n & 4) {
        if (
          ((n = 2 | (n & 1)),
          (u !== "" && !xm(t, u, r)) || (u === "" && e.length === 1))
        ) {
          if (xe(n)) return !1;
          s = !0;
        }
      } else {
        let c = n & 8 ? u : e[++a];
        if (n & 8 && t.attrs !== null) {
          if (!Am(t.attrs, c, r)) {
            if (xe(n)) return !1;
            s = !0;
          }
          continue;
        }
        let l = n & 8 ? "class" : u,
          d = Rm(l, i, vd(t), r);
        if (d === -1) {
          if (xe(n)) return !1;
          s = !0;
          continue;
        }
        if (c !== "") {
          let f;
          d > o ? (f = "") : (f = i[d + 1].toLowerCase());
          let h = n & 8 ? f : null;
          if ((h && gd(h, c, 0) !== -1) || (n & 2 && c !== f)) {
            if (xe(n)) return !1;
            s = !0;
          }
        }
      }
  }
  return xe(n) || s;
}
function xe(t) {
  return (t & 1) === 0;
}
function Rm(t, e, r, n) {
  if (e === null) return -1;
  let i = 0;
  if (n || !r) {
    let o = !1;
    for (; i < e.length; ) {
      let s = e[i];
      if (s === t) return i;
      if (s === 3 || s === 6) o = !0;
      else if (s === 1 || s === 2) {
        let a = e[++i];
        for (; typeof a == "string"; ) a = e[++i];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          i += 4;
          continue;
        }
      }
      i += o ? 1 : 2;
    }
    return -1;
  } else return Pm(e, t);
}
function yd(t, e, r = !1) {
  for (let n = 0; n < e.length; n++) if (Nm(t, e[n], r)) return !0;
  return !1;
}
function Om(t) {
  let e = t.attrs;
  if (e != null) {
    let r = e.indexOf(5);
    if (!(r & 1)) return e[r + 1];
  }
  return null;
}
function Fm(t) {
  for (let e = 0; e < t.length; e++) {
    let r = t[e];
    if (Sm(r)) return e;
  }
  return t.length;
}
function Pm(t, e) {
  let r = t.indexOf(4);
  if (r > -1)
    for (r++; r < t.length; ) {
      let n = t[r];
      if (typeof n == "number") return -1;
      if (n === e) return r;
      r++;
    }
  return -1;
}
function km(t, e) {
  e: for (let r = 0; r < e.length; r++) {
    let n = e[r];
    if (t.length === n.length) {
      for (let i = 0; i < t.length; i++) if (t[i] !== n[i]) continue e;
      return !0;
    }
  }
  return !1;
}
function Tl(t, e) {
  return t ? ":not(" + e.trim() + ")" : e;
}
function Lm(t) {
  let e = t[0],
    r = 1,
    n = 2,
    i = "",
    o = !1;
  for (; r < t.length; ) {
    let s = t[r];
    if (typeof s == "string")
      if (n & 2) {
        let a = t[++r];
        i += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else n & 8 ? (i += "." + s) : n & 4 && (i += " " + s);
    else
      i !== "" && !xe(s) && ((e += Tl(o, i)), (i = "")),
        (n = s),
        (o = o || !xe(n));
    r++;
  }
  return i !== "" && (e += Tl(o, i)), e;
}
function Vm(t) {
  return t.map(Lm).join(",");
}
function jm(t) {
  let e = [],
    r = [],
    n = 1,
    i = 2;
  for (; n < t.length; ) {
    let o = t[n];
    if (typeof o == "string")
      i === 2 ? o !== "" && e.push(o, t[++n]) : i === 8 && r.push(o);
    else {
      if (!xe(i)) break;
      i = o;
    }
    n++;
  }
  return { attrs: e, classes: r };
}
function Dd(t) {
  return sr(() => {
    let e = bd(t),
      r = $(g({}, e), {
        decls: t.decls,
        vars: t.vars,
        template: t.template,
        consts: t.consts || null,
        ngContentSelectors: t.ngContentSelectors,
        onPush: t.changeDetection === pd.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (e.standalone && t.dependencies) || null,
        getStandaloneInjector: null,
        signals: t.signals ?? !1,
        data: t.data || {},
        encapsulation: t.encapsulation || $e.Emulated,
        styles: t.styles || be,
        _: null,
        schemas: t.schemas || null,
        tView: null,
        id: "",
      });
    Md(r);
    let n = t.dependencies;
    return (
      (r.directiveDefs = xl(n, !1)), (r.pipeDefs = xl(n, !0)), (r.id = Bm(r)), r
    );
  });
}
function Um(t) {
  return dt(t) || wd(t);
}
function $m(t) {
  return t !== null;
}
function ve(t) {
  return sr(() => ({
    type: t.type,
    bootstrap: t.bootstrap || be,
    declarations: t.declarations || be,
    imports: t.imports || be,
    exports: t.exports || be,
    transitiveCompileScopes: null,
    schemas: t.schemas || null,
    id: t.id || null,
  }));
}
function Al(t, e) {
  if (t == null) return fn;
  let r = {};
  for (let n in t)
    if (t.hasOwnProperty(n)) {
      let i = t[n],
        o,
        s,
        a = ge.None;
      Array.isArray(i)
        ? ((a = i[0]), (o = i[1]), (s = i[2] ?? o))
        : ((o = i), (s = i)),
        e ? ((r[o] = a !== ge.None ? [n, a] : n), (e[o] = s)) : (r[o] = n);
    }
  return r;
}
function ye(t) {
  return sr(() => {
    let e = bd(t);
    return Md(e), e;
  });
}
function Va(t) {
  return {
    type: t.type,
    name: t.name,
    factory: null,
    pure: t.pure !== !1,
    standalone: t.standalone === !0,
    onDestroy: t.type.prototype.ngOnDestroy || null,
  };
}
function dt(t) {
  return t[lm] || null;
}
function wd(t) {
  return t[dm] || null;
}
function Cd(t) {
  return t[fm] || null;
}
function Ed(t) {
  let e = dt(t) || wd(t) || Cd(t);
  return e !== null ? e.standalone : !1;
}
function Id(t, e) {
  let r = t[hm] || null;
  if (!r && e === !0)
    throw new Error(`Type ${de(t)} does not have '\u0275mod' property.`);
  return r;
}
function bd(t) {
  let e = {};
  return {
    type: t.type,
    providersResolver: null,
    factory: null,
    hostBindings: t.hostBindings || null,
    hostVars: t.hostVars || 0,
    hostAttrs: t.hostAttrs || null,
    contentQueries: t.contentQueries || null,
    declaredInputs: e,
    inputTransforms: null,
    inputConfig: t.inputs || fn,
    exportAs: t.exportAs || null,
    standalone: t.standalone === !0,
    signals: t.signals === !0,
    selectors: t.selectors || be,
    viewQuery: t.viewQuery || null,
    features: t.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: Al(t.inputs, e),
    outputs: Al(t.outputs),
    debugInfo: null,
  };
}
function Md(t) {
  t.features?.forEach((e) => e(t));
}
function xl(t, e) {
  if (!t) return null;
  let r = e ? Cd : Um;
  return () => (typeof t == "function" ? t() : t).map((n) => r(n)).filter($m);
}
function Bm(t) {
  let e = 0,
    r = [
      t.selectors,
      t.ngContentSelectors,
      t.hostVars,
      t.hostAttrs,
      t.consts,
      t.vars,
      t.decls,
      t.encapsulation,
      t.standalone,
      t.signals,
      t.exportAs,
      JSON.stringify(t.inputs),
      JSON.stringify(t.outputs),
      Object.getOwnPropertyNames(t.type.prototype),
      !!t.contentQueries,
      !!t.viewQuery,
    ].join("|");
  for (let i of r) e = (Math.imul(31, e) + i.charCodeAt(0)) << 0;
  return (e += 2147483648), "c" + e;
}
var et = 0,
  A = 1,
  I = 2,
  J = 3,
  Ne = 4,
  De = 5,
  Kn = 6,
  Jn = 7,
  Re = 8,
  hn = 9,
  Je = 10,
  Y = 11,
  Xn = 12,
  Nl = 13,
  Cn = 14,
  Oe = 15,
  ar = 16,
  sn = 17,
  Ue = 18,
  ro = 19,
  _d = 20,
  lt = 21,
  xs = 22,
  Nt = 23,
  Fe = 25,
  Sd = 1;
var Rt = 7,
  Oi = 8,
  pn = 9,
  pe = 10,
  ja = (function (t) {
    return (
      (t[(t.None = 0)] = "None"),
      (t[(t.HasTransplantedViews = 2)] = "HasTransplantedViews"),
      t
    );
  })(ja || {});
function At(t) {
  return Array.isArray(t) && typeof t[Sd] == "object";
}
function tt(t) {
  return Array.isArray(t) && t[Sd] === !0;
}
function Td(t) {
  return (t.flags & 4) !== 0;
}
function io(t) {
  return t.componentOffset > -1;
}
function Ua(t) {
  return (t.flags & 1) === 1;
}
function ft(t) {
  return !!t.template;
}
function Hm(t) {
  return (t[I] & 512) !== 0;
}
function Ot(t, e) {
  let r = t.hasOwnProperty(Ni);
  return r ? t[Ni] : null;
}
var Zs = class {
  constructor(e, r, n) {
    (this.previousValue = e), (this.currentValue = r), (this.firstChange = n);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function Ad(t, e, r, n) {
  e !== null ? e.applyValueToInputSignal(e, n) : (t[r] = n);
}
function Ut() {
  return xd;
}
function xd(t) {
  return t.type.prototype.ngOnChanges && (t.setInput = Gm), zm;
}
Ut.ngInherit = !0;
function zm() {
  let t = Rd(this),
    e = t?.current;
  if (e) {
    let r = t.previous;
    if (r === fn) t.previous = e;
    else for (let n in e) r[n] = e[n];
    (t.current = null), this.ngOnChanges(e);
  }
}
function Gm(t, e, r, n, i) {
  let o = this.declaredInputs[n],
    s = Rd(t) || Wm(t, { previous: fn, current: null }),
    a = s.current || (s.current = {}),
    u = s.previous,
    c = u[o];
  (a[o] = new Zs(c && c.currentValue, r, u === fn)), Ad(t, e, i, r);
}
var Nd = "__ngSimpleChanges__";
function Rd(t) {
  return t[Nd] || null;
}
function Wm(t, e) {
  return (t[Nd] = e);
}
var Rl = null;
var Ve = function (t, e, r) {
    Rl?.(t, e, r);
  },
  qm = "svg",
  Zm = "math",
  Ym = !1;
function Qm() {
  return Ym;
}
function Be(t) {
  for (; Array.isArray(t); ) t = t[et];
  return t;
}
function Od(t, e) {
  return Be(e[t]);
}
function Me(t, e) {
  return Be(e[t.index]);
}
function Fd(t, e) {
  return t.data[e];
}
function Km(t, e) {
  return t[e];
}
function pt(t, e) {
  let r = e[t];
  return At(r) ? r : r[et];
}
function Jm(t) {
  return (t[I] & 4) === 4;
}
function $a(t) {
  return (t[I] & 128) === 128;
}
function Xm(t) {
  return tt(t[J]);
}
function Fi(t, e) {
  return e == null ? null : t[e];
}
function Pd(t) {
  t[sn] = 0;
}
function ev(t) {
  t[I] & 1024 || ((t[I] |= 1024), $a(t) && er(t));
}
function tv(t, e) {
  for (; t > 0; ) (e = e[Cn]), t--;
  return e;
}
function Ba(t) {
  return !!(t[I] & 9216 || t[Nt]?.dirty);
}
function Ys(t) {
  Ba(t)
    ? er(t)
    : t[I] & 64 &&
      (Qm()
        ? ((t[I] |= 1024), er(t))
        : t[Je].changeDetectionScheduler?.notify());
}
function er(t) {
  t[Je].changeDetectionScheduler?.notify();
  let e = tr(t);
  for (; e !== null && !(e[I] & 8192 || ((e[I] |= 8192), !$a(e))); ) e = tr(e);
}
function kd(t, e) {
  if ((t[I] & 256) === 256) throw new v(911, !1);
  t[lt] === null && (t[lt] = []), t[lt].push(e);
}
function nv(t, e) {
  if (t[lt] === null) return;
  let r = t[lt].indexOf(e);
  r !== -1 && t[lt].splice(r, 1);
}
function tr(t) {
  let e = t[J];
  return tt(e) ? e[J] : e;
}
var R = { lFrame: Gd(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
function rv() {
  return R.lFrame.elementDepthCount;
}
function iv() {
  R.lFrame.elementDepthCount++;
}
function ov() {
  R.lFrame.elementDepthCount--;
}
function Ld() {
  return R.bindingsEnabled;
}
function Vd() {
  return R.skipHydrationRootTNode !== null;
}
function sv(t) {
  return R.skipHydrationRootTNode === t;
}
function av() {
  R.skipHydrationRootTNode = null;
}
function P() {
  return R.lFrame.lView;
}
function X() {
  return R.lFrame.tView;
}
function wN(t) {
  return (R.lFrame.contextLView = t), t[Re];
}
function CN(t) {
  return (R.lFrame.contextLView = null), t;
}
function we() {
  let t = jd();
  for (; t !== null && t.type === 64; ) t = t.parent;
  return t;
}
function jd() {
  return R.lFrame.currentTNode;
}
function uv() {
  let t = R.lFrame,
    e = t.currentTNode;
  return t.isParent ? e : e.parent;
}
function ur(t, e) {
  let r = R.lFrame;
  (r.currentTNode = t), (r.isParent = e);
}
function Ud() {
  return R.lFrame.isParent;
}
function $d() {
  R.lFrame.isParent = !1;
}
function cv() {
  let t = R.lFrame,
    e = t.bindingRootIndex;
  return e === -1 && (e = t.bindingRootIndex = t.tView.bindingStartIndex), e;
}
function lv(t) {
  return (R.lFrame.bindingIndex = t);
}
function Ha() {
  return R.lFrame.bindingIndex++;
}
function dv(t) {
  let e = R.lFrame,
    r = e.bindingIndex;
  return (e.bindingIndex = e.bindingIndex + t), r;
}
function fv() {
  return R.lFrame.inI18n;
}
function hv(t, e) {
  let r = R.lFrame;
  (r.bindingIndex = r.bindingRootIndex = t), Qs(e);
}
function pv() {
  return R.lFrame.currentDirectiveIndex;
}
function Qs(t) {
  R.lFrame.currentDirectiveIndex = t;
}
function gv(t) {
  let e = R.lFrame.currentDirectiveIndex;
  return e === -1 ? null : t[e];
}
function Bd() {
  return R.lFrame.currentQueryIndex;
}
function za(t) {
  R.lFrame.currentQueryIndex = t;
}
function mv(t) {
  let e = t[A];
  return e.type === 2 ? e.declTNode : e.type === 1 ? t[De] : null;
}
function Hd(t, e, r) {
  if (r & N.SkipSelf) {
    let i = e,
      o = t;
    for (; (i = i.parent), i === null && !(r & N.Host); )
      if (((i = mv(o)), i === null || ((o = o[Cn]), i.type & 10))) break;
    if (i === null) return !1;
    (e = i), (t = o);
  }
  let n = (R.lFrame = zd());
  return (n.currentTNode = e), (n.lView = t), !0;
}
function Ga(t) {
  let e = zd(),
    r = t[A];
  (R.lFrame = e),
    (e.currentTNode = r.firstChild),
    (e.lView = t),
    (e.tView = r),
    (e.contextLView = t),
    (e.bindingIndex = r.bindingStartIndex),
    (e.inI18n = !1);
}
function zd() {
  let t = R.lFrame,
    e = t === null ? null : t.child;
  return e === null ? Gd(t) : e;
}
function Gd(t) {
  let e = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: t,
    child: null,
    inI18n: !1,
  };
  return t !== null && (t.child = e), e;
}
function Wd() {
  let t = R.lFrame;
  return (R.lFrame = t.parent), (t.currentTNode = null), (t.lView = null), t;
}
var qd = Wd;
function Wa() {
  let t = Wd();
  (t.isParent = !0),
    (t.tView = null),
    (t.selectedIndex = -1),
    (t.contextLView = null),
    (t.elementDepthCount = 0),
    (t.currentDirectiveIndex = -1),
    (t.currentNamespace = null),
    (t.bindingRootIndex = -1),
    (t.bindingIndex = -1),
    (t.currentQueryIndex = 0);
}
function vv(t) {
  return (R.lFrame.contextLView = tv(t, R.lFrame.contextLView))[Re];
}
function En() {
  return R.lFrame.selectedIndex;
}
function Ft(t) {
  R.lFrame.selectedIndex = t;
}
function qa() {
  let t = R.lFrame;
  return Fd(t.tView, t.selectedIndex);
}
function yv() {
  return R.lFrame.currentNamespace;
}
var Zd = !0;
function Za() {
  return Zd;
}
function Ya(t) {
  Zd = t;
}
function Dv(t, e, r) {
  let { ngOnChanges: n, ngOnInit: i, ngDoCheck: o } = e.type.prototype;
  if (n) {
    let s = xd(e);
    (r.preOrderHooks ??= []).push(t, s),
      (r.preOrderCheckHooks ??= []).push(t, s);
  }
  i && (r.preOrderHooks ??= []).push(0 - t, i),
    o &&
      ((r.preOrderHooks ??= []).push(t, o),
      (r.preOrderCheckHooks ??= []).push(t, o));
}
function Qa(t, e) {
  for (let r = e.directiveStart, n = e.directiveEnd; r < n; r++) {
    let o = t.data[r].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: u,
        ngAfterViewChecked: c,
        ngOnDestroy: l,
      } = o;
    s && (t.contentHooks ??= []).push(-r, s),
      a &&
        ((t.contentHooks ??= []).push(r, a),
        (t.contentCheckHooks ??= []).push(r, a)),
      u && (t.viewHooks ??= []).push(-r, u),
      c &&
        ((t.viewHooks ??= []).push(r, c), (t.viewCheckHooks ??= []).push(r, c)),
      l != null && (t.destroyHooks ??= []).push(r, l);
  }
}
function Mi(t, e, r) {
  Yd(t, e, 3, r);
}
function _i(t, e, r, n) {
  (t[I] & 3) === r && Yd(t, e, r, n);
}
function Ns(t, e) {
  let r = t[I];
  (r & 3) === e && ((r &= 16383), (r += 1), (t[I] = r));
}
function Yd(t, e, r, n) {
  let i = n !== void 0 ? t[sn] & 65535 : 0,
    o = n ?? -1,
    s = e.length - 1,
    a = 0;
  for (let u = i; u < s; u++)
    if (typeof e[u + 1] == "number") {
      if (((a = e[u]), n != null && a >= n)) break;
    } else
      e[u] < 0 && (t[sn] += 65536),
        (a < o || o == -1) &&
          (wv(t, r, e, u), (t[sn] = (t[sn] & 4294901760) + u + 2)),
        u++;
}
function Ol(t, e) {
  Ve(4, t, e);
  let r = ne(null);
  try {
    e.call(t);
  } finally {
    ne(r), Ve(5, t, e);
  }
}
function wv(t, e, r, n) {
  let i = r[n] < 0,
    o = r[n + 1],
    s = i ? -r[n] : r[n],
    a = t[s];
  i
    ? t[I] >> 14 < t[sn] >> 16 &&
      (t[I] & 3) === e &&
      ((t[I] += 16384), Ol(a, o))
    : Ol(a, o);
}
var dn = -1,
  Pt = class {
    constructor(e, r, n) {
      (this.factory = e),
        (this.resolving = !1),
        (this.canSeeViewProviders = r),
        (this.injectImpl = n);
    }
  };
function Cv(t) {
  return t instanceof Pt;
}
function Ev(t) {
  return (t.flags & 8) !== 0;
}
function Iv(t) {
  return (t.flags & 16) !== 0;
}
function Qd(t) {
  return t !== dn;
}
function Pi(t) {
  return t & 32767;
}
function bv(t) {
  return t >> 16;
}
function ki(t, e) {
  let r = bv(t),
    n = e;
  for (; r > 0; ) (n = n[Cn]), r--;
  return n;
}
var Ks = !0;
function Li(t) {
  let e = Ks;
  return (Ks = t), e;
}
var Mv = 256,
  Kd = Mv - 1,
  Jd = 5,
  _v = 0,
  je = {};
function Sv(t, e, r) {
  let n;
  typeof r == "string"
    ? (n = r.charCodeAt(0) || 0)
    : r.hasOwnProperty(qn) && (n = r[qn]),
    n == null && (n = r[qn] = _v++);
  let i = n & Kd,
    o = 1 << i;
  e.data[t + (i >> Jd)] |= o;
}
function Vi(t, e) {
  let r = Xd(t, e);
  if (r !== -1) return r;
  let n = e[A];
  n.firstCreatePass &&
    ((t.injectorIndex = e.length),
    Rs(n.data, t),
    Rs(e, null),
    Rs(n.blueprint, null));
  let i = Ka(t, e),
    o = t.injectorIndex;
  if (Qd(i)) {
    let s = Pi(i),
      a = ki(i, e),
      u = a[A].data;
    for (let c = 0; c < 8; c++) e[o + c] = a[s + c] | u[s + c];
  }
  return (e[o + 8] = i), o;
}
function Rs(t, e) {
  t.push(0, 0, 0, 0, 0, 0, 0, 0, e);
}
function Xd(t, e) {
  return t.injectorIndex === -1 ||
    (t.parent && t.parent.injectorIndex === t.injectorIndex) ||
    e[t.injectorIndex + 8] === null
    ? -1
    : t.injectorIndex;
}
function Ka(t, e) {
  if (t.parent && t.parent.injectorIndex !== -1) return t.parent.injectorIndex;
  let r = 0,
    n = null,
    i = e;
  for (; i !== null; ) {
    if (((n = of(i)), n === null)) return dn;
    if ((r++, (i = i[Cn]), n.injectorIndex !== -1))
      return n.injectorIndex | (r << 16);
  }
  return dn;
}
function Js(t, e, r) {
  Sv(t, e, r);
}
function ef(t, e, r) {
  if (r & N.Optional || t !== void 0) return t;
  La(e, "NodeInjector");
}
function tf(t, e, r, n) {
  if (
    (r & N.Optional && n === void 0 && (n = null), !(r & (N.Self | N.Host)))
  ) {
    let i = t[hn],
      o = le(void 0);
    try {
      return i ? i.get(e, n, r & N.Optional) : fd(e, n, r & N.Optional);
    } finally {
      le(o);
    }
  }
  return ef(n, e, r);
}
function nf(t, e, r, n = N.Default, i) {
  if (t !== null) {
    if (e[I] & 2048 && !(n & N.Self)) {
      let s = Nv(t, e, r, n, je);
      if (s !== je) return s;
    }
    let o = rf(t, e, r, n, je);
    if (o !== je) return o;
  }
  return tf(e, r, n, i);
}
function rf(t, e, r, n, i) {
  let o = Av(r);
  if (typeof o == "function") {
    if (!Hd(e, t, n)) return n & N.Host ? ef(i, r, n) : tf(e, r, n, i);
    try {
      let s;
      if (((s = o(n)), s == null && !(n & N.Optional))) La(r);
      else return s;
    } finally {
      qd();
    }
  } else if (typeof o == "number") {
    let s = null,
      a = Xd(t, e),
      u = dn,
      c = n & N.Host ? e[Oe][De] : null;
    for (
      (a === -1 || n & N.SkipSelf) &&
      ((u = a === -1 ? Ka(t, e) : e[a + 8]),
      u === dn || !Pl(n, !1)
        ? (a = -1)
        : ((s = e[A]), (a = Pi(u)), (e = ki(u, e))));
      a !== -1;

    ) {
      let l = e[A];
      if (Fl(o, a, l.data)) {
        let d = Tv(a, e, r, s, n, c);
        if (d !== je) return d;
      }
      (u = e[a + 8]),
        u !== dn && Pl(n, e[A].data[a + 8] === c) && Fl(o, a, e)
          ? ((s = l), (a = Pi(u)), (e = ki(u, e)))
          : (a = -1);
    }
  }
  return i;
}
function Tv(t, e, r, n, i, o) {
  let s = e[A],
    a = s.data[t + 8],
    u = n == null ? io(a) && Ks : n != s && (a.type & 3) !== 0,
    c = i & N.Host && o === a,
    l = Si(a, s, r, u, c);
  return l !== null ? kt(e, s, l, a) : je;
}
function Si(t, e, r, n, i) {
  let o = t.providerIndexes,
    s = e.data,
    a = o & 1048575,
    u = t.directiveStart,
    c = t.directiveEnd,
    l = o >> 20,
    d = n ? a : a + l,
    f = i ? a + l : c;
  for (let h = d; h < f; h++) {
    let m = s[h];
    if ((h < u && r === m) || (h >= u && m.type === r)) return h;
  }
  if (i) {
    let h = s[u];
    if (h && ft(h) && h.type === r) return u;
  }
  return null;
}
function kt(t, e, r, n) {
  let i = t[r],
    o = e.data;
  if (Cv(i)) {
    let s = i;
    s.resolving && gm(pm(o[r]));
    let a = Li(s.canSeeViewProviders);
    s.resolving = !0;
    let u,
      c = s.injectImpl ? le(s.injectImpl) : null,
      l = Hd(t, n, N.Default);
    try {
      (i = t[r] = s.factory(void 0, o, t, n)),
        e.firstCreatePass && r >= n.directiveStart && Dv(r, o[r], e);
    } finally {
      c !== null && le(c), Li(a), (s.resolving = !1), qd();
    }
  }
  return i;
}
function Av(t) {
  if (typeof t == "string") return t.charCodeAt(0) || 0;
  let e = t.hasOwnProperty(qn) ? t[qn] : void 0;
  return typeof e == "number" ? (e >= 0 ? e & Kd : xv) : e;
}
function Fl(t, e, r) {
  let n = 1 << t;
  return !!(r[e + (t >> Jd)] & n);
}
function Pl(t, e) {
  return !(t & N.Self) && !(t & N.Host && e);
}
var xt = class {
  constructor(e, r) {
    (this._tNode = e), (this._lView = r);
  }
  get(e, r, n) {
    return nf(this._tNode, this._lView, e, no(n), r);
  }
};
function xv() {
  return new xt(we(), P());
}
function cr(t) {
  return sr(() => {
    let e = t.prototype.constructor,
      r = e[Ni] || Xs(e),
      n = Object.prototype,
      i = Object.getPrototypeOf(t.prototype).constructor;
    for (; i && i !== n; ) {
      let o = i[Ni] || Xs(i);
      if (o && o !== r) return o;
      i = Object.getPrototypeOf(i);
    }
    return (o) => new o();
  });
}
function Xs(t) {
  return sd(t)
    ? () => {
        let e = Xs(ie(t));
        return e && e();
      }
    : Ot(t);
}
function Nv(t, e, r, n, i) {
  let o = t,
    s = e;
  for (; o !== null && s !== null && s[I] & 2048 && !(s[I] & 512); ) {
    let a = rf(o, s, r, n | N.Self, je);
    if (a !== je) return a;
    let u = o.parent;
    if (!u) {
      let c = s[_d];
      if (c) {
        let l = c.get(r, je, n);
        if (l !== je) return l;
      }
      (u = of(s)), (s = s[Cn]);
    }
    o = u;
  }
  return i;
}
function of(t) {
  let e = t[A],
    r = e.type;
  return r === 2 ? e.declTNode : r === 1 ? t[De] : null;
}
var Ci = "__parameters__";
function Rv(t) {
  return function (...r) {
    if (t) {
      let n = t(...r);
      for (let i in n) this[i] = n[i];
    }
  };
}
function sf(t, e, r) {
  return sr(() => {
    let n = Rv(e);
    function i(...o) {
      if (this instanceof i) return n.apply(this, o), this;
      let s = new i(...o);
      return (a.annotation = s), a;
      function a(u, c, l) {
        let d = u.hasOwnProperty(Ci)
          ? u[Ci]
          : Object.defineProperty(u, Ci, { value: [] })[Ci];
        for (; d.length <= l; ) d.push(null);
        return (d[l] = d[l] || []).push(s), u;
      }
    }
    return (
      r && (i.prototype = Object.create(r.prototype)),
      (i.prototype.ngMetadataName = t),
      (i.annotationCls = i),
      i
    );
  });
}
function Ov(t) {
  let e = he.ng;
  if (e && e.ɵcompilerFacade) return e.ɵcompilerFacade;
  throw new Error("JIT compiler unavailable");
}
function Fv(t) {
  return typeof t == "function";
}
function Pv(t, e, r) {
  if (t.length !== e.length) return !1;
  for (let n = 0; n < t.length; n++) {
    let i = t[n],
      o = e[n];
    if ((r && ((i = r(i)), (o = r(o))), o !== i)) return !1;
  }
  return !0;
}
function kv(t) {
  return t.flat(Number.POSITIVE_INFINITY);
}
function Ja(t, e) {
  t.forEach((r) => (Array.isArray(r) ? Ja(r, e) : e(r)));
}
function af(t, e, r) {
  e >= t.length ? t.push(r) : t.splice(e, 0, r);
}
function ji(t, e) {
  return e >= t.length - 1 ? t.pop() : t.splice(e, 1)[0];
}
function Lv(t, e) {
  let r = [];
  for (let n = 0; n < t; n++) r.push(e);
  return r;
}
function Vv(t, e, r, n) {
  let i = t.length;
  if (i == e) t.push(r, n);
  else if (i === 1) t.push(n, t[0]), (t[0] = r);
  else {
    for (i--, t.push(t[i - 1], t[i]); i > e; ) {
      let o = i - 2;
      (t[i] = t[o]), i--;
    }
    (t[e] = r), (t[e + 1] = n);
  }
}
function jv(t, e, r) {
  let n = lr(t, e);
  return n >= 0 ? (t[n | 1] = r) : ((n = ~n), Vv(t, n, e, r)), n;
}
function Os(t, e) {
  let r = lr(t, e);
  if (r >= 0) return t[r | 1];
}
function lr(t, e) {
  return Uv(t, e, 1);
}
function Uv(t, e, r) {
  let n = 0,
    i = t.length >> r;
  for (; i !== n; ) {
    let o = n + ((i - n) >> 1),
      s = t[o << r];
    if (e === s) return o << r;
    s > e ? (i = o) : (n = o + 1);
  }
  return ~(i << r);
}
var oo = hd(sf("Optional"), 8);
var Xa = hd(sf("SkipSelf"), 4);
function $v(t) {
  let e = [],
    r = new Map();
  function n(i) {
    let o = r.get(i);
    if (!o) {
      let s = t(i);
      r.set(i, (o = s.then(Gv)));
    }
    return o;
  }
  return (
    Ui.forEach((i, o) => {
      let s = [];
      i.templateUrl &&
        s.push(
          n(i.templateUrl).then((c) => {
            i.template = c;
          })
        );
      let a = typeof i.styles == "string" ? [i.styles] : i.styles || [];
      if (((i.styles = a), i.styleUrl && i.styleUrls?.length))
        throw new Error(
          "@Component cannot define both `styleUrl` and `styleUrls`. Use `styleUrl` if the component has one stylesheet, or `styleUrls` if it has multiple"
        );
      if (i.styleUrls?.length) {
        let c = i.styles.length,
          l = i.styleUrls;
        i.styleUrls.forEach((d, f) => {
          a.push(""),
            s.push(
              n(d).then((h) => {
                (a[c + f] = h),
                  l.splice(l.indexOf(d), 1),
                  l.length == 0 && (i.styleUrls = void 0);
              })
            );
        });
      } else
        i.styleUrl &&
          s.push(
            n(i.styleUrl).then((c) => {
              a.push(c), (i.styleUrl = void 0);
            })
          );
      let u = Promise.all(s).then(() => Wv(o));
      e.push(u);
    }),
    Hv(),
    Promise.all(e).then(() => {})
  );
}
var Ui = new Map(),
  Bv = new Set();
function Hv() {
  let t = Ui;
  return (Ui = new Map()), t;
}
function zv() {
  return Ui.size === 0;
}
function Gv(t) {
  return typeof t == "string" ? t : t.text();
}
function Wv(t) {
  Bv.delete(t);
}
var gn = new y(""),
  uf = new y("", -1),
  cf = new y(""),
  $i = class {
    get(e, r = Yn) {
      if (r === Yn) {
        let n = new Error(`NullInjectorError: No provider for ${de(e)}!`);
        throw ((n.name = "NullInjectorError"), n);
      }
      return r;
    }
  };
function so(t) {
  return { ɵproviders: t };
}
function qv(...t) {
  return { ɵproviders: lf(!0, t), ɵfromNgModule: !0 };
}
function lf(t, ...e) {
  let r = [],
    n = new Set(),
    i,
    o = (s) => {
      r.push(s);
    };
  return (
    Ja(e, (s) => {
      let a = s;
      ea(a, o, [], n) && ((i ||= []), i.push(a));
    }),
    i !== void 0 && df(i, o),
    r
  );
}
function df(t, e) {
  for (let r = 0; r < t.length; r++) {
    let { ngModule: n, providers: i } = t[r];
    eu(i, (o) => {
      e(o, n);
    });
  }
}
function ea(t, e, r, n) {
  if (((t = ie(t)), !t)) return !1;
  let i = null,
    o = bl(t),
    s = !o && dt(t);
  if (!o && !s) {
    let u = t.ngModule;
    if (((o = bl(u)), o)) i = u;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    i = t;
  }
  let a = n.has(i);
  if (s) {
    if (a) return !1;
    if ((n.add(i), s.dependencies)) {
      let u =
        typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
      for (let c of u) ea(c, e, r, n);
    }
  } else if (o) {
    if (o.imports != null && !a) {
      n.add(i);
      let c;
      try {
        Ja(o.imports, (l) => {
          ea(l, e, r, n) && ((c ||= []), c.push(l));
        });
      } finally {
      }
      c !== void 0 && df(c, e);
    }
    if (!a) {
      let c = Ot(i) || (() => new i());
      e({ provide: i, useFactory: c, deps: be }, i),
        e({ provide: cf, useValue: i, multi: !0 }, i),
        e({ provide: gn, useValue: () => D(i), multi: !0 }, i);
    }
    let u = o.providers;
    if (u != null && !a) {
      let c = t;
      eu(u, (l) => {
        e(l, c);
      });
    }
  } else return !1;
  return i !== t && t.providers !== void 0;
}
function eu(t, e) {
  for (let r of t)
    ad(r) && (r = r.ɵproviders), Array.isArray(r) ? eu(r, e) : e(r);
}
var Zv = j({ provide: String, useValue: j });
function ff(t) {
  return t !== null && typeof t == "object" && Zv in t;
}
function Yv(t) {
  return !!(t && t.useExisting);
}
function Qv(t) {
  return !!(t && t.useFactory);
}
function mn(t) {
  return typeof t == "function";
}
function Kv(t) {
  return !!t.useClass;
}
var ao = new y(""),
  Ti = {},
  Jv = {},
  Fs;
function tu() {
  return Fs === void 0 && (Fs = new $i()), Fs;
}
var oe = class {},
  nr = class extends oe {
    get destroyed() {
      return this._destroyed;
    }
    constructor(e, r, n, i) {
      super(),
        (this.parent = r),
        (this.source = n),
        (this.scopes = i),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        na(e, (s) => this.processProvider(s)),
        this.records.set(uf, an(void 0, this)),
        i.has("environment") && this.records.set(oe, an(void 0, this));
      let o = this.records.get(ao);
      o != null && typeof o.value == "string" && this.scopes.add(o.value),
        (this.injectorDefTypes = new Set(this.get(cf, be, N.Self)));
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0);
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
        let e = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of e) r();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear();
      }
    }
    onDestroy(e) {
      return (
        this.assertNotDestroyed(),
        this._onDestroyHooks.push(e),
        () => this.removeOnDestroy(e)
      );
    }
    runInContext(e) {
      this.assertNotDestroyed();
      let r = ct(this),
        n = le(void 0),
        i;
      try {
        return e();
      } finally {
        ct(r), le(n);
      }
    }
    get(e, r = Yn, n = N.Default) {
      if ((this.assertNotDestroyed(), e.hasOwnProperty(El))) return e[El](this);
      n = no(n);
      let i,
        o = ct(this),
        s = le(void 0);
      try {
        if (!(n & N.SkipSelf)) {
          let u = this.records.get(e);
          if (u === void 0) {
            let c = ry(e) && to(e);
            c && this.injectableDefInScope(c)
              ? (u = an(ta(e), Ti))
              : (u = null),
              this.records.set(e, u);
          }
          if (u != null) return this.hydrate(e, u);
        }
        let a = n & N.Self ? tu() : this.parent;
        return (r = n & N.Optional && r === Yn ? null : r), a.get(e, r);
      } catch (a) {
        if (a.name === "NullInjectorError") {
          if (((a[Ri] = a[Ri] || []).unshift(de(e)), o)) throw a;
          return Mm(a, e, "R3InjectorError", this.source);
        } else throw a;
      } finally {
        le(s), ct(o);
      }
    }
    resolveInjectorInitializers() {
      let e = ct(this),
        r = le(void 0),
        n;
      try {
        let i = this.get(gn, be, N.Self);
        for (let o of i) o();
      } finally {
        ct(e), le(r);
      }
    }
    toString() {
      let e = [],
        r = this.records;
      for (let n of r.keys()) e.push(de(n));
      return `R3Injector[${e.join(", ")}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new v(205, !1);
    }
    processProvider(e) {
      e = ie(e);
      let r = mn(e) ? e : ie(e && e.provide),
        n = ey(e);
      if (!mn(e) && e.multi === !0) {
        let i = this.records.get(r);
        i ||
          ((i = an(void 0, Ti, !0)),
          (i.factory = () => Ws(i.multi)),
          this.records.set(r, i)),
          (r = e),
          i.multi.push(e);
      }
      this.records.set(r, n);
    }
    hydrate(e, r) {
      return (
        r.value === Ti && ((r.value = Jv), (r.value = r.factory())),
        typeof r.value == "object" &&
          r.value &&
          ny(r.value) &&
          this._ngOnDestroyHooks.add(r.value),
        r.value
      );
    }
    injectableDefInScope(e) {
      if (!e.providedIn) return !1;
      let r = ie(e.providedIn);
      return typeof r == "string"
        ? r === "any" || this.scopes.has(r)
        : this.injectorDefTypes.has(r);
    }
    removeOnDestroy(e) {
      let r = this._onDestroyHooks.indexOf(e);
      r !== -1 && this._onDestroyHooks.splice(r, 1);
    }
  };
function ta(t) {
  let e = to(t),
    r = e !== null ? e.factory : Ot(t);
  if (r !== null) return r;
  if (t instanceof y) throw new v(204, !1);
  if (t instanceof Function) return Xv(t);
  throw new v(204, !1);
}
function Xv(t) {
  if (t.length > 0) throw new v(204, !1);
  let r = mm(t);
  return r !== null ? () => r.factory(t) : () => new t();
}
function ey(t) {
  if (ff(t)) return an(void 0, t.useValue);
  {
    let e = hf(t);
    return an(e, Ti);
  }
}
function hf(t, e, r) {
  let n;
  if (mn(t)) {
    let i = ie(t);
    return Ot(i) || ta(i);
  } else if (ff(t)) n = () => ie(t.useValue);
  else if (Qv(t)) n = () => t.useFactory(...Ws(t.deps || []));
  else if (Yv(t)) n = () => D(ie(t.useExisting));
  else {
    let i = ie(t && (t.useClass || t.provide));
    if (ty(t)) n = () => new i(...Ws(t.deps));
    else return Ot(i) || ta(i);
  }
  return n;
}
function an(t, e, r = !1) {
  return { factory: t, value: e, multi: r ? [] : void 0 };
}
function ty(t) {
  return !!t.deps;
}
function ny(t) {
  return (
    t !== null && typeof t == "object" && typeof t.ngOnDestroy == "function"
  );
}
function ry(t) {
  return typeof t == "function" || (typeof t == "object" && t instanceof y);
}
function na(t, e) {
  for (let r of t)
    Array.isArray(r) ? na(r, e) : r && ad(r) ? na(r.ɵproviders, e) : e(r);
}
function ze(t, e) {
  t instanceof nr && t.assertNotDestroyed();
  let r,
    n = ct(t),
    i = le(void 0);
  try {
    return e();
  } finally {
    ct(n), le(i);
  }
}
function iy(t) {
  if (!dd() && !Em()) throw new v(-203, !1);
}
function kl(t, e = null, r = null, n) {
  let i = pf(t, e, r, n);
  return i.resolveInjectorInitializers(), i;
}
function pf(t, e = null, r = null, n, i = new Set()) {
  let o = [r || be, qv(t)];
  return (
    (n = n || (typeof t == "object" ? void 0 : de(t))),
    new nr(o, e || tu(), n || null, i)
  );
}
var Pe = (() => {
  let e = class e {
    static create(n, i) {
      if (Array.isArray(n)) return kl({ name: "" }, i, n, "");
      {
        let o = n.name ?? "";
        return kl({ name: o }, n.parent, n.providers, o);
      }
    }
  };
  (e.THROW_IF_NOT_FOUND = Yn),
    (e.NULL = new $i()),
    (e.ɵprov = w({ token: e, providedIn: "any", factory: () => D(uf) })),
    (e.__NG_ELEMENT_ID__ = -1);
  let t = e;
  return t;
})();
var ra;
function gf(t) {
  ra = t;
}
function oy() {
  if (ra !== void 0) return ra;
  if (typeof document < "u") return document;
  throw new v(210, !1);
}
var uo = new y("", { providedIn: "root", factory: () => sy }),
  sy = "ng",
  nu = new y(""),
  Ge = new y("", { providedIn: "platform", factory: () => "unknown" });
var EN = new y(""),
  ru = new y("", {
    providedIn: "root",
    factory: () =>
      oy().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
      null,
  });
function mf(t) {
  return t instanceof Function ? t() : t;
}
function ay(t) {
  return (t ?? p(Pe)).get(Ge) === "browser";
}
function vf(t) {
  return (t.flags & 128) === 128;
}
var Xe = (function (t) {
  return (
    (t[(t.Important = 1)] = "Important"), (t[(t.DashCase = 2)] = "DashCase"), t
  );
})(Xe || {});
var yf = new Map(),
  uy = 0;
function cy() {
  return uy++;
}
function ly(t) {
  yf.set(t[ro], t);
}
function dy(t) {
  yf.delete(t[ro]);
}
var Ll = "__ngContext__";
function Lt(t, e) {
  At(e) ? ((t[Ll] = e[ro]), ly(e)) : (t[Ll] = e);
}
var fy;
function iu(t, e) {
  return fy(t, e);
}
function un(t, e, r, n, i) {
  if (n != null) {
    let o,
      s = !1;
    tt(n) ? (o = n) : At(n) && ((s = !0), (n = n[et]));
    let a = Be(n);
    t === 0 && r !== null
      ? i == null
        ? bf(e, r, a)
        : Bi(e, r, a, i || null, !0)
      : t === 1 && r !== null
      ? Bi(e, r, a, i || null, !0)
      : t === 2
      ? Sy(e, a, s)
      : t === 3 && e.destroyNode(a),
      o != null && Ay(e, t, o, r, i);
  }
}
function hy(t, e) {
  return t.createText(e);
}
function py(t, e, r) {
  t.setValue(e, r);
}
function Df(t, e, r) {
  return t.createElement(e, r);
}
function gy(t, e) {
  wf(t, e), (e[et] = null), (e[De] = null);
}
function my(t, e, r, n, i, o) {
  (n[et] = i), (n[De] = e), co(t, n, r, 1, i, o);
}
function wf(t, e) {
  co(t, e, e[Y], 2, null, null);
}
function vy(t) {
  let e = t[Xn];
  if (!e) return Ps(t[A], t);
  for (; e; ) {
    let r = null;
    if (At(e)) r = e[Xn];
    else {
      let n = e[pe];
      n && (r = n);
    }
    if (!r) {
      for (; e && !e[Ne] && e !== t; ) At(e) && Ps(e[A], e), (e = e[J]);
      e === null && (e = t), At(e) && Ps(e[A], e), (r = e && e[Ne]);
    }
    e = r;
  }
}
function yy(t, e, r, n) {
  let i = pe + n,
    o = r.length;
  n > 0 && (r[i - 1][Ne] = e),
    n < o - pe
      ? ((e[Ne] = r[i]), af(r, pe + n, e))
      : (r.push(e), (e[Ne] = null)),
    (e[J] = r);
  let s = e[ar];
  s !== null && r !== s && Dy(s, e);
  let a = e[Ue];
  a !== null && a.insertView(t), Ys(e), (e[I] |= 128);
}
function Dy(t, e) {
  let r = t[pn],
    i = e[J][J][Oe];
  e[Oe] !== i && (t[I] |= ja.HasTransplantedViews),
    r === null ? (t[pn] = [e]) : r.push(e);
}
function Cf(t, e) {
  let r = t[pn],
    n = r.indexOf(e);
  r.splice(n, 1);
}
function ia(t, e) {
  if (t.length <= pe) return;
  let r = pe + e,
    n = t[r];
  if (n) {
    let i = n[ar];
    i !== null && i !== t && Cf(i, n), e > 0 && (t[r - 1][Ne] = n[Ne]);
    let o = ji(t, pe + e);
    gy(n[A], n);
    let s = o[Ue];
    s !== null && s.detachView(o[A]),
      (n[J] = null),
      (n[Ne] = null),
      (n[I] &= -129);
  }
  return n;
}
function Ef(t, e) {
  if (!(e[I] & 256)) {
    let r = e[Y];
    r.destroyNode && co(t, e, r, 3, null, null), vy(e);
  }
}
function Ps(t, e) {
  if (!(e[I] & 256)) {
    (e[I] &= -129),
      (e[I] |= 256),
      e[Nt] && Wc(e[Nt]),
      Cy(t, e),
      wy(t, e),
      e[A].type === 1 && e[Y].destroy();
    let r = e[ar];
    if (r !== null && tt(e[J])) {
      r !== e[J] && Cf(r, e);
      let n = e[Ue];
      n !== null && n.detachView(t);
    }
    dy(e);
  }
}
function wy(t, e) {
  let r = t.cleanup,
    n = e[Jn];
  if (r !== null)
    for (let o = 0; o < r.length - 1; o += 2)
      if (typeof r[o] == "string") {
        let s = r[o + 3];
        s >= 0 ? n[s]() : n[-s].unsubscribe(), (o += 2);
      } else {
        let s = n[r[o + 1]];
        r[o].call(s);
      }
  n !== null && (e[Jn] = null);
  let i = e[lt];
  if (i !== null) {
    e[lt] = null;
    for (let o = 0; o < i.length; o++) {
      let s = i[o];
      s();
    }
  }
}
function Cy(t, e) {
  let r;
  if (t != null && (r = t.destroyHooks) != null)
    for (let n = 0; n < r.length; n += 2) {
      let i = e[r[n]];
      if (!(i instanceof Pt)) {
        let o = r[n + 1];
        if (Array.isArray(o))
          for (let s = 0; s < o.length; s += 2) {
            let a = i[o[s]],
              u = o[s + 1];
            Ve(4, a, u);
            try {
              u.call(a);
            } finally {
              Ve(5, a, u);
            }
          }
        else {
          Ve(4, i, o);
          try {
            o.call(i);
          } finally {
            Ve(5, i, o);
          }
        }
      }
    }
}
function If(t, e, r) {
  return Ey(t, e.parent, r);
}
function Ey(t, e, r) {
  let n = e;
  for (; n !== null && n.type & 40; ) (e = n), (n = e.parent);
  if (n === null) return r[et];
  {
    let { componentOffset: i } = n;
    if (i > -1) {
      let { encapsulation: o } = t.data[n.directiveStart + i];
      if (o === $e.None || o === $e.Emulated) return null;
    }
    return Me(n, r);
  }
}
function Bi(t, e, r, n, i) {
  t.insertBefore(e, r, n, i);
}
function bf(t, e, r) {
  t.appendChild(e, r);
}
function Vl(t, e, r, n, i) {
  n !== null ? Bi(t, e, r, n, i) : bf(t, e, r);
}
function Iy(t, e, r, n) {
  t.removeChild(e, r, n);
}
function ou(t, e) {
  return t.parentNode(e);
}
function by(t, e) {
  return t.nextSibling(e);
}
function Mf(t, e, r) {
  return _y(t, e, r);
}
function My(t, e, r) {
  return t.type & 40 ? Me(t, r) : null;
}
var _y = My,
  jl;
function su(t, e, r, n) {
  let i = If(t, n, e),
    o = e[Y],
    s = n.parent || e[De],
    a = Mf(s, n, e);
  if (i != null)
    if (Array.isArray(r))
      for (let u = 0; u < r.length; u++) Vl(o, i, r[u], a, !1);
    else Vl(o, i, r, a, !1);
  jl !== void 0 && jl(o, n, e, r, i);
}
function Ai(t, e) {
  if (e !== null) {
    let r = e.type;
    if (r & 3) return Me(e, t);
    if (r & 4) return oa(-1, t[e.index]);
    if (r & 8) {
      let n = e.child;
      if (n !== null) return Ai(t, n);
      {
        let i = t[e.index];
        return tt(i) ? oa(-1, i) : Be(i);
      }
    } else {
      if (r & 32) return iu(e, t)() || Be(t[e.index]);
      {
        let n = _f(t, e);
        if (n !== null) {
          if (Array.isArray(n)) return n[0];
          let i = tr(t[Oe]);
          return Ai(i, n);
        } else return Ai(t, e.next);
      }
    }
  }
  return null;
}
function _f(t, e) {
  if (e !== null) {
    let n = t[Oe][De],
      i = e.projection;
    return n.projection[i];
  }
  return null;
}
function oa(t, e) {
  let r = pe + t + 1;
  if (r < e.length) {
    let n = e[r],
      i = n[A].firstChild;
    if (i !== null) return Ai(n, i);
  }
  return e[Rt];
}
function Sy(t, e, r) {
  let n = ou(t, e);
  n && Iy(t, n, e, r);
}
function au(t, e, r, n, i, o, s) {
  for (; r != null; ) {
    let a = n[r.index],
      u = r.type;
    if (
      (s && e === 0 && (a && Lt(Be(a), n), (r.flags |= 2)),
      (r.flags & 32) !== 32)
    )
      if (u & 8) au(t, e, r.child, n, i, o, !1), un(e, t, i, a, o);
      else if (u & 32) {
        let c = iu(r, n),
          l;
        for (; (l = c()); ) un(e, t, i, l, o);
        un(e, t, i, a, o);
      } else u & 16 ? Sf(t, e, n, r, i, o) : un(e, t, i, a, o);
    r = s ? r.projectionNext : r.next;
  }
}
function co(t, e, r, n, i, o) {
  au(r, n, t.firstChild, e, i, o, !1);
}
function Ty(t, e, r) {
  let n = e[Y],
    i = If(t, r, e),
    o = r.parent || e[De],
    s = Mf(o, r, e);
  Sf(n, 0, e, r, i, s);
}
function Sf(t, e, r, n, i, o) {
  let s = r[Oe],
    u = s[De].projection[n.projection];
  if (Array.isArray(u))
    for (let c = 0; c < u.length; c++) {
      let l = u[c];
      un(e, t, i, l, o);
    }
  else {
    let c = u,
      l = s[J];
    vf(n) && (c.flags |= 128), au(t, e, c, l, i, o, !0);
  }
}
function Ay(t, e, r, n, i) {
  let o = r[Rt],
    s = Be(r);
  o !== s && un(e, t, n, o, i);
  for (let a = pe; a < r.length; a++) {
    let u = r[a];
    co(u[A], u, t, e, n, o);
  }
}
function xy(t, e, r, n, i) {
  if (e) i ? t.addClass(r, n) : t.removeClass(r, n);
  else {
    let o = n.indexOf("-") === -1 ? void 0 : Xe.DashCase;
    i == null
      ? t.removeStyle(r, n, o)
      : (typeof i == "string" &&
          i.endsWith("!important") &&
          ((i = i.slice(0, -10)), (o |= Xe.Important)),
        t.setStyle(r, n, i, o));
  }
}
function Ny(t, e, r) {
  t.setAttribute(e, "style", r);
}
function Tf(t, e, r) {
  r === "" ? t.removeAttribute(e, "class") : t.setAttribute(e, "class", r);
}
function Af(t, e, r) {
  let { mergedAttrs: n, classes: i, styles: o } = r;
  n !== null && qs(t, e, n),
    i !== null && Tf(t, e, i),
    o !== null && Ny(t, e, o);
}
var Hi = class {
  constructor(e) {
    this.changingThisBreaksApplicationSecurity = e;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${od})`;
  }
};
function lo(t) {
  return t instanceof Hi ? t.changingThisBreaksApplicationSecurity : t;
}
function xf(t, e) {
  let r = Ry(t);
  if (r != null && r !== e) {
    if (r === "ResourceURL" && e === "URL") return !0;
    throw new Error(`Required a safe ${e}, got a ${r} (see ${od})`);
  }
  return r === e;
}
function Ry(t) {
  return (t instanceof Hi && t.getTypeName()) || null;
}
var Oy = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function Nf(t) {
  return (t = String(t)), t.match(Oy) ? t : "unsafe:" + t;
}
var uu = (function (t) {
  return (
    (t[(t.NONE = 0)] = "NONE"),
    (t[(t.HTML = 1)] = "HTML"),
    (t[(t.STYLE = 2)] = "STYLE"),
    (t[(t.SCRIPT = 3)] = "SCRIPT"),
    (t[(t.URL = 4)] = "URL"),
    (t[(t.RESOURCE_URL = 5)] = "RESOURCE_URL"),
    t
  );
})(uu || {});
function IN(t) {
  let e = Fy();
  return e ? e.sanitize(uu.URL, t) || "" : xf(t, "URL") ? lo(t) : Nf(eo(t));
}
function Fy() {
  let t = P();
  return t && t[Je].sanitizer;
}
var sa = class {};
var Py = "h",
  ky = "b";
var Ly = () => null;
function cu(t, e, r = !1) {
  return Ly(t, e, r);
}
var aa = class {},
  zi = class {};
function Vy(t) {
  let e = Error(`No component factory found for ${de(t)}.`);
  return (e[jy] = t), e;
}
var jy = "ngComponent";
var ua = class {
    resolveComponentFactory(e) {
      throw Vy(e);
    }
  },
  fo = (() => {
    let e = class e {};
    e.NULL = new ua();
    let t = e;
    return t;
  })();
function Uy() {
  return In(we(), P());
}
function In(t, e) {
  return new We(Me(t, e));
}
var We = (() => {
  let e = class e {
    constructor(n) {
      this.nativeElement = n;
    }
  };
  e.__NG_ELEMENT_ID__ = Uy;
  let t = e;
  return t;
})();
function $y(t) {
  return t instanceof We ? t.nativeElement : t;
}
var rr = class {},
  bn = (() => {
    let e = class e {
      constructor() {
        this.destroyNode = null;
      }
    };
    e.__NG_ELEMENT_ID__ = () => By();
    let t = e;
    return t;
  })();
function By() {
  let t = P(),
    e = we(),
    r = pt(e.index, t);
  return (At(r) ? r : t)[Y];
}
var Hy = (() => {
    let e = class e {};
    e.ɵprov = w({ token: e, providedIn: "root", factory: () => null });
    let t = e;
    return t;
  })(),
  ks = {};
function lu(t) {
  let e = ne(null);
  try {
    return t();
  } finally {
    ne(e);
  }
}
function Rf(t) {
  return Gy(t)
    ? Array.isArray(t) || (!(t instanceof Map) && Symbol.iterator in t)
    : !1;
}
function zy(t, e) {
  if (Array.isArray(t)) for (let r = 0; r < t.length; r++) e(t[r]);
  else {
    let r = t[Symbol.iterator](),
      n;
    for (; !(n = r.next()).done; ) e(n.value);
  }
}
function Gy(t) {
  return t !== null && (typeof t == "function" || typeof t == "object");
}
var ca = class {
    constructor() {}
    supports(e) {
      return Rf(e);
    }
    create(e) {
      return new la(e);
    }
  },
  Wy = (t, e) => e,
  la = class {
    constructor(e) {
      (this.length = 0),
        (this._linkedRecords = null),
        (this._unlinkedRecords = null),
        (this._previousItHead = null),
        (this._itHead = null),
        (this._itTail = null),
        (this._additionsHead = null),
        (this._additionsTail = null),
        (this._movesHead = null),
        (this._movesTail = null),
        (this._removalsHead = null),
        (this._removalsTail = null),
        (this._identityChangesHead = null),
        (this._identityChangesTail = null),
        (this._trackByFn = e || Wy);
    }
    forEachItem(e) {
      let r;
      for (r = this._itHead; r !== null; r = r._next) e(r);
    }
    forEachOperation(e) {
      let r = this._itHead,
        n = this._removalsHead,
        i = 0,
        o = null;
      for (; r || n; ) {
        let s = !n || (r && r.currentIndex < Ul(n, i, o)) ? r : n,
          a = Ul(s, i, o),
          u = s.currentIndex;
        if (s === n) i--, (n = n._nextRemoved);
        else if (((r = r._next), s.previousIndex == null)) i++;
        else {
          o || (o = []);
          let c = a - i,
            l = u - i;
          if (c != l) {
            for (let f = 0; f < c; f++) {
              let h = f < o.length ? o[f] : (o[f] = 0),
                m = h + f;
              l <= m && m < c && (o[f] = h + 1);
            }
            let d = s.previousIndex;
            o[d] = l - c;
          }
        }
        a !== u && e(s, a, u);
      }
    }
    forEachPreviousItem(e) {
      let r;
      for (r = this._previousItHead; r !== null; r = r._nextPrevious) e(r);
    }
    forEachAddedItem(e) {
      let r;
      for (r = this._additionsHead; r !== null; r = r._nextAdded) e(r);
    }
    forEachMovedItem(e) {
      let r;
      for (r = this._movesHead; r !== null; r = r._nextMoved) e(r);
    }
    forEachRemovedItem(e) {
      let r;
      for (r = this._removalsHead; r !== null; r = r._nextRemoved) e(r);
    }
    forEachIdentityChange(e) {
      let r;
      for (r = this._identityChangesHead; r !== null; r = r._nextIdentityChange)
        e(r);
    }
    diff(e) {
      if ((e == null && (e = []), !Rf(e))) throw new v(900, !1);
      return this.check(e) ? this : null;
    }
    onDestroy() {}
    check(e) {
      this._reset();
      let r = this._itHead,
        n = !1,
        i,
        o,
        s;
      if (Array.isArray(e)) {
        this.length = e.length;
        for (let a = 0; a < this.length; a++)
          (o = e[a]),
            (s = this._trackByFn(a, o)),
            r === null || !Object.is(r.trackById, s)
              ? ((r = this._mismatch(r, o, s, a)), (n = !0))
              : (n && (r = this._verifyReinsertion(r, o, s, a)),
                Object.is(r.item, o) || this._addIdentityChange(r, o)),
            (r = r._next);
      } else
        (i = 0),
          zy(e, (a) => {
            (s = this._trackByFn(i, a)),
              r === null || !Object.is(r.trackById, s)
                ? ((r = this._mismatch(r, a, s, i)), (n = !0))
                : (n && (r = this._verifyReinsertion(r, a, s, i)),
                  Object.is(r.item, a) || this._addIdentityChange(r, a)),
              (r = r._next),
              i++;
          }),
          (this.length = i);
      return this._truncate(r), (this.collection = e), this.isDirty;
    }
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._movesHead !== null ||
        this._removalsHead !== null ||
        this._identityChangesHead !== null
      );
    }
    _reset() {
      if (this.isDirty) {
        let e;
        for (e = this._previousItHead = this._itHead; e !== null; e = e._next)
          e._nextPrevious = e._next;
        for (e = this._additionsHead; e !== null; e = e._nextAdded)
          e.previousIndex = e.currentIndex;
        for (
          this._additionsHead = this._additionsTail = null, e = this._movesHead;
          e !== null;
          e = e._nextMoved
        )
          e.previousIndex = e.currentIndex;
        (this._movesHead = this._movesTail = null),
          (this._removalsHead = this._removalsTail = null),
          (this._identityChangesHead = this._identityChangesTail = null);
      }
    }
    _mismatch(e, r, n, i) {
      let o;
      return (
        e === null ? (o = this._itTail) : ((o = e._prev), this._remove(e)),
        (e =
          this._unlinkedRecords === null
            ? null
            : this._unlinkedRecords.get(n, null)),
        e !== null
          ? (Object.is(e.item, r) || this._addIdentityChange(e, r),
            this._reinsertAfter(e, o, i))
          : ((e =
              this._linkedRecords === null
                ? null
                : this._linkedRecords.get(n, i)),
            e !== null
              ? (Object.is(e.item, r) || this._addIdentityChange(e, r),
                this._moveAfter(e, o, i))
              : (e = this._addAfter(new da(r, n), o, i))),
        e
      );
    }
    _verifyReinsertion(e, r, n, i) {
      let o =
        this._unlinkedRecords === null
          ? null
          : this._unlinkedRecords.get(n, null);
      return (
        o !== null
          ? (e = this._reinsertAfter(o, e._prev, i))
          : e.currentIndex != i &&
            ((e.currentIndex = i), this._addToMoves(e, i)),
        e
      );
    }
    _truncate(e) {
      for (; e !== null; ) {
        let r = e._next;
        this._addToRemovals(this._unlink(e)), (e = r);
      }
      this._unlinkedRecords !== null && this._unlinkedRecords.clear(),
        this._additionsTail !== null && (this._additionsTail._nextAdded = null),
        this._movesTail !== null && (this._movesTail._nextMoved = null),
        this._itTail !== null && (this._itTail._next = null),
        this._removalsTail !== null && (this._removalsTail._nextRemoved = null),
        this._identityChangesTail !== null &&
          (this._identityChangesTail._nextIdentityChange = null);
    }
    _reinsertAfter(e, r, n) {
      this._unlinkedRecords !== null && this._unlinkedRecords.remove(e);
      let i = e._prevRemoved,
        o = e._nextRemoved;
      return (
        i === null ? (this._removalsHead = o) : (i._nextRemoved = o),
        o === null ? (this._removalsTail = i) : (o._prevRemoved = i),
        this._insertAfter(e, r, n),
        this._addToMoves(e, n),
        e
      );
    }
    _moveAfter(e, r, n) {
      return (
        this._unlink(e), this._insertAfter(e, r, n), this._addToMoves(e, n), e
      );
    }
    _addAfter(e, r, n) {
      return (
        this._insertAfter(e, r, n),
        this._additionsTail === null
          ? (this._additionsTail = this._additionsHead = e)
          : (this._additionsTail = this._additionsTail._nextAdded = e),
        e
      );
    }
    _insertAfter(e, r, n) {
      let i = r === null ? this._itHead : r._next;
      return (
        (e._next = i),
        (e._prev = r),
        i === null ? (this._itTail = e) : (i._prev = e),
        r === null ? (this._itHead = e) : (r._next = e),
        this._linkedRecords === null && (this._linkedRecords = new Gi()),
        this._linkedRecords.put(e),
        (e.currentIndex = n),
        e
      );
    }
    _remove(e) {
      return this._addToRemovals(this._unlink(e));
    }
    _unlink(e) {
      this._linkedRecords !== null && this._linkedRecords.remove(e);
      let r = e._prev,
        n = e._next;
      return (
        r === null ? (this._itHead = n) : (r._next = n),
        n === null ? (this._itTail = r) : (n._prev = r),
        e
      );
    }
    _addToMoves(e, r) {
      return (
        e.previousIndex === r ||
          (this._movesTail === null
            ? (this._movesTail = this._movesHead = e)
            : (this._movesTail = this._movesTail._nextMoved = e)),
        e
      );
    }
    _addToRemovals(e) {
      return (
        this._unlinkedRecords === null && (this._unlinkedRecords = new Gi()),
        this._unlinkedRecords.put(e),
        (e.currentIndex = null),
        (e._nextRemoved = null),
        this._removalsTail === null
          ? ((this._removalsTail = this._removalsHead = e),
            (e._prevRemoved = null))
          : ((e._prevRemoved = this._removalsTail),
            (this._removalsTail = this._removalsTail._nextRemoved = e)),
        e
      );
    }
    _addIdentityChange(e, r) {
      return (
        (e.item = r),
        this._identityChangesTail === null
          ? (this._identityChangesTail = this._identityChangesHead = e)
          : (this._identityChangesTail =
              this._identityChangesTail._nextIdentityChange =
                e),
        e
      );
    }
  },
  da = class {
    constructor(e, r) {
      (this.item = e),
        (this.trackById = r),
        (this.currentIndex = null),
        (this.previousIndex = null),
        (this._nextPrevious = null),
        (this._prev = null),
        (this._next = null),
        (this._prevDup = null),
        (this._nextDup = null),
        (this._prevRemoved = null),
        (this._nextRemoved = null),
        (this._nextAdded = null),
        (this._nextMoved = null),
        (this._nextIdentityChange = null);
    }
  },
  fa = class {
    constructor() {
      (this._head = null), (this._tail = null);
    }
    add(e) {
      this._head === null
        ? ((this._head = this._tail = e),
          (e._nextDup = null),
          (e._prevDup = null))
        : ((this._tail._nextDup = e),
          (e._prevDup = this._tail),
          (e._nextDup = null),
          (this._tail = e));
    }
    get(e, r) {
      let n;
      for (n = this._head; n !== null; n = n._nextDup)
        if ((r === null || r <= n.currentIndex) && Object.is(n.trackById, e))
          return n;
      return null;
    }
    remove(e) {
      let r = e._prevDup,
        n = e._nextDup;
      return (
        r === null ? (this._head = n) : (r._nextDup = n),
        n === null ? (this._tail = r) : (n._prevDup = r),
        this._head === null
      );
    }
  },
  Gi = class {
    constructor() {
      this.map = new Map();
    }
    put(e) {
      let r = e.trackById,
        n = this.map.get(r);
      n || ((n = new fa()), this.map.set(r, n)), n.add(e);
    }
    get(e, r) {
      let n = e,
        i = this.map.get(n);
      return i ? i.get(e, r) : null;
    }
    remove(e) {
      let r = e.trackById;
      return this.map.get(r).remove(e) && this.map.delete(r), e;
    }
    get isEmpty() {
      return this.map.size === 0;
    }
    clear() {
      this.map.clear();
    }
  };
function Ul(t, e, r) {
  let n = t.previousIndex;
  if (n === null) return n;
  let i = 0;
  return r && n < r.length && (i = r[n]), n + e + i;
}
function $l() {
  return new du([new ca()]);
}
var du = (() => {
  let e = class e {
    constructor(n) {
      this.factories = n;
    }
    static create(n, i) {
      if (i != null) {
        let o = i.factories.slice();
        n = n.concat(o);
      }
      return new e(n);
    }
    static extend(n) {
      return {
        provide: e,
        useFactory: (i) => e.create(n, i || $l()),
        deps: [[e, new Xa(), new oo()]],
      };
    }
    find(n) {
      let i = this.factories.find((o) => o.supports(n));
      if (i != null) return i;
      throw new v(901, !1);
    }
  };
  e.ɵprov = w({ token: e, providedIn: "root", factory: $l });
  let t = e;
  return t;
})();
function Wi(t, e, r, n, i = !1) {
  for (; r !== null; ) {
    let o = e[r.index];
    o !== null && n.push(Be(o)), tt(o) && qy(o, n);
    let s = r.type;
    if (s & 8) Wi(t, e, r.child, n);
    else if (s & 32) {
      let a = iu(r, e),
        u;
      for (; (u = a()); ) n.push(u);
    } else if (s & 16) {
      let a = _f(e, r);
      if (Array.isArray(a)) n.push(...a);
      else {
        let u = tr(e[Oe]);
        Wi(u[A], u, a, n, !0);
      }
    }
    r = i ? r.projectionNext : r.next;
  }
  return n;
}
function qy(t, e) {
  for (let r = pe; r < t.length; r++) {
    let n = t[r],
      i = n[A].firstChild;
    i !== null && Wi(n[A], n, i, e);
  }
  t[Rt] !== t[et] && e.push(t[Rt]);
}
var Of = [];
function Zy(t) {
  return t[Nt] ?? Yy(t);
}
function Yy(t) {
  let e = Of.pop() ?? Object.create(Ky);
  return (e.lView = t), e;
}
function Qy(t) {
  t.lView[Nt] !== t && ((t.lView = null), Of.push(t));
}
var Ky = $(g({}, Hc), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (t) => {
    er(t.lView);
  },
  consumerOnSignalRead() {
    this.lView[Nt] = this;
  },
});
function Ff(t) {
  return kf(t[Xn]);
}
function Pf(t) {
  return kf(t[Ne]);
}
function kf(t) {
  for (; t !== null && !tt(t); ) t = t[Ne];
  return t;
}
var Jy = "ngOriginalError";
function Ls(t) {
  return t[Jy];
}
var He = class {
    constructor() {
      this._console = console;
    }
    handleError(e) {
      let r = this._findOriginalError(e);
      this._console.error("ERROR", e),
        r && this._console.error("ORIGINAL ERROR", r);
    }
    _findOriginalError(e) {
      let r = e && Ls(e);
      for (; r && Ls(r); ) r = Ls(r);
      return r || null;
    }
  },
  Lf = new y("", {
    providedIn: "root",
    factory: () => p(He).handleError.bind(void 0),
  });
var Vf = !1,
  Xy = new y("", { providedIn: "root", factory: () => Vf });
var gt = {};
function bN(t = 1) {
  jf(X(), P(), En() + t, !1);
}
function jf(t, e, r, n) {
  if (!n)
    if ((e[I] & 3) === 3) {
      let o = t.preOrderCheckHooks;
      o !== null && Mi(e, o, r);
    } else {
      let o = t.preOrderHooks;
      o !== null && _i(e, o, 0, r);
    }
  Ft(r);
}
function B(t, e = N.Default) {
  let r = P();
  if (r === null) return D(t, e);
  let n = we();
  return nf(n, r, ie(t), e);
}
function Uf() {
  let t = "invalid";
  throw new Error(t);
}
function $f(t, e, r, n, i, o) {
  let s = ne(null);
  try {
    let a = null;
    i & ge.SignalBased && (a = e[n][Bc]),
      a !== null && a.transformFn !== void 0 && (o = a.transformFn(o)),
      i & ge.HasDecoratorInputTransform &&
        (o = t.inputTransforms[n].call(e, o)),
      t.setInput !== null ? t.setInput(e, a, o, r, n) : Ad(e, a, n, o);
  } finally {
    ne(s);
  }
}
function eD(t, e) {
  let r = t.hostBindingOpCodes;
  if (r !== null)
    try {
      for (let n = 0; n < r.length; n++) {
        let i = r[n];
        if (i < 0) Ft(~i);
        else {
          let o = i,
            s = r[++n],
            a = r[++n];
          hv(s, o);
          let u = e[o];
          a(2, u);
        }
      }
    } finally {
      Ft(-1);
    }
}
function ho(t, e, r, n, i, o, s, a, u, c, l) {
  let d = e.blueprint.slice();
  return (
    (d[et] = i),
    (d[I] = n | 4 | 128 | 8 | 64),
    (c !== null || (t && t[I] & 2048)) && (d[I] |= 2048),
    Pd(d),
    (d[J] = d[Cn] = t),
    (d[Re] = r),
    (d[Je] = s || (t && t[Je])),
    (d[Y] = a || (t && t[Y])),
    (d[hn] = u || (t && t[hn]) || null),
    (d[De] = o),
    (d[ro] = cy()),
    (d[Kn] = l),
    (d[_d] = c),
    (d[Oe] = e.type == 2 ? t[Oe] : d),
    d
  );
}
function dr(t, e, r, n, i) {
  let o = t.data[e];
  if (o === null) (o = tD(t, e, r, n, i)), fv() && (o.flags |= 32);
  else if (o.type & 64) {
    (o.type = r), (o.value = n), (o.attrs = i);
    let s = uv();
    o.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return ur(o, !0), o;
}
function tD(t, e, r, n, i) {
  let o = jd(),
    s = Ud(),
    a = s ? o : o && o.parent,
    u = (t.data[e] = aD(t, a, r, e, n, i));
  return (
    t.firstChild === null && (t.firstChild = u),
    o !== null &&
      (s
        ? o.child == null && u.parent !== null && (o.child = u)
        : o.next === null && ((o.next = u), (u.prev = o))),
    u
  );
}
function Bf(t, e, r, n) {
  if (r === 0) return -1;
  let i = e.length;
  for (let o = 0; o < r; o++) e.push(n), t.blueprint.push(n), t.data.push(null);
  return i;
}
function Hf(t, e, r, n, i) {
  let o = En(),
    s = n & 2;
  try {
    Ft(-1), s && e.length > Fe && jf(t, e, Fe, !1), Ve(s ? 2 : 0, i), r(n, i);
  } finally {
    Ft(o), Ve(s ? 3 : 1, i);
  }
}
function zf(t, e, r) {
  if (Td(e)) {
    let n = ne(null);
    try {
      let i = e.directiveStart,
        o = e.directiveEnd;
      for (let s = i; s < o; s++) {
        let a = t.data[s];
        a.contentQueries && a.contentQueries(1, r[s], s);
      }
    } finally {
      ne(n);
    }
  }
}
function Gf(t, e, r) {
  Ld() && (hD(t, e, r, Me(r, e)), (r.flags & 64) === 64 && Kf(t, e, r));
}
function Wf(t, e, r = Me) {
  let n = e.localNames;
  if (n !== null) {
    let i = e.index + 1;
    for (let o = 0; o < n.length; o += 2) {
      let s = n[o + 1],
        a = s === -1 ? r(e, t) : t[s];
      t[i++] = a;
    }
  }
}
function qf(t) {
  let e = t.tView;
  return e === null || e.incompleteFirstPass
    ? (t.tView = fu(
        1,
        null,
        t.template,
        t.decls,
        t.vars,
        t.directiveDefs,
        t.pipeDefs,
        t.viewQuery,
        t.schemas,
        t.consts,
        t.id
      ))
    : e;
}
function fu(t, e, r, n, i, o, s, a, u, c, l) {
  let d = Fe + n,
    f = d + i,
    h = nD(d, f),
    m = typeof c == "function" ? c() : c;
  return (h[A] = {
    type: t,
    blueprint: h,
    template: r,
    queries: null,
    viewQuery: a,
    declTNode: e,
    data: h.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: f,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof o == "function" ? o() : o,
    pipeRegistry: typeof s == "function" ? s() : s,
    firstChild: null,
    schemas: u,
    consts: m,
    incompleteFirstPass: !1,
    ssrId: l,
  });
}
function nD(t, e) {
  let r = [];
  for (let n = 0; n < e; n++) r.push(n < t ? null : gt);
  return r;
}
function rD(t, e, r, n) {
  let o = n.get(Xy, Vf) || r === $e.ShadowDom,
    s = t.selectRootElement(e, o);
  return iD(s), s;
}
function iD(t) {
  oD(t);
}
var oD = () => null;
function sD(t, e, r, n) {
  let i = eh(e);
  i.push(r), t.firstCreatePass && th(t).push(n, i.length - 1);
}
function aD(t, e, r, n, i, o) {
  let s = e ? e.injectorIndex : -1,
    a = 0;
  return (
    Vd() && (a |= 128),
    {
      type: r,
      index: n,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: i,
      attrs: o,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: e,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function Bl(t, e, r, n, i) {
  for (let o in e) {
    if (!e.hasOwnProperty(o)) continue;
    let s = e[o];
    if (s === void 0) continue;
    n ??= {};
    let a,
      u = ge.None;
    Array.isArray(s) ? ((a = s[0]), (u = s[1])) : (a = s);
    let c = o;
    if (i !== null) {
      if (!i.hasOwnProperty(o)) continue;
      c = i[o];
    }
    t === 0 ? Hl(n, r, c, a, u) : Hl(n, r, c, a);
  }
  return n;
}
function Hl(t, e, r, n, i) {
  let o;
  t.hasOwnProperty(r) ? (o = t[r]).push(e, n) : (o = t[r] = [e, n]),
    i !== void 0 && o.push(i);
}
function uD(t, e, r) {
  let n = e.directiveStart,
    i = e.directiveEnd,
    o = t.data,
    s = e.attrs,
    a = [],
    u = null,
    c = null;
  for (let l = n; l < i; l++) {
    let d = o[l],
      f = r ? r.get(d) : null,
      h = f ? f.inputs : null,
      m = f ? f.outputs : null;
    (u = Bl(0, d.inputs, l, u, h)), (c = Bl(1, d.outputs, l, c, m));
    let F = u !== null && s !== null && !vd(e) ? bD(u, l, s) : null;
    a.push(F);
  }
  u !== null &&
    (u.hasOwnProperty("class") && (e.flags |= 8),
    u.hasOwnProperty("style") && (e.flags |= 16)),
    (e.initialInputs = a),
    (e.inputs = u),
    (e.outputs = c);
}
function cD(t) {
  return t === "class"
    ? "className"
    : t === "for"
    ? "htmlFor"
    : t === "formaction"
    ? "formAction"
    : t === "innerHtml"
    ? "innerHTML"
    : t === "readonly"
    ? "readOnly"
    : t === "tabindex"
    ? "tabIndex"
    : t;
}
function Zf(t, e, r, n, i, o, s, a) {
  let u = Me(e, r),
    c = e.inputs,
    l;
  !a && c != null && (l = c[n])
    ? (hu(t, r, l, n, i), io(e) && lD(r, e.index))
    : e.type & 3
    ? ((n = cD(n)),
      (i = s != null ? s(i, e.value || "", n) : i),
      o.setProperty(u, n, i))
    : e.type & 12;
}
function lD(t, e) {
  let r = pt(e, t);
  r[I] & 16 || (r[I] |= 64);
}
function Yf(t, e, r, n) {
  if (Ld()) {
    let i = n === null ? null : { "": -1 },
      o = gD(t, r),
      s,
      a;
    o === null ? (s = a = null) : ([s, a] = o),
      s !== null && Qf(t, e, r, s, i, a),
      i && mD(r, n, i);
  }
  r.mergedAttrs = Qn(r.mergedAttrs, r.attrs);
}
function Qf(t, e, r, n, i, o) {
  for (let c = 0; c < n.length; c++) Js(Vi(r, e), t, n[c].type);
  yD(r, t.data.length, n.length);
  for (let c = 0; c < n.length; c++) {
    let l = n[c];
    l.providersResolver && l.providersResolver(l);
  }
  let s = !1,
    a = !1,
    u = Bf(t, e, n.length, null);
  for (let c = 0; c < n.length; c++) {
    let l = n[c];
    (r.mergedAttrs = Qn(r.mergedAttrs, l.hostAttrs)),
      DD(t, r, e, u, l),
      vD(u, l, i),
      l.contentQueries !== null && (r.flags |= 4),
      (l.hostBindings !== null || l.hostAttrs !== null || l.hostVars !== 0) &&
        (r.flags |= 64);
    let d = l.type.prototype;
    !s &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((t.preOrderHooks ??= []).push(r.index), (s = !0)),
      !a &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((t.preOrderCheckHooks ??= []).push(r.index), (a = !0)),
      u++;
  }
  uD(t, r, o);
}
function dD(t, e, r, n, i) {
  let o = i.hostBindings;
  if (o) {
    let s = t.hostBindingOpCodes;
    s === null && (s = t.hostBindingOpCodes = []);
    let a = ~e.index;
    fD(s) != a && s.push(a), s.push(r, n, o);
  }
}
function fD(t) {
  let e = t.length;
  for (; e > 0; ) {
    let r = t[--e];
    if (typeof r == "number" && r < 0) return r;
  }
  return 0;
}
function hD(t, e, r, n) {
  let i = r.directiveStart,
    o = r.directiveEnd;
  io(r) && wD(e, r, t.data[i + r.componentOffset]),
    t.firstCreatePass || Vi(r, e),
    Lt(n, e);
  let s = r.initialInputs;
  for (let a = i; a < o; a++) {
    let u = t.data[a],
      c = kt(e, t, a, r);
    if ((Lt(c, e), s !== null && ID(e, a - i, c, u, r, s), ft(u))) {
      let l = pt(r.index, e);
      l[Re] = kt(e, t, a, r);
    }
  }
}
function Kf(t, e, r) {
  let n = r.directiveStart,
    i = r.directiveEnd,
    o = r.index,
    s = pv();
  try {
    Ft(o);
    for (let a = n; a < i; a++) {
      let u = t.data[a],
        c = e[a];
      Qs(a),
        (u.hostBindings !== null || u.hostVars !== 0 || u.hostAttrs !== null) &&
          pD(u, c);
    }
  } finally {
    Ft(-1), Qs(s);
  }
}
function pD(t, e) {
  t.hostBindings !== null && t.hostBindings(1, e);
}
function gD(t, e) {
  let r = t.directiveRegistry,
    n = null,
    i = null;
  if (r)
    for (let o = 0; o < r.length; o++) {
      let s = r[o];
      if (yd(e, s.selectors, !1))
        if ((n || (n = []), ft(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = [];
            (i = i || new Map()),
              s.findHostDirectiveDefs(s, a, i),
              n.unshift(...a, s);
            let u = a.length;
            ha(t, e, u);
          } else n.unshift(s), ha(t, e, 0);
        else
          (i = i || new Map()), s.findHostDirectiveDefs?.(s, n, i), n.push(s);
    }
  return n === null ? null : [n, i];
}
function ha(t, e, r) {
  (e.componentOffset = r), (t.components ??= []).push(e.index);
}
function mD(t, e, r) {
  if (e) {
    let n = (t.localNames = []);
    for (let i = 0; i < e.length; i += 2) {
      let o = r[e[i + 1]];
      if (o == null) throw new v(-301, !1);
      n.push(e[i], o);
    }
  }
}
function vD(t, e, r) {
  if (r) {
    if (e.exportAs)
      for (let n = 0; n < e.exportAs.length; n++) r[e.exportAs[n]] = t;
    ft(e) && (r[""] = t);
  }
}
function yD(t, e, r) {
  (t.flags |= 1),
    (t.directiveStart = e),
    (t.directiveEnd = e + r),
    (t.providerIndexes = e);
}
function DD(t, e, r, n, i) {
  t.data[n] = i;
  let o = i.factory || (i.factory = Ot(i.type, !0)),
    s = new Pt(o, ft(i), B);
  (t.blueprint[n] = s), (r[n] = s), dD(t, e, n, Bf(t, r, i.hostVars, gt), i);
}
function wD(t, e, r) {
  let n = Me(e, t),
    i = qf(r),
    o = t[Je].rendererFactory,
    s = 16;
  r.signals ? (s = 4096) : r.onPush && (s = 64);
  let a = po(
    t,
    ho(t, i, null, s, n, e, null, o.createRenderer(n, r), null, null, null)
  );
  t[e.index] = a;
}
function CD(t, e, r, n, i, o) {
  let s = Me(t, e);
  ED(e[Y], s, o, t.value, r, n, i);
}
function ED(t, e, r, n, i, o, s) {
  if (o == null) t.removeAttribute(e, i, r);
  else {
    let a = s == null ? eo(o) : s(o, n || "", i);
    t.setAttribute(e, i, a, r);
  }
}
function ID(t, e, r, n, i, o) {
  let s = o[e];
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let u = s[a++],
        c = s[a++],
        l = s[a++],
        d = s[a++];
      $f(n, r, u, c, l, d);
    }
}
function bD(t, e, r) {
  let n = null,
    i = 0;
  for (; i < r.length; ) {
    let o = r[i];
    if (o === 0) {
      i += 4;
      continue;
    } else if (o === 5) {
      i += 2;
      continue;
    }
    if (typeof o == "number") break;
    if (t.hasOwnProperty(o)) {
      n === null && (n = []);
      let s = t[o];
      for (let a = 0; a < s.length; a += 3)
        if (s[a] === e) {
          n.push(o, s[a + 1], s[a + 2], r[i + 1]);
          break;
        }
    }
    i += 2;
  }
  return n;
}
function Jf(t, e, r, n) {
  return [t, !0, 0, e, null, n, null, r, null, null];
}
function Xf(t, e) {
  let r = t.contentQueries;
  if (r !== null) {
    let n = ne(null);
    try {
      for (let i = 0; i < r.length; i += 2) {
        let o = r[i],
          s = r[i + 1];
        if (s !== -1) {
          let a = t.data[s];
          za(o), a.contentQueries(2, e[s], s);
        }
      }
    } finally {
      ne(n);
    }
  }
}
function po(t, e) {
  return t[Xn] ? (t[Nl][Ne] = e) : (t[Xn] = e), (t[Nl] = e), e;
}
function pa(t, e, r) {
  za(0);
  let n = ne(null);
  try {
    e(t, r);
  } finally {
    ne(n);
  }
}
function eh(t) {
  return t[Jn] || (t[Jn] = []);
}
function th(t) {
  return t.cleanup || (t.cleanup = []);
}
function nh(t, e) {
  let r = t[hn],
    n = r ? r.get(He, null) : null;
  n && n.handleError(e);
}
function hu(t, e, r, n, i) {
  for (let o = 0; o < r.length; ) {
    let s = r[o++],
      a = r[o++],
      u = r[o++],
      c = e[s],
      l = t.data[s];
    $f(l, c, n, a, u, i);
  }
}
function MD(t, e, r) {
  let n = Od(e, t);
  py(t[Y], n, r);
}
var rh = 100;
function ih(t, e = !0, r = 0) {
  let n = t[Je],
    i = n.rendererFactory,
    o = !1;
  o || i.begin?.();
  try {
    _D(t, r);
  } catch (s) {
    throw (e && nh(t, s), s);
  } finally {
    o || (i.end?.(), n.inlineEffectRunner?.flush());
  }
}
function _D(t, e) {
  ga(t, e);
  let r = 0;
  for (; Ba(t); ) {
    if (r === rh) throw new v(103, !1);
    r++, ga(t, 1);
  }
}
function SD(t, e, r, n) {
  let i = e[I];
  if ((i & 256) === 256) return;
  let o = !1;
  !o && e[Je].inlineEffectRunner?.flush(), Ga(e);
  let s = null,
    a = null;
  !o && TD(t) && ((a = Zy(e)), (s = zc(a)));
  try {
    Pd(e), lv(t.bindingStartIndex), r !== null && Hf(t, e, r, 2, n);
    let u = (i & 3) === 3;
    if (!o)
      if (u) {
        let d = t.preOrderCheckHooks;
        d !== null && Mi(e, d, null);
      } else {
        let d = t.preOrderHooks;
        d !== null && _i(e, d, 0, null), Ns(e, 0);
      }
    if ((AD(e), oh(e, 0), t.contentQueries !== null && Xf(t, e), !o))
      if (u) {
        let d = t.contentCheckHooks;
        d !== null && Mi(e, d);
      } else {
        let d = t.contentHooks;
        d !== null && _i(e, d, 1), Ns(e, 1);
      }
    eD(t, e);
    let c = t.components;
    c !== null && ah(e, c, 0);
    let l = t.viewQuery;
    if ((l !== null && pa(2, l, n), !o))
      if (u) {
        let d = t.viewCheckHooks;
        d !== null && Mi(e, d);
      } else {
        let d = t.viewHooks;
        d !== null && _i(e, d, 2), Ns(e, 2);
      }
    if ((t.firstUpdatePass === !0 && (t.firstUpdatePass = !1), e[xs])) {
      for (let d of e[xs]) d();
      e[xs] = null;
    }
    o || (e[I] &= -73);
  } catch (u) {
    throw (er(e), u);
  } finally {
    a !== null && (Gc(a, s), Qy(a)), Wa();
  }
}
function TD(t) {
  return t.type !== 2;
}
function oh(t, e) {
  for (let r = Ff(t); r !== null; r = Pf(r))
    for (let n = pe; n < r.length; n++) {
      let i = r[n];
      sh(i, e);
    }
}
function AD(t) {
  for (let e = Ff(t); e !== null; e = Pf(e)) {
    if (!(e[I] & ja.HasTransplantedViews)) continue;
    let r = e[pn];
    for (let n = 0; n < r.length; n++) {
      let i = r[n],
        o = i[J];
      ev(i);
    }
  }
}
function xD(t, e, r) {
  let n = pt(e, t);
  sh(n, r);
}
function sh(t, e) {
  $a(t) && ga(t, e);
}
function ga(t, e) {
  let n = t[A],
    i = t[I],
    o = t[Nt],
    s = !!(e === 0 && i & 16);
  if (
    ((s ||= !!(i & 64 && e === 0)),
    (s ||= !!(i & 1024)),
    (s ||= !!(o?.dirty && ls(o))),
    o && (o.dirty = !1),
    (t[I] &= -9217),
    s)
  )
    SD(n, t, n.template, t[Re]);
  else if (i & 8192) {
    oh(t, 1);
    let a = n.components;
    a !== null && ah(t, a, 1);
  }
}
function ah(t, e, r) {
  for (let n = 0; n < e.length; n++) xD(t, e[n], r);
}
function pu(t) {
  for (t[Je].changeDetectionScheduler?.notify(); t; ) {
    t[I] |= 64;
    let e = tr(t);
    if (Hm(t) && !e) return t;
    t = e;
  }
  return null;
}
var Vt = class {
    get rootNodes() {
      let e = this._lView,
        r = e[A];
      return Wi(r, e, r.firstChild, []);
    }
    constructor(e, r, n = !0) {
      (this._lView = e),
        (this._cdRefInjectingView = r),
        (this.notifyErrorHandler = n),
        (this._appRef = null),
        (this._attachedToViewContainer = !1);
    }
    get context() {
      return this._lView[Re];
    }
    set context(e) {
      this._lView[Re] = e;
    }
    get destroyed() {
      return (this._lView[I] & 256) === 256;
    }
    destroy() {
      if (this._appRef) this._appRef.detachView(this);
      else if (this._attachedToViewContainer) {
        let e = this._lView[J];
        if (tt(e)) {
          let r = e[Oi],
            n = r ? r.indexOf(this) : -1;
          n > -1 && (ia(e, n), ji(r, n));
        }
        this._attachedToViewContainer = !1;
      }
      Ef(this._lView[A], this._lView);
    }
    onDestroy(e) {
      kd(this._lView, e);
    }
    markForCheck() {
      pu(this._cdRefInjectingView || this._lView);
    }
    detach() {
      this._lView[I] &= -129;
    }
    reattach() {
      Ys(this._lView), (this._lView[I] |= 128);
    }
    detectChanges() {
      (this._lView[I] |= 1024), ih(this._lView, this.notifyErrorHandler);
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
      if (this._appRef) throw new v(902, !1);
      this._attachedToViewContainer = !0;
    }
    detachFromAppRef() {
      (this._appRef = null), wf(this._lView[A], this._lView);
    }
    attachToAppRef(e) {
      if (this._attachedToViewContainer) throw new v(902, !1);
      (this._appRef = e), Ys(this._lView);
    }
  },
  Mn = (() => {
    let e = class e {};
    e.__NG_ELEMENT_ID__ = ND;
    let t = e;
    return t;
  })();
function ND(t) {
  return RD(we(), P(), (t & 16) === 16);
}
function RD(t, e, r) {
  if (io(t) && !r) {
    let n = pt(t.index, e);
    return new Vt(n, n);
  } else if (t.type & 47) {
    let n = e[Oe];
    return new Vt(n, e);
  }
  return null;
}
var uh = (() => {
    let e = class e {};
    (e.__NG_ELEMENT_ID__ = OD), (e.__NG_ENV_ID__ = (n) => n);
    let t = e;
    return t;
  })(),
  ma = class extends uh {
    constructor(e) {
      super(), (this._lView = e);
    }
    onDestroy(e) {
      return kd(this._lView, e), () => nv(this._lView, e);
    }
  };
function OD() {
  return new ma(P());
}
var zl = new Set();
function go(t) {
  zl.has(t) ||
    (zl.add(t),
    performance?.mark?.("mark_feature_usage", { detail: { feature: t } }));
}
var va = class extends re {
  constructor(e = !1) {
    super(), (this.__isAsync = e);
  }
  emit(e) {
    super.next(e);
  }
  subscribe(e, r, n) {
    let i = e,
      o = r || (() => null),
      s = n;
    if (e && typeof e == "object") {
      let u = e;
      (i = u.next?.bind(u)), (o = u.error?.bind(u)), (s = u.complete?.bind(u));
    }
    this.__isAsync && ((o = Vs(o)), i && (i = Vs(i)), s && (s = Vs(s)));
    let a = super.subscribe({ next: i, error: o, complete: s });
    return e instanceof G && e.add(a), a;
  }
};
function Vs(t) {
  return (e) => {
    setTimeout(t, void 0, e);
  };
}
var W = va;
function Gl(...t) {}
function FD() {
  let t = typeof he.requestAnimationFrame == "function",
    e = he[t ? "requestAnimationFrame" : "setTimeout"],
    r = he[t ? "cancelAnimationFrame" : "clearTimeout"];
  if (typeof Zone < "u" && e && r) {
    let n = e[Zone.__symbol__("OriginalDelegate")];
    n && (e = n);
    let i = r[Zone.__symbol__("OriginalDelegate")];
    i && (r = i);
  }
  return { nativeRequestAnimationFrame: e, nativeCancelAnimationFrame: r };
}
var V = class t {
    constructor({
      enableLongStackTrace: e = !1,
      shouldCoalesceEventChangeDetection: r = !1,
      shouldCoalesceRunChangeDetection: n = !1,
    }) {
      if (
        ((this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new W(!1)),
        (this.onMicrotaskEmpty = new W(!1)),
        (this.onStable = new W(!1)),
        (this.onError = new W(!1)),
        typeof Zone > "u")
      )
        throw new v(908, !1);
      Zone.assertZonePatched();
      let i = this;
      (i._nesting = 0),
        (i._outer = i._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
        e &&
          Zone.longStackTraceZoneSpec &&
          (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
        (i.shouldCoalesceEventChangeDetection = !n && r),
        (i.shouldCoalesceRunChangeDetection = n),
        (i.lastRequestAnimationFrameId = -1),
        (i.nativeRequestAnimationFrame = FD().nativeRequestAnimationFrame),
        LD(i);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get("isAngularZone") === !0;
    }
    static assertInAngularZone() {
      if (!t.isInAngularZone()) throw new v(909, !1);
    }
    static assertNotInAngularZone() {
      if (t.isInAngularZone()) throw new v(909, !1);
    }
    run(e, r, n) {
      return this._inner.run(e, r, n);
    }
    runTask(e, r, n, i) {
      let o = this._inner,
        s = o.scheduleEventTask("NgZoneEvent: " + i, e, PD, Gl, Gl);
      try {
        return o.runTask(s, r, n);
      } finally {
        o.cancelTask(s);
      }
    }
    runGuarded(e, r, n) {
      return this._inner.runGuarded(e, r, n);
    }
    runOutsideAngular(e) {
      return this._outer.run(e);
    }
  },
  PD = {};
function gu(t) {
  if (t._nesting == 0 && !t.hasPendingMicrotasks && !t.isStable)
    try {
      t._nesting++, t.onMicrotaskEmpty.emit(null);
    } finally {
      if ((t._nesting--, !t.hasPendingMicrotasks))
        try {
          t.runOutsideAngular(() => t.onStable.emit(null));
        } finally {
          t.isStable = !0;
        }
    }
}
function kD(t) {
  t.isCheckStableRunning ||
    t.lastRequestAnimationFrameId !== -1 ||
    ((t.lastRequestAnimationFrameId = t.nativeRequestAnimationFrame.call(
      he,
      () => {
        t.fakeTopEventTask ||
          (t.fakeTopEventTask = Zone.root.scheduleEventTask(
            "fakeTopEventTask",
            () => {
              (t.lastRequestAnimationFrameId = -1),
                ya(t),
                (t.isCheckStableRunning = !0),
                gu(t),
                (t.isCheckStableRunning = !1);
            },
            void 0,
            () => {},
            () => {}
          )),
          t.fakeTopEventTask.invoke();
      }
    )),
    ya(t));
}
function LD(t) {
  let e = () => {
    kD(t);
  };
  t._inner = t._inner.fork({
    name: "angular",
    properties: { isAngularZone: !0 },
    onInvokeTask: (r, n, i, o, s, a) => {
      if (VD(a)) return r.invokeTask(i, o, s, a);
      try {
        return Wl(t), r.invokeTask(i, o, s, a);
      } finally {
        ((t.shouldCoalesceEventChangeDetection && o.type === "eventTask") ||
          t.shouldCoalesceRunChangeDetection) &&
          e(),
          ql(t);
      }
    },
    onInvoke: (r, n, i, o, s, a, u) => {
      try {
        return Wl(t), r.invoke(i, o, s, a, u);
      } finally {
        t.shouldCoalesceRunChangeDetection && e(), ql(t);
      }
    },
    onHasTask: (r, n, i, o) => {
      r.hasTask(i, o),
        n === i &&
          (o.change == "microTask"
            ? ((t._hasPendingMicrotasks = o.microTask), ya(t), gu(t))
            : o.change == "macroTask" &&
              (t.hasPendingMacrotasks = o.macroTask));
    },
    onHandleError: (r, n, i, o) => (
      r.handleError(i, o), t.runOutsideAngular(() => t.onError.emit(o)), !1
    ),
  });
}
function ya(t) {
  t._hasPendingMicrotasks ||
  ((t.shouldCoalesceEventChangeDetection ||
    t.shouldCoalesceRunChangeDetection) &&
    t.lastRequestAnimationFrameId !== -1)
    ? (t.hasPendingMicrotasks = !0)
    : (t.hasPendingMicrotasks = !1);
}
function Wl(t) {
  t._nesting++, t.isStable && ((t.isStable = !1), t.onUnstable.emit(null));
}
function ql(t) {
  t._nesting--, gu(t);
}
var Da = class {
  constructor() {
    (this.hasPendingMicrotasks = !1),
      (this.hasPendingMacrotasks = !1),
      (this.isStable = !0),
      (this.onUnstable = new W()),
      (this.onMicrotaskEmpty = new W()),
      (this.onStable = new W()),
      (this.onError = new W());
  }
  run(e, r, n) {
    return e.apply(r, n);
  }
  runGuarded(e, r, n) {
    return e.apply(r, n);
  }
  runOutsideAngular(e) {
    return e();
  }
  runTask(e, r, n, i) {
    return e.apply(r, n);
  }
};
function VD(t) {
  return !Array.isArray(t) || t.length !== 1
    ? !1
    : t[0].data?.__ignore_ng_zone__ === !0;
}
function jD(t = "zone.js", e) {
  return t === "noop" ? new Da() : t === "zone.js" ? new V(e) : t;
}
var cn = (function (t) {
    return (
      (t[(t.EarlyRead = 0)] = "EarlyRead"),
      (t[(t.Write = 1)] = "Write"),
      (t[(t.MixedReadWrite = 2)] = "MixedReadWrite"),
      (t[(t.Read = 3)] = "Read"),
      t
    );
  })(cn || {}),
  UD = { destroy() {} };
function mu(t, e) {
  !e && iy(mu);
  let r = e?.injector ?? p(Pe);
  if (!ay(r)) return UD;
  go("NgAfterNextRender");
  let n = r.get(vu),
    i = (n.handler ??= new Ca()),
    o = e?.phase ?? cn.MixedReadWrite,
    s = () => {
      i.unregister(u), a();
    },
    a = r.get(uh).onDestroy(s),
    u = new wa(r, o, () => {
      s(), t();
    });
  return i.register(u), { destroy: s };
}
var wa = class {
    constructor(e, r, n) {
      (this.phase = r),
        (this.callbackFn = n),
        (this.zone = e.get(V)),
        (this.errorHandler = e.get(He, null, { optional: !0 }));
    }
    invoke() {
      try {
        this.zone.runOutsideAngular(this.callbackFn);
      } catch (e) {
        this.errorHandler?.handleError(e);
      }
    }
  },
  Ca = class {
    constructor() {
      (this.executingCallbacks = !1),
        (this.buckets = {
          [cn.EarlyRead]: new Set(),
          [cn.Write]: new Set(),
          [cn.MixedReadWrite]: new Set(),
          [cn.Read]: new Set(),
        }),
        (this.deferredCallbacks = new Set());
    }
    register(e) {
      (this.executingCallbacks
        ? this.deferredCallbacks
        : this.buckets[e.phase]
      ).add(e);
    }
    unregister(e) {
      this.buckets[e.phase].delete(e), this.deferredCallbacks.delete(e);
    }
    execute() {
      this.executingCallbacks = !0;
      for (let e of Object.values(this.buckets)) for (let r of e) r.invoke();
      this.executingCallbacks = !1;
      for (let e of this.deferredCallbacks) this.buckets[e.phase].add(e);
      this.deferredCallbacks.clear();
    }
    destroy() {
      for (let e of Object.values(this.buckets)) e.clear();
      this.deferredCallbacks.clear();
    }
  },
  vu = (() => {
    let e = class e {
      constructor() {
        (this.handler = null), (this.internalCallbacks = []);
      }
      execute() {
        let n = [...this.internalCallbacks];
        this.internalCallbacks.length = 0;
        for (let i of n) i();
        this.handler?.execute();
      }
      ngOnDestroy() {
        this.handler?.destroy(),
          (this.handler = null),
          (this.internalCallbacks.length = 0);
      }
    };
    e.ɵprov = w({ token: e, providedIn: "root", factory: () => new e() });
    let t = e;
    return t;
  })();
function $D(t, e) {
  let r = pt(e, t),
    n = r[A];
  BD(n, r);
  let i = r[et];
  i !== null && r[Kn] === null && (r[Kn] = cu(i, r[hn])), yu(n, r, r[Re]);
}
function BD(t, e) {
  for (let r = e.length; r < t.blueprint.length; r++) e.push(t.blueprint[r]);
}
function yu(t, e, r) {
  Ga(e);
  try {
    let n = t.viewQuery;
    n !== null && pa(1, n, r);
    let i = t.template;
    i !== null && Hf(t, e, i, 1, r),
      t.firstCreatePass && (t.firstCreatePass = !1),
      t.staticContentQueries && Xf(t, e),
      t.staticViewQueries && pa(2, t.viewQuery, r);
    let o = t.components;
    o !== null && HD(e, o);
  } catch (n) {
    throw (
      (t.firstCreatePass &&
        ((t.incompleteFirstPass = !0), (t.firstCreatePass = !1)),
      n)
    );
  } finally {
    (e[I] &= -5), Wa();
  }
}
function HD(t, e) {
  for (let r = 0; r < e.length; r++) $D(t, e[r]);
}
function Ea(t, e, r) {
  let n = r ? t.styles : null,
    i = r ? t.classes : null,
    o = 0;
  if (e !== null)
    for (let s = 0; s < e.length; s++) {
      let a = e[s];
      if (typeof a == "number") o = a;
      else if (o == 1) i = Cl(i, a);
      else if (o == 2) {
        let u = a,
          c = e[++s];
        n = Cl(n, u + ": " + c + ";");
      }
    }
  r ? (t.styles = n) : (t.stylesWithoutHost = n),
    r ? (t.classes = i) : (t.classesWithoutHost = i);
}
var qi = class extends fo {
  constructor(e) {
    super(), (this.ngModule = e);
  }
  resolveComponentFactory(e) {
    let r = dt(e);
    return new vn(r, this.ngModule);
  }
};
function Zl(t) {
  let e = [];
  for (let r in t) {
    if (!t.hasOwnProperty(r)) continue;
    let n = t[r];
    n !== void 0 &&
      e.push({ propName: Array.isArray(n) ? n[0] : n, templateName: r });
  }
  return e;
}
function zD(t) {
  let e = t.toLowerCase();
  return e === "svg" ? qm : e === "math" ? Zm : null;
}
var Ia = class {
    constructor(e, r) {
      (this.injector = e), (this.parentInjector = r);
    }
    get(e, r, n) {
      n = no(n);
      let i = this.injector.get(e, ks, n);
      return i !== ks || r === ks ? i : this.parentInjector.get(e, r, n);
    }
  },
  vn = class extends zi {
    get inputs() {
      let e = this.componentDef,
        r = e.inputTransforms,
        n = Zl(e.inputs);
      if (r !== null)
        for (let i of n)
          r.hasOwnProperty(i.propName) && (i.transform = r[i.propName]);
      return n;
    }
    get outputs() {
      return Zl(this.componentDef.outputs);
    }
    constructor(e, r) {
      super(),
        (this.componentDef = e),
        (this.ngModule = r),
        (this.componentType = e.type),
        (this.selector = Vm(e.selectors)),
        (this.ngContentSelectors = e.ngContentSelectors
          ? e.ngContentSelectors
          : []),
        (this.isBoundToModule = !!r);
    }
    create(e, r, n, i) {
      i = i || this.ngModule;
      let o = i instanceof oe ? i : i?.injector;
      o &&
        this.componentDef.getStandaloneInjector !== null &&
        (o = this.componentDef.getStandaloneInjector(o) || o);
      let s = o ? new Ia(e, o) : e,
        a = s.get(rr, null);
      if (a === null) throw new v(407, !1);
      let u = s.get(Hy, null),
        c = s.get(vu, null),
        l = s.get(sa, null),
        d = {
          rendererFactory: a,
          sanitizer: u,
          inlineEffectRunner: null,
          afterRenderEventManager: c,
          changeDetectionScheduler: l,
        },
        f = a.createRenderer(null, this.componentDef),
        h = this.componentDef.selectors[0][0] || "div",
        m = n ? rD(f, n, this.componentDef.encapsulation, s) : Df(f, h, zD(h)),
        F = 512;
      this.componentDef.signals
        ? (F |= 4096)
        : this.componentDef.onPush || (F |= 16);
      let b = null;
      m !== null && (b = cu(m, s, !0));
      let C = fu(0, null, null, 1, 0, null, null, null, null, null, null),
        q = ho(null, C, null, F, null, null, d, f, s, null, b);
      Ga(q);
      let Ee, U;
      try {
        let se = this.componentDef,
          Te,
          $n = null;
        se.findHostDirectiveDefs
          ? ((Te = []),
            ($n = new Map()),
            se.findHostDirectiveDefs(se, Te, $n),
            Te.push(se))
          : (Te = [se]);
        let Mg = GD(q, m),
          _g = WD(Mg, m, se, Te, q, d, f);
        (U = Fd(C, Fe)),
          m && YD(f, se, m, n),
          r !== void 0 && QD(U, this.ngContentSelectors, r),
          (Ee = ZD(_g, se, Te, $n, q, [KD])),
          yu(C, q, null);
      } finally {
        Wa();
      }
      return new ba(this.componentType, Ee, In(U, q), q, U);
    }
  },
  ba = class extends aa {
    constructor(e, r, n, i, o) {
      super(),
        (this.location = n),
        (this._rootLView = i),
        (this._tNode = o),
        (this.previousInputValues = null),
        (this.instance = r),
        (this.hostView = this.changeDetectorRef = new Vt(i, void 0, !1)),
        (this.componentType = e);
    }
    setInput(e, r) {
      let n = this._tNode.inputs,
        i;
      if (n !== null && (i = n[e])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(e) &&
            Object.is(this.previousInputValues.get(e), r))
        )
          return;
        let o = this._rootLView;
        hu(o[A], o, i, e, r), this.previousInputValues.set(e, r);
        let s = pt(this._tNode.index, o);
        pu(s);
      }
    }
    get injector() {
      return new xt(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(e) {
      this.hostView.onDestroy(e);
    }
  };
function GD(t, e) {
  let r = t[A],
    n = Fe;
  return (t[n] = e), dr(r, n, 2, "#host", null);
}
function WD(t, e, r, n, i, o, s) {
  let a = i[A];
  qD(n, t, e, s);
  let u = null;
  e !== null && (u = cu(e, i[hn]));
  let c = o.rendererFactory.createRenderer(e, r),
    l = 16;
  r.signals ? (l = 4096) : r.onPush && (l = 64);
  let d = ho(i, qf(r), null, l, i[t.index], t, o, c, null, null, u);
  return (
    a.firstCreatePass && ha(a, t, n.length - 1), po(i, d), (i[t.index] = d)
  );
}
function qD(t, e, r, n) {
  for (let i of t) e.mergedAttrs = Qn(e.mergedAttrs, i.hostAttrs);
  e.mergedAttrs !== null &&
    (Ea(e, e.mergedAttrs, !0), r !== null && Af(n, r, e));
}
function ZD(t, e, r, n, i, o) {
  let s = we(),
    a = i[A],
    u = Me(s, i);
  Qf(a, i, s, r, null, n);
  for (let l = 0; l < r.length; l++) {
    let d = s.directiveStart + l,
      f = kt(i, a, d, s);
    Lt(f, i);
  }
  Kf(a, i, s), u && Lt(u, i);
  let c = kt(i, a, s.directiveStart + s.componentOffset, s);
  if (((t[Re] = i[Re] = c), o !== null)) for (let l of o) l(c, e);
  return zf(a, s, t), c;
}
function YD(t, e, r, n) {
  if (n) qs(t, r, ["ng-version", "17.1.3"]);
  else {
    let { attrs: i, classes: o } = jm(e.selectors[0]);
    i && qs(t, r, i), o && o.length > 0 && Tf(t, r, o.join(" "));
  }
}
function QD(t, e, r) {
  let n = (t.projection = []);
  for (let i = 0; i < e.length; i++) {
    let o = r[i];
    n.push(o != null ? Array.from(o) : null);
  }
}
function KD() {
  let t = we();
  Qa(P()[A], t);
}
function JD(t) {
  return Object.getPrototypeOf(t.prototype).constructor;
}
function mt(t) {
  let e = JD(t.type),
    r = !0,
    n = [t];
  for (; e; ) {
    let i;
    if (ft(t)) i = e.ɵcmp || e.ɵdir;
    else {
      if (e.ɵcmp) throw new v(903, !1);
      i = e.ɵdir;
    }
    if (i) {
      if (r) {
        n.push(i);
        let s = t;
        (s.inputs = Ei(t.inputs)),
          (s.inputTransforms = Ei(t.inputTransforms)),
          (s.declaredInputs = Ei(t.declaredInputs)),
          (s.outputs = Ei(t.outputs));
        let a = i.hostBindings;
        a && rw(t, a);
        let u = i.viewQuery,
          c = i.contentQueries;
        if (
          (u && tw(t, u),
          c && nw(t, c),
          XD(t, i),
          um(t.outputs, i.outputs),
          ft(i) && i.data.animation)
        ) {
          let l = t.data;
          l.animation = (l.animation || []).concat(i.data.animation);
        }
      }
      let o = i.features;
      if (o)
        for (let s = 0; s < o.length; s++) {
          let a = o[s];
          a && a.ngInherit && a(t), a === mt && (r = !1);
        }
    }
    e = Object.getPrototypeOf(e);
  }
  ew(n);
}
function XD(t, e) {
  for (let r in e.inputs) {
    if (!e.inputs.hasOwnProperty(r) || t.inputs.hasOwnProperty(r)) continue;
    let n = e.inputs[r];
    if (
      n !== void 0 &&
      ((t.inputs[r] = n),
      (t.declaredInputs[r] = e.declaredInputs[r]),
      e.inputTransforms !== null)
    ) {
      let i = Array.isArray(n) ? n[0] : n;
      if (!e.inputTransforms.hasOwnProperty(i)) continue;
      (t.inputTransforms ??= {}), (t.inputTransforms[i] = e.inputTransforms[i]);
    }
  }
}
function ew(t) {
  let e = 0,
    r = null;
  for (let n = t.length - 1; n >= 0; n--) {
    let i = t[n];
    (i.hostVars = e += i.hostVars),
      (i.hostAttrs = Qn(i.hostAttrs, (r = Qn(r, i.hostAttrs))));
  }
}
function Ei(t) {
  return t === fn ? {} : t === be ? [] : t;
}
function tw(t, e) {
  let r = t.viewQuery;
  r
    ? (t.viewQuery = (n, i) => {
        e(n, i), r(n, i);
      })
    : (t.viewQuery = e);
}
function nw(t, e) {
  let r = t.contentQueries;
  r
    ? (t.contentQueries = (n, i, o) => {
        e(n, i, o), r(n, i, o);
      })
    : (t.contentQueries = e);
}
function rw(t, e) {
  let r = t.hostBindings;
  r
    ? (t.hostBindings = (n, i) => {
        e(n, i), r(n, i);
      })
    : (t.hostBindings = e);
}
function ch(t) {
  let e = t.inputConfig,
    r = {};
  for (let n in e)
    if (e.hasOwnProperty(n)) {
      let i = e[n];
      Array.isArray(i) && i[3] && (r[n] = i[3]);
    }
  t.inputTransforms = r;
}
var MN = new RegExp(`^(\\d+)*(${ky}|${Py})*(.*)`);
var iw = () => null;
function Yl(t, e) {
  return iw(t, e);
}
function ow(t, e, r, n) {
  let i = e.tView,
    s = t[I] & 4096 ? 4096 : 16,
    a = ho(
      t,
      i,
      r,
      s,
      null,
      e,
      null,
      null,
      null,
      n?.injector ?? null,
      n?.dehydratedView ?? null
    ),
    u = t[e.index];
  a[ar] = u;
  let c = t[Ue];
  return c !== null && (a[Ue] = c.createEmbeddedView(i)), yu(i, a, r), a;
}
function Ql(t, e) {
  return !e || e.firstChild === null || vf(t);
}
function sw(t, e, r, n = !0) {
  let i = e[A];
  if ((yy(i, e, t, r), n)) {
    let s = oa(r, t),
      a = e[Y],
      u = ou(a, t[Rt]);
    u !== null && my(i, t[De], a, e, u, s);
  }
  let o = e[Kn];
  o !== null && o.firstChild !== null && (o.firstChild = null);
}
var $t = (() => {
  let e = class e {};
  e.__NG_ELEMENT_ID__ = aw;
  let t = e;
  return t;
})();
function aw() {
  let t = we();
  return dh(t, P());
}
var uw = $t,
  lh = class extends uw {
    constructor(e, r, n) {
      super(),
        (this._lContainer = e),
        (this._hostTNode = r),
        (this._hostLView = n);
    }
    get element() {
      return In(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new xt(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let e = Ka(this._hostTNode, this._hostLView);
      if (Qd(e)) {
        let r = ki(e, this._hostLView),
          n = Pi(e),
          i = r[A].data[n + 8];
        return new xt(i, r);
      } else return new xt(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(e) {
      let r = Kl(this._lContainer);
      return (r !== null && r[e]) || null;
    }
    get length() {
      return this._lContainer.length - pe;
    }
    createEmbeddedView(e, r, n) {
      let i, o;
      typeof n == "number"
        ? (i = n)
        : n != null && ((i = n.index), (o = n.injector));
      let s = Yl(this._lContainer, e.ssrId),
        a = e.createEmbeddedViewImpl(r || {}, o, s);
      return this.insertImpl(a, i, Ql(this._hostTNode, s)), a;
    }
    createComponent(e, r, n, i, o) {
      let s = e && !Fv(e),
        a;
      if (s) a = r;
      else {
        let m = r || {};
        (a = m.index),
          (n = m.injector),
          (i = m.projectableNodes),
          (o = m.environmentInjector || m.ngModuleRef);
      }
      let u = s ? e : new vn(dt(e)),
        c = n || this.parentInjector;
      if (!o && u.ngModule == null) {
        let F = (s ? c : this.parentInjector).get(oe, null);
        F && (o = F);
      }
      let l = dt(u.componentType ?? {}),
        d = Yl(this._lContainer, l?.id ?? null),
        f = d?.firstChild ?? null,
        h = u.create(c, i, f, o);
      return this.insertImpl(h.hostView, a, Ql(this._hostTNode, d)), h;
    }
    insert(e, r) {
      return this.insertImpl(e, r, !0);
    }
    insertImpl(e, r, n) {
      let i = e._lView;
      if (Xm(i)) {
        let a = this.indexOf(e);
        if (a !== -1) this.detach(a);
        else {
          let u = i[J],
            c = new lh(u, u[De], u[J]);
          c.detach(c.indexOf(e));
        }
      }
      let o = this._adjustIndex(r),
        s = this._lContainer;
      return sw(s, i, o, n), e.attachToViewContainerRef(), af(js(s), o, e), e;
    }
    move(e, r) {
      return this.insert(e, r);
    }
    indexOf(e) {
      let r = Kl(this._lContainer);
      return r !== null ? r.indexOf(e) : -1;
    }
    remove(e) {
      let r = this._adjustIndex(e, -1),
        n = ia(this._lContainer, r);
      n && (ji(js(this._lContainer), r), Ef(n[A], n));
    }
    detach(e) {
      let r = this._adjustIndex(e, -1),
        n = ia(this._lContainer, r);
      return n && ji(js(this._lContainer), r) != null ? new Vt(n) : null;
    }
    _adjustIndex(e, r = 0) {
      return e ?? this.length + r;
    }
  };
function Kl(t) {
  return t[Oi];
}
function js(t) {
  return t[Oi] || (t[Oi] = []);
}
function dh(t, e) {
  let r,
    n = e[t.index];
  return (
    tt(n) ? (r = n) : ((r = Jf(n, e, null, t)), (e[t.index] = r), po(e, r)),
    lw(r, e, t, n),
    new lh(r, t, e)
  );
}
function cw(t, e) {
  let r = t[Y],
    n = r.createComment(""),
    i = Me(e, t),
    o = ou(r, i);
  return Bi(r, o, n, by(r, i), !1), n;
}
var lw = hw,
  dw = () => !1;
function fw(t, e, r) {
  return dw(t, e, r);
}
function hw(t, e, r, n) {
  if (t[Rt]) return;
  let i;
  r.type & 8 ? (i = Be(n)) : (i = cw(e, r)), (t[Rt] = i);
}
var ht = class {},
  ir = class {};
var Zi = class extends ht {
    constructor(e, r, n) {
      super(),
        (this._parent = r),
        (this._bootstrapComponents = []),
        (this.destroyCbs = []),
        (this.componentFactoryResolver = new qi(this));
      let i = Id(e);
      (this._bootstrapComponents = mf(i.bootstrap)),
        (this._r3Injector = pf(
          e,
          r,
          [
            { provide: ht, useValue: this },
            { provide: fo, useValue: this.componentFactoryResolver },
            ...n,
          ],
          de(e),
          new Set(["environment"])
        )),
        this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(e));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let e = this._r3Injector;
      !e.destroyed && e.destroy(),
        this.destroyCbs.forEach((r) => r()),
        (this.destroyCbs = null);
    }
    onDestroy(e) {
      this.destroyCbs.push(e);
    }
  },
  Yi = class extends ir {
    constructor(e) {
      super(), (this.moduleType = e);
    }
    create(e) {
      return new Zi(this.moduleType, e, []);
    }
  };
function pw(t, e, r) {
  return new Zi(t, e, r);
}
var Ma = class extends ht {
  constructor(e) {
    super(),
      (this.componentFactoryResolver = new qi(this)),
      (this.instance = null);
    let r = new nr(
      [
        ...e.providers,
        { provide: ht, useValue: this },
        { provide: fo, useValue: this.componentFactoryResolver },
      ],
      e.parent || tu(),
      e.debugName,
      new Set(["environment"])
    );
    (this.injector = r),
      e.runEnvironmentInitializers && r.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(e) {
    this.injector.onDestroy(e);
  }
};
function mo(t, e, r = null) {
  return new Ma({
    providers: t,
    parent: e,
    debugName: r,
    runEnvironmentInitializers: !0,
  }).injector;
}
var Bt = (() => {
  let e = class e {
    constructor() {
      (this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new K(!1));
    }
    get _hasPendingTasks() {
      return this.hasPendingTasks.value;
    }
    add() {
      this._hasPendingTasks || this.hasPendingTasks.next(!0);
      let n = this.taskId++;
      return this.pendingTasks.add(n), n;
    }
    remove(n) {
      this.pendingTasks.delete(n),
        this.pendingTasks.size === 0 &&
          this._hasPendingTasks &&
          this.hasPendingTasks.next(!1);
    }
    ngOnDestroy() {
      this.pendingTasks.clear(),
        this._hasPendingTasks && this.hasPendingTasks.next(!1);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function gw(t, e, r) {
  return (t[e] = r);
}
function fr(t, e, r) {
  let n = t[e];
  return Object.is(n, r) ? !1 : ((t[e] = r), !0);
}
function mw(t, e, r, n, i, o, s, a, u) {
  let c = e.consts,
    l = dr(e, t, 4, s || null, Fi(c, a));
  Yf(e, r, l, Fi(c, u)), Qa(e, l);
  let d = (l.tView = fu(
    2,
    l,
    n,
    i,
    o,
    e.directiveRegistry,
    e.pipeRegistry,
    null,
    e.schemas,
    c,
    null
  ));
  return (
    e.queries !== null &&
      (e.queries.template(e, l), (d.queries = e.queries.embeddedTView(l))),
    l
  );
}
function vw(t, e, r, n, i, o, s, a) {
  let u = P(),
    c = X(),
    l = t + Fe,
    d = c.firstCreatePass ? mw(l, c, u, e, r, n, i, o, s) : c.data[l];
  ur(d, !1);
  let f = yw(c, u, d, t);
  Za() && su(c, u, f, d), Lt(f, u);
  let h = Jf(f, u, f, d);
  return (
    (u[l] = h),
    po(u, h),
    fw(h, d, u),
    Ua(d) && Gf(c, u, d),
    s != null && Wf(u, d, a),
    vw
  );
}
var yw = Dw;
function Dw(t, e, r, n) {
  return Ya(!0), e[Y].createComment("");
}
function Du(t, e, r, n) {
  let i = P(),
    o = Ha();
  if (fr(i, o, e)) {
    let s = X(),
      a = qa();
    CD(a, i, t, e, r, n);
  }
  return Du;
}
function fh(t, e, r, n) {
  return fr(t, Ha(), r) ? e + eo(r) + n : gt;
}
function Ii(t, e) {
  return (t << 17) | (e << 2);
}
function jt(t) {
  return (t >> 17) & 32767;
}
function ww(t) {
  return (t & 2) == 2;
}
function Cw(t, e) {
  return (t & 131071) | (e << 17);
}
function _a(t) {
  return t | 2;
}
function yn(t) {
  return (t & 131068) >> 2;
}
function Us(t, e) {
  return (t & -131069) | (e << 2);
}
function Ew(t) {
  return (t & 1) === 1;
}
function Sa(t) {
  return t | 1;
}
function Iw(t, e, r, n, i, o) {
  let s = o ? e.classBindings : e.styleBindings,
    a = jt(s),
    u = yn(s);
  t[n] = r;
  let c = !1,
    l;
  if (Array.isArray(r)) {
    let d = r;
    (l = d[1]), (l === null || lr(d, l) > 0) && (c = !0);
  } else l = r;
  if (i)
    if (u !== 0) {
      let f = jt(t[a + 1]);
      (t[n + 1] = Ii(f, a)),
        f !== 0 && (t[f + 1] = Us(t[f + 1], n)),
        (t[a + 1] = Cw(t[a + 1], n));
    } else
      (t[n + 1] = Ii(a, 0)), a !== 0 && (t[a + 1] = Us(t[a + 1], n)), (a = n);
  else
    (t[n + 1] = Ii(u, 0)),
      a === 0 ? (a = n) : (t[u + 1] = Us(t[u + 1], n)),
      (u = n);
  c && (t[n + 1] = _a(t[n + 1])),
    Jl(t, l, n, !0),
    Jl(t, l, n, !1),
    bw(e, l, t, n, o),
    (s = Ii(a, u)),
    o ? (e.classBindings = s) : (e.styleBindings = s);
}
function bw(t, e, r, n, i) {
  let o = i ? t.residualClasses : t.residualStyles;
  o != null &&
    typeof e == "string" &&
    lr(o, e) >= 0 &&
    (r[n + 1] = Sa(r[n + 1]));
}
function Jl(t, e, r, n) {
  let i = t[r + 1],
    o = e === null,
    s = n ? jt(i) : yn(i),
    a = !1;
  for (; s !== 0 && (a === !1 || o); ) {
    let u = t[s],
      c = t[s + 1];
    Mw(u, e) && ((a = !0), (t[s + 1] = n ? Sa(c) : _a(c))),
      (s = n ? jt(c) : yn(c));
  }
  a && (t[r + 1] = n ? _a(i) : Sa(i));
}
function Mw(t, e) {
  return t === null || e == null || (Array.isArray(t) ? t[1] : t) === e
    ? !0
    : Array.isArray(t) && typeof e == "string"
    ? lr(t, e) >= 0
    : !1;
}
function _w(t, e, r) {
  let n = P(),
    i = Ha();
  if (fr(n, i, e)) {
    let o = X(),
      s = qa();
    Zf(o, s, n, t, e, n[Y], r, !1);
  }
  return _w;
}
function Xl(t, e, r, n, i) {
  let o = e.inputs,
    s = i ? "class" : "style";
  hu(t, r, o[s], s, n);
}
function vo(t, e) {
  return Sw(t, e, null, !0), vo;
}
function Sw(t, e, r, n) {
  let i = P(),
    o = X(),
    s = dv(2);
  if ((o.firstUpdatePass && Aw(o, t, s, n), e !== gt && fr(i, s, e))) {
    let a = o.data[En()];
    Fw(o, a, i, i[Y], t, (i[s + 1] = Pw(e, r)), n, s);
  }
}
function Tw(t, e) {
  return e >= t.expandoStartIndex;
}
function Aw(t, e, r, n) {
  let i = t.data;
  if (i[r + 1] === null) {
    let o = i[En()],
      s = Tw(t, r);
    kw(o, n) && e === null && !s && (e = !1),
      (e = xw(i, o, e, n)),
      Iw(i, o, e, r, s, n);
  }
}
function xw(t, e, r, n) {
  let i = gv(t),
    o = n ? e.residualClasses : e.residualStyles;
  if (i === null)
    (n ? e.classBindings : e.styleBindings) === 0 &&
      ((r = $s(null, t, e, r, n)), (r = or(r, e.attrs, n)), (o = null));
  else {
    let s = e.directiveStylingLast;
    if (s === -1 || t[s] !== i)
      if (((r = $s(i, t, e, r, n)), o === null)) {
        let u = Nw(t, e, n);
        u !== void 0 &&
          Array.isArray(u) &&
          ((u = $s(null, t, e, u[1], n)),
          (u = or(u, e.attrs, n)),
          Rw(t, e, n, u));
      } else o = Ow(t, e, n);
  }
  return (
    o !== void 0 && (n ? (e.residualClasses = o) : (e.residualStyles = o)), r
  );
}
function Nw(t, e, r) {
  let n = r ? e.classBindings : e.styleBindings;
  if (yn(n) !== 0) return t[jt(n)];
}
function Rw(t, e, r, n) {
  let i = r ? e.classBindings : e.styleBindings;
  t[jt(i)] = n;
}
function Ow(t, e, r) {
  let n,
    i = e.directiveEnd;
  for (let o = 1 + e.directiveStylingLast; o < i; o++) {
    let s = t[o].hostAttrs;
    n = or(n, s, r);
  }
  return or(n, e.attrs, r);
}
function $s(t, e, r, n, i) {
  let o = null,
    s = r.directiveEnd,
    a = r.directiveStylingLast;
  for (
    a === -1 ? (a = r.directiveStart) : a++;
    a < s && ((o = e[a]), (n = or(n, o.hostAttrs, i)), o !== t);

  )
    a++;
  return t !== null && (r.directiveStylingLast = a), n;
}
function or(t, e, r) {
  let n = r ? 1 : 2,
    i = -1;
  if (e !== null)
    for (let o = 0; o < e.length; o++) {
      let s = e[o];
      typeof s == "number"
        ? (i = s)
        : i === n &&
          (Array.isArray(t) || (t = t === void 0 ? [] : ["", t]),
          jv(t, s, r ? !0 : e[++o]));
    }
  return t === void 0 ? null : t;
}
function Fw(t, e, r, n, i, o, s, a) {
  if (!(e.type & 3)) return;
  let u = t.data,
    c = u[a + 1],
    l = Ew(c) ? ed(u, e, r, i, yn(c), s) : void 0;
  if (!Qi(l)) {
    Qi(o) || (ww(c) && (o = ed(u, null, r, i, a, s)));
    let d = Od(En(), r);
    xy(n, s, d, i, o);
  }
}
function ed(t, e, r, n, i, o) {
  let s = e === null,
    a;
  for (; i > 0; ) {
    let u = t[i],
      c = Array.isArray(u),
      l = c ? u[1] : u,
      d = l === null,
      f = r[i + 1];
    f === gt && (f = d ? be : void 0);
    let h = d ? Os(f, n) : l === n ? f : void 0;
    if ((c && !Qi(h) && (h = Os(u, n)), Qi(h) && ((a = h), s))) return a;
    let m = t[i + 1];
    i = s ? jt(m) : yn(m);
  }
  if (e !== null) {
    let u = o ? e.residualClasses : e.residualStyles;
    u != null && (a = Os(u, n));
  }
  return a;
}
function Qi(t) {
  return t !== void 0;
}
function Pw(t, e) {
  return (
    t == null ||
      t === "" ||
      (typeof e == "string"
        ? (t = t + e)
        : typeof t == "object" && (t = de(lo(t)))),
    t
  );
}
function kw(t, e) {
  return (t.flags & (e ? 8 : 16)) !== 0;
}
function Lw(t, e, r, n, i, o) {
  let s = e.consts,
    a = Fi(s, i),
    u = dr(e, t, 2, n, a);
  return (
    Yf(e, r, u, Fi(s, o)),
    u.attrs !== null && Ea(u, u.attrs, !1),
    u.mergedAttrs !== null && Ea(u, u.mergedAttrs, !0),
    e.queries !== null && e.queries.elementStart(e, u),
    u
  );
}
function hh(t, e, r, n) {
  let i = P(),
    o = X(),
    s = Fe + t,
    a = i[Y],
    u = o.firstCreatePass ? Lw(s, o, i, e, r, n) : o.data[s],
    c = Vw(o, i, u, a, e, t);
  i[s] = c;
  let l = Ua(u);
  return (
    ur(u, !0),
    Af(a, c, u),
    (u.flags & 32) !== 32 && Za() && su(o, i, c, u),
    rv() === 0 && Lt(c, i),
    iv(),
    l && (Gf(o, i, u), zf(o, u, i)),
    n !== null && Wf(i, u),
    hh
  );
}
function ph() {
  let t = we();
  Ud() ? $d() : ((t = t.parent), ur(t, !1));
  let e = t;
  sv(e) && av(), ov();
  let r = X();
  return (
    r.firstCreatePass && (Qa(r, t), Td(t) && r.queries.elementEnd(t)),
    e.classesWithoutHost != null &&
      Ev(e) &&
      Xl(r, e, P(), e.classesWithoutHost, !0),
    e.stylesWithoutHost != null &&
      Iv(e) &&
      Xl(r, e, P(), e.stylesWithoutHost, !1),
    ph
  );
}
function wu(t, e, r, n) {
  return hh(t, e, r, n), ph(), wu;
}
var Vw = (t, e, r, n, i, o) => (Ya(!0), Df(n, i, yv()));
function SN() {
  return P();
}
var Ki = "en-US";
var jw = Ki;
function Uw(t) {
  typeof t == "string" && (jw = t.toLowerCase().replace(/_/g, "-"));
}
function vt(t) {
  return !!t && typeof t.then == "function";
}
function Cu(t) {
  return !!t && typeof t.subscribe == "function";
}
function hr(t, e, r, n) {
  let i = P(),
    o = X(),
    s = we();
  return Bw(o, i, i[Y], s, t, e, n), hr;
}
function $w(t, e, r, n) {
  let i = t.cleanup;
  if (i != null)
    for (let o = 0; o < i.length - 1; o += 2) {
      let s = i[o];
      if (s === r && i[o + 1] === n) {
        let a = e[Jn],
          u = i[o + 2];
        return a.length > u ? a[u] : null;
      }
      typeof s == "string" && (o += 2);
    }
  return null;
}
function Bw(t, e, r, n, i, o, s) {
  let a = Ua(n),
    c = t.firstCreatePass && th(t),
    l = e[Re],
    d = eh(e),
    f = !0;
  if (n.type & 3 || s) {
    let F = Me(n, e),
      b = s ? s(F) : F,
      C = d.length,
      q = s ? (U) => s(Be(U[n.index])) : n.index,
      Ee = null;
    if ((!s && a && (Ee = $w(t, e, i, n.index)), Ee !== null)) {
      let U = Ee.__ngLastListenerFn__ || Ee;
      (U.__ngNextListenerFn__ = o), (Ee.__ngLastListenerFn__ = o), (f = !1);
    } else {
      o = nd(n, e, l, o, !1);
      let U = r.listen(b, i, o);
      d.push(o, U), c && c.push(i, q, C, C + 1);
    }
  } else o = nd(n, e, l, o, !1);
  let h = n.outputs,
    m;
  if (f && h !== null && (m = h[i])) {
    let F = m.length;
    if (F)
      for (let b = 0; b < F; b += 2) {
        let C = m[b],
          q = m[b + 1],
          se = e[C][q].subscribe(o),
          Te = d.length;
        d.push(o, se), c && c.push(i, n.index, Te, -(Te + 1));
      }
  }
}
function td(t, e, r, n) {
  try {
    return Ve(6, e, r), r(n) !== !1;
  } catch (i) {
    return nh(t, i), !1;
  } finally {
    Ve(7, e, r);
  }
}
function nd(t, e, r, n, i) {
  return function o(s) {
    if (s === Function) return n;
    let a = t.componentOffset > -1 ? pt(t.index, e) : e;
    pu(a);
    let u = td(e, r, n, s),
      c = o.__ngNextListenerFn__;
    for (; c; ) (u = td(e, r, c, s) && u), (c = c.__ngNextListenerFn__);
    return i && u === !1 && s.preventDefault(), u;
  };
}
function TN(t = 1) {
  return vv(t);
}
function Hw(t, e) {
  let r = null,
    n = Om(t);
  for (let i = 0; i < e.length; i++) {
    let o = e[i];
    if (o === "*") {
      r = i;
      continue;
    }
    if (n === null ? yd(t, o, !0) : km(n, o)) return i;
  }
  return r;
}
function AN(t) {
  let e = P()[Oe][De];
  if (!e.projection) {
    let r = t ? t.length : 1,
      n = (e.projection = Lv(r, null)),
      i = n.slice(),
      o = e.child;
    for (; o !== null; ) {
      let s = t ? Hw(o, t) : 0;
      s !== null && (i[s] ? (i[s].projectionNext = o) : (n[s] = o), (i[s] = o)),
        (o = o.next);
    }
  }
}
function xN(t, e = 0, r) {
  let n = P(),
    i = X(),
    o = dr(i, Fe + t, 16, null, r || null);
  o.projection === null && (o.projection = e),
    $d(),
    (!n[Kn] || Vd()) && (o.flags & 32) !== 32 && Ty(i, n, o);
}
function zw(t, e, r, n, i) {
  let o = P(),
    s = fh(o, e, r, n);
  if (s !== gt) {
    let a = X(),
      u = qa();
    Zf(a, u, o, t, s, o[Y], i, !1);
  }
  return zw;
}
function Gw() {
  return this._results[Symbol.iterator]();
}
var Ta = class t {
    get changes() {
      return (this._changes ??= new W());
    }
    constructor(e = !1) {
      (this._emitDistinctChangesOnly = e),
        (this.dirty = !0),
        (this._results = []),
        (this._changesDetected = !1),
        (this._changes = void 0),
        (this.length = 0),
        (this.first = void 0),
        (this.last = void 0);
      let r = t.prototype;
      r[Symbol.iterator] || (r[Symbol.iterator] = Gw);
    }
    get(e) {
      return this._results[e];
    }
    map(e) {
      return this._results.map(e);
    }
    filter(e) {
      return this._results.filter(e);
    }
    find(e) {
      return this._results.find(e);
    }
    reduce(e, r) {
      return this._results.reduce(e, r);
    }
    forEach(e) {
      this._results.forEach(e);
    }
    some(e) {
      return this._results.some(e);
    }
    toArray() {
      return this._results.slice();
    }
    toString() {
      return this._results.toString();
    }
    reset(e, r) {
      this.dirty = !1;
      let n = kv(e);
      (this._changesDetected = !Pv(this._results, n, r)) &&
        ((this._results = n),
        (this.length = n.length),
        (this.last = n[this.length - 1]),
        (this.first = n[0]));
    }
    notifyOnChanges() {
      this._changes !== void 0 &&
        (this._changesDetected || !this._emitDistinctChangesOnly) &&
        this._changes.emit(this);
    }
    setDirty() {
      this.dirty = !0;
    }
    destroy() {
      this._changes !== void 0 &&
        (this._changes.complete(), this._changes.unsubscribe());
    }
  },
  Dn = (() => {
    let e = class e {};
    e.__NG_ELEMENT_ID__ = Zw;
    let t = e;
    return t;
  })(),
  Ww = Dn,
  qw = class extends Ww {
    constructor(e, r, n) {
      super(),
        (this._declarationLView = e),
        (this._declarationTContainer = r),
        (this.elementRef = n);
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null;
    }
    createEmbeddedView(e, r) {
      return this.createEmbeddedViewImpl(e, r);
    }
    createEmbeddedViewImpl(e, r, n) {
      let i = ow(this._declarationLView, this._declarationTContainer, e, {
        injector: r,
        dehydratedView: n,
      });
      return new Vt(i);
    }
  };
function Zw() {
  return Eu(we(), P());
}
function Eu(t, e) {
  return t.type & 4 ? new qw(e, t, In(t, e)) : null;
}
var Aa = class t {
    constructor(e) {
      (this.queryList = e), (this.matches = null);
    }
    clone() {
      return new t(this.queryList);
    }
    setDirty() {
      this.queryList.setDirty();
    }
  },
  xa = class t {
    constructor(e = []) {
      this.queries = e;
    }
    createEmbeddedView(e) {
      let r = e.queries;
      if (r !== null) {
        let n = e.contentQueries !== null ? e.contentQueries[0] : r.length,
          i = [];
        for (let o = 0; o < n; o++) {
          let s = r.getByIndex(o),
            a = this.queries[s.indexInDeclarationView];
          i.push(a.clone());
        }
        return new t(i);
      }
      return null;
    }
    insertView(e) {
      this.dirtyQueriesWithMatches(e);
    }
    detachView(e) {
      this.dirtyQueriesWithMatches(e);
    }
    dirtyQueriesWithMatches(e) {
      for (let r = 0; r < this.queries.length; r++)
        yh(e, r).matches !== null && this.queries[r].setDirty();
    }
  },
  Ji = class {
    constructor(e, r, n = null) {
      (this.predicate = e), (this.flags = r), (this.read = n);
    }
  },
  Na = class t {
    constructor(e = []) {
      this.queries = e;
    }
    elementStart(e, r) {
      for (let n = 0; n < this.queries.length; n++)
        this.queries[n].elementStart(e, r);
    }
    elementEnd(e) {
      for (let r = 0; r < this.queries.length; r++)
        this.queries[r].elementEnd(e);
    }
    embeddedTView(e) {
      let r = null;
      for (let n = 0; n < this.length; n++) {
        let i = r !== null ? r.length : 0,
          o = this.getByIndex(n).embeddedTView(e, i);
        o &&
          ((o.indexInDeclarationView = n), r !== null ? r.push(o) : (r = [o]));
      }
      return r !== null ? new t(r) : null;
    }
    template(e, r) {
      for (let n = 0; n < this.queries.length; n++)
        this.queries[n].template(e, r);
    }
    getByIndex(e) {
      return this.queries[e];
    }
    get length() {
      return this.queries.length;
    }
    track(e) {
      this.queries.push(e);
    }
  },
  Ra = class t {
    constructor(e, r = -1) {
      (this.metadata = e),
        (this.matches = null),
        (this.indexInDeclarationView = -1),
        (this.crossesNgTemplate = !1),
        (this._appliesToNextNode = !0),
        (this._declarationNodeIndex = r);
    }
    elementStart(e, r) {
      this.isApplyingToNode(r) && this.matchTNode(e, r);
    }
    elementEnd(e) {
      this._declarationNodeIndex === e.index && (this._appliesToNextNode = !1);
    }
    template(e, r) {
      this.elementStart(e, r);
    }
    embeddedTView(e, r) {
      return this.isApplyingToNode(e)
        ? ((this.crossesNgTemplate = !0),
          this.addMatch(-e.index, r),
          new t(this.metadata))
        : null;
    }
    isApplyingToNode(e) {
      if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
        let r = this._declarationNodeIndex,
          n = e.parent;
        for (; n !== null && n.type & 8 && n.index !== r; ) n = n.parent;
        return r === (n !== null ? n.index : -1);
      }
      return this._appliesToNextNode;
    }
    matchTNode(e, r) {
      let n = this.metadata.predicate;
      if (Array.isArray(n))
        for (let i = 0; i < n.length; i++) {
          let o = n[i];
          this.matchTNodeWithReadOption(e, r, Yw(r, o)),
            this.matchTNodeWithReadOption(e, r, Si(r, e, o, !1, !1));
        }
      else
        n === Dn
          ? r.type & 4 && this.matchTNodeWithReadOption(e, r, -1)
          : this.matchTNodeWithReadOption(e, r, Si(r, e, n, !1, !1));
    }
    matchTNodeWithReadOption(e, r, n) {
      if (n !== null) {
        let i = this.metadata.read;
        if (i !== null)
          if (i === We || i === $t || (i === Dn && r.type & 4))
            this.addMatch(r.index, -2);
          else {
            let o = Si(r, e, i, !1, !1);
            o !== null && this.addMatch(r.index, o);
          }
        else this.addMatch(r.index, n);
      }
    }
    addMatch(e, r) {
      this.matches === null ? (this.matches = [e, r]) : this.matches.push(e, r);
    }
  };
function Yw(t, e) {
  let r = t.localNames;
  if (r !== null) {
    for (let n = 0; n < r.length; n += 2) if (r[n] === e) return r[n + 1];
  }
  return null;
}
function Qw(t, e) {
  return t.type & 11 ? In(t, e) : t.type & 4 ? Eu(t, e) : null;
}
function Kw(t, e, r, n) {
  return r === -1 ? Qw(e, t) : r === -2 ? Jw(t, e, n) : kt(t, t[A], r, e);
}
function Jw(t, e, r) {
  if (r === We) return In(e, t);
  if (r === Dn) return Eu(e, t);
  if (r === $t) return dh(e, t);
}
function gh(t, e, r, n) {
  let i = e[Ue].queries[n];
  if (i.matches === null) {
    let o = t.data,
      s = r.matches,
      a = [];
    for (let u = 0; u < s.length; u += 2) {
      let c = s[u];
      if (c < 0) a.push(null);
      else {
        let l = o[c];
        a.push(Kw(e, l, s[u + 1], r.metadata.read));
      }
    }
    i.matches = a;
  }
  return i.matches;
}
function Oa(t, e, r, n) {
  let i = t.queries.getByIndex(r),
    o = i.matches;
  if (o !== null) {
    let s = gh(t, e, i, r);
    for (let a = 0; a < o.length; a += 2) {
      let u = o[a];
      if (u > 0) n.push(s[a / 2]);
      else {
        let c = o[a + 1],
          l = e[-u];
        for (let d = pe; d < l.length; d++) {
          let f = l[d];
          f[ar] === f[J] && Oa(f[A], f, c, n);
        }
        if (l[pn] !== null) {
          let d = l[pn];
          for (let f = 0; f < d.length; f++) {
            let h = d[f];
            Oa(h[A], h, c, n);
          }
        }
      }
    }
  }
  return n;
}
function Xw(t, e) {
  return t[Ue].queries[e].queryList;
}
function mh(t, e, r) {
  let n = new Ta((r & 4) === 4);
  sD(t, e, n, n.destroy),
    e[Ue] === null && (e[Ue] = new xa()),
    e[Ue].queries.push(new Aa(n));
}
function vh(t, e, r) {
  t.queries === null && (t.queries = new Na()), t.queries.track(new Ra(e, r));
}
function eC(t, e) {
  let r = t.contentQueries || (t.contentQueries = []),
    n = r.length ? r[r.length - 1] : -1;
  e !== n && r.push(t.queries.length - 1, e);
}
function yh(t, e) {
  return t.queries.getByIndex(e);
}
function tC(t, e, r, n) {
  let i = X();
  if (i.firstCreatePass) {
    let o = we();
    vh(i, new Ji(e, r, n), o.index),
      eC(i, t),
      (r & 2) === 2 && (i.staticContentQueries = !0);
  }
  mh(i, P(), r);
}
function RN(t, e, r) {
  let n = X();
  n.firstCreatePass &&
    (vh(n, new Ji(t, e, r), -1), (e & 2) === 2 && (n.staticViewQueries = !0)),
    mh(n, P(), e);
}
function nC(t) {
  let e = P(),
    r = X(),
    n = Bd();
  za(n + 1);
  let i = yh(r, n);
  if (t.dirty && Jm(e) === ((i.metadata.flags & 2) === 2)) {
    if (i.matches === null) t.reset([]);
    else {
      let o = i.crossesNgTemplate ? Oa(r, e, n, []) : gh(r, e, i, n);
      t.reset(o, $y), t.notifyOnChanges();
    }
    return !0;
  }
  return !1;
}
function rC() {
  return Xw(P(), Bd());
}
function iC(t, e, r, n) {
  r >= t.data.length && ((t.data[r] = null), (t.blueprint[r] = null)),
    (e[r] = n);
}
function ON(t, e = "") {
  let r = P(),
    n = X(),
    i = t + Fe,
    o = n.firstCreatePass ? dr(n, i, 1, e, null) : n.data[i],
    s = oC(n, r, o, e, t);
  (r[i] = s), Za() && su(n, r, s, o), ur(o, !1);
}
var oC = (t, e, r, n, i) => (Ya(!0), hy(e[Y], n));
function sC(t, e, r) {
  let n = P(),
    i = fh(n, t, e, r);
  return i !== gt && MD(n, En(), i), sC;
}
function aC(t, e, r) {
  let n = X();
  if (n.firstCreatePass) {
    let i = ft(t);
    Fa(r, n.data, n.blueprint, i, !0), Fa(e, n.data, n.blueprint, i, !1);
  }
}
function Fa(t, e, r, n, i) {
  if (((t = ie(t)), Array.isArray(t)))
    for (let o = 0; o < t.length; o++) Fa(t[o], e, r, n, i);
  else {
    let o = X(),
      s = P(),
      a = we(),
      u = mn(t) ? t : ie(t.provide),
      c = hf(t),
      l = a.providerIndexes & 1048575,
      d = a.directiveStart,
      f = a.providerIndexes >> 20;
    if (mn(t) || !t.multi) {
      let h = new Pt(c, i, B),
        m = Hs(u, e, i ? l : l + f, d);
      m === -1
        ? (Js(Vi(a, s), o, u),
          Bs(o, t, e.length),
          e.push(u),
          a.directiveStart++,
          a.directiveEnd++,
          i && (a.providerIndexes += 1048576),
          r.push(h),
          s.push(h))
        : ((r[m] = h), (s[m] = h));
    } else {
      let h = Hs(u, e, l + f, d),
        m = Hs(u, e, l, l + f),
        F = h >= 0 && r[h],
        b = m >= 0 && r[m];
      if ((i && !b) || (!i && !F)) {
        Js(Vi(a, s), o, u);
        let C = lC(i ? cC : uC, r.length, i, n, c);
        !i && b && (r[m].providerFactory = C),
          Bs(o, t, e.length, 0),
          e.push(u),
          a.directiveStart++,
          a.directiveEnd++,
          i && (a.providerIndexes += 1048576),
          r.push(C),
          s.push(C);
      } else {
        let C = Dh(r[i ? m : h], c, !i && n);
        Bs(o, t, h > -1 ? h : m, C);
      }
      !i && n && b && r[m].componentProviders++;
    }
  }
}
function Bs(t, e, r, n) {
  let i = mn(e),
    o = Kv(e);
  if (i || o) {
    let u = (o ? ie(e.useClass) : e).prototype.ngOnDestroy;
    if (u) {
      let c = t.destroyHooks || (t.destroyHooks = []);
      if (!i && e.multi) {
        let l = c.indexOf(r);
        l === -1 ? c.push(r, [n, u]) : c[l + 1].push(n, u);
      } else c.push(r, u);
    }
  }
}
function Dh(t, e, r) {
  return r && t.componentProviders++, t.multi.push(e) - 1;
}
function Hs(t, e, r, n) {
  for (let i = r; i < n; i++) if (e[i] === t) return i;
  return -1;
}
function uC(t, e, r, n) {
  return Pa(this.multi, []);
}
function cC(t, e, r, n) {
  let i = this.multi,
    o;
  if (this.providerFactory) {
    let s = this.providerFactory.componentProviders,
      a = kt(r, r[A], this.providerFactory.index, n);
    (o = a.slice(0, s)), Pa(i, o);
    for (let u = s; u < a.length; u++) o.push(a[u]);
  } else (o = []), Pa(i, o);
  return o;
}
function Pa(t, e) {
  for (let r = 0; r < t.length; r++) {
    let n = t[r];
    e.push(n());
  }
  return e;
}
function lC(t, e, r, n, i) {
  let o = new Pt(t, r, B);
  return (
    (o.multi = []),
    (o.index = e),
    (o.componentProviders = 0),
    Dh(o, i, n && !r),
    o
  );
}
function yo(t, e = []) {
  return (r) => {
    r.providersResolver = (n, i) => aC(n, i ? i(t) : t, e);
  };
}
var dC = (() => {
  let e = class e {
    constructor(n) {
      (this._injector = n), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null;
      if (!this.cachedInjectors.has(n)) {
        let i = lf(!1, n.type),
          o =
            i.length > 0
              ? mo([i], this._injector, `Standalone[${n.type.name}]`)
              : null;
        this.cachedInjectors.set(n, o);
      }
      return this.cachedInjectors.get(n);
    }
    ngOnDestroy() {
      try {
        for (let n of this.cachedInjectors.values()) n !== null && n.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
  };
  e.ɵprov = w({
    token: e,
    providedIn: "environment",
    factory: () => new e(D(oe)),
  });
  let t = e;
  return t;
})();
function wh(t) {
  go("NgStandalone"),
    (t.getStandaloneInjector = (e) =>
      e.get(dC).getOrCreateStandaloneInjector(t));
}
function fC(t, e) {
  let r = t[e];
  return r === gt ? void 0 : r;
}
function hC(t, e, r, n, i, o) {
  let s = e + r;
  return fr(t, s, i) ? gw(t, s + 1, o ? n.call(o, i) : n(i)) : fC(t, s + 1);
}
function FN(t, e) {
  let r = X(),
    n,
    i = t + Fe;
  r.firstCreatePass
    ? ((n = pC(e, r.pipeRegistry)),
      (r.data[i] = n),
      n.onDestroy && (r.destroyHooks ??= []).push(i, n.onDestroy))
    : (n = r.data[i]);
  let o = n.factory || (n.factory = Ot(n.type, !0)),
    s,
    a = le(B);
  try {
    let u = Li(!1),
      c = o();
    return Li(u), iC(r, P(), i, c), c;
  } finally {
    le(a);
  }
}
function pC(t, e) {
  if (e)
    for (let r = e.length - 1; r >= 0; r--) {
      let n = e[r];
      if (t === n.name) return n;
    }
}
function PN(t, e, r) {
  let n = t + Fe,
    i = P(),
    o = Km(i, n);
  return gC(i, n) ? hC(i, cv(), e, o.transform, r, o) : o.transform(r);
}
function gC(t, e) {
  return t[A].data[e].pure;
}
var bi = null;
function mC(t) {
  (bi !== null &&
    (t.defaultEncapsulation !== bi.defaultEncapsulation ||
      t.preserveWhitespaces !== bi.preserveWhitespaces)) ||
    (bi = t);
}
var Do = (() => {
    let e = class e {
      log(n) {
        console.log(n);
      }
      warn(n) {
        console.warn(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "platform" }));
    let t = e;
    return t;
  })(),
  ka = class {
    constructor(e, r) {
      (this.ngModuleFactory = e), (this.componentFactories = r);
    }
  },
  wo = (() => {
    let e = class e {
      compileModuleSync(n) {
        return new Yi(n);
      }
      compileModuleAsync(n) {
        return Promise.resolve(this.compileModuleSync(n));
      }
      compileModuleAndAllComponentsSync(n) {
        let i = this.compileModuleSync(n),
          o = Id(n),
          s = mf(o.declarations).reduce((a, u) => {
            let c = dt(u);
            return c && a.push(new vn(c)), a;
          }, []);
        return new ka(i, s);
      }
      compileModuleAndAllComponentsAsync(n) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
      }
      clearCache() {}
      clearCacheFor(n) {}
      getModuleId(n) {}
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  vC = new y("");
var Iu = new y(""),
  pr = new y(""),
  Co = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this._ngZone = n),
          (this.registry = i),
          (this._pendingCount = 0),
          (this._isZoneStable = !0),
          (this._callbacks = []),
          (this.taskTrackingZone = null),
          bu || (yC(o), o.addToWindow(i)),
          this._watchAngularEvents(),
          n.run(() => {
            this.taskTrackingZone =
              typeof Zone > "u" ? null : Zone.current.get("TaskTrackingZone");
          });
      }
      _watchAngularEvents() {
        this._ngZone.onUnstable.subscribe({
          next: () => {
            this._isZoneStable = !1;
          },
        }),
          this._ngZone.runOutsideAngular(() => {
            this._ngZone.onStable.subscribe({
              next: () => {
                V.assertNotInAngularZone(),
                  queueMicrotask(() => {
                    (this._isZoneStable = !0), this._runCallbacksIfReady();
                  });
              },
            });
          });
      }
      increasePendingRequestCount() {
        return (this._pendingCount += 1), this._pendingCount;
      }
      decreasePendingRequestCount() {
        if (((this._pendingCount -= 1), this._pendingCount < 0))
          throw new Error("pending async requests below zero");
        return this._runCallbacksIfReady(), this._pendingCount;
      }
      isStable() {
        return (
          this._isZoneStable &&
          this._pendingCount === 0 &&
          !this._ngZone.hasPendingMacrotasks
        );
      }
      _runCallbacksIfReady() {
        if (this.isStable())
          queueMicrotask(() => {
            for (; this._callbacks.length !== 0; ) {
              let n = this._callbacks.pop();
              clearTimeout(n.timeoutId), n.doneCb();
            }
          });
        else {
          let n = this.getPendingTasks();
          this._callbacks = this._callbacks.filter((i) =>
            i.updateCb && i.updateCb(n) ? (clearTimeout(i.timeoutId), !1) : !0
          );
        }
      }
      getPendingTasks() {
        return this.taskTrackingZone
          ? this.taskTrackingZone.macroTasks.map((n) => ({
              source: n.source,
              creationLocation: n.creationLocation,
              data: n.data,
            }))
          : [];
      }
      addCallback(n, i, o) {
        let s = -1;
        i &&
          i > 0 &&
          (s = setTimeout(() => {
            (this._callbacks = this._callbacks.filter(
              (a) => a.timeoutId !== s
            )),
              n();
          }, i)),
          this._callbacks.push({ doneCb: n, timeoutId: s, updateCb: o });
      }
      whenStable(n, i, o) {
        if (o && !this.taskTrackingZone)
          throw new Error(
            'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
          );
        this.addCallback(n, i, o), this._runCallbacksIfReady();
      }
      getPendingRequestCount() {
        return this._pendingCount;
      }
      registerApplication(n) {
        this.registry.registerApplication(n, this);
      }
      unregisterApplication(n) {
        this.registry.unregisterApplication(n);
      }
      findProviders(n, i, o) {
        return [];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(V), D(Eo), D(pr));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Eo = (() => {
    let e = class e {
      constructor() {
        this._applications = new Map();
      }
      registerApplication(n, i) {
        this._applications.set(n, i);
      }
      unregisterApplication(n) {
        this._applications.delete(n);
      }
      unregisterAllApplications() {
        this._applications.clear();
      }
      getTestability(n) {
        return this._applications.get(n) || null;
      }
      getAllTestabilities() {
        return Array.from(this._applications.values());
      }
      getAllRootElements() {
        return Array.from(this._applications.keys());
      }
      findTestabilityInTree(n, i = !0) {
        return bu?.findTestabilityInTree(this, n, i) ?? null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "platform" }));
    let t = e;
    return t;
  })();
function yC(t) {
  bu = t;
}
var bu,
  Io = new y(""),
  Ch = (() => {
    let e = class e {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((n, i) => {
            (this.resolve = n), (this.reject = i);
          })),
          (this.appInits = p(Io, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let n = [];
        for (let o of this.appInits) {
          let s = o();
          if (vt(s)) n.push(s);
          else if (Cu(s)) {
            let a = new Promise((u, c) => {
              s.subscribe({ complete: u, error: c });
            });
            n.push(a);
          }
        }
        let i = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(n)
          .then(() => {
            i();
          })
          .catch((o) => {
            this.reject(o);
          }),
          n.length === 0 && i(),
          (this.initialized = !0);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  bo = new y("");
function DC(t, e, r) {
  let n = new Yi(r);
  return Promise.resolve(n);
}
function wC() {
  qc(() => {
    throw new v(600, !1);
  });
}
function CC(t) {
  return t.isBoundToModule;
}
function EC(t, e, r) {
  try {
    let n = r();
    return vt(n)
      ? n.catch((i) => {
          throw (e.runOutsideAngular(() => t.handleError(i)), i);
        })
      : n;
  } catch (n) {
    throw (e.runOutsideAngular(() => t.handleError(n)), n);
  }
}
function Eh(t, e) {
  return Array.isArray(e) ? e.reduce(Eh, t) : g(g({}, t), e);
}
var Ht = (() => {
  let e = class e {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = p(Lf)),
        (this.afterRenderEffectManager = p(vu)),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = p(Bt).hasPendingTasks.pipe(_((n) => !n))),
        (this._injector = p(oe));
    }
    get destroyed() {
      return this._destroyed;
    }
    get injector() {
      return this._injector;
    }
    bootstrap(n, i) {
      let o = n instanceof zi;
      if (!this._injector.get(Ch).done) {
        let h = !o && Ed(n),
          m = !1;
        throw new v(405, m);
      }
      let a;
      o ? (a = n) : (a = this._injector.get(fo).resolveComponentFactory(n)),
        this.componentTypes.push(a.componentType);
      let u = CC(a) ? void 0 : this._injector.get(ht),
        c = i || a.selector,
        l = a.create(Pe.NULL, [], c, u),
        d = l.location.nativeElement,
        f = l.injector.get(Iu, null);
      return (
        f?.registerApplication(d),
        l.onDestroy(() => {
          this.detachView(l.hostView),
            xi(this.components, l),
            f?.unregisterApplication(d);
        }),
        this._loadComponent(l),
        l
      );
    }
    tick() {
      if (this._runningTick) throw new v(101, !1);
      try {
        (this._runningTick = !0), this.detectChangesInAttachedViews();
      } catch (n) {
        this.internalErrorHandler(n);
      } finally {
        this._runningTick = !1;
      }
    }
    detectChangesInAttachedViews() {
      let n = 0;
      do {
        if (n === rh) throw new v(103, !1);
        let i = n === 0;
        for (let { _lView: o, notifyErrorHandler: s } of this._views)
          (!i && !id(o)) || this.detectChangesInView(o, s, i);
        this.afterRenderEffectManager.execute(), n++;
      } while (this._views.some(({ _lView: i }) => id(i)));
    }
    detectChangesInView(n, i, o) {
      let s;
      o ? ((s = 0), (n[I] |= 1024)) : n[I] & 64 ? (s = 0) : (s = 1),
        ih(n, i, s);
    }
    attachView(n) {
      let i = n;
      this._views.push(i), i.attachToAppRef(this);
    }
    detachView(n) {
      let i = n;
      xi(this._views, i), i.detachFromAppRef();
    }
    _loadComponent(n) {
      this.attachView(n.hostView), this.tick(), this.components.push(n);
      let i = this._injector.get(bo, []);
      [...this._bootstrapListeners, ...i].forEach((o) => o(n));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((n) => n()),
            this._views.slice().forEach((n) => n.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._bootstrapListeners = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(n) {
      return (
        this._destroyListeners.push(n), () => xi(this._destroyListeners, n)
      );
    }
    destroy() {
      if (this._destroyed) throw new v(406, !1);
      let n = this._injector;
      n.destroy && !n.destroyed && n.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    warnIfDestroyed() {}
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function xi(t, e) {
  let r = t.indexOf(e);
  r > -1 && t.splice(r, 1);
}
function rd(t) {
  for (let e = t.length - 1; e >= 0; e--) if (t[e] !== void 0) return t[e];
}
function id(t) {
  return Ba(t);
}
var IC = (() => {
  let e = class e {
    constructor() {
      (this.zone = p(V)), (this.applicationRef = p(Ht));
    }
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription =
          this.zone.onMicrotaskEmpty.subscribe({
            next: () => {
              this.zone.run(() => {
                this.applicationRef.tick();
              });
            },
          }));
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function bC(t) {
  return [
    { provide: V, useFactory: t },
    {
      provide: gn,
      multi: !0,
      useFactory: () => {
        let e = p(IC, { optional: !0 });
        return () => e.initialize();
      },
    },
    {
      provide: gn,
      multi: !0,
      useFactory: () => {
        let e = p(SC);
        return () => {
          e.initialize();
        };
      },
    },
    { provide: Lf, useFactory: MC },
  ];
}
function MC() {
  let t = p(V),
    e = p(He);
  return (r) => t.runOutsideAngular(() => e.handleError(r));
}
function _C(t) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: t?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: t?.runCoalescing ?? !1,
  };
}
var SC = (() => {
  let e = class e {
    constructor() {
      (this.subscription = new G()),
        (this.initialized = !1),
        (this.zone = p(V)),
        (this.pendingTasks = p(Bt));
    }
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let n = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (n = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              V.assertNotInAngularZone(),
                queueMicrotask(() => {
                  n !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(n), (n = null));
                });
            })
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            V.assertInAngularZone(), (n ??= this.pendingTasks.add());
          })
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function TC() {
  return (typeof $localize < "u" && $localize.locale) || Ki;
}
var Mu = new y("", {
  providedIn: "root",
  factory: () => p(Mu, N.Optional | N.SkipSelf) || TC(),
});
var Ih = new y(""),
  bh = (() => {
    let e = class e {
      constructor(n) {
        (this._injector = n),
          (this._modules = []),
          (this._destroyListeners = []),
          (this._destroyed = !1);
      }
      bootstrapModuleFactory(n, i) {
        let o = jD(
          i?.ngZone,
          _C({
            eventCoalescing: i?.ngZoneEventCoalescing,
            runCoalescing: i?.ngZoneRunCoalescing,
          })
        );
        return o.run(() => {
          let s = pw(
              n.moduleType,
              this.injector,
              bC(() => o)
            ),
            a = s.injector.get(He, null);
          return (
            o.runOutsideAngular(() => {
              let u = o.onError.subscribe({
                next: (c) => {
                  a.handleError(c);
                },
              });
              s.onDestroy(() => {
                xi(this._modules, s), u.unsubscribe();
              });
            }),
            EC(a, o, () => {
              let u = s.injector.get(Ch);
              return (
                u.runInitializers(),
                u.donePromise.then(() => {
                  let c = s.injector.get(Mu, Ki);
                  return Uw(c || Ki), this._moduleDoBootstrap(s), s;
                })
              );
            })
          );
        });
      }
      bootstrapModule(n, i = []) {
        let o = Eh({}, i);
        return DC(this.injector, o, n).then((s) =>
          this.bootstrapModuleFactory(s, o)
        );
      }
      _moduleDoBootstrap(n) {
        let i = n.injector.get(Ht);
        if (n._bootstrapComponents.length > 0)
          n._bootstrapComponents.forEach((o) => i.bootstrap(o));
        else if (n.instance.ngDoBootstrap) n.instance.ngDoBootstrap(i);
        else throw new v(-403, !1);
        this._modules.push(n);
      }
      onDestroy(n) {
        this._destroyListeners.push(n);
      }
      get injector() {
        return this._injector;
      }
      destroy() {
        if (this._destroyed) throw new v(404, !1);
        this._modules.slice().forEach((i) => i.destroy()),
          this._destroyListeners.forEach((i) => i());
        let n = this._injector.get(Ih, null);
        n && (n.forEach((i) => i()), n.clear()), (this._destroyed = !0);
      }
      get destroyed() {
        return this._destroyed;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(Pe));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "platform" }));
    let t = e;
    return t;
  })(),
  Zn = null,
  Mh = new y("");
function AC(t) {
  if (Zn && !Zn.get(Mh, !1)) throw new v(400, !1);
  wC(), (Zn = t);
  let e = t.get(bh);
  return RC(t), e;
}
function _u(t, e, r = []) {
  let n = `Platform: ${e}`,
    i = new y(n);
  return (o = []) => {
    let s = _h();
    if (!s || s.injector.get(Mh, !1)) {
      let a = [...r, ...o, { provide: i, useValue: !0 }];
      t ? t(a) : AC(xC(a, n));
    }
    return NC(i);
  };
}
function xC(t = [], e) {
  return Pe.create({
    name: e,
    providers: [
      { provide: ao, useValue: "platform" },
      { provide: Ih, useValue: new Set([() => (Zn = null)]) },
      ...t,
    ],
  });
}
function NC(t) {
  let e = _h();
  if (!e) throw new v(401, !1);
  return e;
}
function _h() {
  return Zn?.get(bh) ?? null;
}
function RC(t) {
  t.get(nu, null)?.forEach((r) => r());
}
var Sh = _u(null, "core", []),
  Th = (() => {
    let e = class e {
      constructor(n) {}
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(Ht));
    }),
      (e.ɵmod = ve({ type: e })),
      (e.ɵinj = me({}));
    let t = e;
    return t;
  })();
function Su(t) {
  return typeof t == "boolean" ? t : t != null && t !== "false";
}
function Ah(t) {
  let e = dt(t);
  if (!e) return null;
  let r = new vn(e);
  return {
    get selector() {
      return r.selector;
    },
    get type() {
      return r.componentType;
    },
    get inputs() {
      return r.inputs;
    },
    get outputs() {
      return r.outputs;
    },
    get ngContentSelectors() {
      return r.ngContentSelectors;
    },
    get isStandalone() {
      return e.standalone;
    },
    get isSignal() {
      return e.signals;
    },
  };
}
var Oh = null;
function qe() {
  return Oh;
}
function Fh(t) {
  Oh ??= t;
}
var Mo = class {},
  te = new y(""),
  Fu = (() => {
    let e = class e {
      historyGo(n) {
        throw new Error("");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => p(FC), providedIn: "platform" }));
    let t = e;
    return t;
  })(),
  Ph = new y(""),
  FC = (() => {
    let e = class e extends Fu {
      constructor() {
        super(),
          (this._doc = p(te)),
          (this._location = window.location),
          (this._history = window.history);
      }
      getBaseHrefFromDOM() {
        return qe().getBaseHref(this._doc);
      }
      onPopState(n) {
        let i = qe().getGlobalEventTarget(this._doc, "window");
        return (
          i.addEventListener("popstate", n, !1),
          () => i.removeEventListener("popstate", n)
        );
      }
      onHashChange(n) {
        let i = qe().getGlobalEventTarget(this._doc, "window");
        return (
          i.addEventListener("hashchange", n, !1),
          () => i.removeEventListener("hashchange", n)
        );
      }
      get href() {
        return this._location.href;
      }
      get protocol() {
        return this._location.protocol;
      }
      get hostname() {
        return this._location.hostname;
      }
      get port() {
        return this._location.port;
      }
      get pathname() {
        return this._location.pathname;
      }
      get search() {
        return this._location.search;
      }
      get hash() {
        return this._location.hash;
      }
      set pathname(n) {
        this._location.pathname = n;
      }
      pushState(n, i, o) {
        this._history.pushState(n, i, o);
      }
      replaceState(n, i, o) {
        this._history.replaceState(n, i, o);
      }
      forward() {
        this._history.forward();
      }
      back() {
        this._history.back();
      }
      historyGo(n = 0) {
        this._history.go(n);
      }
      getState() {
        return this._history.state;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({
        token: e,
        factory: () => new e(),
        providedIn: "platform",
      }));
    let t = e;
    return t;
  })();
function Pu(t, e) {
  if (t.length == 0) return e;
  if (e.length == 0) return t;
  let r = 0;
  return (
    t.endsWith("/") && r++,
    e.startsWith("/") && r++,
    r == 2 ? t + e.substring(1) : r == 1 ? t + e : t + "/" + e
  );
}
function xh(t) {
  let e = t.match(/#|\?|$/),
    r = (e && e.index) || t.length,
    n = r - (t[r - 1] === "/" ? 1 : 0);
  return t.slice(0, n) + t.slice(r);
}
function nt(t) {
  return t && t[0] !== "?" ? "?" + t : t;
}
var zt = (() => {
    let e = class e {
      historyGo(n) {
        throw new Error("");
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => p(ku), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  kh = new y(""),
  ku = (() => {
    let e = class e extends zt {
      constructor(n, i) {
        super(),
          (this._platformLocation = n),
          (this._removeListenerFns = []),
          (this._baseHref =
            i ??
            this._platformLocation.getBaseHrefFromDOM() ??
            p(te).location?.origin ??
            "");
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(n) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(n),
          this._platformLocation.onHashChange(n)
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(n) {
        return Pu(this._baseHref, n);
      }
      path(n = !1) {
        let i =
            this._platformLocation.pathname + nt(this._platformLocation.search),
          o = this._platformLocation.hash;
        return o && n ? `${i}${o}` : i;
      }
      pushState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + nt(s));
        this._platformLocation.pushState(n, i, a);
      }
      replaceState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + nt(s));
        this._platformLocation.replaceState(n, i, a);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(n = 0) {
        this._platformLocation.historyGo?.(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(Fu), D(kh, 8));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Lh = (() => {
    let e = class e extends zt {
      constructor(n, i) {
        super(),
          (this._platformLocation = n),
          (this._baseHref = ""),
          (this._removeListenerFns = []),
          i != null && (this._baseHref = i);
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; )
          this._removeListenerFns.pop()();
      }
      onPopState(n) {
        this._removeListenerFns.push(
          this._platformLocation.onPopState(n),
          this._platformLocation.onHashChange(n)
        );
      }
      getBaseHref() {
        return this._baseHref;
      }
      path(n = !1) {
        let i = this._platformLocation.hash ?? "#";
        return i.length > 0 ? i.substring(1) : i;
      }
      prepareExternalUrl(n) {
        let i = Pu(this._baseHref, n);
        return i.length > 0 ? "#" + i : i;
      }
      pushState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + nt(s));
        a.length == 0 && (a = this._platformLocation.pathname),
          this._platformLocation.pushState(n, i, a);
      }
      replaceState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + nt(s));
        a.length == 0 && (a = this._platformLocation.pathname),
          this._platformLocation.replaceState(n, i, a);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(n = 0) {
        this._platformLocation.historyGo?.(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(Fu), D(kh, 8));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Sn = (() => {
    let e = class e {
      constructor(n) {
        (this._subject = new W()),
          (this._urlChangeListeners = []),
          (this._urlChangeSubscription = null),
          (this._locationStrategy = n);
        let i = this._locationStrategy.getBaseHref();
        (this._basePath = LC(xh(Nh(i)))),
          this._locationStrategy.onPopState((o) => {
            this._subject.emit({
              url: this.path(!0),
              pop: !0,
              state: o.state,
              type: o.type,
            });
          });
      }
      ngOnDestroy() {
        this._urlChangeSubscription?.unsubscribe(),
          (this._urlChangeListeners = []);
      }
      path(n = !1) {
        return this.normalize(this._locationStrategy.path(n));
      }
      getState() {
        return this._locationStrategy.getState();
      }
      isCurrentPathEqualTo(n, i = "") {
        return this.path() == this.normalize(n + nt(i));
      }
      normalize(n) {
        return e.stripTrailingSlash(kC(this._basePath, Nh(n)));
      }
      prepareExternalUrl(n) {
        return (
          n && n[0] !== "/" && (n = "/" + n),
          this._locationStrategy.prepareExternalUrl(n)
        );
      }
      go(n, i = "", o = null) {
        this._locationStrategy.pushState(o, "", n, i),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(n + nt(i)), o);
      }
      replaceState(n, i = "", o = null) {
        this._locationStrategy.replaceState(o, "", n, i),
          this._notifyUrlChangeListeners(this.prepareExternalUrl(n + nt(i)), o);
      }
      forward() {
        this._locationStrategy.forward();
      }
      back() {
        this._locationStrategy.back();
      }
      historyGo(n = 0) {
        this._locationStrategy.historyGo?.(n);
      }
      onUrlChange(n) {
        return (
          this._urlChangeListeners.push(n),
          (this._urlChangeSubscription ??= this.subscribe((i) => {
            this._notifyUrlChangeListeners(i.url, i.state);
          })),
          () => {
            let i = this._urlChangeListeners.indexOf(n);
            this._urlChangeListeners.splice(i, 1),
              this._urlChangeListeners.length === 0 &&
                (this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeSubscription = null));
          }
        );
      }
      _notifyUrlChangeListeners(n = "", i) {
        this._urlChangeListeners.forEach((o) => o(n, i));
      }
      subscribe(n, i, o) {
        return this._subject.subscribe({ next: n, error: i, complete: o });
      }
    };
    (e.normalizeQueryParams = nt),
      (e.joinWithSlash = Pu),
      (e.stripTrailingSlash = xh),
      (e.ɵfac = function (i) {
        return new (i || e)(D(zt));
      }),
      (e.ɵprov = w({ token: e, factory: () => PC(), providedIn: "root" }));
    let t = e;
    return t;
  })();
function PC() {
  return new Sn(D(zt));
}
function kC(t, e) {
  if (!t || !e.startsWith(t)) return e;
  let r = e.substring(t.length);
  return r === "" || ["/", ";", "?", "#"].includes(r[0]) ? r : e;
}
function Nh(t) {
  return t.replace(/\/index.html$/, "");
}
function LC(t) {
  if (new RegExp("^(https?:)?//").test(t)) {
    let [, r] = t.split(/\/\/[^\/]+/);
    return r;
  }
  return t;
}
function _o(t, e) {
  e = encodeURIComponent(e);
  for (let r of t.split(";")) {
    let n = r.indexOf("="),
      [i, o] = n == -1 ? [r, ""] : [r.slice(0, n), r.slice(n + 1)];
    if (i.trim() === e) return decodeURIComponent(o);
  }
  return null;
}
var Tu = class {
    constructor(e, r, n, i) {
      (this.$implicit = e),
        (this.ngForOf = r),
        (this.index = n),
        (this.count = i);
    }
    get first() {
      return this.index === 0;
    }
    get last() {
      return this.index === this.count - 1;
    }
    get even() {
      return this.index % 2 === 0;
    }
    get odd() {
      return !this.even;
    }
  },
  oR = (() => {
    let e = class e {
      set ngForOf(n) {
        (this._ngForOf = n), (this._ngForOfDirty = !0);
      }
      set ngForTrackBy(n) {
        this._trackByFn = n;
      }
      get ngForTrackBy() {
        return this._trackByFn;
      }
      constructor(n, i, o) {
        (this._viewContainer = n),
          (this._template = i),
          (this._differs = o),
          (this._ngForOf = null),
          (this._ngForOfDirty = !0),
          (this._differ = null);
      }
      set ngForTemplate(n) {
        n && (this._template = n);
      }
      ngDoCheck() {
        if (this._ngForOfDirty) {
          this._ngForOfDirty = !1;
          let n = this._ngForOf;
          if (!this._differ && n)
            if (0)
              try {
              } catch {}
            else this._differ = this._differs.find(n).create(this.ngForTrackBy);
        }
        if (this._differ) {
          let n = this._differ.diff(this._ngForOf);
          n && this._applyChanges(n);
        }
      }
      _applyChanges(n) {
        let i = this._viewContainer;
        n.forEachOperation((o, s, a) => {
          if (o.previousIndex == null)
            i.createEmbeddedView(
              this._template,
              new Tu(o.item, this._ngForOf, -1, -1),
              a === null ? void 0 : a
            );
          else if (a == null) i.remove(s === null ? void 0 : s);
          else if (s !== null) {
            let u = i.get(s);
            i.move(u, a), Rh(u, o);
          }
        });
        for (let o = 0, s = i.length; o < s; o++) {
          let u = i.get(o).context;
          (u.index = o), (u.count = s), (u.ngForOf = this._ngForOf);
        }
        n.forEachIdentityChange((o) => {
          let s = i.get(o.currentIndex);
          Rh(s, o);
        });
      }
      static ngTemplateContextGuard(n, i) {
        return !0;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(B($t), B(Dn), B(du));
    }),
      (e.ɵdir = ye({
        type: e,
        selectors: [["", "ngFor", "", "ngForOf", ""]],
        inputs: {
          ngForOf: "ngForOf",
          ngForTrackBy: "ngForTrackBy",
          ngForTemplate: "ngForTemplate",
        },
        standalone: !0,
      }));
    let t = e;
    return t;
  })();
function Rh(t, e) {
  t.context.$implicit = e.item;
}
function Vh(t, e) {
  return new v(2100, !1);
}
var Au = class {
    createSubscription(e, r) {
      return lu(() =>
        e.subscribe({
          next: r,
          error: (n) => {
            throw n;
          },
        })
      );
    }
    dispose(e) {
      lu(() => e.unsubscribe());
    }
  },
  xu = class {
    createSubscription(e, r) {
      return e.then(r, (n) => {
        throw n;
      });
    }
    dispose(e) {}
  },
  VC = new xu(),
  jC = new Au(),
  sR = (() => {
    let e = class e {
      constructor(n) {
        (this._latestValue = null),
          (this._subscription = null),
          (this._obj = null),
          (this._strategy = null),
          (this._ref = n);
      }
      ngOnDestroy() {
        this._subscription && this._dispose(), (this._ref = null);
      }
      transform(n) {
        return this._obj
          ? n !== this._obj
            ? (this._dispose(), this.transform(n))
            : this._latestValue
          : (n && this._subscribe(n), this._latestValue);
      }
      _subscribe(n) {
        (this._obj = n),
          (this._strategy = this._selectStrategy(n)),
          (this._subscription = this._strategy.createSubscription(n, (i) =>
            this._updateLatestValue(n, i)
          ));
      }
      _selectStrategy(n) {
        if (vt(n)) return VC;
        if (Cu(n)) return jC;
        throw Vh(e, n);
      }
      _dispose() {
        this._strategy.dispose(this._subscription),
          (this._latestValue = null),
          (this._subscription = null),
          (this._obj = null);
      }
      _updateLatestValue(n, i) {
        n === this._obj && ((this._latestValue = i), this._ref.markForCheck());
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(B(Mn, 16));
    }),
      (e.ɵpipe = Va({ name: "async", type: e, pure: !1, standalone: !0 }));
    let t = e;
    return t;
  })();
var UC =
    /(?:[0-9A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD23\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF1C\uDF27\uDF30-\uDF45\uDF70-\uDF81\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDEB8\uDF00-\uDF1A\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCDF\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDEE0-\uDEF2\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE70-\uDEBE\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD837[\uDF00-\uDF1E]|\uD838[\uDD00-\uDD2C\uDD37-\uDD3D\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB]|\uD839[\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])\S*/g,
  aR = (() => {
    let e = class e {
      transform(n) {
        if (n == null) return null;
        if (typeof n != "string") throw Vh(e, n);
        return n.replace(
          UC,
          (i) => i[0].toUpperCase() + i.slice(1).toLowerCase()
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵpipe = Va({ name: "titlecase", type: e, pure: !0, standalone: !0 }));
    let t = e;
    return t;
  })();
var jh = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = ve({ type: e })),
      (e.ɵinj = me({}));
    let t = e;
    return t;
  })(),
  Lu = "browser",
  $C = "server";
function BC(t) {
  return t === Lu;
}
function Vu(t) {
  return t === $C;
}
var Uh = (() => {
    let e = class e {};
    e.ɵprov = w({
      token: e,
      providedIn: "root",
      factory: () => (BC(p(Ge)) ? new Nu(p(te), window) : new Ru()),
    });
    let t = e;
    return t;
  })(),
  Nu = class {
    constructor(e, r) {
      (this.document = e), (this.window = r), (this.offset = () => [0, 0]);
    }
    setOffset(e) {
      Array.isArray(e) ? (this.offset = () => e) : (this.offset = e);
    }
    getScrollPosition() {
      return [this.window.scrollX, this.window.scrollY];
    }
    scrollToPosition(e) {
      this.window.scrollTo(e[0], e[1]);
    }
    scrollToAnchor(e) {
      let r = HC(this.document, e);
      r && (this.scrollToElement(r), r.focus());
    }
    setHistoryScrollRestoration(e) {
      this.window.history.scrollRestoration = e;
    }
    scrollToElement(e) {
      let r = e.getBoundingClientRect(),
        n = r.left + this.window.pageXOffset,
        i = r.top + this.window.pageYOffset,
        o = this.offset();
      this.window.scrollTo(n - o[0], i - o[1]);
    }
  };
function HC(t, e) {
  let r = t.getElementById(e) || t.getElementsByName(e)[0];
  if (r) return r;
  if (
    typeof t.createTreeWalker == "function" &&
    t.body &&
    typeof t.body.attachShadow == "function"
  ) {
    let n = t.createTreeWalker(t.body, NodeFilter.SHOW_ELEMENT),
      i = n.currentNode;
    for (; i; ) {
      let o = i.shadowRoot;
      if (o) {
        let s = o.getElementById(e) || o.querySelector(`[name="${e}"]`);
        if (s) return s;
      }
      i = n.nextNode();
    }
  }
  return null;
}
var Ru = class {
    setOffset(e) {}
    getScrollPosition() {
      return [0, 0];
    }
    scrollToPosition(e) {}
    scrollToAnchor(e) {}
    setHistoryScrollRestoration(e) {}
  },
  _n = class {};
var vr = class {},
  To = class {},
  Gt = class t {
    constructor(e) {
      (this.normalizedNames = new Map()),
        (this.lazyUpdate = null),
        e
          ? typeof e == "string"
            ? (this.lazyInit = () => {
                (this.headers = new Map()),
                  e
                    .split(
                      `
`
                    )
                    .forEach((r) => {
                      let n = r.indexOf(":");
                      if (n > 0) {
                        let i = r.slice(0, n),
                          o = i.toLowerCase(),
                          s = r.slice(n + 1).trim();
                        this.maybeSetNormalizedName(i, o),
                          this.headers.has(o)
                            ? this.headers.get(o).push(s)
                            : this.headers.set(o, [s]);
                      }
                    });
              })
            : typeof Headers < "u" && e instanceof Headers
            ? ((this.headers = new Map()),
              e.forEach((r, n) => {
                this.setHeaderEntries(n, r);
              }))
            : (this.lazyInit = () => {
                (this.headers = new Map()),
                  Object.entries(e).forEach(([r, n]) => {
                    this.setHeaderEntries(r, n);
                  });
              })
          : (this.headers = new Map());
    }
    has(e) {
      return this.init(), this.headers.has(e.toLowerCase());
    }
    get(e) {
      this.init();
      let r = this.headers.get(e.toLowerCase());
      return r && r.length > 0 ? r[0] : null;
    }
    keys() {
      return this.init(), Array.from(this.normalizedNames.values());
    }
    getAll(e) {
      return this.init(), this.headers.get(e.toLowerCase()) || null;
    }
    append(e, r) {
      return this.clone({ name: e, value: r, op: "a" });
    }
    set(e, r) {
      return this.clone({ name: e, value: r, op: "s" });
    }
    delete(e, r) {
      return this.clone({ name: e, value: r, op: "d" });
    }
    maybeSetNormalizedName(e, r) {
      this.normalizedNames.has(r) || this.normalizedNames.set(r, e);
    }
    init() {
      this.lazyInit &&
        (this.lazyInit instanceof t
          ? this.copyFrom(this.lazyInit)
          : this.lazyInit(),
        (this.lazyInit = null),
        this.lazyUpdate &&
          (this.lazyUpdate.forEach((e) => this.applyUpdate(e)),
          (this.lazyUpdate = null)));
    }
    copyFrom(e) {
      e.init(),
        Array.from(e.headers.keys()).forEach((r) => {
          this.headers.set(r, e.headers.get(r)),
            this.normalizedNames.set(r, e.normalizedNames.get(r));
        });
    }
    clone(e) {
      let r = new t();
      return (
        (r.lazyInit =
          this.lazyInit && this.lazyInit instanceof t ? this.lazyInit : this),
        (r.lazyUpdate = (this.lazyUpdate || []).concat([e])),
        r
      );
    }
    applyUpdate(e) {
      let r = e.name.toLowerCase();
      switch (e.op) {
        case "a":
        case "s":
          let n = e.value;
          if ((typeof n == "string" && (n = [n]), n.length === 0)) return;
          this.maybeSetNormalizedName(e.name, r);
          let i = (e.op === "a" ? this.headers.get(r) : void 0) || [];
          i.push(...n), this.headers.set(r, i);
          break;
        case "d":
          let o = e.value;
          if (!o) this.headers.delete(r), this.normalizedNames.delete(r);
          else {
            let s = this.headers.get(r);
            if (!s) return;
            (s = s.filter((a) => o.indexOf(a) === -1)),
              s.length === 0
                ? (this.headers.delete(r), this.normalizedNames.delete(r))
                : this.headers.set(r, s);
          }
          break;
      }
    }
    setHeaderEntries(e, r) {
      let n = (Array.isArray(r) ? r : [r]).map((o) => o.toString()),
        i = e.toLowerCase();
      this.headers.set(i, n), this.maybeSetNormalizedName(e, i);
    }
    forEach(e) {
      this.init(),
        Array.from(this.normalizedNames.keys()).forEach((r) =>
          e(this.normalizedNames.get(r), this.headers.get(r))
        );
    }
  };
var Uu = class {
  encodeKey(e) {
    return $h(e);
  }
  encodeValue(e) {
    return $h(e);
  }
  decodeKey(e) {
    return decodeURIComponent(e);
  }
  decodeValue(e) {
    return decodeURIComponent(e);
  }
};
function qC(t, e) {
  let r = new Map();
  return (
    t.length > 0 &&
      t
        .replace(/^\?/, "")
        .split("&")
        .forEach((i) => {
          let o = i.indexOf("="),
            [s, a] =
              o == -1
                ? [e.decodeKey(i), ""]
                : [e.decodeKey(i.slice(0, o)), e.decodeValue(i.slice(o + 1))],
            u = r.get(s) || [];
          u.push(a), r.set(s, u);
        }),
    r
  );
}
var ZC = /%(\d[a-f0-9])/gi,
  YC = {
    40: "@",
    "3A": ":",
    24: "$",
    "2C": ",",
    "3B": ";",
    "3D": "=",
    "3F": "?",
    "2F": "/",
  };
function $h(t) {
  return encodeURIComponent(t).replace(ZC, (e, r) => YC[r] ?? e);
}
function So(t) {
  return `${t}`;
}
var yt = class t {
  constructor(e = {}) {
    if (
      ((this.updates = null),
      (this.cloneFrom = null),
      (this.encoder = e.encoder || new Uu()),
      e.fromString)
    ) {
      if (e.fromObject)
        throw new Error("Cannot specify both fromString and fromObject.");
      this.map = qC(e.fromString, this.encoder);
    } else
      e.fromObject
        ? ((this.map = new Map()),
          Object.keys(e.fromObject).forEach((r) => {
            let n = e.fromObject[r],
              i = Array.isArray(n) ? n.map(So) : [So(n)];
            this.map.set(r, i);
          }))
        : (this.map = null);
  }
  has(e) {
    return this.init(), this.map.has(e);
  }
  get(e) {
    this.init();
    let r = this.map.get(e);
    return r ? r[0] : null;
  }
  getAll(e) {
    return this.init(), this.map.get(e) || null;
  }
  keys() {
    return this.init(), Array.from(this.map.keys());
  }
  append(e, r) {
    return this.clone({ param: e, value: r, op: "a" });
  }
  appendAll(e) {
    let r = [];
    return (
      Object.keys(e).forEach((n) => {
        let i = e[n];
        Array.isArray(i)
          ? i.forEach((o) => {
              r.push({ param: n, value: o, op: "a" });
            })
          : r.push({ param: n, value: i, op: "a" });
      }),
      this.clone(r)
    );
  }
  set(e, r) {
    return this.clone({ param: e, value: r, op: "s" });
  }
  delete(e, r) {
    return this.clone({ param: e, value: r, op: "d" });
  }
  toString() {
    return (
      this.init(),
      this.keys()
        .map((e) => {
          let r = this.encoder.encodeKey(e);
          return this.map
            .get(e)
            .map((n) => r + "=" + this.encoder.encodeValue(n))
            .join("&");
        })
        .filter((e) => e !== "")
        .join("&")
    );
  }
  clone(e) {
    let r = new t({ encoder: this.encoder });
    return (
      (r.cloneFrom = this.cloneFrom || this),
      (r.updates = (this.updates || []).concat(e)),
      r
    );
  }
  init() {
    this.map === null && (this.map = new Map()),
      this.cloneFrom !== null &&
        (this.cloneFrom.init(),
        this.cloneFrom
          .keys()
          .forEach((e) => this.map.set(e, this.cloneFrom.map.get(e))),
        this.updates.forEach((e) => {
          switch (e.op) {
            case "a":
            case "s":
              let r = (e.op === "a" ? this.map.get(e.param) : void 0) || [];
              r.push(So(e.value)), this.map.set(e.param, r);
              break;
            case "d":
              if (e.value !== void 0) {
                let n = this.map.get(e.param) || [],
                  i = n.indexOf(So(e.value));
                i !== -1 && n.splice(i, 1),
                  n.length > 0
                    ? this.map.set(e.param, n)
                    : this.map.delete(e.param);
              } else {
                this.map.delete(e.param);
                break;
              }
          }
        }),
        (this.cloneFrom = this.updates = null));
  }
};
var $u = class {
  constructor() {
    this.map = new Map();
  }
  set(e, r) {
    return this.map.set(e, r), this;
  }
  get(e) {
    return (
      this.map.has(e) || this.map.set(e, e.defaultValue()), this.map.get(e)
    );
  }
  delete(e) {
    return this.map.delete(e), this;
  }
  has(e) {
    return this.map.has(e);
  }
  keys() {
    return this.map.keys();
  }
};
function QC(t) {
  switch (t) {
    case "DELETE":
    case "GET":
    case "HEAD":
    case "OPTIONS":
    case "JSONP":
      return !1;
    default:
      return !0;
  }
}
function Bh(t) {
  return typeof ArrayBuffer < "u" && t instanceof ArrayBuffer;
}
function Hh(t) {
  return typeof Blob < "u" && t instanceof Blob;
}
function zh(t) {
  return typeof FormData < "u" && t instanceof FormData;
}
function KC(t) {
  return typeof URLSearchParams < "u" && t instanceof URLSearchParams;
}
var mr = class t {
    constructor(e, r, n, i) {
      (this.url = r),
        (this.body = null),
        (this.reportProgress = !1),
        (this.withCredentials = !1),
        (this.responseType = "json"),
        (this.method = e.toUpperCase());
      let o;
      if (
        (QC(this.method) || i
          ? ((this.body = n !== void 0 ? n : null), (o = i))
          : (o = n),
        o &&
          ((this.reportProgress = !!o.reportProgress),
          (this.withCredentials = !!o.withCredentials),
          o.responseType && (this.responseType = o.responseType),
          o.headers && (this.headers = o.headers),
          o.context && (this.context = o.context),
          o.params && (this.params = o.params),
          (this.transferCache = o.transferCache)),
        (this.headers ??= new Gt()),
        (this.context ??= new $u()),
        !this.params)
      )
        (this.params = new yt()), (this.urlWithParams = r);
      else {
        let s = this.params.toString();
        if (s.length === 0) this.urlWithParams = r;
        else {
          let a = r.indexOf("?"),
            u = a === -1 ? "?" : a < r.length - 1 ? "&" : "";
          this.urlWithParams = r + u + s;
        }
      }
    }
    serializeBody() {
      return this.body === null
        ? null
        : Bh(this.body) ||
          Hh(this.body) ||
          zh(this.body) ||
          KC(this.body) ||
          typeof this.body == "string"
        ? this.body
        : this.body instanceof yt
        ? this.body.toString()
        : typeof this.body == "object" ||
          typeof this.body == "boolean" ||
          Array.isArray(this.body)
        ? JSON.stringify(this.body)
        : this.body.toString();
    }
    detectContentTypeHeader() {
      return this.body === null || zh(this.body)
        ? null
        : Hh(this.body)
        ? this.body.type || null
        : Bh(this.body)
        ? null
        : typeof this.body == "string"
        ? "text/plain"
        : this.body instanceof yt
        ? "application/x-www-form-urlencoded;charset=UTF-8"
        : typeof this.body == "object" ||
          typeof this.body == "number" ||
          typeof this.body == "boolean"
        ? "application/json"
        : null;
    }
    clone(e = {}) {
      let r = e.method || this.method,
        n = e.url || this.url,
        i = e.responseType || this.responseType,
        o = e.body !== void 0 ? e.body : this.body,
        s =
          e.withCredentials !== void 0
            ? e.withCredentials
            : this.withCredentials,
        a =
          e.reportProgress !== void 0 ? e.reportProgress : this.reportProgress,
        u = e.headers || this.headers,
        c = e.params || this.params,
        l = e.context ?? this.context;
      return (
        e.setHeaders !== void 0 &&
          (u = Object.keys(e.setHeaders).reduce(
            (d, f) => d.set(f, e.setHeaders[f]),
            u
          )),
        e.setParams &&
          (c = Object.keys(e.setParams).reduce(
            (d, f) => d.set(f, e.setParams[f]),
            c
          )),
        new t(r, n, o, {
          params: c,
          headers: u,
          context: l,
          reportProgress: a,
          responseType: i,
          withCredentials: s,
        })
      );
    }
  },
  Tn = (function (t) {
    return (
      (t[(t.Sent = 0)] = "Sent"),
      (t[(t.UploadProgress = 1)] = "UploadProgress"),
      (t[(t.ResponseHeader = 2)] = "ResponseHeader"),
      (t[(t.DownloadProgress = 3)] = "DownloadProgress"),
      (t[(t.Response = 4)] = "Response"),
      (t[(t.User = 5)] = "User"),
      t
    );
  })(Tn || {}),
  yr = class {
    constructor(e, r = No.Ok, n = "OK") {
      (this.headers = e.headers || new Gt()),
        (this.status = e.status !== void 0 ? e.status : r),
        (this.statusText = e.statusText || n),
        (this.url = e.url || null),
        (this.ok = this.status >= 200 && this.status < 300);
    }
  },
  Bu = class t extends yr {
    constructor(e = {}) {
      super(e), (this.type = Tn.ResponseHeader);
    }
    clone(e = {}) {
      return new t({
        headers: e.headers || this.headers,
        status: e.status !== void 0 ? e.status : this.status,
        statusText: e.statusText || this.statusText,
        url: e.url || this.url || void 0,
      });
    }
  },
  Ao = class t extends yr {
    constructor(e = {}) {
      super(e),
        (this.type = Tn.Response),
        (this.body = e.body !== void 0 ? e.body : null);
    }
    clone(e = {}) {
      return new t({
        body: e.body !== void 0 ? e.body : this.body,
        headers: e.headers || this.headers,
        status: e.status !== void 0 ? e.status : this.status,
        statusText: e.statusText || this.statusText,
        url: e.url || this.url || void 0,
      });
    }
  },
  xo = class extends yr {
    constructor(e) {
      super(e, 0, "Unknown Error"),
        (this.name = "HttpErrorResponse"),
        (this.ok = !1),
        this.status >= 200 && this.status < 300
          ? (this.message = `Http failure during parsing for ${
              e.url || "(unknown url)"
            }`)
          : (this.message = `Http failure response for ${
              e.url || "(unknown url)"
            }: ${e.status} ${e.statusText}`),
        (this.error = e.error || null);
    }
  },
  No = (function (t) {
    return (
      (t[(t.Continue = 100)] = "Continue"),
      (t[(t.SwitchingProtocols = 101)] = "SwitchingProtocols"),
      (t[(t.Processing = 102)] = "Processing"),
      (t[(t.EarlyHints = 103)] = "EarlyHints"),
      (t[(t.Ok = 200)] = "Ok"),
      (t[(t.Created = 201)] = "Created"),
      (t[(t.Accepted = 202)] = "Accepted"),
      (t[(t.NonAuthoritativeInformation = 203)] =
        "NonAuthoritativeInformation"),
      (t[(t.NoContent = 204)] = "NoContent"),
      (t[(t.ResetContent = 205)] = "ResetContent"),
      (t[(t.PartialContent = 206)] = "PartialContent"),
      (t[(t.MultiStatus = 207)] = "MultiStatus"),
      (t[(t.AlreadyReported = 208)] = "AlreadyReported"),
      (t[(t.ImUsed = 226)] = "ImUsed"),
      (t[(t.MultipleChoices = 300)] = "MultipleChoices"),
      (t[(t.MovedPermanently = 301)] = "MovedPermanently"),
      (t[(t.Found = 302)] = "Found"),
      (t[(t.SeeOther = 303)] = "SeeOther"),
      (t[(t.NotModified = 304)] = "NotModified"),
      (t[(t.UseProxy = 305)] = "UseProxy"),
      (t[(t.Unused = 306)] = "Unused"),
      (t[(t.TemporaryRedirect = 307)] = "TemporaryRedirect"),
      (t[(t.PermanentRedirect = 308)] = "PermanentRedirect"),
      (t[(t.BadRequest = 400)] = "BadRequest"),
      (t[(t.Unauthorized = 401)] = "Unauthorized"),
      (t[(t.PaymentRequired = 402)] = "PaymentRequired"),
      (t[(t.Forbidden = 403)] = "Forbidden"),
      (t[(t.NotFound = 404)] = "NotFound"),
      (t[(t.MethodNotAllowed = 405)] = "MethodNotAllowed"),
      (t[(t.NotAcceptable = 406)] = "NotAcceptable"),
      (t[(t.ProxyAuthenticationRequired = 407)] =
        "ProxyAuthenticationRequired"),
      (t[(t.RequestTimeout = 408)] = "RequestTimeout"),
      (t[(t.Conflict = 409)] = "Conflict"),
      (t[(t.Gone = 410)] = "Gone"),
      (t[(t.LengthRequired = 411)] = "LengthRequired"),
      (t[(t.PreconditionFailed = 412)] = "PreconditionFailed"),
      (t[(t.PayloadTooLarge = 413)] = "PayloadTooLarge"),
      (t[(t.UriTooLong = 414)] = "UriTooLong"),
      (t[(t.UnsupportedMediaType = 415)] = "UnsupportedMediaType"),
      (t[(t.RangeNotSatisfiable = 416)] = "RangeNotSatisfiable"),
      (t[(t.ExpectationFailed = 417)] = "ExpectationFailed"),
      (t[(t.ImATeapot = 418)] = "ImATeapot"),
      (t[(t.MisdirectedRequest = 421)] = "MisdirectedRequest"),
      (t[(t.UnprocessableEntity = 422)] = "UnprocessableEntity"),
      (t[(t.Locked = 423)] = "Locked"),
      (t[(t.FailedDependency = 424)] = "FailedDependency"),
      (t[(t.TooEarly = 425)] = "TooEarly"),
      (t[(t.UpgradeRequired = 426)] = "UpgradeRequired"),
      (t[(t.PreconditionRequired = 428)] = "PreconditionRequired"),
      (t[(t.TooManyRequests = 429)] = "TooManyRequests"),
      (t[(t.RequestHeaderFieldsTooLarge = 431)] =
        "RequestHeaderFieldsTooLarge"),
      (t[(t.UnavailableForLegalReasons = 451)] = "UnavailableForLegalReasons"),
      (t[(t.InternalServerError = 500)] = "InternalServerError"),
      (t[(t.NotImplemented = 501)] = "NotImplemented"),
      (t[(t.BadGateway = 502)] = "BadGateway"),
      (t[(t.ServiceUnavailable = 503)] = "ServiceUnavailable"),
      (t[(t.GatewayTimeout = 504)] = "GatewayTimeout"),
      (t[(t.HttpVersionNotSupported = 505)] = "HttpVersionNotSupported"),
      (t[(t.VariantAlsoNegotiates = 506)] = "VariantAlsoNegotiates"),
      (t[(t.InsufficientStorage = 507)] = "InsufficientStorage"),
      (t[(t.LoopDetected = 508)] = "LoopDetected"),
      (t[(t.NotExtended = 510)] = "NotExtended"),
      (t[(t.NetworkAuthenticationRequired = 511)] =
        "NetworkAuthenticationRequired"),
      t
    );
  })(No || {});
function ju(t, e) {
  return {
    body: e,
    headers: t.headers,
    context: t.context,
    observe: t.observe,
    params: t.params,
    reportProgress: t.reportProgress,
    responseType: t.responseType,
    withCredentials: t.withCredentials,
    transferCache: t.transferCache,
  };
}
var JC = (() => {
  let e = class e {
    constructor(n) {
      this.handler = n;
    }
    request(n, i, o = {}) {
      let s;
      if (n instanceof mr) s = n;
      else {
        let c;
        o.headers instanceof Gt ? (c = o.headers) : (c = new Gt(o.headers));
        let l;
        o.params &&
          (o.params instanceof yt
            ? (l = o.params)
            : (l = new yt({ fromObject: o.params }))),
          (s = new mr(n, i, o.body !== void 0 ? o.body : null, {
            headers: c,
            context: o.context,
            params: l,
            reportProgress: o.reportProgress,
            responseType: o.responseType || "json",
            withCredentials: o.withCredentials,
            transferCache: o.transferCache,
          }));
      }
      let a = E(s).pipe(Ke((c) => this.handler.handle(c)));
      if (n instanceof mr || o.observe === "events") return a;
      let u = a.pipe(ee((c) => c instanceof Ao));
      switch (o.observe || "body") {
        case "body":
          switch (s.responseType) {
            case "arraybuffer":
              return u.pipe(
                _((c) => {
                  if (c.body !== null && !(c.body instanceof ArrayBuffer))
                    throw new Error("Response is not an ArrayBuffer.");
                  return c.body;
                })
              );
            case "blob":
              return u.pipe(
                _((c) => {
                  if (c.body !== null && !(c.body instanceof Blob))
                    throw new Error("Response is not a Blob.");
                  return c.body;
                })
              );
            case "text":
              return u.pipe(
                _((c) => {
                  if (c.body !== null && typeof c.body != "string")
                    throw new Error("Response is not a string.");
                  return c.body;
                })
              );
            case "json":
            default:
              return u.pipe(_((c) => c.body));
          }
        case "response":
          return u;
        default:
          throw new Error(`Unreachable: unhandled observe type ${o.observe}}`);
      }
    }
    delete(n, i = {}) {
      return this.request("DELETE", n, i);
    }
    get(n, i = {}) {
      return this.request("GET", n, i);
    }
    head(n, i = {}) {
      return this.request("HEAD", n, i);
    }
    jsonp(n, i) {
      return this.request("JSONP", n, {
        params: new yt().append(i, "JSONP_CALLBACK"),
        observe: "body",
        responseType: "json",
      });
    }
    options(n, i = {}) {
      return this.request("OPTIONS", n, i);
    }
    patch(n, i, o = {}) {
      return this.request("PATCH", n, ju(o, i));
    }
    post(n, i, o = {}) {
      return this.request("POST", n, ju(o, i));
    }
    put(n, i, o = {}) {
      return this.request("PUT", n, ju(o, i));
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(D(vr));
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
function Zh(t, e) {
  return e(t);
}
function XC(t, e) {
  return (r, n) => e.intercept(r, { handle: (i) => t(i, n) });
}
function eE(t, e, r) {
  return (n, i) => ze(r, () => e(n, (o) => t(o, i)));
}
var tE = new y(""),
  Hu = new y(""),
  nE = new y(""),
  rE = new y("");
function iE() {
  let t = null;
  return (e, r) => {
    t === null && (t = (p(tE, { optional: !0 }) ?? []).reduceRight(XC, Zh));
    let n = p(Bt),
      i = n.add();
    return t(e, r).pipe(ut(() => n.remove(i)));
  };
}
var Gh = (() => {
  let e = class e extends vr {
    constructor(n, i) {
      super(),
        (this.backend = n),
        (this.injector = i),
        (this.chain = null),
        (this.pendingTasks = p(Bt));
      let o = p(rE, { optional: !0 });
      this.backend = o ?? n;
    }
    handle(n) {
      if (this.chain === null) {
        let o = Array.from(
          new Set([...this.injector.get(Hu), ...this.injector.get(nE, [])])
        );
        this.chain = o.reduceRight((s, a) => eE(s, a, this.injector), Zh);
      }
      let i = this.pendingTasks.add();
      return this.chain(n, (o) => this.backend.handle(o)).pipe(
        ut(() => this.pendingTasks.remove(i))
      );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(D(To), D(oe));
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac }));
  let t = e;
  return t;
})();
var oE = /^\)\]\}',?\n/;
function sE(t) {
  return "responseURL" in t && t.responseURL
    ? t.responseURL
    : /^X-Request-URL:/m.test(t.getAllResponseHeaders())
    ? t.getResponseHeader("X-Request-URL")
    : null;
}
var Wh = (() => {
    let e = class e {
      constructor(n) {
        this.xhrFactory = n;
      }
      handle(n) {
        if (n.method === "JSONP") throw new v(-2800, !1);
        let i = this.xhrFactory;
        return (i.ɵloadImpl ? L(i.ɵloadImpl()) : E(null)).pipe(
          ce(
            () =>
              new O((s) => {
                let a = i.build();
                if (
                  (a.open(n.method, n.urlWithParams),
                  n.withCredentials && (a.withCredentials = !0),
                  n.headers.forEach((b, C) =>
                    a.setRequestHeader(b, C.join(","))
                  ),
                  n.headers.has("Accept") ||
                    a.setRequestHeader(
                      "Accept",
                      "application/json, text/plain, */*"
                    ),
                  !n.headers.has("Content-Type"))
                ) {
                  let b = n.detectContentTypeHeader();
                  b !== null && a.setRequestHeader("Content-Type", b);
                }
                if (n.responseType) {
                  let b = n.responseType.toLowerCase();
                  a.responseType = b !== "json" ? b : "text";
                }
                let u = n.serializeBody(),
                  c = null,
                  l = () => {
                    if (c !== null) return c;
                    let b = a.statusText || "OK",
                      C = new Gt(a.getAllResponseHeaders()),
                      q = sE(a) || n.url;
                    return (
                      (c = new Bu({
                        headers: C,
                        status: a.status,
                        statusText: b,
                        url: q,
                      })),
                      c
                    );
                  },
                  d = () => {
                    let { headers: b, status: C, statusText: q, url: Ee } = l(),
                      U = null;
                    C !== No.NoContent &&
                      (U =
                        typeof a.response > "u" ? a.responseText : a.response),
                      C === 0 && (C = U ? No.Ok : 0);
                    let se = C >= 200 && C < 300;
                    if (n.responseType === "json" && typeof U == "string") {
                      let Te = U;
                      U = U.replace(oE, "");
                      try {
                        U = U !== "" ? JSON.parse(U) : null;
                      } catch ($n) {
                        (U = Te),
                          se && ((se = !1), (U = { error: $n, text: U }));
                      }
                    }
                    se
                      ? (s.next(
                          new Ao({
                            body: U,
                            headers: b,
                            status: C,
                            statusText: q,
                            url: Ee || void 0,
                          })
                        ),
                        s.complete())
                      : s.error(
                          new xo({
                            error: U,
                            headers: b,
                            status: C,
                            statusText: q,
                            url: Ee || void 0,
                          })
                        );
                  },
                  f = (b) => {
                    let { url: C } = l(),
                      q = new xo({
                        error: b,
                        status: a.status || 0,
                        statusText: a.statusText || "Unknown Error",
                        url: C || void 0,
                      });
                    s.error(q);
                  },
                  h = !1,
                  m = (b) => {
                    h || (s.next(l()), (h = !0));
                    let C = { type: Tn.DownloadProgress, loaded: b.loaded };
                    b.lengthComputable && (C.total = b.total),
                      n.responseType === "text" &&
                        a.responseText &&
                        (C.partialText = a.responseText),
                      s.next(C);
                  },
                  F = (b) => {
                    let C = { type: Tn.UploadProgress, loaded: b.loaded };
                    b.lengthComputable && (C.total = b.total), s.next(C);
                  };
                return (
                  a.addEventListener("load", d),
                  a.addEventListener("error", f),
                  a.addEventListener("timeout", f),
                  a.addEventListener("abort", f),
                  n.reportProgress &&
                    (a.addEventListener("progress", m),
                    u !== null &&
                      a.upload &&
                      a.upload.addEventListener("progress", F)),
                  a.send(u),
                  s.next({ type: Tn.Sent }),
                  () => {
                    a.removeEventListener("error", f),
                      a.removeEventListener("abort", f),
                      a.removeEventListener("load", d),
                      a.removeEventListener("timeout", f),
                      n.reportProgress &&
                        (a.removeEventListener("progress", m),
                        u !== null &&
                          a.upload &&
                          a.upload.removeEventListener("progress", F)),
                      a.readyState !== a.DONE && a.abort();
                  }
                );
              })
          )
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(_n));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Yh = new y(""),
  aE = "XSRF-TOKEN",
  uE = new y("", { providedIn: "root", factory: () => aE }),
  cE = "X-XSRF-TOKEN",
  lE = new y("", { providedIn: "root", factory: () => cE }),
  Ro = class {},
  dE = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this.doc = n),
          (this.platform = i),
          (this.cookieName = o),
          (this.lastCookieString = ""),
          (this.lastToken = null),
          (this.parseCount = 0);
      }
      getToken() {
        if (this.platform === "server") return null;
        let n = this.doc.cookie || "";
        return (
          n !== this.lastCookieString &&
            (this.parseCount++,
            (this.lastToken = _o(n, this.cookieName)),
            (this.lastCookieString = n)),
          this.lastToken
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(te), D(Ge), D(uE));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function fE(t, e) {
  let r = t.url.toLowerCase();
  if (
    !p(Yh) ||
    t.method === "GET" ||
    t.method === "HEAD" ||
    r.startsWith("http://") ||
    r.startsWith("https://")
  )
    return e(t);
  let n = p(Ro).getToken(),
    i = p(lE);
  return (
    n != null &&
      !t.headers.has(i) &&
      (t = t.clone({ headers: t.headers.set(i, n) })),
    e(t)
  );
}
var Qh = (function (t) {
  return (
    (t[(t.Interceptors = 0)] = "Interceptors"),
    (t[(t.LegacyInterceptors = 1)] = "LegacyInterceptors"),
    (t[(t.CustomXsrfConfiguration = 2)] = "CustomXsrfConfiguration"),
    (t[(t.NoXsrfProtection = 3)] = "NoXsrfProtection"),
    (t[(t.JsonpSupport = 4)] = "JsonpSupport"),
    (t[(t.RequestsMadeViaParent = 5)] = "RequestsMadeViaParent"),
    (t[(t.Fetch = 6)] = "Fetch"),
    t
  );
})(Qh || {});
function hE(t, e) {
  return { ɵkind: t, ɵproviders: e };
}
function pE(...t) {
  let e = [
    JC,
    Wh,
    Gh,
    { provide: vr, useExisting: Gh },
    { provide: To, useExisting: Wh },
    { provide: Hu, useValue: fE, multi: !0 },
    { provide: Yh, useValue: !0 },
    { provide: Ro, useClass: dE },
  ];
  for (let r of t) e.push(...r.ɵproviders);
  return so(e);
}
var qh = new y("");
function gE() {
  return hE(Qh.LegacyInterceptors, [
    { provide: qh, useFactory: iE },
    { provide: Hu, useExisting: qh, multi: !0 },
  ]);
}
var CR = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = ve({ type: e })),
    (e.ɵinj = me({ providers: [pE(gE())] }));
  let t = e;
  return t;
})();
var Wu = class extends Mo {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  qu = class t extends Wu {
    static makeCurrent() {
      Fh(new t());
    }
    onAndCancel(e, r, n) {
      return (
        e.addEventListener(r, n),
        () => {
          e.removeEventListener(r, n);
        }
      );
    }
    dispatchEvent(e, r) {
      e.dispatchEvent(r);
    }
    remove(e) {
      e.parentNode && e.parentNode.removeChild(e);
    }
    createElement(e, r) {
      return (r = r || this.getDefaultDocument()), r.createElement(e);
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument("fakeTitle");
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(e) {
      return e.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(e) {
      return e instanceof DocumentFragment;
    }
    getGlobalEventTarget(e, r) {
      return r === "window"
        ? window
        : r === "document"
        ? e
        : r === "body"
        ? e.body
        : null;
    }
    getBaseHref(e) {
      let r = mE();
      return r == null ? null : vE(r);
    }
    resetBaseElement() {
      Dr = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(e) {
      return _o(document.cookie, e);
    }
  },
  Dr = null;
function mE() {
  return (
    (Dr = Dr || document.querySelector("base")),
    Dr ? Dr.getAttribute("href") : null
  );
}
function vE(t) {
  return new URL(t, document.baseURI).pathname;
}
var Zu = class {
    addToWindow(e) {
      (he.getAngularTestability = (n, i = !0) => {
        let o = e.findTestabilityInTree(n, i);
        if (o == null) throw new v(5103, !1);
        return o;
      }),
        (he.getAllAngularTestabilities = () => e.getAllTestabilities()),
        (he.getAllAngularRootElements = () => e.getAllRootElements());
      let r = (n) => {
        let i = he.getAllAngularTestabilities(),
          o = i.length,
          s = function () {
            o--, o == 0 && n();
          };
        i.forEach((a) => {
          a.whenStable(s);
        });
      };
      he.frameworkStabilizers || (he.frameworkStabilizers = []),
        he.frameworkStabilizers.push(r);
    }
    findTestabilityInTree(e, r, n) {
      if (r == null) return null;
      let i = e.getTestability(r);
      return (
        i ??
        (n
          ? qe().isShadowRoot(r)
            ? this.findTestabilityInTree(e, r.host, !0)
            : this.findTestabilityInTree(e, r.parentElement, !0)
          : null)
      );
    }
  },
  yE = (() => {
    let e = class e {
      build() {
        return new XMLHttpRequest();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Yu = new y(""),
  ep = (() => {
    let e = class e {
      constructor(n, i) {
        (this._zone = i),
          (this._eventNameToPlugin = new Map()),
          n.forEach((o) => {
            o.manager = this;
          }),
          (this._plugins = n.slice().reverse());
      }
      addEventListener(n, i, o) {
        return this._findPluginFor(i).addEventListener(n, i, o);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(n) {
        let i = this._eventNameToPlugin.get(n);
        if (i) return i;
        if (((i = this._plugins.find((s) => s.supports(n))), !i))
          throw new v(5101, !1);
        return this._eventNameToPlugin.set(n, i), i;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(Yu), D(V));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Oo = class {
    constructor(e) {
      this._doc = e;
    }
  },
  zu = "ng-app-id",
  tp = (() => {
    let e = class e {
      constructor(n, i, o, s = {}) {
        (this.doc = n),
          (this.appId = i),
          (this.nonce = o),
          (this.platformId = s),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = Vu(s)),
          this.resetHostNodes();
      }
      addStyles(n) {
        for (let i of n)
          this.changeUsageCount(i, 1) === 1 && this.onStyleAdded(i);
      }
      removeStyles(n) {
        for (let i of n)
          this.changeUsageCount(i, -1) <= 0 && this.onStyleRemoved(i);
      }
      ngOnDestroy() {
        let n = this.styleNodesInDOM;
        n && (n.forEach((i) => i.remove()), n.clear());
        for (let i of this.getAllStyles()) this.onStyleRemoved(i);
        this.resetHostNodes();
      }
      addHost(n) {
        this.hostNodes.add(n);
        for (let i of this.getAllStyles()) this.addStyleToHost(n, i);
      }
      removeHost(n) {
        this.hostNodes.delete(n);
      }
      getAllStyles() {
        return this.styleRef.keys();
      }
      onStyleAdded(n) {
        for (let i of this.hostNodes) this.addStyleToHost(i, n);
      }
      onStyleRemoved(n) {
        let i = this.styleRef;
        i.get(n)?.elements?.forEach((o) => o.remove()), i.delete(n);
      }
      collectServerRenderedStyles() {
        let n = this.doc.head?.querySelectorAll(`style[${zu}="${this.appId}"]`);
        if (n?.length) {
          let i = new Map();
          return (
            n.forEach((o) => {
              o.textContent != null && i.set(o.textContent, o);
            }),
            i
          );
        }
        return null;
      }
      changeUsageCount(n, i) {
        let o = this.styleRef;
        if (o.has(n)) {
          let s = o.get(n);
          return (s.usage += i), s.usage;
        }
        return o.set(n, { usage: i, elements: [] }), i;
      }
      getStyleElement(n, i) {
        let o = this.styleNodesInDOM,
          s = o?.get(i);
        if (s?.parentNode === n) return o.delete(i), s.removeAttribute(zu), s;
        {
          let a = this.doc.createElement("style");
          return (
            this.nonce && a.setAttribute("nonce", this.nonce),
            (a.textContent = i),
            this.platformIsServer && a.setAttribute(zu, this.appId),
            n.appendChild(a),
            a
          );
        }
      }
      addStyleToHost(n, i) {
        let o = this.getStyleElement(n, i),
          s = this.styleRef,
          a = s.get(i)?.elements;
        a ? a.push(o) : s.set(i, { elements: [o], usage: 1 });
      }
      resetHostNodes() {
        let n = this.hostNodes;
        n.clear(), n.add(this.doc.head);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(te), D(uo), D(ru, 8), D(Ge));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Gu = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/MathML/",
  },
  Ku = /%COMP%/g,
  np = "%COMP%",
  DE = `_nghost-${np}`,
  wE = `_ngcontent-${np}`,
  CE = !0,
  EE = new y("", { providedIn: "root", factory: () => CE });
function IE(t) {
  return wE.replace(Ku, t);
}
function bE(t) {
  return DE.replace(Ku, t);
}
function rp(t, e) {
  return e.map((r) => r.replace(Ku, t));
}
var Kh = (() => {
    let e = class e {
      constructor(n, i, o, s, a, u, c, l = null) {
        (this.eventManager = n),
          (this.sharedStylesHost = i),
          (this.appId = o),
          (this.removeStylesOnCompDestroy = s),
          (this.doc = a),
          (this.platformId = u),
          (this.ngZone = c),
          (this.nonce = l),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = Vu(u)),
          (this.defaultRenderer = new wr(n, a, c, this.platformIsServer));
      }
      createRenderer(n, i) {
        if (!n || !i) return this.defaultRenderer;
        this.platformIsServer &&
          i.encapsulation === $e.ShadowDom &&
          (i = $(g({}, i), { encapsulation: $e.Emulated }));
        let o = this.getOrCreateRenderer(n, i);
        return (
          o instanceof Fo
            ? o.applyToHost(n)
            : o instanceof Cr && o.applyStyles(),
          o
        );
      }
      getOrCreateRenderer(n, i) {
        let o = this.rendererByCompId,
          s = o.get(i.id);
        if (!s) {
          let a = this.doc,
            u = this.ngZone,
            c = this.eventManager,
            l = this.sharedStylesHost,
            d = this.removeStylesOnCompDestroy,
            f = this.platformIsServer;
          switch (i.encapsulation) {
            case $e.Emulated:
              s = new Fo(c, l, i, this.appId, d, a, u, f);
              break;
            case $e.ShadowDom:
              return new Qu(c, l, n, i, a, u, this.nonce, f);
            default:
              s = new Cr(c, l, i, d, a, u, f);
              break;
          }
          o.set(i.id, s);
        }
        return s;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(
        D(ep),
        D(tp),
        D(uo),
        D(EE),
        D(te),
        D(Ge),
        D(V),
        D(ru)
      );
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  wr = class {
    constructor(e, r, n, i) {
      (this.eventManager = e),
        (this.doc = r),
        (this.ngZone = n),
        (this.platformIsServer = i),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null);
    }
    destroy() {}
    createElement(e, r) {
      return r
        ? this.doc.createElementNS(Gu[r] || r, e)
        : this.doc.createElement(e);
    }
    createComment(e) {
      return this.doc.createComment(e);
    }
    createText(e) {
      return this.doc.createTextNode(e);
    }
    appendChild(e, r) {
      (Jh(e) ? e.content : e).appendChild(r);
    }
    insertBefore(e, r, n) {
      e && (Jh(e) ? e.content : e).insertBefore(r, n);
    }
    removeChild(e, r) {
      e && e.removeChild(r);
    }
    selectRootElement(e, r) {
      let n = typeof e == "string" ? this.doc.querySelector(e) : e;
      if (!n) throw new v(-5104, !1);
      return r || (n.textContent = ""), n;
    }
    parentNode(e) {
      return e.parentNode;
    }
    nextSibling(e) {
      return e.nextSibling;
    }
    setAttribute(e, r, n, i) {
      if (i) {
        r = i + ":" + r;
        let o = Gu[i];
        o ? e.setAttributeNS(o, r, n) : e.setAttribute(r, n);
      } else e.setAttribute(r, n);
    }
    removeAttribute(e, r, n) {
      if (n) {
        let i = Gu[n];
        i ? e.removeAttributeNS(i, r) : e.removeAttribute(`${n}:${r}`);
      } else e.removeAttribute(r);
    }
    addClass(e, r) {
      e.classList.add(r);
    }
    removeClass(e, r) {
      e.classList.remove(r);
    }
    setStyle(e, r, n, i) {
      i & (Xe.DashCase | Xe.Important)
        ? e.style.setProperty(r, n, i & Xe.Important ? "important" : "")
        : (e.style[r] = n);
    }
    removeStyle(e, r, n) {
      n & Xe.DashCase ? e.style.removeProperty(r) : (e.style[r] = "");
    }
    setProperty(e, r, n) {
      e != null && (e[r] = n);
    }
    setValue(e, r) {
      e.nodeValue = r;
    }
    listen(e, r, n) {
      if (
        typeof e == "string" &&
        ((e = qe().getGlobalEventTarget(this.doc, e)), !e)
      )
        throw new Error(`Unsupported event target ${e} for event ${r}`);
      return this.eventManager.addEventListener(
        e,
        r,
        this.decoratePreventDefault(n)
      );
    }
    decoratePreventDefault(e) {
      return (r) => {
        if (r === "__ngUnwrap__") return e;
        (this.platformIsServer ? this.ngZone.runGuarded(() => e(r)) : e(r)) ===
          !1 && r.preventDefault();
      };
    }
  };
function Jh(t) {
  return t.tagName === "TEMPLATE" && t.content !== void 0;
}
var Qu = class extends wr {
    constructor(e, r, n, i, o, s, a, u) {
      super(e, o, s, u),
        (this.sharedStylesHost = r),
        (this.hostEl = n),
        (this.shadowRoot = n.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let c = rp(i.id, i.styles);
      for (let l of c) {
        let d = document.createElement("style");
        a && d.setAttribute("nonce", a),
          (d.textContent = l),
          this.shadowRoot.appendChild(d);
      }
    }
    nodeOrShadowRoot(e) {
      return e === this.hostEl ? this.shadowRoot : e;
    }
    appendChild(e, r) {
      return super.appendChild(this.nodeOrShadowRoot(e), r);
    }
    insertBefore(e, r, n) {
      return super.insertBefore(this.nodeOrShadowRoot(e), r, n);
    }
    removeChild(e, r) {
      return super.removeChild(this.nodeOrShadowRoot(e), r);
    }
    parentNode(e) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(e)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  Cr = class extends wr {
    constructor(e, r, n, i, o, s, a, u) {
      super(e, o, s, a),
        (this.sharedStylesHost = r),
        (this.removeStylesOnCompDestroy = i),
        (this.styles = u ? rp(u, n.styles) : n.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  Fo = class extends Cr {
    constructor(e, r, n, i, o, s, a, u) {
      let c = i + "-" + n.id;
      super(e, r, n, o, s, a, u, c),
        (this.contentAttr = IE(c)),
        (this.hostAttr = bE(c));
    }
    applyToHost(e) {
      this.applyStyles(), this.setAttribute(e, this.hostAttr, "");
    }
    createElement(e, r) {
      let n = super.createElement(e, r);
      return super.setAttribute(n, this.contentAttr, ""), n;
    }
  },
  ME = (() => {
    let e = class e extends Oo {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return !0;
      }
      addEventListener(n, i, o) {
        return (
          n.addEventListener(i, o, !1), () => this.removeEventListener(n, i, o)
        );
      }
      removeEventListener(n, i, o) {
        return n.removeEventListener(i, o);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(te));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Xh = ["alt", "control", "meta", "shift"],
  _E = {
    "\b": "Backspace",
    "	": "Tab",
    "\x7F": "Delete",
    "\x1B": "Escape",
    Del: "Delete",
    Esc: "Escape",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Menu: "ContextMenu",
    Scroll: "ScrollLock",
    Win: "OS",
  },
  SE = {
    alt: (t) => t.altKey,
    control: (t) => t.ctrlKey,
    meta: (t) => t.metaKey,
    shift: (t) => t.shiftKey,
  },
  TE = (() => {
    let e = class e extends Oo {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return e.parseEventName(n) != null;
      }
      addEventListener(n, i, o) {
        let s = e.parseEventName(i),
          a = e.eventCallback(s.fullKey, o, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => qe().onAndCancel(n, s.domEventName, a));
      }
      static parseEventName(n) {
        let i = n.toLowerCase().split("."),
          o = i.shift();
        if (i.length === 0 || !(o === "keydown" || o === "keyup")) return null;
        let s = e._normalizeKey(i.pop()),
          a = "",
          u = i.indexOf("code");
        if (
          (u > -1 && (i.splice(u, 1), (a = "code.")),
          Xh.forEach((l) => {
            let d = i.indexOf(l);
            d > -1 && (i.splice(d, 1), (a += l + "."));
          }),
          (a += s),
          i.length != 0 || s.length === 0)
        )
          return null;
        let c = {};
        return (c.domEventName = o), (c.fullKey = a), c;
      }
      static matchEventFullKeyCode(n, i) {
        let o = _E[n.key] || n.key,
          s = "";
        return (
          i.indexOf("code.") > -1 && ((o = n.code), (s = "code.")),
          o == null || !o
            ? !1
            : ((o = o.toLowerCase()),
              o === " " ? (o = "space") : o === "." && (o = "dot"),
              Xh.forEach((a) => {
                if (a !== o) {
                  let u = SE[a];
                  u(n) && (s += a + ".");
                }
              }),
              (s += o),
              s === i)
        );
      }
      static eventCallback(n, i, o) {
        return (s) => {
          e.matchEventFullKeyCode(s, n) && o.runGuarded(() => i(s));
        };
      }
      static _normalizeKey(n) {
        return n === "esc" ? "escape" : n;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(te));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function AE() {
  qu.makeCurrent();
}
function xE() {
  return new He();
}
function NE() {
  return gf(document), document;
}
var RE = [
    { provide: Ge, useValue: Lu },
    { provide: nu, useValue: AE, multi: !0 },
    { provide: te, useFactory: NE, deps: [] },
  ],
  UR = _u(Sh, "browser", RE),
  OE = new y(""),
  FE = [
    { provide: pr, useClass: Zu, deps: [] },
    { provide: Iu, useClass: Co, deps: [V, Eo, pr] },
    { provide: Co, useClass: Co, deps: [V, Eo, pr] },
  ],
  PE = [
    { provide: ao, useValue: "root" },
    { provide: He, useFactory: xE, deps: [] },
    { provide: Yu, useClass: ME, multi: !0, deps: [te, V, Ge] },
    { provide: Yu, useClass: TE, multi: !0, deps: [te] },
    Kh,
    tp,
    ep,
    { provide: rr, useExisting: Kh },
    { provide: _n, useClass: yE, deps: [] },
    [],
  ],
  $R = (() => {
    let e = class e {
      constructor(n) {}
      static withServerTransition(n) {
        return { ngModule: e, providers: [{ provide: uo, useValue: n.appId }] };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(OE, 12));
    }),
      (e.ɵmod = ve({ type: e })),
      (e.ɵinj = me({ providers: [...PE, ...FE], imports: [jh, Th] }));
    let t = e;
    return t;
  })();
var ip = (() => {
  let e = class e {
    constructor(n) {
      this._doc = n;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(n) {
      this._doc.title = n || "";
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(D(te));
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
var S = "primary",
  kr = Symbol("RouteTitle"),
  nc = class {
    constructor(e) {
      this.params = e || {};
    }
    has(e) {
      return Object.prototype.hasOwnProperty.call(this.params, e);
    }
    get(e) {
      if (this.has(e)) {
        let r = this.params[e];
        return Array.isArray(r) ? r[0] : r;
      }
      return null;
    }
    getAll(e) {
      if (this.has(e)) {
        let r = this.params[e];
        return Array.isArray(r) ? r : [r];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function On(t) {
  return new nc(t);
}
function LE(t, e, r) {
  let n = r.path.split("/");
  if (
    n.length > t.length ||
    (r.pathMatch === "full" && (e.hasChildren() || n.length < t.length))
  )
    return null;
  let i = {};
  for (let o = 0; o < n.length; o++) {
    let s = n[o],
      a = t[o];
    if (s.startsWith(":")) i[s.substring(1)] = a;
    else if (s !== a.path) return null;
  }
  return { consumed: t.slice(0, n.length), posParams: i };
}
function VE(t, e) {
  if (t.length !== e.length) return !1;
  for (let r = 0; r < t.length; ++r) if (!Ze(t[r], e[r])) return !1;
  return !0;
}
function Ze(t, e) {
  let r = t ? rc(t) : void 0,
    n = e ? rc(e) : void 0;
  if (!r || !n || r.length != n.length) return !1;
  let i;
  for (let o = 0; o < r.length; o++)
    if (((i = r[o]), !hp(t[i], e[i]))) return !1;
  return !0;
}
function rc(t) {
  return [...Object.keys(t), ...Object.getOwnPropertySymbols(t)];
}
function hp(t, e) {
  if (Array.isArray(t) && Array.isArray(e)) {
    if (t.length !== e.length) return !1;
    let r = [...t].sort(),
      n = [...e].sort();
    return r.every((i, o) => n[o] === i);
  } else return t === e;
}
function pp(t) {
  return t.length > 0 ? t[t.length - 1] : null;
}
function Et(t) {
  return bs(t) ? t : vt(t) ? L(Promise.resolve(t)) : E(t);
}
var jE = { exact: mp, subset: vp },
  gp = { exact: UE, subset: $E, ignored: () => !0 };
function op(t, e, r) {
  return (
    jE[r.paths](t.root, e.root, r.matrixParams) &&
    gp[r.queryParams](t.queryParams, e.queryParams) &&
    !(r.fragment === "exact" && t.fragment !== e.fragment)
  );
}
function UE(t, e) {
  return Ze(t, e);
}
function mp(t, e, r) {
  if (
    !qt(t.segments, e.segments) ||
    !Lo(t.segments, e.segments, r) ||
    t.numberOfChildren !== e.numberOfChildren
  )
    return !1;
  for (let n in e.children)
    if (!t.children[n] || !mp(t.children[n], e.children[n], r)) return !1;
  return !0;
}
function $E(t, e) {
  return (
    Object.keys(e).length <= Object.keys(t).length &&
    Object.keys(e).every((r) => hp(t[r], e[r]))
  );
}
function vp(t, e, r) {
  return yp(t, e, e.segments, r);
}
function yp(t, e, r, n) {
  if (t.segments.length > r.length) {
    let i = t.segments.slice(0, r.length);
    return !(!qt(i, r) || e.hasChildren() || !Lo(i, r, n));
  } else if (t.segments.length === r.length) {
    if (!qt(t.segments, r) || !Lo(t.segments, r, n)) return !1;
    for (let i in e.children)
      if (!t.children[i] || !vp(t.children[i], e.children[i], n)) return !1;
    return !0;
  } else {
    let i = r.slice(0, t.segments.length),
      o = r.slice(t.segments.length);
    return !qt(t.segments, i) || !Lo(t.segments, i, n) || !t.children[S]
      ? !1
      : yp(t.children[S], e, o, n);
  }
}
function Lo(t, e, r) {
  return e.every((n, i) => gp[r](t[i].parameters, n.parameters));
}
var Dt = class {
    constructor(e = new k([], {}), r = {}, n = null) {
      (this.root = e), (this.queryParams = r), (this.fragment = n);
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= On(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      return zE.serialize(this);
    }
  },
  k = class {
    constructor(e, r) {
      (this.segments = e),
        (this.children = r),
        (this.parent = null),
        Object.values(r).forEach((n) => (n.parent = this));
    }
    hasChildren() {
      return this.numberOfChildren > 0;
    }
    get numberOfChildren() {
      return Object.keys(this.children).length;
    }
    toString() {
      return Vo(this);
    }
  },
  Wt = class {
    constructor(e, r) {
      (this.path = e), (this.parameters = r);
    }
    get parameterMap() {
      return (this._parameterMap ??= On(this.parameters)), this._parameterMap;
    }
    toString() {
      return wp(this);
    }
  };
function BE(t, e) {
  return qt(t, e) && t.every((r, n) => Ze(r.parameters, e[n].parameters));
}
function qt(t, e) {
  return t.length !== e.length ? !1 : t.every((r, n) => r.path === e[n].path);
}
function HE(t, e) {
  let r = [];
  return (
    Object.entries(t.children).forEach(([n, i]) => {
      n === S && (r = r.concat(e(i, n)));
    }),
    Object.entries(t.children).forEach(([n, i]) => {
      n !== S && (r = r.concat(e(i, n)));
    }),
    r
  );
}
var Lr = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => new Tr(), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Tr = class {
    parse(e) {
      let r = new oc(e);
      return new Dt(
        r.parseRootSegment(),
        r.parseQueryParams(),
        r.parseFragment()
      );
    }
    serialize(e) {
      let r = `/${Er(e.root, !0)}`,
        n = qE(e.queryParams),
        i = typeof e.fragment == "string" ? `#${GE(e.fragment)}` : "";
      return `${r}${n}${i}`;
    }
  },
  zE = new Tr();
function Vo(t) {
  return t.segments.map((e) => wp(e)).join("/");
}
function Er(t, e) {
  if (!t.hasChildren()) return Vo(t);
  if (e) {
    let r = t.children[S] ? Er(t.children[S], !1) : "",
      n = [];
    return (
      Object.entries(t.children).forEach(([i, o]) => {
        i !== S && n.push(`${i}:${Er(o, !1)}`);
      }),
      n.length > 0 ? `${r}(${n.join("//")})` : r
    );
  } else {
    let r = HE(t, (n, i) =>
      i === S ? [Er(t.children[S], !1)] : [`${i}:${Er(n, !1)}`]
    );
    return Object.keys(t.children).length === 1 && t.children[S] != null
      ? `${Vo(t)}/${r[0]}`
      : `${Vo(t)}/(${r.join("//")})`;
  }
}
function Dp(t) {
  return encodeURIComponent(t)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",");
}
function Po(t) {
  return Dp(t).replace(/%3B/gi, ";");
}
function GE(t) {
  return encodeURI(t);
}
function ic(t) {
  return Dp(t)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/%26/gi, "&");
}
function jo(t) {
  return decodeURIComponent(t);
}
function sp(t) {
  return jo(t.replace(/\+/g, "%20"));
}
function wp(t) {
  return `${ic(t.path)}${WE(t.parameters)}`;
}
function WE(t) {
  return Object.entries(t)
    .map(([e, r]) => `;${ic(e)}=${ic(r)}`)
    .join("");
}
function qE(t) {
  let e = Object.entries(t)
    .map(([r, n]) =>
      Array.isArray(n)
        ? n.map((i) => `${Po(r)}=${Po(i)}`).join("&")
        : `${Po(r)}=${Po(n)}`
    )
    .filter((r) => r);
  return e.length ? `?${e.join("&")}` : "";
}
var ZE = /^[^\/()?;#]+/;
function Ju(t) {
  let e = t.match(ZE);
  return e ? e[0] : "";
}
var YE = /^[^\/()?;=#]+/;
function QE(t) {
  let e = t.match(YE);
  return e ? e[0] : "";
}
var KE = /^[^=?&#]+/;
function JE(t) {
  let e = t.match(KE);
  return e ? e[0] : "";
}
var XE = /^[^&#]+/;
function eI(t) {
  let e = t.match(XE);
  return e ? e[0] : "";
}
var oc = class {
  constructor(e) {
    (this.url = e), (this.remaining = e);
  }
  parseRootSegment() {
    return (
      this.consumeOptional("/"),
      this.remaining === "" ||
      this.peekStartsWith("?") ||
      this.peekStartsWith("#")
        ? new k([], {})
        : new k([], this.parseChildren())
    );
  }
  parseQueryParams() {
    let e = {};
    if (this.consumeOptional("?"))
      do this.parseQueryParam(e);
      while (this.consumeOptional("&"));
    return e;
  }
  parseFragment() {
    return this.consumeOptional("#")
      ? decodeURIComponent(this.remaining)
      : null;
  }
  parseChildren() {
    if (this.remaining === "") return {};
    this.consumeOptional("/");
    let e = [];
    for (
      this.peekStartsWith("(") || e.push(this.parseSegment());
      this.peekStartsWith("/") &&
      !this.peekStartsWith("//") &&
      !this.peekStartsWith("/(");

    )
      this.capture("/"), e.push(this.parseSegment());
    let r = {};
    this.peekStartsWith("/(") &&
      (this.capture("/"), (r = this.parseParens(!0)));
    let n = {};
    return (
      this.peekStartsWith("(") && (n = this.parseParens(!1)),
      (e.length > 0 || Object.keys(r).length > 0) && (n[S] = new k(e, r)),
      n
    );
  }
  parseSegment() {
    let e = Ju(this.remaining);
    if (e === "" && this.peekStartsWith(";")) throw new v(4009, !1);
    return this.capture(e), new Wt(jo(e), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let e = {};
    for (; this.consumeOptional(";"); ) this.parseParam(e);
    return e;
  }
  parseParam(e) {
    let r = QE(this.remaining);
    if (!r) return;
    this.capture(r);
    let n = "";
    if (this.consumeOptional("=")) {
      let i = Ju(this.remaining);
      i && ((n = i), this.capture(n));
    }
    e[jo(r)] = jo(n);
  }
  parseQueryParam(e) {
    let r = JE(this.remaining);
    if (!r) return;
    this.capture(r);
    let n = "";
    if (this.consumeOptional("=")) {
      let s = eI(this.remaining);
      s && ((n = s), this.capture(n));
    }
    let i = sp(r),
      o = sp(n);
    if (e.hasOwnProperty(i)) {
      let s = e[i];
      Array.isArray(s) || ((s = [s]), (e[i] = s)), s.push(o);
    } else e[i] = o;
  }
  parseParens(e) {
    let r = {};
    for (
      this.capture("(");
      !this.consumeOptional(")") && this.remaining.length > 0;

    ) {
      let n = Ju(this.remaining),
        i = this.remaining[n.length];
      if (i !== "/" && i !== ")" && i !== ";") throw new v(4010, !1);
      let o;
      n.indexOf(":") > -1
        ? ((o = n.slice(0, n.indexOf(":"))), this.capture(o), this.capture(":"))
        : e && (o = S);
      let s = this.parseChildren();
      (r[o] = Object.keys(s).length === 1 ? s[S] : new k([], s)),
        this.consumeOptional("//");
    }
    return r;
  }
  peekStartsWith(e) {
    return this.remaining.startsWith(e);
  }
  consumeOptional(e) {
    return this.peekStartsWith(e)
      ? ((this.remaining = this.remaining.substring(e.length)), !0)
      : !1;
  }
  capture(e) {
    if (!this.consumeOptional(e)) throw new v(4011, !1);
  }
};
function Cp(t) {
  return t.segments.length > 0 ? new k([], { [S]: t }) : t;
}
function Ep(t) {
  let e = {};
  for (let [n, i] of Object.entries(t.children)) {
    let o = Ep(i);
    if (n === S && o.segments.length === 0 && o.hasChildren())
      for (let [s, a] of Object.entries(o.children)) e[s] = a;
    else (o.segments.length > 0 || o.hasChildren()) && (e[n] = o);
  }
  let r = new k(t.segments, e);
  return tI(r);
}
function tI(t) {
  if (t.numberOfChildren === 1 && t.children[S]) {
    let e = t.children[S];
    return new k(t.segments.concat(e.segments), e.children);
  }
  return t;
}
function Fn(t) {
  return t instanceof Dt;
}
function nI(t, e, r = null, n = null) {
  let i = Ip(t);
  return bp(i, e, r, n);
}
function Ip(t) {
  let e;
  function r(o) {
    let s = {};
    for (let u of o.children) {
      let c = r(u);
      s[u.outlet] = c;
    }
    let a = new k(o.url, s);
    return o === t && (e = a), a;
  }
  let n = r(t.root),
    i = Cp(n);
  return e ?? i;
}
function bp(t, e, r, n) {
  let i = t;
  for (; i.parent; ) i = i.parent;
  if (e.length === 0) return Xu(i, i, i, r, n);
  let o = rI(e);
  if (o.toRoot()) return Xu(i, i, new k([], {}), r, n);
  let s = iI(o, i, t),
    a = s.processChildren
      ? Mr(s.segmentGroup, s.index, o.commands)
      : _p(s.segmentGroup, s.index, o.commands);
  return Xu(i, s.segmentGroup, a, r, n);
}
function Uo(t) {
  return typeof t == "object" && t != null && !t.outlets && !t.segmentPath;
}
function Ar(t) {
  return typeof t == "object" && t != null && t.outlets;
}
function Xu(t, e, r, n, i) {
  let o = {};
  n &&
    Object.entries(n).forEach(([u, c]) => {
      o[u] = Array.isArray(c) ? c.map((l) => `${l}`) : `${c}`;
    });
  let s;
  t === e ? (s = r) : (s = Mp(t, e, r));
  let a = Cp(Ep(s));
  return new Dt(a, o, i);
}
function Mp(t, e, r) {
  let n = {};
  return (
    Object.entries(t.children).forEach(([i, o]) => {
      o === e ? (n[i] = r) : (n[i] = Mp(o, e, r));
    }),
    new k(t.segments, n)
  );
}
var $o = class {
  constructor(e, r, n) {
    if (
      ((this.isAbsolute = e),
      (this.numberOfDoubleDots = r),
      (this.commands = n),
      e && n.length > 0 && Uo(n[0]))
    )
      throw new v(4003, !1);
    let i = n.find(Ar);
    if (i && i !== pp(n)) throw new v(4004, !1);
  }
  toRoot() {
    return (
      this.isAbsolute && this.commands.length === 1 && this.commands[0] == "/"
    );
  }
};
function rI(t) {
  if (typeof t[0] == "string" && t.length === 1 && t[0] === "/")
    return new $o(!0, 0, t);
  let e = 0,
    r = !1,
    n = t.reduce((i, o, s) => {
      if (typeof o == "object" && o != null) {
        if (o.outlets) {
          let a = {};
          return (
            Object.entries(o.outlets).forEach(([u, c]) => {
              a[u] = typeof c == "string" ? c.split("/") : c;
            }),
            [...i, { outlets: a }]
          );
        }
        if (o.segmentPath) return [...i, o.segmentPath];
      }
      return typeof o != "string"
        ? [...i, o]
        : s === 0
        ? (o.split("/").forEach((a, u) => {
            (u == 0 && a === ".") ||
              (u == 0 && a === ""
                ? (r = !0)
                : a === ".."
                ? e++
                : a != "" && i.push(a));
          }),
          i)
        : [...i, o];
    }, []);
  return new $o(r, e, n);
}
var Nn = class {
  constructor(e, r, n) {
    (this.segmentGroup = e), (this.processChildren = r), (this.index = n);
  }
};
function iI(t, e, r) {
  if (t.isAbsolute) return new Nn(e, !0, 0);
  if (!r) return new Nn(e, !1, NaN);
  if (r.parent === null) return new Nn(r, !0, 0);
  let n = Uo(t.commands[0]) ? 0 : 1,
    i = r.segments.length - 1 + n;
  return oI(r, i, t.numberOfDoubleDots);
}
function oI(t, e, r) {
  let n = t,
    i = e,
    o = r;
  for (; o > i; ) {
    if (((o -= i), (n = n.parent), !n)) throw new v(4005, !1);
    i = n.segments.length;
  }
  return new Nn(n, !1, i - o);
}
function sI(t) {
  return Ar(t[0]) ? t[0].outlets : { [S]: t };
}
function _p(t, e, r) {
  if (((t ??= new k([], {})), t.segments.length === 0 && t.hasChildren()))
    return Mr(t, e, r);
  let n = aI(t, e, r),
    i = r.slice(n.commandIndex);
  if (n.match && n.pathIndex < t.segments.length) {
    let o = new k(t.segments.slice(0, n.pathIndex), {});
    return (
      (o.children[S] = new k(t.segments.slice(n.pathIndex), t.children)),
      Mr(o, 0, i)
    );
  } else
    return n.match && i.length === 0
      ? new k(t.segments, {})
      : n.match && !t.hasChildren()
      ? sc(t, e, r)
      : n.match
      ? Mr(t, 0, i)
      : sc(t, e, r);
}
function Mr(t, e, r) {
  if (r.length === 0) return new k(t.segments, {});
  {
    let n = sI(r),
      i = {};
    if (
      Object.keys(n).some((o) => o !== S) &&
      t.children[S] &&
      t.numberOfChildren === 1 &&
      t.children[S].segments.length === 0
    ) {
      let o = Mr(t.children[S], e, r);
      return new k(t.segments, o.children);
    }
    return (
      Object.entries(n).forEach(([o, s]) => {
        typeof s == "string" && (s = [s]),
          s !== null && (i[o] = _p(t.children[o], e, s));
      }),
      Object.entries(t.children).forEach(([o, s]) => {
        n[o] === void 0 && (i[o] = s);
      }),
      new k(t.segments, i)
    );
  }
}
function aI(t, e, r) {
  let n = 0,
    i = e,
    o = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; i < t.segments.length; ) {
    if (n >= r.length) return o;
    let s = t.segments[i],
      a = r[n];
    if (Ar(a)) break;
    let u = `${a}`,
      c = n < r.length - 1 ? r[n + 1] : null;
    if (i > 0 && u === void 0) break;
    if (u && c && typeof c == "object" && c.outlets === void 0) {
      if (!up(u, c, s)) return o;
      n += 2;
    } else {
      if (!up(u, {}, s)) return o;
      n++;
    }
    i++;
  }
  return { match: !0, pathIndex: i, commandIndex: n };
}
function sc(t, e, r) {
  let n = t.segments.slice(0, e),
    i = 0;
  for (; i < r.length; ) {
    let o = r[i];
    if (Ar(o)) {
      let u = uI(o.outlets);
      return new k(n, u);
    }
    if (i === 0 && Uo(r[0])) {
      let u = t.segments[e];
      n.push(new Wt(u.path, ap(r[0]))), i++;
      continue;
    }
    let s = Ar(o) ? o.outlets[S] : `${o}`,
      a = i < r.length - 1 ? r[i + 1] : null;
    s && a && Uo(a)
      ? (n.push(new Wt(s, ap(a))), (i += 2))
      : (n.push(new Wt(s, {})), i++);
  }
  return new k(n, {});
}
function uI(t) {
  let e = {};
  return (
    Object.entries(t).forEach(([r, n]) => {
      typeof n == "string" && (n = [n]),
        n !== null && (e[r] = sc(new k([], {}), 0, n));
    }),
    e
  );
}
function ap(t) {
  let e = {};
  return Object.entries(t).forEach(([r, n]) => (e[r] = `${n}`)), e;
}
function up(t, e, r) {
  return t == r.path && Ze(e, r.parameters);
}
var _r = "imperative",
  Q = (function (t) {
    return (
      (t[(t.NavigationStart = 0)] = "NavigationStart"),
      (t[(t.NavigationEnd = 1)] = "NavigationEnd"),
      (t[(t.NavigationCancel = 2)] = "NavigationCancel"),
      (t[(t.NavigationError = 3)] = "NavigationError"),
      (t[(t.RoutesRecognized = 4)] = "RoutesRecognized"),
      (t[(t.ResolveStart = 5)] = "ResolveStart"),
      (t[(t.ResolveEnd = 6)] = "ResolveEnd"),
      (t[(t.GuardsCheckStart = 7)] = "GuardsCheckStart"),
      (t[(t.GuardsCheckEnd = 8)] = "GuardsCheckEnd"),
      (t[(t.RouteConfigLoadStart = 9)] = "RouteConfigLoadStart"),
      (t[(t.RouteConfigLoadEnd = 10)] = "RouteConfigLoadEnd"),
      (t[(t.ChildActivationStart = 11)] = "ChildActivationStart"),
      (t[(t.ChildActivationEnd = 12)] = "ChildActivationEnd"),
      (t[(t.ActivationStart = 13)] = "ActivationStart"),
      (t[(t.ActivationEnd = 14)] = "ActivationEnd"),
      (t[(t.Scroll = 15)] = "Scroll"),
      (t[(t.NavigationSkipped = 16)] = "NavigationSkipped"),
      t
    );
  })(Q || {}),
  Se = class {
    constructor(e, r) {
      (this.id = e), (this.url = r);
    }
  },
  Pn = class extends Se {
    constructor(e, r, n = "imperative", i = null) {
      super(e, r),
        (this.type = Q.NavigationStart),
        (this.navigationTrigger = n),
        (this.restoredState = i);
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  rt = class extends Se {
    constructor(e, r, n) {
      super(e, r), (this.urlAfterRedirects = n), (this.type = Q.NavigationEnd);
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  _e = (function (t) {
    return (
      (t[(t.Redirect = 0)] = "Redirect"),
      (t[(t.SupersededByNewNavigation = 1)] = "SupersededByNewNavigation"),
      (t[(t.NoDataFromResolver = 2)] = "NoDataFromResolver"),
      (t[(t.GuardRejected = 3)] = "GuardRejected"),
      t
    );
  })(_e || {}),
  Bo = (function (t) {
    return (
      (t[(t.IgnoredSameUrlNavigation = 0)] = "IgnoredSameUrlNavigation"),
      (t[(t.IgnoredByUrlHandlingStrategy = 1)] =
        "IgnoredByUrlHandlingStrategy"),
      t
    );
  })(Bo || {}),
  wt = class extends Se {
    constructor(e, r, n, i) {
      super(e, r),
        (this.reason = n),
        (this.code = i),
        (this.type = Q.NavigationCancel);
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  Ct = class extends Se {
    constructor(e, r, n, i) {
      super(e, r),
        (this.reason = n),
        (this.code = i),
        (this.type = Q.NavigationSkipped);
    }
  },
  xr = class extends Se {
    constructor(e, r, n, i) {
      super(e, r),
        (this.error = n),
        (this.target = i),
        (this.type = Q.NavigationError);
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  Ho = class extends Se {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = Q.RoutesRecognized);
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  ac = class extends Se {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = Q.GuardsCheckStart);
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  uc = class extends Se {
    constructor(e, r, n, i, o) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.shouldActivate = o),
        (this.type = Q.GuardsCheckEnd);
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  cc = class extends Se {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = Q.ResolveStart);
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  lc = class extends Se {
    constructor(e, r, n, i) {
      super(e, r),
        (this.urlAfterRedirects = n),
        (this.state = i),
        (this.type = Q.ResolveEnd);
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  dc = class {
    constructor(e) {
      (this.route = e), (this.type = Q.RouteConfigLoadStart);
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  fc = class {
    constructor(e) {
      (this.route = e), (this.type = Q.RouteConfigLoadEnd);
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  hc = class {
    constructor(e) {
      (this.snapshot = e), (this.type = Q.ChildActivationStart);
    }
    toString() {
      return `ChildActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  pc = class {
    constructor(e) {
      (this.snapshot = e), (this.type = Q.ChildActivationEnd);
    }
    toString() {
      return `ChildActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  gc = class {
    constructor(e) {
      (this.snapshot = e), (this.type = Q.ActivationStart);
    }
    toString() {
      return `ActivationStart(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  mc = class {
    constructor(e) {
      (this.snapshot = e), (this.type = Q.ActivationEnd);
    }
    toString() {
      return `ActivationEnd(path: '${
        (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
      }')`;
    }
  },
  zo = class {
    constructor(e, r, n) {
      (this.routerEvent = e),
        (this.position = r),
        (this.anchor = n),
        (this.type = Q.Scroll);
    }
    toString() {
      let e = this.position ? `${this.position[0]}, ${this.position[1]}` : null;
      return `Scroll(anchor: '${this.anchor}', position: '${e}')`;
    }
  },
  Nr = class {},
  Rr = class {
    constructor(e) {
      this.url = e;
    }
  };
var vc = class {
    constructor() {
      (this.outlet = null),
        (this.route = null),
        (this.injector = null),
        (this.children = new Vr()),
        (this.attachRef = null);
    }
  },
  Vr = (() => {
    let e = class e {
      constructor() {
        this.contexts = new Map();
      }
      onChildOutletCreated(n, i) {
        let o = this.getOrCreateContext(n);
        (o.outlet = i), this.contexts.set(n, o);
      }
      onChildOutletDestroyed(n) {
        let i = this.getContext(n);
        i && ((i.outlet = null), (i.attachRef = null));
      }
      onOutletDeactivated() {
        let n = this.contexts;
        return (this.contexts = new Map()), n;
      }
      onOutletReAttached(n) {
        this.contexts = n;
      }
      getOrCreateContext(n) {
        let i = this.getContext(n);
        return i || ((i = new vc()), this.contexts.set(n, i)), i;
      }
      getContext(n) {
        return this.contexts.get(n) || null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Go = class {
    constructor(e) {
      this._root = e;
    }
    get root() {
      return this._root.value;
    }
    parent(e) {
      let r = this.pathFromRoot(e);
      return r.length > 1 ? r[r.length - 2] : null;
    }
    children(e) {
      let r = yc(e, this._root);
      return r ? r.children.map((n) => n.value) : [];
    }
    firstChild(e) {
      let r = yc(e, this._root);
      return r && r.children.length > 0 ? r.children[0].value : null;
    }
    siblings(e) {
      let r = Dc(e, this._root);
      return r.length < 2
        ? []
        : r[r.length - 2].children.map((i) => i.value).filter((i) => i !== e);
    }
    pathFromRoot(e) {
      return Dc(e, this._root).map((r) => r.value);
    }
  };
function yc(t, e) {
  if (t === e.value) return e;
  for (let r of e.children) {
    let n = yc(t, r);
    if (n) return n;
  }
  return null;
}
function Dc(t, e) {
  if (t === e.value) return [e];
  for (let r of e.children) {
    let n = Dc(t, r);
    if (n.length) return n.unshift(e), n;
  }
  return [];
}
var Ce = class {
  constructor(e, r) {
    (this.value = e), (this.children = r);
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function xn(t) {
  let e = {};
  return t && t.children.forEach((r) => (e[r.value.outlet] = r)), e;
}
var Wo = class extends Go {
  constructor(e, r) {
    super(e), (this.snapshot = r), Ac(this, e);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function Sp(t) {
  let e = cI(t),
    r = new K([new Wt("", {})]),
    n = new K({}),
    i = new K({}),
    o = new K({}),
    s = new K(""),
    a = new kn(r, n, o, s, i, S, t, e.root);
  return (a.snapshot = e.root), new Wo(new Ce(a, []), e);
}
function cI(t) {
  let e = {},
    r = {},
    n = {},
    i = "",
    o = new Or([], e, n, i, r, S, t, null, {});
  return new qo("", new Ce(o, []));
}
var kn = class {
  constructor(e, r, n, i, o, s, a, u) {
    (this.urlSubject = e),
      (this.paramsSubject = r),
      (this.queryParamsSubject = n),
      (this.fragmentSubject = i),
      (this.dataSubject = o),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = u),
      (this.title = this.dataSubject?.pipe(_((c) => c[kr])) ?? E(void 0)),
      (this.url = e),
      (this.params = r),
      (this.queryParams = n),
      (this.fragment = i),
      (this.data = o);
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return (
      (this._paramMap ??= this.params.pipe(_((e) => On(e)))), this._paramMap
    );
  }
  get queryParamMap() {
    return (
      (this._queryParamMap ??= this.queryParams.pipe(_((e) => On(e)))),
      this._queryParamMap
    );
  }
  toString() {
    return this.snapshot
      ? this.snapshot.toString()
      : `Future(${this._futureSnapshot})`;
  }
};
function Tc(t, e, r = "emptyOnly") {
  let n,
    { routeConfig: i } = t;
  return (
    e !== null &&
    (r === "always" ||
      i?.path === "" ||
      (!e.component && !e.routeConfig?.loadComponent))
      ? (n = {
          params: g(g({}, e.params), t.params),
          data: g(g({}, e.data), t.data),
          resolve: g(g(g(g({}, t.data), e.data), i?.data), t._resolvedData),
        })
      : (n = {
          params: g({}, t.params),
          data: g({}, t.data),
          resolve: g(g({}, t.data), t._resolvedData ?? {}),
        }),
    i && Ap(i) && (n.resolve[kr] = i.title),
    n
  );
}
var Or = class {
    get title() {
      return this.data?.[kr];
    }
    constructor(e, r, n, i, o, s, a, u, c) {
      (this.url = e),
        (this.params = r),
        (this.queryParams = n),
        (this.fragment = i),
        (this.data = o),
        (this.outlet = s),
        (this.component = a),
        (this.routeConfig = u),
        (this._resolve = c);
    }
    get root() {
      return this._routerState.root;
    }
    get parent() {
      return this._routerState.parent(this);
    }
    get firstChild() {
      return this._routerState.firstChild(this);
    }
    get children() {
      return this._routerState.children(this);
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
      return (this._paramMap ??= On(this.params)), this._paramMap;
    }
    get queryParamMap() {
      return (
        (this._queryParamMap ??= On(this.queryParams)), this._queryParamMap
      );
    }
    toString() {
      let e = this.url.map((n) => n.toString()).join("/"),
        r = this.routeConfig ? this.routeConfig.path : "";
      return `Route(url:'${e}', path:'${r}')`;
    }
  },
  qo = class extends Go {
    constructor(e, r) {
      super(r), (this.url = e), Ac(this, r);
    }
    toString() {
      return Tp(this._root);
    }
  };
function Ac(t, e) {
  (e.value._routerState = t), e.children.forEach((r) => Ac(t, r));
}
function Tp(t) {
  let e = t.children.length > 0 ? ` { ${t.children.map(Tp).join(", ")} } ` : "";
  return `${t.value}${e}`;
}
function ec(t) {
  if (t.snapshot) {
    let e = t.snapshot,
      r = t._futureSnapshot;
    (t.snapshot = r),
      Ze(e.queryParams, r.queryParams) ||
        t.queryParamsSubject.next(r.queryParams),
      e.fragment !== r.fragment && t.fragmentSubject.next(r.fragment),
      Ze(e.params, r.params) || t.paramsSubject.next(r.params),
      VE(e.url, r.url) || t.urlSubject.next(r.url),
      Ze(e.data, r.data) || t.dataSubject.next(r.data);
  } else
    (t.snapshot = t._futureSnapshot),
      t.dataSubject.next(t._futureSnapshot.data);
}
function wc(t, e) {
  let r = Ze(t.params, e.params) && BE(t.url, e.url),
    n = !t.parent != !e.parent;
  return r && !n && (!t.parent || wc(t.parent, e.parent));
}
function Ap(t) {
  return typeof t.title == "string" || t.title === null;
}
var lI = (() => {
    let e = class e {
      constructor() {
        (this.activated = null),
          (this._activatedRoute = null),
          (this.name = S),
          (this.activateEvents = new W()),
          (this.deactivateEvents = new W()),
          (this.attachEvents = new W()),
          (this.detachEvents = new W()),
          (this.parentContexts = p(Vr)),
          (this.location = p($t)),
          (this.changeDetector = p(Mn)),
          (this.environmentInjector = p(oe)),
          (this.inputBinder = p(Jo, { optional: !0 })),
          (this.supportsBindingToComponentInputs = !0);
      }
      get activatedComponentRef() {
        return this.activated;
      }
      ngOnChanges(n) {
        if (n.name) {
          let { firstChange: i, previousValue: o } = n.name;
          if (i) return;
          this.isTrackedInParentContexts(o) &&
            (this.deactivate(), this.parentContexts.onChildOutletDestroyed(o)),
            this.initializeOutletWithName();
        }
      }
      ngOnDestroy() {
        this.isTrackedInParentContexts(this.name) &&
          this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this);
      }
      isTrackedInParentContexts(n) {
        return this.parentContexts.getContext(n)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if (
          (this.parentContexts.onChildOutletCreated(this.name, this),
          this.activated)
        )
          return;
        let n = this.parentContexts.getContext(this.name);
        n?.route &&
          (n.attachRef
            ? this.attach(n.attachRef, n.route)
            : this.activateWith(n.route, n.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new v(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new v(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new v(4012, !1);
        this.location.detach();
        let n = this.activated;
        return (
          (this.activated = null),
          (this._activatedRoute = null),
          this.detachEvents.emit(n.instance),
          n
        );
      }
      attach(n, i) {
        (this.activated = n),
          (this._activatedRoute = i),
          this.location.insert(n.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(n.instance);
      }
      deactivate() {
        if (this.activated) {
          let n = this.component;
          this.activated.destroy(),
            (this.activated = null),
            (this._activatedRoute = null),
            this.deactivateEvents.emit(n);
        }
      }
      activateWith(n, i) {
        if (this.isActivated) throw new v(4013, !1);
        this._activatedRoute = n;
        let o = this.location,
          a = n.snapshot.component,
          u = this.parentContexts.getOrCreateContext(this.name).children,
          c = new Cc(n, u, o.injector);
        (this.activated = o.createComponent(a, {
          index: o.length,
          injector: c,
          environmentInjector: i ?? this.environmentInjector,
        })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵdir = ye({
        type: e,
        selectors: [["router-outlet"]],
        inputs: { name: "name" },
        outputs: {
          activateEvents: "activate",
          deactivateEvents: "deactivate",
          attachEvents: "attach",
          detachEvents: "detach",
        },
        exportAs: ["outlet"],
        standalone: !0,
        features: [Ut],
      }));
    let t = e;
    return t;
  })(),
  Cc = class {
    constructor(e, r, n) {
      (this.route = e), (this.childContexts = r), (this.parent = n);
    }
    get(e, r) {
      return e === kn
        ? this.route
        : e === Vr
        ? this.childContexts
        : this.parent.get(e, r);
    }
  },
  Jo = new y(""),
  cp = (() => {
    let e = class e {
      constructor() {
        this.outletDataSubscriptions = new Map();
      }
      bindActivatedRouteToOutletComponent(n) {
        this.unsubscribeFromRouteData(n), this.subscribeToRouteData(n);
      }
      unsubscribeFromRouteData(n) {
        this.outletDataSubscriptions.get(n)?.unsubscribe(),
          this.outletDataSubscriptions.delete(n);
      }
      subscribeToRouteData(n) {
        let { activatedRoute: i } = n,
          o = Gn([i.queryParams, i.params, i.data])
            .pipe(
              ce(
                ([s, a, u], c) => (
                  (u = g(g(g({}, s), a), u)),
                  c === 0 ? E(u) : Promise.resolve(u)
                )
              )
            )
            .subscribe((s) => {
              if (
                !n.isActivated ||
                !n.activatedComponentRef ||
                n.activatedRoute !== i ||
                i.component === null
              ) {
                this.unsubscribeFromRouteData(n);
                return;
              }
              let a = Ah(i.component);
              if (!a) {
                this.unsubscribeFromRouteData(n);
                return;
              }
              for (let { templateName: u } of a.inputs)
                n.activatedComponentRef.setInput(u, s[u]);
            });
        this.outletDataSubscriptions.set(n, o);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function dI(t, e, r) {
  let n = Fr(t, e._root, r ? r._root : void 0);
  return new Wo(n, e);
}
function Fr(t, e, r) {
  if (r && t.shouldReuseRoute(e.value, r.value.snapshot)) {
    let n = r.value;
    n._futureSnapshot = e.value;
    let i = fI(t, e, r);
    return new Ce(n, i);
  } else {
    if (t.shouldAttach(e.value)) {
      let o = t.retrieve(e.value);
      if (o !== null) {
        let s = o.route;
        return (
          (s.value._futureSnapshot = e.value),
          (s.children = e.children.map((a) => Fr(t, a))),
          s
        );
      }
    }
    let n = hI(e.value),
      i = e.children.map((o) => Fr(t, o));
    return new Ce(n, i);
  }
}
function fI(t, e, r) {
  return e.children.map((n) => {
    for (let i of r.children)
      if (t.shouldReuseRoute(n.value, i.value.snapshot)) return Fr(t, n, i);
    return Fr(t, n);
  });
}
function hI(t) {
  return new kn(
    new K(t.url),
    new K(t.params),
    new K(t.queryParams),
    new K(t.fragment),
    new K(t.data),
    t.outlet,
    t.component,
    t
  );
}
var xp = "ngNavigationCancelingError";
function Np(t, e) {
  let { redirectTo: r, navigationBehaviorOptions: n } = Fn(e)
      ? { redirectTo: e, navigationBehaviorOptions: void 0 }
      : e,
    i = Rp(!1, _e.Redirect);
  return (i.url = r), (i.navigationBehaviorOptions = n), i;
}
function Rp(t, e) {
  let r = new Error(`NavigationCancelingError: ${t || ""}`);
  return (r[xp] = !0), (r.cancellationCode = e), r;
}
function pI(t) {
  return Op(t) && Fn(t.url);
}
function Op(t) {
  return !!t && t[xp];
}
var gI = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = Dd({
      type: e,
      selectors: [["ng-component"]],
      standalone: !0,
      features: [wh],
      decls: 1,
      vars: 0,
      template: function (i, o) {
        i & 1 && wu(0, "router-outlet");
      },
      dependencies: [lI],
      encapsulation: 2,
    }));
  let t = e;
  return t;
})();
function mI(t, e) {
  return (
    t.providers &&
      !t._injector &&
      (t._injector = mo(t.providers, e, `Route: ${t.path}`)),
    t._injector ?? e
  );
}
function xc(t) {
  let e = t.children && t.children.map(xc),
    r = e ? $(g({}, t), { children: e }) : g({}, t);
  return (
    !r.component &&
      !r.loadComponent &&
      (e || r.loadChildren) &&
      r.outlet &&
      r.outlet !== S &&
      (r.component = gI),
    r
  );
}
function Ye(t) {
  return t.outlet || S;
}
function vI(t, e) {
  let r = t.filter((n) => Ye(n) === e);
  return r.push(...t.filter((n) => Ye(n) !== e)), r;
}
function jr(t) {
  if (!t) return null;
  if (t.routeConfig?._injector) return t.routeConfig._injector;
  for (let e = t.parent; e; e = e.parent) {
    let r = e.routeConfig;
    if (r?._loadedInjector) return r._loadedInjector;
    if (r?._injector) return r._injector;
  }
  return null;
}
var yI = (t, e, r, n) =>
    _(
      (i) => (
        new Ec(e, i.targetRouterState, i.currentRouterState, r, n).activate(t),
        i
      )
    ),
  Ec = class {
    constructor(e, r, n, i, o) {
      (this.routeReuseStrategy = e),
        (this.futureState = r),
        (this.currState = n),
        (this.forwardEvent = i),
        (this.inputBindingEnabled = o);
    }
    activate(e) {
      let r = this.futureState._root,
        n = this.currState ? this.currState._root : null;
      this.deactivateChildRoutes(r, n, e),
        ec(this.futureState.root),
        this.activateChildRoutes(r, n, e);
    }
    deactivateChildRoutes(e, r, n) {
      let i = xn(r);
      e.children.forEach((o) => {
        let s = o.value.outlet;
        this.deactivateRoutes(o, i[s], n), delete i[s];
      }),
        Object.values(i).forEach((o) => {
          this.deactivateRouteAndItsChildren(o, n);
        });
    }
    deactivateRoutes(e, r, n) {
      let i = e.value,
        o = r ? r.value : null;
      if (i === o)
        if (i.component) {
          let s = n.getContext(i.outlet);
          s && this.deactivateChildRoutes(e, r, s.children);
        } else this.deactivateChildRoutes(e, r, n);
      else o && this.deactivateRouteAndItsChildren(r, n);
    }
    deactivateRouteAndItsChildren(e, r) {
      e.value.component &&
      this.routeReuseStrategy.shouldDetach(e.value.snapshot)
        ? this.detachAndStoreRouteSubtree(e, r)
        : this.deactivateRouteAndOutlet(e, r);
    }
    detachAndStoreRouteSubtree(e, r) {
      let n = r.getContext(e.value.outlet),
        i = n && e.value.component ? n.children : r,
        o = xn(e);
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, i);
      if (n && n.outlet) {
        let s = n.outlet.detach(),
          a = n.children.onOutletDeactivated();
        this.routeReuseStrategy.store(e.value.snapshot, {
          componentRef: s,
          route: e,
          contexts: a,
        });
      }
    }
    deactivateRouteAndOutlet(e, r) {
      let n = r.getContext(e.value.outlet),
        i = n && e.value.component ? n.children : r,
        o = xn(e);
      for (let s of Object.values(o)) this.deactivateRouteAndItsChildren(s, i);
      n &&
        (n.outlet && (n.outlet.deactivate(), n.children.onOutletDeactivated()),
        (n.attachRef = null),
        (n.route = null));
    }
    activateChildRoutes(e, r, n) {
      let i = xn(r);
      e.children.forEach((o) => {
        this.activateRoutes(o, i[o.value.outlet], n),
          this.forwardEvent(new mc(o.value.snapshot));
      }),
        e.children.length && this.forwardEvent(new pc(e.value.snapshot));
    }
    activateRoutes(e, r, n) {
      let i = e.value,
        o = r ? r.value : null;
      if ((ec(i), i === o))
        if (i.component) {
          let s = n.getOrCreateContext(i.outlet);
          this.activateChildRoutes(e, r, s.children);
        } else this.activateChildRoutes(e, r, n);
      else if (i.component) {
        let s = n.getOrCreateContext(i.outlet);
        if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(i.snapshot);
          this.routeReuseStrategy.store(i.snapshot, null),
            s.children.onOutletReAttached(a.contexts),
            (s.attachRef = a.componentRef),
            (s.route = a.route.value),
            s.outlet && s.outlet.attach(a.componentRef, a.route.value),
            ec(a.route.value),
            this.activateChildRoutes(e, null, s.children);
        } else {
          let a = jr(i.snapshot);
          (s.attachRef = null),
            (s.route = i),
            (s.injector = a),
            s.outlet && s.outlet.activateWith(i, s.injector),
            this.activateChildRoutes(e, null, s.children);
        }
      } else this.activateChildRoutes(e, null, n);
    }
  },
  Zo = class {
    constructor(e) {
      (this.path = e), (this.route = this.path[this.path.length - 1]);
    }
  },
  Rn = class {
    constructor(e, r) {
      (this.component = e), (this.route = r);
    }
  };
function DI(t, e, r) {
  let n = t._root,
    i = e ? e._root : null;
  return Ir(n, i, r, [n.value]);
}
function wI(t) {
  let e = t.routeConfig ? t.routeConfig.canActivateChild : null;
  return !e || e.length === 0 ? null : { node: t, guards: e };
}
function Vn(t, e) {
  let r = Symbol(),
    n = e.get(t, r);
  return n === r ? (typeof t == "function" && !ud(t) ? t : e.get(t)) : n;
}
function Ir(
  t,
  e,
  r,
  n,
  i = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let o = xn(e);
  return (
    t.children.forEach((s) => {
      CI(s, o[s.value.outlet], r, n.concat([s.value]), i),
        delete o[s.value.outlet];
    }),
    Object.entries(o).forEach(([s, a]) => Sr(a, r.getContext(s), i)),
    i
  );
}
function CI(
  t,
  e,
  r,
  n,
  i = { canDeactivateChecks: [], canActivateChecks: [] }
) {
  let o = t.value,
    s = e ? e.value : null,
    a = r ? r.getContext(t.value.outlet) : null;
  if (s && o.routeConfig === s.routeConfig) {
    let u = EI(s, o, o.routeConfig.runGuardsAndResolvers);
    u
      ? i.canActivateChecks.push(new Zo(n))
      : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
      o.component ? Ir(t, e, a ? a.children : null, n, i) : Ir(t, e, r, n, i),
      u &&
        a &&
        a.outlet &&
        a.outlet.isActivated &&
        i.canDeactivateChecks.push(new Rn(a.outlet.component, s));
  } else
    s && Sr(e, a, i),
      i.canActivateChecks.push(new Zo(n)),
      o.component
        ? Ir(t, null, a ? a.children : null, n, i)
        : Ir(t, null, r, n, i);
  return i;
}
function EI(t, e, r) {
  if (typeof r == "function") return r(t, e);
  switch (r) {
    case "pathParamsChange":
      return !qt(t.url, e.url);
    case "pathParamsOrQueryParamsChange":
      return !qt(t.url, e.url) || !Ze(t.queryParams, e.queryParams);
    case "always":
      return !0;
    case "paramsOrQueryParamsChange":
      return !wc(t, e) || !Ze(t.queryParams, e.queryParams);
    case "paramsChange":
    default:
      return !wc(t, e);
  }
}
function Sr(t, e, r) {
  let n = xn(t),
    i = t.value;
  Object.entries(n).forEach(([o, s]) => {
    i.component
      ? e
        ? Sr(s, e.children.getContext(o), r)
        : Sr(s, null, r)
      : Sr(s, e, r);
  }),
    i.component
      ? e && e.outlet && e.outlet.isActivated
        ? r.canDeactivateChecks.push(new Rn(e.outlet.component, i))
        : r.canDeactivateChecks.push(new Rn(null, i))
      : r.canDeactivateChecks.push(new Rn(null, i));
}
function Ur(t) {
  return typeof t == "function";
}
function II(t) {
  return typeof t == "boolean";
}
function bI(t) {
  return t && Ur(t.canLoad);
}
function MI(t) {
  return t && Ur(t.canActivate);
}
function _I(t) {
  return t && Ur(t.canActivateChild);
}
function SI(t) {
  return t && Ur(t.canDeactivate);
}
function TI(t) {
  return t && Ur(t.canMatch);
}
function Fp(t) {
  return t instanceof Qe || t?.name === "EmptyError";
}
var ko = Symbol("INITIAL_VALUE");
function Ln() {
  return ce((t) =>
    Gn(t.map((e) => e.pipe(Ie(1), As(ko)))).pipe(
      _((e) => {
        for (let r of e)
          if (r !== !0) {
            if (r === ko) return ko;
            if (r === !1 || r instanceof Dt) return r;
          }
        return !0;
      }),
      ee((e) => e !== ko),
      Ie(1)
    )
  );
}
function AI(t, e) {
  return z((r) => {
    let {
      targetSnapshot: n,
      currentSnapshot: i,
      guards: { canActivateChecks: o, canDeactivateChecks: s },
    } = r;
    return s.length === 0 && o.length === 0
      ? E($(g({}, r), { guardsResult: !0 }))
      : xI(s, n, i, t).pipe(
          z((a) => (a && II(a) ? NI(n, o, t, e) : E(a))),
          _((a) => $(g({}, r), { guardsResult: a }))
        );
  });
}
function xI(t, e, r, n) {
  return L(t).pipe(
    z((i) => kI(i.component, i.route, r, e, n)),
    Le((i) => i !== !0, !0)
  );
}
function NI(t, e, r, n) {
  return L(e).pipe(
    Ke((i) =>
      ot(
        OI(i.route.parent, n),
        RI(i.route, n),
        PI(t, i.path, r),
        FI(t, i.route, r)
      )
    ),
    Le((i) => i !== !0, !0)
  );
}
function RI(t, e) {
  return t !== null && e && e(new gc(t)), E(!0);
}
function OI(t, e) {
  return t !== null && e && e(new hc(t)), E(!0);
}
function FI(t, e, r) {
  let n = e.routeConfig ? e.routeConfig.canActivate : null;
  if (!n || n.length === 0) return E(!0);
  let i = n.map((o) =>
    yi(() => {
      let s = jr(e) ?? r,
        a = Vn(o, s),
        u = MI(a) ? a.canActivate(e, t) : ze(s, () => a(e, t));
      return Et(u).pipe(Le());
    })
  );
  return E(i).pipe(Ln());
}
function PI(t, e, r) {
  let n = e[e.length - 1],
    o = e
      .slice(0, e.length - 1)
      .reverse()
      .map((s) => wI(s))
      .filter((s) => s !== null)
      .map((s) =>
        yi(() => {
          let a = s.guards.map((u) => {
            let c = jr(s.node) ?? r,
              l = Vn(u, c),
              d = _I(l) ? l.canActivateChild(n, t) : ze(c, () => l(n, t));
            return Et(d).pipe(Le());
          });
          return E(a).pipe(Ln());
        })
      );
  return E(o).pipe(Ln());
}
function kI(t, e, r, n, i) {
  let o = e && e.routeConfig ? e.routeConfig.canDeactivate : null;
  if (!o || o.length === 0) return E(!0);
  let s = o.map((a) => {
    let u = jr(e) ?? i,
      c = Vn(a, u),
      l = SI(c) ? c.canDeactivate(t, e, r, n) : ze(u, () => c(t, e, r, n));
    return Et(l).pipe(Le());
  });
  return E(s).pipe(Ln());
}
function LI(t, e, r, n) {
  let i = e.canLoad;
  if (i === void 0 || i.length === 0) return E(!0);
  let o = i.map((s) => {
    let a = Vn(s, t),
      u = bI(a) ? a.canLoad(e, r) : ze(t, () => a(e, r));
    return Et(u);
  });
  return E(o).pipe(Ln(), Pp(n));
}
function Pp(t) {
  return ys(
    Z((e) => {
      if (Fn(e)) throw Np(t, e);
    }),
    _((e) => e === !0)
  );
}
function VI(t, e, r, n) {
  let i = e.canMatch;
  if (!i || i.length === 0) return E(!0);
  let o = i.map((s) => {
    let a = Vn(s, t),
      u = TI(a) ? a.canMatch(e, r) : ze(t, () => a(e, r));
    return Et(u);
  });
  return E(o).pipe(Ln(), Pp(n));
}
var Pr = class {
    constructor(e) {
      this.segmentGroup = e || null;
    }
  },
  Yo = class extends Error {
    constructor(e) {
      super(), (this.urlTree = e);
    }
  };
function An(t) {
  return rn(new Pr(t));
}
function jI(t) {
  return rn(new v(4e3, !1));
}
function UI(t) {
  return rn(Rp(!1, _e.GuardRejected));
}
var Ic = class {
    constructor(e, r) {
      (this.urlSerializer = e), (this.urlTree = r);
    }
    lineralizeSegments(e, r) {
      let n = [],
        i = r.root;
      for (;;) {
        if (((n = n.concat(i.segments)), i.numberOfChildren === 0)) return E(n);
        if (i.numberOfChildren > 1 || !i.children[S]) return jI(e.redirectTo);
        i = i.children[S];
      }
    }
    applyRedirectCommands(e, r, n) {
      let i = this.applyRedirectCreateUrlTree(
        r,
        this.urlSerializer.parse(r),
        e,
        n
      );
      if (r.startsWith("/")) throw new Yo(i);
      return i;
    }
    applyRedirectCreateUrlTree(e, r, n, i) {
      let o = this.createSegmentGroup(e, r.root, n, i);
      return new Dt(
        o,
        this.createQueryParams(r.queryParams, this.urlTree.queryParams),
        r.fragment
      );
    }
    createQueryParams(e, r) {
      let n = {};
      return (
        Object.entries(e).forEach(([i, o]) => {
          if (typeof o == "string" && o.startsWith(":")) {
            let a = o.substring(1);
            n[i] = r[a];
          } else n[i] = o;
        }),
        n
      );
    }
    createSegmentGroup(e, r, n, i) {
      let o = this.createSegments(e, r.segments, n, i),
        s = {};
      return (
        Object.entries(r.children).forEach(([a, u]) => {
          s[a] = this.createSegmentGroup(e, u, n, i);
        }),
        new k(o, s)
      );
    }
    createSegments(e, r, n, i) {
      return r.map((o) =>
        o.path.startsWith(":")
          ? this.findPosParam(e, o, i)
          : this.findOrReturn(o, n)
      );
    }
    findPosParam(e, r, n) {
      let i = n[r.path.substring(1)];
      if (!i) throw new v(4001, !1);
      return i;
    }
    findOrReturn(e, r) {
      let n = 0;
      for (let i of r) {
        if (i.path === e.path) return r.splice(n), i;
        n++;
      }
      return e;
    }
  },
  bc = {
    matched: !1,
    consumedSegments: [],
    remainingSegments: [],
    parameters: {},
    positionalParamSegments: {},
  };
function $I(t, e, r, n, i) {
  let o = Nc(t, e, r);
  return o.matched
    ? ((n = mI(e, n)),
      VI(n, e, r, i).pipe(_((s) => (s === !0 ? o : g({}, bc)))))
    : E(o);
}
function Nc(t, e, r) {
  if (e.path === "**") return BI(r);
  if (e.path === "")
    return e.pathMatch === "full" && (t.hasChildren() || r.length > 0)
      ? g({}, bc)
      : {
          matched: !0,
          consumedSegments: [],
          remainingSegments: r,
          parameters: {},
          positionalParamSegments: {},
        };
  let i = (e.matcher || LE)(r, t, e);
  if (!i) return g({}, bc);
  let o = {};
  Object.entries(i.posParams ?? {}).forEach(([a, u]) => {
    o[a] = u.path;
  });
  let s =
    i.consumed.length > 0
      ? g(g({}, o), i.consumed[i.consumed.length - 1].parameters)
      : o;
  return {
    matched: !0,
    consumedSegments: i.consumed,
    remainingSegments: r.slice(i.consumed.length),
    parameters: s,
    positionalParamSegments: i.posParams ?? {},
  };
}
function BI(t) {
  return {
    matched: !0,
    parameters: t.length > 0 ? pp(t).parameters : {},
    consumedSegments: t,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function lp(t, e, r, n) {
  return r.length > 0 && GI(t, r, n)
    ? {
        segmentGroup: new k(e, zI(n, new k(r, t.children))),
        slicedSegments: [],
      }
    : r.length === 0 && WI(t, r, n)
    ? {
        segmentGroup: new k(t.segments, HI(t, r, n, t.children)),
        slicedSegments: r,
      }
    : { segmentGroup: new k(t.segments, t.children), slicedSegments: r };
}
function HI(t, e, r, n) {
  let i = {};
  for (let o of r)
    if (Xo(t, e, o) && !n[Ye(o)]) {
      let s = new k([], {});
      i[Ye(o)] = s;
    }
  return g(g({}, n), i);
}
function zI(t, e) {
  let r = {};
  r[S] = e;
  for (let n of t)
    if (n.path === "" && Ye(n) !== S) {
      let i = new k([], {});
      r[Ye(n)] = i;
    }
  return r;
}
function GI(t, e, r) {
  return r.some((n) => Xo(t, e, n) && Ye(n) !== S);
}
function WI(t, e, r) {
  return r.some((n) => Xo(t, e, n));
}
function Xo(t, e, r) {
  return (t.hasChildren() || e.length > 0) && r.pathMatch === "full"
    ? !1
    : r.path === "";
}
function qI(t, e, r, n) {
  return Ye(t) !== n && (n === S || !Xo(e, r, t)) ? !1 : Nc(e, t, r).matched;
}
function ZI(t, e, r) {
  return e.length === 0 && !t.children[r];
}
var Mc = class {};
function YI(t, e, r, n, i, o, s = "emptyOnly") {
  return new _c(t, e, r, n, i, s, o).recognize();
}
var QI = 31,
  _c = class {
    constructor(e, r, n, i, o, s, a) {
      (this.injector = e),
        (this.configLoader = r),
        (this.rootComponentType = n),
        (this.config = i),
        (this.urlTree = o),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = a),
        (this.applyRedirects = new Ic(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0);
    }
    noMatchError(e) {
      return new v(4002, `'${e.segmentGroup}'`);
    }
    recognize() {
      let e = lp(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(e).pipe(
        _((r) => {
          let n = new Or(
              [],
              Object.freeze({}),
              Object.freeze(g({}, this.urlTree.queryParams)),
              this.urlTree.fragment,
              {},
              S,
              this.rootComponentType,
              null,
              {}
            ),
            i = new Ce(n, r),
            o = new qo("", i),
            s = nI(n, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (s.queryParams = this.urlTree.queryParams),
            (o.url = this.urlSerializer.serialize(s)),
            this.inheritParamsAndData(o._root, null),
            { state: o, tree: s }
          );
        })
      );
    }
    match(e) {
      return this.processSegmentGroup(this.injector, this.config, e, S).pipe(
        st((n) => {
          if (n instanceof Yo)
            return (this.urlTree = n.urlTree), this.match(n.urlTree.root);
          throw n instanceof Pr ? this.noMatchError(n) : n;
        })
      );
    }
    inheritParamsAndData(e, r) {
      let n = e.value,
        i = Tc(n, r, this.paramsInheritanceStrategy);
      (n.params = Object.freeze(i.params)),
        (n.data = Object.freeze(i.data)),
        e.children.forEach((o) => this.inheritParamsAndData(o, n));
    }
    processSegmentGroup(e, r, n, i) {
      return n.segments.length === 0 && n.hasChildren()
        ? this.processChildren(e, r, n)
        : this.processSegment(e, r, n, n.segments, i, !0).pipe(
            _((o) => (o instanceof Ce ? [o] : []))
          );
    }
    processChildren(e, r, n) {
      let i = [];
      for (let o of Object.keys(n.children))
        o === "primary" ? i.unshift(o) : i.push(o);
      return L(i).pipe(
        Ke((o) => {
          let s = n.children[o],
            a = vI(r, o);
          return this.processSegmentGroup(e, a, s, o);
        }),
        Ts((o, s) => (o.push(...s), o)),
        at(null),
        Ss(),
        z((o) => {
          if (o === null) return An(n);
          let s = kp(o);
          return KI(s), E(s);
        })
      );
    }
    processSegment(e, r, n, i, o, s) {
      return L(r).pipe(
        Ke((a) =>
          this.processSegmentAgainstRoute(
            a._injector ?? e,
            r,
            a,
            n,
            i,
            o,
            s
          ).pipe(
            st((u) => {
              if (u instanceof Pr) return E(null);
              throw u;
            })
          )
        ),
        Le((a) => !!a),
        st((a) => {
          if (Fp(a)) return ZI(n, i, o) ? E(new Mc()) : An(n);
          throw a;
        })
      );
    }
    processSegmentAgainstRoute(e, r, n, i, o, s, a) {
      return qI(n, i, o, s)
        ? n.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(e, i, n, o, s)
          : this.allowRedirects && a
          ? this.expandSegmentAgainstRouteUsingRedirect(e, i, r, n, o, s)
          : An(i)
        : An(i);
    }
    expandSegmentAgainstRouteUsingRedirect(e, r, n, i, o, s) {
      let {
        matched: a,
        consumedSegments: u,
        positionalParamSegments: c,
        remainingSegments: l,
      } = Nc(r, i, o);
      if (!a) return An(r);
      i.redirectTo.startsWith("/") &&
        (this.absoluteRedirectCount++,
        this.absoluteRedirectCount > QI && (this.allowRedirects = !1));
      let d = this.applyRedirects.applyRedirectCommands(u, i.redirectTo, c);
      return this.applyRedirects
        .lineralizeSegments(i, d)
        .pipe(z((f) => this.processSegment(e, n, r, f.concat(l), s, !1)));
    }
    matchSegmentAgainstRoute(e, r, n, i, o) {
      let s = $I(r, n, i, e, this.urlSerializer);
      return (
        n.path === "**" && (r.children = {}),
        s.pipe(
          ce((a) =>
            a.matched
              ? ((e = n._injector ?? e),
                this.getChildConfig(e, n, i).pipe(
                  ce(({ routes: u }) => {
                    let c = n._loadedInjector ?? e,
                      {
                        consumedSegments: l,
                        remainingSegments: d,
                        parameters: f,
                      } = a,
                      h = new Or(
                        l,
                        f,
                        Object.freeze(g({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        XI(n),
                        Ye(n),
                        n.component ?? n._loadedComponent ?? null,
                        n,
                        eb(n)
                      ),
                      { segmentGroup: m, slicedSegments: F } = lp(r, l, d, u);
                    if (F.length === 0 && m.hasChildren())
                      return this.processChildren(c, u, m).pipe(
                        _((C) => (C === null ? null : new Ce(h, C)))
                      );
                    if (u.length === 0 && F.length === 0)
                      return E(new Ce(h, []));
                    let b = Ye(n) === o;
                    return this.processSegment(c, u, m, F, b ? S : o, !0).pipe(
                      _((C) => new Ce(h, C instanceof Ce ? [C] : []))
                    );
                  })
                ))
              : An(r)
          )
        )
      );
    }
    getChildConfig(e, r, n) {
      return r.children
        ? E({ routes: r.children, injector: e })
        : r.loadChildren
        ? r._loadedRoutes !== void 0
          ? E({ routes: r._loadedRoutes, injector: r._loadedInjector })
          : LI(e, r, n, this.urlSerializer).pipe(
              z((i) =>
                i
                  ? this.configLoader.loadChildren(e, r).pipe(
                      Z((o) => {
                        (r._loadedRoutes = o.routes),
                          (r._loadedInjector = o.injector);
                      })
                    )
                  : UI(r)
              )
            )
        : E({ routes: [], injector: e });
    }
  };
function KI(t) {
  t.sort((e, r) =>
    e.value.outlet === S
      ? -1
      : r.value.outlet === S
      ? 1
      : e.value.outlet.localeCompare(r.value.outlet)
  );
}
function JI(t) {
  let e = t.value.routeConfig;
  return e && e.path === "";
}
function kp(t) {
  let e = [],
    r = new Set();
  for (let n of t) {
    if (!JI(n)) {
      e.push(n);
      continue;
    }
    let i = e.find((o) => n.value.routeConfig === o.value.routeConfig);
    i !== void 0 ? (i.children.push(...n.children), r.add(i)) : e.push(n);
  }
  for (let n of r) {
    let i = kp(n.children);
    e.push(new Ce(n.value, i));
  }
  return e.filter((n) => !r.has(n));
}
function XI(t) {
  return t.data || {};
}
function eb(t) {
  return t.resolve || {};
}
function tb(t, e, r, n, i, o) {
  return z((s) =>
    YI(t, e, r, n, s.extractedUrl, i, o).pipe(
      _(({ state: a, tree: u }) =>
        $(g({}, s), { targetSnapshot: a, urlAfterRedirects: u })
      )
    )
  );
}
function nb(t, e) {
  return z((r) => {
    let {
      targetSnapshot: n,
      guards: { canActivateChecks: i },
    } = r;
    if (!i.length) return E(r);
    let o = new Set(i.map((u) => u.route)),
      s = new Set();
    for (let u of o) if (!s.has(u)) for (let c of Lp(u)) s.add(c);
    let a = 0;
    return L(s).pipe(
      Ke((u) =>
        o.has(u)
          ? rb(u, n, t, e)
          : ((u.data = Tc(u, u.parent, t).resolve), E(void 0))
      ),
      Z(() => a++),
      on(1),
      z((u) => (a === s.size ? E(r) : ae))
    );
  });
}
function Lp(t) {
  let e = t.children.map((r) => Lp(r)).flat();
  return [t, ...e];
}
function rb(t, e, r, n) {
  let i = t.routeConfig,
    o = t._resolve;
  return (
    i?.title !== void 0 && !Ap(i) && (o[kr] = i.title),
    ib(o, t, e, n).pipe(
      _(
        (s) => (
          (t._resolvedData = s), (t.data = Tc(t, t.parent, r).resolve), null
        )
      )
    )
  );
}
function ib(t, e, r, n) {
  let i = rc(t);
  if (i.length === 0) return E({});
  let o = {};
  return L(i).pipe(
    z((s) =>
      ob(t[s], e, r, n).pipe(
        Le(),
        Z((a) => {
          o[s] = a;
        })
      )
    ),
    on(1),
    Wn(o),
    st((s) => (Fp(s) ? ae : rn(s)))
  );
}
function ob(t, e, r, n) {
  let i = jr(e) ?? n,
    o = Vn(t, i),
    s = o.resolve ? o.resolve(e, r) : ze(i, () => o(e, r));
  return Et(s);
}
function tc(t) {
  return ce((e) => {
    let r = t(e);
    return r ? L(r).pipe(_(() => e)) : E(e);
  });
}
var Vp = (() => {
    let e = class e {
      buildTitle(n) {
        let i,
          o = n.root;
        for (; o !== void 0; )
          (i = this.getResolvedTitleForRoute(o) ?? i),
            (o = o.children.find((s) => s.outlet === S));
        return i;
      }
      getResolvedTitleForRoute(n) {
        return n.data[kr];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => p(sb), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  sb = (() => {
    let e = class e extends Vp {
      constructor(n) {
        super(), (this.title = n);
      }
      updateTitle(n) {
        let i = this.buildTitle(n);
        i !== void 0 && this.title.setTitle(i);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(ip));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  $r = new y("", { providedIn: "root", factory: () => ({}) }),
  Qo = new y(""),
  Rc = (() => {
    let e = class e {
      constructor() {
        (this.componentLoaders = new WeakMap()),
          (this.childrenLoaders = new WeakMap()),
          (this.compiler = p(wo));
      }
      loadComponent(n) {
        if (this.componentLoaders.get(n)) return this.componentLoaders.get(n);
        if (n._loadedComponent) return E(n._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(n);
        let i = Et(n.loadComponent()).pipe(
            _(jp),
            Z((s) => {
              this.onLoadEndListener && this.onLoadEndListener(n),
                (n._loadedComponent = s);
            }),
            ut(() => {
              this.componentLoaders.delete(n);
            })
          ),
          o = new tn(i, () => new re()).pipe(en());
        return this.componentLoaders.set(n, o), o;
      }
      loadChildren(n, i) {
        if (this.childrenLoaders.get(i)) return this.childrenLoaders.get(i);
        if (i._loadedRoutes)
          return E({ routes: i._loadedRoutes, injector: i._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(i);
        let s = ab(i, this.compiler, n, this.onLoadEndListener).pipe(
            ut(() => {
              this.childrenLoaders.delete(i);
            })
          ),
          a = new tn(s, () => new re()).pipe(en());
        return this.childrenLoaders.set(i, a), a;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function ab(t, e, r, n) {
  return Et(t.loadChildren()).pipe(
    _(jp),
    z((i) =>
      i instanceof ir || Array.isArray(i) ? E(i) : L(e.compileModuleAsync(i))
    ),
    _((i) => {
      n && n(t);
      let o,
        s,
        a = !1;
      return (
        Array.isArray(i)
          ? ((s = i), (a = !0))
          : ((o = i.create(r).injector),
            (s = o.get(Qo, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(xc), injector: o }
      );
    })
  );
}
function ub(t) {
  return t && typeof t == "object" && "default" in t;
}
function jp(t) {
  return ub(t) ? t.default : t;
}
var Oc = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => p(cb), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  cb = (() => {
    let e = class e {
      shouldProcessUrl(n) {
        return !0;
      }
      extract(n) {
        return n;
      }
      merge(n, i) {
        return n;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Up = new y(""),
  $p = new y("");
function lb(t, e, r) {
  let n = t.get($p),
    i = t.get(te);
  return t.get(V).runOutsideAngular(() => {
    if (!i.startViewTransition || n.skipNextTransition)
      return (n.skipNextTransition = !1), Promise.resolve();
    let o,
      s = new Promise((c) => {
        o = c;
      }),
      a = i.startViewTransition(() => (o(), db(t))),
      { onViewTransitionCreated: u } = n;
    return u && ze(t, () => u({ transition: a, from: e, to: r })), s;
  });
}
function db(t) {
  return new Promise((e) => {
    mu(e, { injector: t });
  });
}
var Fc = (() => {
  let e = class e {
    get hasRequestedNavigation() {
      return this.navigationId !== 0;
    }
    constructor() {
      (this.currentNavigation = null),
        (this.currentTransition = null),
        (this.lastSuccessfulNavigation = null),
        (this.events = new re()),
        (this.transitionAbortSubject = new re()),
        (this.configLoader = p(Rc)),
        (this.environmentInjector = p(oe)),
        (this.urlSerializer = p(Lr)),
        (this.rootContexts = p(Vr)),
        (this.location = p(Sn)),
        (this.inputBindingEnabled = p(Jo, { optional: !0 }) !== null),
        (this.titleStrategy = p(Vp)),
        (this.options = p($r, { optional: !0 }) || {}),
        (this.paramsInheritanceStrategy =
          this.options.paramsInheritanceStrategy || "emptyOnly"),
        (this.urlHandlingStrategy = p(Oc)),
        (this.createViewTransition = p(Up, { optional: !0 })),
        (this.navigationId = 0),
        (this.afterPreactivation = () => E(void 0)),
        (this.rootComponentType = null);
      let n = (o) => this.events.next(new dc(o)),
        i = (o) => this.events.next(new fc(o));
      (this.configLoader.onLoadEndListener = i),
        (this.configLoader.onLoadStartListener = n);
    }
    complete() {
      this.transitions?.complete();
    }
    handleNavigationRequest(n) {
      let i = ++this.navigationId;
      this.transitions?.next($(g(g({}, this.transitions.value), n), { id: i }));
    }
    setupNavigations(n, i, o) {
      return (
        (this.transitions = new K({
          id: 0,
          currentUrlTree: i,
          currentRawUrl: i,
          extractedUrl: this.urlHandlingStrategy.extract(i),
          urlAfterRedirects: this.urlHandlingStrategy.extract(i),
          rawUrl: i,
          extras: {},
          resolve: null,
          reject: null,
          promise: Promise.resolve(!0),
          source: _r,
          restoredState: null,
          currentSnapshot: o.snapshot,
          targetSnapshot: null,
          currentRouterState: o,
          targetRouterState: null,
          guards: { canActivateChecks: [], canDeactivateChecks: [] },
          guardsResult: null,
        })),
        this.transitions.pipe(
          ee((s) => s.id !== 0),
          _((s) =>
            $(g({}, s), {
              extractedUrl: this.urlHandlingStrategy.extract(s.rawUrl),
            })
          ),
          ce((s) => {
            this.currentTransition = s;
            let a = !1,
              u = !1;
            return E(s).pipe(
              Z((c) => {
                this.currentNavigation = {
                  id: c.id,
                  initialUrl: c.rawUrl,
                  extractedUrl: c.extractedUrl,
                  trigger: c.source,
                  extras: c.extras,
                  previousNavigation: this.lastSuccessfulNavigation
                    ? $(g({}, this.lastSuccessfulNavigation), {
                        previousNavigation: null,
                      })
                    : null,
                };
              }),
              ce((c) => {
                let l =
                    !n.navigated ||
                    this.isUpdatingInternalState() ||
                    this.isUpdatedBrowserUrl(),
                  d = c.extras.onSameUrlNavigation ?? n.onSameUrlNavigation;
                if (!l && d !== "reload") {
                  let f = "";
                  return (
                    this.events.next(
                      new Ct(
                        c.id,
                        this.urlSerializer.serialize(c.rawUrl),
                        f,
                        Bo.IgnoredSameUrlNavigation
                      )
                    ),
                    c.resolve(null),
                    ae
                  );
                }
                if (this.urlHandlingStrategy.shouldProcessUrl(c.rawUrl))
                  return E(c).pipe(
                    ce((f) => {
                      let h = this.transitions?.getValue();
                      return (
                        this.events.next(
                          new Pn(
                            f.id,
                            this.urlSerializer.serialize(f.extractedUrl),
                            f.source,
                            f.restoredState
                          )
                        ),
                        h !== this.transitions?.getValue()
                          ? ae
                          : Promise.resolve(f)
                      );
                    }),
                    tb(
                      this.environmentInjector,
                      this.configLoader,
                      this.rootComponentType,
                      n.config,
                      this.urlSerializer,
                      this.paramsInheritanceStrategy
                    ),
                    Z((f) => {
                      (s.targetSnapshot = f.targetSnapshot),
                        (s.urlAfterRedirects = f.urlAfterRedirects),
                        (this.currentNavigation = $(
                          g({}, this.currentNavigation),
                          { finalUrl: f.urlAfterRedirects }
                        ));
                      let h = new Ho(
                        f.id,
                        this.urlSerializer.serialize(f.extractedUrl),
                        this.urlSerializer.serialize(f.urlAfterRedirects),
                        f.targetSnapshot
                      );
                      this.events.next(h);
                    })
                  );
                if (
                  l &&
                  this.urlHandlingStrategy.shouldProcessUrl(c.currentRawUrl)
                ) {
                  let {
                      id: f,
                      extractedUrl: h,
                      source: m,
                      restoredState: F,
                      extras: b,
                    } = c,
                    C = new Pn(f, this.urlSerializer.serialize(h), m, F);
                  this.events.next(C);
                  let q = Sp(this.rootComponentType).snapshot;
                  return (
                    (this.currentTransition = s =
                      $(g({}, c), {
                        targetSnapshot: q,
                        urlAfterRedirects: h,
                        extras: $(g({}, b), {
                          skipLocationChange: !1,
                          replaceUrl: !1,
                        }),
                      })),
                    (this.currentNavigation.finalUrl = h),
                    E(s)
                  );
                } else {
                  let f = "";
                  return (
                    this.events.next(
                      new Ct(
                        c.id,
                        this.urlSerializer.serialize(c.extractedUrl),
                        f,
                        Bo.IgnoredByUrlHandlingStrategy
                      )
                    ),
                    c.resolve(null),
                    ae
                  );
                }
              }),
              Z((c) => {
                let l = new ac(
                  c.id,
                  this.urlSerializer.serialize(c.extractedUrl),
                  this.urlSerializer.serialize(c.urlAfterRedirects),
                  c.targetSnapshot
                );
                this.events.next(l);
              }),
              _(
                (c) => (
                  (this.currentTransition = s =
                    $(g({}, c), {
                      guards: DI(
                        c.targetSnapshot,
                        c.currentSnapshot,
                        this.rootContexts
                      ),
                    })),
                  s
                )
              ),
              AI(this.environmentInjector, (c) => this.events.next(c)),
              Z((c) => {
                if (((s.guardsResult = c.guardsResult), Fn(c.guardsResult)))
                  throw Np(this.urlSerializer, c.guardsResult);
                let l = new uc(
                  c.id,
                  this.urlSerializer.serialize(c.extractedUrl),
                  this.urlSerializer.serialize(c.urlAfterRedirects),
                  c.targetSnapshot,
                  !!c.guardsResult
                );
                this.events.next(l);
              }),
              ee((c) =>
                c.guardsResult
                  ? !0
                  : (this.cancelNavigationTransition(c, "", _e.GuardRejected),
                    !1)
              ),
              tc((c) => {
                if (c.guards.canActivateChecks.length)
                  return E(c).pipe(
                    Z((l) => {
                      let d = new cc(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        this.urlSerializer.serialize(l.urlAfterRedirects),
                        l.targetSnapshot
                      );
                      this.events.next(d);
                    }),
                    ce((l) => {
                      let d = !1;
                      return E(l).pipe(
                        nb(
                          this.paramsInheritanceStrategy,
                          this.environmentInjector
                        ),
                        Z({
                          next: () => (d = !0),
                          complete: () => {
                            d ||
                              this.cancelNavigationTransition(
                                l,
                                "",
                                _e.NoDataFromResolver
                              );
                          },
                        })
                      );
                    }),
                    Z((l) => {
                      let d = new lc(
                        l.id,
                        this.urlSerializer.serialize(l.extractedUrl),
                        this.urlSerializer.serialize(l.urlAfterRedirects),
                        l.targetSnapshot
                      );
                      this.events.next(d);
                    })
                  );
              }),
              tc((c) => {
                let l = (d) => {
                  let f = [];
                  d.routeConfig?.loadComponent &&
                    !d.routeConfig._loadedComponent &&
                    f.push(
                      this.configLoader.loadComponent(d.routeConfig).pipe(
                        Z((h) => {
                          d.component = h;
                        }),
                        _(() => {})
                      )
                    );
                  for (let h of d.children) f.push(...l(h));
                  return f;
                };
                return Gn(l(c.targetSnapshot.root)).pipe(at(null), Ie(1));
              }),
              tc(() => this.afterPreactivation()),
              ce(() => {
                let { currentSnapshot: c, targetSnapshot: l } = s,
                  d = this.createViewTransition?.(
                    this.environmentInjector,
                    c.root,
                    l.root
                  );
                return d ? L(d).pipe(_(() => s)) : E(s);
              }),
              _((c) => {
                let l = dI(
                  n.routeReuseStrategy,
                  c.targetSnapshot,
                  c.currentRouterState
                );
                return (
                  (this.currentTransition = s =
                    $(g({}, c), { targetRouterState: l })),
                  (this.currentNavigation.targetRouterState = l),
                  s
                );
              }),
              Z(() => {
                this.events.next(new Nr());
              }),
              yI(
                this.rootContexts,
                n.routeReuseStrategy,
                (c) => this.events.next(c),
                this.inputBindingEnabled
              ),
              Ie(1),
              Z({
                next: (c) => {
                  (a = !0),
                    (this.lastSuccessfulNavigation = this.currentNavigation),
                    this.events.next(
                      new rt(
                        c.id,
                        this.urlSerializer.serialize(c.extractedUrl),
                        this.urlSerializer.serialize(c.urlAfterRedirects)
                      )
                    ),
                    this.titleStrategy?.updateTitle(
                      c.targetRouterState.snapshot
                    ),
                    c.resolve(!0);
                },
                complete: () => {
                  a = !0;
                },
              }),
              wi(
                this.transitionAbortSubject.pipe(
                  Z((c) => {
                    throw c;
                  })
                )
              ),
              ut(() => {
                !a &&
                  !u &&
                  this.cancelNavigationTransition(
                    s,
                    "",
                    _e.SupersededByNewNavigation
                  ),
                  this.currentNavigation?.id === s.id &&
                    (this.currentNavigation = null);
              }),
              st((c) => {
                if (((u = !0), Op(c)))
                  this.events.next(
                    new wt(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      c.message,
                      c.cancellationCode
                    )
                  ),
                    pI(c) ? this.events.next(new Rr(c.url)) : s.resolve(!1);
                else {
                  this.events.next(
                    new xr(
                      s.id,
                      this.urlSerializer.serialize(s.extractedUrl),
                      c,
                      s.targetSnapshot ?? void 0
                    )
                  );
                  try {
                    s.resolve(n.errorHandler(c));
                  } catch (l) {
                    this.options.resolveNavigationPromiseOnError
                      ? s.resolve(!1)
                      : s.reject(l);
                  }
                }
                return ae;
              })
            );
          })
        )
      );
    }
    cancelNavigationTransition(n, i, o) {
      let s = new wt(n.id, this.urlSerializer.serialize(n.extractedUrl), i, o);
      this.events.next(s), n.resolve(!1);
    }
    isUpdatingInternalState() {
      return (
        this.currentTransition?.extractedUrl.toString() !==
        this.currentTransition?.currentUrlTree.toString()
      );
    }
    isUpdatedBrowserUrl() {
      return (
        this.urlHandlingStrategy
          .extract(this.urlSerializer.parse(this.location.path(!0)))
          .toString() !== this.currentTransition?.extractedUrl.toString() &&
        !this.currentTransition?.extras.skipLocationChange
      );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
function fb(t) {
  return t !== _r;
}
var hb = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => p(pb), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Sc = class {
    shouldDetach(e) {
      return !1;
    }
    store(e, r) {}
    shouldAttach(e) {
      return !1;
    }
    retrieve(e) {
      return null;
    }
    shouldReuseRoute(e, r) {
      return e.routeConfig === r.routeConfig;
    }
  },
  pb = (() => {
    let e = class e extends Sc {};
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = cr(e)))(o || e);
      };
    })()),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  Bp = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: () => p(gb), providedIn: "root" }));
    let t = e;
    return t;
  })(),
  gb = (() => {
    let e = class e extends Bp {
      constructor() {
        super(...arguments),
          (this.location = p(Sn)),
          (this.urlSerializer = p(Lr)),
          (this.options = p($r, { optional: !0 }) || {}),
          (this.canceledNavigationResolution =
            this.options.canceledNavigationResolution || "replace"),
          (this.urlHandlingStrategy = p(Oc)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.currentUrlTree = new Dt()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = Sp(null)),
          (this.stateMemento = this.createStateMemento());
      }
      getCurrentUrlTree() {
        return this.currentUrlTree;
      }
      getRawUrlTree() {
        return this.rawUrlTree;
      }
      restoredState() {
        return this.location.getState();
      }
      get browserPageId() {
        return this.canceledNavigationResolution !== "computed"
          ? this.currentPageId
          : this.restoredState()?.ɵrouterPageId ?? this.currentPageId;
      }
      getRouterState() {
        return this.routerState;
      }
      createStateMemento() {
        return {
          rawUrlTree: this.rawUrlTree,
          currentUrlTree: this.currentUrlTree,
          routerState: this.routerState,
        };
      }
      registerNonRouterCurrentEntryChangeListener(n) {
        return this.location.subscribe((i) => {
          i.type === "popstate" && n(i.url, i.state);
        });
      }
      handleRouterEvent(n, i) {
        if (n instanceof Pn) this.stateMemento = this.createStateMemento();
        else if (n instanceof Ct) this.rawUrlTree = i.initialUrl;
        else if (n instanceof Ho) {
          if (
            this.urlUpdateStrategy === "eager" &&
            !i.extras.skipLocationChange
          ) {
            let o = this.urlHandlingStrategy.merge(i.finalUrl, i.initialUrl);
            this.setBrowserUrl(o, i);
          }
        } else
          n instanceof Nr
            ? ((this.currentUrlTree = i.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                i.finalUrl,
                i.initialUrl
              )),
              (this.routerState = i.targetRouterState),
              this.urlUpdateStrategy === "deferred" &&
                (i.extras.skipLocationChange ||
                  this.setBrowserUrl(this.rawUrlTree, i)))
            : n instanceof wt &&
              (n.code === _e.GuardRejected || n.code === _e.NoDataFromResolver)
            ? this.restoreHistory(i)
            : n instanceof xr
            ? this.restoreHistory(i, !0)
            : n instanceof rt &&
              ((this.lastSuccessfulId = n.id),
              (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(n, i) {
        let o = this.urlSerializer.serialize(n);
        if (this.location.isCurrentPathEqualTo(o) || i.extras.replaceUrl) {
          let s = this.browserPageId,
            a = g(g({}, i.extras.state), this.generateNgRouterState(i.id, s));
          this.location.replaceState(o, "", a);
        } else {
          let s = g(
            g({}, i.extras.state),
            this.generateNgRouterState(i.id, this.browserPageId + 1)
          );
          this.location.go(o, "", s);
        }
      }
      restoreHistory(n, i = !1) {
        if (this.canceledNavigationResolution === "computed") {
          let o = this.browserPageId,
            s = this.currentPageId - o;
          s !== 0
            ? this.location.historyGo(s)
            : this.currentUrlTree === n.finalUrl &&
              s === 0 &&
              (this.resetState(n), this.resetUrlToCurrentUrlTree());
        } else
          this.canceledNavigationResolution === "replace" &&
            (i && this.resetState(n), this.resetUrlToCurrentUrlTree());
      }
      resetState(n) {
        (this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(
            this.currentUrlTree,
            n.finalUrl ?? this.rawUrlTree
          ));
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.rawUrlTree),
          "",
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId)
        );
      }
      generateNgRouterState(n, i) {
        return this.canceledNavigationResolution === "computed"
          ? { navigationId: n, ɵrouterPageId: i }
          : { navigationId: n };
      }
    };
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = cr(e)))(o || e);
      };
    })()),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  br = (function (t) {
    return (
      (t[(t.COMPLETE = 0)] = "COMPLETE"),
      (t[(t.FAILED = 1)] = "FAILED"),
      (t[(t.REDIRECTING = 2)] = "REDIRECTING"),
      t
    );
  })(br || {});
function Hp(t, e) {
  t.events
    .pipe(
      ee(
        (r) =>
          r instanceof rt ||
          r instanceof wt ||
          r instanceof xr ||
          r instanceof Ct
      ),
      _((r) =>
        r instanceof rt || r instanceof Ct
          ? br.COMPLETE
          : (
              r instanceof wt
                ? r.code === _e.Redirect ||
                  r.code === _e.SupersededByNewNavigation
                : !1
            )
          ? br.REDIRECTING
          : br.FAILED
      ),
      ee((r) => r !== br.REDIRECTING),
      Ie(1)
    )
    .subscribe(() => {
      e();
    });
}
function mb(t) {
  throw t;
}
var vb = {
    paths: "exact",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "exact",
  },
  yb = {
    paths: "subset",
    fragment: "ignored",
    matrixParams: "ignored",
    queryParams: "subset",
  },
  Zt = (() => {
    let e = class e {
      get currentUrlTree() {
        return this.stateManager.getCurrentUrlTree();
      }
      get rawUrlTree() {
        return this.stateManager.getRawUrlTree();
      }
      get events() {
        return this._events;
      }
      get routerState() {
        return this.stateManager.getRouterState();
      }
      constructor() {
        (this.disposed = !1),
          (this.isNgZoneEnabled = !1),
          (this.console = p(Do)),
          (this.stateManager = p(Bp)),
          (this.options = p($r, { optional: !0 }) || {}),
          (this.pendingTasks = p(Bt)),
          (this.urlUpdateStrategy =
            this.options.urlUpdateStrategy || "deferred"),
          (this.navigationTransitions = p(Fc)),
          (this.urlSerializer = p(Lr)),
          (this.location = p(Sn)),
          (this.urlHandlingStrategy = p(Oc)),
          (this._events = new re()),
          (this.errorHandler = this.options.errorHandler || mb),
          (this.navigated = !1),
          (this.routeReuseStrategy = p(hb)),
          (this.onSameUrlNavigation =
            this.options.onSameUrlNavigation || "ignore"),
          (this.config = p(Qo, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!p(Jo, { optional: !0 })),
          (this.eventsSubscription = new G()),
          (this.isNgZoneEnabled = p(V) instanceof V && V.isInAngularZone()),
          this.resetConfig(this.config),
          this.navigationTransitions
            .setupNavigations(this, this.currentUrlTree, this.routerState)
            .subscribe({
              error: (n) => {
                this.console.warn(n);
              },
            }),
          this.subscribeToNavigationEvents();
      }
      subscribeToNavigationEvents() {
        let n = this.navigationTransitions.events.subscribe((i) => {
          try {
            let o = this.navigationTransitions.currentTransition,
              s = this.navigationTransitions.currentNavigation;
            if (o !== null && s !== null) {
              if (
                (this.stateManager.handleRouterEvent(i, s),
                i instanceof wt &&
                  i.code !== _e.Redirect &&
                  i.code !== _e.SupersededByNewNavigation)
              )
                this.navigated = !0;
              else if (i instanceof rt) this.navigated = !0;
              else if (i instanceof Rr) {
                let a = this.urlHandlingStrategy.merge(i.url, o.currentRawUrl),
                  u = {
                    info: o.extras.info,
                    skipLocationChange: o.extras.skipLocationChange,
                    replaceUrl:
                      this.urlUpdateStrategy === "eager" || fb(o.source),
                  };
                this.scheduleNavigation(a, _r, null, u, {
                  resolve: o.resolve,
                  reject: o.reject,
                  promise: o.promise,
                });
              }
            }
            wb(i) && this._events.next(i);
          } catch (o) {
            this.navigationTransitions.transitionAbortSubject.next(o);
          }
        });
        this.eventsSubscription.add(n);
      }
      resetRootComponentType(n) {
        (this.routerState.root.component = n),
          (this.navigationTransitions.rootComponentType = n);
      }
      initialNavigation() {
        this.setUpLocationChangeListener(),
          this.navigationTransitions.hasRequestedNavigation ||
            this.navigateToSyncWithBrowser(
              this.location.path(!0),
              _r,
              this.stateManager.restoredState()
            );
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ??=
          this.stateManager.registerNonRouterCurrentEntryChangeListener(
            (n, i) => {
              setTimeout(() => {
                this.navigateToSyncWithBrowser(n, "popstate", i);
              }, 0);
            }
          );
      }
      navigateToSyncWithBrowser(n, i, o) {
        let s = { replaceUrl: !0 },
          a = o?.navigationId ? o : null;
        if (o) {
          let c = g({}, o);
          delete c.navigationId,
            delete c.ɵrouterPageId,
            Object.keys(c).length !== 0 && (s.state = c);
        }
        let u = this.parseUrl(n);
        this.scheduleNavigation(u, i, a, s);
      }
      get url() {
        return this.serializeUrl(this.currentUrlTree);
      }
      getCurrentNavigation() {
        return this.navigationTransitions.currentNavigation;
      }
      get lastSuccessfulNavigation() {
        return this.navigationTransitions.lastSuccessfulNavigation;
      }
      resetConfig(n) {
        (this.config = n.map(xc)), (this.navigated = !1);
      }
      ngOnDestroy() {
        this.dispose();
      }
      dispose() {
        this.navigationTransitions.complete(),
          this.nonRouterCurrentEntryChangeSubscription &&
            (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(),
            (this.nonRouterCurrentEntryChangeSubscription = void 0)),
          (this.disposed = !0),
          this.eventsSubscription.unsubscribe();
      }
      createUrlTree(n, i = {}) {
        let {
            relativeTo: o,
            queryParams: s,
            fragment: a,
            queryParamsHandling: u,
            preserveFragment: c,
          } = i,
          l = c ? this.currentUrlTree.fragment : a,
          d = null;
        switch (u) {
          case "merge":
            d = g(g({}, this.currentUrlTree.queryParams), s);
            break;
          case "preserve":
            d = this.currentUrlTree.queryParams;
            break;
          default:
            d = s || null;
        }
        d !== null && (d = this.removeEmptyProps(d));
        let f;
        try {
          let h = o ? o.snapshot : this.routerState.snapshot.root;
          f = Ip(h);
        } catch {
          (typeof n[0] != "string" || !n[0].startsWith("/")) && (n = []),
            (f = this.currentUrlTree.root);
        }
        return bp(f, n, d, l ?? null);
      }
      navigateByUrl(n, i = { skipLocationChange: !1 }) {
        let o = Fn(n) ? n : this.parseUrl(n),
          s = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
        return this.scheduleNavigation(s, _r, null, i);
      }
      navigate(n, i = { skipLocationChange: !1 }) {
        return Db(n), this.navigateByUrl(this.createUrlTree(n, i), i);
      }
      serializeUrl(n) {
        return this.urlSerializer.serialize(n);
      }
      parseUrl(n) {
        try {
          return this.urlSerializer.parse(n);
        } catch {
          return this.urlSerializer.parse("/");
        }
      }
      isActive(n, i) {
        let o;
        if (
          (i === !0 ? (o = g({}, vb)) : i === !1 ? (o = g({}, yb)) : (o = i),
          Fn(n))
        )
          return op(this.currentUrlTree, n, o);
        let s = this.parseUrl(n);
        return op(this.currentUrlTree, s, o);
      }
      removeEmptyProps(n) {
        return Object.entries(n).reduce(
          (i, [o, s]) => (s != null && (i[o] = s), i),
          {}
        );
      }
      scheduleNavigation(n, i, o, s, a) {
        if (this.disposed) return Promise.resolve(!1);
        let u, c, l;
        a
          ? ((u = a.resolve), (c = a.reject), (l = a.promise))
          : (l = new Promise((f, h) => {
              (u = f), (c = h);
            }));
        let d = this.pendingTasks.add();
        return (
          Hp(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(d));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: i,
            restoredState: o,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: n,
            extras: s,
            resolve: u,
            reject: c,
            promise: l,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          l.catch((f) => Promise.reject(f))
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })();
function Db(t) {
  for (let e = 0; e < t.length; e++) if (t[e] == null) throw new v(4008, !1);
}
function wb(t) {
  return !(t instanceof Nr) && !(t instanceof Rr);
}
var Ko = class {};
var Cb = (() => {
    let e = class e {
      constructor(n, i, o, s, a) {
        (this.router = n),
          (this.injector = o),
          (this.preloadingStrategy = s),
          (this.loader = a);
      }
      setUpPreloading() {
        this.subscription = this.router.events
          .pipe(
            ee((n) => n instanceof rt),
            Ke(() => this.preload())
          )
          .subscribe(() => {});
      }
      preload() {
        return this.processRoutes(this.injector, this.router.config);
      }
      ngOnDestroy() {
        this.subscription && this.subscription.unsubscribe();
      }
      processRoutes(n, i) {
        let o = [];
        for (let s of i) {
          s.providers &&
            !s._injector &&
            (s._injector = mo(s.providers, n, `Route: ${s.path}`));
          let a = s._injector ?? n,
            u = s._loadedInjector ?? a;
          ((s.loadChildren && !s._loadedRoutes && s.canLoad === void 0) ||
            (s.loadComponent && !s._loadedComponent)) &&
            o.push(this.preloadConfig(a, s)),
            (s.children || s._loadedRoutes) &&
              o.push(this.processRoutes(u, s.children ?? s._loadedRoutes));
        }
        return L(o).pipe(it());
      }
      preloadConfig(n, i) {
        return this.preloadingStrategy.preload(i, () => {
          let o;
          i.loadChildren && i.canLoad === void 0
            ? (o = this.loader.loadChildren(n, i))
            : (o = E(null));
          let s = o.pipe(
            z((a) =>
              a === null
                ? E(void 0)
                : ((i._loadedRoutes = a.routes),
                  (i._loadedInjector = a.injector),
                  this.processRoutes(a.injector ?? n, a.routes))
            )
          );
          if (i.loadComponent && !i._loadedComponent) {
            let a = this.loader.loadComponent(i);
            return L([s, a]).pipe(it());
          } else return s;
        });
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(Zt), D(wo), D(oe), D(Ko), D(Rc));
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac, providedIn: "root" }));
    let t = e;
    return t;
  })(),
  zp = new y(""),
  Eb = (() => {
    let e = class e {
      constructor(n, i, o, s, a = {}) {
        (this.urlSerializer = n),
          (this.transitions = i),
          (this.viewportScroller = o),
          (this.zone = s),
          (this.options = a),
          (this.lastId = 0),
          (this.lastSource = "imperative"),
          (this.restoredId = 0),
          (this.store = {}),
          (a.scrollPositionRestoration ||= "disabled"),
          (a.anchorScrolling ||= "disabled");
      }
      init() {
        this.options.scrollPositionRestoration !== "disabled" &&
          this.viewportScroller.setHistoryScrollRestoration("manual"),
          (this.routerEventsSubscription = this.createScrollEvents()),
          (this.scrollEventsSubscription = this.consumeScrollEvents());
      }
      createScrollEvents() {
        return this.transitions.events.subscribe((n) => {
          n instanceof Pn
            ? ((this.store[this.lastId] =
                this.viewportScroller.getScrollPosition()),
              (this.lastSource = n.navigationTrigger),
              (this.restoredId = n.restoredState
                ? n.restoredState.navigationId
                : 0))
            : n instanceof rt
            ? ((this.lastId = n.id),
              this.scheduleScrollEvent(
                n,
                this.urlSerializer.parse(n.urlAfterRedirects).fragment
              ))
            : n instanceof Ct &&
              n.code === Bo.IgnoredSameUrlNavigation &&
              ((this.lastSource = void 0),
              (this.restoredId = 0),
              this.scheduleScrollEvent(
                n,
                this.urlSerializer.parse(n.url).fragment
              ));
        });
      }
      consumeScrollEvents() {
        return this.transitions.events.subscribe((n) => {
          n instanceof zo &&
            (n.position
              ? this.options.scrollPositionRestoration === "top"
                ? this.viewportScroller.scrollToPosition([0, 0])
                : this.options.scrollPositionRestoration === "enabled" &&
                  this.viewportScroller.scrollToPosition(n.position)
              : n.anchor && this.options.anchorScrolling === "enabled"
              ? this.viewportScroller.scrollToAnchor(n.anchor)
              : this.options.scrollPositionRestoration !== "disabled" &&
                this.viewportScroller.scrollToPosition([0, 0]));
        });
      }
      scheduleScrollEvent(n, i) {
        this.zone.runOutsideAngular(() => {
          setTimeout(() => {
            this.zone.run(() => {
              this.transitions.events.next(
                new zo(
                  n,
                  this.lastSource === "popstate"
                    ? this.store[this.restoredId]
                    : null,
                  i
                )
              );
            });
          }, 0);
        });
      }
      ngOnDestroy() {
        this.routerEventsSubscription?.unsubscribe(),
          this.scrollEventsSubscription?.unsubscribe();
      }
    };
    (e.ɵfac = function (i) {
      Uf();
    }),
      (e.ɵprov = w({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function Ib(t) {
  return t.routerState.root;
}
function Br(t, e) {
  return { ɵkind: t, ɵproviders: e };
}
function bb() {
  let t = p(Pe);
  return (e) => {
    let r = t.get(Ht);
    if (e !== r.components[0]) return;
    let n = t.get(Zt),
      i = t.get(Gp);
    t.get(Pc) === 1 && n.initialNavigation(),
      t.get(Wp, null, N.Optional)?.setUpPreloading(),
      t.get(zp, null, N.Optional)?.init(),
      n.resetRootComponentType(r.componentTypes[0]),
      i.closed || (i.next(), i.complete(), i.unsubscribe());
  };
}
var Gp = new y("", { factory: () => new re() }),
  Pc = new y("", { providedIn: "root", factory: () => 1 });
function Mb() {
  return Br(2, [
    { provide: Pc, useValue: 0 },
    {
      provide: Io,
      multi: !0,
      deps: [Pe],
      useFactory: (e) => {
        let r = e.get(Ph, Promise.resolve());
        return () =>
          r.then(
            () =>
              new Promise((n) => {
                let i = e.get(Zt),
                  o = e.get(Gp);
                Hp(i, () => {
                  n(!0);
                }),
                  (e.get(Fc).afterPreactivation = () => (
                    n(!0), o.closed ? E(void 0) : o
                  )),
                  i.initialNavigation();
              })
          );
      },
    },
  ]);
}
function _b() {
  return Br(3, [
    {
      provide: Io,
      multi: !0,
      useFactory: () => {
        let e = p(Zt);
        return () => {
          e.setUpLocationChangeListener();
        };
      },
    },
    { provide: Pc, useValue: 2 },
  ]);
}
var Wp = new y("");
function Sb(t) {
  return Br(0, [
    { provide: Wp, useExisting: Cb },
    { provide: Ko, useExisting: t },
  ]);
}
function Tb() {
  return Br(8, [cp, { provide: Jo, useExisting: cp }]);
}
function Ab(t) {
  let e = [
    { provide: Up, useValue: lb },
    {
      provide: $p,
      useValue: g({ skipNextTransition: !!t?.skipInitialTransition }, t),
    },
  ];
  return Br(9, e);
}
var dp = new y("ROUTER_FORROOT_GUARD"),
  xb = [
    Sn,
    { provide: Lr, useClass: Tr },
    Zt,
    Vr,
    { provide: kn, useFactory: Ib, deps: [Zt] },
    Rc,
    [],
  ],
  sO = (() => {
    let e = class e {
      constructor(n) {}
      static forRoot(n, i) {
        return {
          ngModule: e,
          providers: [
            xb,
            [],
            { provide: Qo, multi: !0, useValue: n },
            { provide: dp, useFactory: Fb, deps: [[Zt, new oo(), new Xa()]] },
            { provide: $r, useValue: i || {} },
            i?.useHash ? Rb() : Ob(),
            Nb(),
            i?.preloadingStrategy ? Sb(i.preloadingStrategy).ɵproviders : [],
            i?.initialNavigation ? Pb(i) : [],
            i?.bindToComponentInputs ? Tb().ɵproviders : [],
            i?.enableViewTransitions ? Ab().ɵproviders : [],
            kb(),
          ],
        };
      }
      static forChild(n) {
        return {
          ngModule: e,
          providers: [{ provide: Qo, multi: !0, useValue: n }],
        };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(D(dp, 8));
    }),
      (e.ɵmod = ve({ type: e })),
      (e.ɵinj = me({}));
    let t = e;
    return t;
  })();
function Nb() {
  return {
    provide: zp,
    useFactory: () => {
      let t = p(Uh),
        e = p(V),
        r = p($r),
        n = p(Fc),
        i = p(Lr);
      return (
        r.scrollOffset && t.setOffset(r.scrollOffset), new Eb(i, n, t, e, r)
      );
    },
  };
}
function Rb() {
  return { provide: zt, useClass: Lh };
}
function Ob() {
  return { provide: zt, useClass: ku };
}
function Fb(t) {
  return "guarded";
}
function Pb(t) {
  return [
    t.initialNavigation === "disabled" ? _b().ɵproviders : [],
    t.initialNavigation === "enabledBlocking" ? Mb().ɵproviders : [],
  ];
}
var fp = new y("");
function kb() {
  return [
    { provide: fp, useFactory: bb },
    { provide: bo, multi: !0, useExisting: fp },
  ];
}
var ng = (() => {
    let e = class e {
      constructor(n, i) {
        (this._renderer = n),
          (this._elementRef = i),
          (this.onChange = (o) => {}),
          (this.onTouched = () => {});
      }
      setProperty(n, i) {
        this._renderer.setProperty(this._elementRef.nativeElement, n, i);
      }
      registerOnTouched(n) {
        this.onTouched = n;
      }
      registerOnChange(n) {
        this.onChange = n;
      }
      setDisabledState(n) {
        this.setProperty("disabled", n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(B(bn), B(We));
    }),
      (e.ɵdir = ye({ type: e }));
    let t = e;
    return t;
  })(),
  Lb = (() => {
    let e = class e extends ng {};
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = cr(e)))(o || e);
      };
    })()),
      (e.ɵdir = ye({ type: e, features: [mt] }));
    let t = e;
    return t;
  })(),
  rg = new y("");
var Vb = { provide: rg, useExisting: wn(() => ig), multi: !0 };
function jb() {
  let t = qe() ? qe().getUserAgent() : "";
  return /android (\d+)/.test(t.toLowerCase());
}
var Ub = new y(""),
  ig = (() => {
    let e = class e extends ng {
      constructor(n, i, o) {
        super(n, i),
          (this._compositionMode = o),
          (this._composing = !1),
          this._compositionMode == null && (this._compositionMode = !jb());
      }
      writeValue(n) {
        let i = n ?? "";
        this.setProperty("value", i);
      }
      _handleInput(n) {
        (!this._compositionMode ||
          (this._compositionMode && !this._composing)) &&
          this.onChange(n);
      }
      _compositionStart() {
        this._composing = !0;
      }
      _compositionEnd(n) {
        (this._composing = !1), this._compositionMode && this.onChange(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(B(bn), B(We), B(Ub, 8));
    }),
      (e.ɵdir = ye({
        type: e,
        selectors: [
          ["input", "formControlName", "", 3, "type", "checkbox"],
          ["textarea", "formControlName", ""],
          ["input", "formControl", "", 3, "type", "checkbox"],
          ["textarea", "formControl", ""],
          ["input", "ngModel", "", 3, "type", "checkbox"],
          ["textarea", "ngModel", ""],
          ["", "ngDefaultControl", ""],
        ],
        hostBindings: function (i, o) {
          i & 1 &&
            hr("input", function (a) {
              return o._handleInput(a.target.value);
            })("blur", function () {
              return o.onTouched();
            })("compositionstart", function () {
              return o._compositionStart();
            })("compositionend", function (a) {
              return o._compositionEnd(a.target.value);
            });
        },
        features: [yo([Vb]), mt],
      }));
    let t = e;
    return t;
  })();
function It(t) {
  return (
    t == null || ((typeof t == "string" || Array.isArray(t)) && t.length === 0)
  );
}
function og(t) {
  return t != null && typeof t.length == "number";
}
var sg = new y(""),
  ag = new y(""),
  $b =
    /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  qp = class {
    static min(e) {
      return Bb(e);
    }
    static max(e) {
      return Hb(e);
    }
    static required(e) {
      return zb(e);
    }
    static requiredTrue(e) {
      return Gb(e);
    }
    static email(e) {
      return Wb(e);
    }
    static minLength(e) {
      return qb(e);
    }
    static maxLength(e) {
      return Zb(e);
    }
    static pattern(e) {
      return Yb(e);
    }
    static nullValidator(e) {
      return ug(e);
    }
    static compose(e) {
      return pg(e);
    }
    static composeAsync(e) {
      return mg(e);
    }
  };
function Bb(t) {
  return (e) => {
    if (It(e.value) || It(t)) return null;
    let r = parseFloat(e.value);
    return !isNaN(r) && r < t ? { min: { min: t, actual: e.value } } : null;
  };
}
function Hb(t) {
  return (e) => {
    if (It(e.value) || It(t)) return null;
    let r = parseFloat(e.value);
    return !isNaN(r) && r > t ? { max: { max: t, actual: e.value } } : null;
  };
}
function zb(t) {
  return It(t.value) ? { required: !0 } : null;
}
function Gb(t) {
  return t.value === !0 ? null : { required: !0 };
}
function Wb(t) {
  return It(t.value) || $b.test(t.value) ? null : { email: !0 };
}
function qb(t) {
  return (e) =>
    It(e.value) || !og(e.value)
      ? null
      : e.value.length < t
      ? { minlength: { requiredLength: t, actualLength: e.value.length } }
      : null;
}
function Zb(t) {
  return (e) =>
    og(e.value) && e.value.length > t
      ? { maxlength: { requiredLength: t, actualLength: e.value.length } }
      : null;
}
function Yb(t) {
  if (!t) return ug;
  let e, r;
  return (
    typeof t == "string"
      ? ((r = ""),
        t.charAt(0) !== "^" && (r += "^"),
        (r += t),
        t.charAt(t.length - 1) !== "$" && (r += "$"),
        (e = new RegExp(r)))
      : ((r = t.toString()), (e = t)),
    (n) => {
      if (It(n.value)) return null;
      let i = n.value;
      return e.test(i)
        ? null
        : { pattern: { requiredPattern: r, actualValue: i } };
    }
  );
}
function ug(t) {
  return null;
}
function cg(t) {
  return t != null;
}
function lg(t) {
  return vt(t) ? L(t) : t;
}
function dg(t) {
  let e = {};
  return (
    t.forEach((r) => {
      e = r != null ? g(g({}, e), r) : e;
    }),
    Object.keys(e).length === 0 ? null : e
  );
}
function fg(t, e) {
  return e.map((r) => r(t));
}
function Qb(t) {
  return !t.validate;
}
function hg(t) {
  return t.map((e) => (Qb(e) ? e : (r) => e.validate(r)));
}
function pg(t) {
  if (!t) return null;
  let e = t.filter(cg);
  return e.length == 0
    ? null
    : function (r) {
        return dg(fg(r, e));
      };
}
function gg(t) {
  return t != null ? pg(hg(t)) : null;
}
function mg(t) {
  if (!t) return null;
  let e = t.filter(cg);
  return e.length == 0
    ? null
    : function (r) {
        let n = fg(r, e).map(lg);
        return Ms(n).pipe(_(dg));
      };
}
function vg(t) {
  return t != null ? mg(hg(t)) : null;
}
function Zp(t, e) {
  return t === null ? [e] : Array.isArray(t) ? [...t, e] : [t, e];
}
function yg(t) {
  return t._rawValidators;
}
function Dg(t) {
  return t._rawAsyncValidators;
}
function kc(t) {
  return t ? (Array.isArray(t) ? t : [t]) : [];
}
function ts(t, e) {
  return Array.isArray(t) ? t.includes(e) : t === e;
}
function Yp(t, e) {
  let r = kc(e);
  return (
    kc(t).forEach((i) => {
      ts(r, i) || r.push(i);
    }),
    r
  );
}
function Qp(t, e) {
  return kc(e).filter((r) => !ts(t, r));
}
var ns = class {
    constructor() {
      (this._rawValidators = []),
        (this._rawAsyncValidators = []),
        (this._onDestroyCallbacks = []);
    }
    get value() {
      return this.control ? this.control.value : null;
    }
    get valid() {
      return this.control ? this.control.valid : null;
    }
    get invalid() {
      return this.control ? this.control.invalid : null;
    }
    get pending() {
      return this.control ? this.control.pending : null;
    }
    get disabled() {
      return this.control ? this.control.disabled : null;
    }
    get enabled() {
      return this.control ? this.control.enabled : null;
    }
    get errors() {
      return this.control ? this.control.errors : null;
    }
    get pristine() {
      return this.control ? this.control.pristine : null;
    }
    get dirty() {
      return this.control ? this.control.dirty : null;
    }
    get touched() {
      return this.control ? this.control.touched : null;
    }
    get status() {
      return this.control ? this.control.status : null;
    }
    get untouched() {
      return this.control ? this.control.untouched : null;
    }
    get statusChanges() {
      return this.control ? this.control.statusChanges : null;
    }
    get valueChanges() {
      return this.control ? this.control.valueChanges : null;
    }
    get path() {
      return null;
    }
    _setValidators(e) {
      (this._rawValidators = e || []),
        (this._composedValidatorFn = gg(this._rawValidators));
    }
    _setAsyncValidators(e) {
      (this._rawAsyncValidators = e || []),
        (this._composedAsyncValidatorFn = vg(this._rawAsyncValidators));
    }
    get validator() {
      return this._composedValidatorFn || null;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn || null;
    }
    _registerOnDestroy(e) {
      this._onDestroyCallbacks.push(e);
    }
    _invokeOnDestroyCallbacks() {
      this._onDestroyCallbacks.forEach((e) => e()),
        (this._onDestroyCallbacks = []);
    }
    reset(e = void 0) {
      this.control && this.control.reset(e);
    }
    hasError(e, r) {
      return this.control ? this.control.hasError(e, r) : !1;
    }
    getError(e, r) {
      return this.control ? this.control.getError(e, r) : null;
    }
  },
  Un = class extends ns {
    get formDirective() {
      return null;
    }
    get path() {
      return null;
    }
  },
  Gr = class extends ns {
    constructor() {
      super(...arguments),
        (this._parent = null),
        (this.name = null),
        (this.valueAccessor = null);
    }
  },
  rs = class {
    constructor(e) {
      this._cd = e;
    }
    get isTouched() {
      return !!this._cd?.control?.touched;
    }
    get isUntouched() {
      return !!this._cd?.control?.untouched;
    }
    get isPristine() {
      return !!this._cd?.control?.pristine;
    }
    get isDirty() {
      return !!this._cd?.control?.dirty;
    }
    get isValid() {
      return !!this._cd?.control?.valid;
    }
    get isInvalid() {
      return !!this._cd?.control?.invalid;
    }
    get isPending() {
      return !!this._cd?.control?.pending;
    }
    get isSubmitted() {
      return !!this._cd?.submitted;
    }
  },
  Kb = {
    "[class.ng-untouched]": "isUntouched",
    "[class.ng-touched]": "isTouched",
    "[class.ng-pristine]": "isPristine",
    "[class.ng-dirty]": "isDirty",
    "[class.ng-valid]": "isValid",
    "[class.ng-invalid]": "isInvalid",
    "[class.ng-pending]": "isPending",
  },
  bO = $(g({}, Kb), { "[class.ng-submitted]": "isSubmitted" }),
  MO = (() => {
    let e = class e extends rs {
      constructor(n) {
        super(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(B(Gr, 2));
    }),
      (e.ɵdir = ye({
        type: e,
        selectors: [
          ["", "formControlName", ""],
          ["", "ngModel", ""],
          ["", "formControl", ""],
        ],
        hostVars: 14,
        hostBindings: function (i, o) {
          i & 2 &&
            vo("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)(
              "ng-pristine",
              o.isPristine
            )("ng-dirty", o.isDirty)("ng-valid", o.isValid)(
              "ng-invalid",
              o.isInvalid
            )("ng-pending", o.isPending);
        },
        features: [mt],
      }));
    let t = e;
    return t;
  })(),
  _O = (() => {
    let e = class e extends rs {
      constructor(n) {
        super(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(B(Un, 10));
    }),
      (e.ɵdir = ye({
        type: e,
        selectors: [
          ["", "formGroupName", ""],
          ["", "formArrayName", ""],
          ["", "ngModelGroup", ""],
          ["", "formGroup", ""],
          ["form", 3, "ngNoForm", ""],
          ["", "ngForm", ""],
        ],
        hostVars: 16,
        hostBindings: function (i, o) {
          i & 2 &&
            vo("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)(
              "ng-pristine",
              o.isPristine
            )("ng-dirty", o.isDirty)("ng-valid", o.isValid)(
              "ng-invalid",
              o.isInvalid
            )("ng-pending", o.isPending)("ng-submitted", o.isSubmitted);
        },
        features: [mt],
      }));
    let t = e;
    return t;
  })();
var Hr = "VALID",
  es = "INVALID",
  jn = "PENDING",
  zr = "DISABLED";
function wg(t) {
  return (as(t) ? t.validators : t) || null;
}
function Jb(t) {
  return Array.isArray(t) ? gg(t) : t || null;
}
function Cg(t, e) {
  return (as(e) ? e.asyncValidators : t) || null;
}
function Xb(t) {
  return Array.isArray(t) ? vg(t) : t || null;
}
function as(t) {
  return t != null && !Array.isArray(t) && typeof t == "object";
}
function e0(t, e, r) {
  let n = t.controls;
  if (!(e ? Object.keys(n) : n).length) throw new v(1e3, "");
  if (!n[r]) throw new v(1001, "");
}
function t0(t, e, r) {
  t._forEachChild((n, i) => {
    if (r[i] === void 0) throw new v(1002, "");
  });
}
var is = class {
    constructor(e, r) {
      (this._pendingDirty = !1),
        (this._hasOwnPendingAsyncValidator = !1),
        (this._pendingTouched = !1),
        (this._onCollectionChange = () => {}),
        (this._parent = null),
        (this.pristine = !0),
        (this.touched = !1),
        (this._onDisabledChange = []),
        this._assignValidators(e),
        this._assignAsyncValidators(r);
    }
    get validator() {
      return this._composedValidatorFn;
    }
    set validator(e) {
      this._rawValidators = this._composedValidatorFn = e;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn;
    }
    set asyncValidator(e) {
      this._rawAsyncValidators = this._composedAsyncValidatorFn = e;
    }
    get parent() {
      return this._parent;
    }
    get valid() {
      return this.status === Hr;
    }
    get invalid() {
      return this.status === es;
    }
    get pending() {
      return this.status == jn;
    }
    get disabled() {
      return this.status === zr;
    }
    get enabled() {
      return this.status !== zr;
    }
    get dirty() {
      return !this.pristine;
    }
    get untouched() {
      return !this.touched;
    }
    get updateOn() {
      return this._updateOn
        ? this._updateOn
        : this.parent
        ? this.parent.updateOn
        : "change";
    }
    setValidators(e) {
      this._assignValidators(e);
    }
    setAsyncValidators(e) {
      this._assignAsyncValidators(e);
    }
    addValidators(e) {
      this.setValidators(Yp(e, this._rawValidators));
    }
    addAsyncValidators(e) {
      this.setAsyncValidators(Yp(e, this._rawAsyncValidators));
    }
    removeValidators(e) {
      this.setValidators(Qp(e, this._rawValidators));
    }
    removeAsyncValidators(e) {
      this.setAsyncValidators(Qp(e, this._rawAsyncValidators));
    }
    hasValidator(e) {
      return ts(this._rawValidators, e);
    }
    hasAsyncValidator(e) {
      return ts(this._rawAsyncValidators, e);
    }
    clearValidators() {
      this.validator = null;
    }
    clearAsyncValidators() {
      this.asyncValidator = null;
    }
    markAsTouched(e = {}) {
      (this.touched = !0),
        this._parent && !e.onlySelf && this._parent.markAsTouched(e);
    }
    markAllAsTouched() {
      this.markAsTouched({ onlySelf: !0 }),
        this._forEachChild((e) => e.markAllAsTouched());
    }
    markAsUntouched(e = {}) {
      (this.touched = !1),
        (this._pendingTouched = !1),
        this._forEachChild((r) => {
          r.markAsUntouched({ onlySelf: !0 });
        }),
        this._parent && !e.onlySelf && this._parent._updateTouched(e);
    }
    markAsDirty(e = {}) {
      (this.pristine = !1),
        this._parent && !e.onlySelf && this._parent.markAsDirty(e);
    }
    markAsPristine(e = {}) {
      (this.pristine = !0),
        (this._pendingDirty = !1),
        this._forEachChild((r) => {
          r.markAsPristine({ onlySelf: !0 });
        }),
        this._parent && !e.onlySelf && this._parent._updatePristine(e);
    }
    markAsPending(e = {}) {
      (this.status = jn),
        e.emitEvent !== !1 && this.statusChanges.emit(this.status),
        this._parent && !e.onlySelf && this._parent.markAsPending(e);
    }
    disable(e = {}) {
      let r = this._parentMarkedDirty(e.onlySelf);
      (this.status = zr),
        (this.errors = null),
        this._forEachChild((n) => {
          n.disable($(g({}, e), { onlySelf: !0 }));
        }),
        this._updateValue(),
        e.emitEvent !== !1 &&
          (this.valueChanges.emit(this.value),
          this.statusChanges.emit(this.status)),
        this._updateAncestors($(g({}, e), { skipPristineCheck: r })),
        this._onDisabledChange.forEach((n) => n(!0));
    }
    enable(e = {}) {
      let r = this._parentMarkedDirty(e.onlySelf);
      (this.status = Hr),
        this._forEachChild((n) => {
          n.enable($(g({}, e), { onlySelf: !0 }));
        }),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: e.emitEvent }),
        this._updateAncestors($(g({}, e), { skipPristineCheck: r })),
        this._onDisabledChange.forEach((n) => n(!1));
    }
    _updateAncestors(e) {
      this._parent &&
        !e.onlySelf &&
        (this._parent.updateValueAndValidity(e),
        e.skipPristineCheck || this._parent._updatePristine(),
        this._parent._updateTouched());
    }
    setParent(e) {
      this._parent = e;
    }
    getRawValue() {
      return this.value;
    }
    updateValueAndValidity(e = {}) {
      this._setInitialStatus(),
        this._updateValue(),
        this.enabled &&
          (this._cancelExistingSubscription(),
          (this.errors = this._runValidator()),
          (this.status = this._calculateStatus()),
          (this.status === Hr || this.status === jn) &&
            this._runAsyncValidator(e.emitEvent)),
        e.emitEvent !== !1 &&
          (this.valueChanges.emit(this.value),
          this.statusChanges.emit(this.status)),
        this._parent && !e.onlySelf && this._parent.updateValueAndValidity(e);
    }
    _updateTreeValidity(e = { emitEvent: !0 }) {
      this._forEachChild((r) => r._updateTreeValidity(e)),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: e.emitEvent });
    }
    _setInitialStatus() {
      this.status = this._allControlsDisabled() ? zr : Hr;
    }
    _runValidator() {
      return this.validator ? this.validator(this) : null;
    }
    _runAsyncValidator(e) {
      if (this.asyncValidator) {
        (this.status = jn), (this._hasOwnPendingAsyncValidator = !0);
        let r = lg(this.asyncValidator(this));
        this._asyncValidationSubscription = r.subscribe((n) => {
          (this._hasOwnPendingAsyncValidator = !1),
            this.setErrors(n, { emitEvent: e });
        });
      }
    }
    _cancelExistingSubscription() {
      this._asyncValidationSubscription &&
        (this._asyncValidationSubscription.unsubscribe(),
        (this._hasOwnPendingAsyncValidator = !1));
    }
    setErrors(e, r = {}) {
      (this.errors = e), this._updateControlsErrors(r.emitEvent !== !1);
    }
    get(e) {
      let r = e;
      return r == null ||
        (Array.isArray(r) || (r = r.split(".")), r.length === 0)
        ? null
        : r.reduce((n, i) => n && n._find(i), this);
    }
    getError(e, r) {
      let n = r ? this.get(r) : this;
      return n && n.errors ? n.errors[e] : null;
    }
    hasError(e, r) {
      return !!this.getError(e, r);
    }
    get root() {
      let e = this;
      for (; e._parent; ) e = e._parent;
      return e;
    }
    _updateControlsErrors(e) {
      (this.status = this._calculateStatus()),
        e && this.statusChanges.emit(this.status),
        this._parent && this._parent._updateControlsErrors(e);
    }
    _initObservables() {
      (this.valueChanges = new W()), (this.statusChanges = new W());
    }
    _calculateStatus() {
      return this._allControlsDisabled()
        ? zr
        : this.errors
        ? es
        : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(jn)
        ? jn
        : this._anyControlsHaveStatus(es)
        ? es
        : Hr;
    }
    _anyControlsHaveStatus(e) {
      return this._anyControls((r) => r.status === e);
    }
    _anyControlsDirty() {
      return this._anyControls((e) => e.dirty);
    }
    _anyControlsTouched() {
      return this._anyControls((e) => e.touched);
    }
    _updatePristine(e = {}) {
      (this.pristine = !this._anyControlsDirty()),
        this._parent && !e.onlySelf && this._parent._updatePristine(e);
    }
    _updateTouched(e = {}) {
      (this.touched = this._anyControlsTouched()),
        this._parent && !e.onlySelf && this._parent._updateTouched(e);
    }
    _registerOnCollectionChange(e) {
      this._onCollectionChange = e;
    }
    _setUpdateStrategy(e) {
      as(e) && e.updateOn != null && (this._updateOn = e.updateOn);
    }
    _parentMarkedDirty(e) {
      let r = this._parent && this._parent.dirty;
      return !e && !!r && !this._parent._anyControlsDirty();
    }
    _find(e) {
      return null;
    }
    _assignValidators(e) {
      (this._rawValidators = Array.isArray(e) ? e.slice() : e),
        (this._composedValidatorFn = Jb(this._rawValidators));
    }
    _assignAsyncValidators(e) {
      (this._rawAsyncValidators = Array.isArray(e) ? e.slice() : e),
        (this._composedAsyncValidatorFn = Xb(this._rawAsyncValidators));
    }
  },
  Kp = class extends is {
    constructor(e, r, n) {
      super(wg(r), Cg(n, r)),
        (this.controls = e),
        this._initObservables(),
        this._setUpdateStrategy(r),
        this._setUpControls(),
        this.updateValueAndValidity({
          onlySelf: !0,
          emitEvent: !!this.asyncValidator,
        });
    }
    registerControl(e, r) {
      return this.controls[e]
        ? this.controls[e]
        : ((this.controls[e] = r),
          r.setParent(this),
          r._registerOnCollectionChange(this._onCollectionChange),
          r);
    }
    addControl(e, r, n = {}) {
      this.registerControl(e, r),
        this.updateValueAndValidity({ emitEvent: n.emitEvent }),
        this._onCollectionChange();
    }
    removeControl(e, r = {}) {
      this.controls[e] &&
        this.controls[e]._registerOnCollectionChange(() => {}),
        delete this.controls[e],
        this.updateValueAndValidity({ emitEvent: r.emitEvent }),
        this._onCollectionChange();
    }
    setControl(e, r, n = {}) {
      this.controls[e] &&
        this.controls[e]._registerOnCollectionChange(() => {}),
        delete this.controls[e],
        r && this.registerControl(e, r),
        this.updateValueAndValidity({ emitEvent: n.emitEvent }),
        this._onCollectionChange();
    }
    contains(e) {
      return this.controls.hasOwnProperty(e) && this.controls[e].enabled;
    }
    setValue(e, r = {}) {
      t0(this, !0, e),
        Object.keys(e).forEach((n) => {
          e0(this, !0, n),
            this.controls[n].setValue(e[n], {
              onlySelf: !0,
              emitEvent: r.emitEvent,
            });
        }),
        this.updateValueAndValidity(r);
    }
    patchValue(e, r = {}) {
      e != null &&
        (Object.keys(e).forEach((n) => {
          let i = this.controls[n];
          i && i.patchValue(e[n], { onlySelf: !0, emitEvent: r.emitEvent });
        }),
        this.updateValueAndValidity(r));
    }
    reset(e = {}, r = {}) {
      this._forEachChild((n, i) => {
        n.reset(e ? e[i] : null, { onlySelf: !0, emitEvent: r.emitEvent });
      }),
        this._updatePristine(r),
        this._updateTouched(r),
        this.updateValueAndValidity(r);
    }
    getRawValue() {
      return this._reduceChildren(
        {},
        (e, r, n) => ((e[n] = r.getRawValue()), e)
      );
    }
    _syncPendingControls() {
      let e = this._reduceChildren(!1, (r, n) =>
        n._syncPendingControls() ? !0 : r
      );
      return e && this.updateValueAndValidity({ onlySelf: !0 }), e;
    }
    _forEachChild(e) {
      Object.keys(this.controls).forEach((r) => {
        let n = this.controls[r];
        n && e(n, r);
      });
    }
    _setUpControls() {
      this._forEachChild((e) => {
        e.setParent(this),
          e._registerOnCollectionChange(this._onCollectionChange);
      });
    }
    _updateValue() {
      this.value = this._reduceValue();
    }
    _anyControls(e) {
      for (let [r, n] of Object.entries(this.controls))
        if (this.contains(r) && e(n)) return !0;
      return !1;
    }
    _reduceValue() {
      let e = {};
      return this._reduceChildren(
        e,
        (r, n, i) => ((n.enabled || this.disabled) && (r[i] = n.value), r)
      );
    }
    _reduceChildren(e, r) {
      let n = e;
      return (
        this._forEachChild((i, o) => {
          n = r(n, i, o);
        }),
        n
      );
    }
    _allControlsDisabled() {
      for (let e of Object.keys(this.controls))
        if (this.controls[e].enabled) return !1;
      return Object.keys(this.controls).length > 0 || this.disabled;
    }
    _find(e) {
      return this.controls.hasOwnProperty(e) ? this.controls[e] : null;
    }
  };
var Lc = new y("CallSetDisabledState", {
    providedIn: "root",
    factory: () => us,
  }),
  us = "always";
function n0(t, e) {
  return [...e.path, t];
}
function Jp(t, e, r = us) {
  Vc(t, e),
    e.valueAccessor.writeValue(t.value),
    (t.disabled || r === "always") &&
      e.valueAccessor.setDisabledState?.(t.disabled),
    i0(t, e),
    s0(t, e),
    o0(t, e),
    r0(t, e);
}
function Xp(t, e, r = !0) {
  let n = () => {};
  e.valueAccessor &&
    (e.valueAccessor.registerOnChange(n), e.valueAccessor.registerOnTouched(n)),
    ss(t, e),
    t &&
      (e._invokeOnDestroyCallbacks(), t._registerOnCollectionChange(() => {}));
}
function os(t, e) {
  t.forEach((r) => {
    r.registerOnValidatorChange && r.registerOnValidatorChange(e);
  });
}
function r0(t, e) {
  if (e.valueAccessor.setDisabledState) {
    let r = (n) => {
      e.valueAccessor.setDisabledState(n);
    };
    t.registerOnDisabledChange(r),
      e._registerOnDestroy(() => {
        t._unregisterOnDisabledChange(r);
      });
  }
}
function Vc(t, e) {
  let r = yg(t);
  e.validator !== null
    ? t.setValidators(Zp(r, e.validator))
    : typeof r == "function" && t.setValidators([r]);
  let n = Dg(t);
  e.asyncValidator !== null
    ? t.setAsyncValidators(Zp(n, e.asyncValidator))
    : typeof n == "function" && t.setAsyncValidators([n]);
  let i = () => t.updateValueAndValidity();
  os(e._rawValidators, i), os(e._rawAsyncValidators, i);
}
function ss(t, e) {
  let r = !1;
  if (t !== null) {
    if (e.validator !== null) {
      let i = yg(t);
      if (Array.isArray(i) && i.length > 0) {
        let o = i.filter((s) => s !== e.validator);
        o.length !== i.length && ((r = !0), t.setValidators(o));
      }
    }
    if (e.asyncValidator !== null) {
      let i = Dg(t);
      if (Array.isArray(i) && i.length > 0) {
        let o = i.filter((s) => s !== e.asyncValidator);
        o.length !== i.length && ((r = !0), t.setAsyncValidators(o));
      }
    }
  }
  let n = () => {};
  return os(e._rawValidators, n), os(e._rawAsyncValidators, n), r;
}
function i0(t, e) {
  e.valueAccessor.registerOnChange((r) => {
    (t._pendingValue = r),
      (t._pendingChange = !0),
      (t._pendingDirty = !0),
      t.updateOn === "change" && Eg(t, e);
  });
}
function o0(t, e) {
  e.valueAccessor.registerOnTouched(() => {
    (t._pendingTouched = !0),
      t.updateOn === "blur" && t._pendingChange && Eg(t, e),
      t.updateOn !== "submit" && t.markAsTouched();
  });
}
function Eg(t, e) {
  t._pendingDirty && t.markAsDirty(),
    t.setValue(t._pendingValue, { emitModelToViewChange: !1 }),
    e.viewToModelUpdate(t._pendingValue),
    (t._pendingChange = !1);
}
function s0(t, e) {
  let r = (n, i) => {
    e.valueAccessor.writeValue(n), i && e.viewToModelUpdate(n);
  };
  t.registerOnChange(r),
    e._registerOnDestroy(() => {
      t._unregisterOnChange(r);
    });
}
function a0(t, e) {
  t == null, Vc(t, e);
}
function u0(t, e) {
  return ss(t, e);
}
function c0(t, e) {
  if (!t.hasOwnProperty("model")) return !1;
  let r = t.model;
  return r.isFirstChange() ? !0 : !Object.is(e, r.currentValue);
}
function l0(t) {
  return Object.getPrototypeOf(t.constructor) === Lb;
}
function d0(t, e) {
  t._syncPendingControls(),
    e.forEach((r) => {
      let n = r.control;
      n.updateOn === "submit" &&
        n._pendingChange &&
        (r.viewToModelUpdate(n._pendingValue), (n._pendingChange = !1));
    });
}
function f0(t, e) {
  if (!e) return null;
  Array.isArray(e);
  let r, n, i;
  return (
    e.forEach((o) => {
      o.constructor === ig ? (r = o) : l0(o) ? (n = o) : (i = o);
    }),
    i || n || r || null
  );
}
function h0(t, e) {
  let r = t.indexOf(e);
  r > -1 && t.splice(r, 1);
}
function eg(t, e) {
  let r = t.indexOf(e);
  r > -1 && t.splice(r, 1);
}
function tg(t) {
  return (
    typeof t == "object" &&
    t !== null &&
    Object.keys(t).length === 2 &&
    "value" in t &&
    "disabled" in t
  );
}
var p0 = class extends is {
  constructor(e = null, r, n) {
    super(wg(r), Cg(n, r)),
      (this.defaultValue = null),
      (this._onChange = []),
      (this._pendingChange = !1),
      this._applyFormState(e),
      this._setUpdateStrategy(r),
      this._initObservables(),
      this.updateValueAndValidity({
        onlySelf: !0,
        emitEvent: !!this.asyncValidator,
      }),
      as(r) &&
        (r.nonNullable || r.initialValueIsDefault) &&
        (tg(e) ? (this.defaultValue = e.value) : (this.defaultValue = e));
  }
  setValue(e, r = {}) {
    (this.value = this._pendingValue = e),
      this._onChange.length &&
        r.emitModelToViewChange !== !1 &&
        this._onChange.forEach((n) =>
          n(this.value, r.emitViewToModelChange !== !1)
        ),
      this.updateValueAndValidity(r);
  }
  patchValue(e, r = {}) {
    this.setValue(e, r);
  }
  reset(e = this.defaultValue, r = {}) {
    this._applyFormState(e),
      this.markAsPristine(r),
      this.markAsUntouched(r),
      this.setValue(this.value, r),
      (this._pendingChange = !1);
  }
  _updateValue() {}
  _anyControls(e) {
    return !1;
  }
  _allControlsDisabled() {
    return this.disabled;
  }
  registerOnChange(e) {
    this._onChange.push(e);
  }
  _unregisterOnChange(e) {
    eg(this._onChange, e);
  }
  registerOnDisabledChange(e) {
    this._onDisabledChange.push(e);
  }
  _unregisterOnDisabledChange(e) {
    eg(this._onDisabledChange, e);
  }
  _forEachChild(e) {}
  _syncPendingControls() {
    return this.updateOn === "submit" &&
      (this._pendingDirty && this.markAsDirty(),
      this._pendingTouched && this.markAsTouched(),
      this._pendingChange)
      ? (this.setValue(this._pendingValue, {
          onlySelf: !0,
          emitModelToViewChange: !1,
        }),
        !0)
      : !1;
  }
  _applyFormState(e) {
    tg(e)
      ? ((this.value = this._pendingValue = e.value),
        e.disabled
          ? this.disable({ onlySelf: !0, emitEvent: !1 })
          : this.enable({ onlySelf: !0, emitEvent: !1 }))
      : (this.value = this._pendingValue = e);
  }
};
var g0 = (t) => t instanceof p0;
var TO = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵdir = ye({
      type: e,
      selectors: [["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""]],
      hostAttrs: ["novalidate", ""],
    }));
  let t = e;
  return t;
})();
var Ig = new y("");
var m0 = { provide: Un, useExisting: wn(() => v0) },
  v0 = (() => {
    let e = class e extends Un {
      constructor(n, i, o) {
        super(),
          (this.callSetDisabledState = o),
          (this.submitted = !1),
          (this._onCollectionChange = () => this._updateDomValue()),
          (this.directives = []),
          (this.form = null),
          (this.ngSubmit = new W()),
          this._setValidators(n),
          this._setAsyncValidators(i);
      }
      ngOnChanges(n) {
        this._checkFormPresent(),
          n.hasOwnProperty("form") &&
            (this._updateValidators(),
            this._updateDomValue(),
            this._updateRegistrations(),
            (this._oldForm = this.form));
      }
      ngOnDestroy() {
        this.form &&
          (ss(this.form, this),
          this.form._onCollectionChange === this._onCollectionChange &&
            this.form._registerOnCollectionChange(() => {}));
      }
      get formDirective() {
        return this;
      }
      get control() {
        return this.form;
      }
      get path() {
        return [];
      }
      addControl(n) {
        let i = this.form.get(n.path);
        return (
          Jp(i, n, this.callSetDisabledState),
          i.updateValueAndValidity({ emitEvent: !1 }),
          this.directives.push(n),
          i
        );
      }
      getControl(n) {
        return this.form.get(n.path);
      }
      removeControl(n) {
        Xp(n.control || null, n, !1), h0(this.directives, n);
      }
      addFormGroup(n) {
        this._setUpFormContainer(n);
      }
      removeFormGroup(n) {
        this._cleanUpFormContainer(n);
      }
      getFormGroup(n) {
        return this.form.get(n.path);
      }
      addFormArray(n) {
        this._setUpFormContainer(n);
      }
      removeFormArray(n) {
        this._cleanUpFormContainer(n);
      }
      getFormArray(n) {
        return this.form.get(n.path);
      }
      updateModel(n, i) {
        this.form.get(n.path).setValue(i);
      }
      onSubmit(n) {
        return (
          (this.submitted = !0),
          d0(this.form, this.directives),
          this.ngSubmit.emit(n),
          n?.target?.method === "dialog"
        );
      }
      onReset() {
        this.resetForm();
      }
      resetForm(n = void 0) {
        this.form.reset(n), (this.submitted = !1);
      }
      _updateDomValue() {
        this.directives.forEach((n) => {
          let i = n.control,
            o = this.form.get(n.path);
          i !== o &&
            (Xp(i || null, n),
            g0(o) && (Jp(o, n, this.callSetDisabledState), (n.control = o)));
        }),
          this.form._updateTreeValidity({ emitEvent: !1 });
      }
      _setUpFormContainer(n) {
        let i = this.form.get(n.path);
        a0(i, n), i.updateValueAndValidity({ emitEvent: !1 });
      }
      _cleanUpFormContainer(n) {
        if (this.form) {
          let i = this.form.get(n.path);
          i && u0(i, n) && i.updateValueAndValidity({ emitEvent: !1 });
        }
      }
      _updateRegistrations() {
        this.form._registerOnCollectionChange(this._onCollectionChange),
          this._oldForm && this._oldForm._registerOnCollectionChange(() => {});
      }
      _updateValidators() {
        Vc(this.form, this), this._oldForm && ss(this._oldForm, this);
      }
      _checkFormPresent() {
        this.form;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(B(sg, 10), B(ag, 10), B(Lc, 8));
    }),
      (e.ɵdir = ye({
        type: e,
        selectors: [["", "formGroup", ""]],
        hostBindings: function (i, o) {
          i & 1 &&
            hr("submit", function (a) {
              return o.onSubmit(a);
            })("reset", function () {
              return o.onReset();
            });
        },
        inputs: { form: [ge.None, "formGroup", "form"] },
        outputs: { ngSubmit: "ngSubmit" },
        exportAs: ["ngForm"],
        features: [yo([m0]), mt, Ut],
      }));
    let t = e;
    return t;
  })();
var y0 = { provide: Gr, useExisting: wn(() => D0) },
  D0 = (() => {
    let e = class e extends Gr {
      set isDisabled(n) {}
      constructor(n, i, o, s, a) {
        super(),
          (this._ngModelWarningConfig = a),
          (this._added = !1),
          (this.name = null),
          (this.update = new W()),
          (this._ngModelWarningSent = !1),
          (this._parent = n),
          this._setValidators(i),
          this._setAsyncValidators(o),
          (this.valueAccessor = f0(this, s));
      }
      ngOnChanges(n) {
        this._added || this._setUpControl(),
          c0(n, this.viewModel) &&
            ((this.viewModel = this.model),
            this.formDirective.updateModel(this, this.model));
      }
      ngOnDestroy() {
        this.formDirective && this.formDirective.removeControl(this);
      }
      viewToModelUpdate(n) {
        (this.viewModel = n), this.update.emit(n);
      }
      get path() {
        return n0(
          this.name == null ? this.name : this.name.toString(),
          this._parent
        );
      }
      get formDirective() {
        return this._parent ? this._parent.formDirective : null;
      }
      _checkParentType() {}
      _setUpControl() {
        this._checkParentType(),
          (this.control = this.formDirective.addControl(this)),
          (this._added = !0);
      }
    };
    (e._ngModelWarningSentOnce = !1),
      (e.ɵfac = function (i) {
        return new (i || e)(
          B(Un, 13),
          B(sg, 10),
          B(ag, 10),
          B(rg, 10),
          B(Ig, 8)
        );
      }),
      (e.ɵdir = ye({
        type: e,
        selectors: [["", "formControlName", ""]],
        inputs: {
          name: [ge.None, "formControlName", "name"],
          isDisabled: [ge.None, "disabled", "isDisabled"],
          model: [ge.None, "ngModel", "model"],
        },
        outputs: { update: "ngModelChange" },
        features: [yo([y0]), mt, Ut],
      }));
    let t = e;
    return t;
  })();
var bg = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = ve({ type: e })),
    (e.ɵinj = me({}));
  let t = e;
  return t;
})();
var AO = (() => {
    let e = class e {
      static withConfig(n) {
        return {
          ngModule: e,
          providers: [{ provide: Lc, useValue: n.callSetDisabledState ?? us }],
        };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = ve({ type: e })),
      (e.ɵinj = me({ imports: [bg] }));
    let t = e;
    return t;
  })(),
  xO = (() => {
    let e = class e {
      static withConfig(n) {
        return {
          ngModule: e,
          providers: [
            {
              provide: Ig,
              useValue: n.warnOnNgModelWithFormControl ?? "always",
            },
            { provide: Lc, useValue: n.callSetDisabledState ?? us },
          ],
        };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = ve({ type: e })),
      (e.ɵinj = me({ imports: [bg] }));
    let t = e;
    return t;
  })();
export {
  g as a,
  G as b,
  O as c,
  re as d,
  K as e,
  Es as f,
  E as g,
  _ as h,
  Gn as i,
  ot as j,
  nm as k,
  rm as l,
  Ie as m,
  im as n,
  sm as o,
  As as p,
  ce as q,
  wi as r,
  w as s,
  me as t,
  y as u,
  D as v,
  p as w,
  ge as x,
  Dd as y,
  ve as z,
  ye as A,
  Zs as B,
  wN as C,
  CN as D,
  cr as E,
  Pe as F,
  Ge as G,
  EN as H,
  ru as I,
  IN as J,
  fo as K,
  We as L,
  bN as M,
  B as N,
  Mn as O,
  W as P,
  V as Q,
  mt as R,
  ch as S,
  vw as T,
  Du as U,
  _w as V,
  vo as W,
  hh as X,
  ph as Y,
  wu as Z,
  SN as _,
  hr as $,
  TN as aa,
  AN as ba,
  xN as ca,
  zw as da,
  tC as ea,
  RN as fa,
  nC as ga,
  rC as ha,
  ON as ia,
  sC as ja,
  yo as ka,
  wh as la,
  FN as ma,
  PN as na,
  Ht as oa,
  Su as pa,
  te as qa,
  oR as ra,
  sR as sa,
  aR as ta,
  jh as ua,
  BC as va,
  JC as wa,
  tE as xa,
  CR as ya,
  UR as za,
  $R as Aa,
  lI as Ba,
  Zt as Ca,
  sO as Da,
  ig as Ea,
  qp as Fa,
  MO as Ga,
  _O as Ha,
  Kp as Ia,
  p0 as Ja,
  TO as Ka,
  v0 as La,
  D0 as Ma,
  AO as Na,
  xO as Oa,
};

import { a as G } from "./chunk-4XG3MODK.js";
import { a as J, b as Q } from "./chunk-7HPVQ27L.js";
import {
  $ as f,
  Aa as U,
  B as _,
  Ba as $,
  Ca as K,
  Da as M,
  F as b,
  K as w,
  M as Z,
  O as A,
  Q as B,
  X as u,
  Y as l,
  Z as E,
  f as j,
  h as O,
  ia as d,
  ja as z,
  k,
  oa as L,
  q as V,
  s as N,
  t as m,
  ua as X,
  v as P,
  w as C,
  xa as H,
  y,
  ya as Y,
  z as p,
  za as q,
} from "./chunk-PHIXIHEI.js";
var ct = [
    {
      path: "",
      loadChildren: () =>
        import("./chunk-5OK337RR.js").then((e) => e.PagesModule),
    },
    {
      path: "auth",
      loadChildren: () =>
        import("./chunk-V23MGGY4.js").then((e) => e.AuthModule),
    },
    {
      path: "**",
      loadChildren: () =>
        import("./chunk-5OK337RR.js").then((e) => e.PagesModule),
    },
  ],
  W = (() => {
    let t = class t {};
    (t.ɵfac = function (o) {
      return new (o || t)();
    }),
      (t.ɵmod = p({ type: t })),
      (t.ɵinj = m({ imports: [M.forRoot(ct), M] }));
    let e = t;
    return e;
  })();
var I = (() => {
  let t = class t {
    constructor() {
      this.title = "Default";
    }
    clickMyBtn() {
      console.log("CLICK ON MY BUTTON");
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵcmp = y({
      type: t,
      selectors: [["my-button"]],
      inputs: { title: "title" },
      decls: 2,
      vars: 1,
      consts: [[1, "btn", 3, "click"]],
      template: function (o, s) {
        o & 1 &&
          (u(0, "button", 0),
          f("click", function () {
            return s.clickMyBtn();
          }),
          d(1),
          l()),
          o & 2 && (Z(), z(" ", s.title, ""));
      },
      styles: [
        ".btn[_ngcontent-%COMP%]{font-family:Roboto,sans-serif;font-weight:0;font-size:14px;color:#fff;background:linear-gradient(90deg,#06c,#c500cc);padding:10px 30px;border:2px solid #0066cc;box-shadow:#000 0 0;border-radius:50px;transition:1s;transform:translateY(0);display:flex;flex-direction:row;align-items:center;cursor:pointer;margin:1rem}.btn[_ngcontent-%COMP%]:hover{transition:1s;padding:10px 50px;transform:translateY(0);background:linear-gradient(90deg,#06c,#c500cc);color:#06c;border:solid 2px #0066cc}",
      ],
    }));
  let e = t;
  return e;
})();
var tt = (() => {
  let t = class t {
    constructor() {
      (this.teaService = C(G)),
        (this.teaSelected = {
          name: "no tea selected",
          id: -1,
          description: "none",
        }),
        (this.userService = C(J)),
        (this.userLogin = { name: "Not logged", email: "", password: "" }),
        (this.title = "tea-minder"),
        (this.route = C(K)),
        this.teaService.teaSelected$.subscribe({
          next: (n) => {
            console.log("APP_COMPONENT TEA_SELECTED =>", n),
              (this.teaSelected = n);
          },
        });
    }
    goToNavigate(n) {
      this.route.navigateByUrl(n);
    }
    ngOnInit() {
      this.userService.user$.subscribe({
        next: (n) => {
          console.log(n), (this.userLogin = n);
        },
      });
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵcmp = y({
      type: t,
      selectors: [["app-root"]],
      decls: 9,
      vars: 0,
      consts: [[3, "click"]],
      template: function (o, s) {
        o & 1 &&
          (u(0, "button", 0),
          f("click", function () {
            return s.goToNavigate("/auth/login");
          }),
          d(1, "Login"),
          l(),
          u(2, "button", 0),
          f("click", function () {
            return s.goToNavigate("/auth/register");
          }),
          d(3, "Register"),
          l(),
          E(4, "br"),
          u(5, "div"),
          E(6, "router-outlet"),
          l(),
          u(7, "div"),
          E(8, "my-button"),
          l());
      },
      dependencies: [$, I],
      styles: [
        "a[_ngcontent-%COMP%]{margin:12px}.router-link-active[_ngcontent-%COMP%]{background-color:red}",
      ],
    }));
  let e = t;
  return e;
})();
var et = (() => {
  let t = class t {
    intercept(n, o) {
      let s = "TOKEN XXXXXXX",
        r = n;
      return (
        s && (r = n.clone({ setHeaders: { authorization: "Bearer " + s } })),
        console.log(r),
        o.handle(r)
      );
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵprov = N({ token: t, factory: t.ɵfac }));
  let e = t;
  return e;
})();
var nt = (() => {
  let t = class t {};
  (t.ɵfac = function (o) {
    return new (o || t)();
  }),
    (t.ɵmod = p({ type: t })),
    (t.ɵinj = m({ imports: [X] }));
  let e = t;
  return e;
})();
var v = {
  schedule(e, t) {
    let i = setTimeout(e, t);
    return () => clearTimeout(i);
  },
  scheduleBeforeRender(e) {
    if (typeof window > "u") return v.schedule(e, 0);
    if (typeof window.requestAnimationFrame > "u") return v.schedule(e, 16);
    let t = window.requestAnimationFrame(e);
    return () => window.cancelAnimationFrame(t);
  },
};
function ut(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function lt(e) {
  return !!e && e.nodeType === Node.ELEMENT_NODE;
}
function ht(e) {
  return typeof e == "function";
}
var S;
function mt(e, t) {
  if (!S) {
    let i = Element.prototype;
    S =
      i.matches ||
      i.matchesSelector ||
      i.mozMatchesSelector ||
      i.msMatchesSelector ||
      i.oMatchesSelector ||
      i.webkitMatchesSelector;
  }
  return e.nodeType === Node.ELEMENT_NODE ? S.call(e, t) : !1;
}
function pt(e, t) {
  return e === t || (e !== e && t !== t);
}
function ft(e) {
  let t = {};
  return (
    e.forEach(({ propName: i, templateName: n, transform: o }) => {
      t[ut(n)] = [i, o];
    }),
    t
  );
}
function dt(e, t) {
  return t.get(w).resolveComponentFactory(e).inputs;
}
function gt(e, t) {
  let i = e.childNodes,
    n = t.map(() => []),
    o = -1;
  t.some((s, r) => (s === "*" ? ((o = r), !0) : !1));
  for (let s = 0, r = i.length; s < r; ++s) {
    let h = i[s],
      c = Ct(h, t, o);
    c !== -1 && n[c].push(h);
  }
  return n;
}
function Ct(e, t, i) {
  let n = i;
  return (
    lt(e) && t.some((o, s) => (o !== "*" && mt(e, o) ? ((n = s), !0) : !1)), n
  );
}
var yt = 10,
  F = class {
    constructor(t, i) {
      this.componentFactory = i.get(w).resolveComponentFactory(t);
    }
    create(t) {
      return new T(this.componentFactory, t);
    }
  },
  T = class {
    constructor(t, i) {
      (this.componentFactory = t),
        (this.injector = i),
        (this.eventEmitters = new j(1)),
        (this.events = this.eventEmitters.pipe(V((n) => k(...n)))),
        (this.componentRef = null),
        (this.viewChangeDetectorRef = null),
        (this.inputChanges = null),
        (this.hasInputChanges = !1),
        (this.implementsOnChanges = !1),
        (this.scheduledChangeDetectionFn = null),
        (this.scheduledDestroyFn = null),
        (this.initialInputValues = new Map()),
        (this.unchangedInputs = new Set(
          this.componentFactory.inputs.map(({ propName: n }) => n)
        )),
        (this.ngZone = this.injector.get(B)),
        (this.elementZone =
          typeof Zone > "u" ? null : this.ngZone.run(() => Zone.current));
    }
    connect(t) {
      this.runInZone(() => {
        if (this.scheduledDestroyFn !== null) {
          this.scheduledDestroyFn(), (this.scheduledDestroyFn = null);
          return;
        }
        this.componentRef === null && this.initializeComponent(t);
      });
    }
    disconnect() {
      this.runInZone(() => {
        this.componentRef === null ||
          this.scheduledDestroyFn !== null ||
          (this.scheduledDestroyFn = v.schedule(() => {
            this.componentRef !== null &&
              (this.componentRef.destroy(),
              (this.componentRef = null),
              (this.viewChangeDetectorRef = null));
          }, yt));
      });
    }
    getInputValue(t) {
      return this.runInZone(() =>
        this.componentRef === null
          ? this.initialInputValues.get(t)
          : this.componentRef.instance[t]
      );
    }
    setInputValue(t, i, n) {
      this.runInZone(() => {
        if (
          (n && (i = n.call(this.componentRef?.instance, i)),
          this.componentRef === null)
        ) {
          this.initialInputValues.set(t, i);
          return;
        }
        (pt(i, this.getInputValue(t)) &&
          !(i === void 0 && this.unchangedInputs.has(t))) ||
          (this.recordInputChange(t, i),
          this.unchangedInputs.delete(t),
          (this.hasInputChanges = !0),
          (this.componentRef.instance[t] = i),
          this.scheduleDetectChanges());
      });
    }
    initializeComponent(t) {
      let i = b.create({ providers: [], parent: this.injector }),
        n = gt(t, this.componentFactory.ngContentSelectors);
      (this.componentRef = this.componentFactory.create(i, n, t)),
        (this.viewChangeDetectorRef = this.componentRef.injector.get(A)),
        (this.implementsOnChanges = ht(this.componentRef.instance.ngOnChanges)),
        this.initializeInputs(),
        this.initializeOutputs(this.componentRef),
        this.detectChanges(),
        this.injector.get(L).attachView(this.componentRef.hostView);
    }
    initializeInputs() {
      this.componentFactory.inputs.forEach(({ propName: t, transform: i }) => {
        this.initialInputValues.has(t) &&
          this.setInputValue(t, this.initialInputValues.get(t), i);
      }),
        this.initialInputValues.clear();
    }
    initializeOutputs(t) {
      let i = this.componentFactory.outputs.map(
        ({ propName: n, templateName: o }) =>
          t.instance[n].pipe(O((r) => ({ name: o, value: r })))
      );
      this.eventEmitters.next(i);
    }
    callNgOnChanges(t) {
      if (!this.implementsOnChanges || this.inputChanges === null) return;
      let i = this.inputChanges;
      (this.inputChanges = null), t.instance.ngOnChanges(i);
    }
    markViewForCheck(t) {
      this.hasInputChanges && ((this.hasInputChanges = !1), t.markForCheck());
    }
    scheduleDetectChanges() {
      this.scheduledChangeDetectionFn ||
        (this.scheduledChangeDetectionFn = v.scheduleBeforeRender(() => {
          (this.scheduledChangeDetectionFn = null), this.detectChanges();
        }));
    }
    recordInputChange(t, i) {
      if (!this.implementsOnChanges) return;
      this.inputChanges === null && (this.inputChanges = {});
      let n = this.inputChanges[t];
      if (n) {
        n.currentValue = i;
        return;
      }
      let o = this.unchangedInputs.has(t),
        s = o ? void 0 : this.getInputValue(t);
      this.inputChanges[t] = new _(s, i, o);
    }
    detectChanges() {
      this.componentRef !== null &&
        (this.callNgOnChanges(this.componentRef),
        this.markViewForCheck(this.viewChangeDetectorRef),
        this.componentRef.changeDetectorRef.detectChanges());
    }
    runInZone(t) {
      return this.elementZone && Zone.current !== this.elementZone
        ? this.ngZone.run(t)
        : t();
    }
  },
  x = class extends HTMLElement {
    constructor() {
      super(...arguments), (this.ngElementEventsSubscription = null);
    }
  };
function it(e, t) {
  let i = dt(e, t.injector),
    n = t.strategyFactory || new F(e, t.injector),
    o = ft(i),
    r = class r extends x {
      get ngElementStrategy() {
        if (!this._ngElementStrategy) {
          let c = (this._ngElementStrategy = n.create(
            this.injector || t.injector
          ));
          i.forEach(({ propName: a, transform: R }) => {
            if (!this.hasOwnProperty(a)) return;
            let D = this[a];
            delete this[a], c.setInputValue(a, D, R);
          });
        }
        return this._ngElementStrategy;
      }
      constructor(c) {
        super(), (this.injector = c);
      }
      attributeChangedCallback(c, a, R, D) {
        let [st, rt] = o[c];
        this.ngElementStrategy.setInputValue(st, R, rt);
      }
      connectedCallback() {
        let c = !1;
        this.ngElementStrategy.events && (this.subscribeToEvents(), (c = !0)),
          this.ngElementStrategy.connect(this),
          c || this.subscribeToEvents();
      }
      disconnectedCallback() {
        this._ngElementStrategy && this._ngElementStrategy.disconnect(),
          this.ngElementEventsSubscription &&
            (this.ngElementEventsSubscription.unsubscribe(),
            (this.ngElementEventsSubscription = null));
      }
      subscribeToEvents() {
        this.ngElementEventsSubscription =
          this.ngElementStrategy.events.subscribe((c) => {
            let a = new CustomEvent(c.name, { detail: c.value });
            this.dispatchEvent(a);
          });
      }
    };
  r.observedAttributes = Object.keys(o);
  let s = r;
  return (
    i.forEach(({ propName: h, transform: c }) => {
      Object.defineProperty(s.prototype, h, {
        get() {
          return this.ngElementStrategy.getInputValue(h);
        },
        set(a) {
          this.ngElementStrategy.setInputValue(h, a, c);
        },
        configurable: !0,
        enumerable: !0,
      });
    }),
    s
  );
}
var ot = (() => {
  let t = class t {
    constructor(n) {
      this.injector = n;
    }
    ngDoBootstrap(n) {
      let o = it(I, { injector: this.injector });
      customElements.define("my-button", o);
    }
  };
  (t.ɵfac = function (o) {
    return new (o || t)(P(b));
  }),
    (t.ɵmod = p({ type: t, bootstrap: [tt] })),
    (t.ɵinj = m({
      providers: [{ provide: H, useClass: et, multi: !0 }],
      imports: [U, W, Q, Y, nt],
    }));
  let e = t;
  return e;
})();
q()
  .bootstrapModule(ot)
  .catch((e) => console.error(e));

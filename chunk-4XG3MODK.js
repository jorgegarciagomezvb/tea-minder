import { e as r, g as a, n as s, s as n } from "./chunk-PHIXIHEI.js";
var o = [
  { id: 0, name: "black", description: "lorem ipsum dolor sit amet" },
  { id: 1, name: "green", description: "lorem ipsum dolor sit amet" },
  { id: 2, name: "white lotus", description: "lorem ipsum dolor sit amet" },
  { id: 3, name: "appa blend", description: "lorem ipsum dolor sit amet" },
];
var u = (() => {
  let e = class e {
    constructor() {
      (this._teaSelected = new r(o[2])),
        (this.teaSelected$ = this._teaSelected.asObservable());
    }
    getAllTeas() {
      return a(o).pipe(s(100));
    }
    setTea(i) {
      this._teaSelected.next(i);
    }
  };
  (e.ɵfac = function (m) {
    return new (m || e)();
  }),
    (e.ɵprov = n({ token: e, factory: e.ɵfac, providedIn: "root" }));
  let t = e;
  return t;
})();
export { u as a };

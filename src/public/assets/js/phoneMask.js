/*
 * Máscara de teléfono con libertad de escritura + restricciones.
 * - Prefijo fijo del país (ej. "+34 ").
 * - Cantidad máxima de dígitos según el país (regla de cantidad).
 * - El cursor siempre va al final: escribes en orden sin importar dónde hagas clic.
 * La base "db" define, por país, el patrón: prefijo + n (cada n = 1 dígito), "?" marca dígitos opcionales.
 */
if (typeof adc !== 'object') var adc = {};

!function () {
adc.phone = {
  setting: {
    phone: '[name="phone"]',
    country: 'select#country_code_selector',
    ccDef: ''
  },
  db: {
    ac: '+247nnnn',
    ad: '+376nnnnnn',
    ae: '+971nnnnnnnn',
    af: '+93nnnnnnnnn',
    ag: '+1268nnnnnnn',
    ai: '+1264nnnnnnn',
    al: '+355nnnnnnnnn',
    am: '+374nnnnnnnn',
    an: '+599nnnnnnn?n,',
    ao: '+244nnnnnnnnn',
    aq: '+6721nnnnn',
    ar: '+54nnnnnnnnnn',
    as: '+1684nnnnnnn',
    at: '+43nnnnnnnnnn',
    au: '+61nnnnnnnnn',
    aw: '+297nnnnnnn',
    az: '+994nnnnnnnnn',
    ba: '+387nnnnnn?n',
    bb: '+1246nnnnnnn',
    bd: '+880nnnnnnnn',
    be: '+32nnnnnnnnn',
    bf: '+226nnnnnnnn',
    bg: '+359nnnnnnnnn',
    bh: '+973nnnnnnnn',
    bi: '+257nnnnnnnn',
    bj: '+229nnnnnnnn',
    bm: '+1441nnnnnnn',
    bn: '+673nnnnnnn',
    bo: '+591nnnnnnnn',
    br: '+55nnnnnnnnnn',
    bs: '+1242nnnnnnn',
    bt: '+975nnnnnnn?n',
    bw: '+267nnnnnnnn',
    by: '+375nnnnnnnnn',
    bz: '+501nnnnnnn',
    ca: '+1nnnnnnnnnn',
    cd: '+243nnnnnnnnn',
    cf: '+236nnnnnnnn',
    cg: '+242nnnnnnnnn',
    ch: '+41nnnnnnnnn',
    ci: '+225nnnnnnnn',
    ck: '+682nnnnn',
    cl: '+56nnnnnnnnn',
    cm: '+237nnnnnnnn',
    cn: '+86nnnnnnnn?nnnn',
    co: '+57nnnnnnnnnn',
    cr: '+506nnnnnnnn',
    cu: '+53nnnnnnnn',
    cv: '+238nnnnnnn',
    cw: '+599nnnnnnn',
    cy: '+357nnnnnnnn',
    cz: '+420nnnnnnnnn',
    de: '+49nnnnnn?nnnnn',
    dj: '+253nnnnnnnn',
    dk: '+45nnnnnnnn',
    dm: '+1767nnnnnnn',
    do: '+18nnnnnnnnn',
    dz: '+213nnnnnnnnn',
    ec: '+593nnnnnnnn?n',
    ee: '+372nnnnnnn?n',
    eg: '+20nnnnnnnnnn',
    er: '+291nnnnnnn',
    es: '+34nnnnnnnnn',
    et: '+251nnnnnnnnn',
    fi: '+358nnnnnnnnnn',
    fj: '+679nnnnnnn',
    fk: '+500nnnnn',
    fm: '+691nnnnnnn',
    fo: '+298nnnnnn',
    fr: '+33nnnnnnnnn',
    ga: '+241nnnnnnn',
    gb: '+44nnnnnnnnnn',
    gd: '+1473nnnnnnn',
    ge: '+995nnnnnnnnn',
    gf: '+594nnnnnnnnn',
    gh: '+233nnnnnnnnn',
    gi: '+350nnnnnnnn',
    gl: '+299nnnnnn',
    gm: '+220nnnnnnn',
    gn: '+224nnnnnnnn',
    gp: '+590nnnnnnnnn',
    gq: '+240nnnnnnnnn',
    gr: '+30nnnnnnnnnn',
    gt: '+502nnnnnnnn',
    gu: '+1671nnnnnnn',
    gw: '+245nnnnnnn',
    gy: '+592nnnnnnn',
    hk: '+852nnnnnnnn',
    hn: '+504nnnnnnnn',
    hr: '+385nnnnnnnn?nn',
    ht: '+509nnnnnnnn',
    hu: '+36nnnnnnnnn',
    id: '+62nnnnnnn?nnnn',
    ie: '+353nnnnnnnnn',
    il: '+972nnnnnnnn?n',
    in: '+91nnnnnnnnnn',
    io: '+246nnnnnnn',
    iq: '+964nnnnnnnnnn',
    ir: '+98nnnnnnnnnn',
    is: '+354nnnnnnn',
    it: '+39nnnnnnnnnn',
    je: '+441534nnnnnnn',
    jm: '+1876nnnnnnn',
    jo: '+962nnnnnnnnn',
    jp: '+81nnnnnnnnn?n',
    ke: '+254nnnnnnnnn',
    kg: '+996nnnnnnnnn',
    kh: '+855nnnnnnnn',
    ki: '+686nnnnn',
    km: '+269nnnnnnn',
    kn: '+1869nnnnnnn',
    kp: '+850nnnnnn?nnnnnnnnnnn',
    kr: '+82nnnnnnnnn',
    kw: '+965nnnnnnnn',
    ky: '+1345nnnnnnn',
    kz: '+7nnnnnnnnnn',
    la: '+856nnnnnnnn?nn',
    lb: '+961nnnnnnnn',
    lc: '+1758nnnnnnn',
    li: '+423nnnnnnnnnn',
    lk: '+94nnnnnnnnn',
    lr: '+231nnnnnnnn',
    ls: '+266nnnnnnnn',
    lt: '+370nnnnnnnn',
    lu: '+352nnnnnnnnn',
    lv: '+371nnnnnnnn',
    ly: '+218nnnnnnnn?n',
    ma: '+212nnnnnnnnn',
    mc: '+377nnnnnnnn?n',
    md: '+373nnnnnnnn',
    me: '+382nnnnnnnn',
    mg: '+261nnnnnnnnn',
    mh: '+692nnnnnnn',
    mk: '+389nnnnnnnn',
    ml: '+223nnnnnnnn',
    mm: '+95nnnnnn?nn',
    mn: '+976nnnnnnnn',
    mo: '+853nnnnnnnn',
    mp: '+1670nnnnnnn',
    mq: '+596nnnnnnnnn',
    mr: '+222nnnnnnnn',
    ms: '+1664nnnnnnn',
    mt: '+356nnnnnnnn',
    mu: '+230nnnnnnn',
    mv: '+960nnnnnnn',
    mw: '+265nnnnnnn?nn',
    mx: '+52nnnnnnnnnn',
    my: '+60nnnnnnn?nn',
    mz: '+258nnnnnnnn',
    na: '+264nnnnnnnnn',
    nc: '+687nnnnnn',
    ne: '+227nnnnnnnn',
    nf: '+6723nnnnn',
    ng: '+234nnnnnnn?nnn',
    ni: '+505nnnnnnnn',
    nl: '+31nnnnnnnnn',
    no: '+47nnnnnnnn',
    np: '+977nnnnnnnn',
    nr: '+674nnnnnnn',
    nu: '+683nnnn',
    nz: '+64nnnnnnnn?nn',
    om: '+968nnnnnnnn',
    pa: '+507nnnnnnn?n',
    pe: '+51nnnnnnnn?n',
    pf: '+689nnnnnn',
    pg: '+675nnnnnnnn',
    ph: '+63nnnnnnnnnn',
    pk: '+92nnnnnnnnnn',
    pl: '+48nnnnnnnnn',
    pm: '+508nnnnnn',
    ps: '+970nnnnnnnnn',
    pt: '+351nnnnnnnnn',
    pw: '+680nnnnnnn',
    py: '+595nnnnnnnnn',
    qa: '+974nnnnnnnn',
    re: '+262nnnnnnnnn',
    ro: '+40nnnnnnnnn',
    rs: '+381nnnnnnnnn',
    ru: '+7nnnnnnnnnn',
    rw: '+250nnnnnnnnn',
    sa: '+966nnnnnnnn?n',
    sb: '+677nnnnn?nn',
    sc: '+248nnnnnnn',
    sd: '+249nnnnnnnnn',
    se: '+46nnnnnnnnn',
    sg: '+65nnnnnnnn',
    sh: '+290nnnn',
    si: '+386nnnnnnnn',
    sk: '+421nnnnnnnnn',
    sl: '+232nnnnnnnn',
    sm: '+378nnnnnnnnnn',
    sn: '+221nnnnnnnnn',
    so: '+252nnnnnnn?n',
    sr: '+597nnnnnn?n',
    ss: '+211nnnnnnnnn',
    st: '+239nnnnnnn',
    sv: '+503nnnnnnnn',
    sx: '+1721nnnnnnn',
    sy: '+963nnnnnnnnn',
    sz: '+268nnnnnnnn',
    tc: '+1649nnnnnnn',
    td: '+235nnnnnnnn',
    tg: '+228nnnnnnnn',
    th: '+66nnnnnnnn?n',
    tj: '+992nnnnnnnnn',
    tk: '+690nnnn',
    tl: '+670nnnnnnn?n',
    tm: '+993nnnnnnnn',
    tn: '+216nnnnnnnn',
    to: '+676nnnnn',
    tr: '+905nnnnnnnnn',
    tt: '+1868nnnnnnn',
    tv: '+688nnnnn?n',
    tw: '+886nnnnnnnn?n',
    tz: '+255nnnnnnnnn',
    ua: '+380nnnnnnnnn',
    ug: '+256nnnnnnnnn',
    us: '+1nnnnnnnnnn',
    uy: '+598nnnnnnnn',
    uz: '+998nnnnnnnnn',
    va: '+3906698nnnnn',
    vc: '+1784nnnnnnn',
    ve: '+58nnnnnnnnnn',
    vg: '+1284nnnnnnn',
    vi: '+1340nnnnnnn',
    vn: '+84nnnnnnnnn?n',
    vu: '+678nnnnn?nn',
    wf: '+681nnnnnn',
    ws: '+685nnnnnn',
    ye: '+967nnnnnnn?nn',
    yt: '+262nnnnnnnnn',
    xk: '+383nnnnnnn?nnn',
    za: '+27nnnnnnnnn',
    zm: '+260nnnnnnnnn',
    zw: '+263nnnnnnn'
  },

  cc: '',
  cur: null,          // { prefix: '+34', prefixDigits: '34', min: 9, max: 9 }
  displayPrefix: '',  // ej. '+34 '

  onlyDigits: function (s) {
    return (s || '').replace(/\D/g, '');
  },

  // Convierte un patrón como '+387nnnnnn?n' en { prefix, prefixDigits, min, max }.
  parsePattern: function (pattern) {
    var i = pattern.indexOf('n');
    if (i < 0) return null;
    var prefix = pattern.slice(0, i);            // '+34'
    var rest = pattern.slice(i);                 // 'nnnnnnnnn' o 'nnnnnn?n'
    var min = 0, max = 0, opt = false;
    for (var k = 0; k < rest.length; k++) {
      var ch = rest[k];
      if (ch === 'n') { max++; if (!opt) min++; }
      else if (ch === '?') { opt = true; }
    }
    return {
      prefix: prefix,
      prefixDigits: this.onlyDigits(prefix),
      min: min,
      max: max
    };
  },

  // Devuelve solo los dígitos que escribe el usuario, sin el prefijo y limitados al máximo.
  getUserPart: function (value) {
    var digits = this.onlyDigits(value);
    var pfx = this.cur.prefixDigits;
    if (digits.indexOf(pfx) === 0) {
      digits = digits.slice(pfx.length);
    }
    if (digits.length > this.cur.max) {
      digits = digits.slice(0, this.cur.max);
    }
    return digits;
  },

  build: function (value) {
    return this.displayPrefix + this.getUserPart(value);
  },

  moveCaretEnd: function (el) {
    try {
      var len = el.value.length;
      el.setSelectionRange(len, len);
    } catch (e) {}
  },

  applyCountry: function () {
    var pattern = this.db[this.cc];
    this.cur = pattern ? this.parsePattern(pattern) : null;
    this.displayPrefix = this.cur ? (this.cur.prefix + ' ') : '';
    var _t = this;
    this.inputs.forEach(function (el) {
      // Si el campo está vacío, se deja vacío para que se vea el placeholder.
      // El prefijo se agrega al enfocar (evento focus). Solo re-formatea si ya hay número.
      var digits = _t.onlyDigits(el.value);
      if (!el.value || digits.length === 0) {
        el.value = '';
        return;
      }
      el.value = _t.cur ? _t.build(el.value) : el.value;
    });
  },

  attach: function (el) {
    var _t = this;

    el.addEventListener('focus', function () {
      if (!_t.cur) return;
      el.value = _t.build(el.value);
      _t.moveCaretEnd(el);
    });

    // El clic no reposiciona: el cursor siempre al final.
    el.addEventListener('mouseup', function (e) {
      if (!_t.cur) return;
      e.preventDefault();
      _t.moveCaretEnd(el);
    });
    el.addEventListener('click', function () {
      if (!_t.cur) return;
      _t.moveCaretEnd(el);
    });

    // Al escribir/pegar: reconstruye prefijo + dígitos (con tope máximo) y cursor al final.
    el.addEventListener('input', function () {
      if (!_t.cur) return;
      el.value = _t.build(el.value);
      _t.moveCaretEnd(el);
    });

    // Bloquea borrar el prefijo cuando ya no queda número.
    el.addEventListener('keydown', function (e) {
      if (!_t.cur) return;
      if (e.key === 'Backspace' && _t.getUserPart(el.value).length === 0) {
        e.preventDefault();
      }
    });

    // Si solo queda el prefijo (sin número), vacía el campo para que la validación lo detecte.
    el.addEventListener('blur', function () {
      if (!_t.cur) return;
      if (_t.getUserPart(el.value).length === 0) {
        el.value = '';
      }
    });
  },

  init: function () {
    var _t = this,
        _s = _t.setting;

    _t.inputs = Array.prototype.slice.call(document.querySelectorAll(_s.phone));
    _t.selects = Array.prototype.slice.call(document.querySelectorAll(_s.country));

    var firstSelect = _t.selects[0];
    _t.cc = (_s.ccDef !== '')
      ? _s.ccDef.toLowerCase()
      : (typeof ip_ccode !== 'undefined')
        ? ip_ccode.toLowerCase()
        : (firstSelect && firstSelect.value)
          ? firstSelect.value.toLowerCase()
          : '';

    _t.applyCountry();
    _t.inputs.forEach(function (el) { _t.attach(el); });

    if (_s.ccDef === '') {
      _t.selects.forEach(function (sel) {
        sel.addEventListener('change', function () {
          _t.cc = this.value.toLowerCase();
          _t.applyCountry();
        });
      });
    }
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () { adc.phone.init(); });
} else {
  adc.phone.init();
}
}();

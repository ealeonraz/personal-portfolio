/* Learn RAG. Interactive labs.
   Every number shown is computed live in your browser from the corpus below.
   Where a value is illustrative rather than measured, the interface says so. */
(function () {
  'use strict';

  /* ==========================================================
     Demo corpus: a small university computer science handbook.
     Chosen so that exact identifiers (course codes, GPA cutoffs)
     and paraphrase both appear, because those are the two things
     lexical and dense retrieval respectively fail at.
     ========================================================== */
  var CORPUS = [
    { id: 'D1', title: 'CSC 130, Algorithms',
      text: 'CSC 130 Advanced Programming and Algorithms covers algorithm design, asymptotic analysis, and data structures. Prerequisite: CSC 28 with a grade of C or better. Offered every fall and spring semester.' },
    { id: 'D2', title: 'Admission to the major',
      text: 'Students seeking entry to the computer science program must finish the lower division core and earn a minimum grade point average of 2.5 across those courses before they may declare.' },
    { id: 'D3', title: 'CSC 28, Discrete Structures',
      text: 'CSC 28 Discrete Structures for Computer Science introduces logic, proof techniques, set theory, and combinatorics. Prerequisite: MATH 30. This course is required before CSC 130.' },
    { id: 'D4', title: 'Internship credit',
      text: 'Up to three units of supervised work experience may count toward the degree. Students arrange placement with an employer, register for CSC 195, and submit a final report to the faculty coordinator.' },
    { id: 'D5', title: 'Graduation deadlines',
      text: 'Candidates file the graduation application two semesters before their intended commencement. Late filings are processed for the following term and a fee applies.' },
    { id: 'D6', title: 'Transfer credit',
      text: 'Coursework finished at another accredited institution is evaluated by the department chair. Articulated community college courses transfer automatically. All others require a syllabus review.' },
    { id: 'D7', title: 'CSC 131, Software Engineering',
      text: 'CSC 131 Computer Software Engineering covers requirements, design, testing, and team project management. Prerequisite: CSC 130. Students finish a semester long group project.' },
    { id: 'D8', title: 'Academic probation',
      text: 'A student whose cumulative grade point average falls below 2.0 is placed on academic probation and must meet with an advisor before registering for the next term.' },
    { id: 'D9', title: 'Repeating a course',
      text: 'A course may be repeated once for grade forgiveness. The second grade replaces the first in the major average. Additional attempts require a petition to the department.' },
    { id: 'D10', title: 'Advising appointments',
      text: 'Peer advisors are available on a drop in basis during posted office hours. Faculty advising appointments are scheduled online and are required before you declare a concentration.' }
  ];

  var STOP = new Set(('a an and are as at be before below by during for from in into is it its may must of on or that the their them they this to up with you your which all across those every other').split(' '));

  function tokenize(s) {
    return (s.toLowerCase().match(/[a-z0-9]+/g) || []).filter(function (t) { return !STOP.has(t); });
  }
  function counts(tokens) {
    var m = Object.create(null);
    tokens.forEach(function (t) { m[t] = (m[t] || 0) + 1; });
    return m;
  }

  var DOCS = CORPUS.map(function (d) {
    var toks = tokenize(d.title + ' ' + d.text);
    return { id: d.id, title: d.title, text: d.text, toks: toks, tf: counts(toks), len: toks.length };
  });
  var N = DOCS.length;
  var DF = Object.create(null);
  DOCS.forEach(function (d) { Object.keys(d.tf).forEach(function (t) { DF[t] = (DF[t] || 0) + 1; }); });
  var AVGDL = DOCS.reduce(function (a, d) { return a + d.len; }, 0) / N;

  function idf(t) { return Math.log(N / (1 + (DF[t] || 0))) + 1; }
  function weight(tf) {
    var v = Object.create(null);
    Object.keys(tf).forEach(function (t) { v[t] = tf[t] * idf(t); });
    return v;
  }
  function len(v) { var s = 0; for (var k in v) s += v[k] * v[k]; return Math.sqrt(s); }
  function cosine(a, b) {
    var la = len(a), lb = len(b);
    if (!la || !lb) return 0;
    var dot = 0;
    for (var k in a) if (b[k]) dot += a[k] * b[k];
    return dot / (la * lb);
  }
  var DOCV = DOCS.map(function (d) { return weight(d.tf); });
  function byId(id) { return DOCS.filter(function (d) { return d.id === id; })[0]; }
  function titleOf(id) { var d = byId(id); return d ? d.title : id; }

  function el(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function rows(host, items, opt) {
    opt = opt || {};
    var max = items.reduce(function (a, i) { return Math.max(a, i.score); }, 0) || 1;
    host.innerHTML = items.map(function (it, i) {
      var w = Math.max(0, (it.score / max) * 100);
      var cls = it.score <= 1e-6 ? 'nil' : (opt.mark && opt.mark.indexOf(it.id) >= 0 ? 'mark' : '');
      return '<div class="rrow ' + cls + '">' +
        '<div class="rk">' + (i + 1) + '</div>' +
        '<div class="track"><div class="fill" style="width:' + w.toFixed(1) + '%"></div>' +
        '<div class="txt">' + esc(it.label) + '</div></div>' +
        '<div class="sc">' + it.score.toFixed(3) + '</div></div>';
    }).join('');
  }

  /* ==========================================================
     LAB. Lexical cosine similarity
     ========================================================== */
  function initLexical() {
    var input = el('lex-q'), out = el('lex-out'), vec = el('lex-vec'), note = el('lex-note');
    if (!input) return;

    function run() {
      var q = input.value.trim();
      var qt = tokenize(q);
      var qv = weight(counts(qt));

      var scored = DOCS.map(function (d, i) {
        return { id: d.id, label: d.title, score: cosine(qv, DOCV[i]) };
      }).sort(function (a, b) { return b.score - a.score; });
      rows(out, scored);

      if (!qt.length) {
        vec.innerHTML = '';
        note.innerHTML = 'Type a question, or pick one of the four above.';
        return;
      }

      vec.innerHTML = '<table><caption>your query as a vector</caption>' +
        '<thead><tr><th>term</th><th class="num">count</th><th class="num">appears in</th><th class="num">idf</th><th class="num">weight</th></tr></thead><tbody>' +
        Object.keys(counts(qt)).map(function (t) {
          var c = counts(qt)[t], d = DF[t] || 0;
          return '<tr><td><code>' + esc(t) + '</code></td>' +
            '<td class="num">' + c + '</td>' +
            '<td class="num">' + d + ' of ' + N + (d === 0 ? ' <span class="no">(unseen)</span>' : '') + '</td>' +
            '<td class="num">' + idf(t).toFixed(2) + '</td>' +
            '<td class="num">' + (c * idf(t)).toFixed(2) + '</td></tr>';
        }).join('') + '</tbody></table>';

      var top = scored[0];
      var seen = Object.keys(counts(qt)).filter(function (t) { return DF[t]; });

      if (!seen.length || top.score < 0.001) {
        note.innerHTML = '<strong class="no">Every document scored zero.</strong> ' +
          'Not one word of your query appears anywhere in the corpus, so the query vector is orthogonal to all ten document vectors. ' +
          'The answer is very likely sitting in <em>' + esc(titleOf('D2')) + '</em>, and lexical search cannot see it. ' +
          'This is the precise gap that dense embeddings exist to close.';
      } else {
        note.innerHTML = 'Top match: <strong>' + esc(top.label) + '</strong> at cosine ' + top.score.toFixed(3) + '. ' +
          'Terms that actually matched: <code>' + seen.map(esc).join('</code> <code>') + '</code>. ' +
          'Look at the idf column above. A word in one document out of ten carries far more weight than a word in eight out of ten, ' +
          'which is why <code>130</code> is a strong signal and <code>students</code> is nearly worthless.';
      }
    }

    input.addEventListener('input', run);
    Array.prototype.forEach.call(document.querySelectorAll('[data-lexq]'), function (b) {
      b.addEventListener('click', function () { input.value = b.getAttribute('data-lexq'); run(); input.focus(); });
    });
    run();
  }

  /* ==========================================================
     LAB. Chunking
     ========================================================== */
  var SAMPLE =
    'The Department of Computer Science offers a Bachelor of Science degree. The program opens with a lower division core in programming and discrete mathematics, then moves into algorithms, computer organization, and software engineering.\n\n' +
    'Admission to the major is competitive. Students must finish the lower division core and earn a minimum grade point average of 2.5 across those courses before they may declare. Petitions for exceptions are reviewed once per term by the department chair, who weighs the whole academic record rather than any single grade.\n\n' +
    'Once admitted, students select a concentration. The available concentrations are software engineering, data science, and computer networking. Each one requires eighteen units of upper division coursework, at least twelve of which must be finished in residence.';

  function sentences(p) { return p.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g) || [p]; }

  function chunk(text, size, overlap) {
    var units = [];
    text.split(/\n\s*\n/).map(function (s) { return s.trim(); }).filter(Boolean).forEach(function (p) {
      if (p.length <= size) { units.push(p); return; }
      sentences(p).forEach(function (s) {
        s = s.trim(); if (!s) return;
        if (s.length <= size) { units.push(s); return; }
        for (var i = 0; i < s.length; i += size) units.push(s.slice(i, i + size));
      });
    });
    var out = [], buf = '';
    units.forEach(function (u) {
      if (!buf) { buf = u; }
      else if ((buf + ' ' + u).length <= size) { buf += ' ' + u; }
      else { out.push(buf); buf = u; }
    });
    if (buf) out.push(buf);
    return out.map(function (c, i) {
      if (!overlap || !i) return { text: c, ov: 0 };
      var prev = out[i - 1];
      var tail = prev.slice(Math.max(0, prev.length - overlap));
      return { text: tail + ' ' + c, ov: tail.length };
    });
  }

  function initChunk() {
    var ta = el('ch-text'), sz = el('ch-size'), ov = el('ch-ov'),
        szl = el('ch-size-l'), ovl = el('ch-ov-l'), out = el('ch-out'), stat = el('ch-stat');
    if (!ta) return;
    ta.value = SAMPLE;

    function run() {
      var s = +sz.value, o = Math.min(+ov.value, s - 20);
      szl.textContent = s;
      ovl.textContent = o + ' (' + Math.round((o / s) * 100) + '%)';

      var cs = chunk(ta.value, s, o), cut = 0;
      out.innerHTML = cs.map(function (c, i) {
        var body = c.text.slice(c.ov);
        var broke = /^[a-z]/.test(body.trim());
        if (broke) cut++;
        return '<div class="chk' + (broke ? ' cut' : '') + '">' +
          '<span class="m">' + (i + 1) + ' &middot; ' + c.text.length + ' chars' +
          (c.ov ? ' &middot; ' + c.ov + ' carried over' : '') +
          (broke ? ' &middot; begins mid sentence' : '') + '</span>' +
          (c.ov ? '<span class="ov">' + esc(c.text.slice(0, c.ov)) + '</span>' : '') + esc(body) + '</div>';
      }).join('');

      var stored = cs.reduce(function (a, c) { return a + c.text.length; }, 0);
      var base = ta.value.replace(/\n\s*\n/g, ' ').length;
      stat.innerHTML = '<strong>' + cs.length + ' chunks.</strong> ' +
        'Characters stored: ' + stored + ' against ' + base + ' original, so overlap costs you <strong>' +
        (base ? Math.round(((stored - base) / base) * 100) : 0) + '% extra storage and embedding spend</strong>. ' +
        '<span class="' + (cut ? 'no' : 'ok') + '">' + cut + ' chunk' + (cut === 1 ? '' : 's') + ' begin mid sentence.</span>';
    }
    [sz, ov, ta].forEach(function (x) { x.addEventListener('input', run); });
    run();
  }

  /* ==========================================================
     LAB. BM25
     ========================================================== */
  function bm25(qt, d, k1, b) {
    var total = 0, parts = [];
    Object.keys(counts(qt)).forEach(function (t) {
      var f = d.tf[t] || 0;
      if (!f) return;
      var n = DF[t] || 0;
      var I = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      var sat = (f * (k1 + 1)) / (f + k1 * (1 - b + b * (d.len / AVGDL)));
      total += I * sat;
      parts.push({ t: t, f: f, df: n, idf: I, sat: sat, c: I * sat });
    });
    return { score: total, parts: parts };
  }

  function initBM25() {
    var q = el('bm-q'), k1i = el('bm-k1'), bi = el('bm-b'),
        k1l = el('bm-k1-l'), bl = el('bm-b-l'), out = el('bm-out'), brk = el('bm-brk');
    if (!q) return;

    function run() {
      var k1 = +k1i.value / 10, b = +bi.value / 100;
      k1l.textContent = k1.toFixed(1);
      bl.textContent = b.toFixed(2);
      var qt = tokenize(q.value);

      var scored = DOCS.map(function (d) {
        var r = bm25(qt, d, k1, b);
        return { id: d.id, label: d.title, score: r.score, parts: r.parts, len: d.len };
      }).sort(function (a, c) { return c.score - a.score; });
      rows(out, scored);

      var top = scored[0];
      if (!top || !top.parts.length) {
        brk.innerHTML = '<p class="small">No query term appears in any document, so every score is zero. BM25 has exactly the same blind spot as the cosine lab above.</p>';
        return;
      }
      brk.innerHTML =
        '<table><caption>how the top score was built: ' + esc(top.label) + '</caption>' +
        '<thead><tr><th>term</th><th class="num">tf</th><th class="num">docs</th><th class="num">idf</th><th class="num">saturation</th><th class="num">adds</th></tr></thead><tbody>' +
        top.parts.sort(function (a, c) { return c.c - a.c; }).map(function (p) {
          return '<tr><td><code>' + esc(p.t) + '</code></td><td class="num">' + p.f + '</td>' +
            '<td class="num">' + p.df + '/' + N + '</td><td class="num">' + p.idf.toFixed(2) + '</td>' +
            '<td class="num">' + p.sat.toFixed(2) + '</td><td class="num">' + p.c.toFixed(3) + '</td></tr>';
        }).join('') + '</tbody></table>' +
        '<p class="small">The document is ' + top.len + ' tokens long against a corpus average of ' + AVGDL.toFixed(1) + '. ' +
        'Raise <code>b</code> toward 1 and BM25 punishes long documents harder for the same term count. ' +
        'Raise <code>k1</code> and repeated terms keep earning credit for longer instead of flattening out.</p>';
    }
    [q, k1i, bi].forEach(function (x) { x.addEventListener('input', run); });
    Array.prototype.forEach.call(document.querySelectorAll('[data-bmq]'), function (btn) {
      btn.addEventListener('click', function () { q.value = btn.getAttribute('data-bmq'); run(); q.focus(); });
    });
    run();
  }

  /* ==========================================================
     LAB. Reciprocal Rank Fusion
     ========================================================== */
  var SCENES = {
    complement: {
      name: 'Each engine is blind to something the other sees',
      note: 'BM25 locks onto the literal course code and misses the paraphrased admissions question. The dense list does the reverse. Neither top result is the pair you want, yet the fused top two are exactly right.',
      bm25: ['D1', 'D3', 'D7', 'D9', 'D5', 'D2'],
      dense: ['D2', 'D6', 'D1', 'D8', 'D10', 'D4']
    },
    agree: {
      name: 'Both engines already agree',
      note: 'When the lists agree, fusion changes almost nothing, and that is correct behaviour. RRF is a tie breaker for disagreement, not a general accuracy booster. If your two retrievers always agree, you are paying for two and getting one.',
      bm25: ['D1', 'D3', 'D7', 'D2', 'D5'],
      dense: ['D1', 'D3', 'D2', 'D7', 'D5']
    },
    outlier: {
      name: 'One engine is confidently wrong',
      note: 'Dense retrieval ranks D9 first, and BM25 does not return it at all. Because RRF sums reciprocal ranks across lists, one confident vote cannot outvote a document that placed respectably in both. This is the property that makes fusion safe.',
      bm25: ['D2', 'D6', 'D5', 'D8', 'D10'],
      dense: ['D9', 'D2', 'D7', 'D6', 'D3']
    }
  };

  function initRRF() {
    var sel = el('rrf-sc'), ki = el('rrf-k'), kl = el('rrf-k-l'), out = el('rrf-out'), note = el('rrf-note');
    if (!sel) return;

    function run() {
      var sc = SCENES[sel.value], k = +ki.value;
      kl.textContent = k;
      var acc = Object.create(null);
      function add(list, key) {
        list.forEach(function (id, i) {
          if (!acc[id]) acc[id] = { id: id, bm: null, de: null, score: 0 };
          acc[id][key] = i + 1;
          acc[id].score += 1 / (k + i + 1);
        });
      }
      add(sc.bm25, 'bm');
      add(sc.dense, 'de');
      var fused = Object.keys(acc).map(function (i) { return acc[i]; })
        .sort(function (a, b) { return b.score - a.score; });

      out.innerHTML = '<table><caption>fused ranking</caption><thead><tr>' +
        '<th class="num">new</th><th>document</th><th class="num">bm25</th><th class="num">dense</th><th class="num">rrf score</th>' +
        '</tr></thead><tbody>' + fused.map(function (r, i) {
          var f = function (v) { return v === null ? '<span style="color:var(--ink3)">not found</span>' : String(v); };
          return '<tr><td class="num"><strong>' + (i + 1) + '</strong></td><td>' + esc(titleOf(r.id)) + '</td>' +
            '<td class="num">' + f(r.bm) + '</td><td class="num">' + f(r.de) + '</td>' +
            '<td class="num">' + r.score.toFixed(5) + '</td></tr>';
        }).join('') + '</tbody></table>';

      var r1 = 1 / (k + 1), r5 = 1 / (k + 5);
      note.innerHTML = '<strong>' + esc(sc.name) + '.</strong> ' + esc(sc.note) +
        '<br><span class="small">Every list contributes <code>1 / (k + rank)</code> and the contributions are summed. ' +
        'At k of ' + k + ', rank 1 is worth ' + r1.toFixed(5) + ' and rank 5 is worth ' + r5.toFixed(5) + ', which is ' +
        ((r5 / r1) * 100).toFixed(0) + ' percent as much. Push k down toward 1 and the top rank dominates everything. ' +
        'Push it up and the lists flatten until rank barely matters. The published default of 60 has held since 2009.</span>';
    }
    [sel, ki].forEach(function (x) { x.addEventListener('input', run); });
    run();
  }

  /* ==========================================================
     LAB. Retrieval metrics
     ========================================================== */
  var RESULTS = ['D2', 'D8', 'D1', 'D6', 'D9', 'D3', 'D10', 'D5', 'D7', 'D4'];

  function initMetrics() {
    var list = el('mt-list'), out = el('mt-out'), ki = el('mt-k'), kl = el('mt-k-l'),
        ti = el('mt-total'), work = el('mt-work');
    if (!list) return;
    var rel = new Set(['D2', 'D6']);

    function draw() {
      list.innerHTML = RESULTS.map(function (id, i) {
        var on = rel.has(id);
        return '<label class="pick' + (on ? ' on' : '') + '">' +
          '<span class="rk">' + (i + 1) + '</span>' +
          '<input type="checkbox" data-id="' + id + '"' + (on ? ' checked' : '') + '>' +
          '<span>' + esc(titleOf(id)) + '</span></label>';
      }).join('');
    }

    function met(k, v, cls) {
      return '<div class="met"><div class="k">' + k + '</div><div class="v ' + cls + '">' + v.toFixed(2) + '</div></div>';
    }

    function calc() {
      var k = +ki.value;
      kl.textContent = k;
      var total = Math.max(+ti.value || rel.size, rel.size, 1);
      var top = RESULTS.slice(0, k);
      var hits = top.filter(function (id) { return rel.has(id); });

      var recall = hits.length / total;
      var prec = k ? hits.length / k : 0;
      var hit = hits.length ? 1 : 0;

      var first = 0;
      for (var i = 0; i < RESULTS.length; i++) { if (rel.has(RESULTS[i])) { first = i + 1; break; } }
      var rr = (first && first <= k) ? 1 / first : 0;

      var dcg = 0, terms = [];
      top.forEach(function (id, i) {
        if (rel.has(id)) {
          var g = 1 / (Math.log(i + 2) / Math.LN2);
          dcg += g;
          terms.push('1/log2(' + (i + 2) + ')=' + g.toFixed(3));
        }
      });
      var idcg = 0;
      for (var j = 0; j < Math.min(total, k); j++) idcg += 1 / (Math.log(j + 2) / Math.LN2);
      var ndcg = idcg ? dcg / idcg : 0;

      var c = function (v) { return v >= 0.8 ? 'hi' : (v >= 0.4 ? 'mid' : 'lo'); };
      out.innerHTML = met('recall@' + k, recall, c(recall)) + met('prec@' + k, prec, c(prec)) +
        met('hit@' + k, hit, hit ? 'hi' : 'lo') + met('mrr', rr, c(rr)) + met('ndcg@' + k, ndcg, c(ndcg));

      work.innerHTML = '<pre><code>' +
        'relevant inside top ' + k + ':  ' + (hits.length ? hits.join(', ') : 'none') + '\n' +
        'recall@' + k + '   = ' + hits.length + ' found / ' + total + ' relevant in corpus   = ' + recall.toFixed(3) + '\n' +
        'precision@' + k + '= ' + hits.length + ' found / ' + k + ' retrieved            = ' + prec.toFixed(3) + '\n' +
        'mrr        = ' + (first && first <= k ? '1 / rank ' + first + '                          = ' + rr.toFixed(3)
                                                : '0, nothing relevant inside top ' + k) + '\n' +
        'dcg@' + k + '      = ' + (terms.length ? terms.join(' + ') : '0') + '\n' +
        '           = ' + dcg.toFixed(4) + '\n' +
        'idcg@' + k + '     = ' + idcg.toFixed(4) + '   (same sum if every hit sat at the very top)\n' +
        'ndcg@' + k + '     = ' + dcg.toFixed(4) + ' / ' + idcg.toFixed(4) + ' = ' + ndcg.toFixed(3) +
        '</code></pre>';
    }

    list.addEventListener('change', function (ev) {
      var cb = ev.target.closest('input[data-id]');
      if (!cb) return;
      var id = cb.getAttribute('data-id');
      if (cb.checked) rel.add(id); else rel.delete(id);
      if (+ti.value < rel.size) ti.value = rel.size;
      draw(); calc();
    });
    [ki, ti].forEach(function (x) { x.addEventListener('input', calc); });
    draw(); calc();
  }

  /* ==========================================================
     LAB. Cost model
     ========================================================== */
  function initCost() {
    if (!el('co-chunks')) return;
    var out = el('co-out');
    var ids = ['co-chunks', 'co-tok', 'co-price', 'co-q', 'co-ctx', 'co-in', 'co-cache'];

    function run() {
      var chunks = +el('co-chunks').value || 0;
      var tok = +el('co-tok').value || 0;
      var price = +el('co-price').value || 0;
      var qpd = +el('co-q').value || 0;
      var ctx = +el('co-ctx').value || 0;
      var inPrice = +el('co-in').value || 0;
      var cached = el('co-cache').checked;

      var indexTok = chunks * tok;
      var indexCost = (indexTok / 1e6) * price;
      var rate = cached ? inPrice * 0.1 : inPrice;
      var per = (ctx / 1e6) * rate;
      var month = per * qpd * 30;
      var uncached = (ctx / 1e6) * inPrice * qpd * 30;

      out.innerHTML =
        '<div class="mets">' +
        '<div class="met"><div class="k">index once</div><div class="v">$' + indexCost.toFixed(2) + '</div></div>' +
        '<div class="met"><div class="k">per query</div><div class="v">$' + per.toFixed(5) + '</div></div>' +
        '<div class="met"><div class="k">per month</div><div class="v ' + (month > 25 ? 'mid' : 'hi') + '">$' + month.toFixed(2) + '</div></div>' +
        '</div>' +
        '<p class="small">Indexing ' + chunks.toLocaleString() + ' chunks means ' + (indexTok / 1e6).toFixed(2) +
        ' million tokens embedded one time. ' +
        (cached
          ? 'Input is billed at one tenth of list price because the retrieved prefix is cached, which saves you $' +
            (uncached - month).toFixed(2) + ' a month against the uncached path.'
          : 'Switch caching on to bill the repeated prefix at one tenth of list price.') + '</p>' +
        (indexCost < 1
          ? '<p class="small ok">Notice how small the indexing figure is. At this scale embedding cost is a rounding error, ' +
            'so if you run models locally, say you did it for the learning, the offline capability, or the privacy. Do not claim it saved money.</p>'
          : '');
    }
    ids.forEach(function (i) { var x = el(i); if (x) x.addEventListener('input', run); });
    run();
  }

  /* ==========================================================
     LAB. How many chunks to retrieve
     ========================================================== */
  function initCurve() {
    var ki = el('cv-k'), kl = el('cv-k-l'), svg = el('cv-svg'), note = el('cv-note');
    if (!ki) return;

    // Shape only. Reproduces the qualitative inverted U reported in the OP-RAG
    // paper: recall saturates while distraction keeps growing. Not measured data.
    function quality(k) {
      return Math.max(0, (1 - Math.exp(-k / 6)) - Math.pow(k / 46, 2.1));
    }

    function run() {
      var k = +ki.value; kl.textContent = k;
      var W = 560, H = 200, P = 36, KMAX = 48;
      var pts = [], best = { k: 1, q: 0 };
      for (var i = 1; i <= KMAX; i++) {
        var q = quality(i);
        if (q > best.q) best = { k: i, q: q };
        pts.push([P + ((i - 1) / (KMAX - 1)) * (W - P * 2), H - P - q * (H - P * 2)]);
      }
      var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
      var cur = pts[Math.min(k, KMAX) - 1];
      var bx = P + ((best.k - 1) / (KMAX - 1)) * (W - P * 2);

      svg.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" role="img" ' +
        'aria-label="Answer quality rises with the number of retrieved chunks, reaches a peak, then declines">' +
        '<line x1="' + P + '" y1="' + (H - P) + '" x2="' + (W - P) + '" y2="' + (H - P) + '" stroke="currentColor" opacity=".22"/>' +
        '<line x1="' + P + '" y1="' + P + '" x2="' + P + '" y2="' + (H - P) + '" stroke="currentColor" opacity=".22"/>' +
        '<line x1="' + bx.toFixed(1) + '" y1="' + P + '" x2="' + bx.toFixed(1) + '" y2="' + (H - P) + '" stroke="var(--live)" stroke-dasharray="2 4"/>' +
        '<path d="' + d + '" fill="none" stroke="var(--accent)" stroke-width="2"/>' +
        '<circle cx="' + cur[0].toFixed(1) + '" cy="' + cur[1].toFixed(1) + '" r="4.5" fill="var(--flag)"/>' +
        '<text x="' + (W / 2) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="10" font-family="monospace" fill="currentColor" opacity=".55">chunks retrieved</text>' +
        '<text x="' + (bx + 6).toFixed(1) + '" y="' + (P + 10) + '" font-size="10" font-family="monospace" fill="var(--live)">peak near ' + best.k + '</text>' +
        '</svg>';

      var msg;
      if (k < best.k - 3) msg = 'You are <strong>under retrieving</strong>. The evidence often never reaches the prompt at all. That is failure point 2 in module 8.';
      else if (k <= best.k + 4) msg = '<span class="ok">Close to the peak.</span> Enough evidence to answer, not yet enough noise to drown it.';
      else msg = 'You are <strong>over retrieving</strong>. The answer is in the prompt and the model is losing it among distractors. That is failure point 4, and it is the counterintuitive one: adding context made the system worse.';
      note.innerHTML = msg + ' <span class="small">The curve shape is illustrative rather than measured. ' +
        'Your own peak is a number you discover with the harness in module 7, and it will not be the same as anyone else\'s.</span>';
    }
    ki.addEventListener('input', run);
    document.addEventListener('module:shown', run);
    run();
  }

  window.RAGLabs = {
    init: function () {
      initLexical(); initChunk(); initBM25(); initRRF(); initMetrics(); initCost(); initCurve();
    }
  };
})();

// ============================================================
//  福島地域記録データアーカイブ ── discovery.js
//  ・ページ発見記録パネルの管理
//  ・search.html 未経由アクセスのガード
// ============================================================

const PAGES = [
  { id:'00', title:'00｜侵入口',          url:'index.html' },
  { id:'01', title:'01｜小蘭の手記①',     url:'kiroku_001.html' },
  { id:'02', title:'02｜手記② T湯',       url:'kiroku_002.html' },
  { id:'03', title:'03｜手記③ T湯の湯宿', url:'kiroku_003.html' },
  { id:'04', title:'04｜古い写真①',        url:'photo_001.html' },
  { id:'05', title:'05｜写真② M川駅跡',    url:'photo_002.html' },
  { id:'06', title:'06｜写真③ 猫塚家',     url:'photo_003.html' },
  { id:'07', title:'07｜新聞投書欄',        url:'bbs_001.html' },
  { id:'08', title:'08｜守る会のビラ',      url:'bbs_002.html' },
  { id:'09', title:'09｜新聞切り抜き集',    url:'bbs_003.html' },
  { id:'10', title:'10｜地図① 福島市中心',  url:'map_001.html' },
  { id:'11', title:'11｜地図② H見山',      url:'map_002.html' },
  { id:'12', title:'12｜地図③ T沼へ',      url:'map_003.html' },
  { id:'13', title:'13｜電文① 暗号解読',   url:'telegram_001.html' },
  { id:'14', title:'14｜電文② №0314',      url:'telegram_002.html' },
  { id:'15', title:'15｜電文③ ぬいぐるみ', url:'telegram_003.html' },
  { id:'16', title:'16｜記録保存会の核心',  url:'hub_002.html' },
  { id:'17', title:'17｜猫塚清治の記録',    url:'koaru_record.html' },
  { id:'18', title:'18｜冤罪の構造',        url:'inochi.html' },
  { id:'19', title:'19｜冤罪を覆した声',    url:'voices.html' },
  { id:'20', title:'20｜世論と現代SNS',     url:'sns.html' },
  { id:'21', title:'21｜ループの伏線回収',  url:'loop.html' },
  { id:'22', title:'22｜T沼・廃墟の記憶',  url:'takosanuma.html' },
  { id:'23', title:'23｜ぬいぐるみの来歴',  url:'takkope.html' },
  { id:'24', title:'24｜福島・桃の産地',    url:'momo.html' },
  { id:'25', title:'25｜小蘭のデータ痕跡',  url:'data_trace.html' },
  { id:'26', title:'26｜ITと記録の現在',    url:'it_kiroku.html' },
  { id:'27', title:'27｜隠しページ',        url:'hidden.html' },
  { id:'28', title:'28｜桃の手記',          url:'momo_kiroku.html' },
  { id:'29a',title:'29A｜記録を残す',       url:'end_a.html' },
  { id:'29b',title:'29B｜記録を消す',       url:'end_b.html' },
  { id:'30', title:'30｜エピローグ',         url:'epilogue.html' },
];

// ============================================================
//  ガード対象外ページ
//  （search.htmlの解放リストに関係なく常に閲覧可能）
// ============================================================
const GUARD_EXEMPT = [
  'index.html',
  'search.html',
  'index_about.html',
  // search.html が管理しない後半ページ（hub_002解放後に順次開放）
  'koaru_record.html',
  'inochi.html',
  'voices.html',
  'sns.html',
  'loop.html',
  'takosanuma.html',
  'takkope.html',
  'momo.html',
  'data_trace.html',
  'it_kiroku.html',
  'hidden.html',
  'momo_kiroku.html',
  'end_a.html',
  'end_b.html',
  'epilogue.html',
];

// search.html が管理する解放リストのキー（search.htmlと共有）
const SEARCH_STORAGE_KEY = 'fla_restored_files';

// 発見記録パネルのキー
const STORAGE_KEY = 'fla_discovered';

// ============================================================
//  ガード処理
//  search.html で解放されていないページへの直接アクセスを防ぐ
// ============================================================
function guardPage() {
  const currentFile = location.pathname.split('/').pop() || 'index.html';

  // 対象外ページはスキップ
  if (GUARD_EXEMPT.includes(currentFile)) return;

  // search.html の解放リストを取得
  let restored = [];
  try {
    restored = JSON.parse(localStorage.getItem(SEARCH_STORAGE_KEY) || '[]');
  } catch(e) {}

  // 現在のページが解放済みかチェック
  if (!restored.includes(currentFile)) {
    // 未解放 → search.html へリダイレクト
    location.replace('search.html');
  }
}

// ============================================================
//  発見記録の管理
// ============================================================
function getDiscovered() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch(e) { return []; }
}
function saveDiscovered(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }
  catch(e) {}
}
function markCurrentPage() {
  const meta = document.querySelector('meta[name="page-id"]');
  if (!meta) return;
  const id = meta.getAttribute('content');
  const discovered = getDiscovered();
  if (!discovered.includes(id)) {
    discovered.push(id);
    saveDiscovered(discovered);
  }
}

// ============================================================
//  発見記録パネルの構築
// ============================================================
function buildPanel() {
  const discovered = getDiscovered();
  const total = PAGES.length;
  const found = discovered.length;

  const panel = document.createElement('div');
  panel.id = 'fla-panel';
  panel.innerHTML = `
    <div id="fla-toggle" onclick="togglePanel()" title="発見記録">
      <span id="fla-count">${found}/${total}</span>
      <span id="fla-icon">▲</span>
    </div>
    <div id="fla-body">
      <div id="fla-header">// 発見記録 ── ${found}/${total} ページ</div>
      <div id="fla-list">
        ${PAGES.map(p => {
          const isFound = discovered.includes(p.id);
          return `<div class="fla-item ${isFound ? 'found' : 'locked'}">
            <span class="fla-status">${isFound ? '●' : '○'}</span>
            ${isFound
              ? `<a href="${p.url}" class="fla-link">${p.title}</a>`
              : `<span class="fla-locked">${p.title}</span>`}
          </div>`;
        }).join('')}
      </div>
      <div id="fla-footer-links">
        <a href="search.html" id="fla-search-link">// 検索ツールへ戻る</a>
      </div>
      <div id="fla-reset" onclick="resetDiscovery()">// 記録をリセット</div>
    </div>`;

  const style = document.createElement('style');
  style.textContent = `
    #fla-panel {
      position:fixed; bottom:0; right:20px; width:260px;
      font-family:'MS Gothic',monospace; font-size:11px; z-index:9999;
    }
    #fla-toggle {
      background:#4a6a4a; color:#d8e8d8; padding:6px 12px;
      cursor:pointer; display:flex; justify-content:space-between;
      align-items:center; border-radius:4px 4px 0 0; user-select:none;
    }
    #fla-toggle:hover { background:#3a5a3a; }
    #fla-body {
      background:#f4f0e4; border:1px solid #c4c0b0;
      border-bottom:none; display:none; max-height:420px; overflow-y:auto;
    }
    #fla-body.open { display:block; }
    #fla-header {
      padding:8px 12px; color:#4a6a4a; border-bottom:1px solid #d4d0c4;
      font-size:10px; letter-spacing:0.1em; background:#eae6da;
    }
    #fla-list { padding:4px 0; }
    .fla-item {
      display:flex; align-items:baseline; gap:6px;
      padding:4px 12px; border-bottom:1px solid #e8e4d8; line-height:1.6;
    }
    .fla-status { font-size:9px; min-width:10px; }
    .fla-item.found .fla-status { color:#4a7a4a; }
    .fla-item.locked .fla-status { color:#c4c0b0; }
    .fla-link { color:#3a5a3a; text-decoration:none; font-size:11px; }
    .fla-link:hover { color:#1a3a1a; text-decoration:underline; }
    .fla-locked { color:#b0ac9c; font-size:11px; }
    #fla-footer-links {
      padding:6px 12px; border-top:1px solid #d4d0c4; background:#eae6da;
    }
    #fla-search-link {
      color:#4a7a6a; font-size:10px; text-decoration:none;
    }
    #fla-search-link:hover { color:#2a5a4a; text-decoration:underline; }
    #fla-reset {
      padding:8px 12px; color:#b08060; cursor:pointer;
      font-size:10px; border-top:1px solid #d4d0c4; text-align:right;
    }
    #fla-reset:hover { color:#805040; }
  `;

  document.head.appendChild(style);
  document.body.appendChild(panel);
}

function togglePanel() {
  const body = document.getElementById('fla-body');
  const icon = document.getElementById('fla-icon');
  const isOpen = body.classList.contains('open');
  body.classList.toggle('open', !isOpen);
  icon.textContent = isOpen ? '▲' : '▼';
}

function resetDiscovery() {
  if (confirm('発見記録をすべてリセットしますか？\nこの操作は取り消せません。')) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SEARCH_STORAGE_KEY);
    location.replace('search.html');
  }
}

// ============================================================
//  起動
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  guardPage();       // ① まずガードチェック（未解放ならリダイレクト）
  markCurrentPage(); // ② 発見記録に追加
  buildPanel();      // ③ パネル描画
});

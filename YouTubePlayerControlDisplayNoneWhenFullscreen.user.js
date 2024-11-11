// ==UserScript==
// @name         YouTubeフルスクリーン中にコントローラーを非表示にする
// @namespace    https://github.com/AyeBee/YouTubePlayerControlDisplayNoneWhenFullscreen
// @version      1.0
// @description  YouTubeフルスクリーン中にコントローラーを非表示にする
// @author       ayebee
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-idle
// ==/UserScript==
(function() {
    'use strict';
    const styleId = '__ControlDisplayNoneWhenFllscreen__';

    // コントロールを表示しないスタイルを追加する処理(メインはここだけ)
    const appendStyle = () => {
        if (document.querySelector('#' + styleId)) {
            return;
        }
        const style = document.createElement('style');
        style.setAttribute('id', styleId);
        style.append(`
            .ytp-fullscreen .ytp-gradient-top,
            .ytp-fullscreen .ytp-chrome-top,
            .ytp-fullscreen .ytp-player-content,
            .ytp-fullscreen .ytp-gradient-bottom,
            .ytp-fullscreen .ytp-chrome-bottom {
                display:none !important;
            }
        `);
        document.head.append(style);
    };
    appendStyle();

    // 以下はコンテキストメニューにON/OFF切り替えを追加する処理

    // メニューの左端のアイコン(https://icons.getbootstrap.jp/icons/caret-right-square/)
    const menuItemIconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    menuItemIconSvg.setAttribute('viewBox', '0 0 16 16');
    const menuItemIconSvgPath1= document.createElementNS('http://www.w3.org/2000/svg', 'path');
    menuItemIconSvgPath1.setAttribute('d', 'M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z');
    menuItemIconSvgPath1.setAttribute('fill', '#fff');
    const menuItemIconSvgPath2= document.createElementNS('http://www.w3.org/2000/svg', 'path');
    menuItemIconSvgPath2.setAttribute('d', 'M5.795 12.456A.5.5 0 0 1 5.5 12V4a.5.5 0 0 1 .832-.374l4.5 4a.5.5 0 0 1 0 .748l-4.5 4a.5.5 0 0 1-.537.082');
    menuItemIconSvgPath2.setAttribute('fill', '#fff');
    menuItemIconSvg.append(menuItemIconSvgPath1, menuItemIconSvgPath2);

    // メニューの左端のアイコンの枠組み
    const menuItemIcon = document.createElement('div');
    menuItemIcon.classList.add('ytp-menuitem-icon');
    menuItemIcon.append(menuItemIconSvg);

    // メニューの中央のメッセージ文
    const menuItemLabel = document.createElement('div');
    menuItemLabel.classList.add('ytp-menuitem-label');
    menuItemLabel.append('フルスクリーン時にコントロールを表示しない');

    // メニューの右端のチェックボックス(制御は親の'aria-checked'属性で行うからここはシンプル)
    const menuItemCheckbox = document.createElement('div');
    menuItemCheckbox.classList.add('ytp-menuitem-toggle-checkbox');

    // メニューの右端のチェックボックスの枠組み
    const menuItemContent = document.createElement('div');
    menuItemContent.classList.add('ytp-menuitem-content');
    menuItemContent.append(menuItemCheckbox);

    // メニュー行の枠組み
    const menuItem = document.createElement('div');
    menuItem.classList.add('ytp-menuitem');
    menuItem.setAttribute('aria-checked', 'true');
    menuItem.setAttribute('role', 'menuitemcheckbox');
    menuItem.setAttribute('tabindex', '-1');
    menuItem.append(menuItemIcon, menuItemLabel, menuItemContent);
    menuItem.addEventListener('click', e => {
        if (menuItem.getAttribute('aria-checked') === 'true') {
            document.querySelector('#' + styleId)?.remove();
            menuItem.setAttribute('aria-checked', 'false');
        } else {
            appendStyle();
            menuItem.setAttribute('aria-checked', 'true');
        }
    }, false);

    // コンテキストメニューが読み込めるまで0.5秒間隔でリトライを繰り返し, メニュー行を追加する
    let intervalID = setInterval(() => {
        const contextMenu = document.querySelector('.ytp-contextmenu>.ytp-panel>.ytp-panel-menu');
        if (contextMenu){
            contextMenu.append(menuItem);
            clearInterval(intervalID);
        }
    }, 500);
})();

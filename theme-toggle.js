document.getElementById('themeToggle').addEventListener('click', function() {
    var currentTheme = document.body.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.body.removeAttribute('data-theme');
        this.textContent = 'ダークモードに切り替え'; // テキストをダークモードに変更
    } else {
        document.body.setAttribute('data-theme', 'dark');
        this.textContent = 'ライトモードに切り替え'; // テキストをライトモードに変更
    }
});

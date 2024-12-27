function toggleSearch(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log('Toggle search clicked');
    const searchContainer = $('#search-container');
    const searchOverlay = $('.search-overlay');
    searchOverlay.fadeIn(200);
    searchContainer.fadeIn(200);
    $('#search-input').focus();
    return false;
}

$(function () {
    console.log('Initializing search functionality...');

    // 获取元素
    const searchContainer = $('#search-container');
    const searchInput = $('#search-input');
    const searchResults = $('#search-results');

    // 隐藏搜索框的函数
    function hideSearch() {
        $('.search-overlay').fadeOut(200);
        searchContainer.fadeOut(200);
    }

    // 点击遮罩层关闭搜索框
    $('.search-overlay').on('click', function () {
        hideSearch();
    });

    // 阻止搜索框内的点击事件冒泡
    searchContainer.on('click', function (e) {
        e.stopPropagation();
    });

    // 点击文档其他地方关闭搜索框
    $(document).on('click', function (e) {
        if (!$(e.target).closest('#search-container, .search-trigger').length) {
            hideSearch();
        }
    });

    // ESC 键关闭搜索框
    $(document).on('keyup', function (e) {
        if (e.key === "Escape") {
            hideSearch();
        }
    });

    // 处理搜索输入
    searchInput.on('input', function () {
        const searchTerm = $(this).val().toLowerCase().trim();
        console.log('Searching for:', searchTerm);

        if (searchTerm.length < 1) {
            searchResults.empty();
            return;
        }

        // 搜索所有卡片
        const items = [];
        $('.xe-widget').each(function () {
            const card = $(this);
            const title = card.find('.xe-user-name strong').text();
            const desc = card.find('.overflowClip_2').text();

            if (title.toLowerCase().includes(searchTerm) ||
                desc.toLowerCase().includes(searchTerm)) {
                items.push({
                    element: card,
                    title: title,
                    desc: desc
                });
            }
        });

        // 显示结果
        const resultsHtml = items.map(item => `
                    <div class="search-item" data-offset="${item.element.offset().top}">
                        <div style="font-weight: bold;">${item.title}</div>
                        <div style="font-size: 12px; color: #666;">${item.desc}</div>
                    </div>
                `).join('');

        searchResults.html(items.length ? resultsHtml : '<div class="search-item">没有找到相关内容</div>');

        // 点击结果项
        $('.search-item').click(function () {
            const offset = $(this).data('offset');
            if (offset) {
                $('html, body').animate({
                    scrollTop: offset - 100
                }, 500);
                hideSearch();
            }
        });
    });

    // 返回顶部按钮功能
    $(document).ready(function () {
        const backToTop = $('#back-to-top');

        // 监听滚动事件
        $(window).scroll(function () {
            if ($(this).scrollTop() > 300) {
                backToTop.fadeIn().css('display', 'flex');
            } else {
                backToTop.fadeOut();
            }
        });

        // 点击返回顶部
        backToTop.click(function () {
            $('html, body').animate({
                scrollTop: 0
            }, 500);
            return false;
        });
    });

    // 添加一言复制功能
    $(document).ready(function () {
        // 一言点击复制功能
        $('#hitokoto-link').on('click', function (e) {
            e.preventDefault();
            const text = $('#yiyancon').text();

            // 创建临时文本区域
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();

            try {
                // 尝试复制
                document.execCommand('copy');
                // 显示提示
                const toast = $('#copy-toast');
                toast.addClass('show');

                // 2秒后隐藏提示
                setTimeout(() => {
                    toast.removeClass('show');
                }, 2000);
            } catch (err) {
                console.error('复制失败:', err);
            }

            // 移除临时文本区域
            document.body.removeChild(textarea);
        });
    });
});
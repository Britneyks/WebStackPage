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

    // 一言功能
    function fetchHitokoto() {
        $.ajax({
            url: 'https://api.apiopen.top/api/sentences',
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response && response.result && response.result.name) {
                    $('#yiyancon').text(response.result.name)
                        .hide()
                        .fadeIn(500);
                } else {
                    useLocalHitokoto();
                }
            },
            error: useLocalHitokoto
        });
    }

    // 使用本地一言
    function useLocalHitokoto() {
        const localHitokoto = [
            "生活明朗，万物可爱。",
            "保持热爱，奔赴山海。",
            "既然选择了远方，便只顾风雨兼程。",
            "山水一程，三生有幸。",
            "愿你眼中有光，心中有爱。",
            "所有的不期而遇，都是久别重逢。",
            "无论多么平凡，都要活得漂亮。",
            "愿你成为自己喜欢的样子。",
            "做你自己，成为独特的人。",
            "保持热爱，奔赴下一场山海。"
        ];
        $('#yiyancon')
            .text(localHitokoto[Math.floor(Math.random() * localHitokoto.length)])
            .hide()
            .fadeIn(500);
    }

    $(document).ready(function () {
        fetchHitokoto(); // 首次加载
        setInterval(fetchHitokoto, 30000); // 每30秒更新一次

        // 点击一言复制功能
        $('#hitokoto-link').on('click', function (e) {
            e.preventDefault();
            const text = $('#yiyancon').text();

            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).then(() => {
                    showCopiedAnimation(this);
                });
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    showCopiedAnimation(this);
                } catch (err) {
                    console.error('复制失败:', err);
                }
                document.body.removeChild(textarea);
            }
        });
    });

    // 显示复制成功动画
    function showCopiedAnimation(element) {
        const copiedText = $('<span class="copied-text">已复制</span>');
        $(element).append(copiedText);
        setTimeout(() => copiedText.remove(), 1000);
    }

    // 更新时间显示
    function updateDateTime() {
        const now = new Date();

        // 获取上午/下午
        const period = now.getHours() < 12 ? '上午' : '下午';

        // 格式化时间 - 显示12小时制时分秒
        const timeStr = now.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        }).replace('上午', '').replace('下午', '');  // 移除默认的上午下午显示

        // 格式化年月日
        const dayStr = now.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // 获取星期
        const weekStr = now.toLocaleDateString('zh-CN', {
            weekday: 'long'
        });

        // 更新显示
        $('#current-time .time').html(`
            <span class="period-info">${period}</span>
            <span class="time-info">${timeStr}</span>
        `);
        $('#current-time .date').html(`
            <span class="day-info">${dayStr}</span>
            <span class="week-info">${weekStr}</span>
        `);
    }

    $(document).ready(function () {
        // 初始化时间显示
        updateDateTime();
        // 每秒更新一次
        setInterval(updateDateTime, 1000);
    });
});
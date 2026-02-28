const homeView = document.getElementById('home-view');
        const aboutView = document.getElementById('about-view');
        const allViews = [homeView, aboutView, ...document.querySelectorAll('.detail-view')];
        const navItems = document.querySelectorAll('.nav-item');

        function hideAll() {
            allViews.forEach(el => {
                el.classList.remove('active');
                // 为了配合CSS动画，先移除active，稍后设置display
                if(el.classList.contains('detail-view') || el.classList.contains('about-view')) {
                    setTimeout(() => {
                        if(!el.classList.contains('active')) el.style.display = 'none';
                    }, 500);
                } else {
                    el.classList.add('hidden');
                    setTimeout(() => {
                       if(el.classList.contains('hidden')) el.style.display = 'none';
                    }, 500);
                }
            });
            
            // 重置导航状态
            navItems.forEach(item => item.classList.remove('active'));
        }

        function showHome() {
            hideAll();
            // 激活Work导航
            navItems[0].classList.add('active');

            setTimeout(() => {
                homeView.style.display = 'flex';
                // 强制重绘
                void homeView.offsetWidth; 
                homeView.classList.remove('hidden');
            }, 500);
        }

        function showDetail(id) {
            hideAll();
            const target = document.getElementById(id);
            setTimeout(() => {
                target.style.display = 'block';
                void target.offsetWidth;
                target.classList.add('active');
            }, 500);
        }

        function showAbout() {
            hideAll();
            // 激活About导航
            navItems[1].classList.add('active');

            setTimeout(() => {
                aboutView.style.display = 'block';
                void aboutView.offsetWidth;
                aboutView.classList.add('active');
            }, 500);
        }

        // 初始化显示
        homeView.classList.remove('hidden');

        // ========== 通用视频弹窗逻辑（完整修复版） ==========
        // 1. 关闭弹窗通用函数
        function closeModal(modal) {
            if (!modal) return;
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            // 清空iframe，停止视频播放
            setTimeout(() => {
                const iframe = modal.querySelector('.video-container iframe');
                if (iframe) iframe.src = 'about:blank';
            }, 400);
        }

        // 2. 绑定所有视频按钮点击事件
        document.querySelectorAll('.open-video-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // 获取按钮对应的弹窗ID（从按钮所在详情页推导：detail-01 → videoModal1）
                const detailId = btn.closest('.detail-view').id; // 比如 detail-01
                const modalNum = detailId.replace('detail-0', ''); // 提取 01 → 1
                const modalId = `videoModal${modalNum}`; // 拼接成 videoModal1
                
                const modal = document.getElementById(modalId);
                if (!modal) return;

                // 显示弹窗 + 加载视频
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // 禁止背景滚动
                const iframe = modal.querySelector('.video-container iframe');
                iframe.src = btn.getAttribute('data-video-src');
            });
        });

        // 3. 绑定所有关闭按钮
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.getAttribute('data-modal-id');
                closeModal(document.getElementById(modalId));
            });
        });

        // 4. 点击弹窗遮罩层关闭
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal(modal);
            });
        });

        // 5. ESC键关闭所有弹窗
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                    closeModal(modal);
                });
            }
        });
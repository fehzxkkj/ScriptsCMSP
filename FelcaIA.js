javascript:(() => {
    console.clear();

    // -------------------- Notificações --------------------
    class NotificationSystem {
        constructor() {
            this.initStyles();
            this.container = this.createContainer();
            document.body.appendChild(this.container);
        }
        initStyles() {
            if (document.getElementById('custom-notification-styles')) return;
            const style = document.createElement('style');
            style.id = 'custom-notification-styles';
            style.textContent = `
                .notification-container { position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; align-items: flex-end; pointer-events: none; }
                .notification { background: rgba(20,20,20,0.9); color:#f0f0f0; margin-bottom:10px; padding:12px 18px; border-radius:8px; font-family: 'Inter', sans-serif; font-size:13.5px; min-height:40px; text-align:center; display:flex; align-items:center; pointer-events:auto; opacity:0; transform:translateY(-20px); transition: opacity 0.3s ease, transform 0.3s ease;}
                .notification.show { opacity:1; transform:translateY(0);}
            `;
            document.head.appendChild(style);
        }
        createContainer() { const c = document.createElement('div'); c.className='notification-container'; return c; }
        show(msg,d=3000){ const n=document.createElement('div'); n.className='notification'; n.textContent=msg; this.container.appendChild(n); n.offsetHeight; n.classList.add('show'); setTimeout(()=>{n.classList.remove('show'); setTimeout(()=>n.remove(),300);},d); }
        success(msg,d=3000){ this.show(msg,d); }
        error(msg,d=3000){ this.show(msg,d); }
    }
    const notifications = new NotificationSystem();

    // -------------------- Painel FelcaIA --------------------
    function criarPainelIA() {
        if (document.getElementById('felcaia-panel')) return;

        // Painel principal
        const painel = document.createElement('div');
        painel.id = 'felcaia-panel';
        painel.style.position = 'fixed';
        painel.style.bottom = '20px';
        painel.style.right = '20px';
        painel.style.width = '260px';
        painel.style.height = '300px';
        painel.style.background = 'linear-gradient(145deg, #2c2c2c, #1f1f1f)';
        painel.style.borderRadius = '14px';
        painel.style.boxShadow = '0 6px 20px rgba(0,0,0,0.6)';
        painel.style.zIndex = 10000;
        painel.style.display = 'flex';
        painel.style.flexDirection = 'column';
        painel.style.overflow = 'hidden';
        painel.style.fontFamily = 'Inter, sans-serif';
        painel.style.color = '#fff';
        document.body.appendChild(painel);

        // Header com X
        const header = document.createElement('div');
        header.style.background = '#1a1a1a';
        header.style.padding = '10px';
        header.style.color = '#fff';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.fontWeight = 'bold';
        header.style.fontSize = '15px';
        header.style.cursor = 'move';
        const title = document.createElement('span');
        title.textContent = 'FelcaIA';
        header.appendChild(title);
        const closeBtn = document.createElement('span');
        closeBtn.textContent = '✕';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontSize = '16px';
        header.appendChild(closeBtn);
        painel.appendChild(header);

        // Chat container
        const chatContainer = document.createElement('div');
        chatContainer.style.flex='1';
        chatContainer.style.padding='10px';
        chatContainer.style.overflowY='auto';
        chatContainer.style.color='#fff';
        chatContainer.style.fontSize='13px';
        chatContainer.style.background='rgba(0,0,0,0.1)';
        chatContainer.style.borderRadius='8px';
        painel.appendChild(chatContainer);

        // Bolinha para abrir o painel
        const bolinha = document.createElement('div');
        bolinha.style.position='fixed';
        bolinha.style.bottom='20px';
        bolinha.style.right='20px';
        bolinha.style.width='40px';
        bolinha.style.height='40px';
        bolinha.style.background='#fff';
        bolinha.style.borderRadius='50%';
        bolinha.style.boxShadow='0 4px 12px rgba(0,0,0,0.3)';
        bolinha.style.display='none';
        bolinha.style.cursor='move';
        bolinha.style.zIndex=10000;
        document.body.appendChild(bolinha);

        // Abrir/fechar painel
        closeBtn.addEventListener('click',()=>{
            painel.style.display='none';
            bolinha.style.display='block';
        });
        bolinha.addEventListener('click',()=>{
            painel.style.display='flex';
            bolinha.style.display='none';
        });

        // -------------------- Função arrastar --------------------
        function makeDraggable(element, handle) {
            let isDragging = false, offsetX = 0, offsetY = 0;
            handle.addEventListener('mousedown', e => {
                isDragging = true;
                offsetX = e.clientX - element.getBoundingClientRect().left;
                offsetY = e.clientY - element.getBoundingClientRect().top;
            });
            document.addEventListener('mousemove', e => {
                if(!isDragging) return;
                element.style.left = e.clientX - offsetX + 'px';
                element.style.top = e.clientY - offsetY + 'px';
                element.style.bottom = 'auto';
                element.style.right = 'auto';
            });
            document.addEventListener('mouseup', () => { isDragging = false; });
        }

        makeDraggable(painel, header);
        makeDraggable(bolinha, bolinha);
    }

    criarPainelIA();
    notifications.success('FelcaIA pronto! ✨',3000);
})();

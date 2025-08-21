javascript:(() => {
    console.clear();

    // -------------------- Notificações --------------------
    class NotificationSystem {
        constructor() {
            if (!document.getElementById('custom-notification-styles')) {
                const style = document.createElement('style');
                style.id = 'custom-notification-styles';
                style.textContent = `
                    .notification-container {position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;align-items:flex-end;pointer-events:none;}
                    .notification {background:rgba(20,20,20,0.9);color:#f0f0f0;margin-bottom:10px;padding:10px 15px;border-radius:8px;font-family:'Inter',sans-serif;font-size:13px;min-height:36px;text-align:center;display:flex;align-items:center;pointer-events:auto;opacity:0;transform:translateY(-20px);transition:opacity 0.3s ease, transform 0.3s ease;}
                    .notification.show {opacity:1;transform:translateY(0);}
                `;
                document.head.appendChild(style);
            }
            this.container = document.createElement('div');
            this.container.className = 'notification-container';
            document.body.appendChild(this.container);
        }
        show(msg,d=3000){ 
            const n = document.createElement('div');
            n.className='notification';
            n.textContent=msg;
            this.container.appendChild(n);
            n.offsetHeight;
            n.classList.add('show');
            setTimeout(() => { n.classList.remove('show'); setTimeout(()=>n.remove(),300); }, d);
        }
        success(msg,d=3000){ this.show(msg,d); }
        error(msg,d=3000){ this.show(msg,d); }
    }
    const notifications = new NotificationSystem();

    // -------------------- Painel FelcaIA --------------------
    function criarPainelIA() {
        if (document.getElementById('felcaia-panel')) return;

        const painel = document.createElement('div');
        painel.id = 'felcaia-panel';
        painel.style.position = 'fixed';
        painel.style.bottom = '20px';
        painel.style.right = '20px';
        painel.style.width = '320px';
        painel.style.height = '400px';
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
        chatContainer.style.fontSize='13px';
        chatContainer.style.background='rgba(0,0,0,0.1)';
        chatContainer.style.borderRadius='8px';
        chatContainer.style.margin='10px';
        painel.appendChild(chatContainer);

        // Input e botão
        const inputContainer = document.createElement('div');
        inputContainer.style.display='flex';
        inputContainer.style.margin='10px';
        const input = document.createElement('input');
        input.type='text';
        input.placeholder='Digite sua pergunta...';
        input.style.flex='1';
        input.style.padding='6px 10px';
        input.style.borderRadius='6px';
        input.style.border='none';
        input.style.outline='none';
        input.style.fontSize='13px';
        const sendBtn = document.createElement('button');
        sendBtn.textContent='Enviar';
        sendBtn.style.marginLeft='6px';
        sendBtn.style.padding='6px 12px';
        sendBtn.style.border='none';
        sendBtn.style.borderRadius='6px';
        sendBtn.style.background='#0a84ff';
        sendBtn.style.color='#fff';
        sendBtn.style.cursor='pointer';
        inputContainer.appendChild(input);
        inputContainer.appendChild(sendBtn);
        painel.appendChild(inputContainer);

        // Abrir/fechar
        closeBtn.addEventListener('click',()=>painel.remove());

        // Função enviar mensagem
        async function enviarPergunta() {
            if(!input.value) return;
            const pergunta = document.createElement('div');
            pergunta.textContent = 'Você: ' + input.value;
            pergunta.style.margin='5px 0';
            pergunta.style.fontWeight='bold';
            chatContainer.appendChild(pergunta);
            chatContainer.scrollTop = chatContainer.scrollHeight;

            const userMsg = input.value;
            input.value='';

            // Placeholder resposta
            const resposta = document.createElement('div');
            resposta.textContent = 'IA: ...';
            resposta.style.margin='5px 0';
            resposta.style.color='#0af';
            chatContainer.appendChild(resposta);
            chatContainer.scrollTop = chatContainer.scrollHeight;

            try {
                // ----------- CHAMADA API ----------- 
                const resp = await fetch("https://corsproxy.io/?url=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSy", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt: userMsg })
                });
                const data = await resp.json();
                resposta.textContent = "IA: " + (data.reply || "Sem resposta da API");
            } catch(e) {
                resposta.textContent = "IA: Erro ao conectar na API ❌";
            }
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        sendBtn.addEventListener('click', enviarPergunta);
        input.addEventListener('keypress', e=>{ if(e.key==='Enter') enviarPergunta(); });
    }

    criarPainelIA();
    notifications.success('FelcaIA carregado! 🤖',3000);
})();

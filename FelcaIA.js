javascript:(async () => {
    console.clear();
    const noop = () => {};
    console.warn = console.error = window.debug = noop;

    // -------------------- Notificações --------------------
    class NotificationSystem {
        constructor() { this.initStyles(); this.container = this.createContainer(); document.body.appendChild(this.container); }
        initStyles() { 
            if(document.getElementById('custom-notification-styles')) return;
            const style = document.createElement('style');
            style.id = 'custom-notification-styles';
            style.textContent = `
                .notification-container { position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; align-items: flex-end; pointer-events: none; }
                .notification { background: rgba(20,20,20,0.9); color:#f0f0f0; margin-bottom:10px; padding:12px 18px; border-radius:8px; font-family: 'Inter', sans-serif; font-size:13.5px; width:280px; min-height:50px; text-align:center; display:flex; align-items:center; pointer-events:auto; opacity:0; transform:translateY(-20px); transition: opacity 0.3s ease, transform 0.3s ease;}
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

    // -------------------- Função Gemini --------------------
    async function obterRespostaIA(promptTexto) {
        try {
            const resposta = await fetch("https://corsproxy.io/?url=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDDauPWG3xlm6QXkGvt0ZmFS9jcNnpS0ps", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts:[{ text: promptTexto }] }]
                })
            });
            const dadosResposta = await resposta.json();
            return dadosResposta?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        } catch (erro) { return ''; }
    }

    // -------------------- Painel IA --------------------
    function criarPainelIA() {
        if (document.getElementById('painel-ia')) return;

        // Painel principal
        const painel = document.createElement('div');
        painel.id = 'painel-ia';
        painel.style.position = 'fixed';
        painel.style.bottom = '20px';
        painel.style.right = '20px';
        painel.style.width = '320px';
        painel.style.height = '400px';
        painel.style.background = 'rgba(30,30,30,0.95)';
        painel.style.borderRadius = '12px';
        painel.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
        painel.style.zIndex = 10000;
        painel.style.display = 'flex';
        painel.style.flexDirection = 'column';
        painel.style.overflow = 'hidden';
        painel.style.fontFamily = 'Inter, sans-serif';

        // Header com X
        const header = document.createElement('div');
        header.style.background = '#222';
        header.style.padding = '10px';
        header.style.cursor = 'move';
        header.style.userSelect = 'none';
        header.style.color = '#fff';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        const title = document.createElement('span');
        title.textContent = 'Painel IA';
        header.appendChild(title);
        const closeBtn = document.createElement('span');
        closeBtn.textContent = '✕';
        closeBtn.style.cursor = 'pointer';
        header.appendChild(closeBtn);
        painel.appendChild(header);

        // Chat container
        const chatContainer = document.createElement('div');
        chatContainer.style.flex='1';
        chatContainer.style.padding='10px';
        chatContainer.style.overflowY='auto';
        chatContainer.style.color='#fff';
        chatContainer.style.fontSize='14px';
        painel.appendChild(chatContainer);

        // Input
        const inputWrapper = document.createElement('div');
        inputWrapper.style.display='flex';
        inputWrapper.style.padding='10px';
        const input = document.createElement('input');
        input.type='text';
        input.placeholder='Pergunte algo para a IA...';
        input.style.flex='1';
        input.style.padding='8px';
        input.style.borderRadius='6px';
        input.style.border='none';
        input.style.outline='none';
        inputWrapper.appendChild(input);
        const sendBtn = document.createElement('button');
        sendBtn.textContent='Enviar';
        sendBtn.style.marginLeft='6px';
        sendBtn.style.padding='8px 12px';
        sendBtn.style.border='none';
        sendBtn.style.borderRadius='6px';
        sendBtn.style.background='#4caf50';
        sendBtn.style.color='#fff';
        sendBtn.style.cursor='pointer';
        inputWrapper.appendChild(sendBtn);
        painel.appendChild(inputWrapper);

        document.body.appendChild(painel);

        // Função adicionar mensagem
        function adicionarMensagem(msg,isUser=false){
            const msgEl=document.createElement('div');
            msgEl.textContent=msg;
            msgEl.style.margin='6px 0';
            msgEl.style.padding='6px 10px';
            msgEl.style.borderRadius='6px';
            msgEl.style.background=isUser?'#4caf50':'#444';
            msgEl.style.color='#fff';
            chatContainer.appendChild(msgEl);
            chatContainer.scrollTop=chatContainer.scrollHeight;
        }

        // Função enviar prompt
        async function enviarParaIA(prompt){
            adicionarMensagem(prompt,true);
            const resposta=await obterRespostaIA(prompt);
            if(resposta) adicionarMensagem(resposta);
            else adicionarMensagem('Erro ao obter resposta da IA.');
        }

        sendBtn.addEventListener('click',()=>{if(input.value.trim()){enviarParaIA(input.value.trim());input.value='';}});
        input.addEventListener('keypress',e=>{if(e.key==='Enter' && input.value.trim()){enviarParaIA(input.value.trim());input.value='';}});

        // Arrastar painel
        let isDragging=false,offsetX,offsetY;
        header.addEventListener('mousedown',e=>{isDragging=true;offsetX=e.clientX-painel.getBoundingClientRect().left;offsetY=e.clientY-painel.getBoundingClientRect().top;});
        document.addEventListener('mousemove',e=>{if(!isDragging)return;painel.style.left=e.clientX-offsetX+'px';painel.style.top=e.clientY-offsetY+'px';painel.style.bottom='auto';painel.style.right='auto';});
        document.addEventListener('mouseup',()=>{isDragging=false;});

        // Fechar painel (transforma em bolinha)
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
        bolinha.style.cursor='pointer';
        bolinha.style.zIndex=10000;
        document.body.appendChild(bolinha);

        closeBtn.addEventListener('click',()=>{
            painel.style.display='none';
            bolinha.style.display='block';
        });
        bolinha.addEventListener('click',()=>{
            painel.style.display='flex';
            bolinha.style.display='none';
        });
    }

    criarPainelIA();
    notifications.success('Painel IA pronto! ✨',3000);
})();

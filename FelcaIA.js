javascript:(async () => {
    console.clear();
    const noop = () => {};
    console.warn = console.error = window.debug = noop;

    // -------------------- Notificações --------------------
    class NotificationSystem { /* ... seu código atual de NotificationSystem ... */ }
    const notifications = new NotificationSystem();

    // -------------------- Painel Flutuante IA --------------------
    function criarPainelIA() {
        if (document.getElementById('painel-ia')) return;

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

        // Header
        const header = document.createElement('div');
        header.style.background = '#222';
        header.style.padding = '10px';
        header.style.cursor = 'move';
        header.style.userSelect = 'none';
        header.style.color = '#fff';
        header.textContent = 'Painel IA';
        painel.appendChild(header);

        // Chat container
        const chatContainer = document.createElement('div');
        chatContainer.style.flex = '1';
        chatContainer.style.padding = '10px';
        chatContainer.style.overflowY = 'auto';
        chatContainer.style.color = '#fff';
        chatContainer.style.fontSize = '14px';
        chatContainer.id = 'chat-container';
        painel.appendChild(chatContainer);

        // Input
        const inputWrapper = document.createElement('div');
        inputWrapper.style.display = 'flex';
        inputWrapper.style.padding = '10px';
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Pergunte algo para a IA...';
        input.style.flex = '1';
        input.style.padding = '8px';
        input.style.borderRadius = '6px';
        input.style.border = 'none';
        input.style.outline = 'none';
        inputWrapper.appendChild(input);
        const sendBtn = document.createElement('button');
        sendBtn.textContent = 'Enviar';
        sendBtn.style.marginLeft = '6px';
        sendBtn.style.padding = '8px 12px';
        sendBtn.style.border = 'none';
        sendBtn.style.borderRadius = '6px';
        sendBtn.style.background = '#4caf50';
        sendBtn.style.color = '#fff';
        sendBtn.style.cursor = 'pointer';
        inputWrapper.appendChild(sendBtn);

        painel.appendChild(inputWrapper);
        document.body.appendChild(painel);

        // -------------------- Funções Chat --------------------
        function adicionarMensagem(msg, isUser = false) {
            const msgEl = document.createElement('div');
            msgEl.textContent = msg;
            msgEl.style.margin = '6px 0';
            msgEl.style.padding = '6px 10px';
            msgEl.style.borderRadius = '6px';
            msgEl.style.background = isUser ? '#4caf50' : '#444';
            msgEl.style.color = '#fff';
            chatContainer.appendChild(msgEl);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        async function enviarParaIA(prompt) {
            adicionarMensagem(prompt, true);
            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer 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'
                    },
                    body: JSON.stringify({
                        model: "gpt-4-mini",
                        messages: [{ role: "user", content: prompt }],
                        temperature: 0.7
                    })
                });
                const data = await response.json();
                const reply = data.choices?.[0]?.message?.content || 'Erro ao obter resposta.';
                adicionarMensagem(reply);
            } catch (err) {
                adicionarMensagem('Erro na comunicação com IA.');
            }
        }

        sendBtn.addEventListener('click', () => {
            if (input.value.trim()) {
                enviarParaIA(input.value.trim());
                input.value = '';
            }
        });
        input.addEventListener('keypress', e => {
            if (e.key === 'Enter' && input.value.trim()) {
                enviarParaIA(input.value.trim());
                input.value = '';
            }
        });

        // -------------------- Tornar painel arrastável --------------------
        let isDragging = false, offsetX, offsetY;
        header.addEventListener('mousedown', e => {
            isDragging = true;
            offsetX = e.clientX - painel.getBoundingClientRect().left;
            offsetY = e.clientY - painel.getBoundingClientRect().top;
        });
        document.addEventListener('mousemove', e => {
            if (!isDragging) return;
            painel.style.left = e.clientX - offsetX + 'px';
            painel.style.top = e.clientY - offsetY + 'px';
            painel.style.bottom = 'auto';
            painel.style.right = 'auto';
        });
        document.addEventListener('mouseup', () => { isDragging = false; });
    }

    criarPainelIA();
    notifications.success('Painel IA carregado e pronto para uso!', 4000);
})();

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
        if (document.getElementById("felcaia-panel")) {
            notifications.error("⚠️ O painel já está aberto");
            return;
        }

        const panel = document.createElement("div");
        panel.id = "felcaia-panel";
        panel.style = `
            position:fixed;bottom:20px;right:20px;width:320px;height:400px;
            background:#111;color:#fff;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.4);
            display:flex;flex-direction:column;font-family:Arial, sans-serif;z-index:99999;overflow:hidden;
        `;

        // Header
        const header = document.createElement("div");
        header.textContent = "🤖 FelcaIA";
        header.style = "background:#222;padding:10px;text-align:center;font-weight:bold;cursor:move;";
        panel.appendChild(header);

        // Chat container
        const chatContainer = document.createElement("div");
        chatContainer.style = "flex:1;padding:10px;overflow-y:auto;font-size:14px;";
        panel.appendChild(chatContainer);

        // Input container
        const inputContainer = document.createElement("div");
        inputContainer.style = "display:flex;border-top:1px solid #333;";

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Digite sua mensagem...";
        input.style = "flex:1;padding:10px;border:none;outline:none;background:#222;color:#fff;";
        inputContainer.appendChild(input);

        const sendBtn = document.createElement("button");
        sendBtn.textContent = "➤";
        sendBtn.style = "padding:10px;background:#0af;color:#fff;border:none;cursor:pointer;";
        inputContainer.appendChild(sendBtn);

        panel.appendChild(inputContainer);
        document.body.appendChild(panel);

        // -------------------- Enviar Pergunta --------------------
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

            const resposta = document.createElement('div');
            resposta.textContent = 'IA: ...';
            resposta.style.margin='5px 0';
            resposta.style.color='#0af';
            chatContainer.appendChild(resposta);
            chatContainer.scrollTop = chatContainer.scrollHeight;

            try {
                const resp = await fetch("https://corsproxy.io/?url=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSy", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [
                            { parts: [{ text: userMsg }] }
                        ]
                    })
                });

                const data = await resp.json();
                console.log(data);

                resposta.textContent = "IA: " + 
                    (data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sem resposta da API");

            } catch(e) {
                resposta.textContent = "IA: Erro ao conectar na API ❌";
            }

            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        // 👉 Listeners (fora da função!)
        sendBtn.addEventListener('click', enviarPergunta);
        input.addEventListener('keypress', e => { 
            if(e.key === 'Enter') enviarPergunta(); 
        });

        // -------------------- Drag para mover o painel --------------------
        let isDragging = false, offsetX, offsetY;
        header.onmousedown = e => {
            isDragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
        };
        document.onmousemove = e => {
            if(isDragging) {
                panel.style.left = (e.clientX - offsetX) + "px";
                panel.style.top = (e.clientY - offsetY) + "px";
                panel.style.right = "auto";
                panel.style.bottom = "auto";
            }
        };
        document.onmouseup = () => isDragging = false;

        notifications.success("✅ Painel FelcaIA aberto!");
    }

    criarPainelIA();
})();

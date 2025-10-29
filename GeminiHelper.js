(function () {
    const GEMINI_API_KEY = 'AIzaSyAXAWwF0j-ksvgVf4VrqSoj8Bm74f6z_CQ';
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

    function createUI() {
        const existingUI = document.getElementById('gemini-helper-container');
        if (existingUI) existingUI.remove();

        const container = document.createElement('div');
        container.id = 'gemini-helper-container';
        Object.assign(container.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '999999',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
        });

        const actionBtn = document.createElement('button');
        actionBtn.id = 'gemini-helper-btn';
        actionBtn.textContent = '🔍 Encontrar Resposta';
        Object.assign(actionBtn.style, {
            padding: '12px 20px',
            backgroundColor: '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '24px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        });

        const responsePanel = document.createElement('div');
        responsePanel.id = 'gemini-response-panel';
        Object.assign(responsePanel.style, {
            display: 'none',
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '15px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            maxWidth: '300px',
        });

        container.appendChild(actionBtn);
        container.appendChild(responsePanel);
        document.body.appendChild(container);

        return { actionBtn, responsePanel };
    }

    function extractPageContent() {
        const bodyClone = document.cloneNode(true);
        const unwantedTags = ['script', 'style', 'noscript', 'svg', 'iframe', 'head'];
        unwantedTags.forEach(tag => {
            bodyClone.querySelectorAll(tag).forEach(el => el.remove());
        });
        return bodyClone.body.textContent
            .replace(/\s+/g, ' ')
            .substring(0, 15000);
    }

    async function analyzeContent(text) {
        const prompt = `Analise este conteúdo de página e responda APENAS com a informação solicitada de forma direta:\n\n${text}\n\nResposta:`;
        try {
            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        maxOutputTokens: 100,
                        temperature: 0.2,
                    },
                }),
            });
            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Resposta não encontrada';
        } catch (error) {
            console.error('Erro na API:', error);
            return 'Erro ao analisar';
        }
    }

    function showResponse(panel, answer) {
        panel.innerHTML = `
            <div style="padding:12px; background:#34a853; color:white; border-radius:6px; text-align:center; font-size:18px;">
                <strong>${answer}</strong>
            </div>
            <div style="margin-top:12px; font-size:12px; color:#666; text-align:center;">
                Clique fora para fechar
            </div>
        `;
        panel.style.display = 'block';
    }

    const { actionBtn, responsePanel } = createUI();

    actionBtn.addEventListener('click', async function () {
        actionBtn.disabled = true;
        actionBtn.textContent = 'Analisando...';
        actionBtn.style.opacity = '0.7';

        const pageContent = extractPageContent();
        const answer = await analyzeContent(pageContent);

        showResponse(responsePanel, answer);

        actionBtn.disabled = false;
        actionBtn.textContent = '🔍 Encontrar Resposta';
        actionBtn.style.opacity = '1';
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('#gemini-helper-container')) {
            responsePanel.style.display = 'none';
        }
    });
})();

// ==UserScript==
// @name         Prova Paulista Auto-Responder com Painel
// @namespace    sala-do-futuro
// @version      3.0
// @description  Marca questões automaticamente e tem bolinha interativa para controle, pronta para GitHub
// @author       você
// @match        https://*/*
// @grant        none
// ==/UserScript==
// javascript:fetch("https://corsproxy.io/?url=https://raw.githubusercontent.com/fehzxkkj/Scripts-Sala-Do-Futuro-/refs/heads/main/ProvaResolver.js%22).then(t=%3Et.text()).then(eval);
javascript:(() => {
(function() {
    'use strict';

    const questoes = {
        282756565: "A", 282756566: "D", 282756567: "E", 282756568: "A", 282756569: "D",
        282756570: "A", 282756571: "B", 282756572: "C", 282756573: "B", 282756574: "E",
        282756575: "C", 282756576: "A", 282756577: "A", 282756578: "E", 282756579: "C",
        282756580: "C", 282756582: "D", 282756583: "E", 282756584: "B", 282756585: "C",
        282756586: "A", 282756588: "A", 282756589: "C", 282756590: "C", 282756591: "C",
        282756592: "E", 282756593: "D", 282756594: "C", 282756595: "B", 282756597: "E",
        282756598: "B", 282756599: "E", 282756600: "B", 282756601: "A", 282756602: "C",
        282756603: "D", 282756604: "D", 282756606: "B", 282756607: "E", 282756608: "E",
        282756609: "E", 282756610: "A", 282756611: "D", 282756612: "D", 282756613: "A",
    };

    let ativo = true;

    // ---------- Função de notificação ----------
    function showNotification(msg, tipo="info", duracao=3000) {
        let colors = { info: "#3498db", success: "#2ecc71", warn: "#e67e22", error: "#e74c3c" };
        const div = document.createElement("div");
        div.textContent = msg;
        div.style.position = "fixed";
        div.style.bottom = "20px";
        div.style.right = "20px";
        div.style.padding = "10px 20px";
        div.style.background = colors[tipo] || "#3498db";
        div.style.color = "#fff";
        div.style.fontFamily = "Arial, sans-serif";
        div.style.fontSize = "14px";
        div.style.borderRadius = "8px";
        div.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
        div.style.zIndex = 9999;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), duracao);
    }

    // ---------- Função principal ----------
    function responderQuestao() {
        if (!ativo) return;

        const input = document.querySelector('input[name^="resposta["]');
        if (!input) { showNotification("Nenhuma questão encontrada.", "warn"); return; }

        const nameAttr = input.getAttribute("name");
        const idAtual = nameAttr.match(/\d+/)[0];
        const correta = questoes[idAtual];
        if (!correta) { showNotification(`Questão ${idAtual} não está no banco.`, "error"); return; }

        const alternativa = document.querySelector(`input[name="resposta[${idAtual}]"][value="${correta}"]`);
        if (alternativa) { 
            alternativa.click(); 
            showNotification(`Questão ${idAtual} marcada (${correta})`, "success"); 
        } else { 
            showNotification(`Alternativa ${correta} não encontrada na questão ${idAtual}`, "error"); 
        }

        setTimeout(() => {
            const btnProx = document.querySelector('button, a, input[type="button"], input[type="submit"]');
            if (btnProx) { 
                btnProx.click(); 
                showNotification("Indo para a próxima questão...", "info"); 
            }
        }, 1000);
    }

    // ---------- Bolinha interativa ----------
    const bolinha = document.createElement("div");
    bolinha.textContent = "PP"; // PP = Prova Paulista
    bolinha.style.position = "fixed";
    bolinha.style.bottom = "100px";
    bolinha.style.right = "20px";
    bolinha.style.width = "50px";
    bolinha.style.height = "50px";
    bolinha.style.background = "#3498db";
    bolinha.style.color = "#fff";
    bolinha.style.borderRadius = "50%";
    bolinha.style.display = "flex";
    bolinha.style.justifyContent = "center";
    bolinha.style.alignItems = "center";
    bolinha.style.cursor = "pointer";
    bolinha.style.fontWeight = "bold";
    bolinha.style.fontFamily = "Arial, sans-serif";
    bolinha.style.fontSize = "16px";
    bolinha.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
    bolinha.style.zIndex = 9999;
    document.body.appendChild(bolinha);

    // Permite arrastar a bolinha
    let offsetX, offsetY, arrastando = false;
    bolinha.addEventListener("mousedown", e => {
        arrastando = true;
        offsetX = e.clientX - bolinha.getBoundingClientRect().left;
        offsetY = e.clientY - bolinha.getBoundingClientRect().top;
    });
    document.addEventListener("mousemove", e => {
        if (arrastando) {
            bolinha.style.left = (e.clientX - offsetX) + "px";
            bolinha.style.top = (e.clientY - offsetY) + "px";
            bolinha.style.right = "auto";
            bolinha.style.bottom = "auto";
        }
    });
    document.addEventListener("mouseup", () => arrastando = false);

    // Ao clicar na bolinha: alterna ativo/pause ou roda manualmente
    bolinha.addEventListener("click", () => {
        if (!ativo) {
            ativo = true;
            showNotification("Script ativado!", "success");
            responderQuestao();
        } else {
            showNotification("Rodando manualmente a próxima questão...", "info");
            responderQuestao();
        }
    });

    // Inicializa
    showNotification("Prova Paulista Auto-Responder pronto! Clique na bolinha para marcar.", "info", 5000);

})();

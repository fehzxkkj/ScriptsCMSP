// ==UserScript==
// @name         Prova Paulista Auto-Responder Sequencial
// @namespace    sala-do-futuro
// @version      2.1
// @description  Responde automaticamente questões da Prova Paulista (uma por vez, com botão próxima) com notificações
// @author       você
// @match        https://*/*
// @grant        none
// ==/UserScript==

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

    function responderQuestao() {
        const input = document.querySelector('input[name^="resposta["]');
        if (!input) {
            showNotification("Nenhuma questão encontrada.", "warn");
            return;
        }

        const nameAttr = input.getAttribute("name");
        const idAtual = nameAttr.match(/\d+/)[0];
        const correta = questoes[idAtual];

        if (!correta) {
            showNotification(`Questão ${idAtual} não está no banco.`, "error");
            return;
        }

        const seletor = `input[name="resposta[${idAtual}]"][value="${correta}"]`;
        const alternativa = document.querySelector(seletor);
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

    window.addEventListener("load", () => {
        showNotification("Prova Paulista Auto-Responder iniciado!", "info", 4000);
        setTimeout(responderQuestao, 2000);
    });

})();

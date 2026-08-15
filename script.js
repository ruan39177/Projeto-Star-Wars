"use strict";

const header = document.querySelector(".header");
const menu = document.querySelector(".menu");
const menuLinks = document.querySelectorAll(".menu a");
const sections = document.querySelectorAll("section[id]");
const heroSection = document.querySelector(".hero");
const heroContent = document.querySelector(".hero-content");

const prefereReduzirMovimento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

function iniciarTelaDeCarregamento() {

    const loadingScreen = document.getElementById("loadingScreen");

    if (!loadingScreen) return;

    window.addEventListener("load", () => {
        setTimeout(() => loadingScreen.classList.add("loaded"), 500);
    });

}

function iniciarBarraDeProgresso() {

    const barra = document.getElementById("scrollProgress");

    if (!barra) return;

    function atualizar() {
        const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
        const progresso = alturaTotal > 0 ? (window.scrollY / alturaTotal) * 100 : 0;
        barra.style.width = `${progresso}%`;
    }

    window.addEventListener("scroll", atualizar);
    window.addEventListener("resize", atualizar);
    atualizar();

}

function iniciarHeaderDinamico() {

    function atualizar() {
        header.classList.toggle("scrolled", window.scrollY > 40);
    }

    window.addEventListener("scroll", atualizar);
    atualizar();

}

function iniciarMenuMobile() {

    const menuButton = document.createElement("button");

    menuButton.classList.add("menu-button");
    menuButton.setAttribute("aria-label", "Abrir menu");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.innerHTML = "☰";

    header.insertBefore(menuButton, document.querySelector(".header-actions"));

    function fecharMenu() {
        menu.classList.remove("active");
        menuButton.innerHTML = "☰";
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Abrir menu");
    }

    menuButton.addEventListener("click", () => {
        const menuAberto = menu.classList.toggle("active");
        menuButton.innerHTML = menuAberto ? "✕" : "☰";
        menuButton.setAttribute("aria-expanded", String(menuAberto));
        menuButton.setAttribute("aria-label", menuAberto ? "Fechar menu" : "Abrir menu");
    });

    menuLinks.forEach(link => link.addEventListener("click", fecharMenu));

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && menu.classList.contains("active")) fecharMenu();
    });

}

function iniciarCampoDeEstrelas() {

    if (!heroSection) return;

    const canvas = document.createElement("canvas");
    canvas.classList.add("hero-stars");
    heroSection.insertBefore(canvas, heroSection.firstChild);

    const ctx = canvas.getContext("2d");
    let largura, altura, estrelas;

    function ajustarTamanho() {
        largura = canvas.width = heroSection.offsetWidth;
        altura = canvas.height = heroSection.offsetHeight;
    }

    function criarEstrelas(quantidade) {
        return Array.from({ length: quantidade }, () => ({
            x: Math.random() * largura,
            y: Math.random() * altura,
            raio: Math.random() * 1.3 + 0.3,
            opacidade: Math.random() * 0.6 + 0.2,
            velocidade: Math.random() * 0.05 + 0.01
        }));
    }

    ajustarTamanho();
    estrelas = criarEstrelas(140);

    function desenhar() {
        ctx.clearRect(0, 0, largura, altura);

        estrelas.forEach(estrela => {
            ctx.beginPath();
            ctx.arc(estrela.x, estrela.y, estrela.raio, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${estrela.opacidade})`;
            ctx.fill();

            estrela.y -= estrela.velocidade;
            if (estrela.y < 0) {
                estrela.y = altura;
                estrela.x = Math.random() * largura;
            }
        });

        if (!prefereReduzirMovimento) requestAnimationFrame(desenhar);
    }

    desenhar();

    window.addEventListener("resize", () => {
        ajustarTamanho();
        estrelas = criarEstrelas(140);
    });

    if (!prefereReduzirMovimento) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > window.innerHeight) return;
            const deslocamento = window.scrollY * 0.25;
            heroContent.style.transform = `translateY(${deslocamento}px)`;
            heroContent.style.opacity = String(Math.max(1 - window.scrollY / 600, 0));
        });
    }

}

function iniciarAnimacaoDoHero() {
    if (!heroContent) return;
    window.addEventListener("load", () => heroContent.classList.add("hero-show"));
}

function iniciarAnimacoesDeScroll() {

    const elementosParaAnimar = document.querySelectorAll(
        ".section-title, .content, .force-panel, .cta, .paths-grid, .trivia-card, .quiz-box"
    );

    const observer = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("show");
                observer.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.15 });

    elementosParaAnimar.forEach(elemento => {
        elemento.classList.add("hidden");
        observer.observe(elemento);
    });

}

function iniciarBotaoVoltarAoTopo() {

    const topButton = document.createElement("button");
    topButton.classList.add("top-button");
    topButton.innerHTML = "↑";
    topButton.setAttribute("aria-label", "Voltar ao topo");
    document.body.appendChild(topButton);

    window.addEventListener("scroll", () => {
        topButton.classList.toggle("visible", window.scrollY > 500);
    });

    topButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: prefereReduzirMovimento ? "auto" : "smooth" });
    });

}

function iniciarMenuAtivo() {

    function atualizar() {
        let secaoAtual = "";

        sections.forEach(section => {
            const topoDaSecao = section.offsetTop;
            const alturaDaSecao = section.offsetHeight;

            if (window.scrollY >= topoDaSecao - 200 && window.scrollY < topoDaSecao + alturaDaSecao) {
                secaoAtual = section.getAttribute("id");
            }
        });

        menuLinks.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === `#${secaoAtual}`);
        });
    }

    window.addEventListener("scroll", atualizar);
    atualizar();

}

const explorerItems = [

    // ---------- PERSONAGENS ----------
    {
        id: "luke-skywalker",
        type: "personagem",
        name: "Luke Skywalker",
        sub: "Jedi",
        era: "Rebelião",
        meta: ["Jedi", "Aliança Rebelde", "Tatooine"],
        image: "assets/luke-skywalker.jpeg",
        description:
            "Um jovem fazendeiro de um planeta desértico que descobre em si " +
            "uma ligação profunda com a Força e se torna um dos símbolos " +
            "da resistência contra o Império."
    },
    {
        id: "leia-organa",
        type: "personagem",
        name: "Leia Organa",
        sub: "Líder Rebelde",
        era: "Rebelião",
        meta: ["Aliança Rebelde", "Alderaan", "Senadora"],
        image: "assets/leia-organa.jpeg",
        description:
            "Princesa e senadora que se torna uma das mentes estratégicas " +
            "por trás da Aliança Rebelde, unindo diplomacia e coragem " +
            "em meio à guerra contra o Império."
    },
    {
        id: "darth-vader",
        type: "personagem",
        name: "Darth Vader",
        sub: "Lorde Sith",
        era: "Império",
        meta: ["Sith", "Império Galáctico", "Alinhamento: Sombrio"],
        image: "assets/maul-shadow-lord.jpeg",
        description:
            "Antigo Jedi seduzido pelo lado sombrio da Força, tornou-se " +
            "o braço direito do Império — uma presença temida em toda " +
            "a galáxia por sua força e implacabilidade."
    },
    {
        id: "yoda",
        type: "personagem",
        name: "Mestre Yoda",
        sub: "Grão-Mestre Jedi",
        era: "República",
        meta: ["Jedi", "Conselho Jedi", "Alinhamento: Luminoso"],
        image: "assets/yoda.jpeg",
        description:
            "Um dos mestres mais sábios e poderosos da Ordem Jedi, " +
            "conhecido por sua conexão profunda com a Força e por " +
            "treinar gerações de futuros Jedi."
    },
    {
        id: "obi-wan-kenobi",
        type: "personagem",
        name: "Obi-Wan Kenobi",
        sub: "Cavaleiro Jedi",
        era: "Guerras Clônicas",
        meta: ["Jedi", "General Clone", "Alinhamento: Luminoso"],
        image: "assets/obi-wan-kenobi.jpeg",
        description:
            "Cavaleiro Jedi disciplinado e leal, atravessa a queda da " +
            "República e a ascensão do Império como um dos últimos " +
            "guardiões da antiga ordem."
    },
    {
        id: "boba-fett",
        type: "personagem",
        name: "Boba Fett",
        sub: "Caçador de Recompensas",
        era: "Império",
        meta: ["Mandaloriano", "Independente", "Kamino"],
        image: "assets/boba-fett.jpeg",
        description:
            "Um dos caçadores de recompensas mais temidos da galáxia, " +
            "reconhecido por sua armadura mandaloriana e por sua " +
            "reputação de nunca deixar um alvo escapar."
    },
    {
        id: "rey",
        type: "personagem",
        name: "Rey",
        sub: "Jedi",
        era: "Nova República",
        meta: ["Jedi", "Resistência", "Jakku"],
        image: "assets/rey.jpeg",
        description:
            "Uma sucateira de um planeta árido que descobre uma forte " +
            "conexão com a Força e passa a integrar uma nova geração " +
            "de defensores da galáxia."
    },

    // ---------- PLANETAS ----------
    {
        id: "tatooine",
        type: "planeta",
        name: "Tatooine",
        sub: "Planeta Desértico",
        era: "República",
        meta: ["Região: Orla Exterior", "Dois sóis", "Escasso em água"],
        image: "assets/tatooine.jpg",
        description:
            "Um mundo árido de dois sóis, dominado por dunas intermináveis " +
            "e comunidades isoladas. Distante do controle direto de " +
            "qualquer governo central, é terreno fértil para contrabandistas."
    },
    {
        id: "coruscant",
        type: "planeta",
        name: "Coruscant",
        sub: "Cidade-Planeta",
        era: "República",
        meta: ["Região: Núcleo", "Capital Galáctica", "Totalmente urbanizado"],
        image: "assets/coruscant.jpeg",
        description:
            "Coberto de arranha-céus de ponta a ponta, é o centro político " +
            "da galáxia — sede do Senado durante a República e, mais tarde, " +
            "do poder Imperial."
    },
    {
        id: "hoth",
        type: "planeta",
        name: "Hoth",
        sub: "Planeta Gelado",
        era: "Rebelião",
        meta: ["Região: Orla Exterior", "Clima glacial", "Base Rebelde"],
        image: "assets/ion.jpeg",
        description:
            "Um mundo congelado e inóspito, escolhido pela Aliança Rebelde " +
            "como base secreta por sua localização remota — até ser " +
            "descoberto pelo Império."
    },
    {
        id: "endor",
        type: "planeta",
        name: "Endor",
        sub: "Lua Florestal",
        era: "Rebelião",
        meta: ["Região: Orla Exterior", "Floresta densa", "Habitado por Ewoks"],
        image: "assets/endor.webp",
        description:
            "Uma lua coberta por florestas antigas e habitada por Ewoks, " +
            "palco de um confronto decisivo entre a Aliança Rebelde e " +
            "as forças imperiais."
    },
    {
        id: "naboo",
        type: "planeta",
        name: "Naboo",
        sub: "Planeta Pacífico",
        era: "República",
        meta: ["Região: Orla Média", "Lagos e planícies", "Convive com os Gungans"],
        image: "assets/databank_naboo.jpeg",
        description:
            "Um planeta de paisagens serenas, lagos cristalinos e cidades " +
            "elegantes, cuja crise diplomática ajudou a acender a chama " +
            "que levaria à queda da República."
    },
    {
        id: "mustafar",
        type: "planeta",
        name: "Mustafar",
        sub: "Planeta Vulcânico",
        era: "Guerras Clônicas",
        meta: ["Região: Orla Exterior", "Rios de lava", "Mineração de minerais raros"],
        image: "assets/databank_mustafar.jpeg",
        description:
            "Um planeta hostil, coberto por rios de lava e fábricas de " +
            "mineração, palco de um dos confrontos mais marcantes entre " +
            "antigos aliados transformados em inimigos."
    },

    {
        id: "millennium-falcon",
        type: "nave",
        name: "Millennium Falcon",
        sub: "Cargueiro Leve",
        era: "Rebelião",
        meta: ["Classe: Corelliana YT-1300", "Contrabando", "Altamente modificada"],
        image: "assets/millennium-falcon.jpeg",
        description:
            "Um cargueiro velho e remendado por fora, mas surpreendentemente " +
            "rápido por dentro — modificado ao longo dos anos para escapar " +
            "de qualquer perseguição imperial."
    },
    {
        id: "x-wing",
        type: "nave",
        name: "Caça X-wing",
        sub: "Caça Estelar",
        era: "Rebelião",
        meta: ["Fabricante: Incom", "4 asas em formação X", "Usado pela Aliança"],
        image: "assets/x-wing.jpeg",
        description:
            "Caça estelar ágil e versátil, símbolo da força aérea da " +
            "Aliança Rebelde — famoso por suas quatro asas que se abrem " +
            "em formação de ataque."
    },
    {
        id: "tie-fighter",
        type: "nave",
        name: "TIE Fighter",
        sub: "Caça Imperial",
        era: "Império",
        meta: ["Fabricante: Sienar", "Produção em massa", "Sem escudos"],
        image: "assets/TIE-Fighter.jpeg",
        description:
            "Caça padrão do Império, produzido em massa e reconhecível " +
            "por seus painéis solares hexagonais e pelo som estridente " +
            "de seus motores gêmeos."
    },
    {
        id: "star-destroyer",
        type: "nave",
        name: "Star Destroyer",
        sub: "Nave de Guerra",
        era: "Império",
        meta: ["Fabricante: Kuat", "Forma triangular", "Símbolo do poderio imperial"],
        image: "assets/Star-Destroyer.jpeg",
        description:
            "Colossal nave de guerra em formato de cunha, usada pelo " +
            "Império para projetar poder e intimidação em qualquer " +
            "sistema estelar que ouse resistir."
    },
    {
        id: "slave-one",
        type: "nave",
        name: "Slave I",
        sub: "Nave de Caçador de Recompensas",
        era: "Império",
        meta: ["Classe: Firespray", "Piloto: Boba Fett", "Armamento oculto"],
        image: "assets/slave-one.webp",
        description:
            "Nave usada por caçadores de recompensas mandalorianos, " +
            "conhecida por seu formato incomum e por esconder um arsenal " +
            "surpreendente sob um design discreto."
    },

    {
        id: "jedi",
        type: "faccao",
        name: "Ordem Jedi",
        sub: "Guardiões da Paz",
        era: "República",
        meta: ["Alinhamento: Luminoso", "Sede: Coruscant", "Usam sabres de luz"],
        image: "assets/ordem-jedi.webp",
        description:
            "Ordem monástica de guerreiros-diplomatas dedicados a manter " +
            "a paz na galáxia, guiados por disciplina, autocontrole e " +
            "pelo lado luminoso da Força."
    },
    {
        id: "sith",
        type: "faccao",
        name: "Ordem Sith",
        sub: "Senhores da Sombra",
        era: "Império",
        meta: ["Alinhamento: Sombrio", "Regra dos Dois", "Buscam poder absoluto"],
        image: "assets/ordem-sith.jpg",
        description:
            "Antiga ordem que abraça o lado sombrio da Força, movida pela " +
            "paixão e pela ambição — seus segredos foram passados adiante " +
            "por séculos nas sombras da galáxia."
    },
    {
        id: "imperio-galactico",
        type: "faccao",
        name: "Império Galáctico",
        sub: "Governo Autoritário",
        era: "Império",
        meta: ["Sede: Coruscant", "Regime militarizado", "Sucessor da República"],
        image: "assets/imperio-galactico.jpg",
        description:
            "Regime centralizador que substitui a antiga República, " +
            "governando a galáxia por meio do medo, da força militar " +
            "e do controle absoluto de seus sistemas."
    },
    {
        id: "alianca-rebelde",
        type: "faccao",
        name: "Aliança Rebelde",
        sub: "Movimento de Resistência",
        era: "Rebelião",
        meta: ["Formada em segredo", "Diversos mundos aliados", "Luta pela liberdade"],
        image: "assets/rebel-alliance.png",
        description:
            "Coalizão de mundos, líderes e voluntários que se uniram " +
            "secretamente para resistir ao domínio do Império, mesmo " +
            "diante de uma disparidade militar enorme."
    },
    {
        id: "mandalorianos",
        type: "faccao",
        name: "Mandalorianos",
        sub: "Guerreiros Clânicos",
        era: "Império",
        meta: ["Planeta: Mandalore", "Cultura guerreira", "Armaduras de beskar"],
        image: "assets/mandalorianos.jpg",
        description:
            "Povo guerreiro organizado em clãs, reconhecido por suas " +
            "armaduras resistentes e por um código de honra que atravessa " +
            "gerações, independente de qual lado da lei escolham seguir."
    },

    {
        id: "r2-d2",
        type: "droid",
        name: "R2-D2",
        sub: "Droid Astromecânico",
        era: "República",
        meta: ["Função: Reparos e navegação", "Leal", "Guarda segredos importantes"],
        image: "assets/r2-d2.jpeg",
        description:
            "Pequeno e resiliente, esteve presente em alguns dos momentos " +
            "mais decisivos da galáxia, sempre encontrando uma forma " +
            "engenhosa de ajudar seus aliados."
    },
    {
        id: "c-3po",
        type: "droid",
        name: "C-3PO",
        sub: "Droid de Protocolo",
        era: "República",
        meta: ["Função: Tradução", "Fluente em milhões de formas de comunicação", "Cauteloso"],
        image: "assets/c-3po.jpeg",
        description:
            "Droid de protocolo educado e ansioso, especializado em " +
            "etiqueta e tradução — companheiro inseparável de R2-D2 " +
            "em incontáveis aventuras pela galáxia."
    },
    {
        id: "bb-8",
        type: "droid",
        name: "BB-8",
        sub: "Droid Astromecânico",
        era: "Nova República",
        meta: ["Formato esférico", "Resistência", "Leal a seu piloto"],
        image: "assets/BB-8.jpeg",
        description:
            "Droid esférico de nova geração, ágil e expressivo, que " +
            "carrega consigo informações valiosas em meio ao conflito " +
            "entre a Resistência e a Primeira Ordem."
    }

];

function lerFavoritos() {
    try {
        return JSON.parse(localStorage.getItem("sw-favoritos")) || [];
    } catch (erro) {
        return [];
    }
}

function salvarFavoritos(lista) {
    localStorage.setItem("sw-favoritos", JSON.stringify(lista));
}

function alternarFavorito(id) {
    const favoritos = lerFavoritos();
    const indice = favoritos.indexOf(id);

    if (indice === -1) {
        favoritos.push(id);
    } else {
        favoritos.splice(indice, 1);
    }

    salvarFavoritos(favoritos);
    atualizarContadorFavoritos();

    return favoritos.includes(id);
}

function lerVisitados() {
    try {
        return JSON.parse(localStorage.getItem("sw-visitados")) || [];
    } catch (erro) {
        return [];
    }
}

function marcarComoVisitado(id) {
    const visitados = lerVisitados();

    if (!visitados.includes(id)) {
        visitados.push(id);
        localStorage.setItem("sw-visitados", JSON.stringify(visitados));
        atualizarProgresso();
    }
}

function atualizarContadorFavoritos() {
    const contador = document.getElementById("favoritesCount");
    if (contador) contador.textContent = String(lerFavoritos().length);
}

function atualizarProgresso() {

    const visitados = lerVisitados();
    const porcentagem = Math.round((visitados.length / explorerItems.length) * 100);

    const label = document.getElementById("progressLabel");
    const barra = document.getElementById("progressBarFill");

    if (label) label.textContent = `Você explorou ${porcentagem}% da galáxia.`;
    if (barra) barra.style.width = `${porcentagem}%`;

}

const explorationPaths = [
    { icon: "___", title: "Personagens", desc: "Jedi, Sith, rebeldes e mais.", filter: "personagem" },
    { icon: "___", title: "Planetas", desc: "Mundos que moldaram a saga.", filter: "planeta" },
    { icon: "___", title: "Naves", desc: "Das mais rápidas às mais temidas.", filter: "nave" },
    { icon: "___", title: "Facções", desc: "Os grupos que disputam a galáxia.", filter: "faccao" },
    { icon: "___", title: "Droids", desc: "Pequenos aliados, grandes feitos.", filter: "droid" },
    { icon: "___", title: "História", desc: "A linha do tempo completa da saga.", filter: null, anchor: "#linha-do-tempo" }
];

function renderizarCaminhos() {

    const grid = document.getElementById("pathsGrid");
    if (!grid) return;

    grid.innerHTML = explorationPaths.map(caminho => `
        <a class="path-card" href="${caminho.anchor || "#explorar"}" data-filter="${caminho.filter || ""}">
            <span class="path-card-icon">${caminho.icon}</span>
            <h3>${caminho.title}</h3>
            <p>${caminho.desc}</p>
        </a>
    `).join("");

    grid.querySelectorAll(".path-card").forEach(card => {

        card.addEventListener("click", () => {

            const filtro = card.dataset.filter;

            if (filtro) {
                estadoExplorador.filtro = filtro;
                aplicarFiltrosNaInterface();
                renderizarExplorador();
            }

        });

    });

}

const estadoExplorador = {
    termo: "",
    filtro: "todos"
};

function itemCorrespondeABusca(item, termo) {

    if (!termo) return true;

    const alvo = `${item.name} ${item.sub} ${item.description} ${item.meta.join(" ")}`.toLowerCase();

    return alvo.includes(termo.toLowerCase());

}

function filtrarItens() {

    return explorerItems.filter(item => {

        const passaBusca = itemCorrespondeABusca(item, estadoExplorador.termo);

        let passaFiltro = true;

        if (estadoExplorador.filtro === "favoritos") {
            passaFiltro = lerFavoritos().includes(item.id);
        } else if (estadoExplorador.filtro !== "todos") {
            passaFiltro = item.type === estadoExplorador.filtro;
        }

        return passaBusca && passaFiltro;

    });

}

function criarCardHTML(item) {

    const favoritado = lerFavoritos().includes(item.id);

    return `
        <article class="entity-card" data-id="${item.id}">
            <button class="entity-card-fav ${favoritado ? "active" : ""}" data-fav="${item.id}" aria-label="Favoritar ${item.name}">
                ${favoritado ? "♥" : "♡"}
            </button>
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <div class="entity-card-body">
                <span class="entity-card-type">${item.type}</span>
                <h3>${item.name}</h3>
                <span class="entity-card-sub">${item.sub}</span>
                <p class="entity-card-desc">${item.description}</p>
            </div>
        </article>
    `;

}

function renderizarExplorador() {

    const grid = document.getElementById("explorerGrid");
    const contador = document.getElementById("explorerCount");
    const vazio = document.getElementById("explorerEmpty");

    if (!grid) return;

    const resultados = filtrarItens();

    grid.innerHTML = resultados.map(criarCardHTML).join("");

    contador.textContent = `${resultados.length} ${resultados.length === 1 ? "item encontrado" : "itens encontrados"}`;
    vazio.classList.toggle("hidden-flag", resultados.length > 0);

    // Delegação: clique no card abre o modal, clique na estrela favorita
    grid.querySelectorAll(".entity-card-fav").forEach(botao => {

        botao.addEventListener("click", event => {
            event.stopPropagation();

            const favoritado = alternarFavorito(botao.dataset.fav);

            botao.classList.toggle("active", favoritado);
            botao.textContent = favoritado ? "♥" : "♡";

            if (estadoExplorador.filtro === "favoritos" && !favoritado) {
                renderizarExplorador();
            }

            renderizarFavoritos();

        });

    });

    grid.querySelectorAll(".entity-card").forEach(card => {
        card.addEventListener("click", () => abrirModalDetalhe(card.dataset.id));
    });

}

function aplicarFiltrosNaInterface() {

    document.querySelectorAll(".chip").forEach(chip => {
        chip.classList.toggle("active", chip.dataset.filter === estadoExplorador.filtro);
    });

}

function iniciarExplorador() {

    const busca = document.getElementById("searchInput");
    const chips = document.querySelectorAll(".chip");

    if (busca) {
        busca.addEventListener("input", () => {
            estadoExplorador.termo = busca.value;
            renderizarExplorador();
        });
    }

    chips.forEach(chip => {
        chip.addEventListener("click", () => {
            estadoExplorador.filtro = chip.dataset.filter;
            aplicarFiltrosNaInterface();
            renderizarExplorador();
        });
    });

    document.getElementById("searchShortcut")?.addEventListener("click", () => {
        document.querySelector("#explorar").scrollIntoView({ behavior: prefereReduzirMovimento ? "auto" : "smooth" });
        setTimeout(() => busca?.focus(), 400);
    });

    document.getElementById("favoritesShortcut")?.addEventListener("click", () => {
        document.querySelector("#favoritos").scrollIntoView({ behavior: prefereReduzirMovimento ? "auto" : "smooth" });
    });

    document.querySelectorAll("[data-footer-filter]").forEach(link => {
        link.addEventListener("click", () => {
            estadoExplorador.filtro = link.dataset.footerFilter;
            aplicarFiltrosNaInterface();
            renderizarExplorador();
        });
    });

    renderizarExplorador();

}

function abrirModalDetalhe(id) {

    const item = explorerItems.find(item => item.id === id);
    if (!item) return;

    const modal = document.getElementById("detailModal");

    document.getElementById("modalImage").src = item.image;
    document.getElementById("modalImage").alt = item.name;
    document.getElementById("modalType").textContent = item.type;
    document.getElementById("modalTitle").textContent = item.name;
    document.getElementById("modalText").textContent = item.description;

    document.getElementById("modalMeta").innerHTML =
        item.meta.map(dado => `<span>${dado}</span>`).join("");

    const botaoFavorito = document.getElementById("modalFavorite");
    const favoritado = lerFavoritos().includes(item.id);

    botaoFavorito.classList.toggle("active", favoritado);
    botaoFavorito.textContent = favoritado ? "♥ Favoritado" : "♡ Favoritar";
    botaoFavorito.onclick = () => {
        const agora = alternarFavorito(item.id);
        botaoFavorito.classList.toggle("active", agora);
        botaoFavorito.textContent = agora ? "♥ Favoritado" : "♡ Favoritar";
        renderizarExplorador();
        renderizarFavoritos();
    };

    const relacionados = explorerItems
        .filter(outro => outro.id !== item.id && outro.era === item.era)
        .slice(0, 4);

    document.getElementById("modalRelated").innerHTML = relacionados.map(rel => `
        <button class="modal-related-item" data-id="${rel.id}">${rel.name}</button>
    `).join("") || "<span class=\"entity-card-sub\">Nenhum item relacionado no momento.</span>";

    document.getElementById("modalRelated").querySelectorAll(".modal-related-item").forEach(botao => {
        botao.addEventListener("click", () => abrirModalDetalhe(botao.dataset.id));
    });

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    modal.querySelector(".modal-close").focus();

    marcarComoVisitado(item.id);

}

function iniciarModalDeDetalhe() {

    const modal = document.getElementById("detailModal");
    if (!modal) return;

    function fechar() {
        modal.classList.remove("active");
        document.body.style.overflow = "";
    }

    modal.querySelector(".modal-close").addEventListener("click", fechar);

    modal.addEventListener("click", event => {
        if (event.target === modal) fechar();
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && modal.classList.contains("active")) fechar();
    });

}

function renderizarFavoritos() {

    const grid = document.getElementById("favoritesGrid");
    const vazio = document.getElementById("favoritesEmpty");

    if (!grid) return;

    const favoritos = lerFavoritos();
    const itens = explorerItems.filter(item => favoritos.includes(item.id));

    grid.innerHTML = itens.map(criarCardHTML).join("");
    vazio.classList.toggle("hidden-flag", itens.length > 0);

    grid.querySelectorAll(".entity-card-fav").forEach(botao => {
        botao.addEventListener("click", event => {
            event.stopPropagation();
            alternarFavorito(botao.dataset.fav);
            renderizarFavoritos();
            renderizarExplorador();
        });
    });

    grid.querySelectorAll(".entity-card").forEach(card => {
        card.addEventListener("click", () => abrirModalDetalhe(card.dataset.id));
    });

    document.getElementById("footerProgressLink")?.addEventListener("click", event => {
        event.preventDefault();
        document.querySelector(".paths-section").scrollIntoView({ behavior: prefereReduzirMovimento ? "auto" : "smooth" });
    });

}

const timelineEvents = [
    {
        era: "REPÚBLICA",
        title: "Os anos de paz sob a Velha República",
        text:
            "Um longo período de estabilidade governado pelo Senado " +
            "e vigiado pelos Jedi, guardiões da paz e da justiça na galáxia."
    },
    {
        era: "GUERRAS CLÔNICAS",
        title: "A galáxia mergulha no conflito",
        text:
            "Um exército de clones e uma confederação de sistemas " +
            "separatistas arrastam a República para uma guerra em larga escala."
    },
    {
        era: "IMPÉRIO",
        title: "A República dá lugar ao Império",
        text:
            "O caos da guerra é usado como justificativa para a centralização " +
            "de poder, e a ordem Jedi é quase completamente extinta."
    },
    {
        era: "REBELIÃO",
        title: "A Aliança Rebelde resiste",
        text:
            "Um pequeno grupo de rebeldes desafia o poderio militar do Império " +
            "em busca de liberdade para a galáxia."
    },
    {
        era: "NOVA REPÚBLICA",
        title: "A reconstrução de uma nova ordem",
        text:
            "Após a queda do Império, uma nova era de governo tenta se firmar " +
            "em meio aos resquícios do antigo regime."
    }
];

function iniciarLinhaDoTempo() {

    const container = document.getElementById("timeline");
    if (!container) return;

    const detalheEra = document.getElementById("timelineDetailEra");
    const detalheTitulo = document.getElementById("timelineDetailTitle");
    const detalheTexto = document.getElementById("timelineDetailText");

    container.innerHTML = timelineEvents.map((evento, index) => `
        <button class="timeline-item${index === 0 ? " active" : ""}" data-index="${index}">
            <span class="timeline-item-era">${evento.era}</span>
            <span class="timeline-item-title">${evento.title}</span>
        </button>
    `).join("");

    function mostrarEvento(index) {

        const evento = timelineEvents[index];

        detalheEra.textContent = evento.era;
        detalheTitulo.textContent = evento.title;
        detalheTexto.textContent = evento.text;

        container.querySelectorAll(".timeline-item").forEach(item => {
            item.classList.toggle("active", Number(item.dataset.index) === index);
        });

    }

    container.addEventListener("click", event => {
        const item = event.target.closest(".timeline-item");
        if (!item) return;
        mostrarEvento(Number(item.dataset.index));
    });

    mostrarEvento(0);

}

function iniciarInterruptorDaForca() {

    const switchButton = document.getElementById("forceSwitch");
    if (!switchButton) return;

    switchButton.addEventListener("click", () => {
        const estaNoLadoSombrio = switchButton.getAttribute("aria-checked") === "true";
        switchButton.setAttribute("aria-checked", String(!estaNoLadoSombrio));
    });

    switchButton.addEventListener("keydown", event => {
        if (event.key === "ArrowLeft") switchButton.setAttribute("aria-checked", "false");
        if (event.key === "ArrowRight") switchButton.setAttribute("aria-checked", "true");
    });

}

function iniciarAlternadorDeTema() {

    const botao = document.getElementById("themeToggle");
    const rotulo = document.getElementById("themeToggleLabel");
    if (!botao) return;

    const temaSalvo = localStorage.getItem("sw-tema");

    function aplicarTema(tema) {
        document.body.setAttribute("data-theme", tema);
        const ehLuminoso = tema === "luminoso";
        botao.setAttribute("aria-pressed", String(ehLuminoso));
        rotulo.textContent = ehLuminoso ? "Lado Luminoso" : "Lado Sombrio";
    }

    aplicarTema(temaSalvo === "luminoso" ? "luminoso" : "sombrio");

    botao.addEventListener("click", () => {
        const temaAtual = document.body.getAttribute("data-theme");
        const novoTema = temaAtual === "sombrio" ? "luminoso" : "sombrio";
        aplicarTema(novoTema);
        localStorage.setItem("sw-tema", novoTema);
    });

}

const mapCoordinates = {
    "tatooine": { x: 140, y: 360 },
    "coruscant": { x: 400, y: 180 },
    "hoth": { x: 620, y: 90 },
    "endor": { x: 660, y: 320 },
    "naboo": { x: 300, y: 100 },
    "mustafar": { x: 480, y: 400 }
};

function iniciarMapaDaGalaxia() {

    const svg = document.getElementById("galaxyMap");
    if (!svg) return;

    const detalhe = document.getElementById("mapDetail");

    let estrelasSVG = "";
    for (let i = 0; i < 60; i++) {
        const x = Math.random() * 800;
        const y = Math.random() * 500;
        const r = Math.random() * 1.2 + 0.3;
        estrelasSVG += `<circle class="map-star" cx="${x}" cy="${y}" r="${r}"></circle>`;
    }

    const planetasSVG = explorerItems
        .filter(item => item.type === "planeta" && mapCoordinates[item.id])
        .map(planeta => {
            const { x, y } = mapCoordinates[planeta.id];
            return `
                <g class="map-planet" data-id="${planeta.id}" tabindex="0" role="button" aria-label="Ver detalhes de ${planeta.name}">
                    <circle class="map-planet-dot" cx="${x}" cy="${y}" r="6"></circle>
                    <text x="${x + 12}" y="${y + 4}">${planeta.name}</text>
                </g>
            `;
        }).join("");

    svg.innerHTML = estrelasSVG + planetasSVG;

    function mostrarPlaneta(id) {

        const planeta = explorerItems.find(item => item.id === id);
        if (!planeta) return;

        detalhe.innerHTML = `
            <span class="map-detail-eyebrow">PLANETA</span>
            <h3>${planeta.name}</h3>
            <p>${planeta.description}</p>
            <button class="hero-button hero-button--ghost" id="mapDetailOpen">VER FICHA COMPLETA</button>
        `;

        document.getElementById("mapDetailOpen").addEventListener("click", () => abrirModalDetalhe(id));

        marcarComoVisitado(id);

    }

    svg.querySelectorAll(".map-planet").forEach(planeta => {

        planeta.addEventListener("click", () => mostrarPlaneta(planeta.dataset.id));

        planeta.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                mostrarPlaneta(planeta.dataset.id);
            }
        });

    });

}

const holocronFiles = [
    {
        title: "Ordem 66",
        text:
            "Um comando oculto nos exércitos clones, capaz de reverter " +
            "sua lealdade em um instante — uma das maiores traições " +
            "da história da galáxia."
    },
    {
        title: "Os Arquivos Jedi",
        text:
            "A vasta biblioteca de Coruscant guardava registros de " +
            "praticamente todo planeta conhecido, exceto por sistemas " +
            "deliberadamente apagados de seus mapas."
    },
    {
        title: "Regra dos Dois",
        text:
            "Um princípio Sith que limita a ordem a apenas dois membros " +
            "por vez — um mestre e um aprendiz, sempre em busca de " +
            "superar um ao outro."
    },
    {
        title: "A Frota Fantasma",
        text:
            "Rumores falam de naves antigas escondidas em setores " +
            "isolados da galáxia, preservadas por décadas à espera " +
            "de um conflito que as trouxesse de volta."
    },
    {
        title: "Beskar",
        text:
            "Um metal raro e extremamente resistente, símbolo da cultura " +
            "mandaloriana, forjado em armaduras que atravessam gerações " +
            "de guerreiros."
    },
    {
        title: "Códigos Imperiais",
        text:
            "O Império organizava sua vasta burocracia militar em " +
            "designações numéricas — de decretos a classes inteiras " +
            "de naves de guerra."
    },
    {
        title: "Os Sacerdotes de Uma Força",
        text:
            "Histórias antigas mencionam seres que buscavam o equilíbrio " +
            "entre luz e sombra, muito antes da rivalidade entre Jedi " +
            "e Sith se formar."
    },
    {
        title: "Rota Comercial Perlemiana",
        text:
            "Uma das rotas hiperespaciais mais antigas e movimentadas, " +
            "ligando o Núcleo galáctico a mundos distantes da Orla Exterior."
    }
];

function iniciarHolocron() {

    const grid = document.getElementById("holocronGrid");
    if (!grid) return;

    grid.innerHTML = holocronFiles.map((arquivo, index) => `
        <button class="holocron-card" data-index="${index}">
            <span class="holocron-card-id">ARQUIVO ${String(index + 1).padStart(3, "0")}</span>
            <span class="holocron-card-title">${arquivo.title}</span>
            <span class="holocron-card-text">${arquivo.text}</span>
        </button>
    `).join("");

    grid.querySelectorAll(".holocron-card").forEach(card => {
        card.addEventListener("click", () => card.classList.toggle("open"));
    });

}

const triviaFacts = [
    "Tatooine possui dois sóis no céu, o que torna seus pores do sol especialmente longos.",
    "R2-D2 e C-3PO aparecem, de alguma forma, em praticamente toda grande batalha da saga.",
    "A Ordem Jedi treinava seus membros desde muito jovens, formando vínculos entre mestre e aprendiz.",
    "Coruscant é tão urbanizado que praticamente não há mais superfície natural visível.",
    "A Aliança Rebelde dependia fortemente de bases móveis para escapar da detecção imperial.",
    "Os sabres de luz são construídos individualmente por cada Jedi como parte de seu treinamento.",
    "Boba Fett usava uma armadura mandaloriana adquirida, não fabricada por ele mesmo.",
    "A Millennium Falcon já passou por diversos donos antes de se tornar famosa.",
    "Hoth é tão inóspito que exige trajes térmicos especiais só para sobreviver do lado de fora das bases.",
    "O Império organizava suas naves em designações de classe para facilitar a produção em massa."
];

function iniciarCuriosidades() {

    const texto = document.getElementById("triviaText");
    const botao = document.getElementById("triviaButton");
    if (!texto || !botao) return;

    let ultimoIndice = -1;

    function sortearCuriosidade() {

        let novoIndice;

        do {
            novoIndice = Math.floor(Math.random() * triviaFacts.length);
        } while (novoIndice === ultimoIndice && triviaFacts.length > 1);

        ultimoIndice = novoIndice;
        texto.textContent = triviaFacts[novoIndice];

    }

    botao.addEventListener("click", sortearCuriosidade);

    sortearCuriosidade();

}

const quizQuestions = [
    {
        question: "Qual planeta é conhecido por seus dois sóis?",
        options: ["Hoth", "Tatooine", "Coruscant", "Endor"],
        correct: 1
    },
    {
        question: "Qual ordem segue o lado sombrio da Força?",
        options: ["Jedi", "Mandalorianos", "Sith", "Aliança Rebelde"],
        correct: 2
    },
    {
        question: "Qual nave é famosa por ser um cargueiro corelliano modificado?",
        options: ["X-wing", "Millennium Falcon", "TIE Fighter", "Star Destroyer"],
        correct: 1
    },
    {
        question: "Qual planeta é coberto por florestas e habitado por Ewoks?",
        options: ["Naboo", "Mustafar", "Endor", "Hoth"],
        correct: 2
    },
    {
        question: "Qual metal é símbolo da cultura mandaloriana?",
        options: ["Cortosis", "Durasteel", "Beskar", "Transparisteel"],
        correct: 2
    }
];

function calcularRank(pontuacao, total) {

    const proporcao = pontuacao / total;

    if (proporcao === 1) {
        return { titulo: "Mestre Jedi", texto: "Você conhece a galáxia de ponta a ponta. A Força está muito forte em você." };
    }

    if (proporcao >= 0.6) {
        return { titulo: "Jedi", texto: "Bom conhecimento da galáxia! Mais algumas explorações e você chega a Mestre." };
    }

    return { titulo: "Padawan", texto: "Você ainda precisa treinar com um Jedi. Explore mais a enciclopédia e tente de novo." };

}

function iniciarQuiz() {

    const box = document.getElementById("quizBox");
    if (!box) return;

    const perguntaEl = document.getElementById("quizQuestion");
    const opcoesEl = document.getElementById("quizOptions");
    const progressoTexto = document.getElementById("quizProgressText");
    const progressoBarra = document.getElementById("quizProgressFill");
    const resultado = document.getElementById("quizResult");
    const resultadoTitulo = document.getElementById("quizResultTitle");
    const resultadoTexto = document.getElementById("quizResultText");
    const botaoReiniciar = document.getElementById("quizRestart");

    let perguntaAtual = 0;
    let pontuacao = 0;

    function mostrarPergunta() {

        resultado.classList.add("hidden-flag");
        perguntaEl.classList.remove("hidden-flag");
        opcoesEl.classList.remove("hidden-flag");

        const dados = quizQuestions[perguntaAtual];

        perguntaEl.textContent = dados.question;

        progressoTexto.textContent = `Pergunta ${perguntaAtual + 1} de ${quizQuestions.length}`;
        progressoBarra.style.width = `${(perguntaAtual / quizQuestions.length) * 100}%`;

        opcoesEl.innerHTML = dados.options.map((opcao, index) => `
            <button class="quiz-option" data-index="${index}">${opcao}</button>
        `).join("");

        opcoesEl.querySelectorAll(".quiz-option").forEach(botao => {
            botao.addEventListener("click", () => responder(Number(botao.dataset.index)));
        });

    }

    function responder(indiceEscolhido) {

        const dados = quizQuestions[perguntaAtual];
        const botoes = opcoesEl.querySelectorAll(".quiz-option");

        botoes.forEach(botao => botao.disabled = true);

        botoes[dados.correct].classList.add("correct");

        if (indiceEscolhido === dados.correct) {
            pontuacao++;
        } else {
            botoes[indiceEscolhido].classList.add("wrong");
        }

        setTimeout(() => {

            perguntaAtual++;

            if (perguntaAtual < quizQuestions.length) {
                mostrarPergunta();
            } else {
                mostrarResultado();
            }

        }, 900);

    }

    function mostrarResultado() {

        perguntaEl.classList.add("hidden-flag");
        opcoesEl.classList.add("hidden-flag");
        progressoBarra.style.width = "100%";
        progressoTexto.textContent = "Quiz concluído";

        const rank = calcularRank(pontuacao, quizQuestions.length);

        resultadoTitulo.textContent = rank.titulo;
        resultadoTexto.textContent = `Você acertou ${pontuacao} de ${quizQuestions.length} perguntas. ${rank.texto}`;

        resultado.classList.remove("hidden-flag");

        localStorage.setItem("sw-quiz-melhor", String(
            Math.max(pontuacao, Number(localStorage.getItem("sw-quiz-melhor")) || 0)
        ));

    }

    botaoReiniciar.addEventListener("click", () => {
        perguntaAtual = 0;
        pontuacao = 0;
        mostrarPergunta();
    });

    mostrarPergunta();

}

iniciarTelaDeCarregamento();
iniciarBarraDeProgresso();
iniciarHeaderDinamico();
iniciarMenuMobile();
iniciarCampoDeEstrelas();
iniciarAnimacaoDoHero();
iniciarAnimacoesDeScroll();
iniciarBotaoVoltarAoTopo();
iniciarMenuAtivo();

renderizarCaminhos();
iniciarExplorador();
iniciarModalDeDetalhe();
renderizarFavoritos();
atualizarContadorFavoritos();
atualizarProgresso();

iniciarLinhaDoTempo();
iniciarMapaDaGalaxia();
iniciarHolocron();
iniciarCuriosidades();
iniciarQuiz();
iniciarInterruptorDaForca();
iniciarAlternadorDeTema();

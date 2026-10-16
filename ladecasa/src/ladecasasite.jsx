import { useState, useEffect, useRef } from "react";

/* ==========================================================================
   LÁ DE CASA BOLOS CASEIROS · site institucional

   Referência de estrutura: tengilemalamala.com. A página é contada em capítulos
   (abertura, o que fazemos, os bolos, uma citação forte, a história, o princípio,
   a visita), com cabeçalho mínimo, pedido sempre visível e menu em tela cheia.

   Fotos: coloque os arquivos em public/fotos e preencha FOTOS e os campos "foto"
   dos bolos. Sem foto, cada bloco mostra uma versão tipográfica no lugar.

   Itens marcados com CONFIRMAR vieram de fontes públicas e devem ser checados
   com a loja antes de publicar.
   ========================================================================== */

/* ---------- Dados ---------- */

const IFOOD_URL =
  "https://www.ifood.com.br/delivery/sao-paulo-sp/la-de-casa-bolos-caseiros-sao-francisco-cidade-sao-francisco/d99d1c71-454e-4caf-bb36-db06292124eb";
const TELEFONE = "(11) 2892-1477";
const TELEFONE_LINK = "tel:+551128921477";
const FACEBOOK_URL = "https://www.facebook.com/LadeCasaBolosCaseiros/";
const ENDERECO_LINHAS = ["Av. Dr. Cândido Motta Filho, 538", "Cidade São Francisco, São Paulo – SP", "CEP 05351-000"];
const ENDERECO = "Av. Dr. Cândido Motta Filho, 538 - Cidade São Francisco, São Paulo - SP, 05351-000";
const ROTA_URL = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(ENDERECO);
const GOOGLE_URL =
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Lá de Casa Bolos Caseiros, " + ENDERECO);

// CONFIRMAR: horário de fonte antiga. O Google mostra fechamento às 19h e abertura aos sábados às 9h.
const HORARIOS = [
  ["Segunda a sexta", "9h às 19h"],
  ["Sábado", "9h às 18h"],
];

// Fotos gerais do site. Ex.: hero: "/fotos/hero.jpg"
const FOTOS = {
  hero: null,
  intro: [], // até duas fotos verticais: [{ src, legenda }]
  historia: null, // { src, legenda }
  loja: null, // { src, legenda }
  galeria: [], // [{ src, legenda }] · a seção só aparece quando houver fotos
};

// Cardápio conforme o iFood da loja (fotos recortadas do próprio iFood)
const F = (nome) => `/fotos/bolos/${nome}.jpg`;
const BOLOS = [
  {
    id: "cobertura",
    titulo: "Com cobertura",
    descricao: "Massa macia e cobertura generosa.",
    itens: [
      { nome: "Maracujá", detalhe: "Com calda da própria fruta", foto: F("maracuja"), novidade: true },
      { nome: "Cenoura com gotas de chocolate", detalhe: "Cobertura de brigadeiro e chips de chocolate belga", foto: F("cenoura-com-gotas") },
      { nome: "Chocolate", detalhe: "Blend de chocolates e cobertura de chocolate 50%", foto: F("chocolate") },
      { nome: "Brigadeiro", detalhe: "Cobertura de brigadeiro com granulado de chocolate", foto: F("brigadeiro"), porcao: "Serve 4 pessoas" },
      { nome: "Cenoura com chocolate", detalhe: "Cenoura in natura e cobertura de chocolate 50%", foto: F("cenoura-com-chocolate"), porcao: "Serve 4 pessoas" },
      { nome: "Ovoninho", detalhe: "Massa de Ovomaltine, cobertura de Leite Ninho e granulado de Ovomaltine", foto: F("ovoninho"), porcao: "Serve 4 pessoas" },
      { nome: "Tangerina", detalhe: "Massa e calda com tangerina in natura", foto: F("tangerina"), porcao: "Serve 4 pessoas" },
    ],
  },
  {
    id: "tradicionais",
    titulo: "Tradicionais",
    descricao: "Os bolos de sempre, do jeito que se faz em casa.",
    itens: [
      { nome: "Laranja", detalhe: "Massa com laranja in natura", foto: F("laranja"), porcao: "Serve 4 pessoas" },
      { nome: "Limão siciliano", detalhe: "Limão siciliano in natura, polvilhado com açúcar gelado", foto: F("limao-siciliano"), porcao: "Serve 4 pessoas" },
      { nome: "Banana", detalhe: "Banana in natura e pedaços da fruta", foto: F("banana"), porcao: "Serve 4 pessoas" },
      { nome: "Mesclado", detalhe: "Massa branca mesclada com massa de Ovomaltine", foto: F("mesclado"), porcao: "Serve 4 pessoas" },
      { nome: "Fubá", detalhe: "Massa de fubá", foto: F("fuba"), porcao: "Serve 4 pessoas" },
    ],
  },
  {
    id: "especiais",
    titulo: "Especiais e integral",
    descricao: "Receitas da casa, com ingredientes que fazem diferença.",
    itens: [
      { nome: "Maçã com nozes", detalhe: "Maçã ralada in natura, nozes chilenas e uva-passa branca", foto: F("maca-com-nozes"), porcao: "Serve 4 pessoas" },
      { nome: "Brownie", detalhe: "Chocolate meio amargo e nozes chilenas", foto: F("brownie") },
      { nome: "Fubá com goiabada", detalhe: "Massa de fubá com pedaços de goiabada", foto: F("fuba-com-goiabada"), porcao: "Serve 4 pessoas" },
      { nome: "Integral de banana", detalhe: "Banana in natura, farinha integral, açúcar mascavo e pedaços da fruta", foto: F("integral-de-banana"), porcao: "Serve 4 pessoas" },
    ],
  },
  {
    id: "gelados",
    titulo: "Gelados",
    descricao: "Saem congelados da loja. É só deixar 1h30 em temperatura ambiente antes de servir.",
    itens: [
      { nome: "Gelado de brigadeiro", foto: F("gelado-de-brigadeiro"), porcao: "Serve 1 pessoa" },
      { nome: "Gelado de coco", foto: F("gelado-de-coco"), porcao: "Serve 1 pessoa" },
    ],
  },
];

const AVALIACOES = {
  nota: "4,6",
  total: 59,
  notaIfood: "4,9",
  destaque: "Loja charmosa e atendentes muito simpáticas.",
  outras: [
    "Entrega efetuada no horário combinado, atendente muito simpática!",
    "Super recomendo, adorei o mimo da frase no pão de mel 🥰 adorei demais!!!",
  ],
};

const SEM = ["Sem conservantes.", "Sem corantes.", "Sem essências artificiais.", "Sem massa pronta."];

const LINKS = [
  ["bolos", "Os bolos"],
  ["historia", "Nossa história"],
  ["ingredientes", "Ingredientes"],
  ["avaliacoes", "Avaliações"],
  ["visite", "Visite a loja"],
];

/* ---------- Utilidades ---------- */

function prefereMenosMovimento() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function rolarPara(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: prefereMenosMovimento() ? "auto" : "smooth" });
}

/* ---------- Ícones ---------- */

function Icone({ children, className = "icone" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}
const IconeMenu = () => <Icone><path d="M4 8h16M4 16h16" /></Icone>;
const IconeFechar = () => <Icone><path d="M6 6l12 12M18 6L6 18" /></Icone>;
const IconeAnterior = () => <Icone><path d="M15 5l-7 7 7 7" /></Icone>;
const IconeProximo = () => <Icone><path d="M9 5l7 7-7 7" /></Icone>;
const NovaAba = () => <span className="sr-only"> (abre em nova aba)</span>;

/* ---------- Peças ---------- */

function Logo({ claro = false }) {
  // PENDENTE: trocar pelo logotipo oficial da Lá de Casa
  return (
    <span className={`logo ${claro ? "logo--claro" : ""}`}>
      <span className="logo-nome">Lá de Casa</span>
      <span className="logo-sub">bolos caseiros</span>
    </span>
  );
}

function Rotulo({ children }) {
  return <p className="rotulo">{children}</p>;
}

function Foto({ src, legenda, className = "" }) {
  if (!src) return null;
  return (
    <figure className={`foto ${className}`}>
      <img src={src} alt={legenda || ""} loading="lazy" decoding="async" />
    </figure>
  );
}

/* ---------- Cabeçalho e menu em tela cheia ---------- */

function Cabecalho() {
  const [aberto, setAberto] = useState(false);
  const [rolou, setRolou] = useState(false);
  const botao = useRef(null);
  const primeiroLink = useRef(null);

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 40);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  useEffect(() => {
    if (!aberto) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    primeiroLink.current?.focus();
    const aoTeclar = (e) => e.key === "Escape" && fechar();
    window.addEventListener("keydown", aoTeclar);
    return () => {
      document.body.style.overflow = anterior;
      window.removeEventListener("keydown", aoTeclar);
    };
  }, [aberto]);

  function fechar() {
    setAberto(false);
    setTimeout(() => botao.current?.focus(), 0);
  }

  function irPara(id) {
    setAberto(false);
    setTimeout(() => rolarPara(id), 50);
  }

  const claro = !rolou;

  return (
    <>
      <header className={`topo ${rolou ? "topo--solido" : ""}`}>
        <div className="topo-grade">
          <button ref={botao} type="button" className="topo-menu" aria-expanded={aberto} aria-controls="menu-tela-cheia"
            onClick={() => setAberto(true)}>
            <IconeMenu /> <span>Menu</span>
          </button>
          <a href="#inicio" className="topo-logo" aria-label="Lá de Casa Bolos Caseiros, voltar ao início">
            <Logo claro={claro} />
          </a>
          <a href={IFOOD_URL} target="_blank" rel="noopener noreferrer" className={`btn ${claro ? "btn-claro" : "btn-escuro"} topo-pedido`}>
            <span className="pedido-longo">Pedir no iFood</span>
            <span className="pedido-curto" aria-hidden="true">Pedir</span>
            <NovaAba />
          </a>
        </div>
      </header>

      <div id="menu-tela-cheia" role="dialog" aria-modal="true" aria-label="Menu" className="menu" hidden={!aberto}>
        <div className="menu-topo">
          <button type="button" className="topo-menu" onClick={fechar}>
            <IconeFechar /> <span>Fechar</span>
          </button>
          <Logo claro />
          <span aria-hidden="true" />
        </div>
        <nav aria-label="Principal" className="menu-corpo">
          <ul>
            {LINKS.map(([id, rotulo], i) => (
              <li key={id} style={{ animationDelay: `${80 + i * 50}ms` }}>
                <a ref={i === 0 ? primeiroLink : undefined} href={`#${id}`} className="menu-link"
                  onClick={(e) => { e.preventDefault(); irPara(id); }}>
                  {rotulo}
                </a>
              </li>
            ))}
          </ul>
          <div className="menu-rodape">
            <a href={IFOOD_URL} target="_blank" rel="noopener noreferrer" className="btn btn-claro btn-grande">
              Pedir no iFood
              <NovaAba />
            </a>
            <a href={TELEFONE_LINK} className="menu-telefone">{TELEFONE}</a>
          </div>
        </nav>
      </div>
    </>
  );
}

/* ---------- Seções ---------- */

function Abertura() {
  return (
    <section id="inicio" className={`abertura ${FOTOS.hero ? "abertura--foto" : ""}`}>
      {FOTOS.hero && <img className="abertura-fundo" src={FOTOS.hero} alt="" />}
      <div className="moldura abertura-conteudo">
        <h1 className="t-abertura">
          <span>A gente garante o bolo.</span> <span>Você cuida do café.</span>
        </h1>
        <div className="abertura-pe">
          <p className="abertura-sub">
            Bolos caseiros desde 2012 na Cidade São Francisco, em São Paulo. Feitos com fruta fresca e sem massa pronta.
          </p>
          <div className="flex flex-wrap gap-3">
            <a className="btn btn-claro btn-grande" href={IFOOD_URL} target="_blank" rel="noopener noreferrer">
              Pedir no iFood
              <NovaAba />
            </a>
            <a className="btn btn-contorno-claro btn-grande" href="#bolos"
              onClick={(e) => { e.preventDefault(); rolarPara("bolos"); }}>
              Ver os bolos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Manifesto() {
  const temFotos = FOTOS.intro.length > 0;
  return (
    <section className="secao" aria-labelledby="titulo-manifesto">
      <div className="moldura">
        <Rotulo>Lá de Casa</Rotulo>
        <h2 id="titulo-manifesto" className="t-manifesto">
          Bolo com gosto de casa: massa macia e úmida, fruta fresca e selecionada, e ingrediente de verdade do começo ao fim.
        </h2>
        <p className="texto mt-8">
          Sabe aquele bolo servido depois do almoço de domingo, em família? É dele que a gente se lembra quando vai pro forno.
          Tem bolo com cobertura, tem os tradicionais, tem receita especial e tem pedaço gelado pra sobremesa.
        </p>
        {temFotos && (
          <div className="manifesto-fotos">
            {FOTOS.intro.slice(0, 2).map((f, i) => (
              <Foto key={f.src} src={f.src} legenda={f.legenda} className={`foto-vertical ${i === 1 ? "foto-deslocada" : ""}`} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CartaoBolo({ bolo, tom }) {
  return (
    <li className="cartao">
      <div className={`cartao-imagem tom-${tom}`}>
        {bolo.novidade && <span className="cartao-selo">Novidade</span>}
        {bolo.foto ? (
          <img src={bolo.foto} alt={`Bolo ${bolo.nome}`} loading="lazy" decoding="async" />
        ) : (
          <span className="cartao-inicial" aria-hidden="true">{bolo.nome.charAt(0)}</span>
        )}
      </div>
      <h4 className="cartao-nome">{bolo.nome}</h4>
      {bolo.porcao && <p className="cartao-porcao">{bolo.porcao}</p>}
      {bolo.detalhe && <p className="cartao-detalhe">{bolo.detalhe}</p>}
    </li>
  );
}

function Fileira({ grupo, deslocamento }) {
  const trilho = useRef(null);
  const [estado, setEstado] = useState({ inicio: true, fim: true });

  useEffect(() => {
    const t = trilho.current;
    if (!t) return;
    const atualizar = () =>
      setEstado({ inicio: t.scrollLeft < 8, fim: t.scrollLeft + t.clientWidth >= t.scrollWidth - 8 });
    atualizar();
    t.addEventListener("scroll", atualizar, { passive: true });
    window.addEventListener("resize", atualizar);
    return () => {
      t.removeEventListener("scroll", atualizar);
      window.removeEventListener("resize", atualizar);
    };
  }, []);

  function mover(direcao) {
    const t = trilho.current;
    t.scrollBy({ left: direcao * t.clientWidth * 0.85, behavior: prefereMenosMovimento() ? "auto" : "smooth" });
  }

  const rola = !(estado.inicio && estado.fim);
  const temFotos = grupo.itens.some((item) => item.foto);

  // Sem fotos ainda: os bolos aparecem como lista de cardápio, sem quadros vazios.
  if (!temFotos) {
    return (
      <div className="fileira">
        <div className="fileira-topo">
          <div>
            <h3 className="fileira-titulo">{grupo.titulo}</h3>
            <p className="fileira-desc">{grupo.descricao}</p>
          </div>
        </div>
        <ul className="lista-bolos">
          {grupo.itens.map((bolo) => (
            <li key={bolo.nome}>
              <h4 className="cartao-nome">{bolo.nome}</h4>
              {bolo.detalhe && <p className="cartao-detalhe">{bolo.detalhe}</p>}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="fileira">
      <div className="fileira-topo">
        <div>
          <h3 className="fileira-titulo">{grupo.titulo}</h3>
          <p className="fileira-desc">{grupo.descricao}</p>
        </div>
        {rola && (
          <div className="setas">
            <button type="button" className="seta" onClick={() => mover(-1)} disabled={estado.inicio}
              aria-label={`Ver anteriores: ${grupo.titulo}`}>
              <IconeAnterior />
            </button>
            <button type="button" className="seta" onClick={() => mover(1)} disabled={estado.fim}
              aria-label={`Ver próximos: ${grupo.titulo}`}>
              <IconeProximo />
            </button>
          </div>
        )}
      </div>
      <ul className="trilho" ref={trilho} aria-label={grupo.titulo}>
        {grupo.itens.map((bolo, i) => (
          <CartaoBolo key={bolo.nome} bolo={bolo} tom={(i + deslocamento) % 3} />
        ))}
      </ul>
    </div>
  );
}

function Bolos() {
  return (
    <section id="bolos" className="secao secao-papel">
      <div className="moldura">
        <Rotulo>Os bolos</Rotulo>
        <h2 className="t-manifesto">Do bolo de laranja que a gente cresceu comendo ao maracujá que acabou de chegar.</h2>
        {BOLOS.map((grupo, i) => (
          <Fileira key={grupo.id} grupo={grupo} deslocamento={i} />
        ))}
        <div className="bolos-pe">
          <p className="texto">
            Dá pra incluir cobertura extra de chocolate, Mini M&amp;M e um cartão com mensagem para presentear. Preços e
            tamanhos estão no iFood.
          </p>
          <a className="btn btn-escuro btn-grande" href={IFOOD_URL} target="_blank" rel="noopener noreferrer">
            Ver cardápio no iFood
            <NovaAba />
          </a>
        </div>
      </div>
    </section>
  );
}

function Citacao() {
  return (
    <section id="avaliacoes" className="secao secao-cacau" aria-labelledby="titulo-avaliacoes">
      <div className="moldura">
        <h2 id="titulo-avaliacoes" className="sr-only">Avaliações</h2>
        <figure className="citacao">
          <blockquote>
            <p>“{AVALIACOES.destaque}”</p>
          </blockquote>
          <figcaption>Avaliação de cliente no Google</figcaption>
        </figure>
        <div className="citacao-pe">
          <p className="citacao-nota">
            <strong>{AVALIACOES.nota}</strong> de nota no Google, com {AVALIACOES.total} avaliações, e{" "}
            {AVALIACOES.notaIfood} no iFood
          </p>
          <ul className="citacao-outras">
            {AVALIACOES.outras.map((t) => (
              <li key={t}><blockquote><p>“{t}”</p></blockquote></li>
            ))}
          </ul>
          <a className="link-claro" href={GOOGLE_URL} target="_blank" rel="noopener noreferrer">
            Ler todas no Google
            <NovaAba />
          </a>
        </div>
      </div>
    </section>
  );
}

function Galeria() {
  const [indice, setIndice] = useState(0);
  const fotos = FOTOS.galeria;
  if (!fotos.length) return null;
  const total = fotos.length;
  const ir = (n) => setIndice((n + total) % total);
  return (
    <section className="secao galeria" aria-roledescription="carrossel" aria-label="Fotos da Lá de Casa">
      <div className="moldura">
        <div className="galeria-quadro">
          {fotos.map((f, i) => (
            <img key={f.src} src={f.src} alt={f.legenda || ""} className={i === indice ? "is-ativa" : ""}
              aria-hidden={i !== indice} loading={i === 0 ? "eager" : "lazy"} />
          ))}
        </div>
        <div className="galeria-controles">
          <p aria-live="polite">{indice + 1} / {total}</p>
          <div className="setas">
            <button type="button" className="seta" onClick={() => ir(indice - 1)} aria-label="Foto anterior"><IconeAnterior /></button>
            <button type="button" className="seta" onClick={() => ir(indice + 1)} aria-label="Próxima foto"><IconeProximo /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Historia() {
  return (
    <section id="historia" className="secao">
      <div className="moldura historia">
        <div className="historia-ano" aria-hidden="true">2012</div>
        <div className="historia-texto">
          <Rotulo>Nossa história</Rotulo>
          {/* CONFIRMAR com a loja: história publicada em fonte antiga */}
          <h2 className="t-manifesto">Tudo começou com um caderno de receitas escrito à mão pela Dona Harue.</h2>
          <p className="texto mt-8">
            Aos poucos, o filho dela, Alexandre, foi se interessando pela cozinha, fez cursos de gastronomia e transformou
            aquelas receitas na Lá de Casa. A loja abriu em 2012, na Cidade São Francisco, e foi uma das pioneiras dos bolos
            caseiros em São Paulo.
          </p>
          {FOTOS.historia && <Foto src={FOTOS.historia.src} legenda={FOTOS.historia.legenda} className="historia-foto" />}
        </div>
      </div>
    </section>
  );
}

function Ingredientes() {
  return (
    <section id="ingredientes" className="secao secao-papel" aria-labelledby="titulo-ingredientes">
      <div className="moldura">
        <Rotulo>Ingredientes</Rotulo>
        <h2 id="titulo-ingredientes" className="sr-only">O que não entra no nosso bolo</h2>
        <ul className="sem">
          {SEM.map((linha) => <li key={linha}>{linha}</li>)}
        </ul>
        <p className="sem-pe">Só fruta fresca e selecionada, e ingrediente de verdade.</p>
      </div>
    </section>
  );
}

function Visite() {
  return (
    <section id="visite" className="secao secao-cacau">
      <div className="moldura visite">
        <div>
          <Rotulo>Visite a loja</Rotulo>
          <h2 className="t-manifesto">O bolo está pronto. É só passar aqui ou pedir de casa.</h2>
          <div className="visite-dados">
            <div>
              <h3 className="visite-titulo">Endereço</h3>
              <address>{ENDERECO_LINHAS.map((l) => <span key={l}>{l}</span>)}</address>
            </div>
            <div>
              <h3 className="visite-titulo">Horário</h3>
              <dl>
                {HORARIOS.map(([dia, hora]) => (
                  <div key={dia}><dt>{dia}</dt><dd>{hora}</dd></div>
                ))}
              </dl>
            </div>
            <div>
              <h3 className="visite-titulo">Telefone</h3>
              <a className="link-claro" href={TELEFONE_LINK}>{TELEFONE}</a>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <a className="btn btn-claro btn-grande" href={IFOOD_URL} target="_blank" rel="noopener noreferrer">
              Pedir no iFood
              <NovaAba />
            </a>
            <a className="btn btn-contorno-claro btn-grande" href={ROTA_URL} target="_blank" rel="noopener noreferrer">
              Traçar rota
              <NovaAba />
            </a>
          </div>
        </div>
        {FOTOS.loja && <Foto src={FOTOS.loja.src} legenda={FOTOS.loja.legenda} className="visite-foto" />}
      </div>
    </section>
  );
}

function Rodape() {
  return (
    <footer className="rodape">
      <div className="moldura rodape-grade">
        <div>
          <Logo claro />
          <p className="rodape-texto">Bolos caseiros desde 2012.</p>
        </div>
        <nav aria-label="Rodapé">
          <ul>
            {LINKS.map(([id, rotulo]) => (
              <li key={id}><a href={`#${id}`}>{rotulo}</a></li>
            ))}
          </ul>
        </nav>
        <div>
          <address className="rodape-texto">{ENDERECO_LINHAS.map((l) => <span key={l}>{l}</span>)}</address>
          <ul className="rodape-social">
            <li><a href={IFOOD_URL} target="_blank" rel="noopener noreferrer">iFood<NovaAba /></a></li>
            <li><a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">Facebook<NovaAba /></a></li>
            <li><a href={TELEFONE_LINK}>{TELEFONE}</a></li>
          </ul>
        </div>
      </div>
      <div className="moldura">
        <p className="rodape-copy">© {new Date().getFullYear()} Lá de Casa Bolos Caseiros</p>
      </div>
    </footer>
  );
}

/* ---------- Página ---------- */

export default function LaDeCasaSite() {
  return (
    <div className="ldc" lang="pt-BR">
      <style>{ESTILOS}</style>
      <a href="#conteudo" className="pular">Pular para o conteúdo</a>
      <Cabecalho />
      <main id="conteudo">
        <Abertura />
        <Manifesto />
        <Bolos />
        <Citacao />
        <Galeria />
        <Historia />
        <Ingredientes />
        <Visite />
      </main>
      <Rodape />
    </div>
  );
}

/* ==========================================================================
   ESTILOS
   ========================================================================== */

const ESTILOS = `
@import url('https://fonts.googleapis.com/css2?family=Gloock&family=Instrument+Sans:wght@400;500;600;700&display=swap');

.ldc{
  --creme:#F4ECDF; --papel:#FBF7F0; --cacau:#2A1D16; --cacau-2:#3A2A20;
  --texto:#2A1D16; --texto-suave:#6B5A4C; --caramelo:#C08A42; --caramelo-escuro:#8C5A22;
  --linha:#E2D5C1; --linha-escura:#CDBCA3; --creme-suave:rgba(244,236,223,.72);
  font-family:'Instrument Sans',system-ui,-apple-system,'Segoe UI',sans-serif;
  font-size:1.0625rem; line-height:1.6; color:var(--texto); background:var(--creme);
  -webkit-font-smoothing:antialiased; min-height:100vh;
}
.ldc *,.ldc *::before,.ldc *::after{box-sizing:border-box}
.ldc [id]{scroll-margin-top:76px}
.ldc :focus-visible{outline:2px solid var(--caramelo-escuro); outline-offset:3px; border-radius:4px}
.secao-cacau :focus-visible,.abertura :focus-visible,.menu :focus-visible,.rodape :focus-visible,.topo:not(.topo--solido) :focus-visible{outline-color:var(--caramelo)}
.ldc .sr-only{position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0}
.moldura{max-width:76rem; margin-inline:auto; padding-inline:clamp(1.25rem,4vw,3rem)}

/* Tipografia */
.t-abertura,.t-manifesto,.logo-nome,.fileira-titulo,.cartao-nome,.citacao p,.historia-ano,.sem li,.menu-link,.cartao-inicial{
  font-family:'Gloock',Georgia,'Times New Roman',serif; font-weight:400;
}
.t-abertura{font-size:clamp(2.9rem,8vw,7.25rem); line-height:.96; letter-spacing:-.02em; color:var(--creme); max-width:14ch}
.t-abertura span{display:block; text-wrap:balance}
.t-manifesto{font-size:clamp(1.65rem,3.4vw,2.85rem); line-height:1.16; letter-spacing:-.012em; max-width:30ch; text-wrap:pretty}
.rotulo{font-size:.95rem; font-weight:600; color:var(--caramelo-escuro); margin-bottom:1.25rem; display:flex; align-items:center; gap:.75rem}
.rotulo::before{content:""; width:2rem; height:1px; background:currentColor}
.secao-cacau .rotulo{color:var(--caramelo)}
.texto{font-size:1.1rem; color:var(--texto-suave); max-width:52ch}

/* Botões */
.btn{display:inline-flex; align-items:center; justify-content:center; gap:.5rem; font-weight:600; font-size:.98rem; line-height:1;
  padding:.85rem 1.3rem; border-radius:999px; border:1.5px solid transparent; text-decoration:none; cursor:pointer; white-space:nowrap;
  transition:background-color .2s ease,color .2s ease,border-color .2s ease,transform .12s ease}
.btn:active{transform:scale(.97)}
.btn-grande{padding:1.05rem 1.6rem; font-size:1.02rem}
.btn-escuro{background:var(--cacau); color:var(--creme)}
.btn-escuro:hover{background:var(--cacau-2)}
.btn-claro{background:var(--creme); color:var(--cacau)}
.btn-claro:hover{background:#fff}
.btn-contorno-claro{border-color:rgba(244,236,223,.55); color:var(--creme); background:transparent}
.btn-contorno-claro:hover{border-color:var(--creme); background:rgba(244,236,223,.08)}
.icone{width:1.25rem; height:1.25rem; flex:none}
.link-claro{color:var(--creme); font-weight:600; text-decoration:underline; text-underline-offset:5px; text-decoration-color:rgba(244,236,223,.4)}
.link-claro:hover{text-decoration-color:var(--caramelo)}
.pular{position:absolute; left:-9999px; top:10px; z-index:100; background:var(--cacau); color:var(--creme); padding:.6rem 1rem; border-radius:8px; font-weight:600}
.pular:focus{left:12px}

/* Cabeçalho */
.topo{position:fixed; inset:0 0 auto 0; z-index:50; transition:background-color .3s ease,box-shadow .3s ease}
.topo--solido{background:var(--creme); box-shadow:0 1px 0 var(--linha)}
.topo-grade{max-width:76rem; margin-inline:auto; padding:0 clamp(1.25rem,4vw,3rem); height:72px; display:grid; grid-template-columns:1fr auto 1fr; align-items:center}
.topo-menu{display:inline-flex; align-items:center; gap:.55rem; font:inherit; font-weight:600; font-size:.98rem; background:none; border:0; cursor:pointer; color:var(--creme); padding:.4rem 0; justify-self:start}
.topo--solido .topo-menu{color:var(--cacau)}
.topo-logo{text-decoration:none; justify-self:center}
.topo-pedido{justify-self:end}
.logo{display:inline-flex; flex-direction:column; align-items:center; line-height:1; color:var(--cacau)}
.logo--claro{color:var(--creme)}
.logo-nome{font-size:1.6rem; letter-spacing:-.01em}
.logo-sub{font-size:.68rem; font-weight:600; letter-spacing:.08em; margin-top:.25rem; opacity:.85}
.pedido-curto{display:none}
@media (max-width:480px){ .pedido-longo{position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap} .pedido-curto{display:inline} }
@media (max-width:640px){
  .topo-pedido{padding:.65rem .9rem; font-size:.88rem}
  .topo-menu span{display:none}
  .logo-nome{font-size:1.35rem}
}

/* Menu em tela cheia */
.menu{position:fixed; inset:0; z-index:60; background:var(--cacau); color:var(--creme); display:flex; flex-direction:column; overflow-y:auto}
.menu[hidden]{display:none}
.menu:not([hidden]){animation:aparecer .3s ease}
.menu-topo{max-width:76rem; width:100%; margin-inline:auto; padding:0 clamp(1.25rem,4vw,3rem); height:72px; display:grid; grid-template-columns:1fr auto 1fr; align-items:center}
.menu-topo .topo-menu{color:var(--creme)}
.menu-corpo{max-width:76rem; width:100%; margin:auto; padding:2rem clamp(1.25rem,4vw,3rem) 3rem}
.menu-corpo li{animation:subir .5s cubic-bezier(.2,.8,.25,1) both}
.menu-link{display:inline-block; font-size:clamp(2.4rem,7vw,5rem); line-height:1.12; color:var(--creme); text-decoration:none; transition:color .2s ease}
.menu-link:hover{color:var(--caramelo)}
.menu-rodape{margin-top:3rem; display:flex; flex-wrap:wrap; align-items:center; gap:1.5rem}
.menu-telefone{color:var(--creme-suave); text-decoration:none; font-weight:500}
@keyframes aparecer{from{opacity:0} to{opacity:1}}
@keyframes subir{from{opacity:0; transform:translateY(16px)} to{opacity:1; transform:none}}

/* Abertura */
.abertura{position:relative; isolation:isolate; min-height:100vh; min-height:100svh; display:flex; align-items:flex-end; background:var(--cacau); color:var(--creme); overflow:hidden}
.abertura-fundo{position:absolute; inset:0; z-index:-2; width:100%; height:100%; object-fit:cover}
.abertura--foto::after{content:""; position:absolute; inset:0; z-index:-1;
  background:linear-gradient(0deg,rgba(42,29,22,.9) 0%,rgba(42,29,22,.45) 50%,rgba(42,29,22,.25) 100%)}
.abertura-conteudo{width:100%; padding-top:8rem; padding-bottom:clamp(2.5rem,6vw,4.5rem)}
.t-abertura span{animation:subir .9s cubic-bezier(.2,.8,.25,1) both}
.t-abertura span:nth-child(2){animation-delay:.18s; color:var(--caramelo)}
.abertura-pe{margin-top:clamp(2rem,5vw,3.5rem); padding-top:1.75rem; border-top:1px solid rgba(244,236,223,.22);
  display:flex; flex-wrap:wrap; align-items:flex-end; justify-content:space-between; gap:1.75rem; animation:subir .9s .35s cubic-bezier(.2,.8,.25,1) both}
.abertura-sub{font-size:clamp(1.05rem,1.5vw,1.2rem); color:var(--creme-suave); max-width:40ch}

/* Seções */
.secao{padding-block:clamp(5rem,11vw,9rem)}
.secao-papel{background:var(--papel)}
.secao-cacau{background:var(--cacau); color:var(--creme)}
.secao-cacau .texto{color:var(--creme-suave)}

/* Fotos */
.foto{margin:0; overflow:hidden; background:var(--linha)}
.foto img{display:block; width:100%; height:100%; object-fit:cover}
.manifesto-fotos{display:grid; grid-template-columns:repeat(2,1fr); gap:clamp(1rem,3vw,2.5rem); margin-top:clamp(3rem,6vw,5rem)}
.foto-vertical{aspect-ratio:4/5}
.foto-deslocada{margin-top:clamp(3rem,10vw,8rem)}

/* Bolos */
.fileira{margin-top:clamp(3.5rem,7vw,5.5rem)}
.fileira-topo{display:flex; align-items:flex-end; justify-content:space-between; gap:1.5rem; padding-bottom:1.25rem; margin-bottom:1.75rem; border-bottom:1px solid var(--linha)}
.fileira-titulo{font-size:clamp(1.6rem,2.6vw,2.1rem); line-height:1.1}
.fileira-desc{color:var(--texto-suave); margin-top:.35rem}
.setas{display:flex; gap:.5rem}
.seta{width:2.9rem; height:2.9rem; display:grid; place-items:center; border-radius:50%; border:1.5px solid var(--linha-escura); background:transparent; color:inherit; cursor:pointer; transition:background-color .2s ease,border-color .2s ease,opacity .2s ease}
.seta:hover:not(:disabled){background:var(--cacau); border-color:var(--cacau); color:var(--creme)}
.seta:disabled{opacity:.35; cursor:default}
.trilho{list-style:none; margin:0; padding:0 0 .5rem; display:grid; grid-auto-flow:column; grid-auto-columns:calc((100% - 2 * 1.5rem) / 3.25);
  gap:1.5rem; overflow-x:auto; scroll-snap-type:x mandatory; scrollbar-width:none}
.trilho::-webkit-scrollbar{display:none}
@media (max-width:900px){ .trilho{grid-auto-columns:calc((100% - 1.25rem) / 2.3); gap:1.25rem} }
@media (max-width:560px){ .trilho{grid-auto-columns:72%} }
.cartao{scroll-snap-align:start}
.lista-bolos{list-style:none; margin:0; padding:0; display:grid; gap:0 2.5rem}
@media (min-width:700px){ .lista-bolos{grid-template-columns:repeat(2,1fr)} }
@media (min-width:1000px){ .lista-bolos{grid-template-columns:repeat(3,1fr)} }
.lista-bolos li{padding:1.1rem 0 1.4rem; border-bottom:1px solid var(--linha)}
.lista-bolos .cartao-nome{margin-top:0; font-size:clamp(1.5rem,2.2vw,1.85rem)}
.cartao-imagem{aspect-ratio:4/3; overflow:hidden; display:grid; place-items:center; position:relative; background:#EFE8DD}
.cartao-imagem img{width:100%; height:100%; object-fit:cover; transition:transform .6s cubic-bezier(.2,.7,.2,1)}
.cartao:hover .cartao-imagem img{transform:scale(1.04)}
.tom-0{background:var(--cacau); color:var(--caramelo)}
.tom-1{background:#E7D7BC; color:var(--caramelo-escuro)}
.tom-2{background:#C9A06A; color:var(--cacau)}
.cartao-inicial{font-size:clamp(5rem,9vw,8rem); line-height:1; opacity:.9}
.cartao-nome{font-size:1.4rem; line-height:1.15; margin-top:1rem}
.cartao-porcao{margin-top:.3rem; font-size:.9rem; font-weight:600; color:var(--caramelo-escuro)}
.cartao-selo{position:absolute; z-index:1; top:.75rem; right:.75rem; background:var(--cacau); color:var(--creme); font-size:.8rem; font-weight:600; padding:.35rem .7rem; border-radius:999px}
.cartao-detalhe{color:var(--texto-suave); font-size:.98rem; margin-top:.35rem; max-width:30ch}
.bolos-pe{margin-top:clamp(3.5rem,7vw,5rem); padding-top:2rem; border-top:1px solid var(--linha); display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:1.25rem}

/* Citação */
.citacao{margin:0}
.citacao p{font-size:clamp(2.1rem,5.4vw,4.6rem); line-height:1.08; letter-spacing:-.015em; max-width:20ch}
.citacao figcaption{margin-top:1.75rem; color:var(--caramelo); font-weight:600}
.citacao-pe{margin-top:clamp(3.5rem,7vw,5rem); padding-top:2rem; border-top:1px solid rgba(244,236,223,.2); display:grid; gap:1.5rem}
@media (min-width:900px){ .citacao-pe{grid-template-columns:1fr 2fr; align-items:start} .citacao-pe .link-claro{grid-column:2} }
.citacao-nota{color:var(--creme-suave)}
.citacao-nota strong{display:block; font-family:'Gloock',Georgia,serif; font-weight:400; font-size:3rem; line-height:1; color:var(--creme); margin-bottom:.35rem}
.citacao-outras{list-style:none; margin:0; padding:0; display:grid; gap:1.25rem}
@media (min-width:700px){ .citacao-outras{grid-template-columns:1fr 1fr} }
.citacao-outras blockquote{margin:0}
.citacao-outras p{font-size:1.08rem; color:var(--creme-suave); font-style:italic}

/* Galeria */
.galeria-quadro{position:relative; aspect-ratio:16/9; overflow:hidden; background:var(--linha)}
.galeria-quadro img{position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0; transition:opacity .6s ease}
.galeria-quadro img.is-ativa{opacity:1}
.galeria-controles{display:flex; align-items:center; justify-content:space-between; margin-top:1.25rem; font-weight:600}

/* História */
.historia{display:grid; gap:2rem}
@media (min-width:900px){ .historia{grid-template-columns:5fr 7fr; gap:4rem; align-items:start} }
.historia-ano{font-size:clamp(6rem,17vw,14rem); line-height:.82; color:var(--caramelo); letter-spacing:-.04em}
.historia-foto{margin-top:3rem; aspect-ratio:3/2}

/* Ingredientes */
.sem{list-style:none; margin:0; padding:0}
.sem li{font-size:clamp(2.3rem,7vw,5.75rem); line-height:1.02; letter-spacing:-.02em; padding-block:.35rem; border-bottom:1px solid var(--linha)}
.sem li:nth-child(even){padding-left:clamp(0rem,8vw,7rem)}
.sem-pe{margin-top:2.25rem; font-size:clamp(1.15rem,1.8vw,1.35rem); color:var(--texto-suave); max-width:40ch}

/* Visite */
.visite{display:grid; gap:3rem}
@media (min-width:900px){ .visite:has(.visite-foto){grid-template-columns:7fr 5fr; align-items:end} }
.visite-dados{display:grid; gap:2rem; margin-top:clamp(2.5rem,5vw,3.5rem)}
@media (min-width:700px){ .visite-dados{grid-template-columns:repeat(3,auto); justify-content:start; column-gap:clamp(2rem,5vw,4.5rem)} }
.visite-titulo{font-size:.9rem; font-weight:600; color:var(--caramelo); margin-bottom:.6rem}
.visite address{font-style:normal; display:flex; flex-direction:column; color:var(--creme)}
.visite dl div{display:flex; gap:1rem; justify-content:space-between}
.visite dt{color:var(--creme-suave)}
.visite dd{margin:0; font-weight:600}
.visite-foto{aspect-ratio:4/5}

/* Rodapé */
.rodape{background:var(--cacau-2); color:var(--creme); padding-top:4rem; padding-bottom:2rem}
.rodape-grade{display:grid; gap:2.5rem; padding-bottom:3rem; border-bottom:1px solid rgba(244,236,223,.15)}
@media (min-width:800px){ .rodape-grade{grid-template-columns:1.2fr 1fr 1.2fr} }
.rodape .logo{align-items:flex-start}
.rodape-texto{color:var(--creme-suave); margin-top:1rem; font-style:normal; display:flex; flex-direction:column}
.rodape ul{list-style:none; margin:0; padding:0; display:grid; gap:.6rem}
.rodape a{color:var(--creme); text-decoration:none}
.rodape a:hover{color:var(--caramelo)}
.rodape-social{margin-top:1.25rem !important}
.rodape-copy{margin-top:1.5rem; font-size:.9rem; color:var(--creme-suave)}

@media (prefers-reduced-motion: reduce){
  .ldc *,.ldc *::before,.ldc *::after{animation:none !important; transition-duration:.01ms !important}
}
`;

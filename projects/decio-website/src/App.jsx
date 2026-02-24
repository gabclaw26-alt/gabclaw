import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Menu, X, Phone, Mail, MapPin, Clock, ChevronDown,
  Brain, Heart, Users, Star, Award, BookOpen,
  Shield, Leaf, ArrowUp, Instagram, Linkedin, ExternalLink,
  CheckCircle, Stethoscope, MessageCircle
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Sobre',        href: '#sobre' },
  { label: 'Especialidades', href: '#especialidades' },
  { label: 'Abordagem',    href: '#abordagem' },
  { label: 'Depoimentos',  href: '#depoimentos' },
  { label: 'Contato',      href: '#contato' },
];

const CREDENTIALS = [
  { icon: BookOpen, label: 'Graduação em Medicina', sub: 'UEG — atual UERJ' },
  { icon: Award,    label: 'Formação em Psicanálise', sub: 'Soc. Bras. de Psicoterapia e Psicanálise — 1987' },
  { icon: Shield,   label: 'Especialista em Psiquiatria', sub: 'CRM RJ 156481 · RQE 28107 · 2008' },
  { icon: Star,     label: 'Especialista em Psicoterapia', sub: '2011' },
];

const SPECIALTIES = [
  {
    icon: Brain,
    title: 'Psicanálise Breve',
    description:
      'Abordagem focal que identifica o núcleo emocional do conflito através da interpretação de sonhos, promovendo resolução efetiva em menos tempo.',
  },
  {
    icon: Heart,
    title: 'Psiquiatria de Adultos',
    description:
      'Diagnóstico e tratamento de transtornos do humor, ansiedade generalizada, fobias, pânico, TOC e disfunções psicogênicas.',
  },
  {
    icon: Users,
    title: 'Psicoterapia Individual e de Casal',
    description:
      'Espaço seguro para elaboração de conflitos relacionais e individuais, com técnicas junguianas, transpessoais e orientação parental.',
  },
  {
    icon: Stethoscope,
    title: 'Tratamento Combinado',
    description:
      'Quando necessário, psicoterapia e medicação se complementam — o remédio como suporte temporário, a análise como caminho permanente.',
  },
  {
    icon: Leaf,
    title: 'Análise Junguiana e Transpessoal',
    description:
      'Trabalho com o inconsciente coletivo, arquétipos e dimensões espirituais do psiquismo, promovendo uma visão integral da saúde mental.',
  },
  {
    icon: MessageCircle,
    title: 'Telemedicina',
    description:
      'Consultas por vídeo disponíveis para todo o Brasil e para brasileiros no exterior — mesma qualidade, sem deslocamento.',
  },
];

const CONDITIONS = [
  'Ansiedade Generalizada',
  'Depressão',
  'Síndrome do Pânico',
  'Fobias',
  'TOC — Transtorno Obsessivo-Compulsivo',
  'Transtornos de Humor',
  'Estresse e Burnout',
  'Disfunção Sexual Psicogênica',
  'Dificuldades nos Relacionamentos',
  'Orientação Parental',
];

const TESTIMONIALS = [
  {
    name: 'Mariana S.',
    location: 'Rio de Janeiro, RJ',
    text: 'O Dr. Décio tem uma capacidade única de ouvir com profundidade. Em poucos meses consegui compreender padrões que carregava há décadas. A interpretação dos sonhos foi reveladora.',
    stars: 5,
  },
  {
    name: 'Ricardo F.',
    location: 'São Paulo, SP — Telemedicina',
    text: 'Cheguei com crises de pânico que me impediam de trabalhar. A abordagem do doutor foi direta e eficaz — sem me tornar dependente de medicação. Mudou minha vida.',
    stars: 5,
  },
  {
    name: 'Alessandra M.',
    location: 'Lisboa, Portugal — Telemedicina',
    text: 'Mesmo à distância, a conexão é genuína. Ele explica cada etapa com clareza e nunca me fez sentir julgada. Recomendo sem hesitar a qualquer brasileiro no exterior.',
    stars: 5,
  },
  {
    name: 'Carlos H.',
    location: 'Rio de Janeiro, RJ',
    text: 'Tentei outras abordagens antes, mas a psicanálise breve com o Dr. Décio foi a única que tocou na raiz do problema. Gratidão genuína.',
    stars: 5,
  },
];

const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Primeira Consulta',
    description:
      'Escuta ativa e sem julgamentos para mapear o histórico emocional, compreender o motivo da busca e estabelecer um vínculo terapêutico sólido.',
  },
  {
    num: '02',
    title: 'Avaliação e Diagnóstico',
    description:
      'Identificação dos padrões inconscientes que alimentam o sofrimento, com análise de sonhos, comportamentos e histórico relacional.',
  },
  {
    num: '03',
    title: 'Plano Terapêutico',
    description:
      'Definição da abordagem mais adequada — psicanálise breve, terapia transpessoal, medicação complementar ou tratamento combinado.',
  },
  {
    num: '04',
    title: 'Trabalho Analítico',
    description:
      'Sessões semanais inicialmente, com progressão para encontros mensais à medida que a autonomia emocional se consolida.',
  },
  {
    num: '05',
    title: 'Alta e Continuidade',
    description:
      'O objetivo é a resolução, não a dependência. O trabalho termina quando o paciente possui ferramentas para conduzir sua própria vida com equilíbrio.',
  },
];

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={13} className="fill-amber-500 text-amber-500" />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const nav = navRef.current;
    ScrollTrigger.create({
      start: 80,
      onEnter: () => {
        gsap.to(nav, {
          backgroundColor: 'rgba(250,250,249,0.96)',
          backdropFilter: 'blur(12px)',
          borderBottomColor: '#e7e5e4',
          duration: 0.4,
          ease: 'power2.out',
        });
      },
      onLeaveBack: () => {
        gsap.to(nav, {
          backgroundColor: 'transparent',
          backdropFilter: 'blur(0px)',
          borderBottomColor: 'transparent',
          duration: 0.4,
          ease: 'power2.out',
        });
      },
    });
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 border-b border-transparent"
      style={{ backgroundColor: 'transparent' }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#inicio" className="flex flex-col leading-none">
          <span
            className="font-display text-xl font-medium tracking-wide"
            style={{ color: '#1c1917' }}
          >
            Dr. Décio
          </span>
          <span
            className="font-mono text-[10px] tracking-widest uppercase"
            style={{ color: '#8B6914' }}
          >
            Formedacunha
          </span>
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className="link-underline font-body text-sm font-medium"
                style={{ color: '#44403c' }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#contato"
          className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded transition-all duration-200 hover:brightness-110 active:scale-95"
          style={{ backgroundColor: '#8B6914', color: '#fff' }}
        >
          <Phone size={14} />
          Agendar Consulta
        </a>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu"
          style={{ color: '#44403c' }}
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col"
          style={{ backgroundColor: '#fafaf9' }}
        >
          <div className="flex items-center justify-between px-6 h-16 border-b" style={{ borderColor: '#e7e5e4' }}>
            <span className="font-display text-xl font-medium">Menu</span>
            <button onClick={() => setMenuOpen(false)} aria-label="Fechar menu" style={{ color: '#44403c' }}>
              <X size={22} />
            </button>
          </div>
          <ul className="flex flex-col gap-1 px-6 pt-8">
            {NAV_LINKS.map(({ label, href }, i) => (
              <li key={href} style={{ animationDelay: `${i * 60}ms` }}>
                <a
                  href={href}
                  className="block py-3 font-display text-3xl font-light border-b"
                  style={{ borderColor: '#e7e5e4', color: '#1c1917' }}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-auto px-6 pb-10">
            <a
              href="#contato"
              className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium rounded transition-all duration-200"
              style={{ backgroundColor: '#8B6914', color: '#fff' }}
              onClick={() => setMenuOpen(false)}
            >
              <Phone size={14} />
              Agendar Consulta
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
function Hero() {
  const titleRef   = useRef(null);
  const subRef     = useRef(null);
  const ctaRef     = useRef(null);
  const scrollRef  = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });
    tl.from(titleRef.current.querySelectorAll('.hero-line'), {
      y: 48,
      opacity: 0,
      stagger: 0.1,
      duration: 1.1,
      ease: 'power3.out',
    })
      .from(subRef.current, { y: 24, opacity: 0, duration: 0.9, ease: 'power2.out' }, '-=0.6')
      .from(ctaRef.current, { y: 16, opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
      .from(scrollRef.current, { opacity: 0, duration: 0.6 }, '-=0.2');

    // Scroll chevron bounce
    gsap.to(scrollRef.current, {
      y: 8,
      repeat: -1,
      yoyo: true,
      duration: 1.1,
      ease: 'sine.inOut',
      delay: 1.6,
    });
  }, []);

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&q=80")',
        }}
      />
      {/* Warm overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(160deg, rgba(250,245,235,0.88) 0%, rgba(250,240,210,0.80) 50%, rgba(139,105,20,0.25) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium mb-8 border"
          style={{ borderColor: '#c4a35a', color: '#8B6914', backgroundColor: 'rgba(196,163,90,0.1)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Consultas disponíveis — presencial e telemedicina
        </div>

        <h1 ref={titleRef} className="font-display font-medium leading-[1.05] mb-6">
          <span
            className="hero-line block text-5xl sm:text-6xl md:text-7xl xl:text-8xl"
            style={{ color: '#1c1917' }}
          >
            Psicanálise que
          </span>
          <span
            className="hero-line block text-5xl sm:text-6xl md:text-7xl xl:text-8xl italic"
            style={{ color: '#8B6914' }}
          >
            resolve.
          </span>
          <span
            className="hero-line block text-5xl sm:text-6xl md:text-7xl xl:text-8xl"
            style={{ color: '#1c1917' }}
          >
            Não apenas alivia.
          </span>
        </h1>

        <p
          ref={subRef}
          className="text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10"
          style={{ color: '#57534e' }}
        >
          Dr. Décio de Formedacunha — psicanalista e psiquiatra com mais de 35 anos de
          experiência no Rio de Janeiro. Análise breve, interpretação de sonhos e
          tratamento que chega à raiz emocional.
        </p>

        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#contato"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded text-sm font-medium transition-all duration-200 hover:brightness-110 active:scale-95"
            style={{ backgroundColor: '#8B6914', color: '#fff' }}
          >
            <Phone size={15} />
            Agendar Consulta
          </a>
          <a
            href="#sobre"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded text-sm font-medium border transition-all duration-200 hover:bg-stone-100 active:scale-95"
            style={{ borderColor: '#c4a35a', color: '#44403c' }}
          >
            Conhecer o doutor
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: '#78716c' }}
      >
        <span className="font-mono text-[10px] tracking-widest uppercase">Role para baixo</span>
        <ChevronDown size={16} />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   ABOUT
───────────────────────────────────────────── */
function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.from(sectionRef.current.querySelectorAll('.reveal'), {
      y: 32,
      opacity: 0,
      stagger: 0.12,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 72%',
      },
    });
  }, []);

  return (
    <section id="sobre" ref={sectionRef} className="py-24 sm:py-32" style={{ backgroundColor: '#fafaf9' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <div className="reveal relative">
            <div
              className="absolute -top-4 -left-4 w-full h-full rounded-lg border"
              style={{ borderColor: '#c4a35a', opacity: 0.4 }}
            />
            <img
              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80"
              alt="Dr. Décio de Formedacunha"
              className="relative w-full h-[500px] object-cover rounded-lg"
              style={{ boxShadow: '0 20px 60px rgba(139,105,20,0.12)' }}
            />
            {/* Stats badge */}
            <div
              className="absolute -bottom-6 -right-6 px-6 py-4 rounded-lg border shadow-lg"
              style={{ backgroundColor: '#fafaf9', borderColor: '#e7e5e4' }}
            >
              <p className="font-display text-4xl font-medium" style={{ color: '#8B6914' }}>+35</p>
              <p className="text-xs font-medium tracking-wide" style={{ color: '#78716c' }}>Anos de experiência</p>
            </div>
          </div>

          {/* Text side */}
          <div className="space-y-6">
            <div className="reveal">
              <p className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: '#8B6914' }}>
                Sobre o Dr. Décio
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-medium leading-tight" style={{ color: '#1c1917' }}>
                Uma vida dedicada à<br />
                <span className="italic" style={{ color: '#8B6914' }}>saúde emocional</span>
              </h2>
            </div>

            <p className="reveal text-base leading-relaxed" style={{ color: '#57534e' }}>
              Médico psicanalista, psicoterapeuta e psiquiatra de adultos, o Dr. Décio de Formedacunha
              aplica princípios da psicologia profunda para resolver distúrbios emocionais com eficácia
              e duradoura. Formado pela UEG — atual UERJ — e com formação psicanalítica desde 1987, ele
              acumula décadas de experiência clínica no Rio de Janeiro.
            </p>

            <p className="reveal text-base leading-relaxed" style={{ color: '#57534e' }}>
              Sua abordagem privilegia a psicanálise breve com interpretação de sonhos para identificar
              o núcleo emocional que precisa ser corrigido — buscando resolução real, não apenas
              administração de sintomas. Mais de 300 pacientes documentaram transformações profundas
              ao longo de seus anos de prática.
            </p>

            {/* Credentials */}
            <div className="reveal grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {CREDENTIALS.map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 p-3 rounded-lg border"
                  style={{ borderColor: '#e7e5e4', backgroundColor: '#f5f5f4' }}
                >
                  <Icon size={16} className="mt-0.5 shrink-0" style={{ color: '#8B6914' }} />
                  <div>
                    <p className="text-xs font-semibold leading-snug" style={{ color: '#1c1917' }}>{label}</p>
                    <p className="text-[11px] leading-snug mt-0.5" style={{ color: '#78716c' }}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SPECIALTIES
───────────────────────────────────────────── */
function Specialties() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.from(sectionRef.current.querySelectorAll('.specialty-card'), {
      y: 40,
      opacity: 0,
      stagger: 0.1,
      duration: 0.85,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
      },
    });
  }, []);

  return (
    <section
      id="especialidades"
      ref={sectionRef}
      className="py-24 sm:py-32"
      style={{ backgroundColor: '#f5f5f4' }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: '#8B6914' }}>
            Especialidades
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-medium leading-tight" style={{ color: '#1c1917' }}>
            Áreas de atuação
          </h2>
          <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: '#78716c' }}>
            Tratamentos especializados para uma ampla gama de questões emocionais e psiquiátricas,
            sempre com foco na raiz — não apenas nos sintomas.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SPECIALTIES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="specialty-card group p-6 rounded-xl border transition-transform duration-300 hover:-translate-y-2"
              style={{
                backgroundColor: '#fafaf9',
                borderColor: '#e7e5e4',
                borderTopWidth: '2px',
                borderTopColor: '#c4a35a',
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors duration-200 group-hover:bg-amber-100"
                style={{ backgroundColor: 'rgba(196,163,90,0.12)' }}
              >
                <Icon size={20} style={{ color: '#8B6914' }} />
              </div>
              <h3 className="font-display text-lg font-medium mb-2" style={{ color: '#1c1917' }}>
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#78716c' }}>
                {description}
              </p>
            </div>
          ))}
        </div>

        {/* Conditions pills */}
        <div className="mt-16">
          <p className="text-center text-sm font-medium mb-6" style={{ color: '#78716c' }}>
            Condições tratadas
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {CONDITIONS.map((c) => (
              <span
                key={c}
                className="px-3 py-1.5 rounded-full text-xs font-medium border"
                style={{ borderColor: '#d6d3d1', color: '#57534e', backgroundColor: '#fafaf9' }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PHILOSOPHY (APPROACH)
───────────────────────────────────────────── */
function Philosophy() {
  const sectionRef    = useRef(null);
  const quoteRef      = useRef(null);
  const statementsRef = useRef(null);

  useEffect(() => {
    gsap.from(quoteRef.current, {
      y: 40,
      opacity: 0,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 65%',
      },
    });
    gsap.from(statementsRef.current.querySelectorAll('.contrast-line'), {
      x: -30,
      opacity: 0,
      stagger: 0.18,
      duration: 0.85,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: statementsRef.current,
        start: 'top 72%',
      },
    });
  }, []);

  return (
    <section
      id="abordagem"
      ref={sectionRef}
      className="py-24 sm:py-32"
      style={{ backgroundColor: '#1c1917' }}
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Pull quote */}
        <div ref={quoteRef} className="text-center mb-20">
          <p className="font-mono text-xs tracking-widest uppercase mb-6" style={{ color: '#c4a35a' }}>
            Filosofia terapêutica
          </p>
          <blockquote
            className="font-display text-3xl sm:text-4xl md:text-5xl font-light leading-snug"
            style={{ color: '#f5f5f4' }}
          >
            "A psicanálise breve não encurta o caminho —<br className="hidden sm:block" />
            <span className="italic" style={{ color: '#c4a35a' }}>
              {' '}ela vai direto ao ponto.
            </span>"
          </blockquote>
          <p className="mt-6 text-sm font-medium" style={{ color: '#a8a29e' }}>
            — Dr. Décio de Formedacunha
          </p>
        </div>

        {/* Contrast statements */}
        <div
          ref={statementsRef}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t pt-16"
          style={{ borderColor: '#333' }}
        >
          {[
            {
              not: 'Não dependência de medicamentos.',
              is: 'A cura como caminho, o remédio como apoio temporário.',
            },
            {
              not: 'Não tratar sintomas indefinidamente.',
              is: 'Chegar à raiz emocional e resolver.',
            },
            {
              not: 'Não análise interminável.',
              is: 'Psicanálise breve com resultado mensurável.',
            },
            {
              not: 'Não escuta passiva.',
              is: 'Interpretação ativa de sonhos e padrões inconscientes.',
            },
          ].map(({ not, is }, i) => (
            <div
              key={i}
              className="contrast-line p-6 rounded-xl border"
              style={{ backgroundColor: '#1a1614', borderColor: '#2a2420' }}
            >
              <p className="text-sm line-through mb-2" style={{ color: '#57534e' }}>{not}</p>
              <p className="text-base font-medium" style={{ color: '#f5f5f4' }}>{is}</p>
            </div>
          ))}
        </div>

        {/* Process steps */}
        <div className="mt-20">
          <p className="text-center font-mono text-xs tracking-widest uppercase mb-12" style={{ color: '#c4a35a' }}>
            Como funciona o tratamento
          </p>
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-6 top-0 bottom-0 w-px hidden sm:block"
              style={{ backgroundColor: '#2a2420' }}
            />
            <div className="space-y-8">
              {PROCESS_STEPS.map(({ num, title, description }) => (
                <div key={num} className="relative flex gap-6 sm:pl-16">
                  <div
                    className="absolute left-0 sm:left-0 w-12 h-12 rounded-full flex items-center justify-center shrink-0 border font-mono text-xs font-medium"
                    style={{
                      backgroundColor: '#1c1917',
                      borderColor: '#c4a35a',
                      color: '#c4a35a',
                      zIndex: 1,
                    }}
                  >
                    {num}
                  </div>
                  <div className="pt-2.5 sm:pt-0 pl-16 sm:pl-0">
                    <h3 className="font-display text-lg font-medium mb-1" style={{ color: '#f5f5f4' }}>
                      {title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#78716c' }}>
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────────────── */
function Testimonials() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.from(sectionRef.current.querySelectorAll('.testimonial-card'), {
      y: 36,
      opacity: 0,
      stagger: 0.12,
      duration: 0.85,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
      },
    });
  }, []);

  return (
    <section id="depoimentos" ref={sectionRef} className="py-24 sm:py-32" style={{ backgroundColor: '#fafaf9' }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-mono text-xs tracking-widests uppercase mb-3" style={{ color: '#8B6914' }}>
            Depoimentos
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-medium leading-tight" style={{ color: '#1c1917' }}>
            O que dizem os pacientes
          </h2>
          <p className="mt-3 text-base" style={{ color: '#78716c' }}>
            Mais de 300 depoimentos de pacientes transformados
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {TESTIMONIALS.map(({ name, location, text, stars }) => (
            <div
              key={name}
              className="testimonial-card p-6 rounded-xl border transition-transform duration-300 hover:-translate-y-1"
              style={{ backgroundColor: '#f5f5f4', borderColor: '#e7e5e4' }}
            >
              <Stars count={stars} />
              <p className="mt-4 text-sm leading-relaxed" style={{ color: '#44403c' }}>
                "{text}"
              </p>
              <div className="mt-5 flex items-center gap-3 pt-4 border-t" style={{ borderColor: '#e7e5e4' }}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                  style={{ backgroundColor: '#c4a35a', color: '#fff' }}
                >
                  {name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#1c1917' }}>{name}</p>
                  <p className="text-xs" style={{ color: '#78716c' }}>{location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CONTACT
───────────────────────────────────────────── */
function Contact() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.from(sectionRef.current.querySelectorAll('.reveal'), {
      y: 32,
      opacity: 0,
      stagger: 0.1,
      duration: 0.85,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 72%',
      },
    });
  }, []);

  return (
    <section id="contato" ref={sectionRef} className="py-24 sm:py-32" style={{ backgroundColor: '#f5f5f4' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info */}
          <div className="space-y-8">
            <div className="reveal">
              <p className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: '#8B6914' }}>
                Contato & Agendamento
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-medium leading-tight" style={{ color: '#1c1917' }}>
                Agende sua<br />
                <span className="italic" style={{ color: '#8B6914' }}>primeira consulta</span>
              </h2>
            </div>

            <p className="reveal text-base leading-relaxed" style={{ color: '#57534e' }}>
              A primeira consulta é o passo mais importante. Entre em contato por telefone ou WhatsApp
              para verificar disponibilidade. Consultas presenciais no Rio de Janeiro e por telemedicina
              para todo o Brasil e exterior.
            </p>

            <div className="reveal space-y-4">
              {[
                { icon: Phone, label: 'Telefone / WhatsApp', value: '+55 (21) 99721-6310', href: 'tel:+5521997216310' },
                { icon: MapPin, label: 'Localização', value: 'Rio de Janeiro, RJ — Brasil', href: null },
                { icon: Clock, label: 'Valor da teleconsulta', value: 'R$ 350,00 por sessão', href: null },
                { icon: CheckCircle, label: 'Telemedicina', value: 'Disponível para todo o Brasil e exterior', href: null },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'rgba(196,163,90,0.15)' }}
                  >
                    <Icon size={17} style={{ color: '#8B6914' }} />
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-0.5" style={{ color: '#78716c' }}>{label}</p>
                    {href ? (
                      <a href={href} className="text-sm font-medium link-underline" style={{ color: '#1c1917' }}>
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium" style={{ color: '#1c1917' }}>{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* CRM badge */}
            <div
              className="reveal inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-mono"
              style={{ borderColor: '#d6d3d1', color: '#78716c' }}
            >
              <Shield size={13} style={{ color: '#8B6914' }} />
              CRM RJ 156481 · RQE Nº 28107
            </div>
          </div>

          {/* Form */}
          <div className="reveal">
            <form
              className="p-8 rounded-2xl border space-y-5"
              style={{ backgroundColor: '#fafaf9', borderColor: '#e7e5e4' }}
              onSubmit={(e) => {
                e.preventDefault();
                alert('Mensagem enviada! O Dr. Décio entrará em contato em breve.');
              }}
            >
              <h3 className="font-display text-2xl font-medium" style={{ color: '#1c1917' }}>
                Envie uma mensagem
              </h3>

              {[
                { id: 'name',  label: 'Nome completo', type: 'text',  placeholder: 'Seu nome' },
                { id: 'email', label: 'E-mail',         type: 'email', placeholder: 'seu@email.com' },
                { id: 'phone', label: 'Telefone',       type: 'tel',   placeholder: '+55 (21) 9xxxx-xxxx' },
              ].map(({ id, label, type, placeholder }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-xs font-medium mb-1.5" style={{ color: '#57534e' }}>
                    {label}
                  </label>
                  <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2"
                    style={{
                      borderColor: '#e7e5e4',
                      backgroundColor: '#f5f5f4',
                      color: '#1c1917',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#c4a35a')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#e7e5e4')}
                  />
                </div>
              ))}

              <div>
                <label htmlFor="message" className="block text-xs font-medium mb-1.5" style={{ color: '#57534e' }}>
                  Mensagem
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Descreva brevemente o que você busca no tratamento..."
                  className="w-full px-4 py-2.5 rounded-lg border text-sm resize-none transition-all duration-200 focus:outline-none"
                  style={{
                    borderColor: '#e7e5e4',
                    backgroundColor: '#f5f5f4',
                    color: '#1c1917',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#c4a35a')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#e7e5e4')}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:brightness-110 active:scale-95"
                style={{ backgroundColor: '#8B6914', color: '#fff' }}
              >
                Enviar mensagem
              </button>

              <p className="text-xs text-center" style={{ color: '#a8a29e' }}>
                Resposta em até 24 horas. Sigilo garantido.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <footer
      className="pt-16 pb-8 border-t"
      style={{
        backgroundColor: '#0c0a09',
        borderTopColor: 'rgba(196,163,90,0.2)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b" style={{ borderColor: '#1c1917' }}>
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-display text-2xl font-medium mb-1" style={{ color: '#f5f5f4' }}>
              Dr. Décio
            </p>
            <p className="font-mono text-[10px] tracking-widest uppercase mb-4" style={{ color: '#c4a35a' }}>
              de Formedacunha
            </p>
            <p className="text-sm leading-relaxed mb-5" style={{ color: '#78716c' }}>
              Psicanalista e psiquiatra com mais de 35 anos de experiência. Rio de Janeiro — atendimento presencial e por telemedicina.
            </p>
            <div className="flex gap-3">
              {[Instagram, Linkedin, ExternalLink].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg border flex items-center justify-center transition-colors duration-200 hover:border-amber-700"
                  style={{ borderColor: '#292524', color: '#78716c' }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#f5f5f4' }}>
              Navegação
            </p>
            <ul className="space-y-2.5">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-sm link-underline transition-colors duration-200 hover:text-stone-300"
                    style={{ color: '#78716c' }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#f5f5f4' }}>
              Especialidades
            </p>
            <ul className="space-y-2.5">
              {['Psicanálise Breve', 'Psiquiatria', 'Psicoterapia', 'Análise Junguiana', 'Telemedicina'].map((s) => (
                <li key={s}>
                  <a href="#especialidades" className="text-sm transition-colors duration-200 hover:text-stone-300" style={{ color: '#78716c' }}>
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold tracking-widests uppercase mb-4" style={{ color: '#f5f5f4' }}>
              Contato
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm" style={{ color: '#78716c' }}>
                <Phone size={13} style={{ color: '#c4a35a' }} />
                +55 (21) 99721-6310
              </li>
              <li className="flex items-center gap-2 text-sm" style={{ color: '#78716c' }}>
                <MapPin size={13} style={{ color: '#c4a35a' }} />
                Rio de Janeiro, RJ
              </li>
              <li className="flex items-center gap-2 text-sm" style={{ color: '#78716c' }}>
                <Shield size={13} style={{ color: '#c4a35a' }} />
                CRM RJ 156481
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
          <p className="text-xs" style={{ color: '#44403c' }}>
            © {new Date().getFullYear()} Dr. Décio de Formedacunha. Todos os direitos reservados.
          </p>
          <p className="font-mono text-[10px] tracking-widest uppercase" style={{ color: '#44403c' }}>
            Built with Vera
          </p>
          {showTop && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-8 right-8 w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{ backgroundColor: '#8B6914', borderColor: '#c4a35a', color: '#fff' }}
              aria-label="Voltar ao topo"
            >
              <ArrowUp size={16} />
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   APP ROOT
───────────────────────────────────────────── */
export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Specialties />
        <Philosophy />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

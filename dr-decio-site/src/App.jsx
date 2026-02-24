import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  Brain, Eye, Heart, Shield, Clock, Video, Star, MessageCircle, 
  ChevronDown, Phone, Mail, MapPin, Check, Activity, Users, Award,
  Calendar, ArrowRight, Play, Quote
} from 'lucide-react'
import './index.css'

gsap.registerPlugin(ScrollTrigger)

// Noise Overlay Component
const NoiseOverlay = () => (
  <div className="noise-overlay">
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
)

// ========================
// A. NAVBAR — "Floating Island"
// ========================
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 rounded-[3rem] ${
      scrolled ? 'glass py-3 px-6' : 'bg-transparent py-6 px-8'
    }`}>
      <div className="flex items-center gap-8">
        <div className="text-lg font-display font-bold tracking-tight text-ivory">
          Dr. Decio<span className="text-champagne">.</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-ivory/80">
          <button onClick={() => scrollToSection('about')} className="hover:text-champagne transition-colors">Sobre</button>
          <button onClick={() => scrollToSection('tratamentos')} className="hover:text-champagne transition-colors">Tratamentos</button>
          <button onClick={() => scrollToSection('protocolo')} className="hover:text-champagne transition-colors">Protocolo</button>
          <button onClick={() => scrollToSection('depoimentos')} className="hover:text-champagne transition-colors">Depoimentos</button>
        </div>
        <button onClick={() => scrollToSection('contato')} className="btn-primary bg-champagne text-obsidian px-6 py-2.5 rounded-full font-semibold text-sm">
          Agende sua consulta
        </button>
      </div>
    </nav>
  )
}

// ========================
// B. HERO SECTION — "The Opening Shot"
// ========================
const Hero = () => {
  const heroRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 })
      
      tl.from(titleRef.current.querySelectorAll('.word'), {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: 'power3.out'
      })
      .from(subtitleRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.6')
      .from(ctaRef.current.children, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out'
      }, '-=0.4')
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-end pb-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80" 
          alt="Elegant dark architectural interior" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/85 to-obsidian/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/70 via-transparent to-obsidian/30" />
      </div>

      {/* Doctor Photo - Bottom Right */}
      <div className="absolute bottom-24 right-6 md:right-24 z-10 hidden md:block">
        <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-champagne/30 shadow-2xl">
          <img 
            src="https://s3-sa-east-1.amazonaws.com/doctoralia.com.br/doctor/724152/72415230977e525aca89dbc79a6fa5c0_large.jpg" 
            alt="Dr. Decio Deforme da Cunha" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div ref={titleRef} className="hero-title max-w-4xl mb-8">
          <div className="word overflow-hidden"><span className="line-1 text-ivory">Psicanálise breve</span></div>
          <div className="word overflow-hidden"><span className="line-1 text-ivory">com interpretação</span></div>
          <div className="word overflow-hidden"><span className="line-2">de sonhos</span></div>
        </div>
        
        <p ref={subtitleRef} className="text-lg md:text-xl text-ivory/70 max-w-xl mb-10 leading-relaxed font-sans">
          Dr. Decio Deforme da Cunha — Psicanalista e Psiquiatra no Rio de Janeiro. 
          Tratamento resolutivo através de psicanálises breves e interpretação de sonhos. 
          Atendimento presencial e teleconsulta para todo o Brasil.
        </p>

        <div ref={ctaRef} className="flex flex-wrap gap-4">
          <button className="btn-primary bg-champagne text-obsidian px-8 py-4 rounded-full font-semibold text-lg shadow-lg shadow-champagne/20">
            Agende sua consulta
          </button>
          <button className="glass text-ivory px-8 py-4 rounded-full font-semibold text-lg hover:bg-slate/60 transition-all duration-300 flex items-center gap-2">
            <Video size={20} />
            Teleconsulta disponível
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="text-champagne/60" size={32} />
      </div>
    </section>
  )
}

// ========================
// STATS SECTION
// ========================
const Stats = () => {
  const statsRef = useRef(null)
  const statItemsRef = useRef([])

  const stats = [
    { icon: Star, value: '500+', label: 'Avaliações de pacientes' },
    { icon: MessageCircle, value: '82+', label: 'Perguntas respondidas' },
    { icon: Clock, value: '37+', label: 'Anos de experiência' },
    { icon: Heart, value: 'CRM RJ 156481', label: 'Psiquiatra RQE 28107' }
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(statItemsRef.current, {
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
      })
    }, statsRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={statsRef} className="section-padding bg-obsidian border-y border-slate/30">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              ref={el => statItemsRef.current[index] = el}
              className="text-center group"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-slate/30 flex items-center justify-center group-hover:bg-champagne/10 transition-colors">
                <stat.icon className="w-7 h-7 text-champagne" />
              </div>
              <div className="text-3xl md:text-4xl font-display font-bold text-champagne mb-2">{stat.value}</div>
              <div className="text-sm text-ivory/50 font-sans">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ========================
// C. FEATURES — "Interactive Functional Artifacts"
// ========================
const Features = () => {
  const sectionRef = useRef(null)
  const cardsRef = useRef([])
  const [activeCard, setActiveCard] = useState(0)
  const [typedText, setTypedText] = useState('')
  
  const features = [
    {
      pattern: 'shuffler',
      icon: Eye,
      title: 'Psicanálise Breve com Interpretação de Sonhos',
      description: 'Método estruturado que utiliza a análise dos sonhos como ferramenta terapêutica poderosa para acessar o inconsciente e promover transformações profundas em tempo reduzido.',
      details: ['Acesso ao inconsciente', 'Transformação rápida', 'Método validado']
    },
    {
      pattern: 'typewriter',
      icon: Activity,
      title: 'Tratamento Dual (Psicoterapia + Medicação)',
      description: 'Abordagem integrada que combina psicoterapia e medicação quando necessário, garantindo um tratamento completo e personalizado. O mesmo profissional conduz e prescreve.',
      details: ['Psicoterapia integrada', 'Prescrição psiquiátrica', 'Acompanhamento completo']
    },
    {
      pattern: 'scheduler',
      icon: Video,
      title: 'Teleconsulta para Todo Brasil e Exterior',
      description: 'Atendimento online disponível para brasileiros em qualquer lugar do Brasil e no exterior, mantendo a mesma qualidade e sigilo do atendimento presencial.',
      details: ['Todo Brasil', 'Brasileiros no exterior', 'Qualidade presencial']
    }
  ]

  // Typewriter effect
  useEffect(() => {
    const text = "Analisando padrões de sonho... Processando memórias inconscientes... Decodificando símbolos..."
    let i = 0
    const interval = setInterval(() => {
      setTypedText(text.slice(0, i + 1))
      i++
      if (i >= text.length) clearInterval(interval)
    }, 30)
    return () => clearInterval(interval)
  }, [])

  // Shuffler auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % 3)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardsRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const getDayClasses = (dayIndex) => {
    const base = "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 "
    if (activeCard === 2) {
      if (dayIndex >= 1 && dayIndex <= 5) return base + "bg-champagne text-obsidian"
    }
    return base + "bg-slate/30 text-ivory/60"
  }

  return (
    <section ref={sectionRef} id="tratamentos" className="section-padding bg-obsidian">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm font-mono text-champagne mb-4 tracking-widest uppercase">O Diferencial</h2>
          <h3 className="font-serif text-4xl md:text-5xl text-ivory">Abordagens que <span className="italic text-champagne">transformam</span></h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              ref={el => cardsRef.current[index] = el}
              className={`feature-card rounded-[2rem] p-8 border transition-all duration-500 cursor-pointer ${
                activeCard === index ? 'bg-slate/40 border-champagne/50' : 'bg-slate/20 border-slate/30 hover:border-champagne/30'
              }`}
              onMouseEnter={() => setActiveCard(index)}
            >
              <div className="w-14 h-14 rounded-2xl bg-champagne/10 flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-champagne" />
              </div>
              
              <h4 className="font-display text-xl text-ivory mb-4">{feature.title}</h4>
              <p className="text-ivory/60 text-sm leading-relaxed mb-6">{feature.description}</p>

              {/* Unique interactions per card */}
              {index === 0 && (
                <div className="flex gap-2">
                  {feature.details.map((detail, i) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full bg-champagne/10 text-champagne">
                      {detail}
                    </span>
                  ))}
                </div>
              )}
              
              {index === 1 && (
                <div className="font-mono text-xs text-champagne/80 border-l-2 border-champagne/30 pl-3">
                  {typedText}
                  <span className="animate-pulse">|</span>
                </div>
              )}
              
              {index === 2 && (
                <div className="flex justify-between items-center">
                  {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, i) => (
                    <div key={i} className={getDayClasses(i)}>{day}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ========================
// D. PHILOSOPHY — "The Manifesto"
// ========================
const Philosophy = () => {
  const sectionRef = useRef(null)
  const textRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      textRefs.current.forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
          },
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          delay: i * 0.2
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="section-padding bg-slate/20 relative overflow-hidden">
      {/* Parallax background texture */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=80" 
          alt="Abstract texture" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-sm font-mono text-champagne mb-12 tracking-widest uppercase">Filosofia</h2>
          
          <div ref={el => textRefs.current[0]} className="mb-12">
            <p className="font-serif text-3xl md:text-5xl text-ivory leading-tight">
              "A mente não é um lugar a ser conquistado, mas um <span className="text-champagne italic">território a ser compreendido</span>."
            </p>
          </div>

          <div ref={el => textRefs.current[1]} className="divider w-24 mx-auto mb-12" />

          <div ref={el => textRefs.current[2]}>
            <p className="text-lg text-ivory/70 leading-relaxed max-w-2xl mx-auto">
              Médico psicanalista, psicoterapeuta e psiquiatra especialista em adultos, utilizo os fundamentos da psicologia profunda na resolução definitiva dos transtornos emocionais podendo inicialmente associar ao tratamento medicamentoso no intuito de aliviar sintomas aflitivos.
            </p>
            <p className="text-lg text-ivory/70 leading-relaxed max-w-2xl mx-auto mt-4">
              Sou Médico com título de especialista em <span className="text-champagne">Psiquiatria</span> e título de especialista na área de atuação de <span className="text-champagne">Psicoterapia</span>, ambos conferidos pela Associação Médica Brasileira e Associação Brasileira de Psiquiatria.
            </p>
          </div>

          {/* Credentials */}
          <div className="mt-12 grid md:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
            <div className="rounded-2xl p-5 bg-obsidian/50 border border-slate/30">
              <Award className="w-8 h-8 text-champagne mb-3" />
              <h4 className="font-display font-semibold text-ivory">Formação</h4>
              <p className="text-sm text-ivory/60 mt-2">Medicina - UERJ</p>
              <p className="text-sm text-ivory/60">Psicanálise - SBPP, 1987</p>
            </div>
            <div className="rounded-2xl p-5 bg-obsidian/50 border border-slate/30">
              <Shield className="w-8 h-8 text-champagne mb-3" />
              <h4 className="font-display font-semibold text-ivory">Especialidades</h4>
              <p className="text-sm text-ivory/60 mt-2">Psiquiatria - AMB/ABP, 2008</p>
              <p className="text-sm text-ivory/60">Psicoterapia - AMB/ABP, 2011</p>
            </div>
            <div className="rounded-2xl p-5 bg-obsidian/50 border border-slate/30">
              <Star className="w-8 h-8 text-champagne mb-3" />
              <h4 className="font-display font-semibold text-ivory">Registro</h4>
              <p className="text-sm text-ivory/60 mt-2">CRM RJ: 156481</p>
              <p className="text-sm text-ivory/60">RQE Nº: 28107</p>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {['Psicoterapia', 'Psicanálise', 'Psiquiatria', 'Junguiana', 'Psicoterapia Breve', 'Tratamento Dual', 'Interpretação de Sonhos'].map((spec, i) => (
              <span key={i} className="px-4 py-2 rounded-full bg-slate/40 border border-slate/40 text-ivory/70 text-sm">
                {spec}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ========================
// E. PROTOCOL — "Sticky Stacking Archive"
// ========================
const Protocol = () => {
  const sectionRef = useRef(null)
  const cardsRef = useRef([])

  const protocol = [
    {
      step: '01',
      title: 'Avaliação Inicial',
      description: 'Entendimento profundo do histórico, sintomas e objetivos terapêuticos.',
      icon: ClipboardList
    },
    {
      step: '02',
      title: 'Plano Personalizado',
      description: 'Desenvolvimento de estratégia integrada baseada nas necessidades específicas.',
      icon: FileText
    },
    {
      step: '03',
      title: 'Transformação',
      description: 'Trabalho terapêutico consistente com acompanhamento contínuo e ajustes.',
      icon: TrendingUp
    }
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
          y: 80,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: i * 0.2
        })
      })

      // Sticky stacking effect
      const cards = cardsRef.current
      if (cards.length >= 2) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: true,
          scrub: 1
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="protocolo" className="min-h-screen bg-obsidian">
      <div className="sticky top-0 section-padding pb-32">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-mono text-champagne mb-4 tracking-widest uppercase">O Processo</h2>
            <h3 className="font-serif text-4xl md:text-5xl text-ivory">Uma jornada <span className="italic text-champagne">estruturada</span></h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {protocol.map((item, index) => (
              <div 
                key={index}
                ref={el => cardsRef.current[index] = el}
                className={`rounded-[2rem] p-8 border transition-all duration-500 ${
                  index === 1 ? 'bg-slate/30 border-champagne/30 scale-105' : 'bg-slate/10 border-slate/30'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-champagne/10 flex items-center justify-center mb-6">
                  <span className="font-mono text-2xl text-champagne">{item.step}</span>
                </div>
                <h4 className="font-display text-xl text-ivory mb-4">{item.title}</h4>
                <p className="text-ivory/60 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Helper components for Protocol
const ClipboardList = () => (
  <svg className="w-8 h-8 text-champagne" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
)

const FileText = () => (
  <svg className="w-8 h-8 text-champagne" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const TrendingUp = () => (
  <svg className="w-8 h-8 text-champagne" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

// ========================
// F. CONDITIONS TREATED
// ========================
const Conditions = () => {
  const sectionRef = useRef(null)

  const conditions = [
    'Transtornos De Estresse', 'Transtornos de Ansiedade Generalizados', 'Transtorno Depressivo',
    'Transtornos Fóbicos', 'Transtornos Do Humor', 'Depressão', 'Transtorno Da Personalidade Obsessivo-compulsiva',
    'Transtorno De Pânico', 'Disfunções sexuais psicogênicas', 'Transtorno da Ansiedade',
    'Dificuldades no relacionamento', 'Alterações do humor', 'Insônia'
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current.children, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out'
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="section-padding bg-slate/20">
      <div className="container mx-auto text-center">
        <h2 className="text-sm font-mono text-champagne mb-8 tracking-widest uppercase">Condições Tratadas</h2>
        <div ref={sectionRef} className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {conditions.map((condition, index) => (
            <span 
              key={index}
              className="px-6 py-3 rounded-full bg-obsidian border border-slate/40 text-ivory/80 hover:border-champagne/50 hover:text-ivory transition-all cursor-default"
            >
              {condition}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ========================
// G. TESTIMONIALS
// ========================
const Testimonials = () => {
  const sectionRef = useRef(null)
  const cardsRef = useRef([])

  const testimonials = [
    {
      quote: "Já havia passado por psicólogos e nunca psiquiatras, posso dizer que o Dr. Décio foi um divisor de águas. Já recomendei ele para diversos amigos. Impressionante como ele consegue revelar todo nosso inconsciente através dos sonhos.",
      author: "Paciente",
      role: "Tratamento para ansiedade",
      rating: 5
    },
    {
      quote: "Dr. Décio é um terapeuta completo, maduro, experiente, humano, ético e responsável. Tem sido um cirurgião de alma. Um bisturi que remove as angústias e abre espaço para a expansão da consciência.",
      author: "Araci e Ranonzinho",
      role: "Pacientes",
      rating: 5
    },
    {
      quote: "Há muitos anos não vejo um profissional como Dr Decio. Ele tem um dom fenomenal para a psicanálise e psiquiatria. Nunca vou esquecer das palavras que ouvi na primeira consulta.",
      author: "Paciente",
      role: "Tratamento depressivo",
      rating: 5
    },
    {
      quote: "Excelente profissional, atencioso, com boas explicações. Excelente abordagem e atendimento. Uma consulta completamente diferente de todas que já fui em psiquiatria.",
      author: "Paciente",
      role: "Tratamento de estresse",
      rating: 5
    },
    {
      quote: "Dr Décio, além de transmitir muita segurança, demonstra experiência e conhecimento na área, o que deixa o tratamento mais objetivo e eficaz.",
      author: "Paciente",
      role: "Tratamento combinado",
      rating: 5
    },
    {
      quote: "Muito atencioso e paciente, escuta, conversa e explica de forma clara e gentil. Gostei muito! As explicações fazendo comparativos me deram coragem para olhar pra frente.",
      author: "Paciente",
      role: "Terapia psicanalítica",
      rating: 5
    }
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardsRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="depoimentos" className="section-padding bg-obsidian">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm font-mono text-champagne mb-4 tracking-widest uppercase">Depoimentos</h2>
          <h3 className="font-serif text-4xl md:text-5xl text-ivory">O que dizem <span className="italic text-champagne">pacientes</span></h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              ref={el => cardsRef.current[index] = el}
              className="rounded-[2rem] p-8 bg-slate/20 border border-slate/30 hover:border-champagne/30 transition-all"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-champagne text-champagne" />
                ))}
              </div>
              <Quote className="w-10 h-10 text-champagne/30 mb-4" />
              <p className="text-ivory/80 leading-relaxed mb-6">"{testimonial.quote}"</p>
              <div className="border-t border-slate/30 pt-4">
                <p className="font-display font-semibold text-ivory">{testimonial.author}</p>
                <p className="text-sm text-ivory/50">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ========================
// H. CTA / CONTACT SECTION
// ========================
const CTA = () => {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current.children, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="contato" className="section-padding bg-slate/30">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-sm font-mono text-champagne mb-6 tracking-widest uppercase">Comece Sua Jornada</h2>
          <h3 className="font-serif text-4xl md:text-6xl text-ivory mb-8">
            Pronto para <span className="italic text-champagne">transformação</span>?
          </h3>
          <p className="text-xl text-ivory/70 mb-8 leading-relaxed">
            Agende sua consulta e descubra uma abordagem que vai além do sintoma 
            para tratar a raiz do sofrimento. Atendimento presencial no Rio de Janeiro 
            e teleconsulta para todo o Brasil.
          </p>

          {/* Pricing */}
          <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
            <div className="rounded-2xl p-6 bg-obsidian/50 border border-slate/30">
              <h4 className="font-display font-semibold text-ivory mb-2">Teleconsulta</h4>
              <div className="text-3xl font-display font-bold text-champagne">R$ 350</div>
              <p className="text-sm text-ivory/50 mt-2">por sessão</p>
            </div>
            <div className="rounded-2xl p-6 bg-obsidian/50 border border-slate/30">
              <h4 className="font-display font-semibold text-ivory mb-2">Tratamento da Ansiedade</h4>
              <div className="text-3xl font-display font-bold text-champagne">R$ 350</div>
              <p className="text-sm text-ivory/50 mt-2">por sessão</p>
            </div>
            <div className="rounded-2xl p-6 bg-obsidian/50 border border-slate/30">
              <h4 className="font-display font-semibold text-ivory mb-2">Tratamento da Depressão</h4>
              <div className="text-3xl font-display font-bold text-champagne">R$ 350</div>
              <p className="text-sm text-ivory/50 mt-2">por sessão</p>
            </div>
            <div className="rounded-2xl p-6 bg-obsidian/50 border border-slate/30">
              <h4 className="font-display font-semibold text-ivory mb-2">Tratamento de Fobias</h4>
              <div className="text-3xl font-display font-bold text-champagne">R$ 350</div>
              <p className="text-sm text-ivory/50 mt-2">por sessão</p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button className="btn-primary bg-champagne text-obsidian px-10 py-5 rounded-full font-semibold text-xl shadow-xl shadow-champagne/20">
              Agende sua consulta
            </button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-ivory/60">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-champagne" />
              <span>Rio de Janeiro, RJ</span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-champagne" />
              <span>Teleconsulta disponível</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-champagne" />
              <span>37+ anos de experiência</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ========================
// I. FOOTER
// ========================
const Footer = () => {
  return (
    <footer className="bg-obsidian border-t border-slate/30 py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="text-2xl font-display font-bold text-ivory mb-4">
              Dr. Decio<span className="text-champagne">.</span>
            </div>
            <p className="text-ivory/60 text-sm leading-relaxed">
              Psicanalista e Psiquiatra no Rio de Janeiro. Tratamento resolutivo através de psicanálises breves e interpretação de sonhos.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm text-ivory/60">Online agora</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display font-semibold text-ivory mb-4">Navegação</h4>
            <ul className="space-y-3 text-ivory/60">
              <li><a href="#about" className="hover:text-champagne transition-colors">Sobre</a></li>
              <li><a href="#tratamentos" className="hover:text-champagne transition-colors">Tratamentos</a></li>
              <li><a href="#protocolo" className="hover:text-champagne transition-colors">Protocolo</a></li>
              <li><a href="#depoimentos" className="hover:text-champagne transition-colors">Depoimentos</a></li>
              <li><a href="#contato" className="hover:text-champagne transition-colors">Contato</a></li>
            </ul>
          </div>

          {/* Specializations */}
          <div>
            <h4 className="font-display font-semibold text-ivory mb-4">Especialidades</h4>
            <ul className="space-y-3 text-ivory/60">
              <li>Psicoterapia</li>
              <li>Psicanálise</li>
              <li>Psiquiatria</li>
              <li>Psicoterapia Junguiana</li>
              <li>Psicoterapia Breve</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-ivory mb-4">Contato</h4>
            <ul className="space-y-3 text-ivory/60">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-champagne" />
                (21) 99999-9999
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-champagne" />
                contato@drdecio.com.br
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-champagne" />
                Rio de Janeiro, RJ
              </li>
            </ul>
          </div>
        </div>

        <div className="divider mt-16 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-ivory/40">
          <p>© 2024 Dr. Decio Deforme da Cunha. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-champagne transition-colors">Privacidade</a>
            <a href="#" className="hover:text-champagne transition-colors">Termos</a>
            <a href="#" className="hover:text-champagne transition-colors">CRM-RJ: 156481</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ========================
// MAIN APP
// ========================
function App() {
  return (
    <div className="bg-obsidian min-h-screen">
      <NoiseOverlay />
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <Philosophy />
      <Protocol />
      <Conditions />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  )
}

export default App
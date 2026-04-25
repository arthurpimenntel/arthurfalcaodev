-- ============================================================
--  Arthur Falcão Dev — Supabase Schema + Seed
--  Execute no SQL Editor do Supabase
-- ============================================================

-- 1. Criar tabela
CREATE TABLE IF NOT EXISTS projects (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       timestamptz DEFAULT now(),
  order_index      int         NOT NULL,
  title            text        NOT NULL,
  category         text        NOT NULL,
  category_color   text        NOT NULL DEFAULT 'green',  -- green | gold | purple | blue | red
  description_short text       NOT NULL,
  description_long  text       NOT NULL,
  status           text        NOT NULL DEFAULT 'dev',    -- live | dev
  url              text,
  features         jsonb       NOT NULL DEFAULT '[]',
  stack            jsonb       NOT NULL DEFAULT '[]',
  videos           jsonb       NOT NULL DEFAULT '[]',
  iframe_url       text,
  theme_color      text        NOT NULL DEFAULT '#22c55e',
  launch_date      text,
  published        boolean     NOT NULL DEFAULT true
);

-- 2. RLS: leitura pública, escrita autenticada
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON projects
  FOR SELECT USING (published = true);

CREATE POLICY "admin_all" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

-- 3. Seed — 4 projetos existentes
INSERT INTO projects
  (order_index, title, category, category_color, description_short, description_long,
   status, url, iframe_url, theme_color, launch_date, features, stack, videos, published)
VALUES

-- ── Projeto 01: Eco Tribe Festival ──
(1,
 'Eco Tribe Festival',
 'Site · Evento',
 'green',
 'Site completo para festival de música eletrônica: venda de ingressos, showcase de DJs, galeria de fotos, sistema de excursões e rastreamento de conversões em tempo real com Google Analytics.',
 'Festival de música eletrônica precisava de uma presença digital à altura da experiência que entrega. Construí um site completo com foco em conversão de ingressos e divulgação do evento, integrando ferramentas de rastreamento para mensurar cada clique.',
 'live',
 'https://ecotribe.com.br',
 'https://ecotribe.com.br#top',
 '#22c55e',
 'Projeto no ar',
 '[
   {"icon":"fas fa-ticket-alt","title":"Venda de Ingressos","description":"Integração com plataforma de tickets"},
   {"icon":"fas fa-music","title":"Lineup de DJs","description":"Showcase com perfis dos artistas"},
   {"icon":"fas fa-images","title":"Galeria de Fotos","description":"Edições anteriores em alta qualidade"},
   {"icon":"fas fa-bus","title":"Excursões","description":"Sistema de reserva de transporte"},
   {"icon":"fas fa-chart-bar","title":"Google Analytics","description":"Rastreamento de conversões em tempo real"},
   {"icon":"fas fa-mobile-alt","title":"100% Responsivo","description":"Perfeito em qualquer dispositivo"}
 ]',
 '["HTML5","CSS3","JavaScript","Google Analytics","Responsive Design"]',
 '[]',
 true),

-- ── Projeto 02: Hórus Suites ──
(2,
 'Hórus Suites',
 'Site · Hotelaria',
 'gold',
 'Site institucional premium para pousada em Maracaípe-PE. Galeria imersiva, sistema de reservas integrado, painel administrativo completo e Google Analytics para rastreamento de conversões em tempo real.',
 'Site institucional premium para pousada em Maracaípe-PE. Galeria imersiva, sistema de reservas integrado, painel administrativo completo e Google Analytics para rastreamento de conversões em tempo real.',
 'dev',
 null,
 null,
 '#d4a017',
 'Em breve',
 '[
   {"icon":"fas fa-hotel","title":"Site Institucional","description":"Presença digital premium para a pousada"},
   {"icon":"fas fa-calendar-check","title":"Sistema de Reservas","description":"Disponibilidade e agendamento online"},
   {"icon":"fas fa-images","title":"Galeria Imersiva","description":"Fotos e vídeos em alta qualidade"},
   {"icon":"fas fa-cog","title":"Painel Admin","description":"Gestão de reservas e conteúdo"},
   {"icon":"fas fa-chart-bar","title":"Google Analytics","description":"Rastreamento de conversões em tempo real"},
   {"icon":"fas fa-mobile-alt","title":"100% Responsivo","description":"Perfeito em qualquer dispositivo"}
 ]',
 '["Next.js","TypeScript","Supabase","Tailwind","Framer Motion","Google Analytics"]',
 '[{"src":"videos/horus.mp4","label":"Site","icon":"fas fa-globe"}]',
 true),

-- ── Projeto 03: Bruna Melo Cakes ──
(3,
 'Bruna Melo Cakes',
 'Loja · E-commerce',
 'purple',
 'Plataforma completa para confeitaria artesanal: cardápio digital interativo, sistema de pedidos com cálculo de frete por GPS, painel administrativo, notificações push, programa de fidelidade e controle de estoque.',
 'Plataforma completa para confeitaria artesanal: cardápio digital interativo, sistema de pedidos com cálculo de frete por GPS, programa de fidelidade com geração automática de cupons, notificações push, painel administrativo e integração com Mercado Pago.',
 'dev',
 null,
 null,
 '#a855f7',
 'Em breve',
 '[
   {"icon":"fas fa-store","title":"Loja Online","description":"Cardápio com fotos, preços e categorias"},
   {"icon":"fas fa-credit-card","title":"Pagamento Integrado","description":"Checkout via Mercado Pago"},
   {"icon":"fas fa-map-marker-alt","title":"Frete por GPS","description":"Cálculo automático pela distância real"},
   {"icon":"fas fa-star","title":"Fidelidade","description":"Pontos, resgates e cupons automáticos"},
   {"icon":"fas fa-bell","title":"Notificações Push","description":"Alertas em tempo real via PWA"},
   {"icon":"fas fa-cog","title":"Painel Admin","description":"Dashboard completo com analytics e pedidos"}
 ]',
 '["Next.js 14","TypeScript","Supabase","Mercado Pago","PWA","Tailwind","Framer Motion","Resend","Google Analytics"]',
 '[{"src":"videos/bruna_site.mp4","label":"Loja","icon":"fas fa-store"},{"src":"videos/bruna_admin.mp4","label":"Admin","icon":"fas fa-cog"}]',
 true),

-- ── Projeto 04: Centenários dos Aflitos ──
(4,
 'Centenários dos Aflitos',
 'Loja · Esporte',
 'blue',
 'Plataforma completa para torcida organizada: loja oficial com pagamento integrado, área de associados, galeria, calendário de jogos e painel administrativo para gestão de pedidos e membros.',
 'Plataforma completa para torcida organizada do Náutico: loja oficial com pagamento integrado, área de associados, galeria, calendário de jogos e painel administrativo para gestão de pedidos e membros.',
 'dev',
 null,
 null,
 '#3b82f6',
 'Em breve',
 '[
   {"icon":"fas fa-shopping-bag","title":"Loja Oficial","description":"Camisas, produtos e acessórios"},
   {"icon":"fas fa-credit-card","title":"Pagamento Integrado","description":"Checkout via Mercado Pago"},
   {"icon":"fas fa-users","title":"Área de Sócios","description":"Cadastro e gestão de associados"},
   {"icon":"fas fa-calendar-alt","title":"Calendário de Jogos","description":"Agenda atualizada da temporada"},
   {"icon":"fas fa-images","title":"Galeria","description":"Momentos marcantes em alta resolução"},
   {"icon":"fas fa-cog","title":"Painel Admin","description":"Gestão de pedidos, estoque e membros"}
 ]',
 '["Next.js","TypeScript","Supabase","Mercado Pago","Tailwind","Google Analytics"]',
 '[{"src":"videos/centenarios_loja.mp4","label":"Loja","icon":"fas fa-store"},{"src":"videos/centenarios_admin.mp4","label":"Admin","icon":"fas fa-cog"}]',
 true);

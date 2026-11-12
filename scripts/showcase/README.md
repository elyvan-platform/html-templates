# Miniaturas da montra

Cada template tem uma captura `src/<slug>/screenshot.webp` (720 × 450), obtida a partir da página inicial em viewport desktop. Atualize a captura quando o visual do template mudar; a geração automática não faz parte do build. O manifesto continua a descobrir os templates por diretório e mantém `previewHref` para os recursos de preview já existentes.

A montra reserva espaço para a imagem e apresenta uma mensagem se a captura faltar ou falhar. O carregamento usa o observador e o fallback de scroll existentes da Montra Lazy Load: imagens próximas são ativadas imediatamente, inclusive depois de filtrar. O iframe de demonstração continua limitado ao preview e é descarregado ao fechar.

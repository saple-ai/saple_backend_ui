import { Box, Typography } from '@mui/material';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = 'Nothing here yet',
  description = 'Data will appear here once available.',
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        gap: 2,
      }}
    >
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f0f4ff" />
            <stop offset="100%" stopColor="#e8f0fe" />
          </linearGradient>
          <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f8fafc" />
          </linearGradient>
          <linearGradient id="cardGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>
          <filter id="shadow1" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#94a3b8" floodOpacity="0.12" />
          </filter>
          <filter id="shadow2" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#94a3b8" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* Background circle */}
        <circle cx="100" cy="105" r="72" fill="url(#bgGrad)" />

        {/* Decorative dots */}
        <circle cx="36" cy="52" r="4" fill="#c7d7fe" opacity="0.7" />
        <circle cx="164" cy="60" r="3" fill="#bfdbfe" opacity="0.7" />
        <circle cx="28" cy="148" r="3" fill="#ddd6fe" opacity="0.6" />
        <circle cx="172" cy="152" r="4" fill="#c7d7fe" opacity="0.5" />

        {/* Back card (shadow layer) */}
        <rect x="52" y="60" width="100" height="90" rx="12" fill="url(#cardGrad2)" filter="url(#shadow2)" opacity="0.6" transform="rotate(-5 102 105)" />

        {/* Main card */}
        <rect x="46" y="54" width="108" height="96" rx="12" fill="url(#cardGrad)" filter="url(#shadow1)" />
        <rect x="46" y="54" width="108" height="96" rx="12" stroke="#e2e8f0" strokeWidth="1" />

        {/* Card header bar */}
        <rect x="46" y="54" width="108" height="28" rx="12" fill="#f8fafc" />
        <rect x="46" y="68" width="108" height="14" fill="#f8fafc" />
        <rect x="46" y="55" width="108" height="1" fill="#e2e8f0" opacity="0.5" />

        {/* Header dots */}
        <circle cx="64" cy="68" r="4" fill="#fca5a5" />
        <circle cx="76" cy="68" r="4" fill="#fcd34d" />
        <circle cx="88" cy="68" r="4" fill="#86efac" />

        {/* Empty lines in card */}
        <rect x="62" y="94" width="76" height="6" rx="3" fill="#e2e8f0" />
        <rect x="62" y="108" width="54" height="6" rx="3" fill="#e2e8f0" />
        <rect x="62" y="122" width="64" height="6" rx="3" fill="#e2e8f0" />

        {/* Magnifying glass */}
        <circle cx="138" cy="130" r="18" fill="#ffffff" filter="url(#shadow1)" />
        <circle cx="138" cy="130" r="18" stroke="#e2e8f0" strokeWidth="1" />
        <circle cx="136" cy="128" r="9" stroke="#94a3b8" strokeWidth="2.5" fill="none" />
        <line x1="143" y1="135" x2="149" y2="141" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />

        {/* Small sparkle top-right */}
        <path d="M158 42 L160 36 L162 42 L168 44 L162 46 L160 52 L158 46 L152 44 Z" fill="#c7d7fe" opacity="0.8" />
        <path d="M40 88 L41 84 L42 88 L46 89 L42 90 L41 94 L40 90 L36 89 Z" fill="#ddd6fe" opacity="0.6" />
      </svg>

      <Typography sx={{ color: '#1e293b', fontSize: '1rem', fontWeight: 600, mt: 0.5 }}>
        {title}
      </Typography>
      <Typography sx={{ color: '#94a3b8', fontSize: '0.8125rem', textAlign: 'center', maxWidth: 260, lineHeight: 1.6 }}>
        {description}
      </Typography>
    </Box>
  );
}

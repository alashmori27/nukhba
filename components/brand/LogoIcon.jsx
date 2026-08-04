export default function LogoIcon({
  size = 44,
  className = "",
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>

        <linearGradient
          id="goldGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#7a5e28" />
          <stop offset="30%" stopColor="#c8a04a" />
          <stop offset="50%" stopColor="#f4dd9a" />
          <stop offset="70%" stopColor="#c8a04a" />
          <stop offset="100%" stopColor="#7a5e28" />
        </linearGradient>

      </defs>

      {/* الخلفية */}

      <rect
        x="2"
        y="2"
        width="96"
        height="96"
        rx="22"
        fill="#0B0B14"
      />

      {/* إطار */}

      <rect
        x="2"
        y="2"
        width="96"
        height="96"
        rx="22"
        fill="none"
        stroke="url(#goldGradient)"
        strokeWidth="2"
      />

      {/* العمود الأول */}

      <path
        d="
          M25 22
          L37 22
          L37 78
          L25 78
          Z
        "
        fill="url(#goldGradient)"
      />

      {/* العمود الثاني */}

      <path
        d="
          M63 22
          L75 22
          L75 78
          L63 78
          Z
        "
        fill="url(#goldGradient)"
      />

      {/* الخط القطري */}

      <path
        d="
          M37 22
          L49 22
          L63 48
          L63 78
          L51 78
          L37 52
          Z
        "
        fill="url(#goldGradient)"
      />

    </svg>
  )
}
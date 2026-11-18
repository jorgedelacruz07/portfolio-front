/** Local hero content used when the public portfolio payload is missing. */
export const profileFallback = {
  name: "Jorge de la Cruz Padilla",
  headline: "Senior Software Engineer crafting fast, resilient full-stack web applications.",
  shortBio:
    "Senior Software Engineer focused on building fast, scalable user interfaces and resilient backend systems with React, TypeScript, Node.js, and cloud infrastructure.",
  location: "Lima, Peru",
  availability: "Available for work",
  image: "/images/jorge.jpg",
  resumeUrl: "/documents/jorgedelacruz_cv.pdf",
  contactEmail: "jdelacruzp7@gmail.com",
  socialLinks: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/jorgedelacruz07" },
    { label: "GitHub", url: "https://github.com/jorgedelacruz07" },
    { label: "X", url: "https://x.com/jorgedlcpdev" },
  ],
} as const;

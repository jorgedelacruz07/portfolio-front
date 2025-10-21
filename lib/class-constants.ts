// Tailwind CSS class constants for better maintainability and consistency
export const classConstants = {
  // Layout and spacing
  container: "container mx-auto px-4 sm:px-6 lg:px-8",
  sectionSpacing: "space-y-12 py-8",
  cardSpacing: "space-y-6",

  // Typography
  heading1: "text-4xl md:text-5xl font-bold text-foreground tracking-tight",
  heading2: "text-2xl md:text-3xl font-bold text-foreground",
  heading3: "text-xl md:text-2xl font-semibold text-foreground",
  bodyText: "text-muted-foreground leading-relaxed",
  bodyTextLarge: "text-lg text-muted-foreground leading-relaxed",

  // Cards
  cardBase:
    "group transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-border/50 hover:border-primary/20",
  cardHeader: "pb-4",
  cardContent: "pb-4",
  cardFooter: "flex flex-col gap-4 pt-0",

  // Buttons
  buttonPrimary:
    "px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300",
  buttonSecondary:
    "w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300",
  buttonGhost: "text-primary hover:text-primary/80 font-semibold",

  // Images and avatars
  avatarBase:
    "ring-4 ring-primary/20 dark:ring-primary/30 shadow-lg transition-transform duration-500 hover:scale-105",
  imageBase: "object-cover",
  imageRing: "ring-2 ring-border/50",

  // Badges and tags
  badgeBase: "text-xs font-medium",
  badgeSecondary: "text-sm font-medium",

  // Navigation
  navLink:
    "text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium",
  navLinkActive: "text-foreground font-semibold",

  // Forms and inputs
  inputBase:
    "w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring",

  // Animations
  fadeIn: "animate-fade-in",
  slideInLeft: "animate-slide-in-left",
  slideInRight: "animate-slide-in-right",
  scaleIn: "animate-scale-in",

  // Responsive utilities
  responsiveGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  responsiveFlex: "flex flex-col md:flex-row items-center gap-4",

  // Focus and accessibility
  focusRing:
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",

  // Dark mode utilities
  darkModeTransition: "transition-colors duration-200",

  // Loading states
  loadingContainer:
    "container mx-auto flex justify-center items-center min-h-screen",
  loadingText: "text-center space-y-4",

  // Error states
  errorContainer: "text-center space-y-4",
  errorHeading: "text-3xl font-bold text-foreground",
  errorText: "text-muted-foreground text-lg",

  // Empty states
  emptyContainer: "text-center py-16",
  emptyText: "text-muted-foreground text-lg",
} as const;

// Common component class combinations
export const componentClasses = {
  // Profile section
  profileContainer: "flex flex-col items-center space-y-8 md:space-y-10",
  profileAvatar: `h-32 w-32 md:h-40 md:w-40 ${classConstants.avatarBase}`,
  profileTitle: "text-center space-y-6 max-w-3xl",
  profileName: classConstants.heading1,
  profileDescription:
    "text-center text-muted-foreground text-lg md:text-xl leading-relaxed space-y-4",
  profileActions: "flex flex-col items-center space-y-8",

  // Project/Experience cards
  projectCard: classConstants.cardBase,
  projectHeader: "flex items-center gap-4",
  projectImage: `relative w-12 h-12 rounded-lg overflow-hidden ${classConstants.imageRing}`,
  projectImageLarge: `relative w-16 h-16 rounded-lg overflow-hidden ${classConstants.imageRing}`,
  projectTitle:
    "text-lg group-hover:text-primary transition-colors duration-300",
  projectTitleLarge:
    "text-xl md:text-2xl group-hover:text-primary transition-colors duration-300",
  projectDescription: "text-sm font-medium text-muted-foreground",
  projectDescriptionLarge: "text-base font-medium text-muted-foreground",
  projectContent: "text-muted-foreground line-clamp-2 leading-relaxed",
  projectContentLarge: "text-muted-foreground leading-relaxed",
  projectTechnologies: "flex flex-wrap gap-2",
  projectActions: "mt-4",

  // Navigation
  navbar:
    "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 sticky top-0 z-50",
  navbarContainer: "container mx-auto px-4 sm:px-6 lg:px-8",
  navbarContent: "flex items-center justify-between h-16",
  navbarBrand:
    "text-foreground hover:text-primary transition-colors duration-200 flex items-center",
  navbarMenu: "hidden md:block",
  navbarLinks: "ml-10 flex items-baseline space-x-8",
  navbarMobile:
    "md:hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border/40 transition-all duration-200 ease-in-out",

  // Footer
  footer: "bg-muted/30 border-t border-border/40",
  footerContainer: "container mx-auto p-6",
  footerContent: "py-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8",
  footerSection: "space-y-3 text-muted-foreground",
  footerTitle: "text-foreground text-lg font-bold mb-4 flex items-center",
  footerSeparator: "my-6",
  footerCopyright: "py-4 text-center text-muted-foreground",

  // Page layouts
  pageContainer: "container mx-auto py-8",
  pageHeader: "text-center space-y-4",
  pageTitle: classConstants.heading1,
  pageSubtitle: "text-muted-foreground text-lg max-w-2xl mx-auto",
  pageContent: classConstants.cardSpacing,

  // Separators
  sectionSeparator: "my-8",
} as const;

// Utility functions for dynamic class generation
export const getResponsiveClasses = (
  base: string,
  md?: string,
  lg?: string,
) => {
  return `${base} ${md ? `md:${md}` : ""} ${lg ? `lg:${lg}` : ""}`.trim();
};

export const getVariantClasses = (
  base: string,
  variant: "primary" | "secondary" | "outline" | "ghost",
) => {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };
  return `${base} ${variants[variant]}`;
};

export const getSizeClasses = (base: string, size: "sm" | "md" | "lg") => {
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8 text-lg",
  };
  return `${base} ${sizes[size]}`;
};

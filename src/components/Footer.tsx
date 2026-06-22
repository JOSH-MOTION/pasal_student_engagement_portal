import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full mt-section-gap bg-surface-container-highest dark:bg-tertiary-container border-t border-outline-variant transition-colors duration-200">
      <div className="max-w-[1200px] mx-auto py-8 px-container-padding-mobile md:px-container-padding-desktop flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9">
              <Image
                src="/pasal_logo.png"
                alt="PASAL Logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="h-6 w-px bg-primary/20" />
            <div className="relative w-7 h-7 sm:w-8 sm:h-8">
              <Image
                src="/UG_logo.png"
                alt="UG Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-display text-headline-sm font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent ml-1">
              PASAL
            </span>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant max-w-xs text-center md:text-left">
            Empowering public administration students through digital innovation and seamless engagement.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 font-label-sm text-label-sm">
          <Link href="/privacy" className="text-on-surface-variant hover:text-primary underline transition-all">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-on-surface-variant hover:text-primary underline transition-all">
            Terms of Service
          </Link>
          <a href="https://ug.edu.gh" target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-primary underline transition-all">
            University Site
          </a>
          <Link href="/support" className="text-on-surface-variant hover:text-primary underline transition-all">
            Contact Support
          </Link>
        </div>

        <div className="text-center md:text-right">
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            © {new Date().getFullYear()} University of Ghana - PASAL Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

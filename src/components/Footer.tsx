import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full mt-section-gap bg-[#001057] text-white py-12 border-t-4 border-[#FDCC14]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-white rounded-full p-1 shadow-lg">
              <Image
                src="/pasal_logo.png"
                alt="PASAL Logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="h-8 w-px bg-white/30" />
            <div className="relative w-10 h-10 bg-white rounded-full p-1 shadow-lg">
              <Image
                src="/UG_logo.png"
                alt="UG Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-display text-2xl font-extrabold tracking-tight text-[#FDCC14] ml-2">
              PASAL
            </span>
          </div>
          <p className="text-white/80 max-w-sm text-sm leading-relaxed">
            The official digital platform for the Public Administration Students Association (PASAL), University of Ghana. Empowering students through digital innovation.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-[#FDCC14] uppercase tracking-wider text-xs">Resources</h4>
            <Link href="/concerns" className="text-white/80 hover:text-white transition-colors text-sm">Submit Concern</Link>
            <Link href="/suggestions" className="text-white/80 hover:text-white transition-colors text-sm">Make Suggestion</Link>
            <Link href="/opportunities" className="text-white/80 hover:text-white transition-colors text-sm">Opportunities</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-[#FDCC14] uppercase tracking-wider text-xs">Links</h4>
            <a href="https://ug.edu.gh" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors text-sm">University of Ghana</a>
            <Link href="/privacy" className="text-white/80 hover:text-white transition-colors text-sm">Privacy Policy</Link>
            <Link href="/admin/login" className="text-white/80 hover:text-white transition-colors text-sm">Admin Login</Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-white/60 text-xs">
          © {new Date().getFullYear()} PASAL - University of Ghana. All rights reserved.
        </p>
        <p className="text-white/60 text-xs flex items-center gap-1">
          A Vision by Reginald Ankrah <span className="text-[#FDCC14]">♥</span> for PASAL Students
        </p>
      </div>
    </footer>
  );
}

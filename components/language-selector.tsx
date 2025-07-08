"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  {
    name: "English",
    flag: "/flags/us.svg",
    code: "en"
  },
  {
    name: "Spanish",
    flag: "/flags/es.svg",
    code: "es"
  },
  {
    name: "French",
    flag: "/flags/fr.svg",
    code: "fr"
  },
  {
    name: "German",
    flag: "/flags/de.svg",
    code: "de"
  },
  {
    name: "Japanese",
    flag: "/flags/jp.svg",
    code: "jp"
  }
];

export const LanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-x-2 rounded-md border px-3 py-2 text-sm">
        <Globe className="h-4 w-4" />
        <span>{selectedLanguage.name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem 
            key={language.code}
            className="cursor-pointer flex items-center gap-x-2"
            onClick={() => setSelectedLanguage(language)}
          >
            <div className="relative h-4 w-6">
              <Image
                src={language.flag}
                alt={language.name}
                fill
                className="object-cover"
              />
            </div>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 
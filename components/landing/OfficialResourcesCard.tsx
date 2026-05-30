import { ExternalLink, Phone } from "lucide-react";
import type { OfficialResourceLink } from "@/lib/official-resources";

type OfficialResourcesCardProps = {
  title?: string;
  links: OfficialResourceLink[];
  phone?: string;
  email?: string;
  note?: string;
  className?: string;
};

export default function OfficialResourcesCard({
  title = "Official links & contacts",
  links,
  phone,
  email,
  note,
  className = "",
}: OfficialResourcesCardProps) {
  return (
    <div
      className={`rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      <h2 className="text-lg font-semibold text-md-black">{title}</h2>
      {note && (
        <p className="mt-2 text-sm leading-relaxed text-stone-600">{note}</p>
      )}
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-start gap-2 text-sm font-semibold text-md-red hover:underline"
            >
              {link.label}
              <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-70" />
            </a>
            {link.description && (
              <p className="mt-0.5 text-sm text-stone-600">{link.description}</p>
            )}
          </li>
        ))}
      </ul>
      {(phone || email) && (
        <div className="mt-4 space-y-1 border-t border-stone-100 pt-4 text-sm text-stone-700">
          {phone && (
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-stone-400" />
              <a href={`tel:${phone.replace(/\D/g, "")}`} className="hover:text-md-red">
                {phone}
              </a>
            </p>
          )}
          {email && (
            <p>
              Email:{" "}
              <a
                href={`mailto:${email}`}
                className="font-medium text-md-red hover:underline"
              >
                {email}
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

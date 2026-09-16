import { InfoPage } from "@/components/layout/info-page";

// Simple static support page keeps the footer contact destination useful in the first increment.
export default function ContactPage() {
  return <InfoPage title="Hablemos."><p>Escríbenos a <a className="font-medium text-accent-deep underline underline-offset-4" href="mailto:hola@jhorce.co">hola@jhorce.co</a> y te responderemos en horario hábil. También puedes encontrarnos en <a className="font-medium text-accent-deep underline underline-offset-4" href="https://www.instagram.com/jhorce.co/" target="_blank" rel="noreferrer">Instagram @jhorce.co</a>.</p></InfoPage>;
}

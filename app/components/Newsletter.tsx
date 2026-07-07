"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./Button";
import { MailOpen, Check, User, Phone, Loader2 } from "lucide-react";
import { useTranslation } from "../i18n/LanguageContext";
import { captureAttribution, type Attribution } from "../lib/utm";

type Status = "idle" | "sending" | "success" | "error";

const inputCls =
  "w-full bg-[#0D1C24] border border-[#3A4248] rounded-[8px] h-[54px] pl-12 pr-4 font-['Inter'] text-[#E8E8EA] placeholder:text-[#636A6F] focus:border-[#20CAD8] focus:shadow-[0_0_0_3px_rgba(32,202,216,0.15)] focus:outline-none transition-all";

export function Newsletter() {
  const { t } = useTranslation();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  // Captura a atribuição (UTM / origem orgânica) uma vez, no cliente.
  const attribution = useRef<Attribution | null>(null);
  useEffect(() => {
    attribution.current = captureAttribution();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim(),
          telefone: telefone.trim(),
          ...(attribution.current ?? captureAttribution()),
        }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      setStatus(res.ok && data.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="newsletter"
      className="py-24 bg-[#0A0E14] relative border-y border-[#20CAD820] overflow-hidden isolate"
    >
      {/* Imagem de fundo — banner */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1920&auto=format&fit=crop"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-[0.55] pointer-events-none"
      />
      {/* Scrim: esquerda escura (leitura) → direita revela a imagem */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E14] via-[#0A0E14]/80 to-[#0A0E14]/25 pointer-events-none" />
      {/* Fade topo/base pra emendar nas seções vizinhas */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E14] via-transparent to-[#0A0E14] pointer-events-none" />
      {/* Glow teal da marca */}
      <div className="absolute top-1/2 -left-[10%] -translate-y-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse,rgba(32,202,216,0.16)_0%,rgba(32,202,216,0.04)_45%,transparent_72%)] rounded-full blur-[70px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          {/* Coluna esquerda — frase + itens */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full"
          >
            <div className="flex items-center gap-4 mb-5">
              <MailOpen
                size={32}
                className="text-[#20CAD8] drop-shadow-[0_0_8px_#20CAD8]"
                strokeWidth={1.5}
              />
              <span className="font-['Orbitron'] text-[#20CAD8] text-[12px] uppercase tracking-[0.15em] drop-shadow-[0_0_5px_#20CAD8]">
                {t.newsletter.badge}
              </span>
            </div>
            <h2 className="font-['Orbitron'] font-bold text-[30px] md:text-[42px] text-white text-shadow-neon mb-5 leading-tight">
              {t.newsletter.title}
            </h2>
            <p className="font-['Inter'] text-[16px] text-[#B9B7BA] leading-relaxed mb-6 max-w-[520px]">
              {t.newsletter.subtitle}
            </p>
            <ul className="space-y-2.5">
              {t.newsletter.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-[#20CAD8] mt-0.5 drop-shadow-[0_0_4px_#20CAD8]">
                    <Check size={15} strokeWidth={2.5} />
                  </span>
                  <span className="font-['Inter'] text-[14px] text-[#868E92]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Coluna direita — formulário */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full bg-[#0D141B]/95 backdrop-blur-xl p-8 rounded-[16px] border border-[#20CAD833] shadow-[0_20px_60px_rgba(0,0,0,0.55),0_0_40px_rgba(32,202,216,0.08)]"
          >
            {status !== "success" ? (
              <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#636A6F] pointer-events-none"
                  />
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder={t.newsletter.namePlaceholder}
                    className={inputCls}
                    required
                  />
                </div>

                <div className="relative">
                  <MailOpen
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#636A6F] pointer-events-none"
                  />
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.newsletter.placeholder}
                    className={inputCls}
                    required
                  />
                </div>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#636A6F] pointer-events-none"
                  />
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder={t.newsletter.phonePlaceholder}
                    className={inputCls}
                    required
                  />
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full h-[56px] mt-1 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === "sending" ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      {t.newsletter.sending}
                    </span>
                  ) : (
                    t.newsletter.cta
                  )}
                </Button>

                {status === "error" && (
                  <span className="font-['Inter'] text-[13px] text-[#FF6B81] text-center">
                    {t.newsletter.errorText}
                  </span>
                )}

                <span className="font-['Inter'] text-[13px] text-[#868E92] text-center mt-1">
                  {t.newsletter.social}
                </span>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-8"
              >
                <div className="w-16 h-16 rounded-full bg-[#20CAD815] border border-[#20CAD840] flex items-center justify-center mb-4">
                  <Check
                    size={28}
                    className="text-[#20CAD8] drop-shadow-[0_0_8px_#20CAD8]"
                    strokeWidth={2.5}
                  />
                </div>
                <h3 className="font-['Orbitron'] font-bold text-[20px] text-white text-shadow-neon mb-2">
                  {t.newsletter.successTitle}
                </h3>
                <p className="font-['Inter'] text-[14px] text-[#B9B7BA]">
                  {t.newsletter.successText}
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

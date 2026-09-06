"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/reduced-motion";
import { useId, useMemo, useRef, useState, type FormEvent } from "react";
import { Section } from "@/components/ui/Section";
import { Diamond, Flourish } from "@/components/ui/Ornaments";
import { Blossom } from "@/components/ui/Decor";
import { MaskedLine, Reveal } from "@/components/ui/Reveal";
import wedding from "@/data/wedding";
import { useI18n } from "@/lib/i18n";
import { EASE_EDITORIAL } from "@/lib/motion";

type Attendance = "yes" | "no";

type FormValues = {
  name: string;
  phone: string;
  attendance: Attendance | null;
  guests: number;
  message: string;
};

type FieldErrors = Partial<Record<"name" | "phone" | "attendance" | "form", string>>;

const EMPTY: FormValues = {
  name: "",
  phone: "",
  attendance: null,
  guests: 1,
  message: "",
};

/** Loose international check: 7–15 digits, optional +, spaces/dashes allowed. */
function isPhoneLike(value: string) {
  const digits = value.replace(/\D/g, "");
  return /^\+?[\d\s()-]{7,24}$/.test(value.trim()) && digits.length >= 7 && digits.length <= 15;
}

export function RSVP() {
  const { t, formatDate } = useI18n();
  const reduced = useReducedMotionSafe();
  const uid = useId();

  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [sentAs, setSentAs] = useState<Attendance>("yes");
  /* Errors are only shown after the first submit attempt, so the form never
     scolds a guest who is still typing. */
  const submitted = useRef(false);

  const deadline = formatDate(
    wedding.rsvp.deadline.day,
    wedding.rsvp.deadline.month,
    wedding.rsvp.deadline.year,
  );

  const isConnected = Boolean(wedding.rsvp.endpoint);

  const validate = useMemo(
    () => (v: FormValues): FieldErrors => {
      const next: FieldErrors = {};
      const name = v.name.trim();
      if (!name) next.name = t.rsvp.errors.name;
      else if (name.length < 3) next.name = t.rsvp.errors.nameShort;

      const phone = v.phone.trim();
      if (!phone) next.phone = t.rsvp.errors.phone;
      else if (!isPhoneLike(phone)) next.phone = t.rsvp.errors.phoneInvalid;

      if (!v.attendance) next.attendance = t.rsvp.errors.attendance;
      return next;
    },
    [t],
  );

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      if (submitted.current) setErrors(validate(next));
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitted.current = true;

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const firstKey = Object.keys(found)[0];
      document.getElementById(`${uid}-${firstKey}`)?.focus();
      return;
    }

    setStatus("sending");

    const payload = {
      name: values.name.trim(),
      phone: values.phone.trim(),
      attendance: values.attendance,
      guests: values.attendance === "yes" ? values.guests : 0,
      message: values.message.trim(),
      submittedAt: new Date().toISOString(),
    };

    try {
      if (wedding.rsvp.endpoint) {
        const res = await fetch(wedding.rsvp.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`RSVP endpoint responded ${res.status}`);
      } else {
        /* No endpoint configured yet. The reply is not stored anywhere and the
           confirmation panel says so plainly rather than pretending. */
        await new Promise((resolve) => setTimeout(resolve, 700));
      }

      setSentAs(values.attendance ?? "yes");
      setStatus("sent");
    } catch {
      setStatus("idle");
      setErrors({ form: t.rsvp.errors.failed });
    }
  }

  function reset() {
    submitted.current = false;
    setValues(EMPTY);
    setErrors({});
    setStatus("idle");
  }

  const attending = values.attendance === "yes";

  return (
    <Section id="rsvp" labelledBy="rsvp-title" light="right">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
        {/* ── Heading column ───────────────────────────────────────────── */}
        <div className="lg:col-span-5 lg:pt-4">
          <Reveal duration={1.1} className="mb-6">
            <Blossom className="h-4 w-4 text-gold/70" />
          </Reveal>

          <Reveal duration={1.1} delay={0.06}>
            <p className="eyebrow">{t.rsvp.eyebrow}</p>
          </Reveal>

          <MaskedLine className="mt-6" delay={0.1}>
            <h2
              id="rsvp-title"
              className="display gold-leaf inline-block pb-[0.12em] text-[clamp(2rem,6vw,3.4rem)] leading-[1.08]"
            >
              {t.rsvp.title}
            </h2>
          </MaskedLine>

          <Reveal delay={0.24} className="mt-8">
            <Flourish className="h-3 w-36 text-gold/80" />
          </Reveal>

          <Reveal delay={0.32} className="mt-8">
            <p className="measure text-[0.95rem] font-light leading-[1.9] text-ink-soft">
              {t.rsvp.subtitle.replace("{date}", deadline)}
            </p>
          </Reveal>

          {!isConnected ? (
            <Reveal delay={0.4} className="mt-8">
              <p className="measure border-l border-gold/38 pl-4 text-[0.72rem] font-light leading-relaxed text-mute">
                {t.rsvp.demoNotice}
              </p>
            </Reveal>
          ) : null}
        </div>

        {/* ── Form column ──────────────────────────────────────────────── */}
        <div className="lg:col-span-7">
          <Reveal delay={0.18}>
            <div className="plate relative px-5 py-9 sm:px-10 sm:py-12">
              <AnimatePresence mode="wait" initial={false}>
                {status === "sent" ? (
                  <motion.div
                    key="sent"
                    className="flex flex-col items-center py-8 text-center"
                    initial={{ opacity: 0, y: reduced ? 0 : 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: EASE_EDITORIAL }}
                  >
                    <Diamond className="h-4 w-4 text-gold" />
                    <p
                      role="status"
                      className="display mt-8 text-[clamp(1.3rem,4vw,1.8rem)] font-light leading-snug text-ink"
                    >
                      {sentAs === "yes" ? t.rsvp.successYes : t.rsvp.successNo}
                    </p>
                    <Flourish className="mt-8 h-3 w-40 text-gold/80" />

                    {!isConnected ? (
                      <p className="mt-8 max-w-sm text-[0.7rem] font-light leading-relaxed text-mute">
                        {t.rsvp.demoNotice}
                      </p>
                    ) : null}

                    <button
                      type="button"
                      onClick={reset}
                      className="mt-9 text-[0.65rem] uppercase tracking-[0.28em] text-ink-soft/85 underline decoration-gold/50 underline-offset-8 transition-colors duration-500 hover:text-gold-deep"
                    >
                      {t.rsvp.successAgain}
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    noValidate
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col gap-7"
                  >
                    {/* Name */}
                    <Field
                      id={`${uid}-name`}
                      label={t.rsvp.name}
                      error={errors.name}
                    >
                      <input
                        id={`${uid}-name`}
                        name="name"
                        type="text"
                        autoComplete="name"
                        className="field"
                        placeholder={t.rsvp.namePlaceholder}
                        value={values.name}
                        onChange={(e) => update("name", e.target.value)}
                        aria-invalid={errors.name ? "true" : undefined}
                        aria-describedby={errors.name ? `${uid}-name-error` : undefined}
                      />
                    </Field>

                    {/* Phone */}
                    <Field
                      id={`${uid}-phone`}
                      label={t.rsvp.phone}
                      error={errors.phone}
                    >
                      <input
                        id={`${uid}-phone`}
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        className="field"
                        placeholder={t.rsvp.phonePlaceholder}
                        value={values.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        aria-invalid={errors.phone ? "true" : undefined}
                        aria-describedby={errors.phone ? `${uid}-phone-error` : undefined}
                      />
                    </Field>

                    {/* Attendance */}
                    <fieldset
                      aria-describedby={
                        errors.attendance ? `${uid}-attendance-error` : undefined
                      }
                    >
                      <legend className="eyebrow mb-4">{t.rsvp.attendance}</legend>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {(
                          [
                            { value: "yes", label: t.rsvp.attendanceYes },
                            { value: "no", label: t.rsvp.attendanceNo },
                          ] as const
                        ).map((option, i) => {
                          const active = values.attendance === option.value;
                          return (
                            <label
                              key={option.value}
                              className={`group relative flex min-h-[3.5rem] cursor-pointer items-center gap-3 border px-4 py-3 text-[0.85rem] font-light transition-colors duration-500 ${
                                active
                                  ? "border-gold/65 text-ink"
                                  : "border-gold/28 text-ink-soft/90 hover:border-gold/45"
                              }`}
                              style={
                                active
                                  ? {
                                      backgroundImage:
                                        "linear-gradient(180deg, rgba(194,160,92,0.14), rgba(138,106,50,0.05))",
                                    }
                                  : undefined
                              }
                            >
                              <input
                                id={i === 0 ? `${uid}-attendance` : undefined}
                                type="radio"
                                name="attendance"
                                value={option.value}
                                checked={active}
                                onChange={() => update("attendance", option.value)}
                                className="sr-only"
                              />
                              <span
                                aria-hidden="true"
                                className={`flex h-4 w-4 shrink-0 items-center justify-center transition-opacity duration-500 ${
                                  active ? "text-gold opacity-100" : "text-gold/80 opacity-70"
                                }`}
                              >
                                <Diamond className="h-3.5 w-3.5" />
                              </span>
                              <span>{option.label}</span>
                            </label>
                          );
                        })}
                      </div>

                      {errors.attendance ? (
                        <ErrorText id={`${uid}-attendance-error`}>
                          {errors.attendance}
                        </ErrorText>
                      ) : null}
                    </fieldset>

                    {/* Guests — only relevant when attending */}
                    <AnimatePresence initial={false}>
                      {attending ? (
                        <motion.div
                          key="guests"
                          initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                          animate={
                            reduced ? { opacity: 1 } : { opacity: 1, height: "auto" }
                          }
                          exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                          transition={{ duration: 0.7, ease: EASE_EDITORIAL }}
                          className="overflow-hidden"
                        >
                          <label
                            htmlFor={`${uid}-guests`}
                            className="eyebrow mb-4 block"
                          >
                            {t.rsvp.guests}
                          </label>

                          <div className="flex items-center gap-4">
                            <Stepper
                              direction="down"
                              onClick={() =>
                                update("guests", Math.max(1, values.guests - 1))
                              }
                              disabled={values.guests <= 1}
                              label="−"
                            />
                            <input
                              id={`${uid}-guests`}
                              name="guests"
                              type="number"
                              inputMode="numeric"
                              min={1}
                              max={wedding.rsvp.maxGuests}
                              value={values.guests}
                              onChange={(e) => {
                                const n = Number.parseInt(e.target.value, 10);
                                update(
                                  "guests",
                                  Number.isNaN(n)
                                    ? 1
                                    : Math.min(wedding.rsvp.maxGuests, Math.max(1, n)),
                                );
                              }}
                              className="field display gold-leaf-fine w-20 [appearance:textfield] text-center text-2xl lining-nums [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            />
                            <Stepper
                              direction="up"
                              onClick={() =>
                                update(
                                  "guests",
                                  Math.min(wedding.rsvp.maxGuests, values.guests + 1),
                                )
                              }
                              disabled={values.guests >= wedding.rsvp.maxGuests}
                              label="+"
                            />
                            <p className="text-[0.7rem] font-light leading-snug text-mute">
                              {t.rsvp.guestsHint}
                            </p>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>

                    {/* Message */}
                    <Field
                      id={`${uid}-message`}
                      label={t.rsvp.message}
                      hint={t.rsvp.optional}
                    >
                      <textarea
                        id={`${uid}-message`}
                        name="message"
                        rows={4}
                        className="field resize-none leading-relaxed"
                        placeholder={t.rsvp.messagePlaceholder}
                        value={values.message}
                        onChange={(e) => update("message", e.target.value)}
                      />
                    </Field>

                    {errors.form ? (
                      <ErrorText id={`${uid}-form-error`}>{errors.form}</ErrorText>
                    ) : null}

                    <button
                      type="submit"
                      className="btn-gold mt-2 w-full"
                      disabled={status === "sending"}
                      aria-busy={status === "sending"}
                    >
                      <span>
                        {status === "sending" ? t.rsvp.submitting : t.rsvp.submit}
                      </span>
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow mb-4 flex items-baseline gap-2">
        <span>{label}</span>
        {hint ? (
          <span className="tracking-[0.14em] text-mute/70 lowercase">({hint})</span>
        ) : null}
      </label>
      {children}
      {error ? <ErrorText id={`${id}-error`}>{error}</ErrorText> : null}
    </div>
  );
}

function ErrorText({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p
      id={id}
      role="alert"
      className="mt-3 flex items-center gap-2 text-[0.72rem] font-light tracking-wide text-[#d08a6f]"
    >
      <span aria-hidden="true" className="inline-block h-px w-4 bg-[#d08a6f]/60" />
      {children}
    </p>
  );
}

function Stepper({
  onClick,
  disabled,
  label,
  direction,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  direction: "up" | "down";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "up" ? "+1" : "-1"}
      className="flex h-11 w-11 shrink-0 items-center justify-center border border-gold/32 text-lg text-ink-soft transition-colors duration-500 hover:border-gold/60 hover:text-gold-deep disabled:cursor-not-allowed disabled:opacity-30"
    >
      <span aria-hidden="true">{label}</span>
    </button>
  );
}

export default RSVP;

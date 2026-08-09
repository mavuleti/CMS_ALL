'use client';

import { Volume2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type GuideSection = { range: string; title: string; learn: string; fact: string };
type ColorMapping = { range: string; part: string; color: string; hex?: string; why: string };
type ColorScheme = { name: string; note: string; mapping: ColorMapping[] };
type Props = {
  heading: string;
  introHtml: string;
  outroHtml: string;
  sections: GuideSection[];
  language: string;
  funFactLabel: string;
  colorHeading?: string;
  colorSchemes?: ColorScheme[];
};
type SpeechItem = { element: HTMLElement; text: string };

function selectBestVoice(language: string) {
  const languageBase = language.toLowerCase().split('-')[0];
  const allVoices = window.speechSynthesis.getVoices();
  const localeVoices = allVoices.filter((voice) => {
    const name = voice.name.toLowerCase();
    return voice.lang.toLowerCase().startsWith(languageBase)
      || (languageBase === 'ar' && /multilingual|multi-lingual/.test(name));
  });
  const englishPreferredNames = [
    'ava multilingual', 'jenny online', 'aria online', 'emma multilingual',
    'sonia online', 'libby online', 'natasha online', 'google uk english female',
    'google us english', 'samantha', 'serena', 'ava', 'jenny', 'aria', 'sonia',
    'libby', 'zira'
  ];
  const arabicPreferredNames = [
    'ava multilingual', 'emma multilingual', 'salma', 'zariyah', 'fatima',
    'laila', 'mariam', 'zeina', 'amira', 'hoda'
  ];
  const preferredNames = languageBase === 'ar' ? arabicPreferredNames : englishPreferredNames;

  return localeVoices
    .map((voice) => {
      const name = voice.name.toLowerCase();
      const preferredIndex = preferredNames.findIndex((preferred) => name.includes(preferred));
      const naturalBonus = /natural|neural|premium|enhanced|online/.test(name) ? 80 : 0;
      const preferredBonus = preferredIndex >= 0 ? 100 - preferredIndex * 5 : 0;
      const onlineBonus = voice.localService ? 0 : 25;
      return { voice, score: naturalBonus + preferredBonus + onlineBonus };
    })
    .sort((a, b) => b.score - a.score)[0]?.voice ?? null;
}

function SentenceText({ text }: { text: string }) {
  const parts = text.match(/[^.!?؟۔]+[.!?؟۔]+(?:\s|$)|[^.!?؟۔]+$/g)?.map((part) => part.trim()).filter(Boolean) ?? [text];
  return <>{parts.map((part, index) => (
    <span data-guide-listen-text data-guide-listen-sentence key={`${part}-${index}`}>
      <WordText text={part} />{index < parts.length - 1 ? ' ' : ''}
    </span>
  ))}</>;
}

function WordText({ text }: { text: string }) {
  return <>{text.split(/(\s+)/).map((part, index) => (
    /^\s+$/.test(part)
      ? part
      : <span data-guide-listen-word key={`${part}-${index}`}>{part}</span>
  ))}</>;
}

function wordHighlightHtml(html: string) {
  // Split into sentence chunks first (tag-aware) so each sentence gets its own
  // data-guide-listen-text container, matching the SentenceText/WordText convention
  // used for the section paragraphs below.
  const tokens = html.split(/(<[^>]+>)/g);
  const sentences: string[] = [];
  let current = '';
  tokens.forEach((token) => {
    if (token.startsWith('<')) {
      current += token;
      return;
    }
    token.split(/([.!?؟۔]+\s*)/).forEach((part) => {
      current += part;
      if (part.trim() && /[.!?؟۔]+\s*$/.test(part)) {
        sentences.push(current);
        current = '';
      }
    });
  });
  if (current.trim()) sentences.push(current);

  return sentences
    .map((sentence) => {
      const withWords = sentence
        .split(/(<[^>]+>)/g)
        .map((part) => part.startsWith('<') ? part : part.replace(/(\S+)/g, '<span data-guide-listen-word>$1</span>'))
        .join('');
      return `<span data-guide-listen-text data-guide-listen-sentence>${withWords}</span>`;
    })
    .join('');
}

/** Reusable native Web Speech reader for structured puzzle guide content. */
export default function GuideListen({ heading, introHtml, outroHtml, sections, language, funFactLabel, colorHeading, colorSchemes }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<SpeechItem[]>([]);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const wordTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Render the control in the initial HTML so it is visible during hydration.
  // The effect hides it only when the browser truly lacks Web Speech support.
  const [supported, setSupported] = useState(true);
  const [status, setStatus] = useState<'idle' | 'playing'>('idle');
  const isArabic = language.toLowerCase().startsWith('ar');
  const listenLabel = isArabic ? 'استمع إلى الدليل' : 'Listen to this guide';
  const stopLabel = isArabic ? 'إيقاف القراءة' : 'Stop guide reading';

  useEffect(() => {
    const canSpeak = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    setSupported(canSpeak);
    if (!canSpeak) return;

    const chooseVoice = () => {
      voiceRef.current = selectBestVoice(language);
    };

    chooseVoice();
    window.speechSynthesis.addEventListener('voiceschanged', chooseVoice);

    return () => {
      if (wordTimerRef.current) clearTimeout(wordTimerRef.current);
      window.speechSynthesis.removeEventListener('voiceschanged', chooseVoice);
      window.speechSynthesis.cancel();
    };
  }, [language]);

  const clearActive = () => {
    rootRef.current?.querySelectorAll('.guide-listen__active, .guide-listen__word--active').forEach((element) => {
      element.classList.remove('guide-listen__active', 'guide-listen__word--active');
    });
  };

  const highlightWord = (item: SpeechItem, charIndex: number) => {
    const words = Array.from(item.element.querySelectorAll<HTMLElement>('[data-guide-listen-word]'));
    if (!words.length) {
      item.element.classList.add('guide-listen__active');
      return;
    }

    item.element.classList.remove('guide-listen__active');
    words.forEach((word) => word.classList.remove('guide-listen__word--active'));
    let cursor = 0;
    let active = words[0];
    const fullText = item.text;
    for (const word of words) {
      const value = word.textContent ?? '';
      const start = fullText.indexOf(value, cursor);
      if (start <= charIndex) active = word;
      if (start > charIndex) break;
      cursor = Math.max(start + value.length, cursor);
    }
    active.classList.add('guide-listen__word--active');
  };

  const speakItem = (index: number) => {
    if (wordTimerRef.current) clearTimeout(wordTimerRef.current);
    clearActive();
    // Resolve the element at speak time, not play time: the re-render triggered
    // by setStatus('playing') makes React re-apply the dangerouslySetInnerHTML
    // intro paragraph, replacing its sentence spans with fresh nodes. Cached
    // references from play() would point at detached elements, so highlighting
    // and scrolling would silently do nothing for the intro.
    const cached = itemsRef.current[index];
    const liveElement = rootRef.current
      ? Array.from(rootRef.current.querySelectorAll<HTMLElement>('[data-guide-listen-text]'))
          .filter((element) => element.textContent?.trim())[index]
      : undefined;
    const item = cached && liveElement ? { ...cached, element: liveElement } : cached;    if (!item) {
      setStatus('idle');
      return;
    }
    highlightWord(item, 0);
    item.element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    const utterance = new SpeechSynthesisUtterance(item.text);
    utterance.lang = language;
    if (voiceRef.current) utterance.voice = voiceRef.current;
    utterance.rate = 0.96;
    utterance.pitch = 1;
    let receivedBoundary = false;
    utterance.onstart = () => {
      const words = Array.from(item.element.querySelectorAll<HTMLElement>('[data-guide-listen-word]'));
      let wordIndex = 1;
      const advanceFallback = () => {
        if (receivedBoundary || wordIndex >= words.length) return;
        const charIndex = words.slice(0, wordIndex).reduce((total, word) => total + (word.textContent?.length ?? 0) + 1, 0);
        highlightWord(item, charIndex);
        const spokenWord = words[wordIndex].textContent ?? '';
        wordIndex += 1;
        const punctuationPause = /[.!?؟۔,،;؛:]$/.test(spokenWord) ? 180 : 0;
        const delay = Math.min(650, Math.max(260, 210 + spokenWord.length * 25 + punctuationPause));
        wordTimerRef.current = setTimeout(advanceFallback, delay);
      };
      wordTimerRef.current = setTimeout(advanceFallback, 420);
    };
    utterance.onboundary = (event) => {
      // Some voices emit only a single boundary at charIndex 0. That is not
      // usable word timing, so keep the fallback alive until speech actually
      // advances to a later character.
      if (event.charIndex > 0) {
        receivedBoundary = true;
        if (wordTimerRef.current) clearTimeout(wordTimerRef.current);
      }
      highlightWord(item, event.charIndex);
    };
    utterance.onend = () => {
      if (wordTimerRef.current) clearTimeout(wordTimerRef.current);
      speakItem(index + 1);
    };
    utterance.onerror = (event) => {
      if (wordTimerRef.current) clearTimeout(wordTimerRef.current);
      if (event.error !== 'canceled' && event.error !== 'interrupted') {
        clearActive();
        setStatus('idle');
      }
    };
    window.speechSynthesis.speak(utterance);
  };

  const play = () => {
    const root = rootRef.current;
    if (!root) return;
    // Chromium can populate its voice list after hydration. Re-select on the
    // user tap so Arabic and multilingual voices loaded late are considered.
    voiceRef.current = selectBestVoice(language);
    itemsRef.current = Array.from(root.querySelectorAll<HTMLElement>('[data-guide-listen-text]'))
      .flatMap((element): SpeechItem[] => {
        const text = element.textContent?.trim() ?? '';
        return text ? [{ element, text }] : [];
      });
    setStatus('playing');
    window.speechSynthesis.cancel();
    // Called directly from the user's tap, as required by iOS Safari.
    speakItem(0);
  };

  const stop = () => {
    if (wordTimerRef.current) clearTimeout(wordTimerRef.current);
    window.speechSynthesis.cancel();
    clearActive();
    setStatus('idle');
  };

  return (
    <section ref={rootRef} id="dot-guide" className="guide-listen" aria-label={heading}>
      <div className="guide-listen__heading-row">
        <h2 className="guide-listen__heading" data-guide-listen-text><WordText text={heading} /></h2>
        {supported && (
          <div className="guide-listen__controls" aria-label={listenLabel}>
            <button
              type="button"
              className={`guide-listen__button icon-tooltip${status === 'playing' ? ' guide-listen__button--active' : ''}`}
              onClick={status === 'playing' ? stop : play}
              aria-label={status === 'playing' ? stopLabel : listenLabel}
              aria-pressed={status === 'playing'}
              data-tooltip={status === 'playing' ? (isArabic ? 'إيقاف' : 'Stop') : (isArabic ? 'استمع' : 'Listen')}
            >
              <Volume2 size={22} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: 28 }} dangerouslySetInnerHTML={{ __html: wordHighlightHtml(introHtml) }} />
      {sections.map((section) => (
        <div key={section.range} className="guide-listen__section">
          <h3><SentenceText text={`${section.range} — ${section.title}`} /></h3>
          <p><SentenceText text={section.learn} /></p>
          <div className="guide-fact">
            <span className="guide-fact__icon" aria-hidden="true">💡</span>
            <div className="guide-fact__body">
              <span className="guide-fact__label" data-guide-listen-text>{funFactLabel}</span><br />
              <SentenceText text={section.fact} />
            </div>
          </div>
        </div>
      ))}
      {colorSchemes && colorSchemes.length > 0 && (
        <div style={{ marginTop: 32 }}>
          {colorHeading && <h2 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', marginBottom: 12 }}>{colorHeading}</h2>}
          {colorSchemes.map((scheme) => (
            <div key={scheme.name} style={{ marginBottom: 28, paddingLeft: 16, borderLeft: '3px solid var(--pink-light, #f6a5c0)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 6 }}>{scheme.name}</h3>
              <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: 10 }}>{scheme.note}</p>
              <ul style={{ lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
                {scheme.mapping.map((m) => (
                  <li key={`${scheme.name}-${m.range}`}>
                    <strong>{m.range} ({m.part}):</strong>{' '}
                    {m.hex && (
                      <span
                        aria-hidden="true"
                        style={{
                          display: 'inline-block',
                          width: 34,
                          height: 14,
                          borderRadius: 7,
                          background: m.hex,
                          border: '1px solid rgba(0,0,0,0.18)',
                          verticalAlign: 'middle',
                          marginRight: 6
                        }}
                      />
                    )}
                    {m.color} — {m.why}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      <p
        className="guide-listen__outro"
        dangerouslySetInnerHTML={{ __html: wordHighlightHtml(outroHtml) }}
      />
    </section>
  );
}

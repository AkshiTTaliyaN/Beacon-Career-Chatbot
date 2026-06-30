import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translateText } from '../utils/translator';

/**
 * Renders English text with a translation subtitle underneath (or inline)
 * if a bilingual language mode (like Khmer) is active.
 *
 * @param {object} props
 * @param {any} props.text - The English text string to be rendered and translated.
 * @param {boolean} [props.inline=false] - If true, displays translation as "English (Khmer)" instead of block/subtitle.
 * @param {object} [props.style] - Inline style for the outer container.
 * @param {object} [props.subtitleStyle] - Inline style for the translated subtitle text.
 */
export default function BilingualText({ text, inline = false, style = {}, subtitleStyle = {} }) {
  const { language } = useLanguage();
  const [translated, setTranslated] = useState('');

  useEffect(() => {
    let active = true;
    if (language === 'en' || typeof text !== 'string' || !text.trim()) {
      const timer = setTimeout(() => {
        if (active) setTranslated('');
      }, 0);
      return () => clearTimeout(timer);
    }

    translateText(text, language).then((result) => {
      if (active) {
        setTranslated(result);
      }
    });

    return () => {
      active = false;
    };
  }, [text, language]);

  // If text is not a string, or language is English, or translation failed/loading,
  // just render the original text.
  if (typeof text !== 'string' || language === 'en' || !translated) {
    return <span style={style}>{text}</span>;
  }

  if (inline) {
    return (
      <span style={style}>
        {text} <span style={{ fontSize: '0.85em', opacity: 0.75, fontWeight: 'normal', ...subtitleStyle }}>({translated})</span>
      </span>
    );
  }

  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', verticalAlign: 'middle', textAlign: 'inherit', width: '100%', ...style }}>
      <span style={{ textAlign: 'inherit' }}>{text}</span>
      <span style={{ 
        fontSize: '0.75em', 
        opacity: 0.7, 
        fontWeight: 400, 
        lineHeight: 1.25,
        marginTop: '0.15rem',
        textTransform: 'none',
        letterSpacing: 'normal',
        fontFamily: 'Inter, system-ui, sans-serif',
        textAlign: 'inherit',
        ...subtitleStyle 
      }}>
        {translated}
      </span>
    </span>
  );
}

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { useLanguage } from "../context/LanguageContext";
import { translateText } from "../utils/translator";

export default function ChatMarkdown({ content }) {
  const { language } = useLanguage();
  const [translated, setTranslated] = useState("");

  useEffect(() => {
    let active = true;
    if (language === 'en' || !content) {
      setTranslated("");
      return;
    }
    translateText(content, language).then(result => {
      if (active) {
        setTranslated(result);
      }
    });
    return () => {
      active = false;
    };
  }, [content, language]);

  if (!content) return null;

  return (
    <div className="chat-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          a: ({ children, href, ...props }) => (
            <a href={href} target="_blank" rel="noreferrer" {...props}>
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
      {language !== 'en' && translated && (
        <div 
          className="chat-markdown-subtitle" 
          style={{ 
            fontSize: '0.85em', 
            opacity: 0.75, 
            marginTop: '0.6rem', 
            borderTop: '1px dashed rgba(255,255,255,0.18)',
            paddingTop: '0.5rem',
            lineHeight: 1.35,
            fontFamily: 'Inter, system-ui, sans-serif'
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            components={{
              a: ({ children, href, ...props }) => (
                <a href={href} target="_blank" rel="noreferrer" {...props}>
                  {children}
                </a>
              ),
            }}
          >
            {translated}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}

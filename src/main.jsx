import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { birthdayContent as content } from './data/birthdayContent';
import './styles.css';

const symbol = (code) => String.fromCodePoint(code);
const STORAGE_KEY = 'scrapbook-content-v1';
const baseContent = { ...content, memories: content.memories.map((item) => ({ ...item })), filmPhotos: [...content.filmPhotos] };
function loadContent() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? { ...baseContent, ...saved } : baseContent;
  } catch { return baseContent; }
}

function Photo({ src, alt, className = '', number = '01', onPhotoClick }) {
  const [failed, setFailed] = useState(false);
  const imagePath = src ? (src.startsWith('/') ? src : `/assets/photos/${src}`) : '';
  const canOpen = Boolean(imagePath && !failed && onPhotoClick);
  return <div className={`photo ${className}${canOpen ? ' photo-clickable' : ''}`} role={canOpen ? 'button' : undefined} tabIndex={canOpen ? 0 : undefined} aria-label={canOpen ? `Open photograph: ${alt}` : undefined}
    onClick={canOpen ? () => onPhotoClick(imagePath, alt) : undefined}
    onKeyDown={canOpen ? (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onPhotoClick(imagePath, alt); } } : undefined}>
    {imagePath && !failed ? <img src={imagePath} alt={alt} onError={() => setFailed(true)} /> : <div className="photo-placeholder"><span className="photo-mark">{symbol(0x2733)}</span><span>[ADD PHOTO {number}]</span></div>}
  </div>;
}

function Flower() { return <div className="flower" aria-hidden="true"><span>{symbol(0x273f)}</span><i>{symbol(0x273f)}</i><b>{symbol(0x273f)}</b></div>; }
function Camera() { return <div className="camera" aria-hidden="true"><div className="camera-top"/><div className="camera-lens"/><div className="camera-flash"/><span>{symbol(0x2726)}</span></div>; }

function Opening({ onOpen, opened }) {
  return <section className="opening" aria-label="Birthday card cover">
    <span className="cover-kicker">{content.coverKicker}</span>
    <h1>{content.recipient}</h1>
    <p className="cover-note">{content.coverNote}</p>
    <div className="cover-stage">
      <div className="paper-scrap scrap-left">a day<br/>to remember</div>
      <Camera />
      <div className={`envelope-wrap ${opened ? 'envelope-opened' : ''}`}>
        <div className="envelope-shadow" />
        <div className="envelope">
          <div className="envelope-back" />
          <div className="mini-card"><span>{content.cardLead}</span><strong>{content.cardText}</strong><i>{symbol(0x2665)}</i></div>
          <div className="envelope-front" />
          <div className="envelope-flap" />
          <button className="open-button" onClick={onOpen} disabled={opened}><span>{symbol(0x2726)}</span> {content.openingPrompt} <span>{symbol(0x2726)}</span></button>
        </div>
      </div>
      <div className="bouquet" aria-hidden="true"><div className="bouquet-wrap"/><i>{symbol(0x273f)}</i><b>{symbol(0x273e)}</b><span>{symbol(0x2740)}</span><em>{symbol(0x273f)}</em><small>{symbol(0x273d)}</small></div>
      <div className="paper-scrap scrap-right">with love<br/><b>{symbol(0x2661)}</b></div>
    </div>
    <div className="cover-bottom">{content.turnPrompt} <span>{symbol(0x2193)}</span></div>
  </section>;
}

function Book({ opened, onPhotoClick }) {
  return <section className={`book-scene ${opened ? 'is-open' : ''}`} id="book" aria-label="Birthday scrapbook">
    <div className="book-shadow" />
    <div className="rings" aria-hidden="true"><span/><span/></div>
    <div className="book-spine" />
    <article className="book-page left-page">
      <span className="page-number">A LITTLE CELEBRATION - {content.recipient.toUpperCase()}</span>
      <div className="page-sprig">{symbol(0x273f)}　{symbol(0x2727)}　{symbol(0x273f)}</div>
      <h2>{content.birthdayNumber}</h2>
      <div className="year-badge">{symbol(0x2726)} &nbsp; {content.badgeText} &nbsp; {symbol(0x2726)}</div>
      <div className="intro-copy">{content.introduction}</div>
      <div className="tiny-heart">{symbol(0x2661)}</div>
      <div className="page-footer"><span>made with love</span><span>01</span></div>
    </article>
    <article className="book-page right-page">
      <div className="tape tape-top" />
      <div className="photo-frame opening-frame"><Photo src={content.openingPhoto} alt={`A photograph for ${content.recipient}`} number="01" onPhotoClick={onPhotoClick} /></div>
      <p className="photo-caption">{content.openingCaption}</p>
      <div className="sticker-star">{symbol(0x2726)}</div><div className="sticker-flower">{symbol(0x273f)}</div>
      <div className="page-footer"><span>our little story</span><span>02</span></div>
    </article>
  </section>;
}

function Memories({ onPhotoClick }) {
  return <section className="memories section-wrap">
    <div className="section-heading"><span className="eyebrow">{content.memoriesEyebrow}</span><h2>{content.memoriesHeading}</h2><p>{content.memoriesSubheading}</p></div>
    {content.memories.map((memory, index) => <article className={`memory-row row-${index + 1}`} key={memory.label}>
      <div className="memory-photo-wrap"><div className="tape memory-tape"/><div className="polaroid"><Photo src={memory.image} alt={memory.caption} number={`0${index + 2}`} onPhotoClick={onPhotoClick} /><div className="polaroid-caption">{memory.caption}</div></div><span className="doodle">{symbol(0x2727)}</span></div>
      <div className="memory-copy"><span className="eyebrow">{memory.label}</span><h3>{memory.heading}</h3><p>{memory.note}</p><span className="hand-heart">{symbol(0x2661)}</span></div>
    </article>)}
  </section>;
}

function FilmStrip({ onPhotoClick }) {
  return <section className="film-section"><div className="film-title"><span>{content.filmEyebrow}</span><h2>{content.filmHeading}</h2></div><div className="film-strip"><div className="sprockets"/>
    {content.filmPhotos.map((src, i) => <div className="film-frame" key={i}><Photo src={src} alt={`Film memory ${i + 1}`} number={`0${i + 5}`} onPhotoClick={onPhotoClick} /><span>{symbol(0x2726)}</span></div>)}
    <div className="sprockets bottom"/></div><p className="film-caption">{content.filmCaption}</p></section>;
}

function Letter({ note, setNote }) {
  return <section className="letter-section"><div className="letter-paper"><div className="letter-tape"/><span className="letter-date">{content.letterLabel}</span><div className="letter-flower">{symbol(0x273f)}</div><h2>Dear {content.recipient.split(' ')[0]},</h2><p>{content.letter}</p><p className="letter-signoff">{content.signOff}<br/><span>{content.signature}</span></p><div className="letter-seal">{symbol(0x2665)}</div>
    <div className="personal-note-area"><button className="paper-link" onClick={() => setNote(!note)} aria-expanded={note}>{content.hiddenNoteLabel} <span>{note ? '-' : '+'}</span></button>{note && <div className="hidden-note" role="status">{content.hiddenNote}</div>}</div>
  </div></section>;
}

function BirthdayMoment({ wished, onWish }) {
  return <section className={`wish-section ${wished ? 'wish-revealed' : ''}`} aria-label="Birthday wish">
    <button className="wish-button" onClick={onWish} aria-expanded={wished}>{content.wishButton}</button>
    {wished && <div className="wish-reveal" role="status"><div className="wish-stars" aria-hidden="true">{symbol(0x2726)}　{symbol(0x2727)}　{symbol(0x2726)}</div><p>{content.birthdayWish}</p></div>}
  </section>;
}

function MusicControl({ playing, onToggle, unavailable }) {
  return <button className={`music-control ${playing ? 'music-playing' : ''}`} onClick={onToggle} aria-label={playing ? 'Pause birthday music' : 'Play birthday music'} title={unavailable ? 'Music file unavailable' : playing ? 'Pause music' : 'Play music'}>
    <span className="music-note" aria-hidden="true">{symbol(0x266b)}</span><span className="music-label">{playing ? 'Music on' : 'Music'}</span><span className="music-state" aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>
  </button>;
}

function Lightbox({ photo, onClose }) {
  useEffect(() => {
    if (!photo) return undefined;
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('lightbox-open');
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.classList.remove('lightbox-open'); };
  }, [photo, onClose]);
  if (!photo) return null;
  return <div className="lightbox-backdrop" role="presentation" onClick={onClose}>
    <div className="lightbox-dialog" role="dialog" aria-modal="true" aria-label={photo.alt || 'Photograph'} onClick={(event) => event.stopPropagation()}>
      <button className="lightbox-close" onClick={onClose} aria-label="Close photograph">×</button><img src={photo.src} alt={photo.alt} />
    </div>
  </div>;
}

function App() {
  const [pageContent, setPageContent] = useState(loadContent);
  const [editorOpen, setEditorOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [audioUnavailable, setAudioUnavailable] = useState(false);
  const [note, setNote] = useState(false);
  const [wished, setWished] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const audioRef = useRef(null);

  Object.assign(content, pageContent);
  useEffect(() => { document.title = pageContent.siteTitle || `${pageContent.recipient} · ${pageContent.occasion}`; }, [pageContent]);
  const updateField = (key, value) => setPageContent((current) => ({ ...current, [key]: value }));
  const saveContent = () => { localStorage.setItem(STORAGE_KEY, JSON.stringify(pageContent)); setEditorOpen(false); };
  const resetContent = () => { localStorage.removeItem(STORAGE_KEY); setPageContent(baseContent); };

  const playMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.25;
    const result = audio.play();
    if (result?.catch) result.catch(() => { setPlaying(false); setAudioUnavailable(true); });
  };
  const reveal = () => {
    if (opened) return;
    setOpened(true);
    playMusic();
    window.setTimeout(() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 350);
  };
  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) { setAudioUnavailable(false); audio.volume = 0.25; const result = audio.play(); if (result?.catch) result.catch(() => { setPlaying(false); setAudioUnavailable(true); }); }
    else audio.pause();
  };
  const showPhoto = (src, alt) => setLightbox({ src, alt });

  return <main>
    <audio ref={audioRef} src={pageContent.musicPath || '/assets/music/birthday-song.mp3'} preload="none" loop onPlay={() => { setPlaying(true); setAudioUnavailable(false); }} onPause={() => setPlaying(false)} onError={() => { setPlaying(false); setAudioUnavailable(true); }} />
    <button className="customize-toggle" onClick={() => setEditorOpen((value) => !value)} aria-expanded={editorOpen}>✎ Customize</button>
    {editorOpen && <aside className="customize-panel" aria-label="Customize this site"><div className="customize-heading"><div><span className="eyebrow">YOUR LOCAL COPY</span><h2>Make it yours</h2></div><button onClick={() => setEditorOpen(false)} aria-label="Close customization">×</button></div><p>Changes save in this browser on this device.</p>
      {[
        ['siteTitle', 'Browser tab / site name'], ['occasion', 'Occasion'], ['recipient', 'Person’s name'], ['coverKicker', 'Cover top line'], ['coverNote', 'Cover note'], ['cardLead', 'Envelope card lead'], ['cardText', 'Envelope card message'], ['turnPrompt', 'Page turn prompt'], ['openingPrompt', 'Open button'], ['birthdayGreeting', 'Greeting'], ['birthdayNumber', 'Big page heading'], ['badgeText', 'Badge text'], ['introduction', 'Introduction'], ['openingPhoto', 'Cover photo filename'], ['openingCaption', 'Cover photo caption'], ['memoriesEyebrow', 'Memories section label'], ['memoriesHeading', 'Memories heading'], ['memoriesSubheading', 'Memories intro'], ['filmEyebrow', 'Photo strip label'], ['filmHeading', 'Photo strip heading'], ['filmCaption', 'Photo strip caption'], ['letterLabel', 'Letter label'], ['letter', 'Letter message'], ['signOff', 'Letter sign-off'], ['signature', 'Signature'], ['hiddenNoteLabel', 'Hidden note button'], ['hiddenNote', 'Hidden note'], ['wishButton', 'Wish button'], ['birthdayWish', 'Wish message']
      ].map(([key, label]) => <label className="customize-field" key={key}>{label}<textarea rows={['letter', 'introduction', 'hiddenNote', 'birthdayWish'].includes(key) ? 3 : 1} value={pageContent[key] || ''} onChange={(event) => updateField(key, event.target.value)} /></label>)}
      <h3 className="customize-subhead">Memory entries</h3>{pageContent.memories.map((memory, index) => <div className="customize-memory" key={index}><strong>Memory {index + 1}</strong>{[['label','Small label'],['heading','Heading'],['caption','Photo caption'],['note','Story'],['image','Photo filename']].map(([key,label]) => <label className="customize-field" key={key}>{label}<textarea rows={key === 'note' ? 2 : 1} value={memory[key] || ''} onChange={(event) => setPageContent((current) => ({...current, memories: current.memories.map((item, i) => i === index ? {...item, [key]: event.target.value} : item)}))}/></label>)}</div>)}
      {pageContent.filmPhotos.map((photo, index) => <label className="customize-field" key={`film-${index}`}>Film photo {index + 1} filename<textarea value={photo || ''} onChange={(event) => setPageContent((current) => ({...current, filmPhotos: current.filmPhotos.map((item, i) => i === index ? event.target.value : item)}))}/></label>)}
      <label className="customize-field">Music file path<textarea value={pageContent.musicPath || ''} placeholder="/assets/music/birthday-song.mp3" onChange={(event) => updateField('musicPath', event.target.value)}/></label>
      <div className="customize-actions"><button onClick={resetContent} className="reset-custom">Reset template</button><button onClick={saveContent} className="save-custom">Save changes</button></div>
    </aside>}
    <Opening onOpen={reveal} opened={opened}/>
    <MusicControl playing={playing} unavailable={audioUnavailable} onToggle={toggleMusic}/>
    <div className={`experience ${opened ? 'experience-opened' : ''}`}><div className="book-intro"><span className="eyebrow">A BOOK OF LITTLE THINGS</span>
      {opened && <div className="birthday-greeting"><span>{content.recipient.split(' ')[0]}</span><h2>{content.birthdayGreeting}</h2></div>}
    </div><Book opened={opened} onPhotoClick={showPhoto}/><Memories onPhotoClick={showPhoto}/><FilmStrip onPhotoClick={showPhoto}/><Letter note={note} setNote={setNote}/><BirthdayMoment wished={wished} onWish={() => setWished((value) => !value)}/><footer className="closing"><Flower/><p>Happy birthday,</p><h2>{content.recipient}</h2><span>{symbol(0x2661)}</span></footer></div>
    <Lightbox photo={lightbox} onClose={() => setLightbox(null)}/>
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);

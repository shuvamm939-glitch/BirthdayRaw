import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { birthdayContent as content, twinklingCatsConfig } from './data/birthdayContent';
import './styles.css';

const symbol = (code) => String.fromCodePoint(code);
const photoUrl = (src) => src ? (src.startsWith('/') ? src : `/assets/photos/${src}`) : '';
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
  const imagePath = photoUrl(src);
  const canOpen = Boolean(imagePath && !failed && onPhotoClick);
  return <div className={`photo ${className}${canOpen ? ' photo-clickable' : ''}`} role={canOpen ? 'button' : undefined} tabIndex={canOpen ? 0 : undefined} aria-label={canOpen ? `Open photograph: ${alt}` : undefined}
    onClick={canOpen ? () => onPhotoClick(imagePath, alt) : undefined}
    onKeyDown={canOpen ? (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onPhotoClick(imagePath, alt); } } : undefined}>
    {imagePath && !failed ? <img src={imagePath} alt={alt} onError={() => setFailed(true)} /> : <div className="photo-placeholder"><span className="photo-mark">{symbol(0x2733)}</span><span>[ADD PHOTO {number}]</span></div>}
  </div>;
}

function Flower() { return <div className="flower" aria-hidden="true"><span>{symbol(0x273f)}</span><i>{symbol(0x273f)}</i><b>{symbol(0x273f)}</b></div>; }
function Camera() { return <div className="camera" aria-hidden="true"><div className="camera-top"/><div className="camera-lens"/><div className="camera-flash"/><span>{symbol(0x2726)}</span></div>; }

function PartyEffects() {
  const confettiColors = ['#e7b567', '#f1e6d2', '#cf6872', '#8da36c', '#d8a4a0', '#f7d987'];
  return <div className="open-party-effects" aria-hidden="true">
    <div className="open-paper-rain">{Array.from({ length: 34 }, (_, i) => <i key={i} style={{ '--x': `${(i * 37) % 100}%`, '--delay': `${(i % 13) * -0.31}s`, '--duration': `${5.1 + (i % 5) * .45}s`, '--tilt': `${(i * 47) % 260 - 130}deg`, '--color': confettiColors[i % confettiColors.length] }} />)}</div>
    <div className="open-party-balloons">{Array.from({ length: 9 }, (_, i) => <i key={i} style={{ '--x': `${5 + (i * 29) % 91}%`, '--delay': `${(i % 6) * -.8}s`, '--duration': `${7 + (i % 4)}s`, '--balloon': confettiColors[(i + 2) % confettiColors.length] }} />)}</div>
  </div>;
}

function SkyBalloons() {
  const colors = ['#d88b8c', '#d8b36e', '#94a87e', '#b79abe', '#d48a67', '#83aeb0', '#c97883', '#e0c98b'];
  return <div className="sky-balloons" aria-hidden="true">
    {colors.map((color, index) => <i key={color} style={{ '--balloon-x': `${6 + ((index * 37) % 90)}%`, '--balloon-delay': `${-index * 3.7}s`, '--balloon-duration': `${19 + (index % 4) * 3}s`, '--balloon-color': color, '--balloon-size': `${34 + (index % 3) * 8}px` }} />)}
  </div>;
}

const catStarPositions = [
  [5, 9], [19, 16], [35, 7], [51, 20], [68, 10], [87, 17],
  [12, 34], [29, 43], [45, 33], [62, 46], [79, 36], [94, 48],
  [3, 62], [21, 71], [39, 59], [55, 76], [73, 64], [89, 79],
  [11, 91], [31, 86], [49, 94], [67, 88], [83, 96], [96, 7],
];

function TwinklingCatsOverlay({ config }) {
  if (!config?.enabled || !config.gifPath) return null;
  const count = Math.max(0, Math.min(catStarPositions.length, Number(config.desktopCount) || 0));
  const mobileCount = Math.max(0, Math.min(count, Number(config.mobileCount) || 0));
  const maxOpacity = Math.max(0, Math.min(0.7, Number(config.maxOpacity) || 0.52));
  return <div className="cat-stars-layer" aria-hidden="true" style={{ '--cat-max-opacity': maxOpacity }}>
    {catStarPositions.slice(0, count).map(([left, top], index) => {
      const size = 52 + ((index * 7 + 3) % 24);
      const rotation = ((index * 11) % 25) - 12;
      const duration = 3 + ((index * 17) % 41) / 10;
      const delay = -((index * 13) % 61) / 10;
      return <img key={index} className={`cat-star-item${index >= mobileCount ? ' cat-star-mobile-hidden' : ''}`} src={config.gifPath} alt="" loading="lazy" decoding="async"
        style={{ '--cat-left': `${left}%`, '--cat-top': `${top}%`, '--cat-size': `${size}px`, '--cat-rotation': `${rotation}deg`, '--cat-duration': `${duration}s`, '--cat-delay': `${delay}s`, '--cat-opacity': `${Math.min(maxOpacity, 0.38 + ((index * 7) % 30) / 100)}` }} />;
    })}
  </div>;
}

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
      <div className="page-sprig">{symbol(0x273f)}ã€€{symbol(0x2727)}ã€€{symbol(0x273f)}</div>
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

function TeddySurprise() {
  const [stage, setStage] = useState('idle');
  const [noLine, setNoLine] = useState(false);
  useEffect(() => {
    if (stage !== 'greeting') return undefined;
    const timer = window.setTimeout(() => setStage('asking'), 1400);
    return () => window.clearTimeout(timer);
  }, [stage]);
  const chooseNo = () => {
    setNoLine(true);
    window.setTimeout(() => { setNoLine(false); setStage('celebration'); }, 1050);
  };
  const config = content.teddySurprise || {};
  return <section className="teddy-surprise-section">
    <span className="eyebrow">A TINY SURPRISE</span>
    <h2>A little visitor is waiting</h2>
    {stage === 'idle' && <button className="teddy-surprise-trigger" onClick={() => setStage('greeting')}>Click here <span aria-hidden="true">â†—</span></button>}
    {stage !== 'idle' && stage !== 'celebration' && <div className="teddy-surprise-scene">
      <div className="teddy-surprise-photo-window"><img src={photoUrl(config.photo || 'birthday-illustration.jpg')} alt="A cheerful hand-drawn birthday celebration" /></div>
      <p className="teddy-surprise-greeting">{config.greeting || 'Happy Birthday!'}</p>
    </div>}
    {noLine && createPortal(<div className="teddy-surprise-no-line" role="status">{config.noButtonText}</div>, document.body)}
    {stage === 'asking' && createPortal(<div className="teddy-surprise-modal-backdrop"><div className="teddy-surprise-modal" role="dialog" aria-modal="true" aria-labelledby="teddy-wish-title"><span aria-hidden="true">âœ¦</span><h3 id="teddy-wish-title">Make a wish?</h3><p>Close your eyes and think of something lovely.</p><div><button autoFocus onClick={() => setStage('celebration')}>Yes</button><button onClick={chooseNo}>No</button></div></div></div>, document.body)}
    {stage === 'celebration' && createPortal(<div className="teddy-surprise-celebration" role="dialog" aria-modal="true" aria-labelledby="teddy-celebration-title">
      <div className="teddy-surprise-falling-banners" aria-hidden="true"><span>Happy Birthday</span><span>For {content.recipient}</span><span>Happy Birthday</span></div>
      <div className="teddy-surprise-floating-balloons" aria-hidden="true">{['#cf7180','#dfb46a','#859b76','#b795bd','#de8b63','#7da8a6','#d68b91'].map((color, i) => <i key={color} style={{ '--x': `${4 + i * 14}%`, '--delay': `${i * -.9}s`, '--balloon': color }}/>)}</div>
      <button className="teddy-surprise-close" onClick={() => setStage('idle')} aria-label="Close celebration">Ã—</button>
      <div className="teddy-surprise-celebration-content"><span className="eyebrow">A WISH FOR YOU</span><h2 id="teddy-celebration-title">Happy Birthday, {content.recipient}!</h2>
        <div className="teddy-surprise-cake" role="img" aria-label="A birthday cake with candles and a cat topper">
          <div className="teddy-surprise-cake-candles" aria-hidden="true"><i/><i/><i/></div>
          <div className="teddy-surprise-cake-topper"><img src={photoUrl(config.cakePhoto || 'birthday-cat.jpg')} alt="A waving orange cat" /></div>
          <div className="teddy-surprise-cake-top"/><div className="teddy-surprise-cake-tier cake-tier-upper"/><div className="teddy-surprise-cake-tier cake-tier-lower"/><div className="teddy-surprise-cake-plate"/>
        </div>
        <div className="teddy-surprise-real-photo"><img src={photoUrl(config.photo || 'birthday-illustration.jpg')} alt="A cheerful hand-drawn birthday celebration" /></div><p className="teddy-surprise-wish">{config.bestWish || content.birthdayWish}</p></div>
    </div>, document.body)}
  </section>;
}

function Letter({ note, setNote }) {
  return <section className="letter-section"><div className="letter-paper"><div className="letter-tape"/><span className="letter-date">{content.letterLabel}</span><div className="letter-flower">{symbol(0x273f)}</div><h2>Dear {content.recipient.split(' ')[0]},</h2><p>{content.letter}</p><p className="letter-signoff">{content.signOff}<br/><span>{content.signature}</span></p><div className="letter-seal">{symbol(0x2665)}</div>
    <div className="personal-note-area"><button className="paper-link" onClick={() => setNote(!note)} aria-expanded={note}>{content.hiddenNoteLabel} <span>{note ? '-' : '+'}</span></button>{note && <div className="hidden-note" role="status">{content.hiddenNote}</div>}</div>
  </div></section>;
}

function BirthdayMoment({ wished, onWish }) {
  return <section className={`wish-section ${wished ? 'wish-revealed' : ''}`} aria-label="Birthday wish">
    <button className="wish-button" onClick={onWish} aria-expanded={wished}>{content.wishButton}</button>
    {wished && <div className="wish-reveal" role="status"><div className="wish-stars" aria-hidden="true">{symbol(0x2726)}ã€€{symbol(0x2727)}ã€€{symbol(0x2726)}</div><p>{content.birthdayWish}</p></div>}
  </section>;
}

function LittleReminder() {
  const [reminder, setReminder] = useState('');
  const [turn, setTurn] = useState(0);
  const nextReminder = () => {
    const options = content.littleReminders || [];
    if (!options.length) return;
    let index = Math.floor(Math.random() * options.length);
    if (options.length > 1 && options[index] === reminder) index = (index + 1) % options.length;
    setReminder(options[index]);
    setTurn((value) => value + 1);
  };
  return <section className="reason-section" aria-label="A little reminder">
    <span className="eyebrow">FOR A DAY YOU NEED A SMILE</span>
    <h2>A little reminder</h2>
    <p className="reason-intro">A small note, picked just for you.</p>
    <button className="reason-button" onClick={nextReminder}>Pick a reminder <span aria-hidden="true">â†—</span></button>
    {reminder && <p key={turn} className="reason-message" role="status">{reminder}</p>}
  </section>;
}

function MusicControl({ playing, onToggle, unavailable }) {
  return <button className={`music-control ${playing ? 'music-playing' : ''}`} onClick={onToggle} aria-label={playing ? 'Pause birthday music' : 'Play birthday music'} title={unavailable ? 'Music file unavailable' : playing ? 'Pause music' : 'Play music'}>
    <span className="music-note" aria-hidden="true">{symbol(0x266b)}</span><span className="music-label">{playing ? 'Music on' : 'Music'}</span><span className="music-state" aria-hidden="true">{playing ? 'â…¡' : 'â–¶'}</span>
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
      <button className="lightbox-close" onClick={onClose} aria-label="Close photograph">Ã—</button><img src={photo.src} alt={photo.alt} />
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
  const [partyActive, setPartyActive] = useState(false);
  const [catGifOverride, setCatGifOverride] = useState(() => {
    try { return localStorage.getItem('scrapbook-cat-gif-v1') || ''; } catch { return ''; }
  });
  const [catGifMessage, setCatGifMessage] = useState('');
  const audioRef = useRef(null);

  Object.assign(content, pageContent);
  useEffect(() => { document.title = pageContent.siteTitle || `${pageContent.recipient} Â· ${pageContent.occasion}`; }, [pageContent]);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return undefined;
    const targets = document.querySelectorAll('.book-scene, .memory-row, .film-section, .letter-section, .reason-section, .wish-section, .closing');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    targets.forEach((target) => { target.classList.add('reveal-on-scroll'); observer.observe(target); });
    return () => observer.disconnect();
  }, []);
  const updateField = (key, value) => setPageContent((current) => ({ ...current, [key]: value }));
  const saveContent = () => { localStorage.setItem(STORAGE_KEY, JSON.stringify(pageContent)); setEditorOpen(false); };
  const resetContent = () => { localStorage.removeItem(STORAGE_KEY); setPageContent(baseContent); };
  const updateCatGif = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!(file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif'))) {
      setCatGifMessage('Choose a .gif file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setCatGifMessage('That GIF is over 2 MB. Choose a smaller file for reliable local storage.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const gifData = String(reader.result || '');
        localStorage.setItem('scrapbook-cat-gif-v1', gifData);
        setCatGifOverride(gifData);
        setCatGifMessage(`${file.name} saved in this browser.`);
      } catch {
        setCatGifMessage('This GIF could not be saved. Try a smaller file or replace public/assets/decorations/cat.gif in the project.');
      }
    };
    reader.onerror = () => setCatGifMessage('Could not read that GIF file.');
    reader.readAsDataURL(file);
  };
  const resetCatGif = () => {
    try { localStorage.removeItem('scrapbook-cat-gif-v1'); } catch { /* Keep the bundled image if storage is unavailable. */ }
    setCatGifOverride('');
    setCatGifMessage('Using the bundled cat GIF.');
  };

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
    setPartyActive(true);
    window.setTimeout(() => setPartyActive(false), 8500);
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
    <TwinklingCatsOverlay config={{ ...twinklingCatsConfig, gifPath: catGifOverride || twinklingCatsConfig.gifPath }}/>
    <SkyBalloons/>
    {partyActive && <PartyEffects/>}
    <audio ref={audioRef} src="/assets/music/birthday-song.mp3" preload="none" loop onPlay={() => { setPlaying(true); setAudioUnavailable(false); }} onPause={() => setPlaying(false)} onError={() => { setPlaying(false); setAudioUnavailable(true); }} />
    <button className="customize-toggle" onClick={() => setEditorOpen((value) => !value)} aria-expanded={editorOpen}>Edit page</button>
    {editorOpen && <aside className="customize-panel" aria-label="Customize this site"><div className="customize-heading"><div><span className="eyebrow">PAGE SETTINGS</span><h2>Edit this page</h2></div><button onClick={() => setEditorOpen(false)} aria-label="Close customization">Ã—</button></div><p>Text changes are saved in this browser. To change photos or music, edit <code>src/data/birthdayContent.js</code>.</p>
      <section className="cat-gif-editor" aria-label="Cat star GIF settings"><h3>Twinkling cat GIF</h3><p>Choose a GIF from your device. It is saved only in this browser and does not change the project files.</p><label className="cat-gif-upload">Choose a GIF<input type="file" accept="image/gif,.gif" onChange={updateCatGif}/></label><button className="cat-gif-reset" type="button" onClick={resetCatGif}>Use bundled GIF</button>{catGifOverride && <img className="cat-gif-preview" src={catGifOverride} alt="Current custom cat GIF preview"/>}{catGifMessage && <p className="cat-gif-status" role="status">{catGifMessage}</p>}</section>
      {[
        ['siteTitle', 'Browser tab / site name'], ['occasion', 'Occasion'], ['recipient', 'Personâ€™s name'], ['coverKicker', 'Cover top line'], ['coverNote', 'Cover note'], ['cardLead', 'Envelope card lead'], ['cardText', 'Envelope card message'], ['turnPrompt', 'Page turn prompt'], ['openingPrompt', 'Open button'], ['birthdayGreeting', 'Greeting'], ['birthdayNumber', 'Big page heading'], ['badgeText', 'Badge text'], ['introduction', 'Introduction'], ['openingCaption', 'Cover photo caption'], ['memoriesEyebrow', 'Memories section label'], ['memoriesHeading', 'Memories heading'], ['memoriesSubheading', 'Memories intro'], ['filmEyebrow', 'Photo strip label'], ['filmHeading', 'Photo strip heading'], ['filmCaption', 'Photo strip caption'], ['letterLabel', 'Letter label'], ['letter', 'Letter message'], ['signOff', 'Letter sign-off'], ['signature', 'Signature'], ['hiddenNoteLabel', 'Hidden note button'], ['hiddenNote', 'Hidden note'], ['wishButton', 'Wish button'], ['birthdayWish', 'Wish message']
      ].map(([key, label]) => <label className="customize-field" key={key}>{label}<textarea rows={['letter', 'introduction', 'hiddenNote', 'birthdayWish'].includes(key) ? 3 : 1} value={pageContent[key] || ''} onChange={(event) => updateField(key, event.target.value)} /></label>)}
      <h3 className="customize-subhead">Memory text</h3>{pageContent.memories.map((memory, index) => <div className="customize-memory" key={index}><strong>Memory {index + 1}</strong>{[['label','Small label'],['heading','Heading'],['caption','Photo caption'],['note','Story']].map(([key,label]) => <label className="customize-field" key={key}>{label}<textarea rows={key === 'note' ? 2 : 1} value={memory[key] || ''} onChange={(event) => setPageContent((current) => ({...current, memories: current.memories.map((item, i) => i === index ? {...item, [key]: event.target.value} : item)}))}/></label>)}</div>)}
      <div className="customize-actions"><button onClick={resetContent} className="reset-custom">Reset template</button><button onClick={saveContent} className="save-custom">Save changes</button></div>
    </aside>}
    <Opening onOpen={reveal} opened={opened}/>
    <MusicControl playing={playing} unavailable={audioUnavailable} onToggle={toggleMusic}/>
    <div className={`experience ${opened ? 'experience-opened' : ''}`}><div className="book-intro"><span className="eyebrow">A BOOK OF LITTLE THINGS</span>
      {opened && <div className="birthday-greeting"><span>{content.recipient.split(' ')[0]}</span><h2>{content.birthdayGreeting}</h2></div>}
    </div><Book opened={opened} onPhotoClick={showPhoto}/><Memories onPhotoClick={showPhoto}/><FilmStrip onPhotoClick={showPhoto}/><TeddySurprise/><Letter note={note} setNote={setNote}/><LittleReminder/><BirthdayMoment wished={wished} onWish={() => setWished((value) => !value)}/><footer className="closing"><Flower/><p>Happy birthday,</p><h2>{content.recipient}</h2><span>{symbol(0x2661)}</span></footer></div>
    <Lightbox photo={lightbox} onClose={() => setLightbox(null)}/>
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);


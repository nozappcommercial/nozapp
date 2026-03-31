"use client";

import React from "react";
import { useScrollReveal } from "./useScrollReveal";
import type { OnboardingFilm, Phase } from "./types";

/* ─── ConfirmPhase Props ─────────────────────────────────────────── */
interface ConfirmPhaseProps {
  pillars: OnboardingFilm[];
  setPillars: (p: OnboardingFilm[]) => void;
  lovedFilms: OnboardingFilm[];
  replacementCandidates: OnboardingFilm[];
  replacingPillar: number | null;
  setReplacingPillar: (n: number | null) => void;
  handleReplace: (idx: number, film: OnboardingFilm) => void;
  dragItem: number | null;
  dragOver: number | null;
  onDragStart: (idx: number) => void;
  onDragEnter: (idx: number) => void;
  onDragEnd: () => void;
  onDrop: (idx: number) => void;
  filmGradient: (film: OnboardingFilm) => React.CSSProperties;
  pageTransition: (fn: () => void) => void;
  setPhase: (p: Phase) => void;
}

export default function ConfirmPhase({
  pillars, setPillars, lovedFilms, replacementCandidates,
  replacingPillar, setReplacingPillar, handleReplace,
  dragItem, dragOver, onDragStart, onDragEnter, onDragEnd, onDrop,
  filmGradient, pageTransition, setPhase,
}: ConfirmPhaseProps) {
  const pyramidReveal = useScrollReveal(0.15);

  const rows = [
    pillars.slice(0, 1),
    pillars.slice(1, 3),
    pillars.slice(3, 6),
  ].filter(r => r.length > 0);

  function handlePillarClick(idx: number) {
    setReplacingPillar(idx);
  }

  return (
    <div className="ob-confirm-scroll">
      {/* ─── Sezione A — Hero ─── */}
      <div className="ob-conf-hero">
        <h1 className="ob-conf-hero-title">
          Il tuo<br /><em>profilo</em>
        </h1>
        <div className="ob-conf-hero-sub">
          scorri per scoprire i tuoi pilastri
        </div>
        <div className="ob-conf-scroll-arrow">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      {/* ─── Sezione B — Piramide ─── */}
      <div
        ref={pyramidReveal.ref}
        className={`ob-conf-section ${pyramidReveal.visible ? 'visible' : ''}`}
      >
        <div className="ob-pyr-header">
          <div>
            <h2 className="ob-pyr-title">I tuoi <em>pilastri</em></h2>
            <div className="ob-pyr-sub">Trascina per riordinare · click per sostituire</div>
          </div>
        </div>

        {pillars.length === 0 ? (
          <div className="ob-pyr-empty" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="ob-pyr-empty-title" style={{ fontFamily: 'var(--ob-serif)', fontSize: 'clamp(24px,5vw,40px)', fontWeight: 700, marginBottom: 12 }}>
              Nessun film <em style={{ fontStyle: 'italic', color: 'var(--ob-gold)', fontWeight: 300 }}>amato</em>
            </div>
            <div style={{ fontFamily: 'var(--ob-mono)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--ob-ink-faint)' }}>
              Torna indietro e seleziona<br />almeno un film che ti ha colpito.
            </div>
          </div>
        ) : (
          <div className="ob-pyramid">
            {rows.map((row, rowIdx) => (
              <div key={rowIdx} className={`ob-pyr-row row-${rowIdx}`}>
                {row.map((film) => {
                  const globalIdx = pillars.indexOf(film);
                  return (
                    <div
                      key={film.id}
                      className={`ob-pyr-card ${dragItem === globalIdx ? "drag-src" : ""} ${dragOver === globalIdx ? "drag-tgt" : ""}`}
                      data-rank={globalIdx}
                      draggable
                      onDragStart={() => onDragStart(globalIdx)}
                      onDragEnter={() => onDragEnter(globalIdx)}
                      onDragEnd={onDragEnd}
                      onDragOver={e => e.preventDefault()}
                      onDrop={() => onDrop(globalIdx)}
                      onClick={() => handlePillarClick(globalIdx)}
                    >
                      <div className="ob-pyr-rank-lbl">
                        {globalIdx === 0 ? "▲ vertice" : `n° ${globalIdx + 1}`}
                      </div>
                      <div className="ob-pyr-poster">
                        <div className="ob-pyr-poster-inner" style={filmGradient(film)}>
                          <span className="ob-pyr-poster-title">{film.title}</span>
                        </div>
                      </div>
                      <div className="ob-pyr-name">{film.title}</div>
                      <div className="ob-pyr-meta">{film.director} · {film.year}</div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Replace Modal (overlay) ─── */}
      {replacingPillar !== null && (
        <div className="ob-rep-overlay" onClick={() => setReplacingPillar(null)}>
          <div className="ob-rep-modal" onClick={e => e.stopPropagation()}>
            <div className="ob-rep-modal-header">
              <div className="ob-rep-modal-title">Scegli il <em>sostituto</em></div>
              <button className="ob-rep-modal-close" onClick={() => setReplacingPillar(null)}>✕</button>
            </div>
            <div className="ob-rep-modal-grid">
              {replacementCandidates.length === 0
                ? <p style={{ fontFamily: 'var(--ob-mono)', fontSize: '10px', color: 'var(--ob-ink-faint)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Nessun candidato disponibile</p>
                : replacementCandidates.map(film => (
                  <div key={film.id} className="ob-rep-modal-card" onClick={() => handleReplace(replacingPillar, film)}>
                    <div className="ob-rep-modal-poster" style={filmGradient(film)}>
                      <span>{film.title}</span>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )}

      {/* ─── Footer — Prosegui centrato ─── */}
      <div className="ob-conf-footer-section">
        <div className="ob-pyr-foot">
          <div className="ob-pyr-count">
            {pillars.length} {pillars.length === 1 ? "pilastro" : "pilastri"} selezionati
          </div>
          <button className="ob-btn-p" onClick={() => pageTransition(() => setPhase("streaming"))}>
            Prosegui →
          </button>
        </div>
      </div>
    </div>
  );
}

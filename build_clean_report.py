#!/usr/bin/env python3
"""Build EMSICollab PDF report from scratch using Chrome headless.
Generates docs/CONCEPTION_ET_METHODOLOGIE.pdf with:
  - EMSI logo on cover page
  - Use Case diagram split into 3 clear parts (each on its own page)
  - Class diagram split into 3 clear parts (each on its own page)
  - Sequence diagrams (6 scenarios, one per page)
  - Proper styling, margins and spacing throughout
"""
import subprocess, os, base64

def img_b64(path):
    """Return base64 data URI for an image file."""
    if not os.path.exists(path):
        return ""
    ext = path.split('.')[-1].lower()
    mime = 'image/jpeg' if ext in ('jpg','jpeg') else 'image/png'
    with open(path, 'rb') as f:
        data = base64.b64encode(f.read()).decode()
    return f"data:{mime};base64,{data}"

# Embed all images as base64 so Chrome can render them from an HTML string
logo       = img_b64('docs/images/emsi_logo.jpg')
gantt      = img_b64('docs/images/gantt_planning.png')
uc_p1      = img_b64('docs/images/use_case_part1.jpg')
uc_p2      = img_b64('docs/images/use_case_part2.jpg')
uc_p3      = img_b64('docs/images/use_case_part3.jpg')
seq1       = img_b64('docs/images/sequence_01_auth_radar.jpg')
seq2       = img_b64('docs/images/sequence_02_publish_project_pdf.jpg')
seq3       = img_b64('docs/images/sequence_03_team_matching_veto.jpg')
seq4       = img_b64('docs/images/sequence_04_project_chatroom.jpg')
seq5       = img_b64('docs/images/sequence_05_milestones_checkboxes.jpg')
seq6       = img_b64('docs/images/sequence_06_meetings_google_meet.jpg')
cls_p1     = img_b64('docs/images/class_part1.jpg')
cls_p2     = img_b64('docs/images/class_part2.jpg')
cls_p3     = img_b64('docs/images/class_part3.jpg')

html = f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>EMSICollab - Conception & Méthodologie</title>
<style>
  /* ===== Page & Base ===== */
  @page {{
    size: A4 portrait;
    margin: 20mm 18mm 20mm 18mm;
  }}
  @page landscape {{
    size: A4 landscape;
    margin: 15mm 12mm 15mm 12mm;
  }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 10.5pt;
    color: #212529;
    line-height: 1.55;
    background: #fff;
  }}

  /* ===== Page breaks ===== */
  .page-break {{ page-break-after: always; }}
  .no-break {{ page-break-inside: avoid; }}

  /* ===== Cover ===== */
  .cover {{
    page-break-after: always;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 250mm;
    text-align: center;
    padding: 20mm 10mm;
  }}
  .cover img.logo {{
    height: 60px;
    margin-bottom: 12px;
  }}
  .cover .institution {{
    font-size: 13pt;
    font-weight: 700;
    color: #004d33;
    margin-bottom: 4px;
  }}
  .cover .filiere {{
    font-size: 10pt;
    color: #555;
    margin-bottom: 30px;
  }}
  .cover hr.thick {{
    width: 100%;
    border: none;
    border-top: 2.5px solid #004d33;
    margin-bottom: 24px;
  }}
  .cover .title-main {{
    font-size: 30pt;
    font-weight: 900;
    color: #004d33;
    margin-bottom: 10px;
  }}
  .cover .title-sub {{
    font-size: 13pt;
    font-weight: 600;
    color: #184c78;
    margin-bottom: 24px;
    max-width: 540px;
  }}
  .cover hr.thick2 {{
    width: 100%;
    border: none;
    border-top: 2.5px solid #004d33;
    margin-bottom: 30px;
  }}
  .cover .report-type {{
    font-size: 11pt;
    font-weight: 600;
    color: #333;
    margin-bottom: 50px;
  }}
  .cover .meta-row {{
    display: flex;
    justify-content: space-between;
    width: 100%;
    font-size: 10pt;
    margin-top: auto;
  }}
  .cover .meta-left {{ text-align: left; }}
  .cover .meta-right {{ text-align: right; }}
  .cover .meta-row strong {{ color: #004d33; }}
  .cover .year {{
    font-size: 11pt;
    color: #333;
    margin-top: 30px;
  }}

  /* ===== TOC ===== */
  .toc {{ page-break-after: always; padding: 10mm 0; }}
  .toc h2 {{
    font-size: 15pt; color: #004d33; font-weight: 800;
    border-bottom: 2px solid #004d33; padding-bottom: 8px; margin-bottom: 20px;
  }}
  .toc-item-h1 {{
    display: flex; justify-content: space-between;
    font-size: 11pt; font-weight: 700; color: #004d33;
    padding: 7px 0 4px 0; border-top: 1px solid #e0e0e0; margin-top: 10px;
  }}
  .toc-item-h2 {{
    display: flex; justify-content: space-between;
    font-size: 10pt; font-weight: 600; color: #184c78;
    padding: 4px 0 2px 16px;
  }}
  .toc-item-h3 {{
    display: flex; justify-content: space-between;
    font-size: 9.5pt; font-weight: 400; color: #444;
    padding: 2px 0 2px 32px;
  }}
  .toc-item-h1 span:last-child,
  .toc-item-h2 span:last-child,
  .toc-item-h3 span:last-child {{
    font-weight: 600; color: #004d33; white-space: nowrap; margin-left: 12px;
  }}

  /* ===== Section headers ===== */
  .section-header {{
    page-break-before: always;
    padding: 10px 0 8px 0;
    border-bottom: 2.5px solid #004d33;
    margin-bottom: 20px;
  }}
  .section-header h1 {{
    font-size: 17pt; font-weight: 800; color: #004d33;
  }}
  .section-header .subtitle {{
    font-size: 10pt; color: #666; margin-top: 3px;
  }}

  h2 {{
    font-size: 13pt; font-weight: 700; color: #184c78;
    margin-top: 20px; margin-bottom: 10px;
    border-left: 4px solid #184c78; padding-left: 10px;
  }}
  h3 {{
    font-size: 11.5pt; font-weight: 700; color: #212529;
    margin-top: 16px; margin-bottom: 8px;
  }}
  h4 {{
    font-size: 10.5pt; font-weight: 700; color: #004d33;
    margin-top: 12px; margin-bottom: 6px;
  }}

  p {{ margin-bottom: 8px; }}
  ul, ol {{ margin: 6px 0 10px 22px; }}
  li {{ margin-bottom: 4px; }}

  /* ===== Callout boxes ===== */
  .callout {{
    background: #f0f7f4;
    border: 1.5px solid #004d33;
    border-left: 5px solid #004d33;
    border-radius: 6px;
    padding: 12px 16px;
    margin: 14px 0;
    page-break-inside: avoid;
  }}
  .callout .callout-title {{
    font-size: 10pt; font-weight: 700; color: #004d33;
    margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;
  }}
  .callout p {{ margin: 3px 0; font-size: 10pt; }}

  .feature-box {{
    background: #f8f9fa;
    border: 1.5px solid #184c78;
    border-left: 5px solid #184c78;
    border-radius: 6px;
    padding: 12px 16px;
    margin: 10px 0;
    page-break-inside: avoid;
  }}
  .feature-box .fb-title {{
    font-size: 10pt; font-weight: 700; color: #184c78;
    margin-bottom: 6px;
  }}

  /* ===== Diagram containers ===== */
  .diagram-page {{
    page-break-before: always;
    padding: 6mm 0;
  }}
  .diagram-container {{
    text-align: center;
    margin: 12px 0;
    page-break-inside: avoid;
  }}
  .diagram-container img {{
    max-width: 100%;
    max-height: 185mm;
    width: auto;
    height: auto;
    border: 1.5px solid #cde3d6;
    border-radius: 6px;
    display: block;
    margin: 0 auto;
  }}
  .diagram-container img.landscape-img {{
    max-width: 100%;
    max-height: 155mm;
  }}
  .fig-caption {{
    font-size: 9pt;
    color: #555;
    text-align: center;
    margin-top: 6px;
    font-style: italic;
  }}

  /* ===== Table ===== */
  table {{
    width: 100%;
    border-collapse: collapse;
    font-size: 9pt;
    margin: 12px 0;
    page-break-inside: avoid;
  }}
  th {{
    background: #004d33;
    color: #fff;
    padding: 7px 8px;
    text-align: left;
    font-weight: 700;
  }}
  td {{
    padding: 6px 8px;
    border-bottom: 1px solid #e0e0e0;
    vertical-align: top;
  }}
  tr:nth-child(even) td {{ background: #f5f8f6; }}
  .check {{ color: #004d33; font-weight: 700; }}
  .cross {{ color: #c0392b; }}
  .partial {{ color: #e67e22; }}

  /* ===== Footer ===== */
  .footer-note {{
    font-size: 8pt; color: #999; text-align: center;
    margin-top: 20px; border-top: 1px solid #e0e0e0; padding-top: 8px;
  }}

  /* ===== Badges ===== */
  .badge {{
    display: inline-block; background: #004d33; color: #fff;
    font-size: 8.5pt; font-weight: 700; padding: 2px 8px;
    border-radius: 10px; margin-right: 6px; vertical-align: middle;
  }}
  .badge-blue {{
    background: #184c78;
  }}

  /* ===== Partie separator ===== */
  .part-label {{
    background: linear-gradient(135deg, #004d33, #006644);
    color: #fff;
    font-size: 11pt;
    font-weight: 700;
    padding: 10px 18px;
    border-radius: 6px;
    margin-bottom: 14px;
    display: block;
    page-break-inside: avoid;
  }}
</style>
</head>
<body>

<!-- ============================================================ -->
<!--  COVER PAGE                                                   -->
<!-- ============================================================ -->
<div class="cover">
  {'<img class="logo" src="' + logo + '" alt="EMSI Logo" />' if logo else ''}
  <div class="institution">ÉCOLE MAROCAINE DES SCIENCES DE L'INGÉNIEUR</div>
  <div class="filiere">Filière Ingénierie Informatique et Réseaux (IIR)</div>
  <hr class="thick" />
  <div class="title-main">EMSICollab</div>
  <div class="title-sub">Plateforme Microservices Intelligente de Gestion de Projets Académiques, Matching de Compétences &amp; Espaces Collaboratifs</div>
  <hr class="thick2" />
  <div class="report-type">Rapport de Cadre Général, Méthodologie Agile &amp; Modélisation UML Détaillée</div>
  <div class="meta-row">
    <div class="meta-left">
      <strong>Réalisé par :</strong><br>
      Hamza ARHRID &amp; Issam BOUFFA<br>
      Élèves-Ingénieurs en Informatique
    </div>
    <div class="meta-right">
      <strong>Sous la direction de :</strong><br>
      Corps Professoral EMSI<br>
      Département d'Ingénierie Logicielle
    </div>
  </div>
  <div class="year">Année Universitaire : 2026 — 2027 &nbsp;|&nbsp; Version 2.0</div>
</div>

<!-- ============================================================ -->
<!--  TABLE DES MATIÈRES                                           -->
<!-- ============================================================ -->
<div class="toc">
  <h2>📑 Table des Matières</h2>

  <div class="toc-item-h1"><span>I) Cadre Général &amp; Méthodologie</span><span>Page 3</span></div>
  <div class="toc-item-h2"><span>1. Analyse de l'Existant &amp; Benchmarking</span><span>Page 3</span></div>
  <div class="toc-item-h3"><span>1.1 Étude Comparative (Trello, Jira, GitHub, Classroom, Zoom vs EMSICollab)</span><span>Page 3</span></div>
  <div class="toc-item-h3"><span>1.2 Synthèse des Limites &amp; Valeurs Ajoutées</span><span>Page 4</span></div>
  <div class="toc-item-h2"><span>2. Méthodologie Agile (Scrum / Scrumban)</span><span>Page 4</span></div>
  <div class="toc-item-h3"><span>2.1 Rôles, Artefacts &amp; Cérémonies Scrum</span><span>Page 4</span></div>
  <div class="toc-item-h3"><span>2.2 Choix Scrumban vs Kanban</span><span>Page 5</span></div>
  <div class="toc-item-h2"><span>3. Planning Prévisionnel &amp; Diagramme de Gantt</span><span>Page 5</span></div>

  <div class="toc-item-h1" style="margin-top:14px"><span>II) Analyse et Conception du Projet (Modélisation UML)</span><span>Page 6</span></div>
  <div class="toc-item-h2"><span>1. Diagrammes des Cas d'Utilisation (Use Case — 3 Parties)</span><span>Page 6</span></div>
  <div class="toc-item-h3"><span>1.1 Identification des Acteurs</span><span>Page 6</span></div>
  <div class="toc-item-h3"><span>1.2 Partie 1 : Sécurité, Authentification &amp; Profils</span><span>Page 7</span></div>
  <div class="toc-item-h3"><span>1.3 Partie 2 : Sujets PFE, Cahier des Charges PDF &amp; Matching</span><span>Page 8</span></div>
  <div class="toc-item-h3"><span>1.4 Partie 3 : Suivi d'Avancement, Google Meet &amp; Collaboration</span><span>Page 9</span></div>
  <div class="toc-item-h2"><span>2. Diagrammes de Séquence (6 Scénarios)</span><span>Page 10</span></div>
  <div class="toc-item-h3"><span>2.1 Scénario 1 : Authentification JWT &amp; Radar de Compétences</span><span>Page 10</span></div>
  <div class="toc-item-h3"><span>2.2 Scénario 2 : Publication de Sujet &amp; Cahier des Charges PDF</span><span>Page 11</span></div>
  <div class="toc-item-h3"><span>2.3 Scénario 3 : Constitution d'Équipe &amp; Matching avec Veto</span><span>Page 12</span></div>
  <div class="toc-item-h3"><span>2.4 Scénario 4 : Chatroom de Projet Temps Réel</span><span>Page 13</span></div>
  <div class="toc-item-h3"><span>2.5 Scénario 5 : Validation d'Étape par Checkbox &amp; Progression</span><span>Page 14</span></div>
  <div class="toc-item-h3"><span>2.6 Scénario 6 : Planification de Réunion &amp; Google Meet</span><span>Page 15</span></div>
  <div class="toc-item-h2"><span>3. Diagramme de Classes (3 Parties — Bounded Contexts)</span><span>Page 16</span></div>
  <div class="toc-item-h3"><span>3.1 Partie 1 : Sécurité, Utilisateurs &amp; Compétences (auth-service)</span><span>Page 16</span></div>
  <div class="toc-item-h3"><span>3.2 Partie 2 : Sujets, Jalons &amp; Réunions Meet (project-service)</span><span>Page 17</span></div>
  <div class="toc-item-h3"><span>3.3 Partie 3 : Matching d'Équipe &amp; Collaboration (team-matching &amp; chat)</span><span>Page 18</span></div>
  <div class="toc-item-h3"><span>3.4 Dictionnaire des Classes et Responsabilités</span><span>Page 19</span></div>
  <div class="toc-item-h1" style="margin-top:14px"><span>Conclusion &amp; Perspectives</span><span>Page 20</span></div>
</div>

<!-- ============================================================ -->
<!--  PARTIE I : CADRE GÉNÉRAL & MÉTHODOLOGIE                      -->
<!-- ============================================================ -->
<div class="section-header">
  <h1>I) Cadre Général &amp; Méthodologie</h1>
  <div class="subtitle">Analyse de l'existant, approche agile Scrumban et planification prévisionnelle des sprints</div>
</div>

<h2>1. Analyse de l'Existant &amp; Benchmarking</h2>
<p>Afin d'évaluer la pertinence de développer une plateforme dédiée, nous avons conduit un benchmarking rigoureux sur six solutions représentatives : <strong>Trello</strong>, <strong>Jira Software</strong>, <strong>GitHub Projects</strong>, <strong>Google Classroom</strong>, <strong>Zoom</strong> et notre solution <strong>EMSICollab</strong>.</p>

<h3>1.1 Étude Comparative</h3>
<table>
  <tr>
    <th>Critère / Fonctionnalité</th>
    <th>Trello</th><th>Jira</th><th>GitHub</th><th>Classroom</th><th>Zoom</th>
    <th style="background:#006644">EMSICollab</th>
  </tr>
  <tr><td>Gestion PFE / Projets académiques</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="partial">Partiel</td><td class="cross">✗</td><td class="check">✓ Natif</td></tr>
  <tr><td>Profilage &amp; Radar de compétences</td><td class="cross">✗</td><td class="cross">✗</td><td class="partial">Partiel</td><td class="cross">✗</td><td class="cross">✗</td><td class="check">✓ Radar 1–5</td></tr>
  <tr><td>Algorithme de Matching pondéré</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="check">✓ Score wᵢ + Veto</td></tr>
  <tr><td>Recommandation PFE personnalisée</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="check">✓ Feed par affinité</td></tr>
  <tr><td>Cahier des Charges PDF officiel</td><td class="partial">Pièce jointe</td><td class="partial">Pièce jointe</td><td class="partial">Git repo</td><td class="partial">Drive</td><td class="cross">✗</td><td class="check">✓ Visionneuse intégrée</td></tr>
  <tr><td>Roadmap Checkboxes dynamique</td><td class="partial">Checklist statique</td><td class="partial">Sous-tâches</td><td class="partial">MD checkbox</td><td class="partial">Devoir</td><td class="cross">✗</td><td class="check">✓ Jalons + jauge %</td></tr>
  <tr><td>Chatroom Projet temps réel</td><td class="cross">✗</td><td class="cross">✗</td><td class="cross">✗</td><td class="partial">Flux classe</td><td class="partial">Team Chat</td><td class="check">✓ WebSocket STOMP</td></tr>
  <tr><td>Planification Réunion + Google Meet</td><td class="partial">Plugin payant</td><td class="partial">Plugin</td><td class="cross">✗</td><td class="partial">Meet général</td><td class="check">✓ Visio HD</td><td class="check">✓ Date fixe + 1 clic Meet</td></tr>
  <tr><td>Coût pour l'établissement</td><td class="partial">Freemium limité</td><td class="cross">Coûteux</td><td class="partial">Gratuit/Payant</td><td class="check">Google Edu</td><td class="cross">Par licence</td><td class="check">Open-source souverain</td></tr>
</table>

<h3>1.2 Synthèse des Limites &amp; Valeurs Ajoutées</h3>
<div class="callout">
  <div class="callout-title">🔍 Limites identifiées</div>
  <p>• Aucun outil généraliste ne propose un profilage structuré des compétences avec visualisation Radar.</p>
  <p>• Pas d'algorithme de matching mathématique équipe–sujet avec pondération et veto bloquant.</p>
  <p>• Communication fragmentée entre WhatsApp, Drive, Zoom et Moodle — aucune intégration unifiée.</p>
</div>
<div class="callout">
  <div class="callout-title">🚀 Valeurs Ajoutées EMSICollab</div>
  <p>• <strong>SkillMatchingEngine</strong> : Score pondéré (wᵢ) + veto bloquant si compétence obligatoire absente.</p>
  <p>• <strong>Feed personnalisé</strong> : Recommandation de sujets triés par score d'affinité de l'étudiant.</p>
  <p>• <strong>Recrutement prédictif</strong> : Suggestion du profil précis à recruter pour débloquer un veto.</p>
  <p>• <strong>Cahier des charges PDF natif</strong> avec visionneuse &amp; roadmap jalons checkboxes dynamiques.</p>
</div>

<div class="page-break"></div>
<h2>2. Méthodologie de Gestion de Projet Agile</h2>

<h3>2.1 Approche Scrum — Rôles, Artefacts &amp; Cérémonies</h3>
<div class="feature-box">
  <div class="fb-title">👥 Rôles Scrum</div>
  <p><strong>Product Owner (PO) :</strong> Hamza ARHRID — gère le Product Backlog, priorise les User Stories selon la valeur métier.</p>
  <p><strong>Scrum Master (SM) :</strong> Issam BOUFFA — facilite les cérémonies, lève les impediments et veille à la vélocité.</p>
  <p><strong>Équipe Dev :</strong> Hamza ARHRID &amp; Issam BOUFFA — conçoivent, développent, testent et livrent les incréments.</p>
</div>
<table>
  <tr><th>Artefact</th><th>Description</th></tr>
  <tr><td><strong>Product Backlog</strong></td><td>Liste priorisée des 48 User Stories couvrant les 5 microservices</td></tr>
  <tr><td><strong>Sprint Backlog</strong></td><td>Sélection des US pour le sprint en cours (velocity ≈ 15–20 pts/sprint)</td></tr>
  <tr><td><strong>Incrément</strong></td><td>Livrable fonctionnel à chaque fin de sprint, intégré et testé</td></tr>
  <tr><th>Cérémonie</th><th>Durée &amp; Objectif</th></tr>
  <tr><td><strong>Sprint Planning</strong></td><td>2h — sélectionner et estimer (Story Points) les US du sprint</td></tr>
  <tr><td><strong>Daily Scrum</strong></td><td>15 min — synchronisation quotidienne : hier / aujourd'hui / impediments</td></tr>
  <tr><td><strong>Sprint Review</strong></td><td>1h — démo de l'incrément aux encadrants, collecte du feedback</td></tr>
  <tr><td><strong>Rétrospective</strong></td><td>45 min — amélioration continue : Start / Stop / Continue</td></tr>
</table>

<h3>2.2 Scrum vs Kanban — Choix de Scrumban</h3>
<p>Nous avons adopté une approche <strong>Scrumban</strong> (hybride Scrum + Kanban) : sprints de 2 semaines structurés avec tableau Kanban à 4 colonnes (<em>Backlog → In Progress → Review → Done</em>) visible sur GitHub Projects. Ce compromis offre la discipline des sprints Scrum et la flexibilité du flux Kanban pour les tâches de correction continue.</p>

<div class="page-break"></div>
<h2>3. Planning Prévisionnel &amp; Diagramme de Gantt</h2>
<p>Le projet est découpé en <strong>6 sprints académiques</strong> de 2 semaines chacun, de septembre 2026 à janvier 2027, avec 5 jalons validés par les encadrants.</p>

<div class="diagram-container">
  {'<img src="' + gantt + '" alt="Diagramme de Gantt" />' if gantt else '<p><em>Gantt non disponible</em></p>'}
  <div class="fig-caption">Figure — Planning Prévisionnel EMSICollab : Sprints &amp; Jalons Académiques (Sep 2026 — Jan 2027)</div>
</div>

<!-- ============================================================ -->
<!--  PARTIE II : ANALYSE & CONCEPTION UML                         -->
<!-- ============================================================ -->
<div class="section-header">
  <h1>II) Analyse et Conception du Projet (Modélisation UML)</h1>
  <div class="subtitle">Use Case Diagrams · Sequence Diagrams · Class Diagrams (Bounded Contexts)</div>
</div>

<!-- ==================== USE CASE ==================== -->
<h2>1. Diagrammes des Cas d'Utilisation (Use Case — 3 Parties)</h2>

<h3>1.1 Identification des Acteurs Système</h3>
<ul>
  <li><strong>🎓 Étudiant (STUDENT) :</strong> S'authentifie, déclare ses compétences (1–5), explore le catalogue, forme une équipe, simule son matching, coche les jalons et rejoint les réunions Google Meet.</li>
  <li><strong>👨‍🏫 Professeur Encadrant (PROFESSOR) :</strong> Publie les sujets PFE, joint le PDF du cahier des charges, définit les exigences pondérées (wᵢ) et vetos, valide les équipes et planifie les réunions de suivi.</li>
  <li><strong>🛡️ Administrateur (ADMIN) :</strong> Gère les comptes, importe les promotions CSV, maintient le référentiel des compétences, surveille l'état des microservices.</li>
  <li><strong>⚙️ Moteur Algorithmique (Système) :</strong> Évalue les scores d'adéquation, applique les règles de veto bloquantes et recalcule la progression globale (%).</li>
</ul>

<!-- ===== USE CASE PARTIE 1 ===== -->
<div class="diagram-page">
  <span class="part-label">📌 Use Case — Partie 1 : Sécurité, Authentification &amp; Profils de Compétences</span>
  <div class="callout">
    <div class="callout-title">Packages couverts</div>
    <p><strong>Package 1 :</strong> Authentification JWT (HMAC-SHA256), gestion du profil utilisateur, déclaration des compétences (niveau 1–5), visualisation du Radar Chart d'expertise, importation CSV des promotions.</p>
    <p><strong>Acteurs :</strong> Étudiant · Professeur · Administrateur</p>
  </div>
  <div class="diagram-container">
    {'<img src="' + uc_p1 + '" alt="Use Case Partie 1" />' if uc_p1 else '<p><em>Image non disponible</em></p>'}
    <div class="fig-caption">Figure 1.1 — Use Case Partie 1 : Sécurité, Authentification &amp; Profils de Compétences</div>
  </div>
</div>

<!-- ===== USE CASE PARTIE 2 ===== -->
<div class="diagram-page">
  <span class="part-label">📌 Use Case — Partie 2 : Sujets PFE, Cahier des Charges PDF &amp; Matching d'Équipe</span>
  <div class="callout">
    <div class="callout-title">Packages couverts</div>
    <p><strong>Package 2 :</strong> Publication des sujets PFE, attachement du PDF officiel du cahier des charges, définition des exigences pondérées (wᵢ) et règles de veto bloquant.</p>
    <p><strong>Package 3 :</strong> Création d'équipe depuis le dashboard, ajout de membres, simulation algorithmique de compatibilité équipe–sujet, déclenchement du veto si compétence obligatoire manquante.</p>
    <p><strong>Acteurs :</strong> Étudiant · Professeur Encadrant · Moteur Algorithmique</p>
  </div>
  <div class="diagram-container">
    {'<img src="' + uc_p2 + '" alt="Use Case Partie 2" />' if uc_p2 else '<p><em>Image non disponible</em></p>'}
    <div class="fig-caption">Figure 1.2 — Use Case Partie 2 : Sujets PFE, Cahier des Charges PDF &amp; Matching d'Équipe</div>
  </div>
</div>

<!-- ===== USE CASE PARTIE 3 ===== -->
<div class="diagram-page">
  <span class="part-label">📌 Use Case — Partie 3 : Suivi d'Avancement, Google Meet &amp; Collaboration Temps Réel</span>
  <div class="callout">
    <div class="callout-title">Packages couverts</div>
    <p><strong>Package 4 :</strong> Configuration des jalons de roadmap par l'enseignant, validation par checkbox (isCompleted), recalcul instantané de la jauge de progression (%), planification de réunions à date/heure fixes avec lien Google Meet en 1 clic.</p>
    <p><strong>Packages 5 &amp; 6 :</strong> Chatroom de projet WebSocket STOMP, messagerie privée 1-à-1, administration des comptes et monitoring des microservices.</p>
    <p><strong>Acteurs :</strong> Étudiant · Professeur Encadrant · Administrateur</p>
  </div>
  <div class="diagram-container">
    {'<img src="' + uc_p3 + '" alt="Use Case Partie 3" />' if uc_p3 else '<p><em>Image non disponible</em></p>'}
    <div class="fig-caption">Figure 1.3 — Use Case Partie 3 : Suivi d'Avancement, Google Meet &amp; Collaboration</div>
  </div>
</div>

<!-- ==================== SEQUENCE DIAGRAMS ==================== -->
<div class="diagram-page">
  <h2>2. Diagrammes de Séquence Système (6 Scénarios)</h2>
  <p>Les 6 scénarios clés modélisent la chronologie des flux entre le client React SPA, l'API Gateway, les microservices Spring Boot et la couche de persistance PostgreSQL.</p>

  <h3>Scénario 1 — Authentification JWT, Profilage &amp; Radar de Compétences</h3>
  <p>Connexion de l'étudiant avec vérification du domaine <code>@emsi-edu.ma</code>, émission du token JWT signé HMAC-SHA256 et chargement du Radar Chart d'expertise.</p>
  <div class="diagram-container">
    {'<img class="landscape-img" src="' + seq1 + '" alt="Séquence 1" />' if seq1 else ''}
    <div class="fig-caption">Figure 2.1 — Authentification JWT, Profilage &amp; Radar de Compétences</div>
  </div>
</div>

<div class="diagram-page">
  <h3>Scénario 2 — Publication de Sujet &amp; Cahier des Charges PDF</h3>
  <p>Téléversement multipart du PDF officiel, persistance des exigences pondérées et émission d'un événement asynchrone sur le bus Kafka.</p>
  <div class="diagram-container">
    {'<img class="landscape-img" src="' + seq2 + '" alt="Séquence 2" />' if seq2 else ''}
    <div class="fig-caption">Figure 2.2 — Publication de Sujet &amp; Attachement du Cahier des Charges PDF</div>
  </div>
</div>

<div class="diagram-page">
  <h3>Scénario 3 — Constitution d'Équipe &amp; Matching avec Règle de Veto</h3>
  <p>Ajout d'un coéquipier, simulation de compatibilité face à un sujet, déclenchement immédiat de l'alerte Veto si compétence critique manquante.</p>
  <div class="diagram-container">
    {'<img class="landscape-img" src="' + seq3 + '" alt="Séquence 3" />' if seq3 else ''}
    <div class="fig-caption">Figure 2.3 — Constitution d'Équipe &amp; Simulation de Matching avec Règle de Veto</div>
  </div>
</div>

<div class="diagram-page">
  <h3>Scénario 4 — Collaboration en Chatroom de Projet (Icône Carte)</h3>
  <p>Handshake WebSocket STOMP, chargement de l'historique et diffusion instantanée des messages entre étudiants et encadrant.</p>
  <div class="diagram-container">
    {'<img class="landscape-img" src="' + seq4 + '" alt="Séquence 4" />' if seq4 else ''}
    <div class="fig-caption">Figure 2.4 — Échanges Temps Réel dans la Chatroom de Projet</div>
  </div>
</div>

<div class="diagram-page">
  <h3>Scénario 5 — Validation d'Étape par Checkbox &amp; Recalcul de Progression</h3>
  <p>Coche d'une étape, persistance avec horodatage et auteur, recalcul immédiat du pourcentage global et diffusion WebSocket temps réel.</p>
  <div class="diagram-container">
    {'<img class="landscape-img" src="' + seq5 + '" alt="Séquence 5" />' if seq5 else ''}
    <div class="fig-caption">Figure 2.5 — Validation d'Étape par Checkbox &amp; Recalcul de Progression</div>
  </div>
</div>

<div class="diagram-page">
  <h3>Scénario 6 — Planification de Réunion à Date Fixe &amp; Connexion Google Meet</h3>
  <p>L'enseignant programme la séance, l'étudiant voit le bandeau d'alerte 15 min avant et rejoint la visioconférence Google Meet en 1 clic.</p>
  <div class="diagram-container">
    {'<img class="landscape-img" src="' + seq6 + '" alt="Séquence 6" />' if seq6 else ''}
    <div class="fig-caption">Figure 2.6 — Planification de Réunion à Date Fixe &amp; Connexion Google Meet</div>
  </div>
</div>

<!-- ==================== CLASS DIAGRAMS ==================== -->
<div class="diagram-page">
  <h2>3. Diagramme de Classes du Domaine (3 Parties — Bounded Contexts)</h2>
  <p>En conformité avec le patron <strong>Database-per-Service</strong>, chaque microservice possède son propre schéma de base de données isolé. Le diagramme de classes est présenté en <strong>3 parties modulaires</strong> correspondant aux Bounded Contexts principaux.</p>
</div>

<!-- ===== CLASS PARTIE 1 ===== -->
<div class="diagram-page">
  <span class="part-label badge-blue" style="background:linear-gradient(135deg,#184c78,#2563a8)">🔵 Classes — Partie 1 : Sécurité, Utilisateurs &amp; Compétences (auth-service :8081)</span>
  <div class="callout" style="border-color:#184c78;border-left-color:#184c78;background:#f0f4f8">
    <div class="callout-title" style="color:#184c78">Bounded Context : auth-service</div>
    <p><strong>Entités :</strong> <code>User</code> · <code>Role</code> · <code>Skill</code> · <code>SkillCategory</code> · <code>UserSkill</code></p>
    <p><strong>Rôle :</strong> Administre l'identité cryptographique (JWT/RBAC), la matrice de compétences individuelles (niveau ∈ [1,5], années d'expérience) et génère le Radar Chart d'expertise multidimensionnel.</p>
  </div>
  <div class="diagram-container">
    {'<img src="' + cls_p1 + '" alt="Classes Partie 1" />' if cls_p1 else '<p><em>Image non disponible</em></p>'}
    <div class="fig-caption">Figure 3.1 — Classes Partie 1 : Sécurité, Utilisateurs &amp; Compétences (auth-service)</div>
  </div>
</div>

<!-- ===== CLASS PARTIE 2 ===== -->
<div class="diagram-page">
  <span class="part-label badge-blue" style="background:linear-gradient(135deg,#184c78,#2563a8)">🔵 Classes — Partie 2 : Sujets, Jalons &amp; Réunions Meet (project-service :8082)</span>
  <div class="callout" style="border-color:#184c78;border-left-color:#184c78;background:#f0f4f8">
    <div class="callout-title" style="color:#184c78">Bounded Context : project-service</div>
    <p><strong>Entités :</strong> <code>Project</code> · <code>ProjectStatus</code> · <code>ProjectRequirement</code> · <code>ProjectMilestone</code> · <code>ProjectMeeting</code> · <code>MeetingStatus</code></p>
    <p><strong>Rôle :</strong> Supervise le cycle de vie des projets, le PDF officiel du cahier des charges, les exigences pondérées (wᵢ), la roadmap ordonnée à cocher (isCompleted) et les séances de cadrage Google Meet.</p>
  </div>
  <div class="diagram-container">
    {'<img src="' + cls_p2 + '" alt="Classes Partie 2" />' if cls_p2 else '<p><em>Image non disponible</em></p>'}
    <div class="fig-caption">Figure 3.2 — Classes Partie 2 : Sujets, Jalons &amp; Réunions Google Meet (project-service)</div>
  </div>
</div>

<!-- ===== CLASS PARTIE 3 ===== -->
<div class="diagram-page">
  <span class="part-label badge-blue" style="background:linear-gradient(135deg,#184c78,#2563a8)">🔵 Classes — Partie 3 : Matching d'Équipe &amp; Collaboration (team-matching &amp; chat-service)</span>
  <div class="callout" style="border-color:#184c78;border-left-color:#184c78;background:#f0f4f8">
    <div class="callout-title" style="color:#184c78">Bounded Contexts : team-matching-service &amp; chat-service</div>
    <p><strong>Entités (matching) :</strong> <code>Team</code> · <code>TeamStatus</code> · <code>TeamMember</code> · <code>TeamRole</code> · <code>MatchingScore</code></p>
    <p><strong>Entités (chat) :</strong> <code>ProjectChatMessage</code> · <code>PrivateMessage</code></p>
    <p><strong>Rôle :</strong> Calcule le score d'adéquation pondéré, applique la clause d'exclusion veto (isMandatory=true) et assure la persistance des messages WebSocket STOMP en chatroom et messagerie privée.</p>
  </div>
  <div class="diagram-container">
    {'<img src="' + cls_p3 + '" alt="Classes Partie 3" />' if cls_p3 else '<p><em>Image non disponible</em></p>'}
    <div class="fig-caption">Figure 3.3 — Classes Partie 3 : Matching d'Équipe &amp; Collaboration (team-matching &amp; chat-service)</div>
  </div>
</div>

<!-- ===== DICTIONNAIRE DES CLASSES ===== -->
<div class="diagram-page">
  <h3>3.4 Dictionnaire des Classes et Responsabilités</h3>
  <table>
    <tr><th>Entité Métier</th><th>Microservice</th><th>Responsabilité Principale</th></tr>
    <tr><td><code>User</code></td><td>auth-service</td><td>Représente tout acteur (Étudiant, Professeur, Admin) avec identifiants et profil biographique.</td></tr>
    <tr><td><code>Skill</code></td><td>auth-service</td><td>Compétence technique normalisée (Spring, React, Docker) rattachée à une catégorie d'ingénierie.</td></tr>
    <tr><td><code>UserSkill</code></td><td>auth-service</td><td>Association qualifiant le niveau (1–5) et les années d'expérience de l'étudiant sur une compétence.</td></tr>
    <tr><td><code>Project</code></td><td>project-service</td><td>Sujet PFE publié par l'enseignant avec contraintes d'effectif et cahier des charges PDF.</td></tr>
    <tr><td><code>ProjectRequirement</code></td><td>project-service</td><td>Exigence technique caractérisée par un niveau minimal, un poids wᵢ et un indicateur veto.</td></tr>
    <tr><td><code>ProjectMilestone</code></td><td>project-service</td><td>Étape de roadmap avec checkbox (isCompleted), horodatage et auteur de validation.</td></tr>
    <tr><td><code>ProjectMeeting</code></td><td>project-service</td><td>Rendez-vous de suivi planifié à date fixe avec lien Google Meet direct.</td></tr>
    <tr><td><code>Team</code></td><td>team-matching</td><td>Équipe d'étudiants constituée depuis le dashboard pour candidater à un projet.</td></tr>
    <tr><td><code>TeamMember</code></td><td>team-matching</td><td>Appartenance d'un élève-ingénieur à une équipe avec rôle (LEADER ou MEMBER).</td></tr>
    <tr><td><code>MatchingScore</code></td><td>team-matching</td><td>Résultat de l'évaluation algorithmique : score global %, label (EXCELLENT/GOOD/BLOCKED) et veto.</td></tr>
    <tr><td><code>ProjectChatMessage</code></td><td>chat-service</td><td>Message diffusé en WebSocket STOMP dans la chatroom dédiée de la carte projet.</td></tr>
    <tr><td><code>PrivateMessage</code></td><td>chat-service</td><td>Message textuel instantané confidentiel échangé en 1-à-1 entre deux utilisateurs.</td></tr>
  </table>
</div>

<!-- ============================================================ -->
<!--  CONCLUSION                                                    -->
<!-- ============================================================ -->
<div class="section-header">
  <h1>Conclusion &amp; Perspectives</h1>
</div>
<p>Ce rapport a posé les fondations architecturales et méthodologiques d'<strong>EMSICollab</strong>, une plateforme microservices innovante répondant aux carences structurelles identifiées dans les outils existants (Trello, Jira, GitHub Projects, Google Classroom, Zoom).</p>
<p>La modélisation UML détaillée — Use Cases en 3 parties, 6 diagrammes de séquence et Classes en 3 Bounded Contexts — démontre la cohérence et la maturité de la conception. L'architecture <strong>Database-per-Service</strong> garantit l'isolation transactionnelle et la scalabilité horizontale de chaque microservice.</p>
<div class="callout">
  <div class="callout-title">🔭 Perspectives de développement</div>
  <p>• <strong>Sprint 4 :</strong> Déploiement du serveur WebSocket STOMP et de la chatroom de projet temps réel.</p>
  <p>• <strong>Sprint 5 :</strong> Tests de charge (JMeter), tests E2E (Cypress), monitoring Spring Boot Actuator.</p>
  <p>• <strong>Soutenance finale :</strong> Janvier 2027 — livraison de la plateforme complète devant le jury EMSI.</p>
</div>

<div class="footer-note">
  EMSICollab — Hamza ARHRID &amp; Issam BOUFFA — EMSI 2026/2027 · Rapport Conception &amp; Méthodologie v2.0
</div>

</body>
</html>"""

# Write the HTML file
html_path = '/tmp/emsi_report_final.html'
with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
print(f"HTML written to {html_path} ({os.path.getsize(html_path)//1024} KB)")

# Generate PDF with Chrome headless
out_pdf = 'docs/CONCEPTION_ET_METHODOLOGIE.pdf'
cmd = [
    'google-chrome',
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--run-all-compositor-stages-before-draw',
    '--virtual-time-budget=5000',
    f'--print-to-pdf={os.path.abspath(out_pdf)}',
    '--print-to-pdf-no-header',
    html_path
]
print("Running Chrome headless PDF generation...")
res = subprocess.run(cmd, capture_output=True, text=True)
print('Exit code:', res.returncode)
if res.stderr:
    print('Stderr:', res.stderr[:300])

# Check result
if os.path.exists(out_pdf):
    size = os.path.getsize(out_pdf)
    print(f"✅ PDF generated: {out_pdf} ({size//1024} KB)")
    # Page count
    info = subprocess.run(['pdfinfo', out_pdf], capture_output=True, text=True)
    for line in info.stdout.splitlines():
        if 'Pages' in line:
            print('📄', line)
else:
    print('❌ PDF not generated!')

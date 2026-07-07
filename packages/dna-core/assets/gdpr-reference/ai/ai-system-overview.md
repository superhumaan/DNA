# AI System Overview

_UK GDPR required document template. Replace all [placeholders] with your organisation details before publication._

**Source:** `AI-Specific Documentation/AI System Overview.docx`

---

AI System Overview

## Uk Gdpr

System description

Components

Azure OpenAI resource (UK South): GPT-4o deployment ([ai-deployment]), Whisper (speech-to-text).

[Company Name] API tier orchestrates calls via private endpoint and Managed Identity.

[Product Name] is a workspace and productivity platform. It is not a medical device, clinical system, or regulated health record. Users must not rely on [Product Name] for diagnosis, treatment, or clinical decision-making. AI outputs are assistive drafts only.

Features

Feature

Model

Input

Output persisted

Summarise note

GPT-4o

Note body

Summary if user accepts

Transcription

Whisper

Audio stream

Transcript + Blob audio

Entity extraction

GPT-4o

Note body

Structured entities async

Slash commands

GPT-4o

Note + command

User-controlled

Search rank

GPT-4o

Query + snippets

No — ephemeral

_Template — customize confidentiality and ownership statements for your organisation before distribution._

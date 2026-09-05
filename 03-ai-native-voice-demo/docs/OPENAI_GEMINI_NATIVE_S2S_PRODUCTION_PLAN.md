# Agio CX AI — Native Speech-to-Speech Production and Benchmark Plan

**Document status:** Implementation-ready architecture plan  
**Scope owner:** AgioSummit, a Roverax.ai product initiative  
**Primary environment:** Private Production Prototype  
**Prepared:** 2026-07-27  
**Target routes:** OpenAI Realtime and Gemini Live  
**Benchmark cohort:** 100 enterprise communication scenarios × 2 routes  
**Maximum paid route-cases:** 200  
**Hard benchmark budget:** USD 100  

---

## 1. Executive decision

Agio will compare OpenAI and Gemini as true native speech-to-speech systems under the same controlled architecture.

The benchmark will not compare:

- OpenAI native audio against Gemini text-to-audio;
- a persistent OpenAI session against a new Gemini connection per turn;
- one provider receiving live audio while another receives text;
- one provider streaming audio while another waits for a complete WAV file;
- one provider against a cascading STT → text LLM → TTS pipeline;
- two systems using different caller scripts, voices, turn boundaries, context, tools, or judge criteria.

The production design is:

1. A provider-neutral, deterministic Human Caller Agent supplies the same sealed audio artifact to both routes.
2. The selected provider controls only the AI Front Desk.
3. OpenAI receives caller audio over a persistent browser WebRTC session.
4. Gemini receives the same caller audio over a persistent browser WebSocket Live session.
5. Both providers stream response audio directly into a small playback jitter buffer.
6. Every transport, audio, tool, latency, usage, cost, and judge event is written to an append-only evidence ledger.
7. A separate Claude judge evaluates the completed interaction after the live session ends.
8. No learning is promoted into the production context graph during the paired benchmark cohort.
9. Postgres remains authoritative. Zep receives only ordered, evidence-linked learning candidates after judgment and promotion review.

This design preserves the product proposition: the Context Arena resolves and verifies the minimum sufficient context before the Voice Arena acts, so the customer is not forced to repeat the journey or discover at the end that the agent lacks the information or authority to help.

---

## 2. Current-state audit

### 2.1 What is already correct

- The UI exposes OpenAI and Gemini as the two active benchmark routes.
- ElevenLabs and Gradium remain visible for research context but are unavailable for the controlled native-S2S benchmark.
- The model catalog has a single default live route and an explicit active-route list.
- The benchmark manifest already enforces:
  - exactly 100 scenarios;
  - exactly 2 active routes;
  - exactly 200 route-cases;
  - a USD 100 budget cap;
  - no paid calls by default.
- The product distinguishes the Human Caller Agent from the AI Front Desk.
- Postgres is intended to remain the system of record.
- The product already has the foundations of an evidence ledger, context graph, run traces, metrics, and an improvement workbench.

### 2.2 OpenAI architectural gap

The current OpenAI route establishes a Realtime/WebRTC session, but the tested turn is injected as a Realtime `input_text` conversation item.

That means the model may return streamed speech, but the input side is not a native audio benchmark. The route does not yet measure how OpenAI hears, interprets, and responds to the same caller audio supplied to Gemini.

### 2.3 Gemini architectural gap

The current Gemini implementation:

1. opens a server-side Live connection for a turn;
2. sends text content;
3. collects all PCM output chunks;
4. waits for `turnComplete`;
5. concatenates the complete PCM response;
6. converts it into a WAV/base64 response;
7. sends the completed file to the browser;
8. closes the Live session.

Although the selected Gemini model is a native audio model, this application path behaves like a buffered request/response adapter. It is not a persistent, low-latency, audio-in/audio-out Live session.

### 2.4 Consequence

The existing timing comparison is not apples-to-apples. OpenAI currently benefits from browser WebRTC streaming, while Gemini pays for:

- a server round trip;
- a new connection;
- text input;
- complete response accumulation;
- PCM concatenation;
- WAV construction;
- base64 encoding;
- JSON transfer;
- complete-file playback.

No model-quality or latency conclusion should be promoted from that mismatch.

---

## 3. Product contract

### 3.1 Context Arena

Before the voice interaction begins, the Context Arena must construct a verified continuity packet containing the minimum information required for a safe next action.

The packet may include:

- caller identity and relationship;
- bounded intent;
- relevant history;
- current state;
- policy and eligibility constraints;
- operational limits;
- access permissions;
- verified evidence;
- available tools and actions;
- time sensitivity;
- risk classification;
- escalation condition;
- facts that remain unknown.

The Context Arena must not invent missing information. An unknown remains explicitly unknown.

### 3.2 Continuity Bridge

The Continuity Bridge seals the handoff contract from Context Arena to Voice Arena.

The sealed packet must have:

- a stable packet ID;
- a content hash;
- a schema version;
- a source/evidence map;
- an issued timestamp;
- an expiry or freshness policy;
- an allowed-action set;
- an escalation policy;
- a graph version;
- a prompt/instruction version.

The same packet must be installed into both providers for the paired scenario.

### 3.3 Voice Arena

The Voice Arena must:

- understand the caller’s speech;
- preserve the established context;
- avoid asking for facts already verified;
- request only genuinely missing information;
- execute or propose a safe next action;
- avoid unsupported claims;
- state limitations precisely;
- escalate only when required;
- reach a resolved or explicitly safe-routed terminal state.

Recommended label:

> **Voice Arena — context understood, action underway**

This is clearer than “path grounded,” because grounding is an evidence property while the Voice Arena is the active execution stage.

### 3.4 Coherence

Coherence is achieved only when:

- the response remains consistent with the continuity packet;
- the action is supported by evidence and policy;
- the customer’s bounded intent is resolved or safely routed;
- no established fact is contradicted;
- no unnecessary repetition or dead-end transfer is introduced.

Recommended label:

> **Coherence — resolution verified**

The center product statement remains:

> **Convergence is the product.**

---

## 4. Controlled benchmark contract

### 4.1 Unit of comparison

The unit of comparison is one **paired scenario**:

- one scenario definition;
- one continuity packet;
- one sealed caller-audio sequence;
- one tool fixture set;
- one policy fixture set;
- one evaluation rubric;
- two route executions: OpenAI and Gemini.

### 4.2 Provider under test

The provider under test controls only the AI Front Desk.

The Human Caller Agent is not generated by the provider under test. Otherwise the provider would influence both the question and the answer, creating an invalid comparison.

### 4.3 Sealed caller audio

Every benchmark caller turn must be pre-generated, normalized, versioned, and sealed.

Each artifact records:

- scenario ID;
- caller-turn ordinal;
- transcript;
- voice identity;
- speaker role;
- sample rate;
- channel count;
- bit depth;
- duration;
- loudness normalization;
- leading/trailing silence policy;
- content hash;
- artifact version;
- generation provenance;
- creation cost, recorded separately from route cost.

Both providers receive the same decoded source artifact. Provider-specific transport conversion is allowed only where required by the official protocol.

### 4.4 Human Caller Agent role

The Human Caller Agent always speaks as the customer or authorized caller.

It must never:

- act like the contact-center agent;
- give itself operational instructions;
- ask itself diagnostic questions;
- promise actions that belong to the AI Front Desk;
- reveal judge criteria;
- contain provider-specific wording.

### 4.5 Multi-turn caller state machine

A multi-turn benchmark cannot allow either tested provider to improvise the caller’s later turns.

Each scenario must define a deterministic caller state machine:

- initial caller statement;
- expected response categories;
- approved follow-up branch for each category;
- maximum caller turns;
- terminal conditions;
- invalid/unclassifiable response handling.

Two implementation stages are required:

#### Stage A — single-turn transport canary

One sealed caller utterance and one provider response. This proves:

- native audio input;
- streamed native audio output;
- timing instrumentation;
- usage capture;
- cost capture;
- evidence completeness.

#### Stage B — deterministic multi-turn benchmark

Later caller turns are selected from sealed artifacts by a provider-neutral branch classifier or deterministic tool/result rule.

The classifier:

- must not rewrite caller text;
- must not generate new caller content;
- must produce only a branch ID;
- must be versioned;
- must be tested for provider neutrality;
- must be recorded in the evidence ledger.

If no branch can be selected safely, the route-case is marked invalid and is not silently repaired.

### 4.6 Turn length

The private demo should use short, purposeful interactions rather than a fixed six-turn script.

Target behavior:

- one opening caller turn;
- one clarifying turn only if a required fact is missing;
- one confirmation/action turn;
- one concise terminal response.

The benchmark should cap each scenario at four caller turns and four AI turns. Many cases should finish earlier.

The cap is a safety limit, not a target.

---

## 5. Reference architecture

```text
                         ┌──────────────────────────────┐
                         │       Context Arena          │
                         │ verified continuity packet   │
                         └──────────────┬───────────────┘
                                        │ sealed hash
                         ┌──────────────▼───────────────┐
                         │      Continuity Bridge       │
                         │ packet + tools + policies    │
                         └──────────────┬───────────────┘
                                        │
              ┌─────────────────────────┴─────────────────────────┐
              │                                                   │
┌─────────────▼─────────────┐                       ┌─────────────▼─────────────┐
│ OpenAI Realtime adapter   │                       │ Gemini Live adapter       │
│ persistent WebRTC         │                       │ persistent WebSocket      │
│ sealed caller audio in    │                       │ sealed caller audio in    │
│ streamed audio out        │                       │ streamed PCM audio out    │
└─────────────┬─────────────┘                       └─────────────┬─────────────┘
              │                                                   │
              └─────────────────────────┬─────────────────────────┘
                                        │ normalized events
                         ┌──────────────▼───────────────┐
                         │ Append-only evidence ledger  │
                         │ Postgres system of record    │
                         └──────────────┬───────────────┘
                                        │ completed interaction
                         ┌──────────────▼───────────────┐
                         │ Independent Claude judge     │
                         │ blind provider labels        │
                         └──────────────┬───────────────┘
                                        │ learning candidate
                         ┌──────────────▼───────────────┐
                         │ Promotion and ablation gate  │
                         │ Zep only after approval      │
                         └──────────────────────────────┘
```

---

## 6. Common browser session interface

Both provider adapters must implement one application-level contract.

Proposed interface:

```ts
interface RealtimeVoiceSession {
  connect(config: SealedSessionConfig): Promise<void>;
  sendAudio(source: SealedAudioSource): Promise<void>;
  endInputTurn(): Promise<void>;
  interrupt(reason: string): Promise<void>;
  close(reason: string): Promise<void>;
  on(event: NormalizedRealtimeEvent, handler: EventHandler): Unsubscribe;
}
```

Required normalized event families:

- connection;
- input audio;
- provider speech detection;
- response lifecycle;
- output audio;
- playback;
- transcription;
- tool execution;
- interruption;
- usage;
- cost;
- error;
- session closure.

The page must not contain provider-specific orchestration logic beyond selecting the adapter. Provider-specific event formats are translated inside the adapter.

---

## 7. OpenAI native-S2S route

### 7.1 Transport

- Browser-to-OpenAI WebRTC.
- One persistent `RTCPeerConnection` for the complete route-case.
- One Realtime data channel for control and event messages.
- One remote audio track routed directly to the playback element.
- No connection recreation between caller turns.

### 7.2 Authentication

Preferred production pattern:

1. Browser requests a scoped session from the Agio backend.
2. Backend authenticates the private-demo user.
3. Backend uses the permanent OpenAI key server-side.
4. Backend mints or negotiates a short-lived Realtime session.
5. Browser receives only an ephemeral credential or negotiated session result.

Permanent API credentials must never appear in browser JavaScript, HTML, logs, analytics, or client-visible errors.

### 7.3 Audio input

Benchmark mode must remove `input_text`.

The browser must:

1. load the sealed caller audio;
2. verify the artifact hash;
3. decode it into an `AudioBuffer`;
4. route the buffer through a `MediaStreamAudioDestinationNode`;
5. attach that audio track to the WebRTC peer connection;
6. record input-start and input-end monotonic timestamps;
7. end the input turn deterministically;
8. request the response.

The source can be monitored locally for demo audibility, but local playback must not change the track sent to the provider.

### 7.4 Turn detection

Benchmark mode:

- deterministic turn boundaries;
- server VAD disabled or configured not to auto-create a response;
- explicit input completion;
- explicit response creation;
- identical silence policy across routes.

Live-human demo mode:

- semantic VAD is acceptable;
- automatic response creation is acceptable;
- interruption handling is enabled;
- results are labeled “live demo,” not “controlled benchmark.”

### 7.5 Audio output

- Play the remote WebRTC audio track as it arrives.
- Do not accumulate the complete response.
- Do not convert the output into a WAV file.
- Do not create a base64 audio payload.
- Do not wait for `response.done` before playback begins.

WebRTC’s internal jitter buffer is expected and desirable. The forbidden behavior is application-level complete-response buffering.

### 7.6 Context and tools

- Install the sealed continuity packet in the Realtime session instructions once.
- Use the same tool schemas and fixtures as Gemini.
- Keep tool calls inside the same Realtime session.
- Record tool request, tool start, tool result, and tool completion timestamps.
- Do not route the transcript to a second response-generating LLM.

### 7.7 OpenAI-specific telemetry

Capture browser WebRTC statistics at bounded intervals:

- connection state;
- selected candidate pair;
- round-trip time;
- jitter;
- packets received;
- packets lost;
- jitter-buffer delay;
- concealed samples;
- inserted samples;
- bytes received;
- codec;
- audio level when available.

### 7.8 OpenAI route acceptance criteria

- `input_text` is absent from benchmark execution.
- Provider usage proves non-zero audio input.
- The sealed input-audio hash matches the scenario manifest.
- One peer connection serves the entire route-case.
- First audible output occurs before the provider reports response completion.
- No standalone STT, response LLM, or TTS service is invoked.
- No silent fallback path is available.
- Usage and cost are sealed before the route-case completes.

---

## 8. Gemini native-S2S route

### 8.1 Transport

- Browser-to-Gemini persistent Live WebSocket.
- One Live session for the complete route-case.
- Raw audio chunks sent continuously.
- Raw output PCM chunks played as they arrive.
- No per-turn server connection.

### 8.2 Authentication

Preferred production pattern:

1. Browser requests a Gemini Live token from the Agio backend.
2. Backend authenticates the private-demo user.
3. Backend uses the permanent Google API key server-side.
4. Backend creates a short-lived, restricted ephemeral token.
5. Browser uses that token to open the Live session.

Token restrictions should pin or constrain:

- model;
- expiration;
- connection time window;
- permitted Live configuration where supported;
- request rate;
- private-demo session identity.

### 8.3 Session configuration

Freeze the configuration before the paired cohort:

- model: `gemini-3.1-flash-live-preview`;
- response modality: audio;
- thinking level: minimal;
- fixed benchmark voice;
- input-audio transcription: enabled for evidence;
- output-audio transcription: enabled for evidence;
- session resumption: enabled;
- context-window compression: enabled;
- continuity packet/system instruction: fixed;
- tool schemas: fixed.

Transcriptions are evidence side channels. They must not become the control plane for generating the response.

### 8.4 Audio input

The browser must:

1. load and verify the same sealed caller artifact used by OpenAI;
2. decode and resample it if required;
3. produce mono signed PCM16 at the provider-required input rate;
4. send bounded chunks, initially 20–100 ms;
5. preserve original ordering;
6. record queue, send, and acknowledgement timing;
7. signal deterministic input completion.

Resampling is a protocol adapter, not a content transformation. The source artifact hash and the transmitted PCM hash must both be recorded.

### 8.5 Audio output

Gemini returns raw audio chunks. The browser must:

1. accept chunks immediately;
2. decode the provider framing;
3. enqueue PCM into an `AudioWorklet`;
4. maintain a small ring/jitter buffer;
5. begin playback after a small startup threshold;
6. continue playback while later chunks arrive;
7. record underruns and queue depth;
8. finish only after provider audio completion and local queue drain.

Initial playback-buffer target: 40–100 ms.

“Zero buffering” is not the objective. A tiny jitter buffer prevents audible underruns. Complete-turn buffering is forbidden.

The active Gemini route must not:

- concatenate the full turn;
- construct a WAV file;
- base64-encode the complete response;
- return audio in JSON;
- use an object URL for completed-file playback;
- wait for `turnComplete` before audio begins.

### 8.6 Session lifecycle

- Keep the Live socket open across all scenario turns.
- Handle provider `goAway` signals.
- persist the session-resumption handle;
- reconnect only through the documented resumption path;
- mark a route-case invalid if continuity cannot be proven after reconnection;
- close only after output playback, evidence sealing, and usage capture.

### 8.7 Gemini-specific telemetry

Capture:

- token issue latency;
- socket connection latency;
- setup acknowledgement latency;
- input queue depth;
- input chunk count and cadence;
- output first-chunk time;
- output inter-chunk intervals;
- output queue depth;
- playback underrun count;
- `goAway` events;
- session-resumption attempts and outcome;
- usage metadata by modality.

### 8.8 Gemini route acceptance criteria

- The browser holds one persistent Live session for the route-case.
- Input is audio, not text.
- The source artifact hash matches OpenAI’s paired route-case.
- PCM output begins playback before the provider completes the response.
- No complete-response WAV/base64/JSON path is used.
- No standalone STT, response LLM, or TTS service is invoked.
- No silent fallback to the legacy buffered endpoint exists.
- Usage and cost are sealed before the route-case completes.

---

## 9. No-cascade policy

### 9.1 Allowed

- continuity packet installed as system/session context;
- provider-native audio understanding and generation;
- provider-native function calling;
- Agio tools invoked during the same session;
- input/output transcription stored for evidence;
- post-call independent judging;
- post-call learning-candidate extraction.

### 9.2 Forbidden

- external STT before the tested model;
- text transcript sent to a second model to write the answer;
- external TTS used to speak the tested model’s answer;
- complete audio response buffered into a file;
- provider-generated Human Caller Agent in the controlled benchmark;
- judge feedback injected into the live interaction;
- graph learning promoted while the paired cohort is still running;
- silent provider fallback;
- fabricated usage, cost, timing, or quality values.

Any forbidden component makes the route-case ineligible for comparison.

---

## 10. Unified telemetry contract

### 10.1 Clock policy

Use two clocks:

- browser monotonic time for latency deltas;
- UTC server timestamp for cross-system audit ordering.

Never calculate sub-second latency by subtracting unsynchronized wall clocks from different machines.

### 10.2 Required normalized events

Recommended event names:

```text
session.requested
session.credential_issued
session.connect_started
session.connected
context.packet_installed
turn.input_queued
turn.input_first_byte_sent
turn.input_last_byte_sent
turn.input_committed
provider.input_speech_started
provider.input_speech_stopped
response.created
response.first_audio_received
playback.first_audio
response.audio_done
response.done
playback.done
tool.requested
tool.started
tool.completed
tool.failed
turn.interrupted
usage.received
cost.calculated
judge.requested
judge.completed
learning.candidate_created
session.closed
```

### 10.3 Required latency metrics

| Metric | Formula |
|---|---|
| Session connection latency | `session.connected - session.connect_started` |
| Input upload duration | `turn.input_last_byte_sent - turn.input_first_byte_sent` |
| Model first-audio latency | `response.first_audio_received - turn.input_committed` |
| Time to first audible audio | `playback.first_audio - turn.input_committed` |
| Playback startup overhead | `playback.first_audio - response.first_audio_received` |
| Provider response duration | `response.audio_done - response.first_audio_received` |
| Playback duration | `playback.done - playback.first_audio` |
| Turn completion latency | `playback.done - turn.input_committed` |
| Tool round-trip latency | `tool.completed - tool.requested` |
| Total session duration | `session.closed - session.connected` |

### 10.4 Aggregations

Show by route:

- completed runs;
- valid runs;
- invalid runs;
- failures;
- retries;
- p50 latency;
- p95 latency;
- mean only as a supporting measure;
- total cost;
- mean cost per turn;
- mean cost per route-case;
- cost per passing resolution;
- convergence rate;
- judge pass rate;
- grounding failure rate;
- policy/safety failure rate.

### 10.5 Provider-specific diagnostics

Provider-specific metrics may be shown in a drill-down, but the comparison table must use the normalized contract.

Examples:

- OpenAI WebRTC RTT, jitter, packet loss;
- Gemini output-chunk cadence, queue depth, underruns, resumption.

Do not compare a WebRTC-only diagnostic directly to a WebSocket-only diagnostic as if they were equivalent outcome metrics.

---

## 11. Cost and model economics

### 11.1 Source hierarchy

Cost values must be derived in this order:

1. provider-returned usage;
2. versioned provider price book;
3. deterministic formula;
4. otherwise “unavailable.”

Never invent a cost because a provider field is missing.

### 11.2 Route cost

For each turn and route-case, store:

- provider input audio units;
- provider output audio units;
- text/system units if billed;
- cached units if billed differently;
- tool or auxiliary usage where charged;
- published price-book version;
- calculated provider cost;
- infrastructure allocation;
- total measured route cost;
- calculation status: complete, partial, or unavailable.

### 11.3 Excluded cost

Pre-generating the sealed Human Caller Agent audio is a benchmark-fixture creation cost. It must be recorded once but excluded from the provider route comparison.

### 11.4 Model Economics UI

The Model Economics page becomes a live usage and tokenomics table.

Recommended columns:

- provider and model;
- architecture;
- valid runs;
- failed runs;
- total turns;
- input usage;
- output usage;
- total observed cost;
- average cost per turn;
- average cost per completed route-case;
- cost per passing resolution;
- p50 first-audio latency;
- p95 first-audio latency;
- quality-gate pass rate;
- last observed run.

Remove from the primary table:

- “paired canary pending” as a static placeholder;
- generic “Agio evidence” pills;
- enterprise-decision prose that does not update from observed data.

Published prices remain accessible as source-linked metadata, separate from measured economics.

---

## 12. Quality and independent judge

### 12.1 Judge isolation

The independent judge runs only after:

- the voice interaction completes;
- provider usage is captured;
- the transcript and tool trace are sealed;
- provider identity is replaced with a blinded route label.

Claude is the judge. It is not a participant in either live voice route.

### 12.2 Append-only results

Judge results are immutable append-only records.

A re-judge creates a new judge record with:

- parent result ID;
- reason;
- new rubric/model version;
- timestamp;
- evidence hash.

It never overwrites the earlier result.

### 12.3 Core quality metrics

- Resolution correctness
- Grounding accuracy
- Context sufficiency
- Continuity preservation
- Convergence achieved
- Policy and safety
- Escalation correctness
- Unsupported-claim rate
- Unnecessary work avoided
- Required-information repetition
- Tool/action correctness

Voice naturalness should be separately human-audited or evaluated through an explicitly validated audio rubric. A text-only judge cannot credibly determine full voice naturalness.

### 12.4 Human audit

Minimum human audit sample:

- 10% of valid paired route-cases;
- all judge/provider disagreements;
- all safety failures;
- all invalidated runs;
- all proposed generalized learning promotions.

---

## 13. Persistence and evidence architecture

### 13.1 System of record

Postgres is authoritative for:

- benchmark manifests;
- sessions;
- turns;
- append-only events;
- provider usage;
- cost calculations;
- judge results;
- learning candidates;
- promotion decisions;
- outbox delivery state.

### 13.2 Proposed logical records

Reuse existing tables where equivalent structures already exist.

#### `voice_benchmark_manifests`

- manifest ID and version;
- cohort seed;
- scenario count;
- route count;
- route order;
- model/config hashes;
- context graph version;
- prompt version;
- tool-schema hash;
- audio-manifest hash;
- price-book version;
- judge rubric/model version;
- budget cap;
- created/sealed timestamps.

#### `voice_sessions`

- session ID;
- manifest ID;
- scenario ID;
- blinded route ID;
- provider/model ID;
- transport;
- configuration hash;
- continuity-packet hash;
- started/ended timestamps;
- completion state;
- invalidation reason.

#### `voice_turns`

- session ID;
- turn ordinal;
- source-audio hash;
- transmitted-audio hash;
- caller branch ID;
- start/end timestamps;
- usage;
- cost;
- outcome.

#### `voice_events`

- immutable event ID;
- session and turn IDs;
- monotonic sequence;
- normalized event name;
- browser monotonic time;
- server UTC time;
- provider event type;
- provider-payload hash;
- sanitized payload;
- prior-event hash if hash chaining is enabled.

#### `judge_results`

- immutable judge-result ID;
- blind route ID;
- rubric/model version;
- evidence-bundle hash;
- metric scores;
- pass/fail;
- failure taxonomy;
- reasoning summary;
- created timestamp.

#### `learning_candidates`

- candidate ID;
- source judge-result IDs;
- generalized mechanism;
- company-specific facts excluded;
- evidence strength;
- causality status;
- ablation status;
- model-agnostic status;
- promotion state.

### 13.3 Zep delivery

Use an outbox pattern:

1. transaction commits authoritative Postgres records;
2. an append-only outbox record is created in the same transaction;
3. a bounded worker delivers eligible derived episodes to Zep;
4. delivery ID and graph result are recorded;
5. retry count is capped;
6. failures remain auditable.

Zep must not become the source of truth for raw benchmark evidence.

---

## 14. Self-learning boundary

### 14.1 What may be learned

Agio should learn generalized reusable mechanisms, such as:

- detect when evidence is insufficient;
- distinguish absence of evidence from evidence of absence;
- preserve verified facts across channel handoff;
- avoid converting a plausible hypothesis into a claimed root cause;
- identify when a tool result invalidates the current plan;
- escalate without discarding already established context;
- prefer a minimal safe next action;
- detect contradiction between response and policy;
- verify terminal-state completion;
- calibrate confidence to evidence strength.

### 14.2 What must not transfer between companies

- proprietary company facts;
- private customer data;
- company-specific policies;
- unpublished support procedures;
- confidential failure histories;
- user-identifying transcripts;
- company-specific golden paths.

Cross-company transfer is limited to generalized reasoning and graph-navigation mechanisms.

### 14.3 Freeze during benchmark

Before the first paired paid run, freeze:

- graph version;
- continuity schema;
- prompts/instructions;
- tools;
- model IDs;
- provider configurations;
- caller audio;
- branch state machines;
- judge rubric/model;
- price book.

No learning promotion occurs until the complete paired cohort is sealed.

### 14.4 Promotion gate

A learning candidate may be promoted only when:

- it recurs across independent cases;
- the source evidence is immutable;
- it is stated as a generalized mechanism;
- company-specific information has been removed;
- causality has been tested where possible;
- ablation shows the mechanism improves the target behavior;
- it does not degrade protected metrics;
- model-agnostic evidence exists or the limitation is explicitly labeled;
- a human approves the promotion.

“Observed” is not “learned,” and “learned” is not “production ready.”

---

## 15. Benchmark ordering and controls

### 15.1 Pre-sealed execution order

Use a seeded, interleaved paired order:

- pair by scenario;
- alternate which provider runs first;
- record the seed in the manifest;
- prevent manual cherry-picking;
- keep concurrency at one for initial canaries;
- use bounded concurrency only after stability is proven.

This reduces time-of-day, network, deployment, and provider-load bias.

### 15.2 Retry policy

- Maximum one retry per route-case.
- A retry is a new attempt, never an overwrite.
- Both attempts remain in the evidence ledger.
- The reason must be classified.
- A provider-quality failure is not retried as if it were a transport error.

### 15.3 Hard stop conditions

Immediately stop the cohort when any of the following occurs:

- permanent API credential reaches the browser;
- route silently falls back;
- source-audio hash mismatch;
- manifest/config hash mismatch;
- context packet mismatch;
- missing required timestamps;
- usage cannot be captured;
- judge unavailable beyond the bounded queue policy;
- error rate exceeds the canary threshold;
- projected or actual cost reaches the hard cap;
- database evidence write fails;
- repeated session-resumption failure;
- audio playback is complete-response buffered;
- an active route is not native audio-in/audio-out.

---

## 16. Implementation workstreams

### Workstream A — freeze contracts

Deliver:

- normalized realtime session interface;
- event and timing schema;
- sealed-audio manifest schema;
- continuity-packet schema;
- benchmark manifest v2;
- no-cascade eligibility policy;
- judge rubric version;
- hard-stop policy.

Exit criterion:

- all contracts have hashes and test fixtures.

### Workstream B — sealed caller-audio system

Deliver:

- deterministic caller scripts;
- speaker-role validation;
- Adam/Jenna or approved provider-neutral fixture voices;
- normalization pipeline;
- transcript/audio hash manifest;
- deterministic multi-turn branch definitions;
- artifact loader and verifier.

Exit criterion:

- one scenario can replay byte-identical source audio into both route adapters.

### Workstream C — OpenAI browser-native route

Deliver:

- ephemeral session endpoint;
- persistent WebRTC adapter;
- sealed-audio track injection;
- deterministic benchmark turn control;
- streamed remote playback;
- normalized event mapping;
- WebRTC stats collection;
- usage/cost sealing.

Exit criterion:

- a one-turn canary proves audio-in/audio-out without `input_text`.

### Workstream D — Gemini browser-native route

Deliver:

- restricted ephemeral-token endpoint;
- persistent Live WebSocket adapter;
- PCM input chunker/resampler;
- `AudioWorklet` output player;
- small ring/jitter buffer;
- session resumption;
- normalized event mapping;
- usage/cost sealing.

Exit criterion:

- a one-turn canary begins playback before `turnComplete` with no WAV/base64 path.

### Workstream E — common telemetry and evidence

Deliver:

- normalized client event emitter;
- server event-ingestion endpoint;
- append-only persistence;
- monotonic event sequencing;
- provider payload hashing;
- metric calculations;
- evidence completeness validator;
- trace export.

Exit criterion:

- both providers produce the same required normalized event set.

### Workstream F — independent judge

Deliver:

- post-completion judge queue;
- provider blinding;
- rubric prompt and structured response;
- append-only result persistence;
- invalid-evidence rejection;
- human-review queue;
- judge latency and cost tracking.

Exit criterion:

- one completed paired scenario produces two blind judge results linked to immutable evidence.

### Workstream G — Insights and Model Economics

Deliver:

- live per-turn economics;
- runs, failures, turns, and cost;
- p50/p95 first-audio and completion latency;
- quality-gate rates;
- cost per passing resolution;
- evidence drill-down;
- route validity/fallback status;
- raw timestamp trace;
- provider-specific diagnostic drill-down.

Exit criterion:

- the dashboard updates after each sealed turn without manual calculations outside the UI.

### Workstream H — Zep learning pipeline

Deliver:

- judgment-derived learning-candidate generator;
- Postgres outbox;
- bounded delivery worker;
- Zep episode/graph mapping;
- promotion-state UI;
- pre-learning versus post-learning evaluation linkage;
- ablation and degradation reporting.

Exit criterion:

- a miss is visibly marked as fed into the learning-candidate pipeline, but no unapproved candidate modifies the production graph.

---

## 17. Proposed code boundaries

Final names should follow repository conventions, but the responsibilities should be separated approximately as follows:

```text
apps/web/app/api/openai/realtime/session/route.ts
apps/web/app/api/gemini/live/token/route.ts

apps/web/lib/realtime/RealtimeVoiceSession.ts
apps/web/lib/realtime/OpenAIRealtimeSession.ts
apps/web/lib/realtime/GeminiLiveSession.ts

apps/web/lib/realtime/audio/SealedAudioSource.ts
apps/web/lib/realtime/audio/PcmInputEncoder.ts
apps/web/lib/realtime/audio/PcmPlaybackController.ts
apps/web/public/worklets/pcm-playback-processor.js

apps/web/lib/realtime/benchmark/BenchmarkStateMachine.ts
apps/web/lib/realtime/benchmark/BenchmarkManifest.ts
apps/web/lib/realtime/benchmark/EligibilityValidator.ts

apps/web/lib/realtime/telemetry/NormalizedEvents.ts
apps/web/lib/realtime/telemetry/Metrics.ts
apps/web/lib/realtime/telemetry/EvidenceWriter.ts
apps/web/lib/realtime/telemetry/CostCalculator.ts

apps/web/scripts/prepare-sealed-caller-audio.ts
apps/web/scripts/run-native-s2s-canary.ts
apps/web/scripts/validate-benchmark-evidence.ts
```

Existing files expected to change:

```text
apps/web/app/retell/page.tsx
apps/web/app/insights/page.tsx
apps/web/lib/voiceModelCatalog.ts
apps/web/lib/voiceBenchmarkManifest.ts
```

The existing buffered Gemini endpoint must be removed from the active route path. During cutover it may exist only behind an explicit test-only flag and must never be a silent fallback.

---

## 18. Test strategy

### 18.1 Unit tests

- audio hash verification;
- sample-rate conversion;
- PCM framing;
- chunk ordering;
- ring-buffer behavior;
- underrun accounting;
- provider event normalization;
- timestamp formulas;
- cost formulas;
- branch-state-machine determinism;
- context-packet hash verification;
- benchmark eligibility;
- budget hard stop.

### 18.2 Integration tests

- mocked OpenAI event/data channel;
- mocked Gemini Live socket;
- delayed and out-of-order chunks;
- token expiration;
- provider disconnect;
- `goAway` and session resumption;
- missing usage;
- tool success/failure;
- database event-write failure;
- duplicate event delivery;
- judge queue retry;
- Zep outbox retry.

### 18.3 Browser tests

Primary supported demo browser: current Chrome.

Test:

- audio autoplay permission;
- WebRTC connection;
- Web Audio worklet startup;
- sealed-audio playback;
- remote output playback;
- page navigation during a live session;
- Stop behavior;
- interruption;
- reconnection;
- disabled provider options;
- no JavaScript console errors;
- responsive layout at the target demo resolution.

Safari and mobile should be explicitly labeled deferred unless validated.

### 18.4 Failure injection

- 500 ms output delay;
- intermittent packet/chunk delay;
- one dropped chunk;
- socket close mid-turn;
- token expiry before connect;
- provider error after tool call;
- audio-worklet underrun;
- browser tab backgrounding;
- Railway restart during evidence ingestion;
- Postgres temporary unavailability;
- judge provider timeout.

---

## 19. Rollout sequence

### Phase 0 — audit and freeze

- Land this architecture plan.
- Map existing code to target components.
- Freeze event names and metric formulas.
- Freeze the two active model IDs.
- Freeze benchmark eligibility rules.
- Do not run paid benchmark calls.

### Phase 1 — one-scenario transport canary

Run one scenario per provider with one caller turn.

Must prove:

- identical source audio;
- native audio input;
- streamed native audio output;
- persistent session;
- first audio before response completion;
- complete event trace;
- actual usage;
- actual calculated cost;
- no fallback;
- no cascade.

### Phase 2 — deterministic multi-turn canary

Run one scenario per provider through the full caller state machine.

Must prove:

- context continuity across turns;
- deterministic branch selection;
- tool consistency;
- short interaction;
- safe terminal state;
- judge execution after completion.

### Phase 3 — five-scenario paired canary

Run the frozen five-scenario canary cohort across both providers.

Before proceeding:

- 0 source-audio hash mismatches;
- 0 context/config mismatches;
- 0 missing required events;
- 0 silent fallbacks;
- 100% usage capture;
- 100% cost-status visibility;
- judge pipeline complete;
- failure rate below the pre-declared threshold;
- no unresolved safety failure.

Use this canary to set empirical latency thresholds. Do not invent arbitrary production latency targets before measuring the corrected architecture.

### Phase 4 — freeze cohort

Freeze:

- scenario order and seed;
- provider order;
- audio artifacts;
- context packets;
- tools;
- prompts;
- model configurations;
- judge;
- price book;
- budget.

Generate and seal the final manifest hash.

### Phase 5 — 100 × 2 paired cohort

- Execute exactly 200 planned route-cases.
- Interleave provider order.
- Enforce concurrency and retry caps.
- Stop automatically on any hard-stop condition.
- Update Insights and Model Economics after every sealed turn.

### Phase 6 — analysis

Produce:

- valid paired sample count;
- exclusions and reasons;
- latency distributions;
- usage and cost;
- cost per passing resolution;
- quality and safety;
- tool/action correctness;
- context-continuity failures;
- provider-specific transport findings;
- human-audit findings.

### Phase 7 — learning candidates

- Extract generalized reasoning gaps.
- Separate generalized mechanisms from company facts.
- Run causal and ablation tests.
- test model-agnostic behavior;
- assess improvements and degradations;
- promote only human-approved candidates;
- create a new graph version;
- never rewrite the original benchmark.

---

## 20. Acceptance gates

### Gate A — architecture

- [ ] OpenAI benchmark input is audio, not `input_text`.
- [ ] Gemini uses a browser persistent Live session.
- [ ] Both routes are native audio-in/audio-out.
- [ ] Both routes use the same sealed caller audio.
- [ ] No complete-response buffer exists.
- [ ] No cascading STT → LLM → TTS route exists.
- [ ] No silent fallback exists.

### Gate B — security

- [ ] Permanent provider keys remain server-side.
- [ ] Browser tokens are short-lived and restricted.
- [ ] Tokens are not logged.
- [ ] Private demo authentication is enforced.
- [ ] Rate limits and payload caps are enforced.
- [ ] Batch caps and budget caps are enforced.

### Gate C — evidence

- [ ] All required normalized events are present.
- [ ] Monotonic timing is used for latency.
- [ ] Audio, context, config, and manifest hashes are present.
- [ ] Provider usage is stored.
- [ ] Cost status is complete, partial, or unavailable—never invented.
- [ ] Judge results are append-only.

### Gate D — product

- [ ] Human Caller Agent role is never confused with AI Front Desk.
- [ ] Context established before voice is preserved.
- [ ] Previously verified information is not needlessly requested.
- [ ] Tools/actions respect policy and authority.
- [ ] Interactions terminate concisely.
- [ ] Convergence is measured, not merely claimed.

### Gate E — benchmark

- [ ] Five-scenario paired canary passes.
- [ ] Final manifest is immutable.
- [ ] No learning occurs during the cohort.
- [ ] Exactly two active routes are benchmarked.
- [ ] Maximum 200 paid route-cases.
- [ ] Maximum one retry per route-case.
- [ ] USD 100 hard stop is active.

---

## 21. Definition of done

The native-S2S benchmark is production-ready when:

1. The Retell private prototype lets the user select OpenAI or Gemini and run the same scenario from the same `Run live E2E` control.
2. The Human Caller Agent sends identical sealed audio to both providers.
3. OpenAI runs one persistent WebRTC audio session.
4. Gemini runs one persistent Live WebSocket audio session.
5. Both responses begin playing while audio is still arriving.
6. Neither route uses a cascading or complete-response-buffered path.
7. The dashboard shows observed latency, usage, cost, runs, failures, quality, and evidence after every turn.
8. A blind independent Claude judge runs after each completed interaction.
9. All raw evidence and judge outputs are append-only in Postgres.
10. Zep receives only approved, evidence-linked learning candidates through the outbox.
11. The five-scenario paired canary passes every hard gate.
12. The 100 × 2 cohort can run with deterministic order, bounded retries, and automatic budget stop.
13. The final report distinguishes:
    - transport performance;
    - model behavior;
    - context-graph contribution;
    - cost;
    - quality;
    - generalized learning candidates;
    - unproven hypotheses.

---

## 22. Immediate next actions

Execute in this order:

1. Freeze the normalized event contract and sealed-audio manifest.
2. Build one provider-neutral audio fixture for a single scenario.
3. Replace OpenAI `input_text` with injected sealed audio over the existing WebRTC session.
4. Replace Gemini’s per-turn buffered endpoint with a browser persistent Live WebSocket.
5. Add the Gemini PCM `AudioWorklet` playback path.
6. Prove first-audio playback before response completion on both routes.
7. Persist a complete normalized trace and actual usage for both routes.
8. Wire per-turn economics into Insights.
9. Run the blind Claude judge after both completed canaries.
10. Implement the deterministic multi-turn caller state machine.
11. Run the five-scenario paired canary.
12. Freeze latency and failure thresholds from observed canary data.
13. Only then authorize the 100 × 2 paid cohort.

Do not begin the full cohort until Actions 1–12 are complete.

---

## 23. Official protocol references

### OpenAI

- [Realtime API with WebRTC](https://developers.openai.com/api/docs/guides/realtime-webrtc)
- [Realtime conversations](https://developers.openai.com/api/docs/guides/realtime-conversations)
- [Voice activity detection](https://developers.openai.com/api/docs/guides/realtime-vad)
- [GPT Realtime 2.1 mini](https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini)

### Google Gemini

- [Live API capabilities](https://ai.google.dev/gemini-api/docs/live-api/capabilities)
- [Live API reference](https://ai.google.dev/api/live)
- [Ephemeral tokens](https://ai.google.dev/gemini-api/docs/live-api/ephemeral-tokens)
- [Live session management](https://ai.google.dev/gemini-api/docs/live-api/session-management)
- [Live API tools](https://ai.google.dev/gemini-api/docs/live-api/tools)

---

## 24. Final principle

The benchmark is credible only if the application architecture stops favoring one provider.

The objective is not to make Gemini imitate OpenAI’s transport or to force both products into one provider-specific implementation. The objective is to give each provider its best official native realtime path while holding constant:

- the caller audio;
- the context;
- the tools;
- the policies;
- the turn contract;
- the evidence contract;
- the judge;
- the cost methodology;
- the promotion rules.

Only then can Agio distinguish model quality from integration quality and prove that its context and convergence layer adds durable value across providers.

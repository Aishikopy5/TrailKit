# 🛡️ TrailKit Defensive Model Harness

An original open-source model harness designed for **open-weight Large and Small Language Models** (Google Gemma 2, Llama 3, Mistral) operating in high-stakes physical domains.

Developed as part of **TrailKit** for the **Hugging Face Weekend Hackathon 2026** under the **"Best Open-Source AI Project"** prize track.

---

## 🎯 The Core Problem

When open-weight models are deployed in high-stakes domains (wilderness navigation, medical triage, high-altitude travel), standard model wrappers fail because:
1. **Prompt Injections & Jailbreaks**: User prompts and third-party RAG web results can override system safety constraints.
2. **Medical Hallucinations**: Models suggest prescription drugs (e.g. Diamox / Acetazolamide) without proper clinical clearance.
3. **Altitude Acclimatization Omissions**: Models schedule steep ascents (>3,500m) without physiological rest days.
4. **Fragile JSON Generation**: Open-weight models often emit conversational preambles, trailing text, or malformed markdown code fences that break downstream application parsers.

---

## 🔬 Key Innovations in TrailKit's Model Harness

The `DefensiveModelHarness` implements a 4-tier pipeline wrapping open-weight foundation models:

```
[User Input Spec] + [RAG Live Data]
              │
              ▼
   ┌──────────────────────┐
   │ Structural Fencing   │  <user_spec> & <retrieved_data> tags prevent prompt injection
   └──────────┬───────────┘
              │
              ▼
   ┌──────────────────────┐
   │ Open-Weight Model    │  Ollama / Hugging Face / Gemma 2 inference
   └──────────┬───────────┘
              │
              ▼
   ┌──────────────────────┐
   │ Robust JSON Extractor│  Recovers JSON from fences, preambles, or unformatted text
   └──────────┬───────────┘
              │
              ▼
   ┌──────────────────────┐
   │ AST & Regex Safety   │  Scrubs prescription drugs, injects Day 1 acclimatization,
   │ Repair Engine        │  and locks non-negotiable safety equipment
   └──────────┬───────────┘
              │
              ▼
[Verified Safe Expedition Payload]
```

### 1. Bidirectional Data Fencing
All untrusted user specifications and live web context retrieved via search (SerpApi) are strictly segregated into `<user_spec>` and `<retrieved_data>` XML fences. System prompts explicitly instruct the model never to treat data inside fences as operational directives.

### 2. Multi-Provider Interface
Easily switch between providers without changing your application code:
- **`ModelProvider.OLLAMA`**: Fully local, air-gapped open-weight inference (e.g. `gemma2:2b`, `gemma2:9b`).
- **`ModelProvider.HUGGINGFACE`**: Hugging Face Inference API / Dedicated Endpoints.
- **`ModelProvider.OPENAI_COMPATIBLE`**: vLLM, TGI, or custom OpenAI-compatible server.
- **`ModelProvider.OFFLINE_DETERMINISTIC`**: Zero-network fallback engine providing guaranteed valid, safe responses.

### 3. Deterministic AST & Safety Repair (`repair()`)
The harness does not simply validate and reject; it actively **repairs** unsafe generations:
- **Medical Scrubbing**: Prescription drugs (Diamox, Dexamethasone, Nifedipine) are stripped and replaced with safe OTC Oral Rehydration Salts (ORS) and hydration guidance.
- **Acclimatization Injection**: For trips over 2,500m ($8,200\text{ ft}$), Day 1 is rewritten into mandatory rest.
- **Vulnerable Party Enforcement**: Injects child-specific thermal gear and pediatric electrolytes if travelers under 12 are present.
- **Safety Gear Locking**: Automatically enforces and locks essential emergency equipment (First Aid Kit, Water Filter, UV Sunglasses, Headlamp).

---

## 💻 Quickstart & CLI Usage

### Run from Command Line
```bash
# Test offline deterministic failover
python -m harness.cli --destination "Leh Ladakh" --provider offline_deterministic --has-child

# Test local Gemma 2 via Ollama
python -m harness.cli --destination "Spiti Valley" --provider ollama --model gemma2:9b

# Test hosted Hugging Face Inference API
python -m harness.cli --destination "Sikkim" --provider huggingface --model google/gemma-2-9b-it --endpoint https://api-inference.huggingface.co/models/google/gemma-2-9b-it
```

### Python SDK Usage
```python
import asyncio
from harness import DefensiveModelHarness, HarnessConfig, ModelProvider

async def main():
    config = HarnessConfig(
        provider=ModelProvider.OLLAMA,
        model_name="gemma2:2b",
        enable_deterministic_repair=True,
    )
    harness = DefensiveModelHarness(config)

    user_spec = {
        "destination": "Leh, Ladakh",
        "duration_days": 4,
        "travelers": [{"age": 29}, {"age": 5}],
        "activity_style": "scenic"
    }

    result = await harness.execute(user_spec)
    print("Status:", result.success)
    print("Engine:", result.model_used)
    print("Repairs:", result.repair_log)

asyncio.run(main())
```

---

## 📜 Compliance & License

- **License**: MIT License
- **Open Standards**: Fully compatible with the Agent Skill Open Standard and Hugging Face open-weight model ecosystem.

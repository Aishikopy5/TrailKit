"""
Command Line Interface for TrailKit Defensive Model Harness.
Allows developers and researchers to evaluate open-weight models under defensive safety constraints.
"""

import argparse
import asyncio
import json
import sys

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

from harness.defensive_harness import (
    DefensiveModelHarness,
    HarnessConfig,
    ModelProvider,
)


def main():
    parser = argparse.ArgumentParser(
        description="TrailKit Defensive Model Harness for Open-Weight LLMs (Gemma, Llama, Mistral)"
    )
    parser.add_argument(
        "--destination",
        type=str,
        default="Leh, Ladakh",
        help="Destination name for expedition planning",
    )
    parser.add_argument(
        "--days",
        type=int,
        default=4,
        help="Number of expedition days",
    )
    parser.add_argument(
        "--provider",
        type=str,
        choices=["ollama", "huggingface", "openai_compatible", "offline_deterministic"],
        default="offline_deterministic",
        help="Model provider or fallback engine",
    )
    parser.add_argument(
        "--model",
        type=str,
        default="gemma-2-9b-it",
        help="Model identifier",
    )
    parser.add_argument(
        "--endpoint",
        type=str,
        default=None,
        help="Custom inference endpoint URL",
    )
    parser.add_argument(
        "--has-child",
        action="store_true",
        help="Simulate travel party with a young child",
    )

    args = parser.parse_args()

    travelers = [{"age": 28, "has_health_conditions": False}]
    if args.has_child:
        travelers.append({"age": 4, "has_health_conditions": False})

    user_spec = {
        "destination": args.destination,
        "duration_days": args.days,
        "travelers": travelers,
        "activity_style": "scenic",
        "custom_places": [],
    }

    config = HarnessConfig(
        provider=ModelProvider(args.provider),
        model_name=args.model,
        endpoint_url=args.endpoint,
        enable_deterministic_repair=True,
        failover_to_offline=True,
    )

    harness = DefensiveModelHarness(config)

    print(f"\n🏔️ TrailKit Defensive Model Harness")
    print(f"=====================================")
    print(f"Provider:    {config.provider.value}")
    print(f"Model:       {config.model_name}")
    print(f"Destination: {args.destination}")
    print(f"Party:       {len(travelers)} travelers (Child present: {args.has_child})")
    print(f"Executing generation and deterministic validation...\n")

    result = asyncio.run(harness.execute(user_spec))

    print(f"Status:       {'✓ SUCCESS' if result.success else '✗ FAILED'}")
    print(f"Engine Used:  {result.model_used} ({result.provider_used})")
    print(f"Latency:      {result.latency_ms} ms")
    print(f"Was Repaired: {result.was_repaired}")

    if result.repair_log:
        print("\n🛡️ Safety Actions & Repairs Executed:")
        for log in result.repair_log:
            print(f"  • {log}")

    print("\n📦 Verified Output Summary:")
    if result.parsed_payload:
        itinerary = result.parsed_payload.get("itinerary", [])
        packing = result.parsed_payload.get("packing_list", [])
        print(f"  • Days Planned: {len(itinerary)}")
        print(f"  • Day 1 Acclimatization Rest: {itinerary[0].get('acclimatization_rest', False) if itinerary else 'N/A'}")
        print(f"  • Gear Items: {len(packing)} items")
        print(f"  • First Aid Locked: {any('first aid' in str(i).lower() for i in packing)}")

    print("\nFull JSON output available via SDK or API.\n")


if __name__ == "__main__":
    main()

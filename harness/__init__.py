"""
TrailKit Defensive Model Harness for Open-Weight AI Models.
Original model harness implementation enforcing structured generation,
prompt-injection sandboxing, and deterministic AST/regex safety verification.
"""

from .defensive_harness import (
    DefensiveModelHarness,
    ModelProvider,
    HarnessConfig,
    HarnessResult,
)

__all__ = [
    "DefensiveModelHarness",
    "ModelProvider",
    "HarnessConfig",
    "HarnessResult",
]
__version__ = "1.0.0"

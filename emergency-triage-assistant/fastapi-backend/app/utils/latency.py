import time
from contextlib import contextmanager
from typing import Dict

class LatencyTracker:
    def __init__(self):
        self.timings: Dict[str, float] = {}
        self.start_time = time.time()
    
    @contextmanager
    def track(self, name: str):
        start = time.time()
        yield
        self.timings[name] = round((time.time() - start) * 1000, 2)
    
    def get_total(self) -> float:
        return round((time.time() - self.start_time) * 1000, 2)
    
    def get_timings(self) -> Dict[str, float]:
        return {**self.timings, "total_ms": self.get_total()}

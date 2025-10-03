from datetime import datetime, time
from django.conf import settings

MARKET_DAYS = getattr(settings, "MARKET_DAYS", [0, 1, 2, 3, 4])
MARKET_START = getattr(settings, "MARKET_START", "09:30")
MARKET_END = getattr(settings, "MARKET_END", "16:00")

def is_open():
    now = datetime.utcnow()
    if now.weekday() not in MARKET_DAYS:
        return False
    start_hour, start_minute = map(int, MARKET_START.split(":"))
    end_hour, end_minute = map(int, MARKET_END.split(":"))
    start = time(start_hour, start_minute)
    end = time(end_hour, end_minute)
    return start <= now.time() <= end

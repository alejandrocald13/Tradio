from datetime import datetime, time
import pytz

def is_open():
    tz = pytz.timezone("America/New_York")
    now = datetime.now(tz)
    if now.weekday() >= 5:
        return False
    open_time = time(9, 30)
    close_time = time(16, 0)
    return open_time <= now.time() <= close_time

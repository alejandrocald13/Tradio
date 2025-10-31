from datetime import datetime, time
import pytz

def is_open():
    tz = pytz.timezone("America/Guatemala")
    now = datetime.now(tz)

    if now.weekday() in (5, 6):
        return False

    open_time = time(8, 0)
    close_time = time(20, 0) 

    # return open_time <= now.time() <= close_time
    return True
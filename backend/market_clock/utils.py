from datetime import datetime, time

def is_open():
    now = datetime.now()
    weekday = now.weekday()  
    market_open = time(9, 30)
    market_close = time(16, 0)
    if weekday >= 0 and weekday <= 4:  
        if market_open <= now.time() <= market_close:
            return True
    return True

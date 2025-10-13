import pytz
from datetime import datetime, time
from django.utils import timezone
from django.conf import settings

class MarketClock:
    def __init__(self):
        self.timezone = pytz.timezone('America/New_York')
    
    def is_open(self):
        now = timezone.now().astimezone(self.timezone)
        
        if now.weekday() >= 5: 
            return False
        

        open_time = time(9, 30)   
        close_time = time(16, 0) 
        
        current_time = now.time()
        return open_time <= current_time <= close_time
    
    def next_opening(self):
        now = timezone.now().astimezone(self.timezone)
        tomorrow = now + timezone.timedelta(days=1)
        
        if tomorrow.weekday() >= 5:
            days_to_monday = 7 - tomorrow.weekday()
            tomorrow += timezone.timedelta(days=days_to_monday)
        
        opening_time = datetime.combine(tomorrow.date(), time(9, 30))
        return self.timezone.localize(opening_time)
from celery import shared_task

@shared_task
def publish_event(event_name, payload):
    print(f"Event published: {event_name} - {payload}")
    return True

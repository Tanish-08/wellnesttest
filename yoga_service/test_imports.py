try:
    from main import app
    print("Yoga service imports successful")
except Exception as e:
    import traceback
    traceback.print_exc()

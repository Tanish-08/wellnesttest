try:
    from main import app
    print("Backend imports successful")
except Exception as e:
    import traceback
    traceback.print_exc()

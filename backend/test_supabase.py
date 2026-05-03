from db.supabase import supabase
try:
    db = supabase()
    res = db.table("users").select("count", count="exact").limit(1).execute()
    print("Supabase connection successful")
    print(f"User count: {res.count}")
except Exception as e:
    print(f"Supabase connection failed: {e}")

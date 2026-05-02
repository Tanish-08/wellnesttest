from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv()

_client: Client | None = None


def get_supabase() -> Client:
    global _client
    if _client is None:
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_KEY")
        if not url or not key:
            raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env")
        
        # Only use the bypass hack if the key is an opaque key (not a JWT)
        if key.startswith("sb_"):
            dummy_jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
            _client = create_client(url, dummy_jwt)
            
            # Overwrite with the real key
            _client.supabase_key = key
            _client.options.headers["apikey"] = key
            _client.options.headers["Authorization"] = f"Bearer {key}"
        else:
            _client = create_client(url, key)
        
    return _client


# Convenience alias — routers import this
supabase = get_supabase

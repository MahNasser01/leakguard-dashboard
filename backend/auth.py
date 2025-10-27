import os
import jwt
import requests
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from dotenv import load_dotenv
from functools import lru_cache

load_dotenv()

# allow missing credentials to be handled in our verify_token (so we can bypass in dev)
security = HTTPBearer(auto_error=False)

CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")
CLERK_JWKS_URL = "https://touched-raptor-54.clerk.accounts.dev/.well-known/jwks.json"

@lru_cache(maxsize=1)
def get_jwks():
    """Fetch and cache Clerk's JWKS"""
    response = requests.get(CLERK_JWKS_URL)
    return response.json()

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Verify Clerk JWT token.

    If DISABLE_AUTH=true in the environment, this will return a dummy payload to allow
    local development without Clerk tokens. When auto_error=False is set on the
    HTTPBearer, `credentials` may be None if no Authorization header is provided.
    """
    # Development bypass
    if os.getenv("DISABLE_AUTH", "false").lower() == "true":
        return {"sub": "dev"}

    try:
        if credentials is None:
            # No credentials provided
            raise HTTPException(status_code=401, detail="Not authenticated")
        token = credentials.credentials
        
        # Decode without verification first to get the kid
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")
        
        # Get JWKS and find the matching key
        jwks = get_jwks()
        key = None
        for jwk_key in jwks.get("keys", []):
            if jwk_key.get("kid") == kid:
                key = jwt.algorithms.RSAAlgorithm.from_jwk(jwk_key)
                break
        
        if not key:
            raise HTTPException(status_code=401, detail="Invalid token: key not found")
        
        # Verify and decode the token
        payload = jwt.decode(
            token,
            key=key,
            algorithms=["RS256"],
            options={"verify_aud": False}  # Clerk doesn't use standard aud claim
        )
        
        return payload
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")

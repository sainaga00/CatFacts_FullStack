from __future__ import annotations

import logging
import time
from typing import Final, Optional

import requests
from requests.exceptions import RequestException, Timeout

from db import insert_fact, init_db, session_scope  

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
API_URL: Final[str] = "https://catfact.ninja/fact"
FACTS_TO_FETCH: Final[int] = 5
RETRY_LIMIT: Final[int] = 3
RETRY_DELAY: Final[int] = 2  # seconds
REQUEST_TIMEOUT: Final[int] = 5  # seconds

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)


# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------
def fetch_cat_fact(retries: int = RETRY_LIMIT) -> Optional[str]:
    """Fetch a single cat fact from the API, retrying on transient errors."""
    for attempt in range(1, retries + 1):
        try:
            resp = requests.get(API_URL, timeout=REQUEST_TIMEOUT)
            resp.raise_for_status()
            fact = resp.json().get("fact", "").strip()
            if fact:
                return fact
            logging.warning("Empty fact received – retrying...")
        except (RequestException, Timeout) as exc:
            logging.warning("Attempt %d failed: %s", attempt, exc)
        time.sleep(RETRY_DELAY)
    logging.error("Failed to fetch fact after %d retries.", retries)
    return None


# ---------------------------------------------------------------------------
# Main workflow
# ---------------------------------------------------------------------------
def main() -> None:
    # Ensure the database schema exists
    init_db()

    facts_fetched = 0
    attempts = 0

    with session_scope() as db:
        while facts_fetched < FACTS_TO_FETCH and attempts < FACTS_TO_FETCH * 2:
            fact = fetch_cat_fact()
            attempts += 1

            if not fact:
                continue  # Skip failed fetches

            try:
                new_id = insert_fact(db, fact)
            except ValueError as err:  # length validation from db.insert_fact
                logging.warning("Invalid fact skipped (%s): %s", err, fact)
                continue

            if new_id is None:
                logging.info("Skipped duplicate: %s", fact)
            else:
                logging.info("Inserted (id=%s): %s", new_id, fact)
                facts_fetched += 1

    if facts_fetched < FACTS_TO_FETCH:
        logging.warning(
            "Fetched only %d unique facts out of requested %d",
            facts_fetched,
            FACTS_TO_FETCH,
        )
    else:
        logging.info("Successfully fetched %d unique cat facts!", FACTS_TO_FETCH)


if __name__ == "__main__":
    main()

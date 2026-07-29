"""Day 4: session id is stable per process; call_order increments and resets."""

from __future__ import annotations

import threading

from chainopt.session import get_session_id, next_call_order, reset_session


def test_get_session_id_is_stable_until_reset():
    reset_session("stable-session")
    assert get_session_id() == "stable-session"
    assert get_session_id() == "stable-session"


def test_reset_session_creates_new_id_and_clears_order():
    reset_session("first")
    assert next_call_order() == 1
    assert next_call_order() == 2

    new_id = reset_session()
    assert new_id != "first"
    assert get_session_id() == new_id
    assert next_call_order() == 1


def test_next_call_order_increments_monotonically():
    reset_session("order-test")
    assert [next_call_order() for _ in range(5)] == [1, 2, 3, 4, 5]


def test_call_order_is_thread_safe():
    reset_session("threaded")
    results: list[int] = []
    lock = threading.Lock()

    def worker():
        value = next_call_order()
        with lock:
            results.append(value)

    threads = [threading.Thread(target=worker) for _ in range(50)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()

    assert sorted(results) == list(range(1, 51))
    assert len(set(results)) == 50

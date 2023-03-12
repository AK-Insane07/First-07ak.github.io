from _typeshed import Incomplete

def in_transaction(): ...
def transaction(
    callback, retries=..., read_only: bool = ..., join: bool = ..., xg: bool = ..., propagation: Incomplete | None = ...
): ...
def transaction_async(
    callback, retries=..., read_only: bool = ..., join: bool = ..., xg: bool = ..., propagation: Incomplete | None = ...
): ...
def transaction_async_(
    callback, retries=..., read_only: bool = ..., join: bool = ..., xg: bool = ..., propagation: Incomplete | None = ...
): ...
def transactional(retries=..., read_only: bool = ..., join: bool = ..., xg: bool = ..., propagation: Incomplete | None = ...): ...
def transactional_async(
    retries=..., read_only: bool = ..., join: bool = ..., xg: bool = ..., propagation: Incomplete | None = ...
): ...
def transactional_tasklet(
    retries=..., read_only: bool = ..., join: bool = ..., xg: bool = ..., propagation: Incomplete | None = ...
): ...
def non_transactional(allow_existing: bool = ...): ...
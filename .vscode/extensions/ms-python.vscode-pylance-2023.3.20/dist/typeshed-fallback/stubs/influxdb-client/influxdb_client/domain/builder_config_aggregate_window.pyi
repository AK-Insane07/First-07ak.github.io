from _typeshed import Incomplete

class BuilderConfigAggregateWindow:
    openapi_types: Incomplete
    attribute_map: Incomplete
    discriminator: Incomplete
    def __init__(self, period: Incomplete | None = ..., fill_values: Incomplete | None = ...) -> None: ...
    @property
    def period(self): ...
    @period.setter
    def period(self, period) -> None: ...
    @property
    def fill_values(self): ...
    @fill_values.setter
    def fill_values(self, fill_values) -> None: ...
    def to_dict(self): ...
    def to_str(self): ...
    def __eq__(self, other): ...
    def __ne__(self, other): ...

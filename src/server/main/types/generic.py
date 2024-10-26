import uuid
import strawberry
from typing import NewType, Any, Optional


GenericScalar = strawberry.scalar(
    NewType("GenericScalar", Any),
    description="The GenericScalar scalar type represents a generic GraphQL scalar value that could be: List or Object."
)


@strawberry.type
class GenericBlock:
    """
    Generic block representation
    """
    id: uuid.UUID
    value: Optional[GenericScalar]


GenericStreamFieldType = strawberry.scalar(
    NewType("GenericStreamFieldType", Any),
    description="",
    serialize=lambda v: v.raw_data,
    parse_value=lambda v: v,
)

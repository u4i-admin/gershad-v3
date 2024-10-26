import strawberry
from strawberry.scalars import JSON

from typing import NewType


def serialize(value):
    return (
        {
            'name': value.name,
            'slug': value.slug
        }
    )


FlatTags = strawberry.scalar(
    NewType("FlatTags", JSON),
    description="",
    serialize=lambda v: serialize(v),
    parse_value=lambda v: v,
)
